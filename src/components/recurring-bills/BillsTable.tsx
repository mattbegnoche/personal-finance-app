import type { ReactElement } from "react";
import { BillDueDate } from "./BillDueDate";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import type { RecurringBill } from "@/lib/recurring-bills/bills";

/** Outer cells sit flush with the card padding; inner ones get breathing room. */
const CELL = "px-4 first:pl-0 last:pr-0";

/** Tablet and desktop view. Hidden on mobile in favour of `BillsList`. */
export function BillsTable({
  bills,
}: {
  bills: ReadonlyArray<RecurringBill>;
}): ReactElement {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-120 border-collapse">
        <caption className="sr-only">Recurring bills</caption>
        <thead>
          <tr className="border-grey-100 text-preset-5 text-grey-500 border-b">
            <th scope="col" className={`${CELL} pb-3 text-left font-normal`}>
              Bill Title
            </th>
            <th scope="col" className={`${CELL} pb-3 text-left font-normal`}>
              Due Date
            </th>
            <th scope="col" className={`${CELL} pb-3 text-right font-normal`}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr
              key={bill.id}
              className="border-grey-100 border-b last:border-b-0"
            >
              <th scope="row" className={`${CELL} py-4 text-left`}>
                <span className="flex items-center gap-4">
                  <TransactionAvatar src={bill.avatar} className="size-8" />
                  <span className="text-preset-4-bold text-grey-900">
                    {bill.name}
                  </span>
                </span>
              </th>
              <td className={`${CELL} py-4`}>
                <BillDueDate dueDay={bill.dueDay} status={bill.status} />
              </td>
              <td className={`${CELL} py-4 text-right`}>
                <span
                  className={cn(
                    "text-preset-4-bold whitespace-nowrap",
                    bill.status === "due-soon" ? "text-red" : "text-grey-900",
                  )}
                >
                  {formatCurrency(bill.amount, 2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
