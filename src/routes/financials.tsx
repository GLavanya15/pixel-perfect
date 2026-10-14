import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/silo/ui";
import { companyFinancials, formatMoney } from "@/data/about";

export const Route = createFileRoute("/financials")({
  head: () => ({
    meta: [
      { title: "Financial Information — Consilio" },
      { name: "description", content: "Consilio revenue by fiscal year." },
      { property: "og:title", content: "Financial Information — Consilio" },
      { property: "og:description", content: "Consilio revenue by fiscal year." },
    ],
  }),
  component: Financials,
});

function Financials() {
  const max = Math.max(...companyFinancials.map((f) => f.amount));
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Financial Information" />
      <div className="grid gap-4 sm:grid-cols-3">
        {companyFinancials.map((f) => (
          <div key={f.companyFinancialId} className="panel p-5">
            <p className="text-sm font-semibold text-foreground">FY{f.fiscalYear}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-beacon tabular-nums">≈ {formatMoney(f.amount, f.currency)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{f.financialMetricName ?? "Revenue"}</p>
          </div>
        ))}
      </div>
      <section className="panel mt-6 p-6" aria-label="Revenue by fiscal year">
        <h2 className="mb-6 text-sm font-semibold text-foreground">Revenue by fiscal year</h2>
        <div className="flex h-56 items-end gap-6 sm:gap-12">
          {companyFinancials.map((f) => (
            <div key={f.companyFinancialId} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-sm font-semibold tabular-nums text-foreground">{formatMoney(f.amount)}</span>
              <div className="w-full max-w-24 rounded-t-md bg-beacon" style={{ height: `${(f.amount / max) * 80}%` }} />
              <span className="text-xs text-muted-foreground">FY{f.fiscalYear}</span>
            </div>
          ))}
        </div>
        {companyFinancials[0]?.currency && <p className="mt-4 text-xs text-muted-foreground">Values in {companyFinancials[0].currency}</p>}
      </section>
    </div>
  );
}
