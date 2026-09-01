import type { ReactElement } from "react";
import { BudgetCardActions } from "./BudgetCardActions";
import { TransactionAmount } from "@/components/transactions/TransactionAmount";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MicroDetail } from "@/components/ui/MicroDetail";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import type { BudgetWithSpending } from "@/lib/budgets/spending";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  DEFAULT_TRANSACTION_QUERY,
  parseTransactionQuery,
  toTransactionsHref,
} from "@/lib/transactions/query";
import type { Transaction } from "@/lib/transactions/types";

/** Reused for the bar, the overage figure, and the blown-budget progress fill. */
const OVER_BUDGET_COLOR = "var(--color-red)";

interface BudgetDetailCardProps {
  budget: BudgetWithSpending;
  /** The category's most recent debits, newest first. */
  latestSpending: ReadonlyArray<Transaction>;
}

/** One budget: its limit, progress against it, and recent activity. */
export function BudgetDetailCard({
  budget,
  latestSpending,
}: BudgetDetailCardProps): ReactElement {
  // Re-parsed so a category the transactions filter does not know falls back
  // to an unfiltered link rather than a dead one.
  const categoryHref = toTransactionsHref(DEFAULT_TRANSACTION_QUERY, {
    category: parseTransactionQuery({ category: budget.category }).category,
  });

  return (
    <Card as="li" size="lg">
      <div className="mb-5 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="size-4 shrink-0 rounded-full"
          style={{ backgroundColor: budget.theme }}
        />
        <Text
          as="h2"
          preset="preset-2"
          className="text-grey-900 min-w-0 flex-1 truncate"
        >
          {budget.category}
        </Text>
        <BudgetCardActions budget={budget} />
      </div>

      <Text preset="preset-4" className="text-grey-500 mb-4">
        Maximum of {formatCurrency(budget.maximum, 2)}
      </Text>

      <ProgressBar
        value={budget.spent}
        max={budget.maximum}
        color={budget.isOverBudget ? OVER_BUDGET_COLOR : budget.theme}
        label={`${budget.category} spending`}
        className="mb-4"
      />

      <ul className="mb-5 grid grid-cols-2 gap-4">
        <MicroDetail
          color={budget.theme}
          title="Spent"
          detail={formatCurrency(budget.spent, 2)}
        />
        <MicroDetail
          // Neutral until the budget is blown, then red.
          color={
            budget.isOverBudget ? OVER_BUDGET_COLOR : "var(--color-beige-100)"
          }
          title={budget.isOverBudget ? "Over by" : "Remaining"}
          detail={formatCurrency(
            budget.isOverBudget
              ? budget.spent - budget.maximum
              : budget.remaining,
            2,
          )}
        />
      </ul>

      <div className="bg-beige-100 rounded-lg p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Text as="h3" preset="preset-3" className="text-grey-900">
            Latest Spending
          </Text>
          <Button variant="tertiary" href={categoryHref}>
            See All
          </Button>
        </div>

        {latestSpending.length === 0 ? (
          <Text preset="preset-5" className="text-grey-500">
            No spending in this category yet.
          </Text>
        ) : (
          <ul>
            {latestSpending.map((transaction) => (
              <li
                key={transaction.id}
                className="border-grey-500/15 flex items-center justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <TransactionAvatar
                    src={transaction.avatar}
                    className="hidden size-8 sm:block"
                  />
                  <Text
                    preset="preset-5-bold"
                    className="text-grey-900 truncate"
                  >
                    {transaction.name}
                  </Text>
                </div>
                <div className="shrink-0 text-right">
                  <TransactionAmount
                    amount={transaction.amount}
                    className="text-preset-5-bold"
                  />
                  <Text preset="preset-5" className="text-grey-500 mt-1">
                    {formatDate(transaction.date)}
                  </Text>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
