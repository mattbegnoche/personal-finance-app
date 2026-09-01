import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
import { formatSignedCurrency } from "@/lib/format";

interface TransactionAmountProps {
  amount: number;
  className?: string;
}

/** Money in reads green with a `+`; money out stays neutral with a `-`. */
export function TransactionAmount({
  amount,
  className,
}: TransactionAmountProps): ReactElement {
  const isCredit = amount >= 0;

  return (
    <span
      className={cn(
        "text-preset-4-bold whitespace-nowrap",
        isCredit ? "text-green" : "text-grey-900",
        className,
      )}
    >
      {formatSignedCurrency(amount)}
    </span>
  );
}
