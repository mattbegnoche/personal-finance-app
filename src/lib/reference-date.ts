/** Anything carrying an ISO timestamp; the only field these helpers read. */
interface Dated {
  readonly date: string;
}

function toTime(isoDate: string): number {
  return new Date(isoDate).getTime();
}

/**
 * The date the app treats as "today".
 *
 * Budgets reset monthly and bills recur monthly, so both need a point of
 * reference. With live data the newest transaction is at most days old, so this
 * tracks the real date; with the bundled seed data it pins those views to the
 * month the data actually covers instead of showing an empty month.
 */
export function toReferenceDate(transactions: ReadonlyArray<Dated>): Date {
  const times = transactions
    .map((transaction) => toTime(transaction.date))
    .filter((time) => !Number.isNaN(time));

  return times.length > 0 ? new Date(Math.max(...times)) : new Date();
}

/** Whether `isoDate` falls in the same UTC month and year as `reference`. */
export function isInReferenceMonth(isoDate: string, reference: Date): boolean {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getUTCFullYear() === reference.getUTCFullYear() &&
    date.getUTCMonth() === reference.getUTCMonth()
  );
}

/** Day of the month in UTC, or `0` if the date cannot be parsed. */
export function utcDayOfMonth(isoDate: string): number {
  const date = new Date(isoDate);

  return Number.isNaN(date.getTime()) ? 0 : date.getUTCDate();
}
