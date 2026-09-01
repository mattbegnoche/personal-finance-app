import type { RawSearchParams } from "@/lib/transactions/query";
import type { RecurringBill } from "./bills";

/** Sort options offered in the UI, in the order the design lists them. */
export const BILL_SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "a-to-z", label: "A to Z" },
  { value: "z-to-a", label: "Z to A" },
  { value: "highest", label: "Highest" },
  { value: "lowest", label: "Lowest" },
] as const;

export type BillSort = (typeof BILL_SORT_OPTIONS)[number]["value"];

export interface BillQuery {
  /** Case-insensitive substring matched against the bill name. */
  readonly search: string;
  readonly sort: BillSort;
}

export const DEFAULT_BILL_QUERY: BillQuery = {
  search: "",
  sort: "latest",
};

const RECURRING_BILLS_PATHNAME = "/recurring-bills";

/** Comparators keyed by sort option, so `applyBillQuery` stays a lookup. */
const COMPARATORS: Record<
  BillSort,
  (a: RecurringBill, b: RecurringBill) => number
> = {
  latest: (a, b) => b.dueDay - a.dueDay,
  oldest: (a, b) => a.dueDay - b.dueDay,
  "a-to-z": (a, b) => a.name.localeCompare(b.name),
  "z-to-a": (a, b) => b.name.localeCompare(a.name),
  highest: (a, b) => b.amount - a.amount,
  lowest: (a, b) => a.amount - b.amount,
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseSort(value: string | undefined): BillSort {
  const match = BILL_SORT_OPTIONS.find((option) => option.value === value);

  return match?.value ?? DEFAULT_BILL_QUERY.sort;
}

/**
 * Turns raw URL search params into a validated query. Anything unrecognized
 * falls back to {@link DEFAULT_BILL_QUERY}.
 */
export function parseBillQuery(params: RawSearchParams): BillQuery {
  return {
    search: (firstValue(params.search) ?? "").trim(),
    sort: parseSort(firstValue(params.sort)),
  };
}

/**
 * Filters and sorts bills for display.
 *
 * Bills are derived from the transaction history rather than served as their
 * own collection, so unlike transactions this happens in memory.
 */
export function applyBillQuery(
  bills: ReadonlyArray<RecurringBill>,
  query: BillQuery,
): ReadonlyArray<RecurringBill> {
  const term = query.search.toLowerCase();
  const matches = term
    ? bills.filter((bill) => bill.name.toLowerCase().includes(term))
    : bills;

  return [...matches].sort(COMPARATORS[query.sort]);
}

/**
 * Builds the recurring bills URL for a query, omitting params still at their
 * default so shared links stay readable.
 *
 * @param overrides Applied on top of `query`; the original is left untouched.
 */
export function toRecurringBillsHref(
  query: BillQuery,
  overrides: Partial<BillQuery> = {},
): string {
  const { search, sort } = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (search !== DEFAULT_BILL_QUERY.search) params.set("search", search);
  if (sort !== DEFAULT_BILL_QUERY.sort) params.set("sort", sort);

  const queryString = params.toString();

  return queryString
    ? `${RECURRING_BILLS_PATHNAME}?${queryString}`
    : RECURRING_BILLS_PATHNAME;
}

/** Stable identity for a query, used to re-suspend results when it changes. */
export function toBillQueryKey(query: BillQuery): string {
  return toRecurringBillsHref(query);
}
