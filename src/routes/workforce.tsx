import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard, Tag } from "@/components/silo/ui";
import { companyMetrics, formatQualified, workforceMetrics } from "@/data/about";

export const Route = createFileRoute("/workforce")({
  head: () => ({
    meta: [
      { title: "Workforce — Consilio" },
      { name: "description", content: "Consilio's workforce: employees, review professionals, engineers, lawyers and flexible legal talent." },
      { property: "og:title", content: "Workforce — Consilio" },
      { property: "og:description", content: "The people behind Consilio's services." },
    ],
  }),
  component: Workforce,
});

const CAPACITY = ["Review centers", "Workstations", "Countries with staffed review professionals", "Data centers"];

function Workforce() {
  const capacity = CAPACITY.map((n) => companyMetrics.find((m) => m.metricName === n)).filter((m) => !!m);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Workforce" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workforceMetrics.map((w) => (
          <StatCard
            key={w.workforceMetricId}
            value={formatQualified(w.countValue, w.valueQualifier)}
            label={w.populationType}
            sub={<div className="flex flex-wrap gap-1.5">{w.region && <Tag tone="beacon">{w.region}</Tag>}{w.businessFunction && <Tag>{w.businessFunction}</Tag>}</div>}
          />
        ))}
      </div>
      {capacity.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Delivery capacity</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {capacity.map((m) => <StatCard key={m.companyMetricId} value={formatQualified(m.metricValue, m.valueQualifier)} label={m.unitName} />)}
          </div>
        </section>
      )}
    </div>
  );
}
