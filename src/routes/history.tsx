import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DetailPanel, EmptyState, EvidenceBlock, Field, FilterBar, SearchInput, SectionHeader, SelectFilter, StatusBadge, Tag, matches } from "@/components/silo/ui";
import { companyMilestones, companyProfile, uniq, type CompanyMilestone } from "@/data/about";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History & Milestones — Consilio | SiloVerse" },
      { name: "description", content: "Consilio's founding, acquisitions, combinations and launches with evidence status." },
      { property: "og:title", content: "History & Milestones — Consilio | SiloVerse" },
      { property: "og:description", content: "Chronology of Consilio milestones as recorded in the workbook." },
    ],
  }),
  component: History,
});

function History() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [evStatus, setEvStatus] = useState("");
  const [status, setStatus] = useState("");
  const [sel, setSel] = useState<CompanyMilestone | null>(null);
  const reset = () => { setQ(""); setType(""); setYear(""); setEvStatus(""); setStatus(""); };
  const list = companyMilestones.filter(
    (m) => matches(q, m.eventTitle, m.counterpartyName, m.businessDescription) &&
      (!type || m.eventType === type) && (!year || String(m.acquiredYear) === year) &&
      (!evStatus || m.eventStatusName === evStatus) && (!status || m.verificationStatus === status),
  );
  const dated = list.filter((m) => m.acquiredYear).sort((a, b) => a.acquiredYear! - b.acquiredYear!);
  const undated = list.filter((m) => !m.acquiredYear);

  const card = (m: CompanyMilestone) => (
    <button key={m.companyMilestoneId} onClick={() => setSel(m)} className="panel panel-interactive w-full p-5 text-left">
      <div className="flex flex-wrap items-center gap-2">
        {m.eventType && <Tag tone="beacon">{m.eventType}</Tag>}
        {m.eventStatusName && m.eventStatusName !== "Completed" && <Tag tone="warn">Event status: {m.eventStatusName}</Tag>}
        <StatusBadge status={m.verificationStatus} />
      </div>
      <p className="mt-3 text-lg text-foreground">{m.eventTitle}</p>
      {m.acquiredScope && <p className="mt-1 text-sm text-muted-foreground">{m.acquiredScope}</p>}
    </button>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeader
        code="03"
        title="History & Milestones"
        statement={`Founded ${companyProfile.foundedYear} as ${companyProfile.formerName}; renamed ${companyProfile.brandName} in ${companyProfile.brandNameChangeYear} (per company profile).`}
      />
      <FilterBar count={list.length} total={companyMilestones.length} onReset={reset} active={!!(q || type || year || evStatus || status)}>
        <SearchInput value={q} onChange={setQ} placeholder="Search events or counterparties" />
        <SelectFilter label="Event type" value={type} onChange={setType} options={uniq(companyMilestones.map((m) => m.eventType)).sort()} />
        <SelectFilter label="Year" value={year} onChange={setYear} options={uniq(companyMilestones.map((m) => m.acquiredYear)).sort()} />
        <SelectFilter label="Event status" value={evStatus} onChange={setEvStatus} options={uniq(companyMilestones.map((m) => m.eventStatusName))} />
        <SelectFilter label="Verification" value={status} onChange={setStatus} options={uniq(companyMilestones.map((m) => m.verificationStatus))} />
      </FilterBar>
      {list.length === 0 && <EmptyState onReset={reset} />}

      {dated.length > 0 && (
        <section className="mb-12">
          <p className="meta mb-4">Dated events · by recorded year</p>
          <ol className="relative ml-3 border-l border-border">
            {dated.map((m) => (
              <li key={m.companyMilestoneId} className="relative mb-5 pl-8">
                <span className="absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full bg-beacon beacon-glow" aria-hidden />
                <p className="font-mono text-sm text-beacon">{m.acquiredYear}</p>
                {card(m)}
              </li>
            ))}
          </ol>
        </section>
      )}
      {undated.length > 0 && (
        <section>
          <p className="meta mb-1">Year not recorded · {undated.length}</p>
          <p className="mb-4 text-xs text-muted-foreground">Listed in workbook order. No year is inferred from descriptions.</p>
          <div className="grid gap-3 md:grid-cols-2">{undated.map(card)}</div>
        </section>
      )}

      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel?.eventTitle} kicker="Milestone">
        {sel && (
          <>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Year" value={sel.acquiredYear} />
              <Field label="Event type" value={sel.eventType} />
              <Field label="Transaction type" value={sel.transactionType} />
              <Field label="Event status" value={sel.eventStatusName} />
              <Field label="Counterparty" value={sel.counterpartyName} />
              <Field label="Counted as acquisition" value={sel.countAsAcquisition ? "Yes" : "No"} />
            </dl>
            {sel.acquiredScope && (<><p className="meta mb-1 mt-6">Scope</p><p className="text-sm">{sel.acquiredScope}</p></>)}
            {sel.businessDescription && (<><p className="meta mb-1 mt-6">Description</p><p className="text-sm">{sel.businessDescription}</p></>)}
            {sel.strategicRationale && (<><p className="meta mb-1 mt-6">Strategic rationale</p><p className="text-sm">{sel.strategicRationale}</p></>)}
            <EvidenceBlock e={sel} />
          </>
        )}
      </DetailPanel>
    </div>
  );
}
