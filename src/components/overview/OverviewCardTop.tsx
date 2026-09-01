import { cn } from "@/lib/cn";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

function OverviewCardTop({
  label,
  href,
  actionLabel = "See Details",
  className,
}: {
  label: string;
  href: string;
  /** Text on the trailing link. Defaults to the design's "See Details". */
  actionLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `mb-5 flex flex-wrap items-center justify-between`,
        className,
      )}
    >
      <Text preset="preset-2" as="h2">
        {label}
      </Text>
      <Button variant="tertiary" href={href}>
        {actionLabel}
      </Button>
    </div>
  );
}

export default OverviewCardTop;
