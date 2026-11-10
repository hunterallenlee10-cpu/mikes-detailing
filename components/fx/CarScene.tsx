import { cn } from "@/lib/cn";

/** Original sports-car side silhouette (drawn for this site — not any brand's artwork). */
export function CarSilhouette({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 620 190" className={className} aria-hidden>
      <defs>
        <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2c31" />
          <stop offset=".55" stopColor="#0e0f12" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b1d22" />
          <stop offset=".6" stopColor="#3a3f4a" />
          <stop offset="1" stopColor="#14161a" />
        </linearGradient>
      </defs>
      <path
        d="M36 140C26 128 28 110 42 101L116 89C168 68 228 46 306 40C356 36 396 41 426 55L474 82C516 88 566 95 588 109C600 117 600 133 592 142L528 144A50 50 0 0 0 428 144L198 144A50 50 0 0 0 98 144Z"
        fill="url(#car-body)"
        stroke={lit ? "rgb(232 121 249 / .7)" : "rgb(255 255 255 / .18)"}
        strokeWidth="1.5"
        style={{ transition: "stroke .8s" }}
      />
      <path d="M164 90C214 66 262 56 312 54C352 53 382 58 406 68L432 86Z" fill="url(#car-glass)" opacity=".9" />
      <path d="M300 54L296 88" stroke="#0a0a0b" strokeWidth="5" />
      <path d="M52 108L120 98M470 92L560 104" stroke="rgb(255 255 255 / .22)" strokeWidth="1.5" strokeLinecap="round" />
      {/* lights */}
      <path d="M560 106L590 114" stroke={lit ? "#e0f7ff" : "#888"} strokeWidth="4" strokeLinecap="round" style={{ transition: "stroke .6s" }} />
      <path d="M34 110L46 106" stroke="#e3191f" strokeWidth="5" strokeLinecap="round" />
      {[148, 478].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="144" r="40" fill="#08080a" stroke="#2b2d33" strokeWidth="3" />
          <circle cx={cx} cy="144" r="26" fill="none" stroke={lit ? "rgb(34 211 238 / .85)" : "#5c6068"} strokeWidth="2.5" style={{ transition: "stroke .8s" }} />
          {Array.from({ length: 5 }).map((_, i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <path
                key={i}
                d={`M${cx} 144L${(cx + Math.cos(a) * 25).toFixed(1)} ${(144 + Math.sin(a) * 25).toFixed(1)}`}
                stroke="#6b7079"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={cx} cy="144" r="5" fill="#c9ccd1" />
        </g>
      ))}
    </svg>
  );
}

/** Car + animated LowGlow underglow. */
export function UnderglowCar({ lit, className }: { lit: boolean; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-[4%] bottom-[2%] h-[38%] rounded-[50%] blur-2xl transition-opacity duration-700",
          lit ? "animate-[glow-cycle_6s_linear_infinite] opacity-100" : "opacity-0",
        )}
        style={{ background: "radial-gradient(closest-side, rgb(34 211 238 / .95), rgb(139 92 246 / .75) 55%, rgb(232 121 249 / 0) 100%)" }}
      />
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-[10%] bottom-[-6%] h-[22%] rounded-[50%] blur-xl transition-opacity duration-700",
          lit ? "animate-[glow-cycle_6s_linear_infinite] opacity-90" : "opacity-0",
        )}
        style={{ background: "radial-gradient(closest-side, rgb(232 121 249 / .9), rgb(139 92 246 / 0))" }}
      />
      <CarSilhouette lit={lit} className="relative w-full" />
    </div>
  );
}

/** Starlight headliner — deterministic star field that twinkles. */
export function Starfield({ count = 90, className, on = true }: { count?: number; className?: string; on?: boolean }) {
  let s = 11;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-1000", on ? "opacity-100" : "opacity-0", className)}>
      {Array.from({ length: count }).map((_, i) => {
        const size = 1 + rand() * 2.2;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(rand() * 100).toFixed(2)}%`,
              top: `${(rand() * 100).toFixed(2)}%`,
              width: size,
              height: size,
              boxShadow: `0 0 ${(size * 3).toFixed(1)}px rgb(${rand() > 0.6 ? "196 181 253" : "255 255 255"} / .9)`,
              animation: `twinkle ${(2 + rand() * 3).toFixed(2)}s ${(rand() * 3).toFixed(2)}s ease-in-out infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
