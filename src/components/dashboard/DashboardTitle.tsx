import type { ReactNode } from "react";
import { Text } from "../ui/Text";

export function DashboardTitle({
  text,
  action,
}: {
  text: string;
  /** Optional control shown opposite the title, e.g. an "Add New" button. */
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
      <Text as="h1" preset="preset-1">
        {text}
      </Text>
      {action}
    </div>
  );
}
