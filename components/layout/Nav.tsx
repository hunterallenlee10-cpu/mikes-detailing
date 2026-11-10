"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business, links, nav, services } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon, ChevronIcon, CloseIcon, MenuIcon, PhoneIcon } from "../icons";

const serviceLinks = services.map((s) => ({ href: `/${s.slug}`, label: s.name, blurb: s.card, accent: s.accent }));

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const pathname = usePathname();
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAt = useRef(0);
  const megaBtn = useRef<HTMLButtonElement>(null);

  // Hover intent: open right away, close after a short pause so the cursor can cross the gap.
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!mega) hoverOpenedAt.current = Date.now();
    setMega(true);
  };
  // A click right after hover-opening shouldn't snap it shut; otherwise click toggles.
  const clickMega = () => setMega((v) => (Date.now() - hoverOpenedAt.current < 700 ? true : !v));
  const closeMegaSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMega(false), 160);
  };

  // Close the Services menu on an outside click/tap.
  useEffect(() => {
    if (!mega) return;
    const onDown = (e: PointerEvent) => {
      if (!megaRef.current?.contains(e.target as Node)) setMega(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [mega]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMega((wasOpen) => {
          if (wasOpen && megaRef.current?.contains(document.activeElement)) megaBtn.current?.focus();
          return false;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top)+0.6rem)] sm:px-5">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-[1320px] items-center justify-between gap-4 rounded-2xl py-2 pr-2 pl-3 transition-all duration-500 ring-inset",
          scrolled || open ? "glass shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/10" : "ring-1 ring-transparent",
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={`${business.name} — back to top`}
          onClick={(e) => {
            // Already on the home page: glide back to the top instead of doing nothing.
            if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            if (location.hash) history.replaceState(null, "", "/");
            const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
            if (lenis) lenis.scrollTo(0, { duration: 1.2 });
            else window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-320.webp" alt="" width={320} height={239} className="h-12 w-auto sm:h-14" />
          <span className="sr-only">{business.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 rounded-full bg-black/70 p-1.5 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.9)] ring-1 ring-white/15 backdrop-blur-md lg:flex">
          <div
            className="relative"
            ref={megaRef}
            onMouseEnter={openMega}
            onMouseLeave={closeMegaSoon}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMega(false);
            }}
          >
            <button
              type="button"
              aria-expanded={mega}
              aria-controls="mega-menu"
              ref={megaBtn}
              onClick={clickMega}
              className={cn("flex items-center gap-1.5 rounded-full px-5 py-2.5 text-base font-extrabold tracking-wide text-white transition-colors hover:bg-white/10", mega && "bg-white/10")}
            >
              Services <ChevronIcon size={18} className={cn("text-red-text transition-transform", mega && "rotate-180")} />
            </button>
            <div
              id="mega-menu"
              className={cn(
                "absolute top-full left-1/2 w-[760px] -translate-x-1/2 pt-3 transition-all duration-300",
                mega ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
              )}
            >
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#0e0e10] p-2 ring-1 ring-white/12 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.95),0_0_0_1px_rgb(0_0_0/0.6)]">
                {serviceLinks.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group/item flex gap-3 rounded-xl p-3.5 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "hex-clip mt-0.5 h-7 w-8 shrink-0 transition-colors",
                        s.accent === "igl" ? "bg-igl/70" : s.accent === "neon" ? "bg-gradient-to-r from-cyan via-violet to-magenta" : "bg-red/80",
                      )}
                    />
                    <span>
                      <span className="block text-sm font-extrabold text-white">{s.label}</span>
                      <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted">{s.blurb}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname === n.href ? "page" : undefined}
              className="rounded-full px-5 py-2.5 text-base font-extrabold tracking-wide text-white transition-colors hover:bg-white/10 aria-[current=page]:bg-red aria-[current=page]:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={links.tel}
            data-track="call"
            className="hidden items-center gap-2 rounded-full bg-red px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_24px_-8px_rgb(227_25_31/0.9)] transition hover:bg-[#f0262c] sm:inline-flex"
          >
            <PhoneIcon size={16} />
            Call/Text {business.phone.display}
          </a>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full text-white ring-1 ring-white/15 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "pointer-events-auto fixed inset-x-3 bg-[#0e0e10] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.95)] top-[calc(env(safe-area-inset-top)+5.2rem)] bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] overflow-y-auto rounded-2xl p-5 ring-1 ring-white/10 transition-all duration-300 lg:hidden",
          open ? "visible opacity-100" : "invisible -translate-y-3 opacity-0",
        )}
      >
        <p className="eyebrow mb-3 text-muted">Services</p>
        <ul className="grid gap-1">
          {serviceLinks.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="flex items-center justify-between rounded-xl px-3 py-3 text-lg font-extrabold text-white hover:bg-white/5">
                {s.label}
                <ArrowIcon size={18} className="text-red-text" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="my-4 h-px bg-white/10" />
        <ul className="grid grid-cols-2 gap-1">
          {[{ label: "Home", href: "/" }, ...nav].map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="block rounded-xl px-3 py-3 font-bold text-white/85 hover:bg-white/5">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/#quote" className="mt-4 flex items-center justify-center gap-2 rounded-full bg-red px-5 py-3.5 font-extrabold text-white" onClick={() => setOpen(false)}>
          Get a Free Quote <ArrowIcon size={18} />
        </Link>
      </div>
    </header>
  );
}
