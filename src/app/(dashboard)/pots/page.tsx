import type { Metadata } from "next";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";

export const metadata: Metadata = {
  title: "Pots",
};

export default function Pots() {
  return (
    <>
      <DashboardTitle text="Pots" />
    </>
  );
}
