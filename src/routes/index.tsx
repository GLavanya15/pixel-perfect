import { createFileRoute } from "@tanstack/react-router";
import { Award, Briefcase, Building2, History, Languages, MapPin, TrendingUp, Users, UsersRound } from "lucide-react";
import { Avatar, PreviewCard, Stat, Tag } from "@/components/silo/ui";
import {
  awards, companyFinancials, companyMetrics, companyMilestones, companyOfferings, companyProfile as cp,
  formatMoney, formatQualified, languageCapabilities, leaders, locations, uniq, workforceMetrics,
} from "@/data/about";
import { cleanLabel, PROFILE_TAGS, yearsSince } from "@/data/present";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Consilio — Company Overview" },
      { name: "description", content: "Consilio at a glance: identity, leadership, services, locations, workforce, languages, financials, history and awards." },
      { property: "og:title", content: "Consilio — Company Overview" },
      { property: "og:description", content: "A compact, card-based overview of Consilio." },
    ],
  }),
  component: Overview,
});

const KEY_METRICS = ["Employee count", "Review professionals", "Languages supported", "Matters hosted"];

function Overview() {
  const age = yearsSince(cp.foundedYear);
  const metrics = KEY_METRICS.map((n) => companyMetrics.find((m) => m.metricName === n)).filter((m) => !!m);
  const [ceo, ...rest] = leaders.filter((l) => l.leaderLevelName === "Executive");
  const hq = locations.find((l) => l.isHeadquarters);
  const latestFin = companyFinancials[companyFinancials.length - 1];
  const langs = uniq(languageCapabilities.map((l) => l.languageName));
  const dated = companyMilestones.filter((m) => m.acquiredYear).sort((a, b) => b.acquiredYear! - a.acquiredYear!);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="panel mb-5 p-5 md:p-6 animate-rise">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{cp.brandName}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{cp.legalName}</p>
          </div>
          <div className="flex gap-8">
            <Stat value={cp.foundedYear} label="Founded" />
            {age !== undefined && <Stat value={age} label="Years in industry" />}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5 lg:grid-cols-4">
          {metrics.map((m) => (
            <Stat key={m.companyMetricId} value={formatQualified(m.metricValue, m.valueQualifier)} label={m.unitName.replace(/^\w/, (c) => c.toUpperCase())} />
          ))}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <PreviewCard to="/profile" icon={Building2} title="Company Profile">
          <p className="text-lg font-semibold text-foreground">{cp.companyType ?? cp.brandName}</p>
          {cp.formerName && <p className="text-sm text-muted-foreground">Formerly {cp.formerName}</p>}
          <div className="mt-4 flex flex-wrap gap-1.5">{PROFILE_TAGS.map((t) => <Tag key={t} tone="beacon">{t}</Tag>)}</div>
        </PreviewCard>

        <PreviewCard to="/leadership" icon={Users} title="Leadership" action="View all leaders">
          {ceo && (
            <div className="flex items-center gap-3">
              <Avatar name={ceo.fullName} size="lg" />
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground">{ceo.fullName}</p>
                <p className="text-sm text-beacon">{ceo.jobTitle}</p>
              </div>
            </div>
          )}
          <ul className="mt-4 space-y-3 border-t border-border pt-4">
            {rest.slice(0, 2).map((l) => (
              <li key={l.leaderId} className="flex items-center gap-3">
                <Avatar name={l.fullName} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{l.fullName}</p>
                  <p className="truncate text-xs text-beacon">{l.jobTitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </PreviewCard>

        <PreviewCard to="/services" icon={Briefcase} title="Services & Solutions" action="View all services">
          <ul className="space-y-3">
            {companyOfferings.slice(0, 3).map((o) => (
              <li key={o.companyOfferingId}>
                <p className="text-sm font-semibold text-foreground">{o.serviceName}</p>
                {o.serviceCategory && <p className="text-xs text-muted-foreground">{o.serviceCategory}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">+{companyOfferings.length - 3} more services</p>
        </PreviewCard>

        <PreviewCard to="/locations" icon={MapPin} title="Locations" action="View all locations">
          {hq && (
            <>
              <Tag tone="beacon">Headquarters</Tag>
              <p className="mt-3 text-2xl font-semibold text-foreground">{hq.country}</p>
              <p className="text-sm text-beacon">{hq.city}{hq.region ? ` · ${hq.region}` : ""}</p>
            </>
          )}
          <p className="mt-4 text-xs text-muted-foreground">Presence in {uniq(locations.map((l) => l.country)).join(", ")}</p>
        </PreviewCard>

        <PreviewCard to="/workforce" icon={UsersRound} title="Workforce">
          <div className="grid grid-cols-2 gap-4">
            {workforceMetrics.slice(0, 4).map((w) => (
              <Stat key={w.workforceMetricId} value={formatQualified(w.countValue, w.valueQualifier)} label={w.populationType} className="[&>p:first-child]:text-2xl" />
            ))}
          </div>
        </PreviewCard>

        <PreviewCard to="/languages" icon={Languages} title="Languages" action="More languages">
          <div className="flex flex-wrap gap-2">
            {langs.slice(0, 3).map((l) => <Tag key={l} tone="outline">{l}</Tag>)}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">+{langs.length - 3} more languages</p>
        </PreviewCard>

        <PreviewCard to="/financials" icon={TrendingUp} title="Financial Information">
          {latestFin && (
            <Stat value={<span className="text-beacon">≈ {formatMoney(latestFin.amount, latestFin.currency)}</span>} label={`${latestFin.financialMetricName ?? "Revenue"} · FY${latestFin.fiscalYear}`} />
          )}
          <div className="mt-4 flex gap-4 border-t border-border pt-4">
            {companyFinancials.slice(0, -1).map((f) => (
              <div key={f.companyFinancialId}>
                <p className="text-sm font-semibold text-foreground">{formatMoney(f.amount, f.currency)}</p>
                <p className="text-xs text-muted-foreground">FY{f.fiscalYear}</p>
              </div>
            ))}
          </div>
        </PreviewCard>

        <PreviewCard to="/history" icon={History} title="History & Milestones" action="View timeline">
          <ol className="space-y-2.5">
            {dated.slice(0, 4).map((m) => (
              <li key={m.companyMilestoneId} className="flex gap-3 text-sm">
                <span className="w-10 shrink-0 font-semibold text-beacon tabular-nums">{m.acquiredYear}</span>
                <span className="text-foreground">{cleanLabel(m.eventTitle)}</span>
              </li>
            ))}
          </ol>
        </PreviewCard>

        <PreviewCard to="/awards" icon={Award} title="Awards & Recognition">
          <ul className="space-y-3">
            {awards.map((a) => (
              <li key={a.awardId}>
                <p className="text-sm font-semibold text-foreground">{cleanLabel(a.awardName)}</p>
                <p className="text-xs text-muted-foreground">{[a.awardingBody, a.awardYear].filter(Boolean).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </PreviewCard>
      </div>
    </div>
  );
}
