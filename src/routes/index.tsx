import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { OriginScene } from "@/components/silo/OriginScene";
import { StatusBadge, Tag } from "@/components/silo/ui";
import {
  awards, companyFinancials, companyMetrics, companyMilestones, companyOfferings, companyProfile as cp,
  formatMoney, formatQualified, languageCapabilities, leaders, locations, isMappable, uniq, workforceMetrics,
} from "@/data/about";
import type { ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Origin — Consilio Overview | SiloVerse" },
      { name: "description", content: "The Origin world of SiloVerse: Consilio's identity, metrics, leadership, history and capabilities." },
      { property: "og:title", content: "Origin — Consilio Overview | SiloVerse" },
      { property: "og:description", content: "Enter Consilio through the Origin Core: identity, people, history and capabilities." },
    ],
  }),
  component: Origin,
});

const HIGHLIGHT_METRICS = ["Employee count", "Review professionals", "Languages supported", "Matters hosted"];

function Origin() {
  const metrics = HIGHLIGHT_METRICS.map((n) => companyMetrics.find((m) => m.metricName === n)!).filter(Boolean);
  const dated = companyMilestones.filter((m) => m.acquiredYear).sort((a, b) => a.acquiredYear! - b.acquiredYear!);
  const execs = leaders.filter((l) => l.leaderLevelName === "Executive").slice(0, 4);
  const latestFin = companyFinancials[companyFinancials.length - 1];
  const counts: Record<string, string> = {
    "/profile": cp.foundedYear ? `Est. ${cp.foundedYear}` : "",
    "/leadership": `${leaders.length} leaders`,
    "/history": `${companyMilestones.length} events`,
    "/services": `${companyOfferings.length} offerings`,
    "/locations": `${locations.length} records`,
    "/financials": `${companyFinancials.length} estimates`,
    "/workforce": `${workforceMetrics.length} indicators`,
    "/awards": `${awards.length} records`,
  };

  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative animate-rise">
        <p className="meta">World 01 · Central landmark · Core</p>
        <h1 className="display mt-3 text-6xl text-foreground md:text-8xl">Origin</h1>
        <p className="display mt-2 text-xl text-muted-foreground md:text-2xl">Where Consilio begins</p>
        <div className="mt-2 hidden md:block">
          <OriginScene counts={counts} />
        </div>
        {/* Small screens: same destinations as a list */}
        <ul className="mt-6 grid grid-cols-2 gap-2 md:hidden">
          {Object.keys(counts).map((to) => (
            <li key={to}>
              <Link to={to} className="panel block p-3 text-sm">{to.slice(1).replace(/^\w/, (c) => c.toUpperCase())}</Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-6">
        <Panel to="/profile" code="01" title="Identity" className="md:col-span-4">
          <p className="display text-3xl">{cp.brandName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{cp.legalName}{cp.formerName && ` · formerly ${cp.formerName}`}</p>
          {cp.shortDescription && <p className="mt-4 max-w-2xl text-foreground/90">{cp.shortDescription}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {cp.foundedYear && <Tag tone="beacon">Founded {cp.foundedYear}</Tag>}
            {cp.brandNameChangeYear && <Tag>Renamed Consilio {cp.brandNameChangeYear}</Tag>}
            {cp.companyType && <Tag>{cp.companyType}</Tag>}
            {cp.profileStatus && <Tag tone="warn">Profile status: {cp.profileStatus}</Tag>}
          </div>
        </Panel>

        <Panel to="/financials" code="06" title="Financial snapshot" className="md:col-span-2">
          {latestFin && (
            <>
              <p className="meta">{latestFin.financialMetricName} · FY{latestFin.fiscalYear}</p>
              <p className="display mt-1 text-4xl">~{formatMoney(latestFin.amount, latestFin.currency)}</p>
              <p className="mt-2 text-xs text-muted-foreground">{latestFin.financialClassification} · {latestFin.valueBasisName}. Not audited or company-reported.</p>
              <StatusBadge status={latestFin.verificationStatus} className="mt-3" />
            </>
          )}
        </Panel>

        <Panel to="/profile" code="—" title="Company metrics" className="md:col-span-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.companyMetricId}>
                <p className="display text-4xl text-foreground">{formatQualified(m.metricValue, m.valueQualifier)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.unitName}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {m.periodType && <span className="meta">{m.periodType}</span>}
                  <StatusBadge status={m.verificationStatus} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel to="/leadership" code="02" title="Leadership" className="md:col-span-3">
          <ul className="divide-y divide-border">
            {execs.map((l) => (
              <li key={l.leaderId} className="flex items-baseline justify-between gap-3 py-2">
                <span className="text-foreground">{l.fullName}</span>
                <span className="text-right text-xs text-muted-foreground">{l.jobTitle}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">{leaders.length} leaders recorded</p>
        </Panel>

        <Panel to="/history" code="03" title="Milestones" className="md:col-span-3">
          <ol className="relative border-l border-border pl-4">
            {dated.slice(-5).map((m) => (
              <li key={m.companyMilestoneId} className="mb-3 last:mb-0">
                <span className="absolute -left-[3px] mt-1.5 h-1.5 w-1.5 rounded-full bg-beacon" />
                <span className="font-mono text-xs text-beacon">{m.acquiredYear}</span>
                <span className="ml-2 text-sm text-foreground">{m.eventTitle}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel to="/services" code="04" title="Services & solutions" className="md:col-span-4">
          <div className="flex flex-wrap gap-2">
            {companyOfferings.map((o) => (
              <span key={o.companyOfferingId} className="rounded-full border border-border px-3 py-1 text-sm text-foreground">{o.serviceName}</span>
            ))}
          </div>
        </Panel>

        <Panel to="/locations" code="05" title="Locations" className="md:col-span-2">
          <p className="text-sm text-foreground">{uniq(locations.map((l) => l.country)).join(" · ")}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {locations.filter(isMappable).length} of {locations.length} records verified with a published address.
          </p>
        </Panel>

        <Panel to="/workforce" code="07" title="Languages" className="md:col-span-3">
          <div className="flex flex-wrap gap-2">
            {uniq(languageCapabilities.map((l) => l.languageName)).map((n) => <Tag key={n}>{n}</Tag>)}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Languages itemised in the workbook. Separately, the company states 31 languages covered for review projects.</p>
        </Panel>

        <Panel to="/awards" code="08" title="Recognition" className="md:col-span-3">
          <ul className="space-y-2">
            {awards.map((a) => (
              <li key={a.awardId} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-foreground">{a.awardName}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{[a.awardStatus, a.awardYear].filter(Boolean).join(" · ")}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ to, code, title, className, children }: { to: string; code: string; title: string; className?: string; children: ReactNode }) {
  return (
    <Link to={to} className={`panel panel-interactive group block p-6 ${className ?? ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <span className="meta">{code !== "—" ? `Sector ${code} · ` : ""}{title}</span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-beacon" aria-hidden />
      </div>
      {children}
    </Link>
  );
}
