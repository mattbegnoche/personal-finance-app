import { z } from "zod";
import { fetchJson } from "@/lib/api/fetch-json";
import { parseApiResponse } from "@/lib/api/parse-response";

/** Account totals for the current period, as served from `db.json`. */
export interface Balance {
  readonly current: number;
  readonly income: number;
  readonly expenses: number;
}

const balanceSchema = z.object({
  current: z.number().finite(),
  income: z.number().finite(),
  expenses: z.number().finite(),
});

/**
 * Fetches the account balance summary.
 *
 * @throws {import("@/lib/api/fetch-json").ApiError} If the API is unreachable or errors.
 * @throws If the response does not match the expected shape.
 */
export async function fetchBalance(): Promise<Balance> {
  return parseApiResponse(
    balanceSchema,
    await fetchJson("/balance"),
    "balance",
  );
}
