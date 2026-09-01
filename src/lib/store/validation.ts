import { THEMES } from "@/lib/themes";
import { TRANSACTION_CATEGORIES } from "@/lib/transactions/types";
import type { FinanceData } from "./types";

/** Field name → message, for rendering errors beside the inputs that caused them. */
export type FieldErrors = Record<string, string>;

export type Validated<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly fieldErrors: FieldErrors };

export interface BudgetValues {
  readonly category: string;
  readonly maximum: number;
  readonly theme: string;
}

export interface PotValues {
  readonly name: string;
  readonly target: number;
  readonly theme: string;
}

const POT_NAME_MAX_LENGTH = 30;

/** Accepts "1,200.50" and "$40" as well as plain digits. */
function toAmount(raw: string): number {
  return Number(raw.replace(/[$,\s]/g, ""));
}

function isKnownTheme(value: string): boolean {
  return THEMES.some(
    (theme) => theme.value.toUpperCase() === value.toUpperCase(),
  );
}

/** Whether another record — not the one being edited — already claims `theme`. */
function isThemeTaken(
  records: ReadonlyArray<{ id: string; theme: string }>,
  theme: string,
  editingId?: string,
): boolean {
  return records.some(
    (record) =>
      record.id !== editingId &&
      record.theme.toUpperCase() === theme.toUpperCase(),
  );
}

/**
 * Validates the budget form.
 *
 * @param editingId Id of the budget being edited, so it does not clash with itself.
 */
export function validateBudget(
  input: { category: string; maximum: string; theme: string },
  data: FinanceData,
  editingId?: string,
): Validated<BudgetValues> {
  const fieldErrors: FieldErrors = {};
  const category = input.category.trim();
  const theme = input.theme.trim();
  const maximum = toAmount(input.maximum);

  if (!category) {
    fieldErrors.category = "Pick a category.";
  } else if (!TRANSACTION_CATEGORIES.includes(category as never)) {
    fieldErrors.category = "Pick a category from the list.";
  } else if (
    data.budgets.some(
      (budget) => budget.id !== editingId && budget.category === category,
    )
  ) {
    fieldErrors.category = "You already have a budget for this category.";
  }

  if (!input.maximum.trim()) {
    fieldErrors.maximum = "Enter a maximum spend.";
  } else if (!Number.isFinite(maximum) || maximum <= 0) {
    fieldErrors.maximum = "Enter an amount greater than zero.";
  }

  if (!isKnownTheme(theme)) {
    fieldErrors.theme = "Pick a colour from the list.";
  } else if (isThemeTaken(data.budgets, theme, editingId)) {
    fieldErrors.theme = "That colour is already used by another budget.";
  }

  return Object.keys(fieldErrors).length > 0
    ? { ok: false, fieldErrors }
    : { ok: true, value: { category, maximum, theme } };
}

/**
 * Validates the pot form.
 *
 * @param editingId Id of the pot being edited, so it does not clash with itself.
 */
export function validatePot(
  input: { name: string; target: string; theme: string },
  data: FinanceData,
  editingId?: string,
): Validated<PotValues> {
  const fieldErrors: FieldErrors = {};
  const name = input.name.trim();
  const theme = input.theme.trim();
  const target = toAmount(input.target);

  if (!name) {
    fieldErrors.name = "Enter a pot name.";
  } else if (name.length > POT_NAME_MAX_LENGTH) {
    fieldErrors.name = `Keep the name to ${POT_NAME_MAX_LENGTH} characters or fewer.`;
  } else if (
    data.pots.some(
      (pot) =>
        pot.id !== editingId && pot.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    fieldErrors.name = "You already have a pot with this name.";
  }

  if (!input.target.trim()) {
    fieldErrors.target = "Enter a target.";
  } else if (!Number.isFinite(target) || target <= 0) {
    fieldErrors.target = "Enter an amount greater than zero.";
  }

  if (!isKnownTheme(theme)) {
    fieldErrors.theme = "Pick a colour from the list.";
  } else if (isThemeTaken(data.pots, theme, editingId)) {
    fieldErrors.theme = "That colour is already used by another pot.";
  }

  return Object.keys(fieldErrors).length > 0
    ? { ok: false, fieldErrors }
    : { ok: true, value: { name, target, theme } };
}

/**
 * Validates money moving in or out of a pot.
 *
 * @param limit Most that may be moved — the balance for a deposit, the pot's
 *   own total for a withdrawal.
 * @param limitMessage Shown when `amount` exceeds `limit`.
 */
export function validateAmount(
  raw: string,
  limit: number,
  limitMessage: string,
): Validated<number> {
  const amount = toAmount(raw);

  if (!raw.trim())
    return { ok: false, fieldErrors: { amount: "Enter an amount." } };

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      ok: false,
      fieldErrors: { amount: "Enter an amount greater than zero." },
    };
  }

  if (amount > limit)
    return { ok: false, fieldErrors: { amount: limitMessage } };

  return { ok: true, value: amount };
}
