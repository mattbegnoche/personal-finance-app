import { z } from "zod";
import { fetchJson } from "@/lib/api/fetch-json";
import { parseApiResponse } from "@/lib/api/parse-response";

/** A savings pot the user is putting money aside in. */
export interface Pot {
  readonly id: string;
  readonly name: string;
  /** Amount saved so far. */
  readonly total: number;
  /** Amount the user is saving towards. */
  readonly target: number;
  /** Hex color used for the pot across bars and legends. */
  readonly theme: string;
}

const potSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  total: z.number().finite().nonnegative(),
  target: z.number().finite().positive(),
  theme: z.string().min(1),
});

/**
 * Fetches every savings pot.
 *
 * @throws {import("@/lib/api/fetch-json").ApiError} If the API is unreachable or errors.
 * @throws If the response does not match the expected shape.
 */
export async function fetchPots(): Promise<ReadonlyArray<Pot>> {
  return parseApiResponse(z.array(potSchema), await fetchJson("/pots"), "pots");
}
