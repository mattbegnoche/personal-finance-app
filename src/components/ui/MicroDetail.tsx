import type { ReactElement, ReactNode } from "react";
import { Text } from "./Text";
import { cn } from "@/lib/cn";

interface MicroDetailProps {
  /** Small label above the figure. Takes a node so skeletons can pass a placeholder. */
  title: ReactNode;
  /** The figure itself. Takes a node so skeletons can pass a placeholder. */
  detail: ReactNode;
  /** CSS color for the leading bar. Defaults to the neutral bar in the design. */
  color?: string;
  className?: string;
}

/** A labelled figure with a coloured bar down its left edge. */
export function MicroDetail({
  title,
  detail,
  color,
  className,
}: MicroDetailProps): ReactElement {
  return (
    <li className={cn("flex gap-4", className)}>
      <div
        aria-hidden="true"
        className={cn("w-1 shrink-0 rounded-lg", !color && "bg-grey-900")}
        style={color ? { backgroundColor: color } : undefined}
      />
      <div className="flex min-w-0 flex-col gap-1">
        <Text preset="preset-5" className="text-grey-500 truncate">
          {title}
        </Text>
        <Text preset="preset-4-bold" className="text-grey-900 truncate">
          {detail}
        </Text>
      </div>
    </li>
  );
}
