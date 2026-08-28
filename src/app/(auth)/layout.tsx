import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col">
      <div className="bg-grey-900 py-6 px-10 flex justify-center rounded-b-lg md:hidden">
        <Image
          width={121.454}
          height={21.76}
          src="/assets/images/logo-large.svg"
          alt="finance logo"
        />
      </div>
      <Container
        size="lg"
        className="flex flex-1 flex-col gap-x-8 md:flex-row md:justify-between"
      >
        <div className="hidden bg-[url('/assets/images/illustration-authentication.svg')] p-10 text-white bg-cover bg-center bg-no-repeat md:flex flex-1 min-w-0 flex-col justify-between rounded-xl my-5 md:max-w-140">
          <div>
            <Image
              width={121.454}
              height={21.76}
              src="/assets/images/logo-large.svg"
              alt="finance logo"
            />
          </div>
          <div>
            <Text as="h2" preset="preset-1" className="mb-6 max-w-[20ch]">
              Keep track of your money and save for your future
            </Text>
            <Text preset="preset-4" className="max-w-[55ch]">
              Personal finance app puts you in control of your spending. Track
              transactions, set budgets, and add to savings pots easily.
            </Text>
          </div>
        </div>
        <div className="flex flex-1 min-w-0 flex-col justify-center md:max-w-140">
          <Card className="w-full">{children}</Card>
        </div>
      </Container>
    </main>
  );
}
