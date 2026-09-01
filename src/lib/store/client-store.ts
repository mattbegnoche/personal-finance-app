import { SEED_DATA } from "./seed";
import { clearStoredData, readStoredData, writeStoredData } from "./storage";
import type { FinanceData } from "./types";

/**
 * The live dataset, held outside React so `useSyncExternalStore` can read it.
 *
 * Undefined until first read: `localStorage` is only reachable on the client,
 * so the value is filled in lazily rather than at module load.
 */
let current: FinanceData | undefined;

/** Set when a write was rejected — storage full, or blocked by the browser. */
let hasStorageError = false;

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * The visitor's data.
 *
 * Must stay referentially stable between changes — React re-renders in a loop
 * if a snapshot getter returns a fresh object every call.
 */
export function getSnapshot(): FinanceData {
  current ??= readStoredData() ?? SEED_DATA;

  return current;
}

/** The server has no storage to read, so it always renders the sample data. */
export function getServerSnapshot(): FinanceData {
  return SEED_DATA;
}

export function getStorageError(): boolean {
  return hasStorageError;
}

/** Applies an immutable transform from `./mutations` and saves the result. */
export function updateData(
  transform: (current: FinanceData) => FinanceData,
): void {
  current = transform(getSnapshot());
  hasStorageError = !writeStoredData(current);
  emit();
}

/** Throws away the visitor's changes and restores the sample data. */
export function resetData(): void {
  current = clearStoredData();
  hasStorageError = false;
  emit();
}
