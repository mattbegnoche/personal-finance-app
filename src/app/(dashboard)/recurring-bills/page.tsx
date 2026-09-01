import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { RecurringBillsView } from "@/components/recurring-bills/RecurringBillsView";
import { BillsListSkeleton } from "@/components/recurring-bills/RecurringBillsSkeleton";

const PAGE_NAME = "Recurring Bills";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default function RecurringBills() {
  return (
    <>
      <DashboardTitle text={PAGE_NAME} />

      {/* useSearchParams needs a boundary for the page to prerender. */}
      <Suspense fallback={<BillsListSkeleton />}>
        <RecurringBillsView />
      </Suspense>
    </>
  );
}
