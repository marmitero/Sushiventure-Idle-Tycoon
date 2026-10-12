import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/core/config/balance';
import { D, Decimal } from '../src/core/decimal';
import { offlineRatePerSec, computeOffline } from '../src/core/offline';
import { applyOfflineGain, grantRevenueBoost } from '../src/core/ops';
import { createInitialState } from '../src/core/state/factory';
import { GameSession } from '../src/game/session';
import { SaveManager } from '../src/persistence/saveManager';
import { MemorySaveRepository } from '../src/persistence/saveRepository';
import { NoopAnalyticsProvider, NotConfiguredRewardedAdProvider } from '../src/services/devAdapters';

const NOW = 1_700_000_000_000;

describe('offline quote', () => {
  it('refuses absences below the eligibility floor', () => {
    const state = { ...createInitialState(NOW), lastSeenAt: NOW - 10_000 };
    const quote = computeOffline(state, NOW);
    expect(quote.eligible).toBe(false);
    expect(quote.gain.isZero()).toBe(true);
  });

  it('pays rate × offlineRate × elapsed', () => {
    const state = { ...createInitialState(NOW), lastSeenAt: NOW - 600_000 }; // 10 min
    const quote = computeOffline(state, NOW);
    expect(quote.eligible).toBe(true);
    expect(quote.countedSeconds).toBe(600);
    const expected = offlineRatePerSec(state)
      .mulNumber(BALANCE.offline.rate)
      .mulNumber(600)
      .toNumber();
    expect(quote.gain.toNumber()).toBeCloseTo(expected, 6);
  });

  it('caps long absences at the configured limit', () => {
    const state = { ...createInitialState(NOW), lastSeenAt: NOW - 10 * 3600_000 };
    const quote = computeOffline(state, NOW);
    expect(quote.capped).toBe(true);
    expect(quote.countedSeconds).toBe(BALANCE.offline.baseCapSeconds);
  });

  it('clock going backwards yields zero', () => {
    const state = { ...createInitialState(NOW), lastSeenAt: NOW + 3600_000 };
    const quote = computeOffline(state, NOW);
    expect(quote.elapsedSeconds).toBe(0);
    expect(quote.eligible).toBe(false);
  });

  it('online boosts do NOT inflate offline gains', () => {
    const plain = { ...createInitialState(NOW), lastSeenAt: NOW - 3600_000 };
    const boosted = grantRevenueBoost(plain, {
      receiptId: 'b1',
      durationSeconds: 7200,
      now: NOW - 3600_000,
      source: 'test',
    });
    expect(boosted.ok).toBe(true);
    if (!boosted.ok) return;
    // boost still active during the absence window, but offline ignores it
    expect(offlineRatePerSec(boosted.value).toNumber()).toBeCloseTo(offlineRatePerSec(plain).toNumber(), 9);
  });
});

describe('offline grant integrity', () => {
  it('applies once per absence window (receipt idempotency)', () => {
    const state = createInitialState(NOW);
    const quote = computeOffline({ ...state, lastSeenAt: NOW - 3600_000 }, NOW);
    const first = applyOfflineGain(state, { gain: quote.gain, now: NOW, receiptId: quote.receiptId });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.value.lastSeenAt).toBe(NOW);
    const second = applyOfflineGain(first.value, {
      gain: quote.gain,
      now: NOW,
      receiptId: quote.receiptId,
    });
    expect(second.ok).toBe(false);
  });

  it('rejects negative gains', () => {
    const state = createInitialState(NOW);
    expect(
      applyOfflineGain(state, { gain: D(-5), now: NOW, receiptId: 'x' }).ok,
    ).toBe(false);
  });

  it('session flow: collect pays once, reload cannot pay again', async () => {
    const repo = new MemorySaveRepository();
    const manager = new SaveManager(repo, 0);
    await manager.load(NOW);
    const base = manager.currentState;
    expect(base).not.toBeNull();
    if (!base) return;
    const away = { ...base, lastSeenAt: NOW - 3600_000 };
    const session = new GameSession(manager, away, {
      ads: new NotConfiguredRewardedAdProvider(),
      analytics: new NoopAnalyticsProvider(),
    });
    const quote = session.evaluatePendingOffline(NOW);
    expect(quote).not.toBeNull();
    if (!quote) return;

    // no provider configured: double must be refused, not faked
    const double = await session.requestOfflineDouble();
    expect(double.ok).toBe(false);
    expect(session.offlineDoubleReserved).toBe(false);

    const before = Decimal.deserialize(session.state.money);
    const collected = session.collectOffline();
    expect(collected.ok).toBe(true);
    const after = Decimal.deserialize(session.state.money);
    expect(after.sub(before).toNumber()).toBeCloseTo(quote.gain.toNumber(), 6);

    // second collect in same session: nothing pending
    expect(session.collectOffline().ok).toBe(false);

    // reload: receipt consumed + lastSeenAt stamped → no second payment
    await manager.flush(NOW, true);
    const manager2 = new SaveManager(repo, 0);
    const report = await manager2.load(NOW);
    expect(report.result.status).toBe('loaded');
    const session2 = new GameSession(manager2, report.result.state, {
      ads: new NotConfiguredRewardedAdProvider(),
      analytics: new NoopAnalyticsProvider(),
    });
    const again = session2.evaluatePendingOffline(NOW);
    expect(again).toBeNull();
  });
});
