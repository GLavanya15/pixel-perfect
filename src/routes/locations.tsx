import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PageHeader, Tag } from "@/components/silo/ui";
import { locations, uniq } from "@/data/about";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — Consilio" },
      { name: "description", content: "Consilio locations grouped by country, including headquarters, offices and data centres." },
      { property: "og:title", content: "Locations — Consilio" },
      { property: "og:description", content: "Where Consilio operates." },
    ],
  }),
  component: Locations,
});

function Locations() {
  const countries = uniq(locations.map((l) => l.country));
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Locations" />
      <div className="mb-6 flex flex-wrap gap-2">
        {countries.map((c) => <Tag key={c} tone="beacon">{c} · {locations.filter((l) => l.country === c).length}</Tag>)}
      </div>
      <div className="space-y-6">
        {countries.map((c) => {
          const items = locations.filter((l) => l.country === c);
          return (
            <section key={c}>
              <h2 className="mb-3 flex items-baseline gap-2">
                <span className="text-xl font-semibold text-foreground">{c}</span>
                {items[0]?.region && <span className="text-sm text-muted-foreground">{items[0].region}</span>}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((l) => (
                  <div key={l.locationId} className={`panel p-5 ${l.isHeadquarters ? "ring-1 ring-beacon" : ""}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-beacon" aria-hidden />
                      <p className="text-lg font-semibold text-foreground">{l.city ?? c}</p>
                      {l.isHeadquarters && <span className="ml-auto"><Tag tone="beacon">Headquarters</Tag></span>}
                    </div>
                    {l.stateProvince && <p className="mt-1 text-sm text-beacon">{l.stateProvince}</p>}
                    {l.addressLine && <p className="mt-2 text-sm text-muted-foreground">{l.addressLine}</p>}
                    {l.locationType && !["Unknown", "Headquarters"].includes(l.locationType) && <div className="mt-3"><Tag>{l.locationType}</Tag></div>}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
