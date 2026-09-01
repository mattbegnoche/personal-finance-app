"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";
import { Text } from "./Text";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Explains what the form does, read out with the title. */
  description?: string;
  children: ReactNode;
}

/**
 * Centred dialog built on the native `<dialog>` element, which brings focus
 * trapping, `Esc` to close and inertness of the page behind it for free.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps): ReactNode {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      // Fires for Esc and form-method="dialog" as well as our own close calls.
      onClose={onClose}
      // A click landing on the dialog itself rather than its content is the backdrop.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="modal-title"
      className="backdrop:bg-grey-900/50 m-auto w-[calc(100%-2rem)] max-w-140 rounded-xl bg-white p-5 sm:p-8"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <Text
          as="h2"
          id="modal-title"
          preset="preset-1"
          className="text-grey-900 min-w-0"
        >
          {title}
        </Text>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-beige-500 hover:text-grey-900 focus-visible:outline-grey-900 shrink-0 cursor-pointer rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Icon name="close" size={24} />
        </button>
      </div>

      {description && (
        <Text preset="preset-4" className="text-grey-500 mb-5">
          {description}
        </Text>
      )}

      {children}
    </dialog>
  );
}
