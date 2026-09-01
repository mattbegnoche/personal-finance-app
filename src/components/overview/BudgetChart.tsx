import type { ReactElement } from "react";
import { DonutChart, type DonutSegment } from "../ui/DonutChart";
import { Text } from "../ui/Text";
import { formatCurrency } from "@/lib/format";
import { sumBudgets, type BudgetWithSpending } from "@/lib/budgets/spending";

interface BudgetChartProps {
  readonly budgets: ReadonlyArray<BudgetWithSpending>;
}

function toSegments(
  budgets: ReadonlyArray<BudgetWithSpending>,
): ReadonlyArray<DonutSegment> {
  return budgets.map((budget) => ({
    id: budget.category,
    value: budget.spent,
    color: budget.theme,
  }));
}

/** Spending per category as a donut, with the month's totals in the middle. */
export function BudgetChart({ budgets }: BudgetChartProps): ReactElement {
  const { spent, maximum } = sumBudgets(budgets);

  return (
    <DonutChart segments={toSegments(budgets)}>
      <Text preset="preset-1" className="text-grey-900">
        {formatCurrency(spent)}
      </Text>
      <Text preset="preset-5" className="text-grey-500">
        of {formatCurrency(maximum)} limit
      </Text>
    </DonutChart>
  );
}
