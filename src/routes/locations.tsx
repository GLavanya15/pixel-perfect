import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, StatusBadge } from "@/components/silo/ui";
import { locations } from "@/data/about";
export const Route = createFileRoute("/locations")({
  head: () => ({ meta: [{ title: "Locations — Consilio | SiloVerse" }, { name: "description", content: "Consilio Locations as recorded in the workbook." }, { property: "og:title", content: "Locations — Consilio | SiloVerse" }, { property: "og:description", content: "Consilio Locations with verification context." }] }),
  component: () => (
    <div className="mx-auto max-w-5xl">
      <SectionHeader code="05" title="Locations" statement="Directory of recorded locations. Map view not yet built; city-level records are not shown as confirmed offices." />
      <div className="grid gap-4 md:grid-cols-2">
        {locations.map((r: any, i: number) => (
          <div key={i} className="panel p-5">
            <p className="text-lg text-foreground">{r.locationName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{[r.addressLine, r.city, r.stateProvince, r.country, r.locationType, r.isHeadquarters ? "Headquarters (per source)" : ""].filter(Boolean).join(" · ")}</p>
            <StatusBadge status={r.verificationStatus} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  ),
});
