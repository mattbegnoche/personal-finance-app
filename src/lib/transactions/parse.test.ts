import { describe, expect, test } from "vitest";
import { parseTransactionsPage, toAvatarSrc } from "./parse";

const VALID_TRANSACTION = {
  id: "y8bNIKOJaFo",
  avatar: "./assets/images/avatars/savory-bites-bistro.jpg",
  name: "Savory Bites Bistro",
  category: "Dining Out",
  date: "2024-08-19T20:23:11Z",
  amount: -55.5,
  recurring: false,
};

function envelope(overrides: Record<string, unknown> = {}) {
  return {
    pages: 5,
    items: 49,
    prev: null,
    data: [VALID_TRANSACTION],
    ...overrides,
  };
}

describe("toAvatarSrc", () => {
  test("rewrites a db.json relative path to a public root path", () => {
    expect(toAvatarSrc("./assets/images/avatars/yuna-kim.jpg")).toBe(
      "/assets/images/avatars/yuna-kim.jpg",
    );
  });

  test("leaves an already-rooted path untouched", () => {
    expect(toAvatarSrc("/assets/images/avatars/yuna-kim.jpg")).toBe(
      "/assets/images/avatars/yuna-kim.jpg",
    );
  });

  test("roots a bare relative path", () => {
    expect(toAvatarSrc("assets/images/avatars/yuna-kim.jpg")).toBe(
      "/assets/images/avatars/yuna-kim.jpg",
    );
  });
});

describe("parseTransactionsPage", () => {
  test("returns the transactions with the avatar path normalized", () => {
    const page = parseTransactionsPage(envelope());

    expect(page.transactions).toEqual([
      {
        ...VALID_TRANSACTION,
        avatar: "/assets/images/avatars/savory-bites-bistro.jpg",
      },
    ]);
  });

  test("derives the current page from the previous page link", () => {
    expect(parseTransactionsPage(envelope({ prev: 4 })).page).toBe(5);
  });

  test("treats a missing previous page as the first page", () => {
    expect(parseTransactionsPage(envelope()).page).toBe(1);
  });

  test("reports no pages at all when nothing matched", () => {
    const page = parseTransactionsPage(
      envelope({ items: 0, pages: 1, data: [] }),
    );

    expect(page).toEqual({
      transactions: [],
      page: 1,
      pageCount: 0,
      totalItems: 0,
    });
  });

  test("throws when the payload is not an object", () => {
    expect(() => parseTransactionsPage("nope")).toThrow(/paginated/i);
  });

  test("throws when the data field is not an array", () => {
    expect(() => parseTransactionsPage(envelope({ data: {} }))).toThrow(
      /paginated/i,
    );
  });

  test.each([
    ["name", { name: 42 }],
    ["category", { category: null }],
    ["date", { date: "yesterday" }],
    ["amount", { amount: "-55.50" }],
    ["recurring", { recurring: "false" }],
    ["avatar", { avatar: undefined }],
  ])("throws when %s has the wrong shape", (field, override) => {
    expect(() =>
      parseTransactionsPage(
        envelope({ data: [{ ...VALID_TRANSACTION, ...override }] }),
      ),
    ).toThrow(new RegExp(field));
  });

  test("falls back to a stable id when the API omits one", () => {
    const withoutId = { ...VALID_TRANSACTION, id: undefined };
    const page = parseTransactionsPage(
      envelope({ data: [withoutId, withoutId] }),
    );

    expect(page.transactions[0].id).toBe(
      "Savory Bites Bistro-2024-08-19T20:23:11Z-0",
    );
    expect(page.transactions[1].id).not.toBe(page.transactions[0].id);
  });
});
