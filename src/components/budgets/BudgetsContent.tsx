import { unstable_rethrow } from "next/navigation";
import type { ReactElement } from "react";
import { BudgetDetailCard } from "./BudgetDetailCard";
import { BudgetSummaryCard } from "./BudgetSummaryCard";
import { Notice } from "@/components/ui/Notice";
import { ApiError } from "@/lib/api/fetch-json";
import { loadBudgets, type BudgetsData } from "@/lib/budgets/load";
import { latestSpendingIn } from "@/lib/budgets/spending";

/** Fetches and renders every budget with its spending for the month. */
export async function BudgetsContent(): Promise<ReactElement> {
  let data: BudgetsData;

  try {
    data = await loadBudgets();
  } catch (error) {
    unstable_rethrow(error);
    console.error("[budgets] could not load budgets", error);

    return (
      <Notice
        icon="warning-circle"
        tone="error"
        title="Couldn't load budgets"
        description={
          error instanceof ApiError
            ? error.message
            : "Something went wrong loading your budgets. Please try again."
        }
      />
    );
  }

  if (data.budgets.length === 0) {
    return (
      <Notice
        icon="chart-donut"
        title="No budgets yet"
        description="Budgets you create will show up here with your spending against them."
      />
    );
  }

  return (
    <div className="grid-12 gap-sm items-start">
      <div className="sm:col-span-5">
        <BudgetSummaryCard budgets={data.budgets} />
      </div>

      <ul className="gap-sm grid sm:col-span-7">
        {data.budgets.map((budget) => (
          <BudgetDetailCard
            key={budget.id}
            budget={budget}
            // The design lists three recent transactions per budget.
            latestSpending={latestSpendingIn(
              data.transactions,
              budget.category,
              3,
            )}
          />
        ))}
      </ul>
    </div>
  );
}
