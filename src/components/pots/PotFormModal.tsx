"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { SelectField } from "@/components/ui/SelectField";
import type { Pot } from "@/lib/pots/types";
import { addPot, updatePot } from "@/lib/store/mutations";
import { validatePot, type FieldErrors } from "@/lib/store/validation";
import { firstUnusedTheme, THEMES } from "@/lib/themes";

const NAME_MAX_LENGTH = 30;

interface PotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Leave unset to add a new pot rather than edit an existing one. */
  pot?: Pot;
}

/**
 * Add or edit a savings pot.
 *
 * The form is only mounted while the modal is open, so reopening it starts from
 * the record's values rather than the half-finished ones left behind last time.
 */
export function PotFormModal({
  isOpen,
  onClose,
  pot,
}: PotFormModalProps): ReactElement {
  const isEditing = pot !== undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Pot" : "Add New Pot"}
      description={
        isEditing
          ? "If your saving targets change, feel free to update your pots."
          : "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
      }
    >
      {isOpen && <PotForm pot={pot} onDone={onClose} />}
    </Modal>
  );
}

function PotForm({
  pot,
  onDone,
}: {
  pot?: Pot;
  onDone: () => void;
}): ReactElement {
  const { data, update } = useFinanceData();
  const isEditing = pot !== undefined;

  const [name, setName] = useState(pot?.name ?? "");
  const [target, setTarget] = useState(pot ? String(pot.target) : "");
  const [theme, setTheme] = useState(
    () => pot?.theme ?? firstUnusedTheme(data.pots.map((each) => each.theme)),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validatePot({ name, target, theme }, data, pot?.id);

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);

      return;
    }

    update((current) =>
      isEditing
        ? updatePot(current, pot.id, result.value)
        : addPot(current, result.value),
    );
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <InputField
        name="name"
        label="Pot Name"
        placeholder="e.g. Rainy Days"
        maxLength={NAME_MAX_LENGTH}
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldErrors.name}
        helperText={`${NAME_MAX_LENGTH - name.length} characters left`}
      />

      <InputField
        name="target"
        label="Target"
        inputMode="decimal"
        placeholder="e.g. 2000"
        prefix="$"
        value={target}
        onChange={(event) => setTarget(event.target.value)}
        error={fieldErrors.target}
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
          isDisabled: data.pots.some(
            (existing) =>
              existing.theme.toUpperCase() === each.value.toUpperCase() &&
              existing.id !== pot?.id,
          ),
        }))}
      />

      <Button type="submit" className="mt-1 w-full">
        {isEditing ? "Save Changes" : "Add Pot"}
      </Button>
    </form>
  );
}
