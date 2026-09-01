import type { ReactElement, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";
import { cn } from "@/lib/cn";

const TONE_CLASSES = {
  neutral: "text-beige-500",
  error: "text-red",
} as const;

export type NoticeTone = keyof typeof TONE_CLASSES;

interface NoticeProps {
  title: string;
  description: string;
  icon: IconName;
  tone?: NoticeTone;
  /** Optional recovery action, e.g. a link that clears the filters. */
  children?: ReactNode;
}

/** Centred stand-in shown when a view has nothing to render, or could not load. */
export function Notice({
  title,
  description,
  icon,
  tone = "neutral",
  children,
}: NoticeProps): ReactElement {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="flex flex-col items-center gap-2 py-12 text-center"
    >
      <Icon
        name={icon}
        size={32}
        className={cn("shrink-0", TONE_CLASSES[tone])}
      />
      <Text preset="preset-3" as="h3" className="text-grey-900">
        {title}
      </Text>
      <Text preset="preset-4" className="text-grey-500 max-w-100">
        {description}
      </Text>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
