"use client";

import type { ReactElement } from "react";
import { BillsList } from "./BillsList";
import { BillsSummary } from "./BillsSummary";
import { BillsTable } from "./BillsTable";
import {
  BillsListSkeleton,
  BillsSummarySkeleton,
} from "./RecurringBillsSkeleton";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { Text } from "@/components/ui/Text";
import { toRecurringBillsData } from "@/lib/recurring-bills/load";
import {
  DEFAULT_BILL_QUERY,
  applyBillQuery,
  toRecurringBillsHref,
  type BillQuery,
} from "@/lib/recurring-bills/query";

/** The month's totals, beside the list. */
export function BillsSummaryPanel(): ReactElement {
  const { data, isReady } = useFinanceData();

  if (!isReady) return <BillsSummarySkeleton />;

  return <BillsSummary summary={toRecurringBillsData(data).summary} />;
}

/** The filtered, sorted list of bills. */
export function BillsResults({ query }: { query: BillQuery }): ReactElement {
  const { data, isReady } = useFinanceData();

  if (!isReady) return <BillsListSkeleton />;

  const bills = applyBillQuery(toRecurringBillsData(data).bills, query);

  if (bills.length === 0) {
    return (
      <Notice
        icon="magnifying-glass"
        title="No bills found"
        description={
          query.search
            ? "No recurring bills match your search."
            : "Transactions marked as recurring will show up here."
        }
      >
        {query.search && (
          <Button
            variant="secondary"
            href={toRecurringBillsHref(DEFAULT_BILL_QUERY)}
          >
            Clear search
          </Button>
        )}
      </Notice>
    );
  }

  return (
    <>
      <Text preset="preset-5" className="sr-only" role="status">
        {`Showing ${bills.length} recurring ${bills.length === 1 ? "bill" : "bills"}.`}
      </Text>
      <BillsList bills={bills} />
      <BillsTable bills={bills} />
    </>
  );
}
