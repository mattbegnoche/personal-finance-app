import { fetchJson } from "@/lib/api/fetch-json";
import { parseTransactionList, parseTransactionsPage } from "./parse";
import {
  ALL_CATEGORIES,
  TRANSACTION_SORT_OPTIONS,
  TRANSACTIONS_PER_PAGE,
  type TransactionQuery,
  type TransactionSort,
} from "./query";
import type { Transaction, TransactionsPage } from "./types";

function toApiSort(sort: TransactionSort): string {
  const option = TRANSACTION_SORT_OPTIONS.find((each) => each.value === sort);

  return (option ?? TRANSACTION_SORT_OPTIONS[0]).apiSort;
}

/**
 * Translates a UI query into json-server query params.
 *
 * Searching, filtering, sorting and paging all happen on the server, so only
 * the current page crosses the wire.
 *
 * @see https://github.com/typicode/json-server — `field:contains`, `_sort`, `_page`.
 */
function toApiSearchParams(
  query: TransactionQuery,
  perPage: number,
): URLSearchParams {
  const params = new URLSearchParams({
    _sort: toApiSort(query.sort),
    _page: String(query.page),
    _per_page: String(perPage),
  });

  if (query.search) params.set("name:contains", query.search);
  if (query.category !== ALL_CATEGORIES) params.set("category", query.category);

  return params;
}

/**
 * Fetches one page of transactions matching `query`.
 *
 * @param perPage Rows to request. Defaults to the table's page size; the
 *   overview card asks for fewer so it only fetches what it renders.
 * @throws {import("@/lib/api/fetch-json").ApiError} If the API is unreachable or errors.
 * @throws If the response is not a valid paginated transactions payload.
 */
export async function fetchTransactions(
  query: TransactionQuery,
  perPage: number = TRANSACTIONS_PER_PAGE,
): Promise<TransactionsPage> {
  const payload = await fetchJson(
    `/transactions?${toApiSearchParams(query, perPage)}`,
  );

  return parseTransactionsPage(payload);
}

/**
 * Fetches every transaction, newest first, unpaginated.
 *
 * Budgets and recurring bills are both derived by aggregating the full history,
 * so they take one pass over it rather than a request per category.
 *
 * @throws {import("@/lib/api/fetch-json").ApiError} If the API is unreachable or errors.
 * @throws If the response is not a valid transactions array.
 */
export async function fetchAllTransactions(): Promise<
  ReadonlyArray<Transaction>
> {
  return parseTransactionList(await fetchJson("/transactions?_sort=-date"));
}
