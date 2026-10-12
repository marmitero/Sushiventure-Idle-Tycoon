/**
 * Decimal — fixed-precision big number representation (mantissa + exponent).
 *
 * Value = mantissa * 10^exponent, with mantissa normalized to [1, 1000)
 * (except zero). This keeps every economic value inside IEEE-754 safe ranges
 * while supporting the very large numbers an idle game eventually reaches.
 *
 * Rules (docs/GAME_DESIGN/ECONOMY.md §2):
 *  - Immutable: every operation returns a new instance.
 *  - Never produces NaN/Infinity: values above MAX_EXPONENT clamp to it.
 *  - Never produces negative zero; drift guards are used by callers.
 */
export const DECIMAL_PRECISION = 1e-9;
const MAX_EXPONENT = 1_000_000;
/** Canonical form: mantissa in [1, 10) so `exponent` alone orders magnitudes. */
const NORM_UPPER = 10;
const NORM_LOWER = 1;

export class Decimal {
  readonly mantissa: number;
  readonly exponent: number;

  private constructor(mantissa: number, exponent: number) {
    this.mantissa = mantissa;
    this.exponent = exponent;
  }

  static readonly ZERO: Decimal = new Decimal(0, 0);
  static readonly ONE: Decimal = new Decimal(1, 0);

  /** Normalizes (mantissa, exponent) into canonical form. No recursion. */
  private static normalize(mantissa: number, exponent: number): Decimal {
    if (mantissa === 0 || !Number.isFinite(mantissa)) {
      if (mantissa === 0) return Decimal.ZERO;
      return Decimal.maxValue();
    }
    let m = mantissa;
    let e = exponent;
    const am = Math.abs(m);
    if (am >= NORM_UPPER || am < NORM_LOWER) {
      const shift = Math.floor(Math.log10(am));
      m /= Math.pow(10, shift);
      e += shift;
    }
    // guard float drift (e.g. 9.999999999999998 rounding into the next decade)
    if (Math.abs(m) >= NORM_UPPER) {
      m /= NORM_UPPER;
      e += 1;
    }
    if (Math.abs(m) > 0 && Math.abs(m) < NORM_LOWER) {
      m *= NORM_UPPER;
      e -= 1;
    }
    if (e > MAX_EXPONENT) return Decimal.maxValue();
    if (e < -MAX_EXPONENT) return Decimal.ZERO;
    return new Decimal(m, e);
  }

  static from(value: number): Decimal {
    if (!Number.isFinite(value)) {
      return value > 0 ? Decimal.maxValue() : Decimal.ZERO;
    }
    return Decimal.normalize(value, 0);
  }

  static fromParts(mantissa: number, exponent: number): Decimal {
    return Decimal.normalize(mantissa, exponent);
  }

  static pow10(exponent: number): Decimal {
    if (!Number.isFinite(exponent)) return Decimal.maxValue();
    return Decimal.normalize(1, Math.trunc(exponent));
  }

  static maxValue(): Decimal {
    return new Decimal(999.999999999, MAX_EXPONENT);
  }

  isZero(): boolean {
    return this.mantissa === 0;
  }

  isNegative(): boolean {
    return this.mantissa < 0;
  }

  /** Approximate JS number; loses precision beyond 2^53 — display/sim only. */
  toNumber(): number {
    if (this.isZero()) return 0;
    const value = this.mantissa * Math.pow(10, this.exponent);
    return Number.isFinite(value) ? value : (this.mantissa > 0 ? Infinity : -Infinity);
  }

  negate(): Decimal {
    return new Decimal(-this.mantissa, this.exponent);
  }

  add(other: Decimal): Decimal {
    if (this.isZero()) return other;
    if (other.isZero()) return this;
    const diff = this.exponent - other.exponent;
    if (diff > 15) return this;
    if (diff < -15) return other;
    if (diff >= 0) {
      const scaled = this.mantissa + other.mantissa * Math.pow(10, -diff);
      return Decimal.normalize(scaled, this.exponent);
    }
    const scaled = other.mantissa + this.mantissa * Math.pow(10, diff);
    return Decimal.normalize(scaled, other.exponent);
  }

