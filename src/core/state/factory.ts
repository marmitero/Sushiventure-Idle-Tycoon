import { BALANCE } from '../config/balance';
import { Decimal } from '../decimal';
import type { GameState } from './types';
import { SAVE_VERSION } from './types';

/** Creates a brand-new run for a city (also used after a prestige reset). */
export function createRunState(now: number, cityId = 'sakura-bay', run = 1): GameState {
  return {
    version: SAVE_VERSION,
    createdAt: now,
    lastSeenAt: now,
    money: Decimal.from(BALANCE.startMoney).serialize(),
    lifetimeEarned: Decimal.ZERO.serialize(),
    floors: [{ index: 0, level: 1 }],
    cashierLevel: 1,
    staff: {
      attendant: { level: 0 },
      chef: { level: 0 },
      floorGirl: { level: 0 },
      liftGuy: { level: 0 },
    },
    city: { id: cityId, run },
    prestigePoints: Decimal.ZERO.serialize(),
    prestigesCompleted: 0,
    boosts: [],
    consumedReceipts: [],
    settings: { reducedMotion: false, sound: true, music: true },
    stats: { totalPlaySeconds: 0, floorsUnlocked: 0, cashierUpgrades: 0 },
  };
}

export function createInitialState(now: number): GameState {
  return createRunState(now);
}
