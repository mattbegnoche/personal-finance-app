import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { PotsContent } from "@/components/pots/PotsContent";
import { PotsSkeleton } from "@/components/pots/PotsSkeleton";

const PAGE_NAME = "Pots";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default function Pots() {
  return (
    <>
      <DashboardTitle text={PAGE_NAME} />

      <Suspense fallback={<PotsSkeleton />}>
        <PotsContent />
      </Suspense>
    </>
  );
}
