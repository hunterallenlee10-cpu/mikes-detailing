"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Starfield, UnderglowCar } from "./CarScene";

/** "Lights On" toggle: flips the section from dark to full LowGlow neon. Auto-flips once when first seen. */
export function LightsOn() {
  const [on, setOn] = useState(false);
  const touched = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !touched.current) {
          const t = setTimeout(() => !touched.current && setOn(true), 900);
          io.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.55 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-[2rem] ring-1 transition-colors duration-1000",
        on ? "bg-[#0d0820] ring-violet/40" : "bg-carbon ring-white/10",
      )}
    >
      {/* starlight headliner */}
      <div className="relative h-36 overflow-hidden border-b border-white/5 sm:h-44">
        <div className={cn("absolute inset-0 transition-opacity duration-1000", on ? "opacity-100" : "opacity-0")} style={{ background: "radial-gradient(80% 120% at 50% 0%, rgb(76 29 149 / .55), transparent 70%)" }} />
        <Starfield on={on} count={110} />
        <p className="absolute top-4 left-5 eyebrow text-white/70">Starlight headliner</p>
      </div>
      {/* car + underglow */}
      <div className="relative px-4 pt-10 pb-8 sm:px-10">
        <div
          aria-hidden
          className={cn("absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-1000", on ? "opacity-100" : "opacity-0")}
          style={{ background: "radial-gradient(60% 70% at 50% 100%, rgb(34 211 238 / .25), rgb(139 92 246 / .15) 50%, transparent 75%)" }}
        />
        <UnderglowCar lit={on} className="mx-auto max-w-2xl" />
        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow text-white/70">Exterior underglow · ambient · rock lights</p>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => {
              touched.current = true;
              setOn((v) => !v);
            }}
            className={cn(
              "group inline-flex min-h-12 items-center gap-3 rounded-full py-2 pr-5 pl-2 font-extrabold text-white ring-1 transition",
              on ? "bg-gradient-to-r from-cyan/25 via-violet/30 to-magenta/25 ring-magenta/50" : "bg-white/5 ring-white/15",
            )}
          >
            <span className={cn("relative h-7 w-12 rounded-full transition-colors", on ? "bg-gradient-to-r from-cyan via-violet to-magenta" : "bg-white/15")}>
              <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-6" : "left-1")} />
            </span>
            Lights {on ? "On" : "Off"}
          </button>
        </div>
      </div>
    </div>
  );
}
