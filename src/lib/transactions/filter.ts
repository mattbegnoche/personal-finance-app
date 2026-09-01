import {
  TRANSACTIONS_PER_PAGE,
  type TransactionQuery,
  type TransactionSort,
} from "./query";
import { ALL_CATEGORIES } from "./query";
import type { Transaction, TransactionsPage } from "./types";

const COMPARATORS: Record<
  TransactionSort,
  (a: Transaction, b: Transaction) => number
> = {
  latest: (a, b) => b.date.localeCompare(a.date),
  oldest: (a, b) => a.date.localeCompare(b.date),
  "a-to-z": (a, b) => a.name.localeCompare(b.name),
  "z-to-a": (a, b) => b.name.localeCompare(a.name),
  highest: (a, b) => b.amount - a.amount,
  lowest: (a, b) => a.amount - b.amount,
};

/**
 * Searches, filters, sorts and pages transactions for display.
 *
 * All of it happens in memory: the data lives in the browser, so there is no
 * server to push the work to.
 *
 * The returned `page` is clamped to the available range, so a stale link to
 * page 9 of a now-shorter list lands on the last page rather than an empty one.
 */
export function applyTransactionQuery(
  transactions: ReadonlyArray<Transaction>,
  query: TransactionQuery,
): TransactionsPage {
  const term = query.search.trim().toLowerCase();

  const matches = transactions.filter((transaction) => {
    const matchesSearch =
      !term || transaction.name.toLowerCase().includes(term);
    const matchesCategory =
      query.category === ALL_CATEGORIES ||
      transaction.category === query.category;

    return matchesSearch && matchesCategory;
  });

  const totalItems = matches.length;
  const pageCount = Math.ceil(totalItems / TRANSACTIONS_PER_PAGE);
  const page = Math.min(Math.max(query.page, 1), Math.max(pageCount, 1));
  const start = (page - 1) * TRANSACTIONS_PER_PAGE;

  return {
    transactions: [...matches]
      .sort(COMPARATORS[query.sort])
      .slice(start, start + TRANSACTIONS_PER_PAGE),
    page,
    pageCount,
    totalItems,
  };
}
