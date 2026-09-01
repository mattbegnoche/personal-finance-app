import { unstable_rethrow } from "next/navigation";
import type { ReactElement } from "react";
import OverviewCardTop from "./OverviewCardTop";
import { TransactionAmount } from "@/components/transactions/TransactionAmount";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { ApiError } from "@/lib/api/fetch-json";
import { formatDate } from "@/lib/format";
import { fetchTransactions } from "@/lib/transactions/api";
import { DEFAULT_TRANSACTION_QUERY } from "@/lib/transactions/query";
import type { Transaction } from "@/lib/transactions/types";

function TransactionRow({
  transaction,
}: {
  transaction: Transaction;
}): ReactElement {
  return (
    <li className="border-grey-100 flex items-center justify-between gap-4 border-b py-5 first:pt-0 last:border-b-0 last:pb-0">
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
  );
}

/** Compact stand-in shown while the card's data is in flight. */
export function TransactionsCardSkeleton(): ReactElement {
  return (
    <Card>
      <OverviewCardTop
        label="Transactions"
        href="/transactions"
        actionLabel="View All"
      />
      <p role="status" className="sr-only">
        Loading recent transactions
      </p>
      <ul aria-hidden="true" className="animate-pulse">
        {Array.from({ length: 5 }, (_, index) => (
          <li
            key={index}
            className="border-grey-100 flex items-center justify-between gap-4 border-b py-5 first:pt-0 last:border-b-0 last:pb-0"
          >
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
    </Card>
  );
}

/** Fetches the preview rows, turning a failure into a message to show instead. */
async function loadPreview(): Promise<
  { transactions: ReadonlyArray<Transaction> } | { error: string }
> {
  try {
    // The design shows the five most recent transactions.
    const page = await fetchTransactions(DEFAULT_TRANSACTION_QUERY, 5);

    return { transactions: page.transactions };
  } catch (error) {
    unstable_rethrow(error);

    console.error("[overview] could not load recent transactions", error);

    return {
      error:
        error instanceof ApiError
          ? error.message
          : "Something went wrong loading your recent transactions.",
    };
  }
}

/**
 * Overview summary of the latest transactions, linking through to the full
 * table. Only the rows it renders are fetched.
 *
 * A failure here degrades to a short message rather than taking down the rest
 * of the Overview page.
 */
export async function TransactionsCard(): Promise<ReactElement> {
  const result = await loadPreview();

  return (
    <Card>
      <OverviewCardTop
        label="Transactions"
        href="/transactions"
        actionLabel="View All"
      />
      <CardBody result={result} />
    </Card>
  );
}

function CardBody({
  result,
}: {
  result: Awaited<ReturnType<typeof loadPreview>>;
}): ReactElement {
  if ("error" in result) {
    return (
      <Text role="alert" preset="preset-4" className="text-grey-500 py-4">
        {result.error}
      </Text>
    );
  }

  if (result.transactions.length === 0) {
    return (
      <Text preset="preset-4" className="text-grey-500 py-4">
        No transactions yet.
      </Text>
    );
  }

  return (
    <ul>
      {result.transactions.map((transaction) => (
        <TransactionRow key={transaction.id} transaction={transaction} />
      ))}
    </ul>
  );
}
