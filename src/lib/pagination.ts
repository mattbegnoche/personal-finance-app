/** Placeholder for a run of hidden page numbers. */
export const ELLIPSIS = "ellipsis";

export type PaginationItem = number | typeof ELLIPSIS;

/** Pages kept on each side of the current page once eliding kicks in. */
const SIBLING_COUNT = 1;

const FIRST_PAGE = 1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/** Inserts an {@link ELLIPSIS} wherever consecutive pages are more than one apart. */
function withEllipses(pages: readonly number[]): PaginationItem[] {
  return pages.flatMap((page, index) => {
    const previous = pages[index - 1];
    const hasGap = previous !== undefined && page - previous > 1;

    return hasGap ? [ELLIPSIS, page] : [page];
  });
}

/**
 * Builds the page numbers to render, eliding long runs so the control keeps a
 * fixed width. Always keeps the first page, the last page, and the pages
 * immediately around `currentPage`.
 *
 * @param currentPage Clamped into `[1, pageCount]`.
 * @param pageCount Total pages. `0` yields an empty list.
 */
export function buildPaginationItems(
  currentPage: number,
  pageCount: number,
): readonly PaginationItem[] {
  if (pageCount < FIRST_PAGE) return [];

  // Seven or fewer pages fit without eliding.
  if (pageCount <= 7) {
    return range(FIRST_PAGE, pageCount);
  }

  const page = clamp(currentPage, FIRST_PAGE, pageCount);
  const siblings = range(
    clamp(page - SIBLING_COUNT, FIRST_PAGE, pageCount),
    clamp(page + SIBLING_COUNT, FIRST_PAGE, pageCount),
  );
  const visible = new Set([FIRST_PAGE, ...siblings, pageCount]);

  return withEllipses([...visible].sort((a, b) => a - b));
}
