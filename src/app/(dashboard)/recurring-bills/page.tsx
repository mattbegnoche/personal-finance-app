import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { BillsFilters } from "@/components/recurring-bills/BillsFilters";
import {
  BillsResults,
  BillsSummaryPanel,
} from "@/components/recurring-bills/RecurringBillsContent";
import {
  BillsListSkeleton,
  BillsSummarySkeleton,
} from "@/components/recurring-bills/RecurringBillsSkeleton";
import { Card } from "@/components/ui/Card";
import { parseBillQuery, toBillQueryKey } from "@/lib/recurring-bills/query";

const PAGE_NAME = "Recurring Bills";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default async function RecurringBills({
  searchParams,
}: PageProps<"/recurring-bills">) {
  const query = parseBillQuery(await searchParams);

  return (
    <>
      <DashboardTitle text={PAGE_NAME} />

      <div className="grid-12 gap-sm items-start">
        <div className="sm:col-span-4">
          <Suspense fallback={<BillsSummarySkeleton />}>
            <BillsSummaryPanel />
          </Suspense>
        </div>

        {/* Filters sit outside the boundary so typing never remounts the input. */}
        <Card size="lg" className="sm:col-span-8">
          <BillsFilters query={query} />

          <Suspense key={toBillQueryKey(query)} fallback={<BillsListSkeleton />}>
            <BillsResults query={query} />
          </Suspense>
        </Card>
      </div>
    </>
  );
}
