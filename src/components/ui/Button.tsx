import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const BUTTON_BASE_CLASSES =
  "inline-flex cursor-pointer items-center justify-center transition-colors";

/** Padded, rounded variants share a box; tertiary is a bare text button. */
const SOLID_CLASSES = "gap-4 rounded-lg p-4 text-preset-4-bold";

const BUTTON_VARIANT_CLASSES = {
  primary: `${SOLID_CLASSES} bg-grey-900 text-white hover:bg-grey-500`,
  secondary: `${SOLID_CLASSES} border border-transparent bg-beige-100 text-grey-900 hover:border-beige-500 hover:bg-white`,
  // Hover in the design is the red overlaid with 20% white.
  destroy: `${SOLID_CLASSES} bg-red text-white hover:bg-[color-mix(in_srgb,var(--color-red)_80%,white)]`,
  tertiary: "gap-3 text-preset-4 text-grey-500 hover:text-grey-900",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANT_CLASSES;

const DEFAULT_BUTTON_VARIANT: ButtonVariant = "primary";
const TERTIARY_ICON_SIZE = 12;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style from the design system. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Render the trailing caret. Applies to the `tertiary` variant only. */
  showIcon?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = DEFAULT_BUTTON_VARIANT,
  showIcon = true,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps): ReactElement {
  const hasTrailingIcon = variant === "tertiary" && showIcon;

  return (
    <button
      type={type}
      className={cn(BUTTON_BASE_CLASSES, BUTTON_VARIANT_CLASSES[variant], className)}
      {...rest}
    >
      {children}
      {hasTrailingIcon && <Icon name="caret-right" size={TERTIARY_ICON_SIZE} />}
    </button>
  );
}
