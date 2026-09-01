import type { ReactElement } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { toOrdinal } from "@/lib/format";
import type { BillStatus } from "@/lib/recurring-bills/bills";

/** A paid bill is confirmed, a due-soon one is a warning; upcoming needs no mark. */
const STATUS_ICON = {
  paid: { name: "check-circle", className: "text-green", label: "Paid" },
  "due-soon": { name: "warning-circle", className: "text-red", label: "Due soon" },
} as const;

interface BillDueDateProps {
  dueDay: number;
  status: BillStatus;
  className?: string;
}

/** "Monthly - 2nd", with a status mark for paid and due-soon bills. */
export function BillDueDate({
  dueDay,
  status,
  className,
}: BillDueDateProps): ReactElement {
  const mark = status === "upcoming" ? undefined : STATUS_ICON[status];

  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "text-preset-5",
          status === "paid" ? "text-green" : "text-grey-500",
        )}
      >
        Monthly - {toOrdinal(dueDay)}
      </span>
      {mark && (
        <>
          <Icon
            name={mark.name}
            size={14}
            className={cn("shrink-0", mark.className)}
            aria-hidden="true"
          />
          <span className="sr-only">{mark.label}</span>
        </>
      )}
    </span>
  );
}
