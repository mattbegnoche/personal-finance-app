import { Text } from "@/components/ui/Text";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Text className="text-green" as="h1" preset="preset-1">
        This is sample text
      </Text>
    </main>
  );
}
