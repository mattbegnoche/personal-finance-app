import type { RawSearchParams } from "@/lib/transactions/query";

/**
 * Flattens `useSearchParams`' read-only params into the plain record the query
 * parsers take, so the same parser serves both the URL and a page's props.
 */
export function toRawSearchParams(
  params: URLSearchParams | ReadonlyURLSearchParamsLike,
): RawSearchParams {
  const record: Record<string, string | string[] | undefined> = {};

  params.forEach((value, key) => {
    record[key] = value;
  });

  return record;
}

/** The read-only shape `next/navigation` returns; only `forEach` is needed. */
interface ReadonlyURLSearchParamsLike {
  forEach(callback: (value: string, key: string) => void): void;
}
