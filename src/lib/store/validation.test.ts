import { describe, expect, test } from "vitest";
import {
  validateAmount,
  validateBudget,
  validatePot,
  type FieldErrors,
} from "./validation";
import type { FinanceData } from "./types";

const DATA: FinanceData = {
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

const VALID_BUDGET = {
  category: "Groceries",
  maximum: "200",
  theme: "#93674F",
};
const VALID_POT = { name: "Holiday", target: "1440", theme: "#826CB0" };

function errors(result: {
  ok: boolean;
  fieldErrors?: FieldErrors;
}): FieldErrors {
  return result.fieldErrors ?? {};
}

describe("validateBudget", () => {
  test("accepts a well-formed budget and returns the parsed amount", () => {
    const result = validateBudget(VALID_BUDGET, DATA);

    expect(result).toEqual({
      ok: true,
      value: { category: "Groceries", maximum: 200, theme: "#93674F" },
    });
  });

  test("strips currency formatting from the amount", () => {
    const result = validateBudget(
      { ...VALID_BUDGET, maximum: "$1,200.50" },
      DATA,
    );

    expect(result.ok && result.value.maximum).toBe(1200.5);
  });

  test("rejects a missing category", () => {
    expect(
      errors(validateBudget({ ...VALID_BUDGET, category: "" }, DATA)),
    ).toHaveProperty("category");
  });

  test("rejects a category outside the known list", () => {
    expect(
      errors(validateBudget({ ...VALID_BUDGET, category: "Yachts" }, DATA)),
    ).toHaveProperty("category");
  });

  test("rejects a category that already has a budget", () => {
    expect(
      errors(validateBudget({ ...VALID_BUDGET, category: "Bills" }, DATA))
        .category,
    ).toMatch(/already have a budget/);
  });

  test("lets a budget keep its own category while editing", () => {
    const result = validateBudget(
      { category: "Bills", maximum: "800", theme: "#82C9D7" },
      DATA,
      "budget-bills",
    );

    expect(result.ok).toBe(true);
  });

  test.each([["0"], ["-5"], ["abc"], [""]])(
    "rejects the maximum %j",
    (maximum) => {
      expect(
        errors(validateBudget({ ...VALID_BUDGET, maximum }, DATA)),
      ).toHaveProperty("maximum");
    },
  );

  test("rejects a colour outside the palette", () => {
    expect(
      errors(validateBudget({ ...VALID_BUDGET, theme: "#123456" }, DATA)),
    ).toHaveProperty("theme");
  });

  test("rejects a colour another budget already uses", () => {
    expect(
      errors(validateBudget({ ...VALID_BUDGET, theme: "#82C9D7" }, DATA)).theme,
    ).toMatch(/already used/);
  });

  test("compares colours case-insensitively", () => {
    expect(
      errors(validateBudget({ ...VALID_BUDGET, theme: "#82c9d7" }, DATA)),
    ).toHaveProperty("theme");
  });

  test("reports every bad field at once", () => {
    expect(
      Object.keys(
        errors(
          validateBudget({ category: "", maximum: "0", theme: "#000" }, DATA),
        ),
      ),
    ).toEqual(["category", "maximum", "theme"]);
  });
});

describe("validatePot", () => {
  test("accepts a well-formed pot", () => {
    expect(validatePot(VALID_POT, DATA)).toEqual({
      ok: true,
      value: { name: "Holiday", target: 1440, theme: "#826CB0" },
    });
  });

  test("rejects an empty name", () => {
    expect(
      errors(validatePot({ ...VALID_POT, name: "  " }, DATA)),
    ).toHaveProperty("name");
  });

  test("rejects a name longer than thirty characters", () => {
    expect(
      errors(validatePot({ ...VALID_POT, name: "x".repeat(31) }, DATA)),
    ).toHaveProperty("name");
  });

  test("rejects a duplicate name regardless of case", () => {
    expect(
      errors(validatePot({ ...VALID_POT, name: "savings" }, DATA)).name,
    ).toMatch(/already have a pot/);
  });

  test("lets a pot keep its own name while editing", () => {
    expect(
      validatePot(
        { name: "Savings", target: "2500", theme: "#277C78" },
        DATA,
        "pot-savings",
      ).ok,
    ).toBe(true);
  });

  test("rejects a target of zero", () => {
    expect(
      errors(validatePot({ ...VALID_POT, target: "0" }, DATA)),
    ).toHaveProperty("target");
  });
});

describe("validateAmount", () => {
  test("accepts an amount within the limit", () => {
    expect(validateAmount("50", 100, "Too much")).toEqual({
      ok: true,
      value: 50,
    });
  });

  test("accepts an amount exactly at the limit", () => {
    expect(validateAmount("100", 100, "Too much").ok).toBe(true);
  });

  test("rejects an amount over the limit with the given message", () => {
    expect(validateAmount("150", 100, "Too much")).toEqual({
      ok: false,
      fieldErrors: { amount: "Too much" },
    });
  });

  test.each([[""], ["0"], ["-5"], ["abc"]])("rejects the amount %j", (raw) => {
    expect(validateAmount(raw, 100, "Too much").ok).toBe(false);
  });

  test("strips currency formatting", () => {
    expect(validateAmount("$1,000", 2000, "Too much")).toEqual({
      ok: true,
      value: 1000,
    });
  });
});
