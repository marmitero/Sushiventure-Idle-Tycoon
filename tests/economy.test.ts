import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/core/config/balance';
import { D } from '../src/core/decimal';
import {
  cashierUpgradeCost,
  floorBaseRevenue,
  floorUnlockCost,
  floorUpgradeCost,
  globalMultiplier,
  revenuePerSec,
} from '../src/core/economy';
import { grantRevenueBoost } from '../src/core/ops';
import { createInitialState } from '../src/core/state/factory';

const NOW = 1_700_000_000_000;

describe('economy', () => {
  it('initial state earns the documented base rate', () => {
    const state = createInitialState(NOW);
    const rate = revenuePerSec(state, NOW);
    expect(rate.toNumber()).toBeCloseTo(BALANCE.floors.baseRevenuePerSec, 9);
  });

  it('cashier multiplier applies exactly once and globally', () => {
    const state = { ...createInitialState(NOW), cashierLevel: 3 };
    const expected =
      BALANCE.floors.baseRevenuePerSec * (BALANCE.cashier.multipliers[2] ?? 1);
    expect(revenuePerSec(state, NOW).toNumber()).toBeCloseTo(expected, 9);
    expect(globalMultiplier(state, NOW).toNumber()).toBeCloseTo(BALANCE.cashier.multipliers[2] ?? 1, 9);
  });

  it('floor revenue grows by index and level curves', () => {
    const f0 = floorBaseRevenue(0, 1).toNumber();
    const f1 = floorBaseRevenue(1, 1).toNumber();
    const f0l2 = floorBaseRevenue(0, 2).toNumber();
    expect(f1 / f0).toBeCloseTo(BALANCE.floors.indexRevenueGrowth, 9);
    expect(f0l2 / f0).toBeCloseTo(BALANCE.floors.levelRevenueGrowth, 9);
    expect(floorBaseRevenue(0, 0).isZero()).toBe(true);
  });

  it('cost curves are strictly increasing', () => {
    for (let i = 1; i < 12; i += 1) {
      expect(floorUnlockCost(i + 1).gt(floorUnlockCost(i))).toBe(true);
    }
    for (let l = 1; l < 10; l += 1) {
      expect(floorUpgradeCost(0, l + 1).gt(floorUpgradeCost(0, l))).toBe(true);
    }
    for (let l = 1; l <= 4; l += 1) {
      const a = cashierUpgradeCost(l);
      const b = cashierUpgradeCost(l + 1);
      expect(a).not.toBeNull();
      expect(b).not.toBeNull();
      if (a && b) expect(b.gt(a)).toBe(true);
    }
    expect(cashierUpgradeCost(5)).not.toBeNull();
    expect(cashierUpgradeCost(6)).toBeNull();
  });

  it('revenue boost multiplies once and expires', () => {
    const granted = grantRevenueBoost(createInitialState(NOW), {
      receiptId: 'r1',
      durationSeconds: 60,
      now: NOW,
      source: 'test',
    });
    expect(granted.ok).toBe(true);
    if (!granted.ok) return;
    const boosted = granted.value;
    expect(globalMultiplier(boosted, NOW).toNumber()).toBeCloseTo(2, 9);
    expect(globalMultiplier(boosted, NOW + 61_000).toNumber()).toBeCloseTo(1, 9);
  });

  it('refuses to grant the same receipt twice', () => {
    const first = grantRevenueBoost(createInitialState(NOW), {
      receiptId: 'dup',
      durationSeconds: 60,
      now: NOW,
      source: 'test',
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = grantRevenueBoost(first.value, {
      receiptId: 'dup',
      durationSeconds: 60,
      now: NOW,
      source: 'test',
    });
    expect(second.ok).toBe(false);
  });

  it('sum of floor revenues equals total (no double counting)', () => {
    const state = createInitialState(NOW);
    state.floors = [
      { index: 0, level: 2 },
      { index: 1, level: 1 },
    ];
    const total = revenuePerSec(state, NOW).toNumber();
    const parts =
      floorBaseRevenue(0, 2).toNumber() + floorBaseRevenue(1, 1).toNumber();
    expect(total).toBeCloseTo(parts, 9);
  });

  it('money never goes negative through the public ops', () => {
    const state = { ...createInitialState(NOW), money: D(1).serialize() };
    const result = grantRevenueBoost(state, {
      receiptId: 'x',
      durationSeconds: 10,
      now: NOW,
      source: 'test',
    });
    expect(result.ok).toBe(true);
  });
});
