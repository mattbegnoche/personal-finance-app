"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactElement } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, isNavItemActive, type NavItem } from "@/lib/navigation";

const NAV_ICON_SIZE = 24;
const SIDEBAR_WIDTH = { full: "w-[300px]", minimized: "w-[88px]" } as const;

/** Transparent left border on resting items keeps the active border from shifting layout. */
const ITEM_BASE =
  "flex h-14 items-center gap-4 rounded-r-xl border-l-4 border-transparent px-8 py-4 transition-colors";
const ITEM_STATE = {
  active: "border-l-green bg-beige-100 text-grey-900",
  resting: "text-grey-300 hover:text-grey-100",
} as const;

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  isMinimized: boolean;
}

function SidebarItem({
  item,
  isActive,
  isMinimized,
}: SidebarItemProps): ReactElement {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      title={isMinimized ? item.label : undefined}
      className={cn(ITEM_BASE, ITEM_STATE[isActive ? "active" : "resting"])}
    >
      <Icon
        name={item.icon}
        size={NAV_ICON_SIZE}
        className={cn("shrink-0", isActive && "text-green")}
      />
      {!isMinimized && (
        <span className="min-w-px flex-1 text-preset-3">{item.label}</span>
      )}
    </Link>
  );
}

export function Sidebar(): ReactElement {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <nav
      aria-label="Main"
      className={cn(
        "hidden shrink-0 flex-col gap-6 rounded-r-2xl bg-grey-900 pb-6 transition-[width] lg:sticky lg:top-0 lg:flex lg:h-dvh",
        SIDEBAR_WIDTH[isMinimized ? "minimized" : "full"],
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-center px-8 py-10",
          isMinimized ? "items-center" : "items-start",
        )}
      >
        <Link href="/" aria-label="Finance home">
          <Image
            src={
              isMinimized
                ? "/assets/images/logo-small.svg"
                : "/assets/images/logo-large.svg"
            }
            alt="finance"
            width={isMinimized ? 13 : 122}
            height={22}
            priority
          />
        </Link>
      </div>

      <ul
        className={cn(
          "flex flex-1 flex-col gap-1",
          isMinimized ? "pr-2" : "pr-6",
        )}
      >
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <SidebarItem
              item={item}
              isActive={isNavItemActive(item.href, pathname)}
              isMinimized={isMinimized}
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setIsMinimized((minimized) => !minimized)}
        aria-expanded={!isMinimized}
        className={cn(
          ITEM_BASE,
          ITEM_STATE.resting,
          "w-full cursor-pointer text-left",
        )}
      >
        <Icon
          name="arrow-fat-lines-left"
          size={NAV_ICON_SIZE}
          className={cn("shrink-0 transition-transform", isMinimized && "rotate-180")}
        />
        {!isMinimized && (
          <span className="min-w-px flex-1 text-preset-3">Minimize Menu</span>
        )}
      </button>
    </nav>
  );
}
