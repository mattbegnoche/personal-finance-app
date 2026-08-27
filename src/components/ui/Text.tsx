import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { cn } from "@/lib/cn";

const TEXT_PRESET_CLASSES = {
  "preset-1": "text-preset-1",
  "preset-2": "text-preset-2",
  "preset-3": "text-preset-3",
  "preset-4": "text-preset-4",
  "preset-4-bold": "text-preset-4-bold",
  "preset-5": "text-preset-5",
  "preset-5-bold": "text-preset-5-bold",
} as const;

export type TextPreset = keyof typeof TEXT_PRESET_CLASSES;

/** Tags the Text component is allowed to render. */
export type TextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Tag to render. Defaults to `p`. */
  as?: TextTag;
  /** Typography preset from the design system. Defaults to `preset-4`. */
  preset?: TextPreset;
  children?: ReactNode;
}

export function Text({
  as: Component = "p",
  preset = "preset-4",
  className,
  children,
  ...rest
}: TextProps): ReactElement {
  return (
    <Component className={cn(TEXT_PRESET_CLASSES[preset], className)} {...rest}>
      {children}
    </Component>
  );
}
