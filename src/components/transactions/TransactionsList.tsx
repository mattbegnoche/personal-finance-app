import type { ReactElement } from "react";
import { TransactionAmount } from "./TransactionAmount";
import { TransactionAvatar } from "./TransactionAvatar";
import { Text } from "@/components/ui/Text";
import { formatDate } from "@/lib/format";
import type { Transaction } from "@/lib/transactions/types";

interface TransactionsListProps {
  transactions: ReadonlyArray<Transaction>;
}

/**
 * Mobile view. The table's four columns collapse into two stacked pairs:
 * name over category on the left, amount over date on the right.
 */
export function TransactionsList({
  transactions,
}: TransactionsListProps): ReactElement {
  return (
    <ul className="md:hidden">
      {transactions.map((transaction) => (
        <li
          key={transaction.id}
          className="border-grey-100 flex items-center justify-between gap-4 border-b py-4 first:pt-0 last:border-b-0 last:pb-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <TransactionAvatar src={transaction.avatar} className="size-8" />
            <div className="min-w-0">
              <Text preset="preset-4-bold" className="text-grey-900 truncate">
                {transaction.name}
              </Text>
              <Text preset="preset-5" className="text-grey-500 mt-1 truncate">
                {transaction.category}
              </Text>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <TransactionAmount amount={transaction.amount} />
            <Text preset="preset-5" className="text-grey-500 mt-1">
              {formatDate(transaction.date)}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}
