import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, StatusBadge } from "@/components/silo/ui";
import { workforceMetrics } from "@/data/about";
export const Route = createFileRoute("/workforce")({
  head: () => ({ meta: [{ title: "Workforce & Languages — Consilio | SiloVerse" }, { name: "description", content: "Consilio Workforce & Languages as recorded in the workbook." }, { property: "og:title", content: "Workforce & Languages — Consilio | SiloVerse" }, { property: "og:description", content: "Consilio Workforce & Languages with verification context." }] }),
  component: () => (
    <div className="mx-auto max-w-5xl">
      <SectionHeader code="07" title="Workforce & Languages" statement="Workforce groups overlap and are never added together." />
      <div className="grid gap-4 md:grid-cols-2">
        {workforceMetrics.map((r: any, i: number) => (
          <div key={i} className="panel p-5">
            <p className="text-lg text-foreground">{`${r.populationType}: ${r.countValue.toLocaleString()}${r.valueQualifier==="At least"?"+":""}`}</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.methodologyNote}</p>
            <StatusBadge status={r.verificationStatus} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  ),
});
