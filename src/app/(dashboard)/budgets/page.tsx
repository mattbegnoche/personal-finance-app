import type { Metadata } from "next";
import { AddBudgetButton } from "@/components/budgets/AddBudgetButton";
import { BudgetsContent } from "@/components/budgets/BudgetsContent";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";

const PAGE_NAME = "Budgets";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default function Budgets() {
  return (
    <>
      <DashboardTitle text={PAGE_NAME} action={<AddBudgetButton />} />
      <BudgetsContent />
    </>
  );
}
