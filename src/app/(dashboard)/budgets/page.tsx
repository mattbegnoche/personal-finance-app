import type { Metadata } from "next";
import { Suspense } from "react";
import { BudgetsContent } from "@/components/budgets/BudgetsContent";
import { BudgetsSkeleton } from "@/components/budgets/BudgetsSkeleton";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";

const PAGE_NAME = "Budgets";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default function Budgets() {
  return (
    <>
      <DashboardTitle text={PAGE_NAME} />

      <Suspense fallback={<BudgetsSkeleton />}>
        <BudgetsContent />
      </Suspense>
    </>
  );
}
