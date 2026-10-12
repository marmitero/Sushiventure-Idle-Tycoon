import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/core/config/balance';
import { D } from '../src/core/decimal';
import {
  elevatorTripMs,
  moneyOf,
  revenuePerSec,
  staffHireCost,
  staffMultiplierValue,
  staffUpgradeCost,
  vehicleIntervalSec,
} from '../src/core/economy';
import { hireStaff, upgradeStaff } from '../src/core/ops';
import { createInitialState } from '../src/core/state/factory';
import type { GameState, StaffId } from '../src/core/state/types';
import { STAFF_IDS } from '../src/core/state/types';

const NOW = 1_700_000_000_000;

const withMoney = (state: GameState, money: number): GameState => ({
  ...state,
  money: D(money).serialize(),
});

const withFloors = (state: GameState, floors: GameState['floors']): GameState => ({
  ...state,
  floors,
});

describe('staff economy', () => {
  it('each role multiplies a distinct scope (no double-dip)', () => {
    const base = withFloors(createInitialState(NOW), [
      { index: 0, level: 1 },
      { index: 1, level: 1 },
    ]);
    const baseRate = revenuePerSec(base, NOW).toNumber();

    const attendant = { ...base, staff: { ...base.staff, attendant: { level: 4 } } };
    const chef = { ...base, staff: { ...base.staff, chef: { level: 4 } } };
    const floorGirl = { ...base, staff: { ...base.staff, floorGirl: { level: 4 } } };
    const lift = { ...base, staff: { ...base.staff, liftGuy: { level: 4 } } };

    const g = staffMultiplierValue('attendant', 4);
    const k = staffMultiplierValue('chef', 4);
    const u = staffMultiplierValue('floorGirl', 4);
    const d = staffMultiplierValue('liftGuy', 4);

    const f0 = 0.6; // floor 0 base
    const f1 = 0.6 * BALANCE.floors.indexRevenueGrowth; // floor 1 base

    // attendant: only ground floor
    expect(revenuePerSec(attendant, NOW).toNumber()).toBeCloseTo((f0 * g + f1) * 1, 9);
    // chef: whole sum
    expect(revenuePerSec(chef, NOW).toNumber()).toBeCloseTo((f0 + f1) * k, 9);
    // floorGirl: only upper floors
    expect(revenuePerSec(floorGirl, NOW).toNumber()).toBeCloseTo(f0 + f1 * u, 9);
    // lift: global efficiency layer
    expect(revenuePerSec(lift, NOW).toNumber()).toBeCloseTo((f0 + f1) * d, 9);
    expect(baseRate).toBeCloseTo(f0 + f1, 9);
  });

  it('unhired staff contribute exactly ×1', () => {
    for (const id of STAFF_IDS) {
      expect(staffMultiplierValue(id, 0)).toBe(1);
    }
  });

  it('elevator and delivery pacing derive from lift level', () => {
    const base = createInitialState(NOW);
    const hired = { ...base, staff: { ...base.staff, liftGuy: { level: 5 } } };
    expect(elevatorTripMs(hired)).toBeLessThan(elevatorTripMs(base));
    expect(vehicleIntervalSec(hired)).toBeLessThan(vehicleIntervalSec(base));
    expect(elevatorTripMs(hired)).toBeGreaterThanOrEqual(BALANCE.elevator.minTripMs);
  });
});

describe('staff operations', () => {
  it('hire debits cost and sets level 1 atomically', () => {
    const state = withMoney(createInitialState(NOW), 10_000);
    const result = hireStaff(state, 'chef');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.staff.chef.level).toBe(1);
    expect(moneyOf(result.value).toNumber()).toBeCloseTo(10_000 - BALANCE.staff.chef.hireCost, 6);
  });

  it('hire without funds changes nothing', () => {
    const state = withMoney(createInitialState(NOW), 1);
    const before = JSON.stringify(state);
    expect(hireStaff(state, 'chef').ok).toBe(false);
    expect(JSON.stringify(state)).toBe(before);
  });

  it('double hire is refused', () => {
    const state = withMoney(createInitialState(NOW), 10_000);
    const hired = hireStaff(state, 'attendant');
    expect(hired.ok).toBe(true);
    if (!hired.ok) return;
    expect(hireStaff(hired.value, 'attendant').ok).toBe(false);
  });

  it('training requires hire, pays the curve and respects the cap', () => {
    let state = withMoney(createInitialState(NOW), 1e12);
    expect(upgradeStaff(state, 'attendant').ok).toBe(false); // not hired
    const hired = hireStaff(state, 'attendant');
    expect(hired.ok).toBe(true);
    if (!hired.ok) return;
    state = hired.value;
    const cost1 = staffUpgradeCost('attendant', 1);
    expect(cost1).not.toBeNull();
    const trained = upgradeStaff(state, 'attendant');
    expect(trained.ok).toBe(true);
    if (!trained.ok) return;
    expect(trained.value.staff.attendant.level).toBe(2);
    // cap
    const maxed: GameState = {
      ...state,
      staff: { ...state.staff, attendant: { level: BALANCE.staff.attendant.maxLevel } },
    };
    expect(staffUpgradeCost('attendant', BALANCE.staff.attendant.maxLevel)).toBeNull();
    expect(upgradeStaff(maxed, 'attendant').ok).toBe(false);
  });

  it('upgrade costs are strictly increasing per role', () => {
    for (const id of STAFF_IDS as StaffId[]) {
      const first = staffUpgradeCost(id, 1);
      expect(first).not.toBeNull();
      let prev = first;
      for (let level = 2; level < 7; level += 1) {
        const cost = staffUpgradeCost(id, level);
        expect(cost).not.toBeNull();
        if (cost && prev) {
          expect(cost.gt(prev)).toBe(true);
          prev = cost;
        }
      }
    }
  });

  it('unknown roles are rejected', () => {
    const state = createInitialState(NOW);
    expect(hireStaff(state, 'ghost' as StaffId).ok).toBe(false);
    expect(upgradeStaff(state, 'ghost' as StaffId).ok).toBe(false);
  });
});
