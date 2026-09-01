"use client";

import { useState, type ReactElement } from "react";
import { BudgetFormModal } from "./BudgetFormModal";
import { Button } from "@/components/ui/Button";

/** Opens the empty budget form. */
export function AddBudgetButton(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Add New Budget</Button>
      <BudgetFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
