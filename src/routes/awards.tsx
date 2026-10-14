import { createFileRoute } from "@tanstack/react-router";
import { Award } from "lucide-react";
import { PageHeader, Tag } from "@/components/silo/ui";
import { awards } from "@/data/about";
import { cleanLabel } from "@/data/present";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Recognition — Consilio" },
      { name: "description", content: "Awards and industry recognition received by Consilio." },
      { property: "og:title", content: "Awards & Recognition — Consilio" },
      { property: "og:description", content: "Consilio's awards and recognition." },
    ],
  }),
  component: Awards,
});

function Awards() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Awards & Recognition" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {awards.map((a) => (
          <div key={a.awardId} className="panel p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-beacon-soft text-beacon"><Award className="h-4 w-4" aria-hidden /></span>
              {a.awardYear && <span className="ml-auto text-lg font-semibold tabular-nums text-beacon">{a.awardYear}</span>}
            </div>
            <p className="mt-3 text-base font-semibold text-foreground">{cleanLabel(a.awardName)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{a.awardingBody}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.awardStatus && <Tag tone="beacon">{a.awardStatus}</Tag>}
              {a.awardCategory && <Tag>{a.awardCategory}</Tag>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
