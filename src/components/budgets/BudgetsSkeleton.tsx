import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

const BAR = "rounded bg-grey-100";
const PLACEHOLDER_BUDGETS = [0, 1, 2, 3];

/** Fills the page while budgets and their spending are in flight. */
export function BudgetsSkeleton(): ReactElement {
  return (
    <div className="grid-12 gap-sm items-start">
      <p role="status" className="sr-only">
        Loading budgets
      </p>

      <div className="sm:col-span-5">
        <Card size="lg">
          <div
            aria-hidden="true"
            className="flex animate-pulse flex-col items-center gap-8 md:flex-row lg:flex-col"
          >
            <div className="bg-grey-100 aspect-square w-full max-w-[240px] shrink-0 rounded-full" />
            <div className="w-full flex-1">
              <div className={`${BAR} mb-6 h-4 w-40`} />
              {PLACEHOLDER_BUDGETS.map((row) => (
                <div
                  key={row}
                  className="border-grey-100 flex items-center gap-4 border-b py-4 last:border-b-0"
                >
                  <div className="bg-grey-100 h-5 w-1 shrink-0 rounded-lg" />
                  <div className={`${BAR} h-3 flex-1`} />
                  <div className={`${BAR} h-3 w-20 shrink-0`} />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <ul className="gap-sm grid sm:col-span-7">
        {PLACEHOLDER_BUDGETS.map((card) => (
          <Card as="li" key={card} size="lg">
            <div aria-hidden="true" className="animate-pulse">
              <div className="mb-5 flex items-center gap-4">
                <div className="bg-grey-100 size-4 shrink-0 rounded-full" />
                <div className={`${BAR} h-4 w-32`} />
              </div>
              <div className={`${BAR} mb-4 h-3 w-40`} />
              <div className="bg-grey-100 mb-4 h-8 w-full rounded" />
              <div className="mb-5 grid grid-cols-2 gap-4">
                <div className={`${BAR} h-10`} />
                <div className={`${BAR} h-10`} />
              </div>
              <div className="bg-beige-100 h-32 rounded-lg" />
            </div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
