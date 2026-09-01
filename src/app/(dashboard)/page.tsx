import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import {
  BalanceCards,
  BalanceCardsSkeleton,
} from "@/components/overview/BalanceCards";
import { BudgetCard, BudgetCardSkeleton } from "@/components/overview/BudgetCard";
import { PotsCard, PotsCardSkeleton } from "@/components/overview/PotsCard";
import {
  RecurringBillsCard,
  RecurringBillsCardSkeleton,
} from "@/components/overview/RecurringBillsCard";
import {
  TransactionsCard,
  TransactionsCardSkeleton,
} from "@/components/overview/TransactionsCard";

export const metadata: Metadata = {
  title: "Overview",
};

export default function Overview() {
  return (
    <>
      <DashboardTitle text="Overview" />

      {/* Each card streams on its own, so one slow fetch cannot hold up the page. */}
      <div className="gap-md grid grid-cols-1">
        <Suspense fallback={<BalanceCardsSkeleton />}>
          <BalanceCards />
        </Suspense>

        <div className="grid-12 gap-sm items-start">
          <div className="gap-sm grid sm:col-span-7">
            <Suspense fallback={<PotsCardSkeleton />}>
              <PotsCard />
            </Suspense>
            <Suspense fallback={<TransactionsCardSkeleton />}>
              <TransactionsCard />
            </Suspense>
          </div>

          <div className="gap-sm grid sm:col-span-5">
            <Suspense fallback={<BudgetCardSkeleton />}>
              <BudgetCard />
            </Suspense>
            <Suspense fallback={<RecurringBillsCardSkeleton />}>
              <RecurringBillsCard />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
