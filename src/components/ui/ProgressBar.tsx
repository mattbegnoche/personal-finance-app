import type { ReactElement } from "react";
import { cn } from "@/lib/cn";

const TRACK_SIZES = {
  /** Pots and compact rows. */
  sm: "h-2 rounded-full",
  /** Budget cards, where the fill sits inset in the track. */
  lg: "h-8 rounded p-1",
} as const;

export type ProgressBarSize = keyof typeof TRACK_SIZES;

const FULL_PERCENT = 100;

interface ProgressBarProps {
  /** Amount completed. Values above `max` render as a full bar. */
  value: number;
  max: number;
  /** CSS color for the fill, e.g. a budget or pot theme hex. */
  color: string;
  size?: ProgressBarSize;
  /** Accessible name, e.g. `"Entertainment spending"`. */
  label: string;
  className?: string;
}

/** Track-and-fill bar shared by the budget and pot cards. */
export function ProgressBar({
  value,
  max,
  color,
  size = "lg",
  label,
  className,
}: ProgressBarProps): ReactElement {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(ratio * FULL_PERCENT)}
      aria-valuemin={0}
      aria-valuemax={FULL_PERCENT}
      className={cn(
        "bg-beige-100 w-full overflow-hidden",
        TRACK_SIZES[size],
        className,
      )}
    >
      <div
        className={cn(
          "h-full transition-[width]",
          size === "sm" ? "rounded-full" : "rounded",
        )}
        style={{ width: `${ratio * FULL_PERCENT}%`, backgroundColor: color }}
      />
    </div>
  );
}
