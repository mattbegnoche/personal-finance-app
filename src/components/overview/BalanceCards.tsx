"use client";

import type { ReactElement } from "react";
import SummaryCard from "./SummaryCard";
import { Card } from "../ui/Card";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { formatCurrency } from "@/lib/format";

const ROW = "gap-sm grid sm:grid-cols-3";

/** Stand-in shown until the visitor's saved data has been read. */
function BalanceCardsSkeleton(): ReactElement {
  return (
    <div className={ROW}>
      <p role="status" className="sr-only">
        Loading balance
      </p>
      {[0, 1, 2].map((card) => (
        <Card key={card} size="lg">
          <div aria-hidden="true" className="animate-pulse">
            <div className="bg-grey-100 h-3 w-28 rounded" />
            <div className="bg-grey-100 mt-3 h-8 w-32 rounded" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/** The three headline figures at the top of the Overview. */
export function BalanceCards(): ReactElement {
  const { data, isReady } = useFinanceData();

  if (!isReady) return <BalanceCardsSkeleton />;

  return (
    <div className={ROW}>
      <SummaryCard
        title="Current Balance"
        value={formatCurrency(data.balance.current, 2)}
        theme="dark"
      />
      <SummaryCard
        title="Income"
        value={formatCurrency(data.balance.income, 2)}
      />
      <SummaryCard
        title="Expenses"
        value={formatCurrency(data.balance.expenses, 2)}
      />
    </div>
  );
}
