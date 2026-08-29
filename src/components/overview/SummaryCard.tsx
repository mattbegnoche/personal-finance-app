import { Card, CardTheme } from "../ui/Card";
import { Text } from "../ui/Text";

function SummaryCard({
  theme = "light",
  title,
  value,
}: {
  theme?: CardTheme;
  title: string;
  value: string;
}) {
  return (
    <Card theme={theme}>
      <Text preset="preset-4" as="h4" className="mb-3">
        {title}
      </Text>
      <Text preset="preset-1">{value}</Text>
    </Card>
  );
}

export default SummaryCard;
