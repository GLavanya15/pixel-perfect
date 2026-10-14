import { Link } from "@tanstack/react-router";
import { SECTIONS } from "./sections";

/**
 * The Origin Core / Beacon. Each orbiting node is a real navigation
 * destination (one per About section). Pure SVG — no 3D dependency, so it
 * degrades gracefully; the sidebar provides the same navigation.
 */
export function OriginScene({ counts }: { counts: Record<string, string> }) {
  const nodes = SECTIONS.filter((s) => s.to !== "/");
  const cx = 500, cy = 330, rx = 400, ry = 130;
  return (
    <div className="relative w-full" aria-label="Origin spatial navigation">
      <svg viewBox="0 0 1000 560" className="w-full" role="presentation">
        <defs>
          <linearGradient id="mono" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--beacon)" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="var(--beacon)" stopOpacity="0.25" />
            <stop offset="1" stopColor="var(--beacon)" stopOpacity="0.05" />
          </linearGradient>
          <radialGradient id="halo">
            <stop offset="0" stopColor="var(--beacon)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--beacon)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* vertical light structures */}
        {[120, 230, 770, 880].map((x, i) => (
          <line key={x} x1={x} x2={x} y1={40 + i * 10} y2={430} stroke="var(--structure)" strokeWidth="1" strokeDasharray="2 6" />
        ))}
        {/* sparse particles */}
        {Array.from({ length: 28 }).map((_, i) => (
          <circle key={i} cx={(i * 137) % 1000} cy={(i * 71) % 300 + 20} r={i % 3 === 0 ? 1.4 : 0.8} fill="var(--beacon)" opacity={0.25 + (i % 4) * 0.1} className={i % 5 === 0 ? "animate-pulse-soft" : undefined} />
        ))}
        <ellipse cx={cx} cy={cy} rx={300} ry={200} fill="url(#halo)" />
        {/* platform */}
        <ellipse cx={cx} cy={cy + 110} rx={260} ry={44} fill="var(--beacon-soft)" stroke="var(--structure)" />
        <ellipse cx={cx} cy={cy + 110} rx={190} ry={30} fill="none" stroke="var(--structure)" />
        <ellipse cx={cx} cy={cy + 110} rx={110} ry={17} fill="none" stroke="var(--beacon)" strokeOpacity="0.5" />
        {/* orbital rings */}
        <g className="animate-orbit-slow"><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="var(--structure)" strokeDasharray="1 8" /></g>
        <ellipse cx={cx} cy={cy} rx={rx - 90} ry={ry - 34} fill="none" stroke="var(--structure)" />
        {/* monolith */}
        <g className="beacon-glow">
          <polygon points={`${cx - 34},${cy + 110} ${cx - 22},${cy - 190} ${cx},${cy - 215} ${cx + 22},${cy - 190} ${cx + 34},${cy + 110}`} fill="url(#mono)" stroke="var(--beacon)" strokeOpacity="0.6" />
          <line x1={cx} x2={cx} y1={cy - 215} y2={cy + 110} stroke="var(--beacon)" strokeOpacity="0.8" />
          <circle cx={cx} cy={cy - 140} r="5" fill="var(--beacon)" className="animate-pulse-soft" />
        </g>
      </svg>
      {/* nodes as accessible links positioned over the orbit */}
      {nodes.map((n, i) => {
        const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + rx * Math.cos(a);
        const y = cy + ry * Math.sin(a);
        return (
          <Link
            key={n.to}
            to={n.to}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center"
            style={{ left: `${(x / 1000) * 100}%`, top: `${(y / 560) * 100}%` }}
          >
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-beacon transition-transform group-hover:scale-150 group-focus-visible:scale-150" />
              <span className="h-1.5 w-1.5 rounded-full bg-beacon" />
            </span>
            <span className="rounded-md bg-panel-strong/80 px-2 py-1 backdrop-blur">
              <span className="block whitespace-nowrap text-[0.7rem] font-medium text-foreground md:text-xs">{n.label}</span>
              {counts[n.to] && <span className="meta block text-[0.6rem]">{counts[n.to]}</span>}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
