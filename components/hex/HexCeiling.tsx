import { cn } from "@/lib/cn";

/**
 * The shop's hexagon LED ceiling, drawn as SVG light tubes.
 * Cells "power on" with a staggered CSS flicker (no JS needed).
 * Deterministic layout (seeded), so server + client render identically.
 */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type Cell = { cx: number; cy: number; delay: number; dist: number };

export function buildCells({ cols, rows, r, seed = 7, shape = "cluster" }: { cols: number; rows: number; r: number; seed?: number; shape?: "cluster" | "full" }) {
  const rand = seeded(seed);
  const w = 1.5 * r;
  const h = Math.sqrt(3) * r;
  const cells: Cell[] = [];
  const midC = (cols - 1) / 2;
  const midR = (rows - 1) / 2;
  for (let c = 0; c < cols; c++) {
    for (let rr = 0; rr < rows; rr++) {
      const cx = r + c * w;
      const cy = h / 2 + rr * h + (c % 2 ? h / 2 : 0);
      const dx = (c - midC) / (cols / 2);
      const dy = (rr - midR) / (rows / 2);
      const dist = Math.sqrt(dx * dx + dy * dy * 1.3);
      // Organic, wave-edged cluster like the real install
      if (shape === "cluster" && dist + Math.sin(c * 0.9) * 0.12 + rand() * 0.18 > 1.02) continue;
      cells.push({ cx, cy, dist, delay: 0 });
    }
  }
  // Power on from the middle outwards, with jitter
  for (const cell of cells) cell.delay = Math.round(cell.dist * 650 + rand() * 380);
  return { cells, width: r * 2 + (cols - 1) * w, height: h * rows + h / 2 };
}

export function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
}

export function HexCeiling({
  className,
  cols = 15,
  rows = 6,
  r = 46,
  seed = 7,
  baseDelay = 120,
  shape = "cluster",
  flickerOut = false,
}: {
  className?: string;
  cols?: number;
  rows?: number;
  r?: number;
  seed?: number;
  baseDelay?: number;
  shape?: "cluster" | "full";
  flickerOut?: boolean;
}) {
  const { cells, width, height } = buildCells({ cols, rows, r, seed, shape });
  const tube = r * 0.9;
  return (
    <svg
      viewBox={`0 0 ${width.toFixed(0)} ${height.toFixed(0)}`}
      className={cn(flickerOut && "hex-out", className)}
      aria-hidden
      focusable="false"
    >
      {cells.map((c, i) => (
        <g key={i} className="hex-cell" style={{ animationDelay: `${baseDelay + c.delay}ms` }}>
          <path d={hexPath(c.cx, c.cy, tube)} fill="none" stroke="#dfe8ff" strokeOpacity="0.14" strokeWidth={r * 0.32} strokeLinejoin="round" />
          <path d={hexPath(c.cx, c.cy, tube)} fill="none" stroke="#ffffff" strokeOpacity="0.95" strokeWidth={r * 0.07} strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

/** The hex ceiling in perspective, fading out toward the content. Used as a section background. */
export function CeilingBackdrop({ seed = 7, flickerOut = false, baseDelay = 120, className }: { seed?: number; flickerOut?: boolean; baseDelay?: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-0 -z-10 h-[340px] overflow-hidden [perspective:700px] sm:h-[460px] lg:h-[540px]", className)}
      style={{ maskImage: "linear-gradient(180deg,#000 8%,rgb(0 0 0/.45) 42%,transparent 88%)", WebkitMaskImage: "linear-gradient(180deg,#000 8%,rgb(0 0 0/.45) 42%,transparent 88%)" }}
    >
      <div className="absolute top-0 left-1/2 w-[190%] origin-top [transform:translateX(-50%)_rotateX(52deg)] sm:w-[150%] lg:w-[125%]">
        <HexCeiling className="h-auto w-full opacity-70" cols={19} rows={7} r={40} seed={seed} flickerOut={flickerOut} baseDelay={baseDelay} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgb(200_215_255/0.16),transparent_70%)]" />
    </div>
  );
}
