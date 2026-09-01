import { describe, expect, test } from "vitest";
import {
  DEFAULT_BILL_QUERY,
  applyBillQuery,
  parseBillQuery,
  toRecurringBillsHref,
} from "./query";
import type { RecurringBill } from "./bills";

function bill(overrides: Partial<RecurringBill>): RecurringBill {
  return {
    id: Math.random().toString(),
    name: "Spark Electric Solutions",
    avatar: "/a.jpg",
    category: "Bills",
    amount: 100,
    dueDay: 2,
    status: "paid",
    ...overrides,
  };
}

const BILLS: ReadonlyArray<RecurringBill> = [
  bill({ name: "Aqua Flow Utilities", amount: 100, dueDay: 30 }),
  bill({ name: "ByteWise", amount: 49.99, dueDay: 23 }),
  bill({ name: "Spark Electric Solutions", amount: 100, dueDay: 2 }),
  bill({ name: "Nimbus Data Storage", amount: 9.99, dueDay: 21 }),
];

const names = (bills: ReadonlyArray<RecurringBill>) =>
  bills.map((each) => each.name);

describe("parseBillQuery", () => {
  test("falls back to defaults when nothing is supplied", () => {
    expect(parseBillQuery({})).toEqual(DEFAULT_BILL_QUERY);
  });

  test("reads search and sort from the params", () => {
    expect(parseBillQuery({ search: "aqua", sort: "highest" })).toEqual({
      search: "aqua",
      sort: "highest",
    });
  });

  test("trims the search term", () => {
    expect(parseBillQuery({ search: "  aqua  " }).search).toBe("aqua");
  });

  test("rejects a sort value outside the known options", () => {
    expect(parseBillQuery({ sort: "sideways" }).sort).toBe(
      DEFAULT_BILL_QUERY.sort,
    );
  });

  test("takes the first value when a param is repeated", () => {
    expect(parseBillQuery({ sort: ["oldest", "latest"] }).sort).toBe("oldest");
  });
});

describe("applyBillQuery", () => {
  test("matches the search term against the name, ignoring case", () => {
    expect(
      names(applyBillQuery(BILLS, { ...DEFAULT_BILL_QUERY, search: "BYTE" })),
    ).toEqual(["ByteWise"]);
  });

  test("matches on a substring anywhere in the name", () => {
    expect(
      names(applyBillQuery(BILLS, { ...DEFAULT_BILL_QUERY, search: "flow" })),
    ).toEqual(["Aqua Flow Utilities"]);
  });

  test("returns nothing when the search matches no bill", () => {
    expect(
      applyBillQuery(BILLS, { ...DEFAULT_BILL_QUERY, search: "zzzz" }),
    ).toEqual([]);
  });

  test("sorts latest first by due day", () => {
    expect(
      names(applyBillQuery(BILLS, { search: "", sort: "latest" })),
    ).toEqual([
      "Aqua Flow Utilities",
      "ByteWise",
      "Nimbus Data Storage",
      "Spark Electric Solutions",
    ]);
  });

  test("sorts oldest first by due day", () => {
    expect(
      names(applyBillQuery(BILLS, { search: "", sort: "oldest" })),
    ).toEqual([
      "Spark Electric Solutions",
      "Nimbus Data Storage",
      "ByteWise",
      "Aqua Flow Utilities",
    ]);
  });

  test("sorts A to Z by name", () => {
    expect(
      names(applyBillQuery(BILLS, { search: "", sort: "a-to-z" })),
    ).toEqual([
      "Aqua Flow Utilities",
      "ByteWise",
      "Nimbus Data Storage",
      "Spark Electric Solutions",
    ]);
  });

  test("sorts Z to A by name", () => {
    expect(
      names(applyBillQuery(BILLS, { search: "", sort: "z-to-a" }))[0],
    ).toBe("Spark Electric Solutions");
  });

  test("sorts highest amount first", () => {
    expect(
      applyBillQuery(BILLS, { search: "", sort: "highest" }).map(
        (b) => b.amount,
      ),
    ).toEqual([100, 100, 49.99, 9.99]);
  });

  test("sorts lowest amount first", () => {
    expect(
      applyBillQuery(BILLS, { search: "", sort: "lowest" }).map(
        (b) => b.amount,
      ),
    ).toEqual([9.99, 49.99, 100, 100]);
  });

  test("leaves the input array untouched", () => {
    const original = names(BILLS);
    applyBillQuery(BILLS, { search: "", sort: "a-to-z" });

    expect(names(BILLS)).toEqual(original);
  });
});

describe("toRecurringBillsHref", () => {
  test("omits params still at their default", () => {
    expect(toRecurringBillsHref(DEFAULT_BILL_QUERY)).toBe("/recurring-bills");
  });

  test("serializes only what differs from the defaults", () => {
    expect(toRecurringBillsHref({ search: "aqua", sort: "latest" })).toBe(
      "/recurring-bills?search=aqua",
    );
  });

  test("applies overrides without mutating the base query", () => {
    const base = { ...DEFAULT_BILL_QUERY, search: "aqua" };

    expect(toRecurringBillsHref(base, { sort: "highest" })).toBe(
      "/recurring-bills?search=aqua&sort=highest",
    );
    expect(base.sort).toBe("latest");
  });
});
