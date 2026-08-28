import type { Metadata } from "next";
import { Text } from "@/components/ui/Text";

export const metadata: Metadata = {
  title: "Overview",
};

export default function Overview() {
  return (
    <Text as="h1" preset="preset-1">
      Overview
    </Text>
  );
}
