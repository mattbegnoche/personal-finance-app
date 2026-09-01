"use client";

import { useState, type ReactElement } from "react";
import { PotFormModal } from "./PotFormModal";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import type { Pot } from "@/lib/pots/types";
import { deletePot } from "@/lib/store/mutations";

/** The "…" menu on a pot card, with its edit and delete flows. */
export function PotCardActions({ pot }: { pot: Pot }): ReactElement {
  const { update } = useFinanceData();
  const [openModal, setOpenModal] = useState<"edit" | "delete">();

  return (
    <>
      <ActionsMenu
        label={`${pot.name} pot actions`}
        items={[
          { label: "Edit Pot", onSelect: () => setOpenModal("edit") },
          {
            label: "Delete Pot",
            onSelect: () => setOpenModal("delete"),
            isDestructive: true,
          },
        ]}
      />

      <PotFormModal
        isOpen={openModal === "edit"}
        onClose={() => setOpenModal(undefined)}
        pot={pot}
      />

      <ConfirmDeleteModal
        isOpen={openModal === "delete"}
        onClose={() => setOpenModal(undefined)}
        onConfirm={() => update((current) => deletePot(current, pot.id))}
        name={pot.name}
        description="Are you sure you want to delete this pot? This action cannot be reversed. Anything saved in it goes back to your current balance."
        confirmLabel="Yes, Confirm Deletion"
      />
    </>
  );
}
