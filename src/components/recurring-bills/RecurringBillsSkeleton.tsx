import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

const BAR = "rounded bg-grey-100";

/** Fills the summary column while the month's totals are in flight. */
export function BillsSummarySkeleton(): ReactElement {
  return (
    <div className="gap-sm grid md:grid-cols-2 lg:grid-cols-1">
      <p role="status" className="sr-only">
        Loading bill totals
      </p>
      <Card theme="dark" size="lg">
        <div aria-hidden="true" className="animate-pulse">
          <div className="bg-grey-500 mb-8 size-8 rounded" />
          <div className="bg-grey-500 mb-3 h-3 w-24 rounded" />
          <div className="bg-grey-500 h-8 w-32 rounded" />
        </div>
      </Card>
      <Card size="lg">
        <div aria-hidden="true" className="animate-pulse">
          <div className={`${BAR} mb-5 h-4 w-24`} />
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="border-grey-500/15 flex items-center justify-between gap-4 border-b py-4 last:border-b-0"
            >
              <div className={`${BAR} h-3 w-28`} />
              <div className={`${BAR} h-3 w-16`} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/** Fills the list while the bills are in flight. */
export function BillsListSkeleton(): ReactElement {
  return (
    <div>
      <p role="status" className="sr-only">
        Loading bills
      </p>
      <div aria-hidden="true" className="animate-pulse">
        {Array.from({ length: 8 }, (_, row) => (
          <div
            key={row}
            className="border-grey-100 flex items-center gap-4 border-b py-4 first:pt-0 last:border-b-0"
          >
            <div className="bg-grey-100 size-8 shrink-0 rounded-full" />
            <div className={`${BAR} h-3 flex-1`} />
            <div className={`${BAR} hidden h-3 w-28 md:block`} />
            <div className={`${BAR} h-3 w-16 shrink-0`} />
          </div>
        ))}
      </div>
    </div>
  );
}
