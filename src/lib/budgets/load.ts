import { toReferenceDate } from "@/lib/reference-date";
import type { FinanceData } from "@/lib/store/types";
import { toBudgetsWithSpending, type BudgetWithSpending } from "./spending";

/** Pairs each budget with the spending derived from the month's transactions. */
export function toBudgetsData(
  data: FinanceData,
): ReadonlyArray<BudgetWithSpending> {
  return toBudgetsWithSpending(
    data.budgets,
    data.transactions,
    toReferenceDate(data.transactions),
  );
}
