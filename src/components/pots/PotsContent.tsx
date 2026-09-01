import { unstable_rethrow } from "next/navigation";
import type { ReactElement } from "react";
import { PotCard } from "./PotCard";
import { Notice } from "@/components/ui/Notice";
import { ApiError } from "@/lib/api/fetch-json";
import { fetchPots, type Pot } from "@/lib/pots/api";

/** Fetches and renders every savings pot. */
export async function PotsContent(): Promise<ReactElement> {
  let pots: ReadonlyArray<Pot>;

  try {
    pots = await fetchPots();
  } catch (error) {
    unstable_rethrow(error);
    console.error("[pots] could not load pots", error);

    return (
      <Notice
        icon="warning-circle"
        tone="error"
        title="Couldn't load pots"
        description={
          error instanceof ApiError
            ? error.message
            : "Something went wrong loading your pots. Please try again."
        }
      />
    );
  }

  if (pots.length === 0) {
    return (
      <Notice
        icon="jar"
        title="No pots yet"
        description="Pots you create will show up here with your progress towards each target."
      />
    );
  }

  return (
    <ul className="gap-sm grid sm:grid-cols-2">
      {pots.map((pot) => (
        <PotCard key={pot.id} pot={pot} />
      ))}
    </ul>
  );
}
