import type { Metadata } from "next";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Recurring Bills",
};

export default function RecurringBills() {
  return (
    <Text as="h1" preset="preset-1">
      Recurring Bills
    </Text>
  );
}
