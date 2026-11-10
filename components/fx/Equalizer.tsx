import { cn } from "@/lib/cn";

/** Visual-only equalizer + subwoofer pulse. No sound, ever. Pure CSS animation. */
export function Equalizer({ className }: { className?: string }) {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    d: (0.55 + ((i * 37) % 11) / 14).toFixed(2),
    delay: (((i * 53) % 17) / 20).toFixed(2),
  }));
  return (
    <div className={cn("relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-carbon p-6 ring-1 ring-white/10 sm:grid-cols-[auto_1fr] sm:p-10", className)} aria-hidden>
      <div className="relative mx-auto h-48 w-48 sm:h-56 sm:w-56">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#1d1e22_0%,#0b0b0d_70%)] ring-8 ring-graphite" />
        <div className="absolute inset-[14%] animate-[sub-thump_0.94s_ease-out_infinite] rounded-full bg-[radial-gradient(circle_at_40%_35%,#3a3c42,#0d0d10_60%)] shadow-[0_0_50px_-10px_rgb(227_25_31/0.6)] ring-2 ring-black">
          <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle_at_40%_35%,#55585f,#16171a)] ring-1 ring-white/10" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="absolute h-2.5 w-2.5 rounded-full bg-chrome/60" style={{ top: `${50 + Math.sin(i * 1.57) * 46}%`, left: `${50 + Math.cos(i * 1.57) * 46}%`, transform: "translate(-50%,-50%)" }} />
        ))}
      </div>
      <div className="flex h-40 items-end gap-[3px] sm:h-52 sm:gap-1">
        {bars.map((b, i) => (
          <span
            key={i}
            className="block flex-1 origin-bottom rounded-t-sm bg-gradient-to-t from-red-deep via-red to-[#ff8a8d]"
            style={{ height: "100%", animation: `eq ${b.d}s ${b.delay}s ease-in-out infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
