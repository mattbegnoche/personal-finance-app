"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, isNavItemActive } from "@/lib/navigation";

const NAV_ICON_SIZE = 24;

/** Transparent bottom border on resting items keeps the active border from shifting layout. */
const ITEM_BASE =
  "flex flex-1 flex-col items-center gap-1 rounded-t-lg border-b-4 border-transparent pt-2 pb-3 transition-colors";
const ITEM_STATE = {
  active: "border-b-green bg-beige-100 text-grey-900",
  resting: "text-grey-300 hover:text-grey-100",
} as const;

export function MobileNav(): ReactElement {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 rounded-t-lg bg-grey-900 px-4 pt-2 lg:hidden"
    >
      <ul className="mx-auto flex max-w-200 items-end justify-between">
        {NAV_ITEMS.map((item) => {
          const isActive = isNavItemActive(item.href, pathname);

          return (
            <li key={item.href} className="flex flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  ITEM_BASE,
                  ITEM_STATE[isActive ? "active" : "resting"],
                )}
              >
                <Icon
                  name={item.icon}
                  size={NAV_ICON_SIZE}
                  className={cn("shrink-0", isActive && "text-green")}
                />
                {/* Labels appear at tablet and up; mobile is icon-only. */}
                <span className="hidden text-preset-5-bold md:block">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
