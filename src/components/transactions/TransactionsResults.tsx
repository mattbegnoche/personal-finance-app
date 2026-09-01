"use client";

import type { ReactElement } from "react";
import { TransactionsList } from "./TransactionsList";
import { TransactionsPagination } from "./TransactionsPagination";
import { TransactionsSkeleton } from "./TransactionsSkeleton";
import { TransactionsTable } from "./TransactionsTable";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { Text } from "@/components/ui/Text";
import { applyTransactionQuery } from "@/lib/transactions/filter";
import {
  DEFAULT_TRANSACTION_QUERY,
  toTransactionsHref,
  type TransactionQuery,
} from "@/lib/transactions/query";

function isFiltered(query: TransactionQuery): boolean {
  return (
    query.search !== DEFAULT_TRANSACTION_QUERY.search ||
    query.category !== DEFAULT_TRANSACTION_QUERY.category
  );
}

/** One page of transactions matching the current filters. */
export function TransactionsResults({
  query,
}: {
  query: TransactionQuery;
}): ReactElement {
  const { data, isReady } = useFinanceData();

  if (!isReady) return <TransactionsSkeleton />;

  const page = applyTransactionQuery(data.transactions, query);

  if (page.totalItems === 0) {
    return (
      <Notice
        icon="magnifying-glass"
        title="No transactions found"
        description={
          isFiltered(query)
            ? "No transactions match your search and filters. Try widening them."
            : "There are no transactions to show yet."
        }
      >
        {isFiltered(query) && (
          <Button
            variant="secondary"
            href={toTransactionsHref(DEFAULT_TRANSACTION_QUERY)}
          >
            Clear filters
          </Button>
        )}
      </Notice>
    );
  }

  return (
    <>
      <Text preset="preset-5" className="sr-only" role="status">
        {`Showing page ${page.page} of ${page.pageCount}, ${page.totalItems} transactions in total.`}
      </Text>

      <TransactionsList transactions={page.transactions} />
      <TransactionsTable transactions={page.transactions} />

      <TransactionsPagination
        query={query}
        page={page.page}
        pageCount={page.pageCount}
      />
    </>
  );
}
