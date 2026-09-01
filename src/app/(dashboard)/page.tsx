import type { Metadata } from "next";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { BalanceCards } from "@/components/overview/BalanceCards";
import { BudgetCard } from "@/components/overview/BudgetCard";
import { PotsCard } from "@/components/overview/PotsCard";
import { RecurringBillsCard } from "@/components/overview/RecurringBillsCard";
import { TransactionsCard } from "@/components/overview/TransactionsCard";

export const metadata: Metadata = {
  title: "Overview",
};

export default function Overview() {
  return (
    <>
      <DashboardTitle text="Overview" />

      <div className="gap-md grid grid-cols-1">
        <BalanceCards />

        <div className="grid-12 gap-sm items-start">
          <div className="gap-sm grid sm:col-span-7">
            <PotsCard />
            <TransactionsCard />
          </div>

          <div className="gap-sm grid sm:col-span-5">
            <BudgetCard />
            <RecurringBillsCard />
          </div>
        </div>
      </div>
    </>
  );
}
