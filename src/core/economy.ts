import { BALANCE } from './config/balance';
import { Decimal, D } from './decimal';
import type { GameState } from './state/types';

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
    staff: D(1), // Phase 3
    recipes: D(1), // Phase 5
    reputation: D(1), // Phase 5
    events: D(1), // Phase 7
    prestige: D(1), // Phase 6
    boosts: boostMultiplier(state, now),
  };
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

export function floorRevenuePerSec(state: GameState, index: number, now: number): Decimal {
  const floor = state.floors.find((f) => f.index === index);
  if (!floor || floor.level <= 0) return Decimal.ZERO;
  return floorBaseRevenue(index, floor.level).mul(globalMultiplier(state, now));
}

export function revenuePerSec(state: GameState, now: number): Decimal {
  let sum = Decimal.ZERO;
  for (const floor of state.floors) {
    sum = sum.add(floorBaseRevenue(floor.index, floor.level));
  }
  return sum.mul(globalMultiplier(state, now));
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
