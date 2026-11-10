"use client";

import { track } from "@vercel/analytics";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Site-wide client behaviour, in one small component:
 *  - Lenis smooth scrolling (desktop, motion allowed)
 *  - scroll reveals for [data-reveal]
 *  - hex cursor follower (fine pointers only)
 *  - analytics events for any element with data-track="…"
 */
export function Effects() {
  const pathname = usePathname();
  const lenisRef = useRef<{ scrollTo: (t: number | string | HTMLElement, o?: object) => void; destroy: () => void } | null>(null);

  // Smooth scroll
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;
    let raf = 0;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.1, anchors: { offset: -90 }, autoRaf: false });
      lenisRef.current = lenis;
      (window as unknown as { __lenis?: typeof lenis }).__lenis = lenis; // lets the logo scroll to top smoothly
      const loop = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenisRef.current?.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, []);

  // Reveal on scroll (re-scan on every route)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.revealDelay ?? 0);
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-in");
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Analytics click events
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const name = el.dataset.track!;
      track(name, { page: location.pathname, href: el.getAttribute("href") ?? "" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return <CursorHex />;
}

function CursorHex() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current!;
    let x = -100,
      y = -100,
      tx = -100,
      ty = -100,
      raf = 0,
      active = false;
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const t = e.target as HTMLElement;
      const hot = !!t.closest("a,button,[role=button],input,select,textarea,label");
      if (hot !== active) {
        active = hot;
        el.dataset.hot = hot ? "1" : "";
      }
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="group/cursor pointer-events-none fixed top-0 left-0 z-[70] hidden opacity-0 transition-opacity duration-300 [@media(pointer:fine)]:block"
    >
      <svg
        width="34"
        height="30"
        viewBox="0 0 34 30"
        className="-translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out group-data-[hot=1]/cursor:scale-150"
      >
        <path d="M8.5 1h17L33 15l-7.5 14h-17L1 15z" fill="rgb(227 25 31 / 0.08)" stroke="rgb(255 90 95 / 0.9)" strokeWidth="1.2" />
        <circle cx="17" cy="15" r="1.6" fill="#fff" />
      </svg>
    </div>
  );
}
