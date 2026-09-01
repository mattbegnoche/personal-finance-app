"use client";

import type { ReactElement } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

export interface SelectFieldOption {
  readonly value: string;
  readonly label: string;
  /** Shown as a dot before the label, e.g. a theme colour. */
  readonly color?: string;
  /** Greyed out and unselectable, e.g. a colour already in use. */
  readonly isDisabled?: boolean;
}

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  options: ReadonlyArray<SelectFieldOption>;
  onChange: (value: string) => void;
  /** Validation message shown beneath the field. */
  error?: string;
}

/**
 * A labelled `select` for forms.
 *
 * The native control stays in place and does the work; a transparent layer over
 * a styled box gives it the design's look while keeping the native menu.
 */
export function SelectField({
  name,
  label,
  value,
  options,
  onChange,
  error,
}: SelectFieldProps): ReactElement {
  const selected = options.find((option) => option.value === value);
  const messageId = error ? `${name}-error` : undefined;

  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={name} className="text-preset-5-bold text-grey-500">
        {label}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={messageId}
          aria-invalid={error !== undefined || undefined}
          className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.isDisabled}
            >
              {option.label}
              {option.isDisabled ? " (already used)" : ""}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          className={cn(
            "flex items-center justify-between gap-4 rounded-lg border bg-white px-5 py-3",
            error ? "border-red" : "border-beige-500",
            "peer-focus-visible:outline-grey-900 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            {selected?.color && (
              <span
                className="size-4 shrink-0 rounded-full"
                style={{ backgroundColor: selected.color }}
              />
            )}
            <span className="text-preset-4 text-grey-900 truncate">
              {selected?.label ?? "Select…"}
            </span>
          </span>
          <Icon name="caret-down" size={12} className="shrink-0" />
        </span>
      </div>

      {error && (
        <p id={messageId} className="text-preset-5 text-red text-right">
          {error}
        </p>
      )}
    </div>
  );
}
