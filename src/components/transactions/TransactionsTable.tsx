import type { ReactElement } from "react";
import { TransactionAmount } from "./TransactionAmount";
import { TransactionAvatar } from "./TransactionAvatar";
import { formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/transactions/types";

/** Outer cells sit flush with the card padding; inner ones get breathing room. */
const CELL = "px-4 first:pl-0 last:pr-0";

const COLUMNS = [
  "Recipient / Sender",
  "Category",
  "Transaction Date",
  "Amount",
] as const;

interface TransactionsTableProps {
  transactions: ReadonlyArray<Transaction>;
}

/** Tablet and desktop view. Hidden on mobile in favour of `TransactionsList`. */
export function TransactionsTable({
  transactions,
}: TransactionsTableProps): ReactElement {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-140 border-collapse">
        <caption className="sr-only">Transactions</caption>
        <thead>
          <tr className="border-grey-100 text-preset-5 text-grey-500 border-b">
            {COLUMNS.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`${CELL} pb-3 font-normal ${
                  index === COLUMNS.length - 1 ? "text-right" : "text-left"
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-grey-100 border-b last:border-b-0"
            >
              <th scope="row" className={`${CELL} py-4 text-left`}>
                <span className="flex items-center gap-4">
                  <TransactionAvatar
                    src={transaction.avatar}
                    className="size-10"
                  />
                  <span className="text-preset-4-bold text-grey-900">
                    {transaction.name}
                  </span>
                </span>
              </th>
              <td className={`${CELL} text-preset-5 text-grey-500 py-4`}>
                {transaction.category}
              </td>
              <td
                className={`${CELL} text-preset-5 text-grey-500 py-4 whitespace-nowrap`}
              >
                {formatDate(transaction.date)}
              </td>
              <td className={`${CELL} py-4 text-right`}>
                <TransactionAmount amount={transaction.amount} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
