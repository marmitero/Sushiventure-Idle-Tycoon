import { BALANCE } from '../config/balance';
import { Decimal } from '../decimal';
import { createInitialState } from './factory';
import type { GameState } from './types';
import { SAVE_VERSION } from './types';

export type MigrationResult =
  | { status: 'loaded'; state: GameState }
  | { status: 'migrated'; state: GameState; fromVersion: number }
  | { status: 'recovered'; state: GameState; reason: string };

const num = (v: unknown, fallback = 0): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

/** Structural validation + sanitization of a candidate save object. */
function sanitize(raw: unknown): GameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const state = createInitialState(Date.now());

  const version = num(r.version, 0);
  if (version < 1 || version > SAVE_VERSION) return null;

  state.version = SAVE_VERSION;
  state.createdAt = num(r.createdAt, Date.now());
  state.lastSeenAt = num(r.lastSeenAt, Date.now());
  state.money = Decimal.deserialize(r.money).max(Decimal.ZERO).serialize();
  state.lifetimeEarned = Decimal.deserialize(r.lifetimeEarned).max(Decimal.ZERO).serialize();
  state.cashierLevel = Math.min(
    BALANCE.cashier.multipliers.length,
    Math.max(1, Math.trunc(num(r.cashierLevel, 1))),
  );
  state.prestigePoints = Decimal.deserialize(r.prestigePoints).max(Decimal.ZERO).serialize();
  state.prestigesCompleted = Math.max(0, Math.trunc(num(r.prestigesCompleted, 0)));

  const floorsRaw = Array.isArray(r.floors) ? r.floors : [];
  const floors = floorsRaw
    .filter((f): f is Record<string, unknown> => !!f && typeof f === 'object')
    .map((f) => ({
      index: Math.max(0, Math.trunc(num(f.index, 0))),
      level: Math.min(BALANCE.floors.maxVisualLevel, Math.max(0, Math.trunc(num(f.level, 0)))),
    }))
    .sort((a, b) => a.index - b.index);
  // enforce contiguous tower: drop gaps, keep at least the ground floor
  const clean: GameState['floors'] = [];
  for (let i = 0; i < floors.length; i += 1) {
    const f = floors[i];
    if (!f || f.index !== i || f.level < 1) break;
    clean.push(f);
  }
  state.floors = clean.length > 0 ? clean : [{ index: 0, level: 1 }];

  // v1 saves have no staff block: migration fills hired=false (level 0).
  const staffRaw = (r.staff ?? {}) as Record<string, unknown>;
  const readLevel = (key: string, max: number): number => {
    const entry = staffRaw[key] as Record<string, unknown> | undefined;
    return Math.min(max, Math.max(0, Math.trunc(num(entry?.level, 0))));
  };
  state.staff = {
    attendant: { level: readLevel('attendant', BALANCE.staff.attendant.maxLevel) },
    chef: { level: readLevel('chef', BALANCE.staff.chef.maxLevel) },
    floorGirl: { level: readLevel('floorGirl', BALANCE.staff.floorGirl.maxLevel) },
    liftGuy: { level: readLevel('liftGuy', BALANCE.staff.liftGuy.maxLevel) },
  };

  const city = r.city as Record<string, unknown> | undefined;
  state.city = {
    id: typeof city?.id === 'string' && city.id.length > 0 ? city.id : 'sakura-bay',
    run: Math.max(1, Math.trunc(num(city?.run, 1))),
  };

  const boostsRaw = Array.isArray(r.boosts) ? r.boosts : [];
  state.boosts = boostsRaw
    .filter((b): b is Record<string, unknown> => !!b && typeof b === 'object')
    .map((b) => ({
      id: typeof b.id === 'string' ? b.id : `boost-${Math.random().toString(36).slice(2)}`,
      kind: b.kind === 'offline_x2' ? ('offline_x2' as const) : ('revenue_x2' as const),
      startedAt: num(b.startedAt, 0),
      durationSeconds: Math.max(0, num(b.durationSeconds, 0)),
      grantSource: typeof b.grantSource === 'string' ? b.grantSource : 'local',
    }))
    .filter((b) => b.durationSeconds > 0 && b.startedAt > 0);

  const receiptsRaw = Array.isArray(r.consumedReceipts) ? r.consumedReceipts : [];
  state.consumedReceipts = receiptsRaw
    .filter((v): v is string => typeof v === 'string' && v.length > 0 && v.length <= 128)
    .slice(-200);

  const settings = r.settings as Record<string, unknown> | undefined;
  state.settings = {
    reducedMotion: settings?.reducedMotion === true,
    sound: settings?.sound !== false,
    music: settings?.music !== false,
  };

  const stats = r.stats as Record<string, unknown> | undefined;
  state.stats = {
    totalPlaySeconds: Math.max(0, num(stats?.totalPlaySeconds, 0)),
    floorsUnlocked: Math.max(0, Math.trunc(num(stats?.floorsUnlocked, 0))),
    cashierUpgrades: Math.max(0, Math.trunc(num(stats?.cashierUpgrades, 0))),
  };

  return state;
}

/**
 * Parses + migrates an untrusted blob (localStorage / future cloud payload).
 * Never throws: corrupted data degrades to a fresh state with a reason, so the
 * player is never locked out (constitution rule: recover from bad saves).
 */
export function loadState(rawText: string | null, now: number): MigrationResult {
  if (rawText == null || rawText.trim() === '') {
    return { status: 'recovered', state: createInitialState(now), reason: 'empty-save' };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { status: 'recovered', state: createInitialState(now), reason: 'json-parse-error' };
  }
  if (!parsed || typeof parsed !== 'object') {
    return { status: 'recovered', state: createInitialState(now), reason: 'not-an-object' };
  }
  const declared = num((parsed as Record<string, unknown>).version, 0);
  const state = sanitize(parsed);
  if (!state) {
    return { status: 'recovered', state: createInitialState(now), reason: 'unsupported-version' };
  }
  if (declared === SAVE_VERSION) return { status: 'loaded', state };
  return { status: 'migrated', state, fromVersion: declared };
}

export function serializeState(state: GameState): string {
  return JSON.stringify({ ...state, version: SAVE_VERSION });
}
