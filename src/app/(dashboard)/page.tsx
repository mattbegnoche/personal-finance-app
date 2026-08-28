import type { Metadata } from "next";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Overview",
};

export default function Overview() {
  return (
    <>
      <DashboardTitle text="Overview" />
      <div className="grid grid-cols-1 gap-md">
        <div className="grid sm:grid-cols-3 gap-sm">
          <Card>Current Balance</Card>
          <Card>Income</Card>
          <Card>Expenses</Card>
        </div>
        <div className="grid-12 gap-sm">
          <div className="sm:col-span-7 grid gap-sm">
            <Card>Pots</Card>
            <Card>Transactions</Card>
          </div>
          <div className="sm:col-span-5 grid gap-sm">
            <Card>Pots</Card>
            <Card>Transactions</Card>
          </div>
        </div>
      </div>
    </>
  );
}
