import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/silo/ui";
import { fieldMappings, openQuestions, dataQualityNotes } from "@/data/mapping";
export const Route = createFileRoute("/mapping")({
  head: () => ({ meta: [{ title: "Data Mapping Report | SiloVerse" }, { name: "description", content: "Workbook to schema mapping with confirmed, proposed and unmapped fields." }, { property: "og:title", content: "Data Mapping Report | SiloVerse" }, { property: "og:description", content: "Workbook-to-schema mapping report." }] }),
  component: () => (
    <div className="mx-auto max-w-6xl">
      <SectionHeader code="—" title="Data mapping report" />
      <h2 className="display mb-2 text-2xl">Needs your confirmation</h2>
      <ul className="mb-6 list-disc pl-5 text-sm">{openQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
      <h2 className="display mb-2 text-2xl">Data-quality notes</h2>
      <ul className="mb-6 list-disc pl-5 text-sm">{dataQualityNotes.map((q) => <li key={q}>{q}</li>)}</ul>
      <table className="w-full text-left text-sm"><thead><tr className="meta"><th>Sheet.Column</th><th>Schema</th><th>Status</th><th>Note</th></tr></thead>
        <tbody>{fieldMappings.map((m, i) => <tr key={i} className="border-t border-border"><td className="py-1">{m.sheet}.{m.column}</td><td>{m.table}.{m.schemaColumn}</td><td>{m.status}</td><td className="text-muted-foreground">{m.note}</td></tr>)}</tbody></table>
    </div>
  ),
});
