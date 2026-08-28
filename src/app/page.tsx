import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Text } from "@/components/ui/Text";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar />

      {/* Bottom padding clears the fixed mobile nav. */}
      <main className="min-w-0 flex-1 px-4 py-6 pb-28 md:px-10 md:py-8 lg:pb-8">
        <Text as="h1" preset="preset-1">
          Overview
        </Text>
      </main>

      <MobileNav />
    </div>
  );
}
