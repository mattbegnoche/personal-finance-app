import type { ReactNode } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar />

      {/* Bottom padding clears the fixed mobile nav. */}
      <main className="min-w-0 flex-1 px-4 py-6 pb-28 md:px-10 md:py-8 lg:pb-8">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
