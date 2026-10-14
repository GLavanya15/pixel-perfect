import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X } from "lucide-react";
import { SECTIONS } from "./sections";
import { useSiloTheme } from "./theme";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = SECTIONS.find((s) => s.to === path);
  const { theme, toggle } = useSiloTheme();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("siloverse-nav") === "collapsed");
  }, []);
  const toggleCollapsed = () => {
    setCollapsed((c) => {
      localStorage.setItem("siloverse-nav", c ? "expanded" : "collapsed");
      return !c;
    });
  };

  const nav = (compact: boolean) => (
    <nav aria-label="Sections" className="flex flex-col gap-1">
      {SECTIONS.map((s) => {
        const active = s.to === path;
        const Icon = s.icon;
        return (
          <Link
            key={s.to}
            to={s.to}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            aria-label={compact ? s.label : undefined}
            title={compact ? s.label : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
              compact && "justify-center px-0",
              active ? "bg-beacon-soft font-medium text-beacon" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {!compact && <span className="truncate">{s.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-panel-strong py-4 transition-[width] duration-200 lg:flex",
          collapsed ? "w-16 px-2" : "w-60 px-3",
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between px-1")}>
          {!collapsed && <Brand />}
          <button
            onClick={toggleCollapsed}
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-6 flex-1 overflow-y-auto">{nav(collapsed)}</div>
      </aside>

      <div className={cn("transition-[margin] duration-200", collapsed ? "lg:ml-16" : "lg:ml-60")}>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-panel-strong px-4 backdrop-blur lg:px-8">
          <button className="-ml-2 rounded-md p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <span className="lg:hidden"><Brand /></span>
          <ol className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex" aria-label="Breadcrumb">
            <li><Link to="/" className={cn(path === "/" ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}>Consilio</Link></li>
            {current && current.to !== "/" && (
              <>
                <li aria-hidden><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></li>
                <li className="truncate font-medium text-foreground" aria-current="page">{current.label}</li>
              </>
            )}
          </ol>
          <button
            onClick={toggle}
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-input px-3 text-xs font-medium text-foreground hover:bg-muted"
            aria-label={`Switch to ${theme === "og" ? "light" : "dark"} theme`}
          >
            {theme === "og" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{theme === "og" ? "Light" : "Dark"}</span>
          </button>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-background/70 backdrop-blur-sm" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72 max-w-[85vw] bg-panel-strong p-4 shadow-2xl animate-rise">
            <div className="flex items-center justify-between">
              <Brand />
              <button className="rounded-md p-2" onClick={() => setOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6">{nav(false)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-beacon text-xs font-bold text-primary-foreground">C</span>
      <span className="text-sm font-semibold text-foreground">Consilio</span>
    </Link>
  );
}
