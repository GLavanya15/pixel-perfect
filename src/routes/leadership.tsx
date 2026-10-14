import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Avatar, DetailPanel, EmptyState, Field, FilterBar, PageHeader, SearchInput, SelectFilter, Tag, matches } from "@/components/silo/ui";
import { leaders, uniq, type Leader } from "@/data/about";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Leadership — Consilio" },
      { name: "description", content: "Consilio's executive, senior, regional and function leaders." },
      { property: "og:title", content: "Leadership — Consilio" },
      { property: "og:description", content: "Meet Consilio's leadership team." },
    ],
  }),
  component: Leadership,
});

const LEVEL_ORDER = ["Executive", "Senior leader", "Regional leader", "Business/function leader"];
const LEVEL_LABEL: Record<string, string> = { Executive: "Executive team", "Senior leader": "Senior leaders", "Regional leader": "Regional leaders", "Business/function leader": "Business & function leaders" };

function Leadership() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("");
  const [fn, setFn] = useState("");
  const [sel, setSel] = useState<Leader | null>(null);
  const reset = () => { setQ(""); setLevel(""); setFn(""); };
  const list = leaders.filter(
    (l) => matches(q, l.fullName, l.jobTitle, l.leadershipFunctionName) && (!level || l.leaderLevelName === level) && (!fn || l.leadershipFunctionName === fn),
  );
  const groups = LEVEL_ORDER.map((lv) => ({ lv, items: list.filter((l) => l.leaderLevelName === lv) })).filter((g) => g.items.length);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Leadership" />
      <FilterBar count={list.length} total={leaders.length} onReset={reset} active={!!(q || level || fn)}>
        <SearchInput value={q} onChange={setQ} placeholder="Search name or title" />
        <SelectFilter label="Level" value={level} onChange={setLevel} options={LEVEL_ORDER.filter((x) => leaders.some((l) => l.leaderLevelName === x))} />
        <SelectFilter label="Function" value={fn} onChange={setFn} options={uniq(leaders.map((l) => l.leadershipFunctionName)).sort()} />
      </FilterBar>
      {list.length === 0 && <EmptyState onReset={reset} />}
      {groups.map((g) => (
        <section key={g.lv} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{LEVEL_LABEL[g.lv] ?? g.lv}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((l) => (
              <button key={l.leaderId} onClick={() => setSel(l)} className="panel panel-interactive flex items-start gap-4 p-5 text-left">
                <Avatar name={l.fullName} />
                <div className="min-w-0">
                  <p className="text-base font-semibold text-foreground">{l.fullName}</p>
                  <p className="mt-0.5 text-sm text-beacon">{l.jobTitle}</p>
                  {l.leadershipFunctionName && <div className="mt-2"><Tag>{l.leadershipFunctionName}</Tag></div>}
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      <DetailPanel open={!!sel} onClose={() => setSel(null)} title={sel?.fullName} kicker={sel?.jobTitle}>
        {sel && (
          <>
            <Avatar name={sel.fullName} size="lg" />
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Level" value={sel.leaderLevelName} />
              <Field label="Function" value={sel.leadershipFunctionName} />
              <Field label="Region" value={sel.region} />
            </dl>
            {sel.bioSummary && <p className="mt-6 text-sm leading-relaxed">{sel.bioSummary}</p>}
            {sel.profileUrl && (
              <a href={sel.profileUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                Profile on consilio.com <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
          </>
        )}
      </DetailPanel>
    </div>
  );
}
