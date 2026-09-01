import { describe, expect, test } from "vitest";
import { buildPaginationItems, ELLIPSIS } from "./pagination";

describe("buildPaginationItems", () => {
  test("lists every page when the count fits without eliding", () => {
    expect(buildPaginationItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test("returns an empty list when there are no pages", () => {
    expect(buildPaginationItems(1, 0)).toEqual([]);
  });

  test("elides the tail when the current page sits near the start", () => {
    expect(buildPaginationItems(2, 10)).toEqual([1, 2, 3, ELLIPSIS, 10]);
  });

  test("elides the head when the current page sits near the end", () => {
    expect(buildPaginationItems(9, 10)).toEqual([1, ELLIPSIS, 8, 9, 10]);
  });

  test("elides both sides when the current page sits in the middle", () => {
    expect(buildPaginationItems(5, 10)).toEqual([
      1,
      ELLIPSIS,
      4,
      5,
      6,
      ELLIPSIS,
      10,
    ]);
  });

  test("clamps a current page below the first page", () => {
    expect(buildPaginationItems(0, 3)).toEqual([1, 2, 3]);
  });

  test("clamps a current page past the last page", () => {
    expect(buildPaginationItems(99, 3)).toEqual([1, 2, 3]);
  });
});
