import { describe, expect, test } from "vitest";
import {
  addBudget,
  addPot,
  deleteBudget,
  deletePot,
  depositToPot,
  updateBudget,
  updatePot,
  withdrawFromPot,
} from "./mutations";
import type { FinanceData } from "./types";

function makeData(): FinanceData {
  return {
    balance: { current: 1000, income: 3000, expenses: 2000 },
    transactions: [],
    budgets: [
      { id: "budget-bills", category: "Bills", maximum: 750, theme: "#82C9D7" },
    ],
    pots: [
      {
        id: "pot-savings",
        name: "Savings",
        total: 159,
        target: 2000,
        theme: "#277C78",
      },
    ],
  };
}

const BUDGET_VALUES = {
  category: "Groceries",
  maximum: 200,
  theme: "#93674F",
};
const POT_VALUES = { name: "Holiday", target: 1440, theme: "#826CB0" };

describe("budget mutations", () => {
  test("addBudget appends a budget with a generated id", () => {
    const next = addBudget(makeData(), BUDGET_VALUES);

    expect(next.budgets).toHaveLength(2);
    expect(next.budgets[1]).toMatchObject(BUDGET_VALUES);
    expect(next.budgets[1].id).toMatch(/^budget-/);
  });

  test("addBudget leaves the original untouched", () => {
    const data = makeData();
    addBudget(data, BUDGET_VALUES);

    expect(data.budgets).toHaveLength(1);
  });

  test("updateBudget replaces the named budget's values", () => {
    const next = updateBudget(makeData(), "budget-bills", BUDGET_VALUES);

    expect(next.budgets[0]).toEqual({ id: "budget-bills", ...BUDGET_VALUES });
  });

  test("updateBudget ignores an id that is not there", () => {
    const data = makeData();

    expect(updateBudget(data, "nope", BUDGET_VALUES).budgets).toEqual(
      data.budgets,
    );
  });

  test("deleteBudget removes just that budget", () => {
    expect(deleteBudget(makeData(), "budget-bills").budgets).toEqual([]);
  });

  test("deleteBudget leaves the original untouched", () => {
    const data = makeData();
    deleteBudget(data, "budget-bills");

    expect(data.budgets).toHaveLength(1);
  });
});

describe("pot mutations", () => {
  test("addPot starts the new pot empty", () => {
    const next = addPot(makeData(), POT_VALUES);

    expect(next.pots[1]).toMatchObject({ ...POT_VALUES, total: 0 });
    expect(next.pots[1].id).toMatch(/^pot-/);
  });

  test("updatePot keeps the amount already saved", () => {
    const next = updatePot(makeData(), "pot-savings", POT_VALUES);

    expect(next.pots[0]).toEqual({
      id: "pot-savings",
      ...POT_VALUES,
      total: 159,
    });
  });

  test("deletePot returns the pot's money to the balance", () => {
    const next = deletePot(makeData(), "pot-savings");

    expect(next.pots).toEqual([]);
    expect(next.balance.current).toBe(1159);
  });

  test("deletePot ignores an id that is not there", () => {
    const data = makeData();

    expect(deletePot(data, "nope")).toBe(data);
  });
});

describe("moving money in and out of a pot", () => {
  test("depositToPot moves money from the balance into the pot", () => {
    const next = depositToPot(makeData(), "pot-savings", 50);

    expect(next.pots[0].total).toBe(209);
    expect(next.balance.current).toBe(950);
  });

  test("withdrawFromPot moves money from the pot back to the balance", () => {
    const next = withdrawFromPot(makeData(), "pot-savings", 59);

    expect(next.pots[0].total).toBe(100);
    expect(next.balance.current).toBe(1059);
  });

  test("a deposit followed by an equal withdrawal is a round trip", () => {
    const data = makeData();
    const next = withdrawFromPot(
      depositToPot(data, "pot-savings", 33.33),
      "pot-savings",
      33.33,
    );

    expect(next.pots[0].total).toBe(data.pots[0].total);
    expect(next.balance.current).toBe(data.balance.current);
  });

  test("amounts stay rounded to whole cents", () => {
    const next = depositToPot(makeData(), "pot-savings", 0.1);

    expect(next.pots[0].total).toBe(159.1);
  });

  test("moving money leaves the original untouched", () => {
    const data = makeData();
    depositToPot(data, "pot-savings", 50);

    expect(data.pots[0].total).toBe(159);
    expect(data.balance.current).toBe(1000);
  });

  test("ignores an id that is not there", () => {
    const data = makeData();

    expect(depositToPot(data, "nope", 50)).toBe(data);
    expect(withdrawFromPot(data, "nope", 50)).toBe(data);
  });
});
