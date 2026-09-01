import type { IconName } from "@/components/ui/Icon";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

/** Primary app navigation, in the order the Figma sidebar lists it. */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Overview", icon: "house" },
  { href: "/transactions", label: "Transactions", icon: "arrows-down-up" },
  { href: "/budgets", label: "Budgets", icon: "chart-donut" },
  { href: "/pots", label: "Pots", icon: "jar" },
  { href: "/recurring-bills", label: "Recurring bills", icon: "receipt" },
];

/** Exact match for the root route, prefix match for the rest. */
export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