  sub(other: Decimal): Decimal {
    return this.add(other.negate());
  }

  mul(other: Decimal): Decimal {
    if (this.isZero() || other.isZero()) return Decimal.ZERO;
    return Decimal.normalize(this.mantissa * other.mantissa, this.exponent + other.exponent);
  }

  div(other: Decimal): Decimal {
    if (other.isZero()) throw new Error('Decimal: division by zero');
    if (this.isZero()) return Decimal.ZERO;
    return Decimal.normalize(this.mantissa / other.mantissa, this.exponent - other.exponent);
  }

  /** Integer-safe power for small integer exponents (cost curves). */
  powInt(n: number): Decimal {
    if (!Number.isInteger(n)) throw new Error('Decimal.powInt requires an integer exponent');
    if (n === 0) return Decimal.ONE;
    let result = Decimal.ONE;
    let base: Decimal = this;
    let exp = Math.abs(n);
    while (exp > 0) {
      if (exp & 1) result = result.mul(base);
      base = base.mul(base);
      exp >>= 1;
    }
    return n < 0 ? Decimal.ONE.div(result) : result;
  }

  mulNumber(n: number): Decimal {
    return this.mul(Decimal.from(n));
  }

  cmp(other: Decimal): number {
    if (this.isZero() && other.isZero()) return 0;
    const sa = Math.sign(this.mantissa);
    const sb = Math.sign(other.mantissa);
    if (sa !== sb) return sa < sb ? -1 : 1;
    const sign = sa;
    if (this.exponent !== other.exponent) {
      return (this.exponent > other.exponent ? 1 : -1) * sign;
    }
    const am = Math.abs(this.mantissa);
    const bm = Math.abs(other.mantissa);
    if (Math.abs(am - bm) <= Math.max(am, bm) * DECIMAL_PRECISION) return 0;
    return (am > bm ? 1 : -1) * sign;
  }

  eq(other: Decimal): boolean {
    return this.cmp(other) === 0;
  }
  gt(other: Decimal): boolean {
    return this.cmp(other) > 0;
  }
  gte(other: Decimal): boolean {
    return this.cmp(other) >= 0;
  }
  lt(other: Decimal): boolean {
    return this.cmp(other) < 0;
  }
  lte(other: Decimal): boolean {
    return this.cmp(other) <= 0;
  }

  /** Floors tiny negative drift to zero (prevents "-0.00" style states). */
  clampNegativeDrift(): Decimal {
    if (this.isNegative() && this.exponent < -6) return Decimal.ZERO;
    return this;
  }

  max(other: Decimal): Decimal {
    return this.gte(other) ? this : other;
  }
  min(other: Decimal): Decimal {
    return this.lte(other) ? this : other;
  }

  floor(): Decimal {
    if (this.exponent >= 15) return this;
    return Decimal.from(Math.floor(this.toNumber() + 1e-9));
  }

  serialize(): { m: number; e: number } {
    return { m: this.mantissa, e: this.exponent };
  }

  static deserialize(raw: unknown): Decimal {
    if (typeof raw === 'number') return Decimal.from(raw);
    if (typeof raw === 'string') {
      const n = Number(raw);
      return Number.isFinite(n) ? Decimal.from(n) : Decimal.ZERO;
    }
    if (raw && typeof raw === 'object') {
      const obj = raw as { m?: unknown; e?: unknown };
      const m = typeof obj.m === 'number' && Number.isFinite(obj.m) ? obj.m : 0;
      const e = typeof obj.e === 'number' && Number.isFinite(obj.e) ? Math.trunc(obj.e) : 0;
      if (m === 0) return Decimal.ZERO;
      return Decimal.normalize(m, e);
    }
    return Decimal.ZERO;
  }
}

export const D = Decimal.from;
export const D0 = Decimal.ZERO;
export const D1 = Decimal.ONE;
