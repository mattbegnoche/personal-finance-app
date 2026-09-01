import { BudgetChart } from "./BudgetChart";
import { Card } from "../ui/Card";
import { MicroDetail } from "../ui/MicroDetail";
import { NAV_ITEMS } from "@/lib/navigation";
import { SAMPLE_BUDGETS } from "@/lib/sample-data";
import OverviewCardTop from "./OverviewCardTop";

export function BudgetCard() {
  const [BudgetsEl] = NAV_ITEMS.filter((el) => el.label === "Budgets");
  return (
    <Card>
      <OverviewCardTop href={BudgetsEl.href} label={BudgetsEl.label} />
      <div className="flex flex-wrap gap-4">
        <div className="mb-5 flex h-[14rem] w-[14rem] flex-1 justify-center">
          <BudgetChart budgets={SAMPLE_BUDGETS} />
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <MicroDetail detail="Sample" title="Title" />
          <MicroDetail detail="Sample" title="Title" />
          <MicroDetail detail="Sample" title="Title" />
          <MicroDetail detail="Sample" title="Title" />
        </ul>
      </div>
    </Card>
  );
}
