import { unstable_rethrow } from "next/navigation";
import type { ReactElement } from "react";
import SummaryCard from "./SummaryCard";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { ApiError } from "@/lib/api/fetch-json";
import { fetchBalance, type Balance } from "@/lib/balance/api";
import { formatCurrency } from "@/lib/format";

const ROW = "gap-sm grid sm:grid-cols-3";

/** Compact stand-in shown while the balance is in flight. */
export function BalanceCardsSkeleton(): ReactElement {
  return (
    <div className={ROW}>
      <p role="status" className="sr-only">
        Loading balance
      </p>
      {[0, 1, 2].map((card) => (
        <Card key={card}>
          <div aria-hidden="true" className="animate-pulse">
            <div className="h-3 w-28 rounded bg-grey-100" />
            <div className="mt-3 h-8 w-32 rounded bg-grey-100" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/** The three headline figures at the top of the Overview. */
export async function BalanceCards(): Promise<ReactElement> {
  let balance: Balance;

  try {
    balance = await fetchBalance();
  } catch (error) {
    unstable_rethrow(error);
    console.error("[overview] could not load balance", error);

    return (
      <Card>
        <Text role="alert" preset="preset-4" className="text-grey-500">
          {error instanceof ApiError
            ? error.message
            : "Something went wrong loading your balance."}
        </Text>
      </Card>
    );
  }

  return (
    <div className={ROW}>
      <SummaryCard
        title="Current Balance"
        value={formatCurrency(balance.current, 2)}
        theme="dark"
      />
      <SummaryCard title="Income" value={formatCurrency(balance.income, 2)} />
      <SummaryCard
        title="Expenses"
        value={formatCurrency(balance.expenses, 2)}
      />
    </div>
  );
}
