/**
 * Formats a number as USD, e.g. `formatCurrency(407)` → `"$407"`.
 *
 * @param fractionDigits Decimal places to render. Defaults to `0`.
 * @throws If `value` is not a finite number.
 */
export function formatCurrency(value: number, fractionDigits = 0): string {
  if (!Number.isFinite(value)) {
    throw new Error(
      `formatCurrency expects a finite number, received: ${value}`,
    );
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
