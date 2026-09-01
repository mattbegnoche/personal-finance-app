import type { ReactNode } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Container } from "@/components/layout/Container";
import { DataFooter } from "@/components/providers/DataFooter";
import { FinanceDataProvider } from "@/components/providers/FinanceDataProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <FinanceDataProvider>
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        {/* Bottom padding clears the fixed mobile nav. */}
        <main className="min-w-0 flex-1 py-6 pb-28 md:py-8 lg:pb-8">
          <Container size="md">
            {children}
            <DataFooter />
          </Container>
        </main>

        <MobileNav />
      </div>
    </FinanceDataProvider>
  );
}
