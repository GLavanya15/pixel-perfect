import { describe, expect, it } from "vitest";
import { cleanLabel, yearsSince } from "@/data/present";

describe("company age", () => {
  it("is 26 years in 2026 for a company founded in 2000", () => {
    expect(yearsSince(2000, 2026)).toBe(26);
  });
  it("grows with the current year", () => {
    expect(yearsSince(2000, 2030)).toBe(30);
  });
});

describe("cleanLabel", () => {
  it("drops trailing audit notes", () => {
    expect(cleanLabel("Comparably award for employee experience (title to confirm)")).toBe("Comparably award for employee experience");
  });
});
