/**
 * Central balance configuration — the SINGLE source of truth for every
 * economic curve (constitution rule 6: no scattered values).
 *
 * Every number here is documented in docs/GAME_DESIGN/ECONOMY.md and exercised
 * by tests/simulation (scripts/simulate-progress.mjs).
 */
export const BALANCE = {
  /** Money the player starts a fresh city run with. */
  startMoney: 15,

  floors: {
    /** Visual levels available in the asset kit (Floor_Lv0..Floor_Lv10). */
    maxVisualLevel: 10,
    /** Revenue per second of an index-0 floor at level 1. */
    baseRevenuePerSec: 0.6,
    /** Multiplicative revenue step per tower position (higher floors earn more). */
    indexRevenueGrowth: 1.9,
    /** Multiplicative revenue step per floor level. */
    levelRevenueGrowth: 1.6,
    /** Cost to unlock tower position `i` (i >= 1); position 0 starts unlocked. */
    unlockBaseCost: 50,
    unlockCostGrowth: 7.5,
    /** Cost to upgrade a floor from level L to L+1 at position `i`. */
    upgradeBaseCost: 15,
    upgradeCostGrowthPerLevel: 2.9,
    upgradeCostGrowthPerIndex: 4.5,
    /** Hard cap of tower positions supported by the current visual/config set. */
    maxFloors: 24,
  },

  cashier: {
    /** Global revenue multiplier per cashier level (1-indexed). */
    multipliers: [1, 1.5, 2.2, 3.2, 4.6, 6.5],
    /** Cost to reach level N (index 0 unused — level 1 is the starting state). */
    upgradeCosts: [0, 400, 6_000, 90_000, 1_500_000, 30_000_000],
  },

  /**
   * Staff (Phase 3). Each role multiplies a DISTINCT scope of the revenue
   * formula (docs/GAME_DESIGN/ECONOMY.md §3), so no bonus can stack twice:
   *  - attendant : ground floor (index 0) only
   *  - floorGirl : upper floors (index >= 1) only
   *  - chef      : kitchen, multiplies the whole floor sum
   *  - liftGuy   : deliveries/elevator, global efficiency layer
   * Level 0 = not hired. Multiplier = 1 + perLevel × level.
   */
  staff: {
    attendant: {
      hireCost: 200,
      upgradeBase: 300,
      upgradeGrowth: 2.6,
      maxLevel: 25,
      perLevel: 0.15,
    },
    chef: {
      hireCost: 900,
      upgradeBase: 800,
      upgradeGrowth: 2.7,
      maxLevel: 25,
      perLevel: 0.08,
    },
    floorGirl: {
      hireCost: 3_000,
      upgradeBase: 2_000,
      upgradeGrowth: 2.7,
      maxLevel: 25,
      perLevel: 0.12,
    },
    liftGuy: {
      hireCost: 9_000,
      upgradeBase: 6_000,
      upgradeGrowth: 2.8,
      maxLevel: 25,
      perLevel: 0.06,
    },
  },

  elevator: {
    /** Base round-trip time in ms at lift level 1; scales down with level. */
    baseTripMs: 4200,
    minTripMs: 900,
    /** Base seconds between delivery vehicles; divided by delivery multiplier. */
    baseVehicleIntervalSec: 24,
    minVehicleIntervalSec: 6,
    maxVehicleIntervalSec: 40,
  },

  offline: {
    /** Fraction of active revenue earned while offline. */
    rate: 0.5,
    /** Default offline cap in seconds (2h). Prestige upgrades extend it. */
    baseCapSeconds: 2 * 3600,
    /** Refuse to grant offline gains for absences shorter than this. */
    minSeconds: 30,
  },

  /** Safety: never let a single tick grant more than this many seconds of revenue. */
  maxTickSeconds: 60,

  prestige: {
    /** Lifetime-money threshold that makes the first prestige reasonable. */
    basePoints: 1,
    growth: 1.5,
  },
} as const;

export type BalanceConfig = typeof BALANCE;
