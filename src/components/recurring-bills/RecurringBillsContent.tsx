import { unstable_rethrow } from "next/navigation";
import type { ReactElement } from "react";
import { BillsList } from "./BillsList";
import { BillsSummary } from "./BillsSummary";
import { BillsTable } from "./BillsTable";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { Text } from "@/components/ui/Text";
import { ApiError } from "@/lib/api/fetch-json";
import { loadRecurringBills, type RecurringBillsData } from "@/lib/recurring-bills/load";
import {
  DEFAULT_BILL_QUERY,
  applyBillQuery,
  toRecurringBillsHref,
  type BillQuery,
} from "@/lib/recurring-bills/query";

/** Shared failure notice for both panels, so one outage message reads the same. */
function LoadError({ error }: { error: unknown }): ReactElement {
  return (
    <Notice
      icon="warning-circle"
      tone="error"
      title="Couldn't load bills"
      description={
        error instanceof ApiError
          ? error.message
          : "Something went wrong loading your bills. Please try again."
      }
    />
  );
}

/** The month's totals. Streams separately from the list beside it. */
export async function BillsSummaryPanel(): Promise<ReactElement> {
  let data: RecurringBillsData;

  try {
    data = await loadRecurringBills();
  } catch (error) {
    unstable_rethrow(error);
    console.error("[recurring-bills] could not load summary", error);

    return <LoadError error={error} />;
  }

  return <BillsSummary summary={data.summary} />;
}

/** The filtered, sorted list of bills. */
export async function BillsResults({
  query,
}: {
  query: BillQuery;
}): Promise<ReactElement> {
  let data: RecurringBillsData;

  try {
    data = await loadRecurringBills();
  } catch (error) {
    unstable_rethrow(error);
    console.error("[recurring-bills] could not load bills", error);

    return <LoadError error={error} />;
  }

  const bills = applyBillQuery(data.bills, query);

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
