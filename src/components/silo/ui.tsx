import { useEffect, useRef, type ReactNode } from "react";
import { CheckCircle2, CircleDashed, CircleAlert, CircleSlash, ExternalLink, Search, X } from "lucide-react";
import type { Evidence, VerificationStatusName } from "@/data/about";
import { cn } from "@/lib/utils";

const STATUS: Record<VerificationStatusName, { icon: typeof CheckCircle2; cls: string }> = {
  Verified: { icon: CheckCircle2, cls: "text-status-verified" },
  "Partially verified": { icon: CircleDashed, cls: "text-status-partial" },
  Unverified: { icon: CircleAlert, cls: "text-status-unverified" },
  "Not Available": { icon: CircleSlash, cls: "text-status-na" },
};

/** Verification badge — icon + text label, never colour alone. */
export function StatusBadge({ status, className }: { status?: VerificationStatusName | undefined; className?: string  | undefined}) {
  if (!status) return null;
  const s = STATUS[status];
  const Icon = s.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-current/30 px-2 py-0.5 text-[0.7rem] font-medium", s.cls, className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {status}
    </span>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "beacon" | "warn"  | undefined}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[0.7rem] font-medium",
        tone === "default" && "bg-muted text-muted-foreground",
        tone === "beacon" && "bg-beacon-soft text-beacon",
        tone === "warn" && "border border-status-unverified/40 text-status-unverified",
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({ code, title, statement, children }: { code: string; title: string; statement?: string | undefined; children?: ReactNode  | undefined}) {
  return (
    <header className="mb-8 animate-rise">
      <p className="meta">About Consilio · Sector {code}</p>
      <h1 className="display mt-2 text-4xl text-foreground md:text-5xl">{title}</h1>
      {statement && <p className="mt-3 max-w-2xl text-muted-foreground">{statement}</p>}
      {children}
    </header>
  );
}

export function Field({ label, value, children }: { label: string; value?: ReactNode | undefined; children?: ReactNode  | undefined}) {
  const v = children ?? value;
  if (v === undefined || v === null || v === "") return null;
  return (
    <div>
      <dt className="meta">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{v}</dd>
    </div>
  );
}

export function EvidenceBlock({ e }: { e: Evidence }) {
  if (!e.verificationStatus && !e.source && !e.lastVerifiedDate) return null;
  return (
    <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
      <p className="meta mb-3">Evidence</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Field label="Verification status">{e.verificationStatus && <StatusBadge status={e.verificationStatus} />}</Field>
        <Field label="Last verified" value={e.lastVerifiedDate} />
        <div className="sm:col-span-2">
          <Field label="Source">
            {e.source &&
              (e.source.sourceUrl ? (
                <a href={e.source.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-start gap-1 text-primary underline-offset-2 hover:underline">
                  {e.source.sourceName} <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                </a>
              ) : (
                e.source.sourceName
              ))}
          </Field>
        </div>
      </dl>
      {!e.source && <p className="mt-2 text-xs text-muted-foreground">No source document recorded in the workbook.</p>}
    </div>
  );
}

/** Accessible slide-over detail panel. */
export function DetailPanel({ open, onClose, title, kicker, children }: { open: boolean; onClose: () => void; title?: string | undefined; kicker?: string | undefined; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    ref.current?.focus();
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close details" className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="relative h-full w-full max-w-xl overflow-y-auto bg-panel-strong p-8 shadow-2xl animate-rise outline-none">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground hover:text-foreground" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        {kicker && <p className="meta">{kicker}</p>}
        {title && <h2 className="display mt-2 pr-8 text-3xl">{title}</h2>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative flex min-w-56 flex-1 items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-input bg-panel pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
      />
    </label>
  );
}

export function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: (string | number)[] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="meta">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-lg border border-input bg-panel px-3 text-sm text-foreground">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={String(o)}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ children, count, total, onReset, active }: { children: ReactNode; count: number; total: number; onReset: () => void; active: boolean }) {
  return (
    <div className="panel mb-6 flex flex-wrap items-end gap-4 p-4">
      {children}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {count} of {total} records
        </span>
        <button onClick={onReset} disabled={!active} className="h-10 rounded-lg border border-input px-3 text-sm text-foreground disabled:opacity-40">
          Reset
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="panel p-10 text-center">
      <p className="text-muted-foreground">No records match these filters.</p>
      <button onClick={onReset} className="mt-3 text-sm text-primary underline">Clear filters</button>
    </div>
  );
}

export const matches = (q: string, ...xs: (string | number | undefined)[]) =>
  !q || xs.some((x) => x !== undefined && String(x).toLowerCase().includes(q.toLowerCase()));
