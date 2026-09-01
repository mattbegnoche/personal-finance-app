import { toReferenceDate } from "@/lib/reference-date";
import type { FinanceData } from "@/lib/store/types";
import {
  summarizeBills,
  toRecurringBills,
  type BillSummary,
  type RecurringBill,
} from "./bills";

export interface RecurringBillsData {
  readonly bills: ReadonlyArray<RecurringBill>;
  readonly summary: BillSummary;
}

/** Derives this month's bills and totals from the transaction history. */
export function toRecurringBillsData(data: FinanceData): RecurringBillsData {
  const bills = toRecurringBills(
    data.transactions,
    toReferenceDate(data.transactions),
  );

  return { bills, summary: summarizeBills(bills) };
}
