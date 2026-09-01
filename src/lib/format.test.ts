import { describe, expect, test } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatPercent,
  formatSignedCurrency,
  roundCurrency,
  toOrdinal,
} from "./format";

describe("formatCurrency", () => {
  test("formats a whole dollar amount with no decimals by default", () => {
    expect(formatCurrency(407)).toBe("$407");
  });

  test("renders the requested number of decimal places", () => {
    expect(formatCurrency(407.5, 2)).toBe("$407.50");
  });

  test("throws when the value is not a finite number", () => {
    expect(() => formatCurrency(Number.NaN)).toThrow(/finite number/);
  });
});

describe("formatSignedCurrency", () => {
  test("prefixes credits with a plus sign", () => {
    expect(formatSignedCurrency(75.5)).toBe("+$75.50");
  });

  test("prefixes debits with a minus sign and drops the raw negative", () => {
    expect(formatSignedCurrency(-55.5)).toBe("-$55.50");
  });

  test("treats zero as a credit", () => {
    expect(formatSignedCurrency(0)).toBe("+$0.00");
  });

  test("throws when the value is not a finite number", () => {
    expect(() => formatSignedCurrency(Number.POSITIVE_INFINITY)).toThrow(
      /finite number/,
    );
  });
});

describe("formatDate", () => {
  test("renders an ISO timestamp as a day-month-year date", () => {
    expect(formatDate("2024-08-19T14:23:11Z")).toBe("19 Aug 2024");
  });

  test("reads the timestamp in UTC so the server and client agree", () => {
    // 01:00 UTC is the previous day in the Americas; it must still read as the 2nd.
    expect(formatDate("2024-07-02T01:25:51Z")).toBe("2 Jul 2024");
  });

  test("throws when the timestamp cannot be parsed", () => {
    expect(() => formatDate("not-a-date")).toThrow(/valid date/);
  });
});

describe("roundCurrency", () => {
  test("clears floating point drift from summed decimals", () => {
    expect(roundCurrency(0.1 + 0.2)).toBe(0.3);
  });

  test("rounds to whole cents in both directions", () => {
    expect(roundCurrency(12.344)).toBe(12.34);
    expect(roundCurrency(12.346)).toBe(12.35);
  });

  test("leaves an exact amount untouched", () => {
    expect(roundCurrency(159)).toBe(159);
  });
});

describe("formatPercent", () => {
  test("renders a ratio with two decimals by default", () => {
    expect(formatPercent(159, 2000)).toBe("7.95%");
  });

  test("honours a requested precision", () => {
    expect(formatPercent(110, 150, 0)).toBe("73%");
  });

  test("reads a zero total as zero rather than dividing by it", () => {
    expect(formatPercent(50, 0)).toBe("0.00%");
  });

  test("throws when either argument is not a finite number", () => {
    expect(() => formatPercent(Number.NaN, 100)).toThrow(/finite number/);
    expect(() => formatPercent(100, Number.NaN)).toThrow(/finite number/);
  });
});

describe("toOrdinal", () => {
  test.each([
    [1, "1st"],
    [2, "2nd"],
    [3, "3rd"],
    [4, "4th"],
    [11, "11th"],
    [12, "12th"],
    [13, "13th"],
    [21, "21st"],
    [22, "22nd"],
    [23, "23rd"],
    [30, "30th"],
  ])("renders %i as %s", (value, expected) => {
    expect(toOrdinal(value)).toBe(expected);
  });

  test("throws when the value is not a finite number", () => {
    expect(() => toOrdinal(Number.NaN)).toThrow(/finite number/);
  });
});
