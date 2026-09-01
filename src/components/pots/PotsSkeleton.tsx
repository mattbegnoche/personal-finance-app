import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";

const BAR = "rounded bg-grey-100";
/** Fills the grid while the pots are in flight. */
export function PotsSkeleton(): ReactElement {
  return (
    <>
      <p role="status" className="sr-only">
        Loading pots
      </p>
      <ul className="gap-sm grid sm:grid-cols-2">
        {[0, 1, 2, 3].map((pot) => (
          <Card as="li" key={pot} size="lg">
            <div aria-hidden="true" className="animate-pulse">
              <div className="mb-8 flex items-center gap-4">
                <div className="bg-grey-100 size-4 shrink-0 rounded-full" />
                <div className={`${BAR} h-4 w-32`} />
              </div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className={`${BAR} h-3 w-24`} />
                <div className={`${BAR} h-6 w-24`} />
              </div>
              <div className="bg-grey-100 mb-3 h-2 w-full rounded-full" />
              <div className="flex items-center justify-between gap-4">
                <div className={`${BAR} h-2.5 w-12`} />
                <div className={`${BAR} h-2.5 w-28`} />
              </div>
            </div>
          </Card>
        ))}
      </ul>
    </>
  );
}
