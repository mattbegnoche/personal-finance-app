import { unstable_rethrow } from "next/navigation";

import { API_BASE_URL } from "./config";

/** A request to the API failed. `message` is safe to show to a user. */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = "ApiError";
    this.status = options?.status;
  }
}

/**
 * Fetches JSON from the mock API.
 *
 * Returns `unknown` on purpose — callers are expected to validate the payload
 * before using it, since nothing about an external response is guaranteed.
 *
 * Requests are uncached, which also keeps the routes that use them out of the
 * static shell. Without it a page like the Overview would prerender at build
 * time and serve balances frozen at that moment.
 *
 * @param path Path and query string, e.g. `/transactions?_page=1`.
 * @throws {ApiError} If the request fails, the status is not OK, or the body is not JSON.
 */
export async function fetchJson(
  path: string,
  init?: RequestInit,
): Promise<unknown> {
  const url = `${API_BASE_URL}${path}`;
  let response: Response;

  try {
    response = await fetch(url, { cache: "no-store", ...init });
  } catch (cause) {
    // An uncached fetch is how Next.js signals a route out of the static shell.
    // That control-flow error must reach the framework, not become an ApiError.
    unstable_rethrow(cause);

    console.error(`[api] request to ${url} failed`, cause);
    throw new ApiError(
      "Could not reach the finance API. Start it with `pnpm server` and try again.",
      { cause },
    );
  }

  if (!response.ok) {
    console.error(`[api] ${url} responded ${response.status}`);
    throw new ApiError(
      `The finance API responded with ${response.status}. Please try again.`,
      { status: response.status },
    );
  }

  try {
    return await response.json();
  } catch (cause) {
    unstable_rethrow(cause);

    console.error(`[api] ${url} returned a body that is not JSON`, cause);
    throw new ApiError("The finance API returned an unreadable response.", {
      cause,
    });
  }
}
