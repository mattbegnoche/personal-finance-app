import type { Balance } from "@/lib/balance/types";
import type { Budget } from "@/lib/budgets/types";
import type { Pot } from "@/lib/pots/types";
import type { Transaction } from "@/lib/transactions/types";

/** Everything the app knows about, held in one immutable value. */
export interface FinanceData {
  readonly balance: Balance;
  /** Newest first. */
  readonly transactions: ReadonlyArray<Transaction>;
  readonly budgets: ReadonlyArray<Budget>;
  readonly pots: ReadonlyArray<Pot>;
}
