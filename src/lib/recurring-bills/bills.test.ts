import { describe, expect, test } from "vitest";
import { summarizeBills, toRecurringBills } from "./bills";
import type { Transaction } from "@/lib/transactions/types";

const REFERENCE = new Date("2024-08-19T20:23:11Z");

function tx(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: Math.random().toString(),
    avatar: "./assets/a.jpg",
    name: "Spark Electric Solutions",
    category: "Bills",
    date: "2024-08-02T09:25:51Z",
    amount: -100,
    recurring: true,
    ...overrides,
  };
}

describe("toRecurringBills", () => {
  test("ignores transactions that are not recurring", () => {
    expect(toRecurringBills([tx({ recurring: false })], REFERENCE)).toEqual([]);
  });

  test("ignores credits, which are not bills", () => {
    expect(toRecurringBills([tx({ amount: 100 })], REFERENCE)).toEqual([]);
  });

  test("reports the charge as a positive amount", () => {
    const [bill] = toRecurringBills([tx({ amount: -100 })], REFERENCE);

    expect(bill.amount).toBe(100);
  });

  test("collapses a merchant's monthly charges into one bill", () => {
    const bills = toRecurringBills(
      [
        tx({ date: "2024-07-02T09:25:51Z" }),
        tx({ date: "2024-08-02T09:25:51Z" }),
      ],
      REFERENCE,
    );

    expect(bills).toHaveLength(1);
  });

  test("takes the due day from the most recent charge", () => {
    const [bill] = toRecurringBills(
      [
        tx({ date: "2024-07-05T09:25:51Z" }),
        tx({ date: "2024-08-04T09:25:51Z" }),
      ],
      REFERENCE,
    );

    expect(bill.dueDay).toBe(4);
  });

  test("marks a bill already charged this month as paid", () => {
    const [bill] = toRecurringBills(
      [tx({ date: "2024-08-02T09:25:51Z" })],
      REFERENCE,
    );

    expect(bill.status).toBe("paid");
  });

  test("marks an uncharged bill falling within five days as due soon", () => {
    const [bill] = toRecurringBills(
      [tx({ name: "Nimbus", date: "2024-07-21T10:05:42Z" })],
      REFERENCE,
    );

    expect(bill.status).toBe("due-soon");
  });

  test("marks an uncharged bill further out as upcoming", () => {
    const [bill] = toRecurringBills(
      [tx({ name: "EcoFuel", date: "2024-07-29T10:05:42Z" })],
      REFERENCE,
    );

    expect(bill.status).toBe("upcoming");
  });

  test("roots the avatar path for the browser", () => {
    const [bill] = toRecurringBills([tx()], REFERENCE);

    expect(bill.avatar).toBe("/assets/a.jpg");
  });

  test("orders bills by the day they fall due", () => {
    const bills = toRecurringBills(
      [
        tx({ name: "Late", date: "2024-07-30T00:00:00Z" }),
        tx({ name: "Early", date: "2024-08-02T00:00:00Z" }),
        tx({ name: "Middle", date: "2024-07-21T00:00:00Z" }),
      ],
      REFERENCE,
    );

    expect(bills.map((bill) => bill.name)).toEqual(["Early", "Middle", "Late"]);
  });
});

describe("summarizeBills", () => {
  /** Mirrors the seed data: four paid, four unpaid, two of those due soon. */
  const SEED: ReadonlyArray<Transaction> = [
    tx({
      name: "Spark Electric Solutions",
      date: "2024-08-02T00:00:00Z",
      amount: -100,
    }),
    tx({ name: "Serenity Spa", date: "2024-08-03T00:00:00Z", amount: -30 }),
    tx({
      name: "Elevate Education",
      date: "2024-08-04T00:00:00Z",
      amount: -50,
    }),
    tx({ name: "Pixel Playground", date: "2024-08-11T00:00:00Z", amount: -10 }),
    tx({
      name: "Nimbus Data Storage",
      date: "2024-07-21T00:00:00Z",
      amount: -9.99,
    }),
    tx({ name: "ByteWise", date: "2024-07-23T00:00:00Z", amount: -49.99 }),
    tx({ name: "EcoFuel Energy", date: "2024-07-29T00:00:00Z", amount: -35 }),
    tx({
      name: "Aqua Flow Utilities",
      date: "2024-07-30T00:00:00Z",
      amount: -100,
    }),
  ];

  test("totals paid, upcoming and due-soon bills", () => {
    expect(summarizeBills(toRecurringBills(SEED, REFERENCE))).toEqual({
      paid: { count: 4, total: 190 },
      upcoming: { count: 4, total: 194.98 },
      dueSoon: { count: 2, total: 59.98 },
      monthlyTotal: 384.98,
    });
  });

  test("counts due-soon bills within the upcoming total as well", () => {
    const summary = summarizeBills(toRecurringBills(SEED, REFERENCE));

    expect(summary.upcoming.total).toBeGreaterThan(summary.dueSoon.total);
  });

  test("returns zeroes when there are no bills", () => {
    expect(summarizeBills([])).toEqual({
      paid: { count: 0, total: 0 },
      upcoming: { count: 0, total: 0 },
      dueSoon: { count: 0, total: 0 },
      monthlyTotal: 0,
    });
  });
});
