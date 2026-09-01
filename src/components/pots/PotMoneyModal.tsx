"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { Pot } from "@/lib/pots/types";
import { depositToPot, withdrawFromPot } from "@/lib/store/mutations";
import { validateAmount, type FieldErrors } from "@/lib/store/validation";

export type MoneyDirection = "deposit" | "withdraw";

interface PotMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  pot: Pot;
  direction: MoneyDirection;
}

/**
 * Moves money between the available balance and a pot.
 *
 * The bar previews where the pot lands, so the effect is visible before
 * committing. A deposit is capped by the balance and a withdrawal by the pot,
 * since neither can go negative.
 */
export function PotMoneyModal({
  isOpen,
  onClose,
  pot,
  direction,
}: PotMoneyModalProps): ReactElement {
  const { data, update } = useFinanceData();
  const [amount, setAmount] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isDeposit = direction === "deposit";

  const entered = Number(amount.replace(/[$,\s]/g, ""));
  const delta = Number.isFinite(entered) && entered > 0 ? entered : 0;
  const preview = Math.max(
    isDeposit ? pot.total + delta : pot.total - delta,
    0,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateAmount(
      amount,
      isDeposit ? data.balance.current : pot.total,
      isDeposit
        ? "That is more than your current balance."
        : "That is more than this pot holds.",
    );

    if (!result.ok) {
      setFieldErrors(result.fieldErrors);

      return;
    }

    update((current) =>
      isDeposit
        ? depositToPot(current, pot.id, result.value)
        : withdrawFromPot(current, pot.id, result.value),
    );
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isDeposit ? "Add to" : "Withdraw from"} '${pot.name}'`}
      description={
        isDeposit
          ? "Add money to this pot to keep it separate from your main balance. It comes out of your current balance."
          : "Take money out of this pot. It goes back into your current balance."
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <Text preset="preset-4" className="text-grey-500">
              New Amount
            </Text>
            <Text preset="preset-1" className="text-grey-900">
              {formatCurrency(preview, 2)}
            </Text>
          </div>

          <ProgressBar
            value={preview}
            max={pot.target}
            color={pot.theme}
            size="sm"
            label={`${pot.name} progress after this change`}
            className="mb-3"
          />

          <div className="flex items-center justify-between gap-4">
            <Text preset="preset-5-bold" className="text-grey-500">
              {formatPercent(preview, pot.target)}
            </Text>
            <Text preset="preset-5" className="text-grey-500">
              Target of {formatCurrency(pot.target)}
            </Text>
          </div>
        </div>

        <InputField
          name="amount"
          label={isDeposit ? "Amount to Add" : "Amount to Withdraw"}
          inputMode="decimal"
          placeholder="e.g. 100"
          prefix="$"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          error={fieldErrors.amount}
          helperText={
            isDeposit
              ? `${formatCurrency(data.balance.current, 2)} available`
              : `${formatCurrency(pot.total, 2)} in this pot`
          }
        />

        <Button type="submit" className="mt-1 w-full">
          {isDeposit ? "Confirm Addition" : "Confirm Withdrawal"}
        </Button>
      </form>
    </Modal>
  );
}
