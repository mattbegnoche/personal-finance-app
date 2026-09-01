import type { ReactElement } from "react";
import { TransactionsList } from "./TransactionsList";
import { TransactionsPagination } from "./TransactionsPagination";
import { TransactionsTable } from "./TransactionsTable";
import { unstable_rethrow } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { Text } from "@/components/ui/Text";
import { ApiError } from "@/lib/api/fetch-json";
import { fetchTransactions } from "@/lib/transactions/api";
import {
  DEFAULT_TRANSACTION_QUERY,
  toTransactionsHref,
  type TransactionQuery,
} from "@/lib/transactions/query";
import type { TransactionsPage } from "@/lib/transactions/types";

/** Only an `ApiError` carries a message written for a person to read. */
function toUserMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : "Something went wrong loading your transactions. Please try again.";
}

function isFiltered(query: TransactionQuery): boolean {
  return (
    query.search !== DEFAULT_TRANSACTION_QUERY.search ||
    query.category !== DEFAULT_TRANSACTION_QUERY.category
  );
}

interface TransactionsResultsProps {
  query: TransactionQuery;
}

/**
 * Fetches and renders one page of transactions.
 *
 * Failures are caught here rather than left to an error boundary, so the
 * filters above stay usable and changing one doubles as the retry.
 */
export async function TransactionsResults({
  query,
}: TransactionsResultsProps): Promise<ReactElement> {
  let page: TransactionsPage;

  try {
    page = await fetchTransactions(query);
  } catch (error) {
    unstable_rethrow(error);

    console.error("[transactions] could not load page", error);

    return (
      <Notice
        icon="warning-circle"
        tone="error"
        title="Couldn't load transactions"
        description={toUserMessage(error)}
      />
    );
  }

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
