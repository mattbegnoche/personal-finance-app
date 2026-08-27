import type { IconProps as PhosphorIconProps, IconWeight } from "@phosphor-icons/react/lib";
import {
  ArrowFatLinesLeft,
  ArrowsDownUp,
  Barbell,
  BookOpenText,
  CaretDown,
  CaretRight,
  CaretUp,
  ChartDonut,
  CheckCircle,
  DotsThreeOutline,
  Eye,
  EyeSlash,
  Funnel,
  House,
  ListBullets,
  MagnifyingGlass,
  MusicNote,
  Network,
  PottedPlant,
  Receipt,
  ShieldPlus,
  SortAscending,
  TipJar,
  Video,
  Warehouse,
  WarningCircle,
  Wrench,
} from "@phosphor-icons/react/ssr";
import type { ReactElement } from "react";

/**
 * Icons used by the design system, keyed by their Figma name.
 * Add a Phosphor import above and an entry here to extend the set.
 */
const ICONS = {
  "arrow-fat-lines-left": ArrowFatLinesLeft,
  "arrows-down-up": ArrowsDownUp,
  barbell: Barbell,
  "book-open-text": BookOpenText,
  "caret-down": CaretDown,
  "caret-right": CaretRight,
  "caret-up": CaretUp,
  "chart-donut": ChartDonut,
  "check-circle": CheckCircle,
  "dots-three-outline": DotsThreeOutline,
  eye: Eye,
  "eye-slash": EyeSlash,
  filter: Funnel,
  house: House,
  jar: TipJar,
  "list-bullets": ListBullets,
  "magnifying-glass": MagnifyingGlass,
  "music-note": MusicNote,
  network: Network,
  "potted-plant": PottedPlant,
  receipt: Receipt,
  "shield-plus": ShieldPlus,
  sort: SortAscending,
  video: Video,
  warehouse: Warehouse,
  "warning-circle": WarningCircle,
  wrench: Wrench,
} as const;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as ReadonlyArray<IconName>;

const DEFAULT_ICON_SIZE = 16;
const DEFAULT_ICON_WEIGHT: IconWeight = "fill";

export interface IconProps extends PhosphorIconProps {
  /** Icon to render, keyed by its Figma name. */
  name: IconName;
}

export function Icon({
  name,
  size = DEFAULT_ICON_SIZE,
  weight = DEFAULT_ICON_WEIGHT,
  ...rest
}: IconProps): ReactElement {
  const PhosphorIcon = ICONS[name];

  return <PhosphorIcon size={size} weight={weight} {...rest} />;
}
