"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { processSteps } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Pinned scroll story: the visual panel sticks while the six steps scroll past.
 * Photos are passed in pre-rendered from the server (so they stay optimized).
 */
export function ProcessTimeline({ visuals }: { visuals: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const progress = ((active + 1) / processSteps.length) * 100;

  return (
    <div className="relative grid gap-8 md:grid-cols-2 md:gap-16">
      {/* Sticky visual */}
      <div className="sticky top-20 z-10 h-[40vh] md:top-28 md:h-[calc(100vh-9rem)]">
        <div className="relative h-full overflow-hidden rounded-[2rem] bg-carbon ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
          {visuals.map((v, i) => (
            <div
              key={i}
              aria-hidden={i !== active}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
                i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
              )}
            >
              {v}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-jet/90 via-jet/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-7">
            <div>
              <p className="eyebrow text-red-text">Step {String(active + 1).padStart(2, "0")} / 06</p>
              <p className="font-wide mt-1 text-xl font-black text-white uppercase sm:text-3xl" aria-live="polite">
                {processSteps[active].title}
              </p>
            </div>
          </div>
          <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
            <div className="h-full bg-red transition-[width] duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol className="relative">
        <span aria-hidden className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-gradient-to-b from-red via-white/15 to-transparent" />
        {processSteps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-index={i}
            className="relative flex min-h-[46vh] gap-5 py-6 md:min-h-[62vh] md:items-center"
          >
            <span
              className={cn(
                "hex-clip relative z-10 flex h-10 w-[2.35rem] shrink-0 items-center justify-center text-sm font-black transition-colors duration-500",
                i <= active ? "bg-red text-white" : "bg-graphite text-muted",
              )}
            >
              {i + 1}
            </span>
            <div className={cn("transition-opacity duration-500", i === active ? "opacity-100" : "opacity-55")}>
              <h3 className="text-2xl font-black text-white uppercase sm:text-4xl">{s.title}</h3>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-chrome/85">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
