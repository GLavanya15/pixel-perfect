const HINTS: Record<string, string> = {
  Origin: "Select a node orbiting the Core, or use the sections list, to enter a part of Consilio.",
  "Company Profile": "Identity fields come straight from the workbook. Verification is shown beside each claim.",
  Leadership: "Search by name or title. Select a leader to see their source and verification.",
  "History & Milestones": "Dated events sit on the timeline. Undated events are listed separately in source order.",
  "Services & Solutions": "Offerings cluster by service category. Market segments come from recorded links only.",
  Locations: "Only verified records with a published address appear on the map.",
  "Financial Information": "All figures are unverified estimates. They are shown per year and never totalled.",
  "Workforce & Languages": "Workforce groups overlap and are never added together.",
  "Awards & Recognition": "Award titles and years marked 'to confirm' are shown as recorded.",
  Mapping: "Proposed mappings are hidden from the interface until confirmed.",
};

/** Silo as a contextual guide. Voice is intentionally not offered in this prototype. */
export function SiloGuide({ section }: { section: string }) {
  return (
    <div className="panel mt-4 p-4" aria-label="Silo guide">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inset-0 rounded-full bg-beacon/40 animate-ping" />
          <span className="relative h-3 w-3 rounded-full bg-beacon" />
        </span>
        <span className="meta">Silo · Guide</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{HINTS[section] ?? HINTS.Origin}</p>
      <p className="mt-2 text-[0.65rem] text-muted-foreground/80">Voice is not available in this prototype.</p>
    </div>
  );
}
