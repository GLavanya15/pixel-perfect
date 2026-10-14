import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, StatusBadge } from "@/components/silo/ui";
import { awards } from "@/data/about";
export const Route = createFileRoute("/awards")({
  head: () => ({ meta: [{ title: "Awards & Recognition — Consilio | SiloVerse" }, { name: "description", content: "Consilio Awards & Recognition as recorded in the workbook." }, { property: "og:title", content: "Awards & Recognition — Consilio | SiloVerse" }, { property: "og:description", content: "Consilio Awards & Recognition with verification context." }] }),
  component: () => (
    <div className="mx-auto max-w-5xl">
      <SectionHeader code="08" title="Awards & Recognition" statement="Awards as recorded; titles marked to confirm remain qualified." />
      <div className="grid gap-4 md:grid-cols-2">
        {awards.map((r: any, i: number) => (
          <div key={i} className="panel p-5">
            <p className="text-lg text-foreground">{r.awardName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{[r.awardingBody, r.awardYear, r.awardStatus, r.description].filter(Boolean).join(" · ")}</p>
            <StatusBadge status={r.verificationStatus} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  ),
});
