import { z } from "zod";
import { fetchJson } from "@/lib/api/fetch-json";
import { parseApiResponse } from "@/lib/api/parse-response";

/**
 * A monthly spending limit for one category.
 *
 * The API stores only the limit — what has been spent against it is derived
 * from transactions, see {@link import("./spending").toBudgetsWithSpending}.
 */
export interface Budget {
  readonly id: string;
  readonly category: string;
  /** Spending limit for the category, per month. */
  readonly maximum: number;
  /** Hex color used for the category across charts and legends. */
  readonly theme: string;
}

const budgetSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  maximum: z.number().finite().positive(),
  theme: z.string().min(1),
});

/**
 * Fetches every budget.
 *
 * @throws {import("@/lib/api/fetch-json").ApiError} If the API is unreachable or errors.
 * @throws If the response does not match the expected shape.
 */
export async function fetchBudgets(): Promise<ReadonlyArray<Budget>> {
  return parseApiResponse(
    z.array(budgetSchema),
    await fetchJson("/budgets"),
    "budgets",
  );
}
