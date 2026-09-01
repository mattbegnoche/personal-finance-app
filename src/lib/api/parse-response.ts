import type { z } from "zod";

/** Turns a Zod issue list into one line naming the fields that failed. */
function describeIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "payload"}: ${issue.message}`)
    .join("; ");
}

/**
 * Validates an API payload against `schema`.
 *
 * Nothing about an external response is guaranteed, so every fetch goes through
 * here before its data reaches the UI.
 *
 * @param resource Named in the error message, e.g. `"budgets"`.
 * @throws If the payload does not match the schema.
 */
export function parseApiResponse<T>(
  schema: z.ZodType<T>,
  value: unknown,
  resource: string,
): T {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new Error(
      `Unexpected ${resource} response from the finance API — ${describeIssues(result.error)}`,
    );
  }

  return result.data;
}
