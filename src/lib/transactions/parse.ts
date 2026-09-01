import { z } from "zod";
import { parseApiResponse } from "@/lib/api/parse-response";
import type { Transaction, TransactionsPage } from "./types";

/** Avatar paths in `db.json` are relative (`./assets/…`); the browser needs them rooted. */
export function toAvatarSrc(avatar: string): string {
  return `/${avatar.replace(/^\.?\/*/, "")}`;
}

const transactionSchema = z.object({
  id: z.string().min(1).optional(),
  avatar: z.string().min(1),
  name: z.string().min(1),
  // Deliberately a plain string: a category the filter does not yet list should
  // still render rather than failing the whole page.
  category: z.string().min(1),
  date: z.iso.datetime(),
  amount: z.number().finite(),
  recurring: z.boolean(),
});

/** json-server's paginated envelope. Only the fields the UI needs are read. */
const transactionsPageSchema = z.object({
  data: z.array(transactionSchema),
  items: z.number().int().nonnegative().catch(0),
  pages: z.number().int().nonnegative().catch(0),
  /** `null` on the first page; otherwise the page before the one served. */
  prev: z.number().int().positive().nullable().catch(null),
});

function toTransaction(
  record: z.infer<typeof transactionSchema>,
  index: number,
): Transaction {
  return {
    // json-server assigns ids, but a plain JSON file served another way may not.
    id: record.id ?? `${record.name}-${record.date}-${index}`,
    avatar: toAvatarSrc(record.avatar),
    name: record.name,
    category: record.category,
    date: record.date,
    amount: record.amount,
    recurring: record.recurring,
  };
}

/**
 * Validates json-server's paginated envelope and flattens it for the UI.
 *
 * The envelope reports `prev`/`next`/`pages` but not the page it served, so the
 * current page is derived from `prev` — json-server clamps out-of-range
 * requests, and this reflects the page actually returned.
 *
 * @throws If the payload is not a paginated envelope, or a record is malformed.
 */
export function parseTransactionsPage(value: unknown): TransactionsPage {
  const { data, items, pages, prev } = parseApiResponse(
    transactionsPageSchema,
    value,
    "paginated transactions",
  );

  return {
    transactions: data.map(toTransaction),
    page: (prev ?? 0) + 1,
    // An empty result still reports one page; the UI treats that as no pages.
    pageCount: items === 0 ? 0 : pages,
    totalItems: items,
  };
}

/**
 * Validates an unpaginated transactions array.
 *
 * @throws If the payload is not an array of valid transactions.
 */
export function parseTransactionList(
  value: unknown,
): ReadonlyArray<Transaction> {
  return parseApiResponse(
    z.array(transactionSchema),
    value,
    "transactions",
  ).map(toTransaction);
}
