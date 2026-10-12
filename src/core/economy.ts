import { BALANCE } from './config/balance';
import { Decimal, D } from './decimal';
import type { GameState, StaffId } from './state/types';
import { STAFF_IDS } from './state/types';

/**
 * Pure economy layer. No visuals, no side effects, no persistence.
 *
 * Revenue model (docs/GAME_DESIGN/ECONOMY.md §3):
 *
 *   RevenuePerSec = GlobalMult × Σ_floors( FloorBase(index) × LevelMult(level) )
 *
 *   GlobalMult = CashierMult × StaffMult × RecipeMult × ReputationMult
 *                × EventMult × PrestigeMult × BoostMult
 *
 * Each multiplier layer is applied exactly once (constitution rule: the same
 * bonus must never be applied twice through different paths). Additive bonuses
 * compose *inside* their own layer (e.g. two staff bonuses sum into StaffMult).
 */

export interface MultiplierBreakdown {
  cashier: Decimal;
  staff: Decimal;
  recipes: Decimal;
  reputation: Decimal;
  events: Decimal;
  prestige: Decimal;
  boosts: Decimal;
}

export function moneyOf(state: GameState): Decimal {
  return Decimal.deserialize(state.money);
}

export function boostMultiplier(state: GameState, now: number): Decimal {
  let mult = 1;
  for (const boost of state.boosts) {
    const endsAt = boost.startedAt + boost.durationSeconds * 1000;
    if (boost.kind === 'revenue_x2' && now >= boost.startedAt && now < endsAt) mult *= 2;
  }
  return D(mult);
}

export function activeBoosts(state: GameState, now: number): GameState['boosts'] {
  return state.boosts.filter((b) => b.startedAt + b.durationSeconds * 1000 > now);
}

/** Phase 2 implements cashier + boosts; later layers plug in here. */
export function multiplierBreakdown(state: GameState, now: number): MultiplierBreakdown {
  const cashierIdx = Math.min(state.cashierLevel, BALANCE.cashier.multipliers.length) - 1;
  return {
    cashier: D(BALANCE.cashier.multipliers[cashierIdx] ?? 1),
    staff: D(1), // staff act per-scope (staffMultipliers), never globally
    recipes: D(1), // Phase 5
    reputation: D(1), // Phase 5
    events: D(1), // Phase 7
    prestige: D(1), // Phase 6
    boosts: boostMultiplier(state, now),
  };
}

/**
 * Staff multipliers, one per DISTINCT scope (ECONOMY.md §3):
 *  ground   → attendant, applies only to floor index 0
 *  upper    → floorGirl, applies only to floors index >= 1
 *  kitchen  → chef, applies to the whole floor sum
 *  delivery → liftGuy (elevator efficiency), global efficiency layer
 */
export interface StaffMultipliers {
  ground: Decimal;
  upper: Decimal;
  kitchen: Decimal;
  delivery: Decimal;
}

export function staffLevel(state: GameState, id: StaffId): number {
  return state.staff[id]?.level ?? 0;
}

export function staffMultiplierValue(id: StaffId, level: number): number {
  const cfg = BALANCE.staff[id];
  if (level <= 0) return 1;
  return 1 + cfg.perLevel * level;
}

export function staffMultipliers(state: GameState): StaffMultipliers {
  return {
    ground: D(staffMultiplierValue('attendant', staffLevel(state, 'attendant'))),
    upper: D(staffMultiplierValue('floorGirl', staffLevel(state, 'floorGirl'))),
    kitchen: D(staffMultiplierValue('chef', staffLevel(state, 'chef'))),
    delivery: D(staffMultiplierValue('liftGuy', staffLevel(state, 'liftGuy'))),
  };
}

/** Cost to hire (level 0 → 1). */
export function staffHireCost(id: StaffId): Decimal {
  return D(BALANCE.staff[id].hireCost);
}

/** Cost to train a hired staff member from `level` to `level + 1`. */
export function staffUpgradeCost(id: StaffId, level: number): Decimal | null {
  if (level <= 0) return null;
  const cfg = BALANCE.staff[id];
  if (level >= cfg.maxLevel) return null;
  return D(cfg.upgradeBase).mul(D(cfg.upgradeGrowth).powInt(level - 1));
}

