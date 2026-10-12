import { BALANCE } from './config/balance';
import { Decimal, D } from './decimal';
import { floorBaseRevenue, staffMultipliers } from './economy';
import type { GameState } from './state/types';

/**
 * Offline progress (docs/GAME_DESIGN/OFFLINE_PROGRESS.md).
 *
 *   offlineGain = OfflineRatePerSec × offlineRate × min(elapsed, cap)
 *
 * - `OfflineRatePerSec` uses the production layers (scopes, kitchen, delivery,
 *   cashier and future global layers) but NEVER the online boost layer:
 *   boosts are an online-only reward (documented decision).
 * - No per-second simulation: closed-form over elapsed time (constitution 8.6).
 * - Eligibility floor (`minSeconds`) prevents reload-farming.
 */

export interface OfflineQuote {
  eligible: boolean;
  /** Real absence in seconds (>= 0; clock going backwards yields 0). */
  elapsedSeconds: number;
  /** Seconds actually paid (after cap). */
  countedSeconds: number;
  capped: boolean;
  ratePerSec: Decimal;
  gain: Decimal;
  /** Idempotency key of this absence window (unique per lastSeenAt). */
  receiptId: string;
}

/** Revenue per second used for offline gains (boost layer excluded). */
export function offlineRatePerSec(state: GameState): Decimal {
  const staff = staffMultipliers(state);
  let sum = Decimal.ZERO;
  for (const floor of state.floors) {
    const scope = floor.index === 0 ? staff.ground : staff.upper;
    sum = sum.add(floorBaseRevenue(floor.index, floor.level).mul(scope));
  }
  const cashierIdx = Math.min(state.cashierLevel, BALANCE.cashier.multipliers.length) - 1;
  const cashier = D(BALANCE.cashier.multipliers[cashierIdx] ?? 1);
  // recipes/reputation/events/prestige plug in here in later phases
  return sum.mul(staff.kitchen).mul(staff.delivery).mul(cashier);
}

export function offlineCapSeconds(state: GameState): number {
  // prestige upgrades will extend this (Phase 6); base cap for now
  void state;
  return BALANCE.offline.baseCapSeconds;
}

export function computeOffline(state: GameState, now: number): OfflineQuote {
  const elapsedSeconds = Math.max(0, (now - state.lastSeenAt) / 1000);
  const receiptId = `offline-${state.lastSeenAt}`;
  if (elapsedSeconds < BALANCE.offline.minSeconds) {
    return {
      eligible: false,
      elapsedSeconds,
      countedSeconds: 0,
      capped: false,
      ratePerSec: offlineRatePerSec(state),
      gain: Decimal.ZERO,
      receiptId,
    };
  }
  const cap = offlineCapSeconds(state);
  const countedSeconds = Math.min(elapsedSeconds, cap);
  const ratePerSec = offlineRatePerSec(state);
  const gain = ratePerSec.mulNumber(BALANCE.offline.rate).mulNumber(countedSeconds);
  return {
    eligible: true,
    elapsedSeconds,
    countedSeconds,
    capped: elapsedSeconds > cap,
    ratePerSec,
    gain,
    receiptId,
  };
}
