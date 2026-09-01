import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { PasswordField } from "@/components/ui/PasswordField";
import { Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";

const MIN_PASSWORD_LENGTH = 8;

export default function SignUp() {
  return (
    <form className="flex flex-col gap-8">
      <Text as="h1" preset="preset-1">
        Sign Up
      </Text>

      <div className="flex flex-col gap-4">
        <InputField name="name" label="Name" autoComplete="name" required />
        <InputField
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
        />
        <PasswordField
          name="password"
          label="Create Password"
          helperText={`Passwords must be at least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Account
      </Button>

      <div className="flex items-center justify-center gap-2">
        <Text preset="preset-4" className="text-grey-500">
          Already have an account?
        </Text>
        <TextLink href="/login">Login</TextLink>
      </div>
    </form>
  );
}
