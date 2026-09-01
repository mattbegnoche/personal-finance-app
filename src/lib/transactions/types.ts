/** A single money movement. Mirrors the shape served from `db.json`. */
export interface Transaction {
  /** Identifier assigned by json-server, or derived when the API omits one. */
  readonly id: string;
  /** Public-root path to the counterparty's avatar, e.g. `/assets/images/avatars/…`. */
  readonly avatar: string;
  /** Recipient for a debit, sender for a credit. */
  readonly name: string;
  /**
   * Category label as returned by the API. Kept as a plain string so a category
   * the filter does not yet list still renders instead of failing validation.
   */
  readonly category: string;
  /** ISO 8601 timestamp in UTC. */
  readonly date: string;
  /** Negative for money out, positive for money in. */
  readonly amount: number;
  readonly recurring: boolean;
}

/** One page of transactions, as returned by {@link import("./api").fetchTransactions}. */
export interface TransactionsPage {
  readonly transactions: readonly Transaction[];
  /** 1-based index of the page actually returned. */
  readonly page: number;
  /** Total pages available, or `0` when nothing matched. */
  readonly pageCount: number;
  readonly totalItems: number;
}

/** Categories the API assigns, in the order the filter lists them. */
export const TRANSACTION_CATEGORIES = [
  "Entertainment",
  "Bills",
  "Groceries",
  "Dining Out",
  "Transportation",
  "Personal Care",
  "Education",
  "Lifestyle",
  "Shopping",
  "General",
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export function isTransactionCategory(
  value: unknown,
): value is TransactionCategory {
  return TRANSACTION_CATEGORIES.includes(value as TransactionCategory);
}
