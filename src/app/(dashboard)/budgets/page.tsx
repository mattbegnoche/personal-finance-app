import type { Metadata } from "next";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";

export const metadata: Metadata = {
  title: "Budgets",
};

export default function Budgets() {
  return (
    <>
      <DashboardTitle text="Budgets" />
    </>
  );
}
