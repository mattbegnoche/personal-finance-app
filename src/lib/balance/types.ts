/** Account totals for the current period. */
export interface Balance {
  readonly current: number;
  readonly income: number;
  readonly expenses: number;
}
