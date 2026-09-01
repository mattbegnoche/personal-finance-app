import { z } from "zod";
// The challenge's sample data. Bundled at build time — there is no backend, so
// this is the starting point every visitor sees before they change anything.
import rawSeed from "../../../db.json";
import type { FinanceData } from "./types";

/** Avatar paths in the seed are relative (`./assets/…`); the browser needs them rooted. */
export function toAvatarSrc(avatar: string): string {
  return `/${avatar.replace(/^\.?\/*/, "")}`;
}

/** Lower-cased, hyphenated, punctuation stripped — for readable stable ids. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Ids are absent in `db.json` and present in anything read back from storage. */
const idSchema = z.string().min(1).optional();

const transactionSchema = z.object({
  id: idSchema,
  avatar: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  date: z.iso.datetime(),
  amount: z.number().finite(),
  recurring: z.boolean(),
});

const budgetSchema = z.object({
  id: idSchema,
  category: z.string().min(1),
  maximum: z.number().finite().positive(),
  theme: z.string().min(1),
});

const potSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  target: z.number().finite().positive(),
  total: z.number().finite().nonnegative(),
  theme: z.string().min(1),
});

const seedSchema = z.object({
  balance: z.object({
    current: z.number().finite(),
    income: z.number().finite(),
    expenses: z.number().finite(),
  }),
  transactions: z.array(transactionSchema),
  budgets: z.array(budgetSchema),
  pots: z.array(potSchema),
});

/**
 * Keeps an id a record already carries, otherwise derives a readable one.
 *
 * Preserving ids matters on the way back out of storage: a record the visitor
 * created would otherwise be renamed on every reload. `taken` guards the
 * derived case, since two different names can slugify to the same string.
 */
function toId(
  existing: string | undefined,
  prefix: string,
  source: string,
  taken: Set<string>,
): string {
  if (existing !== undefined) return existing;

  const base = `${prefix}-${slugify(source)}`;
  let candidate = base;

  for (let suffix = 2; taken.has(candidate); suffix += 1) {
    candidate = `${base}-${suffix}`;
  }

  taken.add(candidate);

  return candidate;
}

/**
 * Validates and normalizes finance data, from `db.json` or from storage.
 *
 * @throws If the payload does not match the expected shape.
 */
export function parseSeed(value: unknown): FinanceData {
  const result = seedSchema.safeParse(value);

  if (!result.success) {
    throw new Error(
      `db.json does not match the expected shape — ${result.error.issues
        .map(
          (issue) => `${issue.path.join(".") || "payload"}: ${issue.message}`,
        )
        .join("; ")}`,
    );
  }

  const { balance, transactions, budgets, pots } = result.data;
  const budgetIds = new Set<string>();
  const potIds = new Set<string>();

  return {
    balance,
    transactions: transactions
      .map((transaction, index) => ({
        ...transaction,
        id: transaction.id ?? `tx-${index}`,
        avatar: toAvatarSrc(transaction.avatar),
      }))
      .sort((a, b) => b.date.localeCompare(a.date)),
    budgets: budgets.map((budget) => ({
      ...budget,
      id: toId(budget.id, "budget", budget.category, budgetIds),
    })),
    pots: pots.map((pot) => ({
      ...pot,
      id: toId(pot.id, "pot", pot.name, potIds),
    })),
  };
}

/** The starting state for a visitor who has not changed anything yet. */
export const SEED_DATA: FinanceData = parseSeed(rawSeed);
