import type { ReactElement } from "react";
import { BillDueDate } from "./BillDueDate";
import { TransactionAvatar } from "@/components/transactions/TransactionAvatar";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";
import type { RecurringBill } from "@/lib/recurring-bills/bills";

/** Mobile view: the table's three columns stacked into two rows per bill. */
export function BillsList({
  bills,
}: {
  bills: ReadonlyArray<RecurringBill>;
}): ReactElement {
  return (
    <ul className="md:hidden">
      {bills.map((bill) => (
        <li
          key={bill.id}
          className="border-b border-grey-100 py-4 first:pt-0 last:border-b-0 last:pb-0"
        >
          <div className="mb-2 flex items-center gap-4">
            <TransactionAvatar src={bill.avatar} className="size-8" />
            <Text preset="preset-4-bold" className="min-w-0 truncate text-grey-900">
              {bill.name}
            </Text>
          </div>

          <div className="flex items-center justify-between gap-4">
            <BillDueDate dueDay={bill.dueDay} status={bill.status} />
            <Text
              preset="preset-4-bold"
              className={cn(
                "shrink-0 whitespace-nowrap",
                bill.status === "due-soon" ? "text-red" : "text-grey-900",
              )}
            >
              {formatCurrency(bill.amount, 2)}
            </Text>
          </div>
        </li>
      ))}
    </ul>
  );
}
