"use client";

import type { ReactElement } from "react";
import { InputField } from "@/components/ui/InputField";
import { Select } from "@/components/ui/Select";
import { useDebouncedNavigation } from "@/hooks/useDebouncedNavigation";
import {
  CATEGORY_FILTER_OPTIONS,
  TRANSACTION_SORT_OPTIONS,
  parseTransactionQuery,
  toTransactionsHref,
  type TransactionQuery,
} from "@/lib/transactions/query";

interface TransactionFiltersProps {
  /** The query currently reflected in the URL. */
  query: TransactionQuery;
}

/**
 * Search, sort and category controls for the transactions table.
 *
 * The URL is the single source of truth. The search box is left uncontrolled so
 * a slower navigation settling can never clobber keystrokes typed while it was
 * in flight.
 */
export function TransactionFilters({
  query,
}: TransactionFiltersProps): ReactElement {
  const { isPending, navigate, navigateDebounced } = useDebouncedNavigation();

  /** Any filter change invalidates the page the user was on. */
  const hrefFor = (overrides: Partial<TransactionQuery>) =>
    toTransactionsHref(query, { page: 1, ...overrides });

  return (
    <div
      aria-busy={isPending}
      className="mb-6 flex items-center gap-4 md:gap-6"
    >
      <InputField
        name="search"
        type="search"
        aria-label="Search transactions"
        placeholder="Search transaction"
        icon="magnifying-glass"
        defaultValue={query.search}
        onChange={(event) =>
          navigateDebounced(hrefFor({ search: event.target.value.trim() }))
        }
        className="min-w-0 flex-1 md:max-w-80"
      />

      <div className="flex shrink-0 items-center gap-6">
        <Select
          label="Sort by"
          icon="sort"
          name="sort"
          value={query.sort}
          options={TRANSACTION_SORT_OPTIONS.map(({ value, label }) => ({
            value,
            label,
          }))}
          // Re-parsed so an unexpected value falls back to the default sort.
          onChange={(sort) =>
            navigate(hrefFor({ sort: parseTransactionQuery({ sort }).sort }))
          }
          triggerClassName="md:min-w-28"
        />
        <Select
          label="Category"
          icon="filter"
          name="category"
          value={query.category}
          options={CATEGORY_FILTER_OPTIONS}
          onChange={(category) =>
            navigate(
              hrefFor({
                category: parseTransactionQuery({ category }).category,
              }),
            )
          }
          triggerClassName="md:min-w-45"
        />
      </div>
    </div>
  );
}
