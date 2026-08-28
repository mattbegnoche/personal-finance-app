import type { Metadata } from "next";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Transactions",
};

export default function Transactions() {
  return (
    <Text as="h1" preset="preset-1">
      Transactions
    </Text>
  );
}
