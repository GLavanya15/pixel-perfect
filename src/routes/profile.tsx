import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { DetailPanel, EvidenceBlock, Field, PageHeader, SelectFilter, Stat, Tag } from "@/components/silo/ui";
import { companyMetrics, companyProfile as cp, formatQualified, uniq, type CompanyMetric } from "@/data/about";
import { PROFILE_TAGS, yearsSince } from "@/data/present";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Company Profile — Consilio" },
      { name: "description", content: "Consilio's legal identity, founding, ownership and operating scale." },
      { property: "og:title", content: "Company Profile — Consilio" },
      { property: "og:description", content: "Consilio identity, ownership and company metrics." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [sel, setSel] = useState<CompanyMetric | null>(null);
  const [period, setPeriod] = useState("");
  const list = companyMetrics.filter((m) => !period || m.periodType === period);
  const age = yearsSince(cp.foundedYear);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Company Profile" />

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="panel p-6 lg:col-span-2">
          <div className="flex flex-wrap gap-1.5">{PROFILE_TAGS.map((t) => <Tag key={t} tone="beacon">{t}</Tag>)}</div>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Legal name" value={cp.legalName} />
            <Field label="Brand name" value={cp.brandName} />
            <Field label="Former name" value={cp.formerName} />
            <Field label="Renamed" value={cp.brandNameChangeYear} />
            <Field label="Company type" value={cp.companyType} />
            <Field label="Industry" value={cp.industryFreeText} />
            <Field label="Website">
              {cp.websiteUrl && (
                <a href={cp.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  {cp.websiteUrl.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              )}
            </Field>
          </dl>
          {cp.overviewText && <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-foreground/90">{cp.overviewText}</p>}
          {cp.ownershipSummary && (
            <>
              <h2 className="mt-5 text-sm font-semibold text-foreground">Ownership</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{cp.ownershipSummary}</p>
            </>
          )}
        </section>

        <aside className="space-y-5">
          <section className="panel grid grid-cols-2 gap-4 p-6">
            <Stat value={cp.foundedYear} label="Founded" />
            {age !== undefined && <Stat value={age} label="Years in industry" />}
          </section>
          {cp.headquartersAddress && (
            <section className="panel p-6">
              <Tag tone="beacon">Headquarters</Tag>
              <p className="mt-3 text-sm font-medium text-foreground">{cp.headquartersAddress}</p>
            </section>
          )}
        </aside>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Operating scale</h2>
          <SelectFilter label="Period" value={period} onChange={setPeriod} options={uniq(companyMetrics.map((m) => m.periodType))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <button key={m.companyMetricId} onClick={() => setSel(m)} className="panel panel-interactive p-5 text-left">
              <Stat value={formatQualified(m.metricValue, m.valueQualifier)} label={m.unitName} sub={m.periodType && <Tag>{m.periodType}</Tag>} />
            </button>
          ))}
        </div>
      </section>

      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel?.metricName === "Other" ? sel?.unitName : sel?.metricName} kicker="Company metric">
        {sel && (
          <>
            <Stat value={formatQualified(sel.metricValue, sel.valueQualifier)} label={sel.unitName} />
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Period" value={sel.periodType} />
              <Field label="Business scope" value={sel.businessScope} />
            </dl>
            {sel.methodologyNote && <p className="mt-6 text-sm text-muted-foreground">{sel.methodologyNote}</p>}
            <EvidenceBlock e={sel} />
          </>
        )}
      </DetailPanel>
    </div>
  );
}
