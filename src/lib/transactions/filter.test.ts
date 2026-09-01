import { describe, expect, test } from "vitest";
import { applyTransactionQuery } from "./filter";
import { DEFAULT_TRANSACTION_QUERY, type TransactionQuery } from "./query";
import type { Transaction } from "./types";

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: Math.random().toString(),
    avatar: "/a.jpg",
    name: "Emma Richardson",
    category: "General",
    date: "2024-08-19T14:23:11Z",
    amount: 75.5,
    recurring: false,
    ...overrides,
  };
}

const HISTORY: ReadonlyArray<Transaction> = [
  tx({ name: "Emma Richardson", date: "2024-08-19T14:23:11Z", amount: 75.5 }),
  tx({
    name: "Savory Bites Bistro",
    category: "Dining Out",
    date: "2024-08-19T20:23:11Z",
    amount: -55.5,
  }),
  tx({
    name: "Aqua Flow Utilities",
    category: "Bills",
    date: "2024-07-30T11:31:05Z",
    amount: -100,
  }),
  tx({
    name: "Rina Sato",
    category: "Bills",
    date: "2024-08-02T09:25:51Z",
    amount: -50,
  }),
];

function query(overrides: Partial<TransactionQuery> = {}): TransactionQuery {
  return { ...DEFAULT_TRANSACTION_QUERY, ...overrides };
}

const names = (page: { transactions: ReadonlyArray<Transaction> }) =>
  page.transactions.map((each) => each.name);

describe("applyTransactionQuery", () => {
  test("returns everything on one page when nothing is filtered", () => {
    const page = applyTransactionQuery(HISTORY, query());

    expect(page.totalItems).toBe(4);
    expect(page.pageCount).toBe(1);
    expect(page.page).toBe(1);
  });

  test("matches the search term against the name, ignoring case", () => {
    expect(
      names(applyTransactionQuery(HISTORY, query({ search: "EMMA" }))),
    ).toEqual(["Emma Richardson"]);
  });

  test("matches on a substring anywhere in the name", () => {
    expect(
      names(applyTransactionQuery(HISTORY, query({ search: "flow" }))),
    ).toEqual(["Aqua Flow Utilities"]);
  });

  test("filters to a single category", () => {
    const page = applyTransactionQuery(HISTORY, query({ category: "Bills" }));

    expect(page.totalItems).toBe(2);
    expect(names(page)).toEqual(["Rina Sato", "Aqua Flow Utilities"]);
  });

  test("combines search and category", () => {
    const page = applyTransactionQuery(
      HISTORY,
      query({ category: "Bills", search: "rina" }),
    );

    expect(names(page)).toEqual(["Rina Sato"]);
  });

  test("reports nothing found when the filters match no transaction", () => {
    const page = applyTransactionQuery(HISTORY, query({ search: "zzzz" }));

    expect(page).toEqual({
      transactions: [],
      page: 1,
      pageCount: 0,
      totalItems: 0,
    });
  });

  test.each([
    [
      "latest",
      [
        "Savory Bites Bistro",
        "Emma Richardson",
        "Rina Sato",
        "Aqua Flow Utilities",
      ],
    ],
    [
      "oldest",
      [
        "Aqua Flow Utilities",
        "Rina Sato",
        "Emma Richardson",
        "Savory Bites Bistro",
      ],
    ],
    [
      "a-to-z",
      [
        "Aqua Flow Utilities",
        "Emma Richardson",
        "Rina Sato",
        "Savory Bites Bistro",
      ],
    ],
    [
      "z-to-a",
      [
        "Savory Bites Bistro",
        "Rina Sato",
        "Emma Richardson",
        "Aqua Flow Utilities",
      ],
    ],
  ] as const)("sorts by %s", (sort, expected) => {
    expect(names(applyTransactionQuery(HISTORY, query({ sort })))).toEqual(
      expected,
    );
  });

  test("sorts highest amount first, treating credits as the largest", () => {
    const page = applyTransactionQuery(HISTORY, query({ sort: "highest" }));

    expect(page.transactions.map((each) => each.amount)).toEqual([
      75.5, -50, -55.5, -100,
    ]);
  });

  test("sorts lowest amount first", () => {
    const page = applyTransactionQuery(HISTORY, query({ sort: "lowest" }));

    expect(page.transactions.map((each) => each.amount)).toEqual([
      -100, -55.5, -50, 75.5,
    ]);
  });

  test("splits a long list into pages of ten", () => {
    const many = Array.from({ length: 25 }, (_, index) =>
      tx({
        name: `Person ${index}`,
        date: `2024-08-${String(index + 1).padStart(2, "0")}T00:00:00Z`,
      }),
    );
    const page = applyTransactionQuery(many, query({ page: 2 }));

    expect(page.pageCount).toBe(3);
    expect(page.transactions).toHaveLength(10);
    expect(page.totalItems).toBe(25);
  });

  test("clamps a page past the end to the last page", () => {
    const many = Array.from({ length: 25 }, (_, index) =>
      tx({ name: `Person ${index}` }),
    );

    expect(applyTransactionQuery(many, query({ page: 99 })).page).toBe(3);
  });

  test("leaves the input array untouched", () => {
    const original = HISTORY.map((each) => each.name);
    applyTransactionQuery(HISTORY, query({ sort: "a-to-z" }));

    expect(HISTORY.map((each) => each.name)).toEqual(original);
  });
});
