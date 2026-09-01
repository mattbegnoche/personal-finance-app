import { isInReferenceMonth } from "@/lib/reference-date";
import { roundCurrency } from "@/lib/format";
import type { Transaction } from "@/lib/transactions/types";
import type { Budget } from "./types";

/** A budget paired with what has been spent against it this month. */
export interface BudgetWithSpending extends Budget {
  /** Positive total of the month's debits in this category. */
  readonly spent: number;
  /** What is left of the limit, clamped at zero. */
  readonly remaining: number;
  readonly isOverBudget: boolean;
}

/** Debits only — a refund or income in the category is not spending. */
function isSpendingIn(
  transaction: Transaction,
  category: string,
  reference: Date,
): boolean {
  return (
    transaction.amount < 0 &&
    transaction.category === category &&
    isInReferenceMonth(transaction.date, reference)
  );
}

/**
 * Pairs each budget with its spending for the reference month.
 *
 * The API stores only the limit, so spending is derived here by summing the
 * month's debits in the matching category.
 */
export function toBudgetsWithSpending(
  budgets: ReadonlyArray<Budget>,
  transactions: ReadonlyArray<Transaction>,
  reference: Date,
): ReadonlyArray<BudgetWithSpending> {
  return budgets.map((budget) => {
    const spent = roundCurrency(
      transactions
        .filter((transaction) =>
          isSpendingIn(transaction, budget.category, reference),
        )
        .reduce((total, transaction) => total - transaction.amount, 0),
    );

    return {
      ...budget,
      spent,
      remaining: roundCurrency(Math.max(budget.maximum - spent, 0)),
      isOverBudget: spent > budget.maximum,
    };
  });
}

/** Totals across every budget, for the donut chart's centre figures. */
export function sumBudgets(budgets: ReadonlyArray<BudgetWithSpending>): {
  spent: number;
  maximum: number;
} {
  return {
    spent: roundCurrency(
      budgets.reduce((total, budget) => total + budget.spent, 0),
    ),
    maximum: roundCurrency(
      budgets.reduce((total, budget) => total + budget.maximum, 0),
    ),
  };
}

/**
 * The most recent transactions in a category, for a budget's activity list.
 *
 * @param transactions Expected newest-first, as the API returns them.
 */
export function latestSpendingIn(
  transactions: ReadonlyArray<Transaction>,
  category: string,
  limit: number,
): ReadonlyArray<Transaction> {
  return transactions
    .filter(
      (transaction) =>
        transaction.category === category && transaction.amount < 0,
    )
    .slice(0, limit);
}
