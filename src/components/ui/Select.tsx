"use client";

import type { ReactElement } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

/** Applied to both triggers so the invisible select still shows keyboard focus. */
const FOCUS_RING =
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-grey-900";

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectProps {
  /** Visible on tablet and up; the accessible name at every width. */
  label: string;
  /** Stands in for the labelled control on mobile, keyed by its Figma name. */
  icon: IconName;
  name: string;
  value: string;
  options: ReadonlyArray<SelectOption>;
  onChange: (value: string) => void;
  /** Applied to the outer wrapper, for layout within the parent row. */
  className?: string;
  /** Applied to the tablet-and-up box, typically to reserve a stable width. */
  triggerClassName?: string;
}

/**
 * A native `select` styled to match the design: an icon-only control on mobile
 * and a labelled box on tablet and up.
 *
 * The real `select` is layered transparently over the trigger, so the menu,
 * keyboard handling and touch behaviour stay native while the visuals are ours.
 */
export function Select({
  label,
  icon,
  name,
  value,
  options,
  onChange,
  className,
  triggerClassName,
}: SelectProps): ReactElement {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? label;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label
        htmlFor={name}
        className="text-preset-4 text-grey-500 hidden shrink-0 md:block"
      >
        {label}
      </label>

      <div className="relative">
        {/* Rendered first so the triggers below can react to its focus as peers. */}
        <select
          id={name}
          name={name}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(event.target.value)}
          className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          className={cn(
            "text-grey-900 flex size-5 items-center justify-center rounded-sm md:hidden",
            FOCUS_RING,
          )}
        >
          <Icon name={icon} size={20} />
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "border-beige-500 hidden items-center justify-between gap-4 rounded-lg border bg-white px-5 py-3 md:flex",
            FOCUS_RING,
            triggerClassName,
          )}
        >
          <span className="text-preset-4 text-grey-900 truncate">
            {selectedLabel}
          </span>
          <Icon name="caret-down" size={12} className="shrink-0" />
        </span>
      </div>
    </div>
  );
}
