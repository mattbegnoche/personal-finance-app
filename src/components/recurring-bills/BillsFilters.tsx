"use client";

import type { ReactElement } from "react";
import { InputField } from "@/components/ui/InputField";
import { Select } from "@/components/ui/Select";
import { useDebouncedNavigation } from "@/hooks/useDebouncedNavigation";
import {
  BILL_SORT_OPTIONS,
  parseBillQuery,
  toRecurringBillsHref,
  type BillQuery,
} from "@/lib/recurring-bills/query";

/** Search and sort controls for the bills list. The URL holds the state. */
export function BillsFilters({ query }: { query: BillQuery }): ReactElement {
  const { isPending, navigate, navigateDebounced } = useDebouncedNavigation();

  return (
    <div
      aria-busy={isPending}
      className="mb-6 flex items-center gap-4 md:gap-6"
    >
      <InputField
        name="search"
        type="search"
        aria-label="Search bills"
        placeholder="Search bills"
        icon="magnifying-glass"
        defaultValue={query.search}
        onChange={(event) =>
          navigateDebounced(
            toRecurringBillsHref(query, { search: event.target.value.trim() }),
          )
        }
        className="min-w-0 flex-1 md:max-w-80"
      />

      <Select
        label="Sort by"
        icon="sort"
        name="sort"
        value={query.sort}
        options={BILL_SORT_OPTIONS.map(({ value, label }) => ({
          value,
          label,
        }))}
        // Re-parsed so an unexpected value falls back to the default sort.
        onChange={(sort) =>
          navigate(
            toRecurringBillsHref(query, {
              sort: parseBillQuery({ sort }).sort,
            }),
          )
        }
        triggerClassName="md:min-w-28"
      />
    </div>
  );
}
