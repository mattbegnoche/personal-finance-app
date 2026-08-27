type ClassValue = string | false | null | undefined;

/**
 * Joins truthy class name values into a single className string.
 */
export function cn(...classNames: ReadonlyArray<ClassValue>): string {
  return classNames.filter(Boolean).join(" ");
}
