import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { PasswordField } from "@/components/ui/PasswordField";
import { Text } from "@/components/ui/Text";
import { TextLink } from "@/components/ui/TextLink";

export default function Login() {
  return (
    <form className="flex flex-col gap-8">
      <Text as="h1" preset="preset-1">
        Login
      </Text>

      <div className="flex flex-col gap-4">
        <InputField
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
        />
        <PasswordField
          name="password"
          label="Password"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>

      <div className="flex items-center justify-center gap-2">
        <Text preset="preset-4" className="text-grey-500">
          Need to create an account?
        </Text>
        <TextLink href="/sign-up">Sign Up</TextLink>
      </div>
    </form>
  );
}
