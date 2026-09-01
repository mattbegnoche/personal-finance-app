"use client";

import { useState, type ReactElement } from "react";
import { BudgetFormModal } from "./BudgetFormModal";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import type { Budget } from "@/lib/budgets/types";
import { deleteBudget } from "@/lib/store/mutations";

/** The "…" menu on a budget card, with its edit and delete flows. */
export function BudgetCardActions({
  budget,
}: {
  budget: Budget;
}): ReactElement {
  const { update } = useFinanceData();
  const [openModal, setOpenModal] = useState<"edit" | "delete">();

  return (
    <>
      <ActionsMenu
        label={`${budget.category} budget actions`}
        items={[
          { label: "Edit Budget", onSelect: () => setOpenModal("edit") },
          {
            label: "Delete Budget",
            onSelect: () => setOpenModal("delete"),
            isDestructive: true,
          },
        ]}
      />

      <BudgetFormModal
        isOpen={openModal === "edit"}
        onClose={() => setOpenModal(undefined)}
        budget={budget}
      />

      <ConfirmDeleteModal
        isOpen={openModal === "delete"}
        onClose={() => setOpenModal(undefined)}
        onConfirm={() => update((current) => deleteBudget(current, budget.id))}
        name={budget.category}
        description="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
        confirmLabel="Yes, Confirm Deletion"
      />
    </>
  );
}
