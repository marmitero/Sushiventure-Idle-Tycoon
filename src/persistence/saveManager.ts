import { loadState, serializeState } from '../core/state/migrations';
import type { MigrationResult } from '../core/state/migrations';
import type { GameState } from '../core/state/types';
import type { SaveRepository } from './saveRepository';

export interface LoadReport {
  result: MigrationResult;
  usedBackup: boolean;
}

/**
 * SaveManager owns the load/save lifecycle:
 *  - loads primary, falls back to backup, then to a fresh state;
 *  - throttled autosave + save-after-operation;
 *  - promotes a good payload to the backup slot (rolling last-known-good).
 */
export class SaveManager {
  private state: GameState | null = null;
  private dirty = false;
  private lastSaveAt = 0;
  private lastOutcome: { written: boolean; error?: string } = { written: true };

  constructor(
    private readonly repo: SaveRepository,
    private readonly autosaveIntervalMs = 5000,
  ) {}

  get currentState(): GameState | null {
    return this.state;
  }

  get lastSaveOutcome(): { written: boolean; error?: string } {
    return this.lastOutcome;
  }

  async load(now: number): Promise<LoadReport> {
    const primary = await this.repo.load();
    const primaryResult = loadState(primary, now);
    if (primaryResult.status === 'loaded' || primaryResult.status === 'migrated') {
      this.state = primaryResult.state;
      return { result: primaryResult, usedBackup: false };
    }
    const backup = await this.repo.loadBackup();
    const backupResult = loadState(backup, now);
    if (backupResult.status === 'loaded' || backupResult.status === 'migrated') {
      this.state = backupResult.state;
      return { result: backupResult, usedBackup: true };
    }
    this.state = primaryResult.state; // fresh state from the recovery branch
    return { result: primaryResult, usedBackup: false };
  }

  adopt(state: GameState): void {
    this.state = state;
    this.dirty = true;
  }

  /** Marks state changed; the actual write happens on flush (throttled). */
  touch(): void {
    this.dirty = true;
  }

  async flush(now: number, force = false): Promise<boolean> {
    if (!this.state) return false;
    if (!force && !this.dirty) return false;
    if (!force && now - this.lastSaveAt < this.autosaveIntervalMs) return false;
    const payload = serializeState(this.state);
    await this.repo.save(payload);
    await this.repo.saveBackup(payload);
    this.lastSaveAt = now;
    this.dirty = false;
    return true;
  }

  /** Synchronous emergency flush (page hide). */
  flushSync(): boolean {
    if (!this.state) return false;
    if (!this.repo.saveSync) return false;
    const outcome = this.repo.saveSync(serializeState(this.state));
    this.dirty = false;
    this.lastOutcome = outcome;
    return outcome.written;
  }
}
