import type { ReactElement } from "react";
import { DonutChart, type DonutSegment } from "../ui/DonutChart";
import { Text } from "../ui/Text";
import { formatCurrency } from "@/lib/format";
import type { Budget } from "@/lib/sample-data";

interface BudgetChartProps {
  readonly budgets: ReadonlyArray<Budget>;
}

function toSegments(
  budgets: ReadonlyArray<Budget>,
): ReadonlyArray<DonutSegment> {
  return budgets.map((budget) => ({
    id: budget.category,
    value: budget.spent,
    color: budget.theme,
  }));
}

/** Spending per category as a donut, with the month's totals in the middle. */
export function BudgetChart({ budgets }: BudgetChartProps): ReactElement {
  const totalSpent = budgets.reduce((total, budget) => total + budget.spent, 0);
  const totalLimit = budgets.reduce(
    (total, budget) => total + budget.maximum,
    0,
  );

  return (
    <DonutChart segments={toSegments(budgets)}>
      <Text preset="preset-1" className="text-grey-900">
        {formatCurrency(totalSpent)}
      </Text>
      <Text preset="preset-5" className="text-grey-500">
        of {formatCurrency(totalLimit)} limit
      </Text>
    </DonutChart>
  );
}
