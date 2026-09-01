/**
 * The colour palette budgets and pots pick from.
 *
 * Hex values mirror the design tokens in `globals.css`; they are stored on each
 * record so charts and legends can style themselves without a lookup.
 */
export const THEMES = [
  { name: "Green", value: "#277C78" },
  { name: "Yellow", value: "#F2CDAC" },
  { name: "Cyan", value: "#82C9D7" },
  { name: "Navy", value: "#626070" },
  { name: "Red", value: "#C94736" },
  { name: "Purple", value: "#826CB0" },
  { name: "Turquoise", value: "#597C7C" },
  { name: "Brown", value: "#93674F" },
  { name: "Magenta", value: "#934F6F" },
  { name: "Blue", value: "#3F82B2" },
  { name: "Navy Grey", value: "#97A0AC" },
  { name: "Army Green", value: "#7F9161" },
  { name: "Gold", value: "#CAB361" },
  { name: "Orange", value: "#BE6C49" },
] as const;

export type ThemeValue = (typeof THEMES)[number]["value"];

/** The first colour not already spoken for, so new records default sensibly. */
export function firstUnusedTheme(usedThemes: ReadonlyArray<string>): string {
  const used = new Set(usedThemes.map((theme) => theme.toUpperCase()));
  const available = THEMES.find(
    (theme) => !used.has(theme.value.toUpperCase()),
  );

  return (available ?? THEMES[0]).value;
}

/** Human-readable name for a stored hex value, falling back to the hex itself. */
export function themeName(value: string): string {
  const match = THEMES.find(
    (theme) => theme.value.toUpperCase() === value.toUpperCase(),
  );

  return match?.name ?? value;
}
