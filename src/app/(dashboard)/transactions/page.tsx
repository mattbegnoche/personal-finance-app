import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionsResults } from "@/components/transactions/TransactionsResults";
import { TransactionsSkeleton } from "@/components/transactions/TransactionsSkeleton";
import { Card } from "@/components/ui/Card";
import {
  parseTransactionQuery,
  toTransactionsQueryKey,
} from "@/lib/transactions/query";

const PAGE_NAME = "Transactions";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default async function Transactions({
  searchParams,
}: PageProps<"/transactions">) {
  const query = parseTransactionQuery(await searchParams);

  return (
    <>
      <DashboardTitle text={PAGE_NAME} />

      <Card size="lg">
        <TransactionFilters query={query} />

        {/* Keyed on the query so each new search re-shows the skeleton. */}
        <Suspense
          key={toTransactionsQueryKey(query)}
          fallback={<TransactionsSkeleton />}
        >
          <TransactionsResults query={query} />
        </Suspense>
      </Card>
    </>
  );
}
