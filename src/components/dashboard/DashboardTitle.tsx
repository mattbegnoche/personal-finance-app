import { Text } from "../ui/Text";

export function DashboardTitle({ text }: { text: string }) {
  return (
    <Text as="h1" preset="preset-1" className="mb-8 sm:mb-10">
      {text}
    </Text>
  );
}
