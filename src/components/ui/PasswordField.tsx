"use client";

import { useState, type ReactElement } from "react";
import { InputField, type InputFieldProps } from "@/components/ui/InputField";

/** Trailing-icon and type props are owned by the visibility toggle. */
export type PasswordFieldProps = Omit<
  InputFieldProps,
  "type" | "icon" | "onIconClick" | "iconLabel"
>;

export function PasswordField(props: PasswordFieldProps): ReactElement {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputField
      {...props}
      type={isVisible ? "text" : "password"}
      icon={isVisible ? "eye-slash" : "eye"}
      iconLabel={isVisible ? "Hide password" : "Show password"}
      onIconClick={() => setIsVisible((visible) => !visible)}
    />
  );
}
