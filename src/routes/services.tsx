import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { DetailPanel, EmptyState, EvidenceBlock, Field, FilterBar, SearchInput, SectionHeader, SelectFilter, StatusBadge, Tag, matches } from "@/components/silo/ui";
import { companyOfferings, languageCapabilities, uniq, type CompanyOffering } from "@/data/about";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Solutions — Consilio | SiloVerse" },
      { name: "description", content: "Consilio's service and solution offerings, grouped by category and linked market segments." },
      { property: "og:title", content: "Services & Solutions — Consilio | SiloVerse" },
      { property: "og:description", content: "Explore Consilio offerings and their recorded market segments." },
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
  const ids = new Set(list.map((o) => o.companyOfferingId));

  // Constellation: offerings on a ring, segments in centre; lines = recorded links only.
  const W = 900, H = 420, cx = W / 2, cy = H / 2;
  const oPos = companyOfferings.map((o, i) => {
    const a = (i / companyOfferings.length) * Math.PI * 2 - Math.PI / 2;
    return { o, x: cx + 380 * Math.cos(a), y: cy + 170 * Math.sin(a) };
  });
  const sPos = allSegs.map((s, i) => {
    const a = (i / Math.max(allSegs.length, 1)) * Math.PI * 2;
    return { s, x: cx + 150 * Math.cos(a), y: cy + 70 * Math.sin(a) };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader code="04" title="Services & Solutions" statement="Offerings recorded for Consilio. Lines in the constellation show only market-segment links present in the workbook." />

      <section className="panel mb-6 hidden p-4 md:block" aria-label="Offering constellation">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {oPos.flatMap(({ o, x, y }) =>
            o.marketSegments.map((s) => {
              const sp = sPos.find((p) => p.s === s.segmentName)!;
              const on = ids.has(o.companyOfferingId) && (!seg || seg === s.segmentName);
              return <line key={`${o.companyOfferingId}-${s.marketSegmentId}`} x1={x} y1={y} x2={sp.x} y2={sp.y} stroke={on ? "var(--beacon)" : "var(--structure)"} strokeOpacity={on ? 0.6 : 0.2} />;
            }),
          )}
          {sPos.map(({ s, x, y }) => (
            <g key={s} onClick={() => setSeg(seg === s ? "" : s)} className="cursor-pointer">
              <circle cx={x} cy={y} r={seg === s ? 6 : 4} fill="var(--structure)" />
              <text x={x} y={y - 10} textAnchor="middle" className="fill-muted-foreground text-[11px]">{s}</text>
            </g>
          ))}
          {oPos.map(({ o, x, y }) => {
            const on = ids.has(o.companyOfferingId);
            return (
              <g key={o.companyOfferingId} onClick={() => setSel(o)} className="cursor-pointer" opacity={on ? 1 : 0.3}>
                <circle cx={x} cy={y} r={10} fill="var(--beacon-soft)" stroke="var(--beacon)" />
                <circle cx={x} cy={y} r={3} fill="var(--beacon)" />
                <text x={x} y={y + 26} textAnchor="middle" className="fill-foreground text-[12px]">{o.serviceName}</text>
              </g>
            );
          })}
        </svg>
        <p className="text-xs text-muted-foreground">Select an outer node to open an offering; select an inner node to filter by segment. The list below offers the same actions.</p>
      </section>

      <FilterBar count={list.length} total={companyOfferings.length} onReset={reset} active={!!(q || seg || type)}>
        <SearchInput value={q} onChange={setQ} placeholder="Search offerings and use cases" />
        <SelectFilter label="Market segment" value={seg} onChange={setSeg} options={allSegs} />
        <SelectFilter label="Offering type" value={type} onChange={setType} options={uniq(companyOfferings.map((o) => o.offeringTypeName))} />
      </FilterBar>
      {list.length === 0 && <EmptyState onReset={reset} />}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((o) => (
          <button key={o.companyOfferingId} onClick={() => setSel(o)} className={cn("panel panel-interactive p-5 text-left")}>
            <div className="flex flex-wrap items-center gap-2">
              {o.serviceCategory && <span className="meta">{o.serviceCategory}</span>}
              {o.offeringTypeName && <Tag>{o.offeringTypeName}</Tag>}
              <StatusBadge status={o.verificationStatus} />
            </div>
            <p className="display mt-3 text-2xl">{o.serviceName}</p>
            {o.description && <p className="mt-2 text-sm text-muted-foreground">{o.description}</p>}
            {o.marketSegments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">{o.marketSegments.map((s) => <Tag key={s.marketSegmentId} tone="beacon">{s.segmentName}</Tag>)}</div>
            )}
          </button>
        ))}
      </div>

      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel?.serviceName} kicker={sel?.serviceCategory}>
        {sel && (
          <>
            {sel.description && <p className="text-foreground/90">{sel.description}</p>}
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Offering type" value={sel.offeringTypeName} />
              <Field label="Service code" value={sel.serviceCode} />
              <Field label="Delivery model" value={sel.deliveryModel} />
              <Field label="Geographic availability" value={sel.geographicAvailability} />
              <Field label="Active" value={sel.isActive ? "Yes" : "No"} />
            </dl>
            {sel.useCases && (<><p className="meta mb-1 mt-6">Use cases</p><p className="text-sm">{sel.useCases}</p></>)}
            {sel.marketSegments.length > 0 && (
              <><p className="meta mb-2 mt-6">Market segments</p>
                <ul className="space-y-1 text-sm">{sel.marketSegments.map((s) => <li key={s.marketSegmentId}>{s.segmentName} <span className="text-muted-foreground">· {s.segmentType}</span></li>)}</ul></>
            )}
            {(() => {
              const langs = uniq(languageCapabilities.filter((l) => l.offeringName === sel.serviceName).map((l) => l.languageName));
              return langs.length ? (<><p className="meta mb-2 mt-6">Itemised languages</p><div className="flex flex-wrap gap-1.5">{langs.map((l) => <Tag key={l}>{l}</Tag>)}</div></>) : null;
            })()}
            {sel.officialUrl && (
              <a href={sel.officialUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                Official page <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
            <EvidenceBlock e={sel} />
          </>
        )}
      </DetailPanel>
    </div>
  );
}
