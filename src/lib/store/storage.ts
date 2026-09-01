import { parseSeed, SEED_DATA } from "./seed";
import type { FinanceData } from "./types";

/**
 * Versioned so a future change to the shape can start visitors fresh instead of
 * failing to read what an older build wrote.
 */
const STORAGE_KEY = "personal-finance-app:data:v1";

/**
 * Reads the visitor's saved data.
 *
 * Storage can be unavailable (private browsing, blocked site data) or hold
 * something a previous version wrote, so every failure falls back to the sample
 * data rather than breaking the app.
 *
 * @returns The saved data, or `undefined` if there is nothing usable to read.
 */
export function readStoredData(): FinanceData | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    return raw === null ? undefined : parseSeed(JSON.parse(raw));
  } catch (error) {
    console.warn(
      "[storage] could not read saved data, using the sample data",
      error,
    );

    return undefined;
  }
}

/**
 * Saves the visitor's data.
 *
 * @returns `true` when the write succeeded. Storage may be full or blocked.
 */
export function writeStoredData(data: FinanceData): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    return true;
  } catch (error) {
    console.warn("[storage] could not save your changes", error);

    return false;
  }
}

/** Forgets the visitor's changes, so the next read returns the sample data. */
export function clearStoredData(): FinanceData {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("[storage] could not clear saved data", error);
  }

  return SEED_DATA;
}
