import { describe, expect, test } from "vitest";
import { SEED_DATA, parseSeed, toAvatarSrc } from "./seed";
import { toBudgetsData } from "@/lib/budgets/load";
import { sumBudgets } from "@/lib/budgets/spending";
import { toRecurringBillsData } from "@/lib/recurring-bills/load";

describe("toAvatarSrc", () => {
  test("rewrites a relative seed path to a public root path", () => {
    expect(toAvatarSrc("./assets/images/avatars/yuna-kim.jpg")).toBe(
      "/assets/images/avatars/yuna-kim.jpg",
    );
  });

  test("leaves an already-rooted path untouched", () => {
    expect(toAvatarSrc("/assets/a.jpg")).toBe("/assets/a.jpg");
  });
});

describe("parseSeed", () => {
  test("rejects a payload that is not the expected shape", () => {
    expect(() => parseSeed({ balance: {} })).toThrow(/db\.json/);
  });

  test("rejects a transaction with a bad date", () => {
    expect(() =>
      parseSeed({
        balance: { current: 0, income: 0, expenses: 0 },
        transactions: [
          {
            avatar: "./a.jpg",
            name: "X",
            category: "General",
            date: "whenever",
            amount: -1,
            recurring: false,
          },
        ],
        budgets: [],
        pots: [],
      }),
    ).toThrow(/date/);
  });

  test("gives every record an id derived from its content", () => {
    const data = parseSeed({
      balance: { current: 0, income: 0, expenses: 0 },
      transactions: [],
      budgets: [{ category: "Dining Out", maximum: 75, theme: "#F2CDAC" }],
      pots: [{ name: "New Laptop", target: 1000, total: 10, theme: "#F2CDAC" }],
    });

    expect(data.budgets[0].id).toBe("budget-dining-out");
    expect(data.pots[0].id).toBe("pot-new-laptop");
  });

  test("orders transactions newest first", () => {
    const dates = SEED_DATA.transactions.map((each) => each.date);

    expect([...dates].sort((a, b) => b.localeCompare(a))).toEqual(dates);
  });
});

/** Guards the whole derivation chain against a change in the bundled data. */
describe("the bundled sample data", () => {
  test("loads without throwing", () => {
    expect(SEED_DATA.transactions).toHaveLength(49);
    expect(SEED_DATA.budgets).toHaveLength(4);
    expect(SEED_DATA.pots).toHaveLength(5);
  });

  test("roots every avatar path", () => {
    expect(
      SEED_DATA.transactions.every((each) => each.avatar.startsWith("/assets/")),
    ).toBe(true);
  });

  test("derives the month's budget spending", () => {
    const budgets = toBudgetsData(SEED_DATA);

    expect(sumBudgets(budgets)).toEqual({ spent: 338, maximum: 975 });
    expect(
      budgets.map((each) => [each.category, each.spent, each.isOverBudget]),
    ).toEqual([
      ["Entertainment", 15, false],
      ["Bills", 150, false],
      ["Dining Out", 133, true],
      ["Personal Care", 40, false],
    ]);
  });

  test("derives the month's recurring bills", () => {
    const { bills, summary } = toRecurringBillsData(SEED_DATA);

    expect(bills).toHaveLength(8);
    expect(summary).toEqual({
      paid: { count: 4, total: 190 },
      upcoming: { count: 4, total: 194.98 },
      dueSoon: { count: 2, total: 59.98 },
      monthlyTotal: 384.98,
    });
  });
});

describe("ids on the way back out of storage", () => {
  const base = {
    balance: { current: 0, income: 0, expenses: 0 },
    transactions: [],
    budgets: [],
  };

  test("keeps an id a record already carries", () => {
    const data = parseSeed({
      ...base,
      pots: [
        { id: "pot-abc123", name: "Rainy Days", target: 500, total: 0, theme: "#3F82B2" },
      ],
    });

    expect(data.pots[0].id).toBe("pot-abc123");
  });

  test("keeps derived ids unique when two names slugify the same", () => {
    const data = parseSeed({
      ...base,
      pots: [
        { name: "Rainy Days", target: 500, total: 0, theme: "#3F82B2" },
        { name: "Rainy-Days", target: 500, total: 0, theme: "#CAB361" },
      ],
    });

    expect(data.pots.map((each) => each.id)).toEqual([
      "pot-rainy-days",
      "pot-rainy-days-2",
    ]);
  });
});
