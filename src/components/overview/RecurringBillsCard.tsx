"use client";

import type { ReactElement } from "react";
import OverviewCardTop from "./OverviewCardTop";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { formatCurrency } from "@/lib/format";
import { toRecurringBillsData } from "@/lib/recurring-bills/load";

const ROW =
  "flex items-center justify-between gap-4 rounded-lg border-l-4 bg-beige-100 p-4";

/** Overview summary of this month's bills, linking through to the full page. */
export function RecurringBillsCard(): ReactElement {
  const { data, isReady } = useFinanceData();
  const { summary } = toRecurringBillsData(data);

  if (!isReady) {
    return (
      <Card size="lg">
        <OverviewCardTop href="/recurring-bills" label="Recurring Bills" />
        <p role="status" className="sr-only">
          Loading recurring bills
        </p>
        <ul aria-hidden="true" className="grid animate-pulse gap-3">
          {[0, 1, 2].map((row) => (
            <li key={row} className={`${ROW} border-l-grey-100`}>
              <div className="bg-grey-100 h-3 w-28 rounded" />
              <div className="bg-grey-100 h-3 w-16 rounded" />
            </li>
          ))}
        </ul>
      </Card>
    );
  }

  const rows = [
    { label: "Paid Bills", totals: summary.paid, border: "border-l-green" },
    {
      label: "Total Upcoming",
      totals: summary.upcoming,
      border: "border-l-yellow",
    },
    { label: "Due Soon", totals: summary.dueSoon, border: "border-l-cyan" },
  ];

  return (
    <Card size="lg">
      <OverviewCardTop href="/recurring-bills" label="Recurring Bills" />
      <ul className="grid gap-3">
        {rows.map((row) => (
          <li key={row.label} className={`${ROW} ${row.border}`}>
            <Text preset="preset-4" className="text-grey-500 min-w-0 truncate">
              {row.label}
            </Text>
            <Text preset="preset-4-bold" className="text-grey-900 shrink-0">
              {formatCurrency(row.totals.total, 2)}
            </Text>
          </li>
        ))}
      </ul>
    </Card>
  );
}
