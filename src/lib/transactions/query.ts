import {
  isTransactionCategory,
  TRANSACTION_CATEGORIES,
  type TransactionCategory,
} from "./types";

/** Sentinel category meaning "do not filter". */
export const ALL_CATEGORIES = "all";

export type CategoryFilter = TransactionCategory | typeof ALL_CATEGORIES;

/** Sort options offered in the UI, in the order the design lists them. */
export const TRANSACTION_SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "a-to-z", label: "A to Z" },
  { value: "z-to-a", label: "Z to A" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
] as const;

export type TransactionSort =
  (typeof TRANSACTION_SORT_OPTIONS)[number]["value"];

/** Options for the category filter, with the "no filter" entry first. */
export const CATEGORY_FILTER_OPTIONS = [
  { value: ALL_CATEGORIES, label: "All Transactions" },
  ...TRANSACTION_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  })),
] as const;

export const TRANSACTIONS_PER_PAGE = 10;

export interface TransactionQuery {
  /** Case-insensitive substring matched against the counterparty name. */
  readonly search: string;
  readonly category: CategoryFilter;
  readonly sort: TransactionSort;
  /** 1-based page number. */
  readonly page: number;
}

export const DEFAULT_TRANSACTION_QUERY: TransactionQuery = {
  search: "",
  category: ALL_CATEGORIES,
  sort: "latest",
  page: 1,
};

const TRANSACTIONS_PATHNAME = "/transactions";

/** The value shape Next.js hands to a page through `searchParams`. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseSort(value: string | undefined): TransactionSort {
  const match = TRANSACTION_SORT_OPTIONS.find(
    (option) => option.value === value,
  );

  return match?.value ?? DEFAULT_TRANSACTION_QUERY.sort;
}

function parseCategory(value: string | undefined): CategoryFilter {
  return isTransactionCategory(value) ? value : ALL_CATEGORIES;
}

function parsePage(value: string | undefined): number {
  // `Number` accepts "1.5" and " 2 ", so require plain digits before converting.
  if (value === undefined || !/^\d+$/.test(value)) {
    return DEFAULT_TRANSACTION_QUERY.page;
  }

  const page = Number(value);

  return page >= 1 ? page : DEFAULT_TRANSACTION_QUERY.page;
}

/**
 * Turns raw URL search params into a validated query. Anything unrecognized
 * falls back to {@link DEFAULT_TRANSACTION_QUERY} rather than reaching the API.
 */
export function parseTransactionQuery(
  params: RawSearchParams,
): TransactionQuery {
  return {
    search: (firstValue(params.search) ?? "").trim(),
    category: parseCategory(firstValue(params.category)),
    sort: parseSort(firstValue(params.sort)),
    page: parsePage(firstValue(params.page)),
  };
}

/**
 * Builds the transactions URL for a query, omitting params still at their
 * default so shared links stay readable.
 *
 * @param overrides Applied on top of `query`; the original is left untouched.
 */
export function toTransactionsHref(
  query: TransactionQuery,
  overrides: Partial<TransactionQuery> = {},
): string {
  const { search, category, sort, page } = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (search !== DEFAULT_TRANSACTION_QUERY.search) params.set("search", search);
  if (category !== DEFAULT_TRANSACTION_QUERY.category) {
    params.set("category", category);
  }
  if (sort !== DEFAULT_TRANSACTION_QUERY.sort) params.set("sort", sort);
  if (page !== DEFAULT_TRANSACTION_QUERY.page) params.set("page", String(page));

  const queryString = params.toString();

  return queryString
    ? `${TRANSACTIONS_PATHNAME}?${queryString}`
    : TRANSACTIONS_PATHNAME;
}

/** Stable identity for a query, used to re-suspend results when it changes. */
export function toTransactionsQueryKey(query: TransactionQuery): string {
  return toTransactionsHref(query);
}
