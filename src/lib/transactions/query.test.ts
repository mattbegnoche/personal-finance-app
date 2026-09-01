import { describe, expect, test } from "vitest";
import {
  ALL_CATEGORIES,
  DEFAULT_TRANSACTION_QUERY,
  parseTransactionQuery,
  toTransactionsHref,
  toTransactionsQueryKey,
} from "./query";

describe("parseTransactionQuery", () => {
  test("falls back to defaults when nothing is supplied", () => {
    expect(parseTransactionQuery({})).toEqual(DEFAULT_TRANSACTION_QUERY);
  });

  test("reads search, category, sort and page from the params", () => {
    expect(
      parseTransactionQuery({
        search: "emma",
        category: "Dining Out",
        sort: "highest",
        page: "3",
      }),
    ).toEqual({
      search: "emma",
      category: "Dining Out",
      sort: "highest",
      page: 3,
    });
  });

  test("trims surrounding whitespace from the search term", () => {
    expect(parseTransactionQuery({ search: "  emma  " }).search).toBe("emma");
  });

  test("takes the first value when a param is repeated", () => {
    expect(parseTransactionQuery({ sort: ["oldest", "latest"] }).sort).toBe(
      "oldest",
    );
  });

  test("rejects a sort value outside the known options", () => {
    expect(parseTransactionQuery({ sort: "sideways" }).sort).toBe(
      DEFAULT_TRANSACTION_QUERY.sort,
    );
  });

  test("rejects a category outside the known list", () => {
    expect(parseTransactionQuery({ category: "Yachts" }).category).toBe(
      ALL_CATEGORIES,
    );
  });

  test.each([["0"], ["-2"], ["abc"], ["1.5"], [""]])(
    "falls back to page 1 for the invalid page %j",
    (page) => {
      expect(parseTransactionQuery({ page }).page).toBe(1);
    },
  );
});

describe("toTransactionsHref", () => {
  test("omits every param that is still at its default", () => {
    expect(toTransactionsHref(DEFAULT_TRANSACTION_QUERY)).toBe("/transactions");
  });

  test("serializes only the params that differ from the defaults", () => {
    expect(
      toTransactionsHref({
        search: "emma",
        category: ALL_CATEGORIES,
        sort: "latest",
        page: 2,
      }),
    ).toBe("/transactions?search=emma&page=2");
  });

  test("encodes values that are not URL safe", () => {
    expect(
      toTransactionsHref({
        ...DEFAULT_TRANSACTION_QUERY,
        category: "Dining Out",
      }),
    ).toBe("/transactions?category=Dining+Out");
  });

  test("applies overrides on top of a base query without mutating it", () => {
    const base = { ...DEFAULT_TRANSACTION_QUERY, search: "emma", page: 4 };

    expect(toTransactionsHref(base, { page: 1 })).toBe(
      "/transactions?search=emma",
    );
    expect(base.page).toBe(4);
  });
});

describe("toTransactionsQueryKey", () => {
  test("produces the same key for equal queries", () => {
    const query = { ...DEFAULT_TRANSACTION_QUERY, search: "emma" };

    expect(toTransactionsQueryKey(query)).toBe(
      toTransactionsQueryKey({ ...query }),
    );
  });

  test("produces different keys when any field differs", () => {
    expect(toTransactionsQueryKey(DEFAULT_TRANSACTION_QUERY)).not.toBe(
      toTransactionsQueryKey({ ...DEFAULT_TRANSACTION_QUERY, page: 2 }),
    );
  });
});
