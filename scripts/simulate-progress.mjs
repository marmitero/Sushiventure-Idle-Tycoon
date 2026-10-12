#!/usr/bin/env node
/**
 * Headless progression simulation (docs/GAME_DESIGN/ECONOMY.md §6).
 *
 * Plays a greedy-but-human-ish policy (buy the cheapest affordable upgrade,
 * prefer unlocks early) and reports time-to-milestones so balance changes are
 * always backed by evidence instead of intuition.
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('dist-sim', { recursive: true });
writeFileSync('dist-sim/package.json', '{"type":"commonjs"}');

const src = (p) => pathToFileURL(path.resolve('dist-sim', p)).href;

async function main() {
  const { BALANCE } = await import(src('config/balance.js'));
  const { Decimal, D } = await import(src('decimal.js'));
  const economy = await import(src('economy.js'));
  const ops = await import(src('ops.js'));
  const { createInitialState } = await import(src('state/factory.js'));

  const STEP = 1; // simulated seconds per tick
  const MAX_HOURS = 12;
  const now0 = 1_700_000_000_000;
  let state = createInitialState(now0);
  let t = 0;
  const milestones = [];
  const mark = (name) => milestones.push({ name, atSeconds: t });

  const staffDelta = (id, levelFrom) => {
    const probe = {
      ...state,
      staff: { ...state.staff, [id]: { level: levelFrom + 1 } },
    };
    return economy
      .revenuePerSec(probe, now0 + t * 1000)
      .sub(economy.revenuePerSec(state, now0 + t * 1000));
  };

  const buyStaff = () => {
    // hire in fixed priority when comfortably affordable
    for (const id of ['attendant', 'chef', 'floorGirl', 'liftGuy']) {
      const level = state.staff[id].level;
      if (level === 0) {
        const cost = economy.staffHireCost(id);
        if (economy.moneyOf(state).gte(cost.mul(D(2)))) {
          const r = ops.hireStaff(state, id);
          if (r.ok) {
            state = r.value;
            mark(`contrata ${id}`);
            return true;
          }
        }
        return false;
      }
    }
    // train best revenue-per-cost
    let best = null;
    for (const id of ['attendant', 'chef', 'floorGirl', 'liftGuy']) {
      const level = state.staff[id].level;
      const cost = economy.staffUpgradeCost(id, level);
      if (!cost) continue;
      const ratio = staffDelta(id, level).div(cost);
      if (!best || ratio.cmp(best.ratio) > 0) best = { id, cost, ratio };
    }
    if (best && economy.moneyOf(state).gte(best.cost)) {
      const r = ops.upgradeStaff(state, best.id);
      if (r.ok) {
        state = r.value;
        return true;
      }
    }
    return false;
  };

  const buySomething = () => {
    // policy: unlock next floor while it is cheap relative to wallet,
    // otherwise upgrade the floor with best revenue-per-cost ratio.
    const unlockIndex = state.floors.length;
    if (unlockIndex < 8) {
      const cost = economy.floorUnlockCost(unlockIndex);
      if (economy.moneyOf(state).gte(cost.mul(D(1.0)))) {
        const r = ops.unlockFloor(state, unlockIndex);
        if (r.ok) {
          state = r.value;
          if (unlockIndex === 1) mark('2º andar');
          if (unlockIndex === 3) mark('4º andar');
          return true;
        }
      }
    }
    let best = null;
    for (const floor of state.floors) {
      if (floor.level >= BALANCE.floors.maxVisualLevel) continue;
      const cost = economy.floorUpgradeCost(floor.index, floor.level);
      const gain = economy
        .floorBaseRevenue(floor.index, floor.level + 1)
        .sub(economy.floorBaseRevenue(floor.index, floor.level));
      const ratio = gain.div(cost);
      if (!best || ratio.cmp(best.ratio) > 0) best = { floor, cost, ratio };
    }
    const cashierCost = economy.cashierUpgradeCost(state.cashierLevel);
    if (best && economy.moneyOf(state).gte(best.cost)) {
      const r = ops.upgradeFloor(state, best.floor.index);
      if (r.ok) {
        state = r.value;
        return true;
      }
    }
    if (cashierCost && economy.moneyOf(state).gte(cashierCost.mul(D(2)))) {
      const r = ops.upgradeCashier(state);
      if (r.ok) {
        state = r.value;
        mark(`caixa nv ${state.cashierLevel}`);
        return true;
      }
    }
    return buyStaff();
  };

  let lastMilestoneFloors = 1;
  while (t < MAX_HOURS * 3600) {
    state = ops.tick(state, STEP, now0 + t * 1000);
    t += STEP;
    buySomething();
    if (state.floors.length !== lastMilestoneFloors) {
      lastMilestoneFloors = state.floors.length;
      mark(`${state.floors.length} andares`);
    }
    if (state.cashierLevel === 6 && !milestones.some((m) => m.name === 'caixa max')) mark('caixa max');
    if (t % 60 === 0) {
      // simulate a player checking in once a minute; nothing else to do
    }
  }

  const hours = (s) => (s / 3600).toFixed(2);
  console.log('=== Simulação de progressão (política gulosa, 12h) ===');
  for (const m of milestones.slice(0, 24)) console.log(`  ${hours(m.atSeconds).padStart(6)}h  ${m.name}`);
  console.log('--- estado final ---');
  console.log('  andares           :', state.floors.map((f) => `#${f.index + 1}nv${f.level}`).join(' '));
  console.log('  caixa             :', state.cashierLevel);
  console.log('  equipe            :', Object.entries(state.staff).map(([k, v]) => `${k}:${v.level}`).join(' '));
  console.log('  dinheiro          :', economy.moneyOf(state).toNumber().toExponential(3));
  console.log('  receita/s         :', economy.revenuePerSec(state, now0).toNumber().toExponential(3));
  console.log('  ganho acumulado   :', Decimal.deserialize(state.lifetimeEarned).toNumber().toExponential(3));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
