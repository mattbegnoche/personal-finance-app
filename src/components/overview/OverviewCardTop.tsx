import { cn } from "@/lib/cn";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

function OverviewCardTop({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
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
        See Details
      </Button>
    </div>
  );
}

export default OverviewCardTop;