export function globalMultiplier(state: GameState, now: number): Decimal {
  const b = multiplierBreakdown(state, now);
  return b.cashier.mul(b.staff).mul(b.recipes).mul(b.reputation).mul(b.events).mul(b.prestige).mul(b.boosts);
}

/** Revenue per second of one floor, before global multipliers. */
export function floorBaseRevenue(index: number, level: number): Decimal {
  if (level <= 0) return Decimal.ZERO;
  const base = D(BALANCE.floors.baseRevenuePerSec);
  const indexMult = D(BALANCE.floors.indexRevenueGrowth).powInt(index);
  const levelMult = D(BALANCE.floors.levelRevenueGrowth).powInt(level - 1);
  return base.mul(indexMult).mul(levelMult);
}

/** Scope multiplier of one floor (attendant on ground, floorGirl upstairs). */
function floorScopeMult(state: GameState, index: number, staff: StaffMultipliers): Decimal {
  return index === 0 ? staff.ground : staff.upper;
}

export function floorRevenuePerSec(state: GameState, index: number, now: number): Decimal {
  const floor = state.floors.find((f) => f.index === index);
  if (!floor || floor.level <= 0) return Decimal.ZERO;
  const staff = staffMultipliers(state);
  return floorBaseRevenue(index, floor.level)
    .mul(floorScopeMult(state, index, staff))
    .mul(staff.kitchen)
    .mul(staff.delivery)
    .mul(globalMultiplier(state, now));
}

export function revenuePerSec(state: GameState, now: number): Decimal {
  const staff = staffMultipliers(state);
  let sum = Decimal.ZERO;
  for (const floor of state.floors) {
    sum = sum.add(floorBaseRevenue(floor.index, floor.level).mul(floorScopeMult(state, floor.index, staff)));
  }
  return sum.mul(staff.kitchen).mul(staff.delivery).mul(globalMultiplier(state, now));
}

/** Elevator round-trip time in ms (visual + delivery pacing). */
export function elevatorTripMs(state: GameState): number {
  const level = Math.max(1, staffLevel(state, 'liftGuy'));
  const trip = BALANCE.elevator.baseTripMs / (1 + 0.1 * (level - 1));
  return Math.max(BALANCE.elevator.minTripMs, trip);
}

/** Seconds between delivery vehicles; shorter as delivery efficiency grows. */
export function vehicleIntervalSec(state: GameState): number {
  const delivery = staffMultiplierValue('liftGuy', staffLevel(state, 'liftGuy'));
  const interval = BALANCE.elevator.baseVehicleIntervalSec / delivery;
  return Math.min(
    BALANCE.elevator.maxVehicleIntervalSec,
    Math.max(BALANCE.elevator.minVehicleIntervalSec, interval),
  );
}

/** Cost to unlock tower position `index` (must equal current floor count). */
export function floorUnlockCost(index: number): Decimal {
  if (index <= 0) return Decimal.ZERO;
  return D(BALANCE.floors.unlockBaseCost).mul(D(BALANCE.floors.unlockCostGrowth).powInt(index - 1));
}

/** Cost to upgrade the floor at `index` from `level` to `level + 1`. */
export function floorUpgradeCost(index: number, level: number): Decimal {
  return D(BALANCE.floors.upgradeBaseCost)
    .mul(D(BALANCE.floors.upgradeCostGrowthPerLevel).powInt(level))
    .mul(D(BALANCE.floors.upgradeCostGrowthPerIndex).powInt(index));
}

export function cashierUpgradeCost(currentLevel: number): Decimal | null {
  const next = currentLevel + 1;
  if (next > BALANCE.cashier.multipliers.length) return null;
  return D(BALANCE.cashier.upgradeCosts[next - 1] ?? 0);
}

/** Visual level shown for a floor slot (kits provide Lv0..Lv10 art). */
export function floorVisualLevel(level: number): number {
  return Math.max(0, Math.min(BALANCE.floors.maxVisualLevel, level));
}
