import { useEffect, useRef, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, Search, X, type LucideIcon } from "lucide-react";
import type { Evidence } from "@/data/about";
import { initials } from "@/data/present";
import { cn } from "@/lib/utils";

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "beacon" | "outline" | undefined }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tone === "default" && "bg-muted text-muted-foreground",
        tone === "beacon" && "bg-beacon-soft text-beacon",
        tone === "outline" && "border border-border text-foreground",
      )}
    >
      {children}
    </span>
  );
}

/** Compact page header with back action. */
export function PageHeader({ title, description, actions }: { title: string; description?: string | undefined; actions?: ReactNode }) {
  const router = useRouter();
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 animate-rise">
      <div className="min-w-0">
        <button
          onClick={() => (window.history.length > 1 ? router.history.back() : router.navigate({ to: "/" }))}
          className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </header>
  );
}
/** @deprecated kept for the internal mapping report */
export const SectionHeader = ({ title, statement }: { code?: string; title: string; statement?: string }) => <PageHeader title={title} description={statement} />;

/** Large value, muted label below. */
export function Stat({ value, label, sub, className }: { value: ReactNode; label: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {sub && <div className="mt-2">{sub}</div>}
    </div>
  );
}

export function StatCard({ value, label, sub }: { value: ReactNode; label: ReactNode; sub?: ReactNode }) {
  return <div className="panel p-5"><Stat value={value} label={label} sub={sub} /></div>;
}

/** Fully clickable overview card with title, icon and right-aligned action. */
export function PreviewCard({ to, icon: Icon, title, action = "View more", className, children }: { to: string; icon: LucideIcon; title: string; action?: string; className?: string; children: ReactNode }) {
  return (
    <Link to={to} className={cn("panel panel-interactive group flex flex-col p-5", className)}>
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-beacon-soft text-beacon"><Icon className="h-4 w-4" aria-hidden /></span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-beacon">
          {action} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
      <div className="flex-1">{children}</div>
    </Link>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-beacon-soft font-semibold text-beacon",
        size === "sm" && "h-8 w-8 text-xs",
        size === "md" && "h-11 w-11 text-sm",
        size === "lg" && "h-14 w-14 text-base",
      )}
    >
      {initials(name)}
    </span>
  );
}

export function Field({ label, value, children }: { label: string; value?: ReactNode | undefined; children?: ReactNode | undefined }) {
  const v = children ?? value;
  if (v === undefined || v === null || v === "") return null;
  return (
    <div>
      <dd className="text-base font-medium text-foreground">{v}</dd>
      <dt className="mt-0.5 text-xs text-muted-foreground">{label}</dt>
    </div>
  );
}

/** Shows the public reference link only. */
export function EvidenceBlock({ e }: { e: Evidence }) {
  if (!e.source?.sourceUrl) return null;
  return (
    <a href={e.source.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
      Reference: {e.source.sourceName} <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
    </a>
  );
}

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
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="relative h-full w-full max-w-lg overflow-y-auto bg-popover p-6 shadow-2xl animate-rise outline-none sm:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-md p-2 text-muted-foreground hover:text-foreground" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        {kicker && <p className="text-xs font-medium text-beacon">{kicker}</p>}
        {title && <h2 className="mt-1 pr-8 text-2xl font-semibold tracking-tight">{title}</h2>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="relative flex min-w-0 flex-1 basis-56 items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground"
      />
    </label>
  );
}

export function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: (string | number)[] }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 max-w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground">
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
    <div className="panel mb-6 flex flex-wrap items-end gap-3 p-4">
      {children}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-muted-foreground" aria-live="polite">Showing {count} of {total}</span>
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
      <p className="text-muted-foreground">Nothing matches these filters.</p>
      <button onClick={onReset} className="mt-3 text-sm text-primary underline">Clear filters</button>
    </div>
  );
}

export const matches = (q: string, ...xs: (string | number | undefined)[]) =>
  !q || xs.some((x) => x !== undefined && String(x).toLowerCase().includes(q.toLowerCase()));
