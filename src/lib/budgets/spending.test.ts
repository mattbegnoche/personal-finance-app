import { describe, expect, test } from "vitest";
import {
  latestSpendingIn,
  sumBudgets,
  toBudgetsWithSpending,
} from "./spending";
import type { Budget } from "./api";
import type { Transaction } from "@/lib/transactions/types";

const REFERENCE = new Date("2024-08-19T20:23:11Z");

const BUDGETS: ReadonlyArray<Budget> = [
  { id: "1", category: "Entertainment", maximum: 50, theme: "#277C78" },
  { id: "2", category: "Dining Out", maximum: 75, theme: "#F2CDAC" },
];

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: Math.random().toString(),
    avatar: "/a.jpg",
    name: "Someone",
    category: "Entertainment",
    date: "2024-08-11T15:45:38Z",
    amount: -10,
    recurring: false,
    ...overrides,
  };
}

describe("toBudgetsWithSpending", () => {
  test("sums debits in the category as a positive spent amount", () => {
    const [entertainment] = toBudgetsWithSpending(
      [BUDGETS[0]],
      [tx({ amount: -10 }), tx({ amount: -5 })],
      REFERENCE,
    );

    expect(entertainment.spent).toBe(15);
  });

  test("ignores credits, which are income rather than spending", () => {
    const [entertainment] = toBudgetsWithSpending(
      [BUDGETS[0]],
      [tx({ amount: -10 }), tx({ amount: 100 })],
      REFERENCE,
    );

    expect(entertainment.spent).toBe(10);
  });

  test("ignores transactions from other categories", () => {
    const [entertainment] = toBudgetsWithSpending(
      [BUDGETS[0]],
      [tx({ amount: -10 }), tx({ category: "Bills", amount: -500 })],
      REFERENCE,
    );

    expect(entertainment.spent).toBe(10);
  });

  test("ignores transactions outside the reference month", () => {
    const [entertainment] = toBudgetsWithSpending(
      [BUDGETS[0]],
      [tx({ amount: -10 }), tx({ date: "2024-07-11T15:45:38Z", amount: -40 })],
      REFERENCE,
    );

    expect(entertainment.spent).toBe(10);
  });

  test("reports what is left of the limit", () => {
    const [entertainment] = toBudgetsWithSpending(
      [BUDGETS[0]],
      [tx({ amount: -20 })],
      REFERENCE,
    );

    expect(entertainment.remaining).toBe(30);
    expect(entertainment.isOverBudget).toBe(false);
  });

  test("clamps remaining at zero and flags a category that is over budget", () => {
    const [dining] = toBudgetsWithSpending(
      [BUDGETS[1]],
      [tx({ category: "Dining Out", amount: -133 })],
      REFERENCE,
    );

    expect(dining.spent).toBe(133);
    expect(dining.remaining).toBe(0);
    expect(dining.isOverBudget).toBe(true);
  });

  test("reports zero spending for a budget with no transactions", () => {
    const [entertainment] = toBudgetsWithSpending([BUDGETS[0]], [], REFERENCE);

    expect(entertainment.spent).toBe(0);
    expect(entertainment.remaining).toBe(50);
  });

  test("keeps the budget's own fields", () => {
    const [entertainment] = toBudgetsWithSpending([BUDGETS[0]], [], REFERENCE);

    expect(entertainment).toMatchObject({
      id: "1",
      category: "Entertainment",
      maximum: 50,
      theme: "#277C78",
    });
  });

  test("rounds away floating point drift from summing decimals", () => {
    const [entertainment] = toBudgetsWithSpending(
      [BUDGETS[0]],
      [tx({ amount: -0.1 }), tx({ amount: -0.2 })],
      REFERENCE,
    );

    expect(entertainment.spent).toBe(0.3);
  });
});

describe("sumBudgets", () => {
  test("totals spending and limits across every budget", () => {
    const budgets = toBudgetsWithSpending(
      BUDGETS,
      [tx({ amount: -10 }), tx({ category: "Dining Out", amount: -25 })],
      REFERENCE,
    );

    expect(sumBudgets(budgets)).toEqual({ spent: 35, maximum: 125 });
  });

  test("totals to zero when there are no budgets", () => {
    expect(sumBudgets([])).toEqual({ spent: 0, maximum: 0 });
  });
});

describe("latestSpendingIn", () => {
  const HISTORY = [
    tx({
      category: "Entertainment",
      name: "Newest",
      date: "2024-08-11T00:00:00Z",
    }),
    tx({ category: "Bills", name: "Other category" }),
    tx({
      category: "Entertainment",
      name: "Middle",
      date: "2024-08-01T00:00:00Z",
    }),
    tx({ category: "Entertainment", name: "Credit", amount: 40 }),
    tx({
      category: "Entertainment",
      name: "Oldest",
      date: "2024-07-01T00:00:00Z",
    }),
  ];

  test("keeps only debits in the requested category", () => {
    expect(
      latestSpendingIn(HISTORY, "Entertainment", 10).map((t) => t.name),
    ).toEqual(["Newest", "Middle", "Oldest"]);
  });

  test("caps the list at the requested limit", () => {
    expect(latestSpendingIn(HISTORY, "Entertainment", 2)).toHaveLength(2);
  });

  test("returns nothing for a category with no spending", () => {
    expect(latestSpendingIn(HISTORY, "Groceries", 3)).toEqual([]);
  });
});
