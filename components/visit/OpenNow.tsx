"use client";

import { useEffect, useState } from "react";
import { business, hours } from "@/content/site";
import { nowFromSearch, openStatus, type OpenStatus } from "@/lib/time";
import { cn } from "@/lib/cn";

/** Live "Open now / Closed" badge, computed in Eastern time in the visitor's browser. */
export function OpenNow({ className }: { className?: string }) {
  const [s, setS] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const tick = () => setS(openStatus(nowFromSearch(window.location.search), hours, business.timezone));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className={cn("inline-flex min-h-9 items-center gap-2.5 rounded-full bg-white/5 px-4 py-1.5 text-sm ring-1 ring-white/10", className)} aria-live="polite">
      <span
        aria-hidden
        className={cn("h-2.5 w-2.5 rounded-full", !s ? "bg-white/30" : s.open ? "animate-[pulse-dot_1.8s_infinite] bg-igl text-igl/50" : "bg-red")}
      />
      {s ? (
        <>
          <span className={cn("font-extrabold", s.open ? "text-igl-text" : "text-red-text")}>{s.label}</span>
          <span className="text-muted">{s.detail}</span>
        </>
      ) : (
        <span className="text-muted">Checking shop hours…</span>
      )}
    </p>
  );
}
