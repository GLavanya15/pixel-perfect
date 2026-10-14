import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { DetailPanel, EmptyState, EvidenceBlock, Field, FilterBar, SearchInput, SectionHeader, SelectFilter, StatusBadge, matches } from "@/components/silo/ui";
import { leaders, uniq, type Leader } from "@/data/about";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — Consilio | SiloVerse" },
      { name: "description", content: "Searchable directory of Consilio's recorded executive, senior and function leaders." },
      { property: "og:title", content: "Leadership — Consilio | SiloVerse" },
      { property: "og:description", content: "Consilio leadership directory with verification context." },
    ],
  }),
  component: Leadership,
});

const LEVEL_ORDER = ["Executive", "Senior leader", "Regional leader", "Business/function leader"];

function Leadership() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");
  const [fn, setFn] = useState("");
  const [status, setStatus] = useState("");
  const [sel, setSel] = useState<Leader | null>(null);
  const reset = () => { setQ(""); setLevel(""); setFn(""); setStatus(""); };
  const list = leaders.filter(
    (l) => matches(q, l.fullName, l.jobTitle, l.leadershipFunctionName, l.bioSummary) &&
      (!level || l.leaderLevelName === level) && (!fn || l.leadershipFunctionName === fn) && (!status || l.verificationStatus === status),
  );
  const groups = LEVEL_ORDER.map((lv) => ({ lv, items: list.filter((l) => l.leaderLevelName === lv) })).filter((g) => g.items.length);

  return (
    <div className="mx-auto max-w-6xl">
      <SectionHeader code="02" title="Leadership" statement="Leaders recorded in the workbook. No biographies, photographs or reporting lines beyond the source are shown." />
      <FilterBar count={list.length} total={leaders.length} onReset={reset} active={!!(q || level || fn || status)}>
        <SearchInput value={q} onChange={setQ} placeholder="Search name, title or function" />
        <SelectFilter label="Level" value={level} onChange={setLevel} options={LEVEL_ORDER.filter((x) => leaders.some((l) => l.leaderLevelName === x))} />
        <SelectFilter label="Function" value={fn} onChange={setFn} options={uniq(leaders.map((l) => l.leadershipFunctionName)).sort()} />
        <SelectFilter label="Verification" value={status} onChange={setStatus} options={uniq(leaders.map((l) => l.verificationStatus))} />
      </FilterBar>
      {list.length === 0 && <EmptyState onReset={reset} />}
      {groups.map((g) => (
        <section key={g.lv} className="mb-8">
          <p className="meta mb-3">{g.lv} · {g.items.length}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((l) => (
              <button key={l.leaderId} onClick={() => setSel(l)} className="panel panel-interactive p-5 text-left">
                <p className="display text-xl text-foreground">{l.fullName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{l.jobTitle}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {l.leadershipFunctionName && <span className="meta">{l.leadershipFunctionName}</span>}
                  <StatusBadge status={l.verificationStatus} />
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel?.fullName} kicker="Leader">
        {sel && (
          <>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field label="Job title" value={sel.jobTitle} />
              <Field label="Level" value={sel.leaderLevelName} />
              <Field label="Function" value={sel.leadershipFunctionName} />
              <Field label="Region" value={sel.region} />
              <Field label="Current" value={sel.isCurrent ? "Yes" : "No"} />
            </dl>
            {sel.bioSummary && (<><p className="meta mb-1 mt-6">Summary (from source)</p><p className="text-sm">{sel.bioSummary}</p></>)}
            {sel.profileUrl && (
              <a href={sel.profileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                Profile page <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
            <EvidenceBlock e={sel} />
          </>
        )}
      </DetailPanel>
    </div>
  );
}
