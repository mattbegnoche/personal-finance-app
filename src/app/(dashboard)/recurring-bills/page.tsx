import type { Metadata } from "next";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";

export const metadata: Metadata = {
  title: "Recurring Bills",
};

export default function RecurringBills() {
  return (
    <>
      <DashboardTitle text="Recurring Bills" />
    </>
  );
}
