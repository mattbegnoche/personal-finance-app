"use client";

import { useState, type ReactElement } from "react";
import { PotFormModal } from "./PotFormModal";
import { Button } from "@/components/ui/Button";

/** Opens the empty pot form. */
export function AddPotButton(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Add New Pot</Button>
      <PotFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
