import type { Metadata } from "next";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Pots",
};

export default function Pots() {
  return (
    <Text as="h1" preset="preset-1">
      Pots
    </Text>
  );
}
