import { Decimal } from '../core/decimal';
import { moneyOf, revenuePerSec } from '../core/economy';
import { computeOffline, type OfflineQuote } from '../core/offline';
import * as ops from '../core/ops';
import type { GameState, Result, StaffId } from '../core/state/types';
import type { SaveManager } from '../persistence/saveManager';
import type { AnalyticsProvider, RewardedAdProvider } from '../services/contracts';

export type SessionListener = (state: GameState, cause: string) => void;

export interface SessionServices {
  ads: RewardedAdProvider;
  analytics: AnalyticsProvider;
}

/**
 * GameSession — the single mutable owner of GameState at runtime.
 * Scenes read from it and request operations through it; every operation is
 * atomic (core/ops) and marks the save dirty.
 */
export class GameSession {
  private listeners = new Set<SessionListener>();
  state: GameState;
  /** Last failed operation reason, for UI feedback. */
  lastError: string | null = null;

  constructor(
    private readonly save: SaveManager,
    initial: GameState,
    readonly services: SessionServices,
  ) {
    this.state = initial;
    this.save.adopt(initial);
  }

  now(): number {
    return Date.now();
  }

  subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(cause: string): void {
    for (const listener of this.listeners) listener(this.state, cause);
  }

  get money() {
    return moneyOf(this.state);
  }

  get rate() {
    return revenuePerSec(this.state, this.now());
  }

  /** Live economy advance (called by TowerScene every frame). */
  advance(dtSeconds: number): void {
    this.state = ops.tick(this.state, dtSeconds, this.now());
    this.save.adopt(this.state);
  }

  private apply(result: Result<GameState>, cause: string): boolean {
    if (!result.ok) {
      this.lastError = result.reason;
      this.emit('error');
      return false;
    }
    this.state = result.value;
    this.save.adopt(this.state);
    this.services.analytics.track(cause);
    this.emit(cause);
    return true;
  }

  unlockFloor(index: number): boolean {
    return this.apply(ops.unlockFloor(this.state, index), 'floor_unlocked');
  }

  upgradeFloor(index: number): boolean {
    return this.apply(ops.upgradeFloor(this.state, index), 'floor_upgraded');
  }

  upgradeCashier(): boolean {
    return this.apply(ops.upgradeCashier(this.state), 'cashier_upgraded');
  }

  hireStaff(id: StaffId): boolean {
    return this.apply(ops.hireStaff(this.state, id), 'staff_hired');
  }

  upgradeStaff(id: StaffId): boolean {
    return this.apply(ops.upgradeStaff(this.state, id), 'staff_upgraded');
  }

  setSettings(patch: Partial<GameState['settings']>): void {
    this.state = { ...this.state, settings: { ...this.state.settings, ...patch } };
    this.save.adopt(this.state);
    this.emit('settings');
  }

  /**
   * Rewarded-ad flow (constitution 15.2): the boost is granted ONLY after the
   * provider reports a completed view, and never twice for the same receipt.
   */
  async claimDoubleRevenueAd(durationSeconds = 1800): Promise<{ ok: boolean; message: string }> {
    const result = await this.services.ads.showRewarded('double_revenue_30min');
    if (result.status === 'unavailable') return { ok: false, message: result.reason };
    if (result.status === 'cancelled') return { ok: false, message: 'Anúncio fechado antes do final.' };
    if (result.status === 'error') return { ok: false, message: result.reason };
    const grant = ops.grantRevenueBoost(this.state, {
      receiptId: result.receiptId,
      durationSeconds,
      now: this.now(),
      source: this.services.ads.id,
    });
    if (!grant.ok) return { ok: false, message: grant.reason };
    this.state = grant.value;
    this.save.adopt(this.state);
    this.services.analytics.track('boost_granted', { source: this.services.ads.id });
    this.emit('boost_granted');
    return { ok: true, message: 'Lucro em dobro por 30 minutos!' };
  }

  activeRevenueBoost(): GameState['boosts'][number] | null {
    const now = this.now();
    return (
      this.state.boosts.find(
        (b) => b.kind === 'revenue_x2' && b.startedAt <= now && b.startedAt + b.durationSeconds * 1000 > now,
      ) ?? null
    );
  }

  // ------------------------------------------------------------ offline gains
  /** Computed once per load; never applied until the player collects. */
  pendingOffline: OfflineQuote | null = null;
  private pendingDoubleReceipt: string | null = null;

  evaluatePendingOffline(now: number): OfflineQuote | null {
    if (this.pendingOffline) return this.pendingOffline;
    const quote = computeOffline(this.state, now);
    if (quote.eligible && !this.state.consumedReceipts.includes(quote.receiptId)) {
      this.pendingOffline = quote;
    }
    return this.pendingOffline;
  }

  /** Dev/prod-safe: asks the provider first; only a completed view doubles. */
  async requestOfflineDouble(): Promise<{ ok: boolean; message: string }> {
    if (!this.pendingOffline) return { ok: false, message: 'Nada pendente para dobrar.' };
    const result = await this.services.ads.showRewarded('offline_double');
    if (result.status === 'unavailable') return { ok: false, message: result.reason };
    if (result.status === 'cancelled') return { ok: false, message: 'Anúncio fechado antes do final.' };
    if (result.status === 'error') return { ok: false, message: result.reason };
    if (this.state.consumedReceipts.includes(result.receiptId)) {
      return { ok: false, message: 'Recompensa já utilizada.' };
    }
    this.pendingDoubleReceipt = result.receiptId;
    this.services.analytics.track('offline_double_reserved', { source: this.services.ads.id });
    return { ok: true, message: 'Recompensa ×2 reservada: colete para aplicar.' };
  }

  get offlineDoubleReserved(): boolean {
    return this.pendingDoubleReceipt != null;
  }

  collectOffline(): { ok: boolean; message: string; gain: Decimal } {
    const quote = this.pendingOffline;
    if (!quote) return { ok: false, message: 'Nada para coletar.', gain: Decimal.ZERO };
    const doubled = this.pendingDoubleReceipt != null;
    const gain = doubled ? quote.gain.mulNumber(2) : quote.gain;
    const result = ops.applyOfflineGain(this.state, {
      gain,
      now: this.now(),
      receiptId: quote.receiptId,
    });
    if (!result.ok) return { ok: false, message: result.reason, gain: Decimal.ZERO };
    let next = result.value;
    if (doubled && this.pendingDoubleReceipt) {
      next = {
        ...next,
        consumedReceipts: [...next.consumedReceipts, this.pendingDoubleReceipt].slice(-200),
      };
    }
    this.state = next;
    this.save.adopt(this.state);
    this.pendingOffline = null;
    this.pendingDoubleReceipt = null;
    this.services.analytics.track('offline_collected', { doubled });
    this.emit('offline_collected');
    return { ok: true, message: doubled ? 'Ganhos offline dobrados!' : 'Ganhos offline coletados.', gain };
  }

  async flush(force = false): Promise<boolean> {
    return this.save.flush(this.now(), force);
  }
}

let current: GameSession | null = null;

export function setSession(session: GameSession): void {
  current = session;
}

export function getSession(): GameSession {
  if (!current) throw new Error('GameSession accessed before bootstrap');
  return current;
}
