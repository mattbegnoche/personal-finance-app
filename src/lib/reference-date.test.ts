import { describe, expect, test } from "vitest";
import {
  isInReferenceMonth,
  toReferenceDate,
  utcDayOfMonth,
} from "./reference-date";

const TX = (date: string) => ({ date });

describe("toReferenceDate", () => {
  test("uses the newest transaction date", () => {
    const reference = toReferenceDate([
      TX("2024-07-02T09:25:51Z"),
      TX("2024-08-19T20:23:11Z"),
      TX("2024-08-11T15:45:38Z"),
    ]);

    expect(reference.toISOString()).toBe("2024-08-19T20:23:11.000Z");
  });

  test("falls back to the clock when there are no transactions", () => {
    const before = Date.now();
    const reference = toReferenceDate([]);

    expect(reference.getTime()).toBeGreaterThanOrEqual(before);
  });

  test("ignores dates it cannot parse", () => {
    const reference = toReferenceDate([
      TX("2024-08-19T20:23:11Z"),
      TX("not-a-date"),
    ]);

    expect(reference.toISOString()).toBe("2024-08-19T20:23:11.000Z");
  });
});

describe("isInReferenceMonth", () => {
  const reference = new Date("2024-08-19T20:23:11Z");

  test("accepts a date in the same UTC month and year", () => {
    expect(isInReferenceMonth("2024-08-01T00:00:00Z", reference)).toBe(true);
  });

  test("rejects the same month in a different year", () => {
    expect(isInReferenceMonth("2023-08-15T00:00:00Z", reference)).toBe(false);
  });

  test("rejects an adjacent month", () => {
    expect(isInReferenceMonth("2024-07-31T23:59:59Z", reference)).toBe(false);
  });

  test("rejects an unparseable date", () => {
    expect(isInReferenceMonth("whenever", reference)).toBe(false);
  });
});

describe("utcDayOfMonth", () => {
  test("reads the day in UTC, not the local zone", () => {
    expect(utcDayOfMonth("2024-08-02T01:30:00Z")).toBe(2);
  });

  test("returns 0 for an unparseable date", () => {
    expect(utcDayOfMonth("nope")).toBe(0);
  });
});
