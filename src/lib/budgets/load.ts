import { fetchAllTransactions } from "@/lib/transactions/api";
import { toReferenceDate } from "@/lib/reference-date";
import type { Transaction } from "@/lib/transactions/types";
import { fetchBudgets } from "./api";
import { toBudgetsWithSpending, type BudgetWithSpending } from "./spending";

export interface BudgetsData {
  readonly budgets: ReadonlyArray<BudgetWithSpending>;
  /** Full history, so callers can pull each category's latest spending. */
  readonly transactions: ReadonlyArray<Transaction>;
}

/**
 * Loads budgets alongside the spending derived from the transaction history.
 *
 * Both requests go out together — neither depends on the other's result.
 *
 * @throws {import("@/lib/api/fetch-json").ApiError} If the API is unreachable or errors.
 */
export async function loadBudgets(): Promise<BudgetsData> {
  const [budgets, transactions] = await Promise.all([
    fetchBudgets(),
    fetchAllTransactions(),
  ]);

  return {
    budgets: toBudgetsWithSpending(
      budgets,
      transactions,
      toReferenceDate(transactions),
    ),
    transactions,
  };
}
