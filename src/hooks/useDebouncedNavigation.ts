"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";

export interface DebouncedNavigation {
  /** True while a navigation started here is still resolving. */
  isPending: boolean;
  /** Navigates immediately. For controls that change in one discrete step. */
  navigate: (href: string) => void;
  /** Navigates once typing settles. For search inputs. */
  navigateDebounced: (href: string) => void;
}

/**
 * Replaces the current URL as filters change, so the server re-renders the view.
 *
 * Uses `replace` rather than `push` — tweaking a filter should not fill the back
 * stack — and wraps each change in a transition so React can keep the old
 * results on screen until the new ones arrive.
 */
export function useDebouncedNavigation(): DebouncedNavigation {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const navigate = useCallback(
    (href: string) => {
      startTransition(() => router.replace(href, { scroll: false }));
    },
    [router],
  );

  const navigateDebounced = useCallback(
    (href: string) => {
      clearTimeout(debounceRef.current);
      // 300ms skips most intermediate keystrokes while still feeling live.
      debounceRef.current = setTimeout(() => navigate(href), 300);
    },
    [navigate],
  );

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return { isPending, navigate, navigateDebounced };
}
