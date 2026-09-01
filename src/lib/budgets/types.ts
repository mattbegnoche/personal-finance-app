/**
 * A monthly spending limit for one category.
 *
 * Only the limit is stored — what has been spent against it is derived from
 * transactions, see {@link import("./spending").toBudgetsWithSpending}.
 */
export interface Budget {
  readonly id: string;
  readonly category: string;
  /** Spending limit for the category, per month. */
  readonly maximum: number;
  /** Hex color used for the category across charts and legends. */
  readonly theme: string;
}
