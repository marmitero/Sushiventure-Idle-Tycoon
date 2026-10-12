import type { GameState } from '../core/state/types';

/**
 * SaveRepository — storage contract (docs/ARCHITECTURE.md §5.3).
 * The core never talks to localStorage/IndexedDB/network directly, so the
 * local adapter can later be replaced by (or synced with) a cloud adapter.
 */
export interface SaveRepository {
  readonly id: string;
  load(): Promise<string | null>;
  save(payload: string): Promise<void>;
  /** Last-known-good copy, used to recover from corrupted primary saves. */
  loadBackup(): Promise<string | null>;
  saveBackup(payload: string): Promise<void>;
  clear(): Promise<void>;
  /** Optional sync write for page-lifecycle hooks (beforeunload). */
  saveSync?(payload: string): SaveOutcome;
}

export interface SaveOutcome {
  written: boolean;
  error?: string;
}

/**
 * LocalStorage adapter with:
 *  - primary + backup slots (corruption recovery),
 *  - quota-exceeded handling (reported, never thrown into the game loop),
 *  - synchronous flush helper for `beforeunload`/`visibilitychange`.
 */
export class LocalStorageSaveRepository implements SaveRepository {
  readonly id = 'local-storage';
  private readonly primaryKey: string;
  private readonly backupKey: string;

  constructor(
    private readonly storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
    slot = 'main',
  ) {
    this.primaryKey = `sushiventure.save.${slot}`;
    this.backupKey = `sushiventure.save.${slot}.bak`;
  }

  async load(): Promise<string | null> {
    return this.readSync(this.primaryKey);
  }

  async loadBackup(): Promise<string | null> {
    return this.readSync(this.backupKey);
  }

  async save(payload: string): Promise<void> {
    this.writeSync(this.primaryKey, payload);
  }

  async saveBackup(payload: string): Promise<void> {
    this.writeSync(this.backupKey, payload);
  }

  async clear(): Promise<void> {
    this.storage.removeItem(this.primaryKey);
    this.storage.removeItem(this.backupKey);
  }

  saveSync(payload: string): SaveOutcome {
    const primary = this.writeSync(this.primaryKey, payload);
    const backup = this.writeSync(this.backupKey, payload);
    return { written: primary.written && backup.written, error: primary.error ?? backup.error };
  }

  /** Sync variants for page-lifecycle hooks. */
  readSync(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch {
      return null;
    }
  }

  writeSync(key: string, payload: string): SaveOutcome {
    try {
      this.storage.setItem(key, payload);
      return { written: true };
    } catch (error) {
      return { written: false, error: error instanceof Error ? error.message : String(error) };
    }
  }
}

/** In-memory adapter: tests + environments without localStorage. */
export class MemorySaveRepository implements SaveRepository {
  readonly id = 'memory';
  private primary: string | null = null;
  private backup: string | null = null;

  async load(): Promise<string | null> {
    return this.primary;
  }
  async loadBackup(): Promise<string | null> {
    return this.backup;
  }
  async save(payload: string): Promise<void> {
    this.primary = payload;
  }
  async saveBackup(payload: string): Promise<void> {
    this.backup = payload;
  }
  async clear(): Promise<void> {
    this.primary = null;
    this.backup = null;
  }
}

export type { GameState };
