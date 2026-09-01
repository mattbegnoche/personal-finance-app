import { Text } from "./Text";

export function MicroDetail({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="bg-grey-900 w-1 rounded-lg"></div>
      <div className="flex flex-col gap-2">
        <Text preset="preset-5">{title}</Text>
        <Text preset="preset-4-bold">{detail}</Text>
      </div>
    </li>
  );
}
