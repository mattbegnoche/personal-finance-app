import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ReactElement,
  ReactNode,
} from "react";
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

const TERTIARY_ICON_SIZE = 12;

interface ButtonBaseProps {
  /** Visual style from the design system. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Render the trailing caret. Applies to the `tertiary` variant only. */
  showIcon?: boolean;
  className?: string;
  children?: ReactNode;
}

/** Rendered as a `button`. */
type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: never;
  };

/** Rendered as a Next `Link` — `href` selects this shape. */
type ButtonAsLinkProps = ButtonBaseProps &
  Omit<ComponentProps<typeof Link>, keyof ButtonBaseProps>;

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  variant = "primary",
  showIcon = true,
  className,
  children,
  ...rest
}: ButtonProps): ReactElement {
  const classes = cn(
    BUTTON_BASE_CLASSES,
    BUTTON_VARIANT_CLASSES[variant],
    className,
  );

  const content = (
    <>
      {children}
      {variant === "tertiary" && showIcon && (
        <Icon name="caret-right" size={TERTIARY_ICON_SIZE} />
      )}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
