import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { DetailPanel, EmptyState, EvidenceBlock, Field, FilterBar, PageHeader, SearchInput, SelectFilter, Tag, matches } from "@/components/silo/ui";
import { companyOfferings, languageCapabilities, uniq, type CompanyOffering } from "@/data/about";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Solutions — Consilio" },
      { name: "description", content: "All Consilio services and solutions with categories and market segments." },
      { property: "og:title", content: "Services & Solutions — Consilio" },
      { property: "og:description", content: "Explore every Consilio service and solution." },
    ],
  }),
  component: Services,
});

function Services() {
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState("");
  const [type, setType] = useState("");
  const [sel, setSel] = useState<CompanyOffering | null>(null);
  const reset = () => { setQ(""); setSeg(""); setType(""); };
  const allSegs = uniq(companyOfferings.flatMap((o) => o.marketSegments.map((s) => s.segmentName))).sort();
  const list = companyOfferings.filter(
    (o) => matches(q, o.serviceName, o.description, o.useCases, o.serviceCategory) &&
      (!seg || o.marketSegments.some((s) => s.segmentName === seg)) && (!type || o.offeringTypeName === type),
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Services & Solutions" />
      <FilterBar count={list.length} total={companyOfferings.length} onReset={reset} active={!!(q || seg || type)}>
        <SearchInput value={q} onChange={setQ} placeholder="Search services and use cases" />
        <SelectFilter label="Market segment" value={seg} onChange={setSeg} options={allSegs} />
        <SelectFilter label="Offering type" value={type} onChange={setType} options={uniq(companyOfferings.map((o) => o.offeringTypeName))} />
      </FilterBar>
      {list.length === 0 && <EmptyState onReset={reset} />}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((o) => (
          <button key={o.companyOfferingId} onClick={() => setSel(o)} className="panel panel-interactive flex flex-col p-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              {o.serviceCategory && <Tag tone="beacon">{o.serviceCategory}</Tag>}
              {o.offeringTypeName && <Tag>{o.offeringTypeName}</Tag>}
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">{o.serviceName}</p>
            {o.description && <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{o.description}</p>}
          </button>
        ))}
      </div>

      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel?.serviceName} kicker={sel?.serviceCategory}>
        {sel && (
          <>
            {sel.description && <p className="text-foreground/90">{sel.description}</p>}
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Offering type" value={sel.offeringTypeName} />
              <Field label="Delivery model" value={sel.deliveryModel} />
              <Field label="Availability" value={sel.geographicAvailability} />
            </dl>
            {sel.useCases && (<><h3 className="mt-6 text-sm font-semibold">Use cases</h3><p className="mt-1 text-sm text-muted-foreground">{sel.useCases}</p></>)}
            {sel.marketSegments.length > 0 && (
              <><h3 className="mb-2 mt-6 text-sm font-semibold">Market segments</h3>
                <div className="flex flex-wrap gap-1.5">{sel.marketSegments.map((s) => <Tag key={s.marketSegmentId} tone="outline">{s.segmentName}</Tag>)}</div></>
            )}
            {(() => {
              const langs = uniq(languageCapabilities.filter((l) => l.offeringName === sel.serviceName).map((l) => l.languageName));
              return langs.length ? (<><h3 className="mb-2 mt-6 text-sm font-semibold">Languages</h3><div className="flex flex-wrap gap-1.5">{langs.map((l) => <Tag key={l}>{l}</Tag>)}</div></>) : null;
            })()}
            {sel.officialUrl ? (
              <a href={sel.officialUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                Official page <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            ) : <EvidenceBlock e={sel} />}
          </>
        )}
      </DetailPanel>
    </div>
  );
}
