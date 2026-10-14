import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DetailPanel, EmptyState, EvidenceBlock, Field, FilterBar, PageHeader, SearchInput, SelectFilter, Tag, matches } from "@/components/silo/ui";
import { companyMilestones, companyProfile as cp, uniq, type CompanyMilestone } from "@/data/about";
import { cleanLabel } from "@/data/present";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History & Milestones — Consilio" },
      { name: "description", content: "Consilio's founding, acquisitions, combinations and launches on a horizontal timeline." },
      { property: "og:title", content: "History & Milestones — Consilio" },
      { property: "og:description", content: "Chronology of Consilio milestones." },
    ],
  }),
  component: History,
});

const MAJOR = new Set(["Founding", "Merger", "Name change", "Ownership change"]);

function History() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [sel, setSel] = useState<CompanyMilestone | null>(null);
  const reset = () => { setQ(""); setType(""); };
  const list = companyMilestones.filter((m) => matches(q, m.eventTitle, m.counterpartyName, m.businessDescription) && (!type || m.eventType === type));
  const dated = list.filter((m) => m.acquiredYear);
  const years = uniq(dated.map((m) => m.acquiredYear)).sort((a, b) => a - b);
  const undated = list.filter((m) => !m.acquiredYear);

  const card = (m: CompanyMilestone, compact = false) => (
    <button
      key={m.companyMilestoneId}
      onClick={() => setSel(m)}
      className={cn("panel panel-interactive w-full p-4 text-left", MAJOR.has(m.eventType ?? "") && "ring-1 ring-beacon")}
    >
      {m.eventType && <Tag tone={MAJOR.has(m.eventType) ? "beacon" : "default"}>{m.eventType}</Tag>}
      <p className={cn("mt-2 font-semibold text-foreground", compact ? "text-sm" : "text-base")}>{cleanLabel(m.eventTitle)}</p>
      {m.counterpartyName && <p className="mt-0.5 text-xs text-muted-foreground">{m.counterpartyName}</p>}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="History & Milestones" description={cp.formerName ? `Founded in ${cp.foundedYear} as ${cp.formerName}; renamed ${cp.brandName} in ${cp.brandNameChangeYear}.` : undefined} />
      <FilterBar count={list.length} total={companyMilestones.length} onReset={reset} active={!!(q || type)}>
        <SearchInput value={q} onChange={setQ} placeholder="Search milestones" />
        <SelectFilter label="Event type" value={type} onChange={setType} options={uniq(companyMilestones.map((m) => m.eventType)).sort()} />
      </FilterBar>
      {list.length === 0 && <EmptyState onReset={reset} />}

      {years.length > 0 && (
        <section className="panel mb-8 p-4 sm:p-6" aria-label="Timeline">
          <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
            <ol className="relative flex min-w-max gap-6">
              <span className="absolute left-0 right-0 top-[15px] h-px bg-border" aria-hidden />
              {years.map((y) => (
                <li key={y} className="relative w-64 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="relative z-10 h-3 w-3 rounded-full border-2 border-beacon bg-background" aria-hidden />
                    <span className="text-2xl font-semibold tabular-nums text-beacon">{y}</span>
                  </div>
                  <div className="mt-4 space-y-3">{dated.filter((m) => m.acquiredYear === y).map((m) => card(m))}</div>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-2 text-xs text-muted-foreground sm:hidden">Scroll sideways to see more years →</p>
        </section>
      )}

      {undated.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Other milestones</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{undated.map((m) => card(m, true))}</div>
        </section>
      )}

      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel ? cleanLabel(sel.eventTitle) : undefined} kicker={sel?.eventType}>
        {sel && (
          <>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Year" value={sel.acquiredYear} />
              <Field label="Transaction type" value={sel.transactionType} />
              <Field label="Counterparty" value={sel.counterpartyName} />
              <Field label="Status" value={sel.eventStatusName} />
            </dl>
            {sel.acquiredScope && (<><h3 className="mt-6 text-sm font-semibold">Scope</h3><p className="mt-1 text-sm text-muted-foreground">{sel.acquiredScope}</p></>)}
            {sel.businessDescription && (<><h3 className="mt-6 text-sm font-semibold">Description</h3><p className="mt-1 text-sm text-muted-foreground">{sel.businessDescription}</p></>)}
            {sel.strategicRationale && (<><h3 className="mt-6 text-sm font-semibold">Strategic rationale</h3><p className="mt-1 text-sm text-muted-foreground">{sel.strategicRationale}</p></>)}
            <EvidenceBlock e={sel} />
          </>
        )}
      </DetailPanel>
    </div>
  );
}
