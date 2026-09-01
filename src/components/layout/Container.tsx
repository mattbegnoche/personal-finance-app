import { cn } from "@/lib/cn";
import { ReactNode } from "react";

const CONTAINER_SIZES = {
  md: "max-w-285",
  lg: "max-w-330",
} as const;

export function Container({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: keyof typeof CONTAINER_SIZES;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-10",
        CONTAINER_SIZES[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
