import { roundCurrency } from "@/lib/format";
import { isInReferenceMonth, utcDayOfMonth } from "@/lib/reference-date";
import { toAvatarSrc } from "@/lib/store/seed";
import type { Transaction } from "@/lib/transactions/types";

export type BillStatus = "paid" | "due-soon" | "upcoming";

/** A monthly charge, collapsed from every occurrence of that merchant. */
export interface RecurringBill {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
  readonly category: string;
  /** Positive amount of the most recent charge. */
  readonly amount: number;
  /** Day of the month the charge lands on. */
  readonly dueDay: number;
  readonly status: BillStatus;
}

export interface BillTotals {
  readonly count: number;
  readonly total: number;
}

export interface BillSummary {
  /** Already charged in the reference month. */
  readonly paid: BillTotals;
  /** Not yet charged this month. Includes everything in `dueSoon`. */
  readonly upcoming: BillTotals;
  /** The subset of `upcoming` falling due within the warning window. */
  readonly dueSoon: BillTotals;
  /** Paid plus upcoming — what the month costs in total. */
  readonly monthlyTotal: number;
}

function toStatus(latest: Transaction, reference: Date): BillStatus {
  if (isInReferenceMonth(latest.date, reference)) return "paid";

  const daysUntilDue = utcDayOfMonth(latest.date) - reference.getUTCDate();

  // A bill starts warning the user five days out.
  return daysUntilDue <= 5 ? "due-soon" : "upcoming";
}

/** Keeps the newest charge per merchant — that is the bill's current shape. */
function toLatestByName(
  transactions: ReadonlyArray<Transaction>,
): ReadonlyArray<Transaction> {
  const latest = new Map<string, Transaction>();

  for (const transaction of transactions) {
    const existing = latest.get(transaction.name);
    const isNewer =
      existing === undefined ||
      new Date(transaction.date) > new Date(existing.date);

    if (isNewer) latest.set(transaction.name, transaction);
  }

  return [...latest.values()];
}

/**
 * Derives this month's bills from the transaction history.
 *
 * The API has no bills collection — a bill is a merchant that charges monthly,
 * so each one is the newest `recurring` debit from that merchant. Whether it
 * has been paid is simply whether that charge landed in the reference month.
 */
export function toRecurringBills(
  transactions: ReadonlyArray<Transaction>,
  reference: Date,
): ReadonlyArray<RecurringBill> {
  const charges = transactions.filter(
    (transaction) => transaction.recurring && transaction.amount < 0,
  );

  return toLatestByName(charges)
    .map((latest) => ({
      id: latest.id,
      name: latest.name,
      avatar: toAvatarSrc(latest.avatar),
      category: latest.category,
      amount: roundCurrency(-latest.amount),
      dueDay: utcDayOfMonth(latest.date),
      status: toStatus(latest, reference),
    }))
    .sort((a, b) => a.dueDay - b.dueDay);
}

function tally(bills: ReadonlyArray<RecurringBill>): BillTotals {
  return {
    count: bills.length,
    total: roundCurrency(bills.reduce((sum, bill) => sum + bill.amount, 0)),
  };
}

/** Groups bills into the paid / upcoming / due-soon totals the design shows. */
export function summarizeBills(
  bills: ReadonlyArray<RecurringBill>,
): BillSummary {
  const paid = bills.filter((bill) => bill.status === "paid");
  const upcoming = bills.filter((bill) => bill.status !== "paid");
  const dueSoon = bills.filter((bill) => bill.status === "due-soon");

  return {
    paid: tally(paid),
    upcoming: tally(upcoming),
    dueSoon: tally(dueSoon),
    monthlyTotal: roundCurrency(
      bills.reduce((sum, bill) => sum + bill.amount, 0),
    ),
  };
}
