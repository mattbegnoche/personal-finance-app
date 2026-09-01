import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { clearStoredData, readStoredData, writeStoredData } from "./storage";
import { SEED_DATA } from "./seed";
import { addPot } from "./mutations";

/** Minimal stand-in for the browser's localStorage. */
function fakeStorage(overrides: Partial<Storage> = {}) {
  const entries = new Map<string, string>();

  return {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
    ...overrides,
  } as Storage;
}

function useStorage(storage: Storage) {
  vi.stubGlobal("window", { localStorage: storage });
}

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("readStoredData", () => {
  test("returns nothing when the visitor has saved nothing yet", () => {
    useStorage(fakeStorage());

    expect(readStoredData()).toBeUndefined();
  });

  test("reads back exactly what was written", () => {
    useStorage(fakeStorage());
    const saved = addPot(SEED_DATA, {
      name: "Rainy Days",
      target: 500,
      theme: "#3F82B2",
    });
    writeStoredData(saved);

    expect(readStoredData()).toEqual(saved);
  });

  test("falls back to the sample data when the saved value is not valid JSON", () => {
    useStorage(fakeStorage({ getItem: () => "{oops" }));

    expect(readStoredData()).toBeUndefined();
  });

  test("falls back when the saved value has the wrong shape", () => {
    useStorage(fakeStorage({ getItem: () => JSON.stringify({ balance: {} }) }));

    expect(readStoredData()).toBeUndefined();
  });

  test("falls back when reading throws, as in a locked-down browser", () => {
    useStorage(
      fakeStorage({
        getItem: () => {
          throw new Error("blocked");
        },
      }),
    );

    expect(readStoredData()).toBeUndefined();
  });
});

describe("writeStoredData", () => {
  test("reports success when the write goes through", () => {
    useStorage(fakeStorage());

    expect(writeStoredData(SEED_DATA)).toBe(true);
  });

  test("reports failure instead of throwing when storage is full or blocked", () => {
    useStorage(
      fakeStorage({
        setItem: () => {
          throw new Error("QuotaExceededError");
        },
      }),
    );

    expect(writeStoredData(SEED_DATA)).toBe(false);
  });
});

describe("clearStoredData", () => {
  test("forgets the saved data and hands back the sample data", () => {
    useStorage(fakeStorage());
    writeStoredData(addPot(SEED_DATA, { name: "Gone", target: 10, theme: "#3F82B2" }));

    expect(clearStoredData()).toEqual(SEED_DATA);
    expect(readStoredData()).toBeUndefined();
  });

  test("still hands back the sample data when clearing throws", () => {
    useStorage(
      fakeStorage({
        removeItem: () => {
          throw new Error("blocked");
        },
      }),
    );

    expect(clearStoredData()).toEqual(SEED_DATA);
  });
});
