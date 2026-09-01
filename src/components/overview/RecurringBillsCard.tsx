import { unstable_rethrow } from "next/navigation";
import type { ReactElement } from "react";
import OverviewCardTop from "./OverviewCardTop";
import { Card } from "../ui/Card";
import { Text } from "../ui/Text";
import { ApiError } from "@/lib/api/fetch-json";
import { formatCurrency } from "@/lib/format";
import { loadRecurringBills } from "@/lib/recurring-bills/load";
import type { BillSummary } from "@/lib/recurring-bills/bills";

const ROW = "flex items-center justify-between gap-4 rounded-lg border-l-4 bg-beige-100 p-4";

function CardShell({ children }: { children: ReactElement }): ReactElement {
  return (
    <Card>
      <OverviewCardTop href="/recurring-bills" label="Recurring Bills" />
      {children}
    </Card>
  );
}

/** Compact stand-in shown while the card's data is in flight. */
export function RecurringBillsCardSkeleton(): ReactElement {
  return (
    <CardShell>
      <div>
        <p role="status" className="sr-only">
          Loading recurring bills
        </p>
        <ul aria-hidden="true" className="grid animate-pulse gap-3">
          {[0, 1, 2].map((row) => (
            <li key={row} className={`${ROW} border-l-grey-100`}>
              <div className="h-3 w-28 rounded bg-grey-100" />
              <div className="h-3 w-16 rounded bg-grey-100" />
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  );
}

/**
 * Overview summary of this month's bills, linking through to the full page.
 *
 * A failure degrades to a short message rather than taking down the rest of the
 * Overview page.
 */
export async function RecurringBillsCard(): Promise<ReactElement> {
  let summary: BillSummary;

  try {
    ({ summary } = await loadRecurringBills());
  } catch (error) {
    unstable_rethrow(error);
    console.error("[overview] could not load recurring bills", error);

    return (
      <CardShell>
        <Text role="alert" preset="preset-4" className="py-4 text-grey-500">
          {error instanceof ApiError
            ? error.message
            : "Something went wrong loading your recurring bills."}
        </Text>
      </CardShell>
    );
  }

  const rows = [
    { label: "Paid Bills", totals: summary.paid, border: "border-l-green" },
    { label: "Total Upcoming", totals: summary.upcoming, border: "border-l-yellow" },
    { label: "Due Soon", totals: summary.dueSoon, border: "border-l-cyan" },
  ];

  return (
    <CardShell>
      <ul className="grid gap-3">
        {rows.map((row) => (
          <li key={row.label} className={`${ROW} ${row.border}`}>
            <Text preset="preset-4" className="min-w-0 truncate text-grey-500">
              {row.label}
            </Text>
            <Text preset="preset-4-bold" className="shrink-0 text-grey-900">
              {formatCurrency(row.totals.total, 2)}
            </Text>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}
