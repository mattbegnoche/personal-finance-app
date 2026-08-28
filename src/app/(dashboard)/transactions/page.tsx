import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

const PAGE_NAME = "Transactions";

export const metadata: Metadata = {
  title: PAGE_NAME,
};

export default function Transactions() {
  return (
    <>
      <DashboardTitle text={PAGE_NAME} />
      <div>
        <Card>Hello</Card>
      </div>
    </>
  );
}
