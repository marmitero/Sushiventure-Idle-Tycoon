import { Decimal } from './decimal';

const SUFFIXES = [
  '',
  'K',
  'M',
  'B',
  'T',
  'Qa',
  'Qi',
  'Sx',
  'Sp',
  'Oc',
  'No',
  'Dc',
] as const;

/**
 * Formats a Decimal for display using short scale suffixes.
 * Below 1000 shows up to `decimals` decimal places; above, 2 significant decimals.
 * Full precision is always available via `formatFull`.
 */
export function formatNumber(value: Decimal, decimals = 1): string {
  if (value.isZero()) return '0';
  const negative = value.isNegative();
  const abs = negative ? value.negate() : value;
  const exp = abs.exponent;
  let text: string;
  if (exp < 3) {
    const n = abs.toNumber();
    const isInt = Math.abs(n - Math.round(n)) < 1e-9;
    text = isInt ? String(Math.round(n)) : n.toFixed(n < 10 ? decimals : Math.min(decimals, 1));
  } else {
    const tier = Math.floor(exp / 3);
    if (tier < SUFFIXES.length) {
      const scaled = abs.div(Decimal.pow10(tier * 3)).toNumber();
      text = `${scaled.toFixed(2)}${SUFFIXES[tier]}`;
    } else {
      text = `${abs.mantissa.toFixed(3)}e${abs.exponent}`;
    }
  }
  return negative ? `-${text}` : text;
}

/** Exact-ish representation for debug/inspection panels. */
export function formatFull(value: Decimal): string {
  if (value.isZero()) return '0';
  if (value.exponent < 15) {
    return value.toNumber().toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  }
  return `${value.mantissa.toFixed(6)} × 10^${value.exponent}`;
}

/** "1h 05m", "3m 12s", "45s" — used by offline gains and boost timers. */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(sec).padStart(2, '0')}s`;
  return `${sec}s`;
}

export function formatMoney(value: Decimal): string {
  return `$${formatNumber(value)}`;
}

export function formatRate(value: Decimal): string {
  return `$${formatNumber(value)}/s`;
}
