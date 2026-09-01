import { unstable_rethrow } from "next/navigation";
import type { ReactElement } from "react";
import { BudgetChart } from "./BudgetChart";
import OverviewCardTop from "./OverviewCardTop";
import { Card } from "../ui/Card";
import { MicroDetail } from "../ui/MicroDetail";
import { Text } from "../ui/Text";
import { ApiError } from "@/lib/api/fetch-json";
import { loadBudgets } from "@/lib/budgets/load";
import type { BudgetWithSpending } from "@/lib/budgets/spending";
import { formatCurrency } from "@/lib/format";

/** The design's legend has room for four categories. */
const LEGEND_LIMIT = 4;

const CHART_FRAME = "mb-5 flex h-[14rem] w-[14rem] flex-1 justify-center";
const LEGEND = "grid grid-cols-2 gap-4 sm:grid-cols-1";

function CardShell({ children }: { children: ReactElement }): ReactElement {
  return (
    <Card>
      <OverviewCardTop href="/budgets" label="Budgets" />
      {children}
    </Card>
  );
}

/** Compact stand-in shown while the card's data is in flight. */
export function BudgetCardSkeleton(): ReactElement {
  return (
    <CardShell>
      <div>
        <p role="status" className="sr-only">
          Loading budgets
        </p>
        <div aria-hidden="true" className="flex animate-pulse flex-wrap gap-4">
          <div className={CHART_FRAME}>
            <div className="bg-grey-100 aspect-square w-full max-w-[240px] rounded-full" />
          </div>
          <ul className={LEGEND}>
            {Array.from({ length: LEGEND_LIMIT }, (_, index) => (
              <MicroDetail
                key={index}
                color="var(--color-grey-100)"
                title={
                  <span className="bg-grey-100 block h-2.5 w-20 rounded" />
                }
                detail={<span className="bg-grey-100 block h-3 w-14 rounded" />}
              />
            ))}
          </ul>
        </div>
      </div>
    </CardShell>
  );
}

/**
 * Overview summary of this month's budgets, linking through to the full page.
 *
 * A failure degrades to a short message rather than taking down the rest of the
 * Overview page.
 */
export async function BudgetCard(): Promise<ReactElement> {
  let budgets: ReadonlyArray<BudgetWithSpending>;

  try {
    ({ budgets } = await loadBudgets());
  } catch (error) {
    unstable_rethrow(error);
    console.error("[overview] could not load budgets", error);

    return (
      <CardShell>
        <Text role="alert" preset="preset-4" className="text-grey-500 py-4">
          {error instanceof ApiError
            ? error.message
            : "Something went wrong loading your budgets."}
        </Text>
      </CardShell>
    );
  }

  if (budgets.length === 0) {
    return (
      <CardShell>
        <Text preset="preset-4" className="text-grey-500 py-4">
          No budgets set up yet.
        </Text>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <div className="flex flex-wrap gap-4">
        <div className={CHART_FRAME}>
          <BudgetChart budgets={budgets} />
        </div>
        <ul className={LEGEND}>
          {budgets.slice(0, LEGEND_LIMIT).map((budget) => (
            <MicroDetail
              key={budget.id}
              color={budget.theme}
              title={budget.category}
              detail={formatCurrency(budget.spent, 2)}
            />
          ))}
        </ul>
      </div>
    </CardShell>
  );
}
