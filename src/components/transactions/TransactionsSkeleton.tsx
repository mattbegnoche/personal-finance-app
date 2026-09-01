import type { ReactElement } from "react";
import { TRANSACTIONS_PER_PAGE } from "@/lib/transactions/query";

const BAR = "rounded bg-grey-100";

/** Fills the results area while a page is in flight, at roughly its final height. */
export function TransactionsSkeleton(): ReactElement {
  return (
    <div>
      <p role="status" className="sr-only">
        Loading transactions
      </p>

      <div aria-hidden="true" className="animate-pulse">
        {Array.from({ length: TRANSACTIONS_PER_PAGE }, (_, row) => (
          <div
            key={row}
            className="border-grey-100 flex items-center gap-4 border-b py-4 first:pt-0 last:border-b-0"
          >
            <div className="bg-grey-100 size-8 shrink-0 rounded-full md:size-10" />
            <div className="min-w-0 flex-1">
              <div className={`${BAR} h-3 w-40 max-w-full`} />
              <div className={`${BAR} mt-2 h-2.5 w-24 max-w-full md:hidden`} />
            </div>
            <div className={`${BAR} hidden h-3 w-24 md:block`} />
            <div className={`${BAR} hidden h-3 w-24 md:block`} />
            <div className={`${BAR} h-3 w-16 shrink-0`} />
          </div>
        ))}
      </div>
    </div>
  );
}
