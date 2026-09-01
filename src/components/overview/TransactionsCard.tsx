"use client";

import type { ReactElement } from "react";
import OverviewCardTop from "./OverviewCardTop";
import { TransactionAmount } from "@/components/transactions/TransactionAmount";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { formatDate } from "@/lib/format";
import { applyTransactionQuery } from "@/lib/transactions/filter";
import { DEFAULT_TRANSACTION_QUERY } from "@/lib/transactions/query";

const ROW =
  "flex items-center justify-between gap-4 border-b border-grey-100 py-5 first:pt-0 last:border-b-0 last:pb-0";

/** Overview summary of the latest transactions, linking through to the full table. */
export function TransactionsCard(): ReactElement {
  const { data, isReady } = useFinanceData();

  // The design shows the five most recent transactions.
  const latest = applyTransactionQuery(
    data.transactions,
    DEFAULT_TRANSACTION_QUERY,
  ).transactions.slice(0, 5);

  const body = !isReady ? (
    <div>
      <p role="status" className="sr-only">
        Loading recent transactions
      </p>
      <ul aria-hidden="true" className="animate-pulse">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index} className={ROW}>
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="bg-grey-100 size-8 shrink-0 rounded-full sm:size-10" />
              <div className="bg-grey-100 h-3 w-32 max-w-full rounded" />
            </div>
            <div className="shrink-0">
              <div className="bg-grey-100 h-3 w-16 rounded" />
              <div className="bg-grey-100 mt-2 h-2.5 w-20 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : latest.length === 0 ? (
    <Text preset="preset-4" className="text-grey-500 py-4">
      No transactions yet.
    </Text>
  ) : (
    <ul>
      {latest.map((transaction) => (
        <li key={transaction.id} className={ROW}>
          <div className="flex min-w-0 items-center gap-4">
            <TransactionAvatar
              src={transaction.avatar}
              className="size-8 sm:size-10"
            />
            <Text preset="preset-4-bold" className="text-grey-900 truncate">
              {transaction.name}
            </Text>
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

  return (
    <Card size="lg">
      <OverviewCardTop
        label="Transactions"
        href="/transactions"
        actionLabel="View All"
      />
      {body}
    </Card>
  );
}
