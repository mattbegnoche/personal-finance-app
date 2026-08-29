import { cn } from "@/lib/cn";
import { HTMLAttributes, ReactNode } from "react";

const CARD_SIZES = {
  sm: "p-5",
  md: "sm:p-6 p-5",
  lg: "sm:p-8 p-6",
} as const;

export type CardSize = keyof typeof CARD_SIZES;

const CARD_THEME = {
  light: "bg-white",
  dark: "bg-grey-900 text-white",
} as const;

export type CardTheme = keyof typeof CARD_THEME;

export type CardTag = "div" | "li" | "article" | "section";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardTag;
  className?: string;
  children: ReactNode;
  size?: CardSize;
  theme?: CardTheme;
}

export function Card({
  as: Component = "div",
  className,
  children,
  size = "md",
  theme = "light",
  ...rest
}: CardProps) {
  return (
    <Component
      className={cn(
        CARD_SIZES[size],
        CARD_THEME[theme],
        "rounded-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
