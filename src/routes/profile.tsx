import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { DetailPanel, EvidenceBlock, Field, SectionHeader, SelectFilter, StatusBadge, Tag } from "@/components/silo/ui";
import { companyMetrics, companyProfile as cp, formatQualified, uniq, type CompanyMetric } from "@/data/about";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Company Profile — Consilio | SiloVerse" },
      { name: "description", content: "Consilio's legal identity, history, ownership summary and company metrics with verification status." },
      { property: "og:title", content: "Company Profile — Consilio | SiloVerse" },
      { property: "og:description", content: "Consilio identity, ownership and company metrics." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [sel, setSel] = useState<CompanyMetric | null>(null);
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");
  const list = companyMetrics.filter((m) => (!status || m.verificationStatus === status) && (!period || m.periodType === period));

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader code="01" title="Company Profile" statement={cp.shortDescription} />

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="panel p-6 lg:col-span-2">
          <p className="meta mb-4">Identity</p>
          <dl className="grid gap-5 sm:grid-cols-2">
            <Field label="Legal name" value={cp.legalName} />
            <Field label="Brand name" value={cp.brandName} />
            <Field label="Former name" value={cp.formerName} />
            <Field label="Founded" value={cp.foundedYear} />
            <Field label="Brand name change" value={cp.brandNameChangeYear} />
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
          {cp.overviewText && (
            <>
              <p className="meta mb-2 mt-8">Overview</p>
              <p className="leading-relaxed text-foreground/90">{cp.overviewText}</p>
            </>
          )}
          {cp.ownershipSummary && (
            <>
              <p className="meta mb-2 mt-8">Ownership summary</p>
              <p className="leading-relaxed text-foreground/90">{cp.ownershipSummary}</p>
            </>
          )}
          <EvidenceBlock e={cp.evidence} />
        </section>

        <aside className="space-y-5">
          <section className="panel p-6">
            <p className="meta mb-3">Headquarters (as recorded)</p>
            <p className="text-foreground">{cp.headquartersAddress}</p>
            <div className="mt-3"><StatusBadge status={cp.headquartersEvidence.verificationStatus} /></div>
            {cp.headquartersEvidence.source && (
              <p className="mt-3 text-xs text-muted-foreground">Source: {cp.headquartersEvidence.source.sourceName}</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">Note: this source is a state business registration; the workbook does not reconcile it with the address shown.</p>
          </section>
          <section className="panel p-6">
            <p className="meta mb-3">Record status</p>
            <div className="flex flex-wrap gap-2">
              {cp.profileStatus && <Tag tone="warn">{cp.profileStatus}</Tag>}
              {cp.lastReviewedDate && <Tag>Reviewed {cp.lastReviewedDate}</Tag>}
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="meta">Company metrics</p>
            <h2 className="display mt-1 text-3xl">Operating scale, as stated</h2>
          </div>
          <div className="flex gap-3">
            <SelectFilter label="Verification" value={status} onChange={setStatus} options={uniq(companyMetrics.map((m) => m.verificationStatus))} />
            <SelectFilter label="Period" value={period} onChange={setPeriod} options={uniq(companyMetrics.map((m) => m.periodType))} />
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">{list.length} of {companyMetrics.length} metrics</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <button key={m.companyMetricId} onClick={() => setSel(m)} className="panel panel-interactive p-5 text-left">
              <p className="meta">{m.metricName === "Other" ? "Other metric" : m.metricName}</p>
              <p className="display mt-2 text-4xl">{formatQualified(m.metricValue, m.valueQualifier)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.unitName}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {m.periodType && <Tag>{m.periodType}</Tag>}
                {m.isEstimate && <Tag tone="warn">Estimate</Tag>}
                <StatusBadge status={m.verificationStatus} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel?.metricName} kicker="Company metric">
        {sel && (
          <>
            <p className="display text-5xl">{formatQualified(sel.metricValue, sel.valueQualifier)}</p>
            <p className="mt-1 text-muted-foreground">{sel.unitName}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Value qualifier" value={sel.valueQualifier} />
              <Field label="Period type" value={sel.periodType} />
              <Field label="Business scope" value={sel.businessScope} />
              <Field label="Estimate" value={sel.isEstimate ? "Yes" : "No"} />
            </dl>
            {sel.methodologyNote && (<><p className="meta mb-1 mt-6">Methodology note</p><p className="text-sm">{sel.methodologyNote}</p></>)}
            <EvidenceBlock e={sel} />
          </>
        )}
      </DetailPanel>
    </div>
  );
}
