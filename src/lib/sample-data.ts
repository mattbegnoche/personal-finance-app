/** A spending budget for a single category. Mirrors the shape served from `db.json`. */
export interface Budget {
  readonly category: string;
  /** Amount spent so far this month. */
  readonly spent: number;
  /** Spending limit for the category. */
  readonly maximum: number;
  /** Hex color used for the category across charts and legends. */
  readonly theme: string;
}

/** Placeholder budgets used until the views are wired up to the API. */
export const SAMPLE_BUDGETS: ReadonlyArray<Budget> = [
  { category: "Entertainment", spent: 25, maximum: 50, theme: "#277C78" },
  { category: "Bills", spent: 250, maximum: 750, theme: "#82C9D7" },
  { category: "Dining Out", spent: 67, maximum: 75, theme: "#F2CDAC" },
  { category: "Personal Care", spent: 65, maximum: 100, theme: "#626070" },
];
