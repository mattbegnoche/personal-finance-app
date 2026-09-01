"use client";

import type { ReactElement } from "react";
import { BudgetDetailCard } from "./BudgetDetailCard";
import { BudgetSummaryCard } from "./BudgetSummaryCard";
import { BudgetsSkeleton } from "./BudgetsSkeleton";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Notice } from "@/components/ui/Notice";
import { toBudgetsData } from "@/lib/budgets/load";
import { latestSpendingIn } from "@/lib/budgets/spending";

/** Every budget with its spending for the month. */
export function BudgetsContent(): ReactElement {
  const { data, isReady } = useFinanceData();

  if (!isReady) return <BudgetsSkeleton />;

  const budgets = toBudgetsData(data);

  if (budgets.length === 0) {
    return (
      <Notice
        icon="chart-donut"
        title="No budgets yet"
        description="Add a budget to set a spending limit for a category and track what you spend against it."
      />
    );
  }

  return (
    <div className="grid-12 gap-sm items-start">
      <div className="sm:col-span-5">
        <BudgetSummaryCard budgets={budgets} />
      </div>

      <ul className="gap-sm grid sm:col-span-7">
        {budgets.map((budget) => (
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
