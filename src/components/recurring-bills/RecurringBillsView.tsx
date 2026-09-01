"use client";

import { useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import { BillsFilters } from "./BillsFilters";
import { BillsResults, BillsSummaryPanel } from "./RecurringBillsContent";
import { Card } from "@/components/ui/Card";
import { parseBillQuery } from "@/lib/recurring-bills/query";
import { toRawSearchParams } from "@/lib/search-params";

/** Reads the filters from the URL and lays the page out around them. */
export function RecurringBillsView(): ReactElement {
  const query = parseBillQuery(toRawSearchParams(useSearchParams()));

  return (
    <div className="grid-12 gap-sm items-start">
      <div className="sm:col-span-4">
        <BillsSummaryPanel />
      </div>

      <Card size="lg" className="sm:col-span-8">
        <BillsFilters query={query} />
        <BillsResults query={query} />
      </Card>
    </div>
  );
}
