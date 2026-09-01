import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import type { BillSummary } from "@/lib/recurring-bills/bills";

interface SummaryRowProps {
  label: string;
  count: number;
  total: number;
  isUrgent?: boolean;
}

function SummaryRow({
  label,
  count,
  total,
  isUrgent = false,
}: SummaryRowProps): ReactElement {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-grey-500/15 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <Text
        preset="preset-5"
        className={cn("min-w-0 truncate", isUrgent ? "text-red" : "text-grey-500")}
      >
        {label} ({count})
      </Text>
      <Text
        preset="preset-5-bold"
        className={cn("shrink-0", isUrgent ? "text-red" : "text-grey-900")}
      >
        {formatCurrency(total, 2)}
      </Text>
    </li>
  );
}

/** The month's total alongside its paid / upcoming / due-soon breakdown. */
export function BillsSummary({
  summary,
}: {
  summary: BillSummary;
}): ReactElement {
  return (
    <div className="gap-sm grid md:grid-cols-2 lg:grid-cols-1">
      <Card theme="dark" size="lg" className="flex flex-col justify-center">
        <Icon name="receipt" size={32} className="mb-8 shrink-0 text-white" />
        <Text preset="preset-4" className="mb-3">
          Total bills
        </Text>
        <Text preset="preset-1">{formatCurrency(summary.monthlyTotal, 2)}</Text>
      </Card>

      <Card size="lg">
        <Text as="h2" preset="preset-3" className="mb-5 text-grey-900">
          Summary
        </Text>
        <ul>
          <SummaryRow
            label="Paid Bills"
            count={summary.paid.count}
            total={summary.paid.total}
          />
          <SummaryRow
            label="Total Upcoming"
            count={summary.upcoming.count}
            total={summary.upcoming.total}
          />
          <SummaryRow
            label="Due Soon"
            count={summary.dueSoon.count}
            total={summary.dueSoon.total}
            isUrgent
          />
        </ul>
      </Card>
    </div>
  );
}
