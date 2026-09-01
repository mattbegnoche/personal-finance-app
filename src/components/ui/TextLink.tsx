import Link from "next/link";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Underline styling mirrors the Figma spec (`text-underline-position: from-font`). */
const TEXT_LINK_CLASSES = cn(
  "text-preset-4-bold text-grey-900 underline decoration-solid [text-underline-position:from-font]",
  "transition-colors hover:text-grey-500",
  "rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900",
);

export interface TextLinkProps extends ComponentProps<typeof Link> {
  className?: string;
  children?: ReactNode;
}

export function TextLink({
  className,
  children,
  ...rest
}: TextLinkProps): ReactElement {
  return (
    <Link className={cn(TEXT_LINK_CLASSES, className)} {...rest}>
      {children}
    </Link>
  );
}
