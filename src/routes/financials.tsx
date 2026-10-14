import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, StatusBadge } from "@/components/silo/ui";
import { companyFinancials } from "@/data/about";
export const Route = createFileRoute("/financials")({
  head: () => ({ meta: [{ title: "Financial Information — Consilio | SiloVerse" }, { name: "description", content: "Consilio Financial Information as recorded in the workbook." }, { property: "og:title", content: "Financial Information — Consilio | SiloVerse" }, { property: "og:description", content: "Consilio Financial Information with verification context." }] }),
  component: () => (
    <div className="mx-auto max-w-5xl">
      <SectionHeader code="06" title="Financial Information" statement="All figures are unverified approximate estimates, shown per fiscal year and never totalled." />
      <div className="grid gap-4 md:grid-cols-2">
        {companyFinancials.map((r: any, i: number) => (
          <div key={i} className="panel p-5">
            <p className="text-lg text-foreground">{`FY${r.fiscalYear} · ${r.currency} ${(r.amount/1e9).toFixed(2)}B`}</p>
            <p className="mt-1 text-sm text-muted-foreground">{[r.financialClassification, r.valueBasisName, r.scopeNote].filter(Boolean).join(" · ")}</p>
            <StatusBadge status={r.verificationStatus} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  ),
});
