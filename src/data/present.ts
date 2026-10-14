/**
 * Presentation helpers. They never change source data — they only tidy how
 * values read on screen (e.g. dropping internal parenthetical audit notes).
 */

/** Strips trailing parenthetical audit notes such as "(title to confirm)". */
export function cleanLabel(s: string | undefined): string {
  if (!s) return "";
  return s.replace(/\s*\([^)]*\)\s*$/g, "").trim();
}

/** Whole years since founding, derived from the current year (never hardcoded). */
export function yearsSince(foundedYear: number | undefined, currentYear = new Date().getFullYear()): number | undefined {
  if (!foundedYear || foundedYear > currentYear) return undefined;
  return currentYear - foundedYear;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Categories stated in the company's own short description. */
export const PROFILE_TAGS = ["Legal Technology", "eDiscovery", "Document Review", "Investigations", "Legal Solutions"];
