"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getServerSnapshot,
  getSnapshot,
  getStorageError,
  resetData,
  subscribe,
  updateData,
} from "@/lib/store/client-store";
import type { FinanceData } from "@/lib/store/types";

interface FinanceDataContextValue {
  data: FinanceData;
  /**
   * False on the server and through hydration, true once the browser has taken
   * over. Views wait for it before showing figures, so a returning visitor
   * never sees the sample data flash before their own.
   */
  isReady: boolean;
  /** Applies an immutable transform from `@/lib/store/mutations` and saves it. */
  update: (transform: (data: FinanceData) => FinanceData) => void;
  /** Throws away the visitor's changes and restores the sample data. */
  reset: () => void;
  /** Set when storage rejected a write, so the UI can say changes are not sticking. */
  storageError: string | undefined;
}

const FinanceDataContext = createContext<FinanceDataContextValue | undefined>(
  undefined,
);

const STORAGE_ERROR =
  "Your changes are not being saved — this browser is blocking site storage.";

const alwaysTrue = () => true;
const alwaysFalse = () => false;

/**
 * Holds the whole dataset for the app.
 *
 * There is no backend: the sample data ships with the bundle and every change
 * the visitor makes is kept in their own browser.
 */
export function FinanceDataProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isReady = useSyncExternalStore(subscribe, alwaysTrue, alwaysFalse);
  const hasStorageError = useSyncExternalStore(
    subscribe,
    getStorageError,
    alwaysFalse,
  );

  const update = useCallback(
    (transform: (current: FinanceData) => FinanceData) => updateData(transform),
    [],
  );
  const reset = useCallback(() => resetData(), []);

  return (
    <FinanceDataContext.Provider
      value={{
        data,
        isReady,
        update,
        reset,
        storageError: hasStorageError ? STORAGE_ERROR : undefined,
      }}
    >
      {children}
    </FinanceDataContext.Provider>
  );
}

/**
 * Reads the app's data and the functions that change it.
 *
 * @throws If used outside a {@link FinanceDataProvider}.
 */
export function useFinanceData(): FinanceDataContextValue {
  const context = useContext(FinanceDataContext);

  if (context === undefined) {
    throw new Error("useFinanceData must be used inside a FinanceDataProvider");
  }

  return context;
}
