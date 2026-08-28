import type { InputHTMLAttributes, ReactElement } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const FIELD_BASE =
  "flex items-center gap-4 rounded-lg border bg-white px-5 py-3 transition-colors";

/** Focus styling is an addition — the Figma frame only documents the resting state. */
const FIELD_STATE = {
  default: "border-beige-500 focus-within:border-grey-900",
  invalid: "border-red focus-within:border-red",
} as const;

const COLOR_TAG_SIZE = "size-4";
const TRAILING_ICON_SIZE = 16;

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  /** Submitted field name. Doubles as the fallback `id` for label association. */
  name: string;
  /** Visible label above the field. */
  label?: string;
  /** Hint shown beneath the field, right-aligned. */
  helperText?: string;
  /** Validation message. Replaces `helperText` and switches the field to its invalid styling. */
  error?: string;
  /** Static text before the input, such as the `$` on an amount field. */
  prefix?: string;
  /** Trailing icon, keyed by its Figma name. */
  icon?: IconName;
  /** Makes the trailing icon a button. Requires `iconLabel`. */
  onIconClick?: () => void;
  /** Accessible name for the icon button. Required whenever `onIconClick` is set. */
  iconLabel?: string;
  /** CSS color for the leading dot, e.g. a budget theme's hex value. */
  colorTag?: string;
  /** Applied to the outer wrapper, not the input. */
  className?: string;
}

export function InputField({
  name,
  id,
  label,
  helperText,
  error,
  prefix,
  icon,
  onIconClick,
  iconLabel,
  colorTag,
  className,
  ...rest
}: InputFieldProps): ReactElement {
  const inputId = id ?? name;
  const message = error ?? helperText;
  const messageId = message ? `${inputId}-message` : undefined;
  const isInvalid = error !== undefined;

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-preset-5-bold text-grey-500"
        >
          {label}
        </label>
      )}

      <div className={cn(FIELD_BASE, FIELD_STATE[isInvalid ? "invalid" : "default"])}>
        <div className="flex min-w-px flex-1 items-center gap-3">
          {colorTag && (
            <span
              aria-hidden="true"
              className={cn(COLOR_TAG_SIZE, "shrink-0 rounded-full")}
              style={{ backgroundColor: colorTag }}
            />
          )}
          {prefix && (
            <span aria-hidden="true" className="shrink-0 text-preset-4 text-beige-500">
              {prefix}
            </span>
          )}
          <input
            id={inputId}
            name={name}
            aria-describedby={messageId}
            aria-invalid={isInvalid || undefined}
            className="min-w-px flex-1 bg-transparent text-preset-4 text-grey-900 outline-none placeholder:text-beige-500"
            {...rest}
          />
        </div>

        {icon &&
          (onIconClick ? (
            <button
              type="button"
              onClick={onIconClick}
              aria-label={iconLabel}
              className={cn(
                "shrink-0 cursor-pointer rounded-sm text-grey-900 transition-colors hover:text-grey-500",
                "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900",
              )}
            >
              <Icon name={icon} size={TRAILING_ICON_SIZE} />
            </button>
          ) : (
            <Icon
              name={icon}
              size={TRAILING_ICON_SIZE}
              className="shrink-0 text-grey-900"
            />
          ))}
      </div>

      {message && (
        <p
          id={messageId}
          className={cn(
            "text-preset-5 text-right",
            isInvalid ? "text-red" : "text-grey-500",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
