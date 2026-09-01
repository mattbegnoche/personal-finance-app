"use client";

import type { ReactElement } from "react";
import OverviewCardTop from "./OverviewCardTop";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { MicroDetail } from "../ui/MicroDetail";
import { Text } from "../ui/Text";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { formatCurrency, roundCurrency } from "@/lib/format";

/** The design's grid has room for four pots. */
const POT_LIMIT = 4;

const TOTAL_BOX =
  "flex flex-1 items-center gap-4 rounded-xl bg-beige-100 p-4 sm:max-w-60";
const POT_GRID = "grid flex-1 grid-cols-2 gap-4 self-center";

/**
 * Overview summary of savings pots: the combined total plus the first few pots.
 */
export function PotsCard(): ReactElement {
  const { data, isReady } = useFinanceData();

  const body = !isReady ? (
    <div>
      <p role="status" className="sr-only">
        Loading pots
      </p>
      <div
        aria-hidden="true"
        className="flex animate-pulse flex-col gap-5 sm:flex-row"
      >
        <div className={TOTAL_BOX}>
          <div className="bg-grey-100 size-7 shrink-0 rounded-full" />
          <div className="flex-1">
            <div className="bg-grey-100 h-3 w-20 rounded" />
            <div className="bg-grey-100 mt-3 h-6 w-24 rounded" />
          </div>
        </div>
        <ul className={POT_GRID}>
          {Array.from({ length: POT_LIMIT }, (_, index) => (
            <MicroDetail
              key={index}
              color="var(--color-grey-100)"
              title={<span className="bg-grey-100 block h-2.5 w-16 rounded" />}
              detail={<span className="bg-grey-100 block h-3 w-12 rounded" />}
            />
          ))}
        </ul>
      </div>
    </div>
  ) : data.pots.length === 0 ? (
    <Text preset="preset-4" className="text-grey-500 py-4">
      No pots yet. Add one from the Pots page.
    </Text>
  ) : (
    <div className="flex flex-col gap-5 sm:flex-row">
      <div className={TOTAL_BOX}>
        <Icon name="jar" size={28} className="text-green shrink-0" />
        <div className="min-w-0">
          <Text preset="preset-4" className="text-grey-500">
            Total Saved
          </Text>
          <Text preset="preset-1" className="text-grey-900 mt-2">
            {formatCurrency(
              roundCurrency(
                data.pots.reduce((total, pot) => total + pot.total, 0),
              ),
            )}
          </Text>
        </div>
      </div>

      <ul className={POT_GRID}>
        {data.pots.slice(0, POT_LIMIT).map((pot) => (
          <MicroDetail
            key={pot.id}
            color={pot.theme}
            title={pot.name}
            detail={formatCurrency(pot.total)}
          />
        ))}
      </ul>
    </div>
  );

  return (
    <Card size="lg">
      <OverviewCardTop href="/pots" label="Pots" />
      {body}
    </Card>
  );
}
