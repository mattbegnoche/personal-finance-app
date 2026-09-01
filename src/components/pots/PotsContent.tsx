"use client";

import type { ReactElement } from "react";
import { PotCard } from "./PotCard";
import { PotsSkeleton } from "./PotsSkeleton";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Notice } from "@/components/ui/Notice";

/** Every savings pot the visitor has. */
export function PotsContent(): ReactElement {
  const { data, isReady } = useFinanceData();

  if (!isReady) return <PotsSkeleton />;

  if (data.pots.length === 0) {
    return (
      <Notice
        icon="jar"
        title="No pots yet"
        description="Create a pot to set a savings target and track your progress towards it."
      />
    );
  }

  return (
    <ul className="gap-sm grid sm:grid-cols-2">
      {data.pots.map((pot) => (
        <PotCard key={pot.id} pot={pot} />
      ))}
    </ul>
  );
}
