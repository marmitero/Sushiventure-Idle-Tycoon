import { describe, expect, it } from 'vitest';
import { D } from '../src/core/decimal';
import { loadState, serializeState } from '../src/core/state/migrations';
import { createInitialState } from '../src/core/state/factory';
import { SAVE_VERSION } from '../src/core/state/types';
import { LocalStorageSaveRepository, MemorySaveRepository } from '../src/persistence/saveRepository';
import { SaveManager } from '../src/persistence/saveManager';

const NOW = 1_700_000_000_000;

class FakeStorage implements Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  private map = new Map<string, string>();
  failWrites = false;
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    if (this.failWrites) throw new Error('QuotaExceededError');
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

describe('save loading & migration', () => {
  it('loads a valid save unchanged', () => {
    const state = createInitialState(NOW);
    state.money = D(1234.5).serialize();
    const result = loadState(serializeState(state), NOW);
    expect(result.status).toBe('loaded');
    if (result.status !== 'loaded') return;
    expect(result.state.money).toEqual(state.money);
  });

  it('migrates older versions and sanitizes hostile fields', () => {
    const raw = {
      version: 1,
      money: { m: 5, e: 2 },
      floors: [
        { index: 0, level: 3 },
        { index: 5, level: 99 }, // gap + over-cap: must be dropped
        { index: 1, level: -4 },
      ],
      cashierLevel: 99,
      boosts: [{ id: 'b', kind: 'revenue_x2', startedAt: NOW, durationSeconds: 60, grantSource: 'x' }],
      consumedReceipts: ['r1', 42, 'r2'],
      settings: { sound: false },
    };
    const result = loadState(JSON.stringify(raw), NOW);
    expect(result.status).toBe('loaded');
    if (result.status !== 'loaded') return;
    const s = result.state;
    expect(s.floors).toHaveLength(1);
    expect(s.floors[0]?.level).toBe(3);
    expect(s.cashierLevel).toBe(6);
    expect(s.boosts).toHaveLength(1);
    expect(s.consumedReceipts).toEqual(['r1', 'r2']);
    expect(s.settings.sound).toBe(false);
    expect(s.version).toBe(SAVE_VERSION);
  });

  it('recovers from corrupted JSON without throwing', () => {
    const result = loadState('{not json', NOW);
    expect(result.status).toBe('recovered');
    if (result.status !== 'recovered') return;
    expect(result.state.floors).toHaveLength(1);
    expect(result.reason).toBe('json-parse-error');
  });

  it('recovers from null / empty payloads', () => {
    expect(loadState(null, NOW).status).toBe('recovered');
    expect(loadState('', NOW).status).toBe('recovered');
  });
});

describe('SaveManager', () => {
  it('round-trips through the repository', async () => {
    const repo = new MemorySaveRepository();
    const manager = new SaveManager(repo, 0);
    await manager.load(NOW);
    const state = manager.currentState;
    expect(state).not.toBeNull();
    if (!state) return;
    manager.adopt({ ...state, money: D(77).serialize() });
    await manager.flush(NOW, true);
    const reload = new SaveManager(repo, 0);
    const report = await reload.load(NOW);
    expect(report.result.status).toBe('loaded');
    if (report.result.status !== 'loaded') return;
    expect(report.result.state.money).toEqual(D(77).serialize());
  });

  it('falls back to the backup slot when primary is corrupted', async () => {
    const storage = new FakeStorage();
    const repo = new LocalStorageSaveRepository(storage);
    const manager = new SaveManager(repo, 0);
    await manager.load(NOW);
    const state = manager.currentState;
    expect(state).not.toBeNull();
    if (!state) return;
    manager.adopt({ ...state, money: D(4242).serialize() });
    await manager.flush(NOW, true);
    storage.setItem('sushiventure.save.main', 'corrupted{{{');
    const repo2 = new LocalStorageSaveRepository(storage);
    const report = await new SaveManager(repo2, 0).load(NOW);
    expect(report.usedBackup).toBe(true);
    if (report.result.status !== 'loaded' && report.result.status !== 'migrated') return;
    expect(report.result.state.money).toEqual(D(4242).serialize());
  });

  it('reports quota errors instead of throwing', async () => {
    const storage = new FakeStorage();
    storage.failWrites = true;
    const repo = new LocalStorageSaveRepository(storage);
    const outcome = repo.saveSync('{"version":1}');
    expect(outcome.written).toBe(false);
    expect(outcome.error).toContain('QuotaExceededError');
  });

  it('flushSync writes through the sync path', async () => {
    const storage = new FakeStorage();
    const repo = new LocalStorageSaveRepository(storage);
    const manager = new SaveManager(repo, 0);
    await manager.load(NOW);
    const state = manager.currentState;
    expect(state).not.toBeNull();
    if (!state) return;
    manager.adopt({ ...state, money: D(9).serialize() });
    expect(manager.flushSync()).toBe(true);
    expect(storage.getItem('sushiventure.save.main')).toContain('"m":9');
  });
});
