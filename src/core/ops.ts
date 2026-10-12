import { BALANCE } from './config/balance';
import { Decimal } from './decimal';
import {
  cashierUpgradeCost,
  floorUnlockCost,
  floorUpgradeCost,
  moneyOf,
  revenuePerSec,
  staffHireCost,
  staffUpgradeCost,
} from './economy';
import type { GameState, Result, StaffId } from './state/types';
import { STAFF_IDS, fail, ok } from './state/types';

/**
 * Atomic economy operations (constitution rules 7 & 8):
 * every operation validates prerequisites, debits the cost and applies the
 * effect in one step — or returns an error and changes nothing.
 * All functions are pure: they return a NEW state object.
 */

function withMoney(state: GameState, money: Decimal): GameState {
  return { ...state, money: money.max(Decimal.ZERO).clampNegativeDrift().serialize() };
}

function earn(state: GameState, amount: Decimal): GameState {
  if (amount.lte(Decimal.ZERO)) return state;
  return {
    ...state,
    money: moneyOf(state).add(amount).serialize(),
    lifetimeEarned: Decimal.deserialize(state.lifetimeEarned).add(amount).serialize(),
  };
}

/** Advances the economy by `seconds` (clamped) — used by the live loop. */
export function tick(state: GameState, seconds: number, now: number): GameState {
  const dt = Math.max(0, Math.min(seconds, BALANCE.maxTickSeconds));
  if (dt === 0) return state;
  const gained = revenuePerSec(state, now).mulNumber(dt);
  const next = earn(state, gained);
  return {
    ...next,
    lastSeenAt: now,
    stats: { ...next.stats, totalPlaySeconds: next.stats.totalPlaySeconds + dt },
  };
}

export function unlockFloor(state: GameState, index: number): Result<GameState> {
  if (index !== state.floors.length) {
    return fail(`Floors must be unlocked in order (expected ${state.floors.length}, got ${index})`);
  }
  if (index >= BALANCE.floors.maxFloors) return fail('Tower height limit reached');
  const cost = floorUnlockCost(index);
  const money = moneyOf(state);
  if (money.lt(cost)) return fail('Not enough money');
  const next = withMoney(state, money.sub(cost));
  next.floors = [...next.floors, { index, level: 1 }];
  next.stats = { ...next.stats, floorsUnlocked: next.stats.floorsUnlocked + 1 };
  return ok(next);
}

export function upgradeFloor(state: GameState, index: number): Result<GameState> {
  const floor = state.floors.find((f) => f.index === index);
  if (!floor) return fail('Floor not unlocked');
  if (floor.level >= BALANCE.floors.maxVisualLevel) return fail('Floor at maximum level');
  const cost = floorUpgradeCost(index, floor.level);
  const money = moneyOf(state);
  if (money.lt(cost)) return fail('Not enough money');
  const next = withMoney(state, money.sub(cost));
  next.floors = next.floors.map((f) => (f.index === index ? { ...f, level: f.level + 1 } : f));
  return ok(next);
}

export function upgradeCashier(state: GameState): Result<GameState> {
  const cost = cashierUpgradeCost(state.cashierLevel);
  if (cost == null) return fail('Cashier at maximum level');
  const money = moneyOf(state);
  if (money.lt(cost)) return fail('Not enough money');
  const next = withMoney(state, money.sub(cost));
  next.cashierLevel = state.cashierLevel + 1;
  next.stats = { ...next.stats, cashierUpgrades: next.stats.cashierUpgrades + 1 };
  return ok(next);
}

/** Hires a staff member (level 0 → 1): atomic debit + effect. */
export function hireStaff(state: GameState, id: StaffId): Result<GameState> {
  if (!STAFF_IDS.includes(id)) return fail('Unknown staff role');
  const current = state.staff[id]?.level ?? 0;
  if (current > 0) return fail('Staff already hired');
  const cost = staffHireCost(id);
  const money = moneyOf(state);
  if (money.lt(cost)) return fail('Not enough money');
  const next = withMoney(state, money.sub(cost));
  next.staff = { ...next.staff, [id]: { level: 1 } };
  return ok(next);
}

/** Trains a hired staff member (level → level+1, capped). */
export function upgradeStaff(state: GameState, id: StaffId): Result<GameState> {
  if (!STAFF_IDS.includes(id)) return fail('Unknown staff role');
  const current = state.staff[id]?.level ?? 0;
  if (current <= 0) return fail('Staff not hired yet');
  const cost = staffUpgradeCost(id, current);
  if (cost == null) return fail('Staff at maximum level');
  const money = moneyOf(state);
  if (money.lt(cost)) return fail('Not enough money');
  const next = withMoney(state, money.sub(cost));
  next.staff = { ...next.staff, [id]: { level: current + 1 } };
  return ok(next);
}

/**
 * Grants a timed revenue boost backed by a provider receipt.
 * Idempotent per receipt id: a replayed/crashed grant is refused (rule 8).
 */
export function grantRevenueBoost(
  state: GameState,
  params: { receiptId: string; durationSeconds: number; now: number; source: string },
): Result<GameState> {
  if (state.consumedReceipts.includes(params.receiptId)) {
    return fail('Reward already claimed for this receipt');
  }
  if (params.durationSeconds <= 0) return fail('Invalid boost duration');
  const boost: GameState['boosts'][number] = {
    id: `boost-${params.receiptId}`,
    kind: 'revenue_x2',
    startedAt: params.now,
    durationSeconds: params.durationSeconds,
    grantSource: params.source,
  };
  return ok({
    ...state,
    boosts: [...state.boosts.filter((b) => b.startedAt + b.durationSeconds * 1000 > params.now), boost],
    consumedReceipts: [...state.consumedReceipts, params.receiptId].slice(-200),
  });
}

/**
 * Buys the maximum affordable repetitions of an operation (the classic
 * "x1 / x10 / max" shop control) without ever overdrawing the wallet.
 */
export function repeatWhileAffordable(
  state: GameState,
  apply: (s: GameState) => Result<GameState>,
  maxReps = 1000,
): { state: GameState; reps: number } {
  let current = state;
  let reps = 0;
  while (reps < maxReps) {
    const result = apply(current);
    if (!result.ok) break;
    current = result.value;
    reps += 1;
  }
  return { state: current, reps };
}
