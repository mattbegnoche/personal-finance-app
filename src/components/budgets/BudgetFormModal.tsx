"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { SelectField } from "@/components/ui/SelectField";
import type { Budget } from "@/lib/budgets/types";
import { addBudget, updateBudget } from "@/lib/store/mutations";
import { validateBudget, type FieldErrors } from "@/lib/store/validation";
import { firstUnusedTheme, THEMES } from "@/lib/themes";
import { TRANSACTION_CATEGORIES } from "@/lib/transactions/types";

interface BudgetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Leave unset to add a new budget rather than edit an existing one. */
  budget?: Budget;
}

/**
 * Add or edit a budget. The same fields serve both, per the design.
 *
 * The form is only mounted while the modal is open, so reopening it after a
 * cancel starts from the record's values rather than the half-finished ones
 * left behind last time.
 */
export function BudgetFormModal({
  isOpen,
  onClose,
  budget,
}: BudgetFormModalProps): ReactElement {
  const isEditing = budget !== undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Budget" : "Add New Budget"}
      description={
        isEditing
          ? "As your budgets change, feel free to update your spending limits."
          : "Choose a category to set a spending budget. These categories can help you monitor spending."
      }
    >
      {isOpen && <BudgetForm budget={budget} onDone={onClose} />}
    </Modal>
  );
}

function BudgetForm({
  budget,
  onDone,
}: {
  budget?: Budget;
  onDone: () => void;
}): ReactElement {
  const { data, update } = useFinanceData();
  const isEditing = budget !== undefined;

  const [category, setCategory] = useState(
    () =>
      budget?.category ??
      TRANSACTION_CATEGORIES.find(
        (each) => !data.budgets.some((existing) => existing.category === each),
      ) ??
      "",
  );
  const [maximum, setMaximum] = useState(budget ? String(budget.maximum) : "");
  const [theme, setTheme] = useState(
    () =>
      budget?.theme ?? firstUnusedTheme(data.budgets.map((each) => each.theme)),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateBudget(
      { category, maximum, theme },
      data,
      budget?.id,
    );

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);

      return;
    }

    update((current) =>
      isEditing
        ? updateBudget(current, budget.id, result.value)
        : addBudget(current, result.value),
    );
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <SelectField
        name="category"
        label="Budget Category"
        value={category}
        onChange={setCategory}
        error={fieldErrors.category}
        options={TRANSACTION_CATEGORIES.map((each) => ({
          value: each,
          label: each,
          isDisabled: data.budgets.some(
            (existing) =>
              existing.category === each && existing.id !== budget?.id,
          ),
        }))}
      />

      <InputField
        name="maximum"
        label="Maximum Spend"
        inputMode="decimal"
        placeholder="e.g. 2000"
        prefix="$"
        value={maximum}
        onChange={(event) => setMaximum(event.target.value)}
        error={fieldErrors.maximum}
      />

      <SelectField
        name="theme"
        label="Theme"
        value={theme}
        onChange={setTheme}
        error={fieldErrors.theme}
        options={THEMES.map((each) => ({
          value: each.value,
          label: each.name,
          color: each.value,
          isDisabled: data.budgets.some(
            (existing) =>
              existing.theme.toUpperCase() === each.value.toUpperCase() &&
              existing.id !== budget?.id,
          ),
        }))}
      />

      <Button type="submit" className="mt-1 w-full">
        {isEditing ? "Save Changes" : "Add Budget"}
      </Button>
    </form>
  );
}
