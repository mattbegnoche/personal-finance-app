"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

export interface ActionsMenuItem {
  readonly label: string;
  readonly onSelect: () => void;
  /** Renders in the destructive colour, for delete actions. */
  readonly isDestructive?: boolean;
}

interface ActionsMenuProps {
  /** Accessible name, e.g. `"Bills budget actions"`. */
  label: string;
  items: ReadonlyArray<ActionsMenuItem>;
}

/** The design's "…" menu, holding a record's edit and delete actions. */
export function ActionsMenu({ label, items }: ActionsMenuProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="text-grey-300 hover:text-grey-900 focus-visible:outline-grey-900 flex cursor-pointer items-center rounded-sm p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Icon name="dots-three-outline" size={16} />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={label}
          className="absolute top-full right-0 z-20 mt-2 w-max min-w-34 rounded-lg bg-white p-3 shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                item.onSelect();
              }}
              className={cn(
                "border-grey-100 text-preset-4 block w-full cursor-pointer border-b py-3 text-left first:pt-0 last:border-b-0 last:pb-0",
                item.isDestructive ? "text-red" : "text-grey-900",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
