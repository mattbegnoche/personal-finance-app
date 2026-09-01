import type { ReactElement } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Pot } from "@/lib/pots/api";

/** One savings pot: what is in it and how close it is to its target. */
export function PotCard({ pot }: { pot: Pot }): ReactElement {
  return (
    <Card as="li" size="lg">
      <div className="mb-8 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="size-4 shrink-0 rounded-full"
          style={{ backgroundColor: pot.theme }}
        />
        <Text
          as="h2"
          preset="preset-2"
          className="text-grey-900 min-w-0 truncate"
        >
          {pot.name}
        </Text>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <Text preset="preset-4" className="text-grey-500">
          Total Saved
        </Text>
        <Text preset="preset-1" className="text-grey-900">
          {formatCurrency(pot.total, 2)}
        </Text>
      </div>

      <ProgressBar
        value={pot.total}
        max={pot.target}
        color={pot.theme}
        size="sm"
        label={`${pot.name} progress`}
        className="mb-3"
      />

      <div className="flex items-center justify-between gap-4">
        <Text preset="preset-5-bold" className="text-grey-500">
          {formatPercent(pot.total, pot.target)}
        </Text>
        <Text preset="preset-5" className="text-grey-500">
          Target of {formatCurrency(pot.target)}
        </Text>
      </div>
    </Card>
  );
}
