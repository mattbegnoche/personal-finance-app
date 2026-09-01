function assertFinite(value: number, functionName: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(
      `${functionName} expects a finite number, received: ${value}`,
    );
  }
}

/** Cents, so summed decimals do not drift (0.1 + 0.2 → 0.3, not 0.30000000000000004). */
const CURRENCY_ROUNDING = 100;

/** Rounds a money amount to whole cents. */
export function roundCurrency(value: number): number {
  return Math.round(value * CURRENCY_ROUNDING) / CURRENCY_ROUNDING;
}

/**
 * Formats a number as USD, e.g. `formatCurrency(407)` → `"$407"`.
 *
 * @param fractionDigits Decimal places to render. Defaults to `0`.
 * @throws If `value` is not a finite number.
 */
export function formatCurrency(value: number, fractionDigits = 0): string {
  assertFinite(value, "formatCurrency");

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/**
 * Formats a signed amount with an explicit `+` or `-`, e.g. `"-$55.50"`.
 *
 * The sign is rendered separately from the magnitude so debits read as
 * `-$55.50` rather than the locale's `($55.50)` or `-$55.50` variants.
 *
 * @throws If `value` is not a finite number.
 */
export function formatSignedCurrency(
  value: number,
  fractionDigits = 2,
): string {
  assertFinite(value, "formatSignedCurrency");

  const sign = value < 0 ? "-" : "+";

  return `${sign}${formatCurrency(Math.abs(value), fractionDigits)}`;
}

/**
 * Formats an ISO timestamp as a UTC calendar date, e.g. `"19 Aug 2024"`.
 *
 * @throws If `isoDate` cannot be parsed.
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`formatDate expects a valid date, received: ${isoDate}`);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    // Timestamps are UTC; pinning the zone keeps server and client output identical.
    timeZone: "UTC",
  }).format(date);
}

/**
 * Formats a ratio as a percentage, e.g. `formatPercent(159, 2000)` → `"7.95%"`.
 *
 * @param fractionDigits Decimal places to render. Defaults to `2`.
 * @throws If either argument is not a finite number.
 */
export function formatPercent(
  value: number,
  total: number,
  fractionDigits = 2,
): string {
  assertFinite(value, "formatPercent");
  assertFinite(total, "formatPercent");

  const ratio = total > 0 ? value / total : 0;

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(ratio);
}

/** Teen numbers all take "th" regardless of their last digit (11th, 12th, 13th). */
const TEEN_RANGE = { start: 11, end: 13 } as const;
/**
 * Adds an English ordinal suffix, e.g. `toOrdinal(2)` → `"2nd"`.
 *
 * @throws If `value` is not a finite number.
 */
export function toOrdinal(value: number): string {
  assertFinite(value, "toOrdinal");

  const lastTwo = Math.abs(value) % 100;
  const lastOne = Math.abs(value) % 10;
  const isTeen = lastTwo >= TEEN_RANGE.start && lastTwo <= TEEN_RANGE.end;
  const suffix = isTeen ? "th" : (["th", "st", "nd", "rd"][lastOne] ?? "th");

  return `${value}${suffix}`;
}
