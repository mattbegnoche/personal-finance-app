import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { TransactionsSkeleton } from "@/components/transactions/TransactionsSkeleton";
import { TransactionsView } from "@/components/transactions/TransactionsView";
import { Card } from "@/components/ui/Card";

const PAGE_NAME = "Transactions";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default function Transactions() {
  return (
    <>
      <DashboardTitle text={PAGE_NAME} />

      {/* useSearchParams needs a boundary for the page to prerender. */}
      <Suspense
        fallback={
          <Card size="lg">
            <TransactionsSkeleton />
          </Card>
        }
      >
        <TransactionsView />
      </Suspense>
    </>
  );
}
