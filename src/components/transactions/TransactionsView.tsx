"use client";

import { useSearchParams } from "next/navigation";
import type { ReactElement } from "react";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionsResults } from "./TransactionsResults";
import { Card } from "@/components/ui/Card";
import { toRawSearchParams } from "@/lib/search-params";
import { parseTransactionQuery } from "@/lib/transactions/query";

/** Reads the filters from the URL and renders the table around them. */
export function TransactionsView(): ReactElement {
  const query = parseTransactionQuery(toRawSearchParams(useSearchParams()));

  return (
    <Card size="lg">
      <TransactionFilters query={query} />
      <TransactionsResults query={query} />
    </Card>
  );
}
