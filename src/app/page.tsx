import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

export default function Home() {
  return (
    <main>
      <Card>
        <Text className="mb-6">This is text</Text>
        <Button>Hello This is a Button</Button>
      </Card>
    </main>
  );
}
