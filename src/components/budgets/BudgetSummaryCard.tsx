import type { ReactElement } from "react";
import { BudgetChart } from "@/components/overview/BudgetChart";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import type { BudgetWithSpending } from "@/lib/budgets/spending";
import { formatCurrency } from "@/lib/format";

interface BudgetSummaryCardProps {
  budgets: ReadonlyArray<BudgetWithSpending>;
}

/**
 * The donut plus a per-category breakdown.
 *
 * Chart and list sit side by side at tablet width, then stack again on desktop
 * where the card shares the row with the budget list.
 */
export function BudgetSummaryCard({
  budgets,
}: BudgetSummaryCardProps): ReactElement {
  return (
    <Card size="lg">
      <div className="flex flex-col items-center gap-8 md:flex-row lg:flex-col">
        <div className="w-full max-w-[240px] shrink-0">
          <BudgetChart budgets={budgets} />
        </div>

        <div className="min-w-0 flex-1 self-stretch">
          <Text as="h2" preset="preset-2" className="text-grey-900 mb-6">
            Spending Summary
          </Text>

          <ul>
            {budgets.map((budget) => (
              <li
                key={budget.id}
                className="border-grey-100 flex items-center gap-4 border-b py-4 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-1 shrink-0 rounded-lg"
                  style={{ backgroundColor: budget.theme }}
                />
                <Text
                  preset="preset-4"
                  className="text-grey-500 min-w-0 flex-1 truncate"
                >
                  {budget.category}
                </Text>
                <span className="flex shrink-0 items-baseline gap-2">
                  <Text
                    as="span"
                    preset="preset-3"
                    className={
                      budget.isOverBudget ? "text-red" : "text-grey-900"
                    }
                  >
                    {formatCurrency(budget.spent, 2)}
                  </Text>
                  <Text as="span" preset="preset-5" className="text-grey-500">
                    of {formatCurrency(budget.maximum, 2)}
                  </Text>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
