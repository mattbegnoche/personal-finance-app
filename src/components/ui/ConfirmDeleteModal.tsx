"use client";

import type { ReactElement } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Name of the thing being deleted, e.g. `"Bills"`. */
  name: string;
  /** What happens to the data, e.g. "This budget will be removed for good." */
  description: string;
  confirmLabel: string;
}

/** Shared confirmation step before a delete goes through. */
export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  name,
  description,
  confirmLabel,
}: ConfirmDeleteModalProps): ReactElement {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete '${name}'?`}
      description={description}
    >
      <div className="grid gap-5">
        <Button
          variant="destroy"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
        <Button variant="tertiary" showIcon={false} onClick={onClose}>
          No, Go Back
        </Button>
      </div>
    </Modal>
  );
}
