import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { buildPaginationItems, ELLIPSIS } from "@/lib/pagination";
import {
  toTransactionsHref,
  type TransactionQuery,
} from "@/lib/transactions/query";

const BOX_BASE =
  "flex items-center justify-center rounded-lg border text-preset-4 transition-colors";
const STEP_BOX = `${BOX_BASE} gap-4 border-beige-500 px-4 py-2`;
const PAGE_BOX = `${BOX_BASE} size-10 border-beige-500`;
const INTERACTIVE =
  "hover:border-beige-500 hover:bg-beige-500 hover:text-white";

interface StepLinkProps {
  href: string;
  isDisabled: boolean;
  label: string;
  children: ReactNode;
}

/** Previous/next control. Falls back to a disabled button at either end. */
function StepLink({
  href,
  isDisabled,
  label,
  children,
}: StepLinkProps): ReactElement {
  if (isDisabled) {
    return (
      <button
        type="button"
        disabled
        aria-label={label}
        className={cn(STEP_BOX, "text-beige-500 cursor-not-allowed opacity-50")}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(STEP_BOX, "text-grey-500", INTERACTIVE)}
    >
      {children}
    </Link>
  );
}

function StepIcon({ icon }: { icon: "caret-left" | "caret-right" }) {
  return <Icon name={icon} size={16} className="shrink-0" />;
}

interface TransactionsPaginationProps {
  /** Query the links are built from; only `page` is overridden. */
  query: TransactionQuery;
  /** The page currently being shown. */
  page: number;
  pageCount: number;
}

/**
 * Page navigation for the transactions table.
 *
 * Links carry the active search, sort and category, so paging never drops a
 * filter and every page is a shareable URL. Mobile keeps only the first, last
 * and current pages to stay within a 375px screen.
 */
export function TransactionsPagination({
  query,
  page,
  pageCount,
}: TransactionsPaginationProps): ReactElement | null {
  if (pageCount <= 1) return null;

  const items = buildPaginationItems(page, pageCount);

  return (
    <nav
      aria-label="Transactions pagination"
      className="flex items-center justify-between gap-4 pt-6"
    >
      <StepLink
        href={toTransactionsHref(query, { page: page - 1 })}
        isDisabled={page <= 1}
        label="Go to previous page"
      >
        <StepIcon icon="caret-left" />
        <span className="hidden sm:inline">Prev</span>
      </StepLink>

      <ul className="flex items-center gap-2">
        {items.map((item, index) =>
          item === ELLIPSIS ? (
            <li
              key={`${ELLIPSIS}-${index}`}
              aria-hidden="true"
              className={cn(PAGE_BOX, "text-grey-500 hidden sm:flex")}
            >
              &hellip;
            </li>
          ) : (
            <li
              key={item}
              // Mobile keeps only the anchors: first, last and where you are.
              className={
                item === 1 || item === pageCount || item === page
                  ? "flex"
                  : "hidden sm:flex"
              }
            >
              <Link
                href={toTransactionsHref(query, { page: item })}
                aria-label={`Go to page ${item}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  PAGE_BOX,
                  item === page
                    ? "border-grey-900 bg-grey-900 text-white"
                    : cn("text-grey-900", INTERACTIVE),
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}
      </ul>

      <StepLink
        href={toTransactionsHref(query, { page: page + 1 })}
        isDisabled={page >= pageCount}
        label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <StepIcon icon="caret-right" />
      </StepLink>
    </nav>
  );
}
