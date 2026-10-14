import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { SECTIONS } from "./sections";
import { useSiloTheme } from "./theme";
import { SiloGuide } from "./SiloGuide";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = SECTIONS.find((s) => s.to === path);
  const { theme, toggle } = useSiloTheme();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="About Consilio sections" className="flex flex-col gap-0.5">
      {SECTIONS.map((s) => {
        const active = s.to === path;
        return (
          <Link
            key={s.to}
            to={s.to}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active ? "bg-beacon-soft text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span className={cn("font-mono text-[0.65rem]", active ? "text-beacon" : "text-muted-foreground")}>{s.code}</span>
            <span className="flex-1">{s.label}</span>
            {active && <span className="h-1.5 w-1.5 rounded-full bg-beacon beacon-glow" aria-hidden />}
          </Link>
        );
      })}
      <Link
        to="/mapping"
        onClick={() => setOpen(false)}
        className={cn("mt-4 rounded-lg px-3 py-2 text-xs", path === "/mapping" ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
      >
        Data mapping report
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-panel-strong p-5 backdrop-blur lg:flex">
        <Brand />
        <div className="mt-8 flex-1 overflow-y-auto">{nav}</div>
        <SiloGuide section={current?.label ?? "Mapping"} />
      </aside>

      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-panel-strong/90 px-4 py-3 backdrop-blur lg:ml-64 lg:px-8">
        <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <ol className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <li className="meta hidden sm:block">SiloVerse</li>
          <li className="meta hidden sm:block" aria-hidden>/</li>
          <li><Link to="/" className="text-muted-foreground hover:text-foreground">About Consilio</Link></li>
          {current && current.to !== "/" && (
            <>
              <li className="text-muted-foreground" aria-hidden>/</li>
              <li className="text-foreground" aria-current="page">{current.label}</li>
            </>
          )}
          {path === "/mapping" && (
            <>
              <li className="text-muted-foreground" aria-hidden>/</li>
              <li className="text-foreground">Data mapping</li>
            </>
          )}
        </ol>
        <button
          onClick={toggle}
          className="ml-auto inline-flex items-center gap-2 rounded-full border border-input px-3 py-1.5 text-xs text-foreground hover:border-beacon"
          aria-label={`Switch to ${theme === "og" ? "SiloVerse Light" : "OG SiloVerse"} theme`}
        >
          {theme === "og" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          {theme === "og" ? "SiloVerse Light" : "OG SiloVerse"}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-background/70" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72 bg-panel-strong p-5">
            <div className="flex items-center justify-between">
              <Brand />
              <button onClick={() => setOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-8">{nav}</div>
          </div>
        </div>
      )}

      <main className="px-4 py-8 lg:ml-64 lg:px-10 lg:py-10">{children}</main>
      <footer className="px-4 pb-8 text-xs text-muted-foreground lg:ml-64 lg:px-10">
        Prototype content is sourced from the provided Consilio workbook and is not live-connected to the database.
      </footer>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-beacon/50" />
        <span className="h-2 w-2 rounded-full bg-beacon beacon-glow animate-pulse-soft" />
      </span>
      <span>
        <span className="display block text-lg leading-none">SiloVerse</span>
        <span className="meta">World 01 · Origin</span>
      </span>
    </Link>
  );
}
