"use client";

import type { ReactElement } from "react";
import { BudgetChart } from "./BudgetChart";
import OverviewCardTop from "./OverviewCardTop";
import { Card } from "../ui/Card";
import { MicroDetail } from "../ui/MicroDetail";
import { Text } from "../ui/Text";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { toBudgetsData } from "@/lib/budgets/load";
import { formatCurrency } from "@/lib/format";

/** The design's legend has room for four categories. */
const LEGEND_LIMIT = 4;

/**
 * Chart left, legend right in a single column — but only once the card is wide
 * enough to hold both. That depends on the column the card lands in, not the
 * viewport, so it is a container query: the card sits in 5 of 12 columns and
 * measures ~297px inside its padding at a 1280px viewport, ~339px at 1440px.
 * Below the threshold the chart goes on top and the legend splits into two.
 */
const BODY = "flex flex-col items-center gap-4 py-2 @2xs:flex-row";
const CHART_FRAME =
  "flex w-full min-w-px flex-1 flex-col items-center justify-center";
const LEGEND =
  "grid w-full grid-cols-2 gap-4 @2xs:flex @2xs:w-auto @2xs:shrink-0 @2xs:flex-col @2xs:justify-center";

/** Overview summary of this month's budgets, linking through to the full page. */
export function BudgetCard(): ReactElement {
  const { data, isReady } = useFinanceData();
  const budgets = toBudgetsData(data);

  const body = !isReady ? (
    <div>
      <p role="status" className="sr-only">
        Loading budgets
      </p>
      <div aria-hidden="true" className={`${BODY} animate-pulse`}>
        <div className={CHART_FRAME}>
          <div className="bg-grey-100 aspect-square w-full max-w-[240px] rounded-full" />
        </div>
        <ul className={LEGEND}>
          {Array.from({ length: LEGEND_LIMIT }, (_, index) => (
            <MicroDetail
              key={index}
              color="var(--color-grey-100)"
              title={<span className="bg-grey-100 block h-2.5 w-20 rounded" />}
              detail={<span className="bg-grey-100 block h-3 w-14 rounded" />}
            />
          ))}
        </ul>
      </div>
    </div>
  ) : budgets.length === 0 ? (
    <Text preset="preset-4" className="text-grey-500 py-4">
      No budgets yet. Add one from the Budgets page.
    </Text>
  ) : (
    <div className={BODY}>
      <div className={CHART_FRAME}>
        <BudgetChart budgets={budgets} />
      </div>
      <ul className={LEGEND}>
        {budgets.slice(0, LEGEND_LIMIT).map((budget) => (
          <MicroDetail
            key={budget.id}
            color={budget.theme}
            title={budget.category}
            // The design's legend lists each category's limit, not its spending —
            // the four figures add up to the "of $975 limit" under the chart.
            detail={formatCurrency(budget.maximum, 2)}
          />
        ))}
      </ul>
    </div>
  );

  return (
    <Card size="lg" className="@container">
      <OverviewCardTop href="/budgets" label="Budgets" />
      {body}
    </Card>
  );
}
