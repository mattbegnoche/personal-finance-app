import type { Metadata } from "next";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { AddPotButton } from "@/components/pots/AddPotButton";
import { PotsContent } from "@/components/pots/PotsContent";

const PAGE_NAME = "Pots";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default function Pots() {
  return (
    <>
      <DashboardTitle text={PAGE_NAME} action={<AddPotButton />} />
      <PotsContent />
    </>
  );
}
