"use client";

import { useState, type ReactElement } from "react";
import { useFinanceData } from "./FinanceDataProvider";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";

/**
 * Explains where the data lives and offers a way back to the sample data.
 *
 * Everything is kept in this browser, so there is no other way to undo a change
 * once it is made.
 */
export function DataFooter(): ReactElement {
  const { reset, storageError } = useFinanceData();
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="border-grey-100 mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
      {storageError ? (
        <Text
          role="alert"
          preset="preset-5"
          className="text-red flex items-center gap-2"
        >
          <Icon name="warning-circle" size={16} className="shrink-0" />
          {storageError}
        </Text>
      ) : (
        <Text preset="preset-5" className="text-grey-500">
          Your changes are saved in this browser only.
        </Text>
      )}

      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="text-preset-5 text-grey-500 hover:text-grey-900 focus-visible:outline-grey-900 cursor-pointer rounded-sm underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Reset to sample data
      </button>

      <ConfirmDeleteModal
        isOpen={isConfirming}
        onClose={() => setIsConfirming(false)}
        onConfirm={reset}
        name="your changes"
        description="Every budget, pot and balance goes back to the sample data this app ships with. This cannot be undone."
        confirmLabel="Yes, Reset Everything"
      />
    </div>
  );
}
