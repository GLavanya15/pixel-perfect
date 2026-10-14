import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Languages as LangIcon } from "lucide-react";
import { PageHeader, SearchInput, StatCard, matches } from "@/components/silo/ui";
import { companyMetrics, formatQualified, languageCapabilities, uniq } from "@/data/about";

export const Route = createFileRoute("/languages")({
  head: () => ({
    meta: [
      { title: "Languages — Consilio" },
      { name: "description", content: "Languages Consilio supports across its review and legal services." },
      { property: "og:title", content: "Languages — Consilio" },
      { property: "og:description", content: "Consilio's language capabilities." },
    ],
  }),
  component: Languages,
});

function Languages() {
  const [q, setQ] = useState("");
  const all = uniq(languageCapabilities.map((l) => l.languageName));
  const list = all.filter((n) => matches(q, n));
  const supported = companyMetrics.find((m) => m.metricName === "Languages supported");
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Languages" />
      {supported && (
        <div className="mb-6 max-w-xs">
          <StatCard value={formatQualified(supported.metricValue, supported.valueQualifier)} label={supported.unitName} />
        </div>
      )}
      <div className="mb-4 flex max-w-md"><SearchInput value={q} onChange={setQ} placeholder="Search languages" /></div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {list.map((n) => {
          const offerings = uniq(languageCapabilities.filter((l) => l.languageName === n).map((l) => l.offeringName));
          return (
            <li key={n} className="panel p-4">
              <div className="flex items-center gap-2">
                <LangIcon className="h-4 w-4 text-beacon" aria-hidden />
                <p className="font-semibold text-foreground">{n}</p>
              </div>
              {offerings.length > 0 && <p className="mt-1 text-xs text-muted-foreground">{offerings.join(", ")}</p>}
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="text-sm text-muted-foreground">No languages match “{q}”.</p>}
    </div>
  );
}
