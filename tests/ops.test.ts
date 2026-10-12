import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/core/config/balance';
import { D, Decimal } from '../src/core/decimal';
import { floorUnlockCost, floorUpgradeCost, moneyOf, revenuePerSec } from '../src/core/economy';
import { repeatWhileAffordable, tick, unlockFloor, upgradeCashier, upgradeFloor } from '../src/core/ops';
import { createInitialState } from '../src/core/state/factory';

const NOW = 1_700_000_000_000;

describe('atomic operations', () => {
  it('unlockFloor debits cost and adds the floor atomically', () => {
    const base = createInitialState(NOW);
    const cost = floorUnlockCost(1);
    const state = { ...base, money: cost.add(D(5)).serialize() };
    const result = unlockFloor(state, 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.floors).toHaveLength(2);
    expect(moneyOf(result.value).toNumber()).toBeCloseTo(5, 6);
    expect(result.value.stats.floorsUnlocked).toBe(1);
  });

  it('unlockFloor refuses without funds and changes nothing', () => {
    const state = createInitialState(NOW);
    const before = JSON.stringify(state);
    const result = unlockFloor(state, 1);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(state)).toBe(before);
  });

  it('unlockFloor enforces order and tower limit', () => {
    const state = createInitialState(NOW);
    expect(unlockFloor(state, 5).ok).toBe(false);
    const tall = { ...state, floors: Array.from({ length: BALANCE.floors.maxFloors }, (_, i) => ({ index: i, level: 1 })) };
    expect(unlockFloor(tall, BALANCE.floors.maxFloors).ok).toBe(false);
  });

  it('upgradeFloor raises level and revenue', () => {
    const state = { ...createInitialState(NOW), money: D(1e6).serialize() };
    const before = revenuePerSec(state, NOW).toNumber();
    const result = upgradeFloor(state, 0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.floors[0]?.level).toBe(2);
    expect(revenuePerSec(result.value, NOW).toNumber()).toBeGreaterThan(before);
  });

  it('upgradeFloor respects the visual level cap', () => {
    const state = {
      ...createInitialState(NOW),
      money: D(1e30).serialize(),
      floors: [{ index: 0, level: BALANCE.floors.maxVisualLevel }],
    };
    expect(upgradeFloor(state, 0).ok).toBe(false);
  });

  it('upgradeCashier walks the level table then stops', () => {
    let state = { ...createInitialState(NOW), money: D(1e9).serialize() };
    for (let level = 2; level <= BALANCE.cashier.multipliers.length; level += 1) {
      const result = upgradeCashier(state);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      state = result.value;
      expect(state.cashierLevel).toBe(level);
    }
    expect(upgradeCashier(state).ok).toBe(false);
  });

  it('tick accrues revenue proportional to elapsed time', () => {
    const state = createInitialState(NOW);
    const rate = revenuePerSec(state, NOW).toNumber();
    const after = tick(state, 10, NOW + 10_000);
    expect(moneyOf(after).toNumber()).toBeCloseTo(BALANCE.startMoney + rate * 10, 6);
  });

  it('tick clamps pathological deltas (background tab / clock jumps)', () => {
    const state = createInitialState(NOW);
    const rate = revenuePerSec(state, NOW).toNumber();
    const after = tick(state, 10_000, NOW + 10_000_000);
    const gained = moneyOf(after).toNumber() - BALANCE.startMoney;
    expect(gained).toBeCloseTo(rate * BALANCE.maxTickSeconds, 6);
  });

  it('repeatWhileAffordable never overdraws', () => {
    const state = { ...createInitialState(NOW), money: D(500).serialize() };
    const { state: after, reps } = repeatWhileAffordable(state, (s) => upgradeFloor(s, 0));
    expect(reps).toBeGreaterThan(0);
    expect(moneyOf(after).gte(Decimal.ZERO)).toBe(true);
    // one more purchase must fail
    expect(upgradeFloor(after, 0).ok).toBe(false);
  });

  it('floor upgrade cost matches the configured curve', () => {
    const expected = BALANCE.floors.upgradeBaseCost * BALANCE.floors.upgradeCostGrowthPerLevel ** 1;
    expect(floorUpgradeCost(0, 1).toNumber()).toBeCloseTo(expected, 9);
  });
});
