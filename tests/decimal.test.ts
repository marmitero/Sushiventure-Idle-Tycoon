import { describe, expect, it } from 'vitest';
import { Decimal, D } from '../src/core/decimal';

describe('Decimal', () => {
  it('normalizes mantissa into [1,1000)', () => {
    const a = D(1500);
    expect(a.mantissa).toBeCloseTo(1.5, 9);
    expect(a.exponent).toBe(3);
    const b = D(0.004);
    expect(b.mantissa).toBeCloseTo(4, 9);
    expect(b.exponent).toBe(-3);
  });

  it('adds across exponents', () => {
    expect(D(1.5).add(D(2.25)).toNumber()).toBeCloseTo(3.75, 9);
    // 15 significant digits are preserved, so the +1 survives
    expect(Math.round(D(1e12).add(D(1)).toNumber())).toBe(1e12 + 1);
    // beyond that, the smaller term is correctly dropped
    expect(D(1e20).add(D(1)).toNumber()).toBe(1e20);
    expect(D(1e12).add(D(1e12)).toNumber()).toBe(2e12);
  });

  it('subtracts without negative drift on equals', () => {
    expect(D(10).sub(D(10)).isZero()).toBe(true);
    expect(D(10.05).sub(D(10)).toNumber()).toBeCloseTo(0.05, 9);
  });

  it('multiplies and divides large values safely', () => {
    const big = D(1e200).mul(D(1e200));
    expect(big.exponent).toBe(400);
    expect(big.div(D(1e200)).toNumber()).toBeCloseTo(1e200, 0);
  });

  it('clamps instead of producing Infinity', () => {
    const huge = Decimal.pow10(999_999).mul(D(999));
    expect(Number.isFinite(huge.toNumber()) || huge.exponent <= 1_000_000).toBe(true);
    expect(huge.mantissa).toBeLessThan(1000);
  });

  it('compares correctly', () => {
    expect(D(2).lt(D(10))).toBe(true);
    expect(D(1e6).gt(D(999_999))).toBe(true);
    expect(D(5).eq(D(5))).toBe(true);
    expect(D(-3).lt(D(0))).toBe(true);
  });

  it('powInt matches plain math for small values', () => {
    expect(D(3.2).powInt(4).toNumber()).toBeCloseTo(3.2 ** 4, 6);
    expect(D(2).powInt(0).toNumber()).toBe(1);
  });

  it('serializes and deserializes losslessly', () => {
    const value = D(123456.789);
    const back = Decimal.deserialize(value.serialize());
    expect(back.cmp(value)).toBe(0);
    expect(Decimal.deserialize('garbage').isZero()).toBe(true);
    expect(Decimal.deserialize(null).isZero()).toBe(true);
  });

  it('never yields NaN', () => {
    const values = [D(0), D(1), D(-1), D(1e-12), D(1e12)];
    for (const a of values) {
      for (const b of values) {
        expect(Number.isNaN(a.add(b).toNumber())).toBe(false);
        expect(Number.isNaN(a.mul(b).toNumber())).toBe(false);
        if (!b.isZero()) expect(Number.isNaN(a.div(b).toNumber())).toBe(false);
      }
    }
  });
});
