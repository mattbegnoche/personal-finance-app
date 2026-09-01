import { roundCurrency } from "@/lib/format";
import type { FinanceData } from "./types";
import type { BudgetValues, PotValues } from "./validation";

/** Ids for records the user creates. Seed records use content-derived ids. */
function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function addBudget(
  data: FinanceData,
  values: BudgetValues,
): FinanceData {
  return {
    ...data,
    budgets: [...data.budgets, { ...values, id: newId("budget") }],
  };
}

export function updateBudget(
  data: FinanceData,
  id: string,
  values: BudgetValues,
): FinanceData {
  return {
    ...data,
    budgets: data.budgets.map((budget) =>
      budget.id === id ? { ...budget, ...values } : budget,
    ),
  };
}

export function deleteBudget(data: FinanceData, id: string): FinanceData {
  return {
    ...data,
    budgets: data.budgets.filter((budget) => budget.id !== id),
  };
}

export function addPot(data: FinanceData, values: PotValues): FinanceData {
  return {
    ...data,
    pots: [...data.pots, { ...values, total: 0, id: newId("pot") }],
  };
}

export function updatePot(
  data: FinanceData,
  id: string,
  values: PotValues,
): FinanceData {
  return {
    ...data,
    pots: data.pots.map((pot) => (pot.id === id ? { ...pot, ...values } : pot)),
  };
}

/** Removing a pot returns whatever it held to the available balance. */
export function deletePot(data: FinanceData, id: string): FinanceData {
  const pot = data.pots.find((each) => each.id === id);

  if (!pot) return data;

  return {
    ...data,
    balance: {
      ...data.balance,
      current: roundCurrency(data.balance.current + pot.total),
    },
    pots: data.pots.filter((each) => each.id !== id),
  };
}

/** Moves money out of the balance and into a pot. */
export function depositToPot(
  data: FinanceData,
  id: string,
  amount: number,
): FinanceData {
  if (!data.pots.some((pot) => pot.id === id)) return data;

  return {
    ...data,
    balance: {
      ...data.balance,
      current: roundCurrency(data.balance.current - amount),
    },
    pots: data.pots.map((pot) =>
      pot.id === id
        ? { ...pot, total: roundCurrency(pot.total + amount) }
        : pot,
    ),
  };
}

/** Moves money out of a pot and back into the balance. */
export function withdrawFromPot(
  data: FinanceData,
  id: string,
  amount: number,
): FinanceData {
  if (!data.pots.some((pot) => pot.id === id)) return data;

  return {
    ...data,
    balance: {
      ...data.balance,
      current: roundCurrency(data.balance.current + amount),
    },
    pots: data.pots.map((pot) =>
      pot.id === id
        ? { ...pot, total: roundCurrency(pot.total - amount) }
        : pot,
    ),
  };
}
