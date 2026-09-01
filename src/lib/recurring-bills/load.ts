import { cache } from "react";
import { toReferenceDate } from "@/lib/reference-date";
import { fetchAllTransactions } from "@/lib/transactions/api";
import { summarizeBills, toRecurringBills, type BillSummary, type RecurringBill } from "./bills";

export interface RecurringBillsData {
  readonly bills: ReadonlyArray<RecurringBill>;
  readonly summary: BillSummary;
}

/**
 * Loads this month's bills, derived from the transaction history.
 *
 * Wrapped in `cache` so the summary panel and the list — separate Suspense
 * boundaries on the same page — share one request per render.
 *
 * @throws {import("@/lib/api/fetch-json").ApiError} If the API is unreachable or errors.
 */
export const loadRecurringBills = cache(
  async (): Promise<RecurringBillsData> => {
    const transactions = await fetchAllTransactions();
    const bills = toRecurringBills(transactions, toReferenceDate(transactions));

    return { bills, summary: summarizeBills(bills) };
  },
);
