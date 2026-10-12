/**
 * Persisted game state model (docs/DATA_MODEL.md).
 *
 * Only *source* data is persisted. Everything derived (revenue per second,
 * multiplier stacks, affordability) is recomputed by `src/core/economy.ts`.
 */

export const SAVE_VERSION = 2;

export type StaffId = 'attendant' | 'chef' | 'floorGirl' | 'liftGuy';

export const STAFF_IDS: StaffId[] = ['attendant', 'chef', 'floorGirl', 'liftGuy'];

/** Level 0 = not hired. */
export type StaffState = Record<StaffId, { level: number }>;

export interface FloorState {
  /** Tower position, 0 = ground restaurant hall. */
  index: number;
  /** 1..BALANCE.floors.maxVisualLevel. Level 0 means "not unlocked yet". */
  level: number;
}

export interface CityState {
  id: string;
  /** 1-indexed run number inside this city. */
  run: number;
}

export interface ActiveBoost {
  id: string;
  kind: 'revenue_x2' | 'offline_x2';
  /** Epoch ms (Date.now based) — validated on load against lastSeenAt. */
  startedAt: number;
  durationSeconds: number;
  /** Provider receipt id when granted by a rewarded ad; 'local' otherwise. */
  grantSource: string;
}

export interface GameState {
  version: number;
  createdAt: number;
  lastSeenAt: number;

  money: { m: number; e: number };
  lifetimeEarned: { m: number; e: number };

  floors: FloorState[];
  cashierLevel: number;
  staff: StaffState;

  city: CityState;
  prestigePoints: { m: number; e: number };
  prestigesCompleted: number;

  boosts: ActiveBoost[];
  /** Receipt ids already consumed — guarantees a reward is granted once (rule 8). */
  consumedReceipts: string[];

  settings: {
    reducedMotion: boolean;
    sound: boolean;
    music: boolean;
  };

  stats: {
    totalPlaySeconds: number;
    floorsUnlocked: number;
    cashierUpgrades: number;
  };
}

export type Result<T = undefined> =
  | { ok: true; value: T }
  | { ok: false; reason: string };

export const ok = <T,>(value: T): Result<T> => ({ ok: true, value });
export const fail = <T = never,>(reason: string): Result<T> => ({ ok: false, reason });
