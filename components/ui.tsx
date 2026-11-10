import Link from "next/link";
import type { ReactNode } from "react";
import { business, links } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon, ChatIcon, PhoneIcon } from "./icons";
import { Magnetic } from "./motion/Magnetic";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8", className)}>{children}</div>;
}

type BtnProps = {
  href: string;
  children: ReactNode;
  variant?: "red" | "ghost" | "chrome";
  className?: string;
  track?: string;
  external?: boolean;
  magnetic?: boolean;
  ariaLabel?: string;
};

export function Button({ href, children, variant = "red", className, track, external, magnetic = true, ariaLabel }: BtnProps) {
  const cls = cn(
    "group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-extrabold tracking-wide transition-[background,box-shadow,color] duration-300",
    variant === "red" &&
      "bg-red text-white shadow-[0_10px_30px_-10px_rgb(227_25_31/0.8),inset_0_1px_0_rgb(255_255_255/0.25)] hover:bg-[#f0262c] hover:shadow-[0_14px_44px_-10px_rgb(227_25_31/1),inset_0_1px_0_rgb(255_255_255/0.3)]",
    variant === "ghost" && "bg-white/[0.04] text-white ring-1 ring-white/15 ring-inset hover:bg-white/10 hover:ring-white/30",
    variant === "chrome" && "bg-gradient-to-b from-white to-chrome text-jet shadow-[inset_0_-2px_0_rgb(0_0_0/0.2)] hover:to-white",
    className,
  );
  const inner = (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full skew-x-[-18deg] bg-white/25 opacity-0 transition-opacity group-hover:animate-[sweep_0.9s_ease-out] group-hover:opacity-100" />
      {children}
    </>
  );
  const isExternal = external ?? /^(https?:|tel:|sms:|mailto:)/.test(href);
  const el = isExternal ? (
    <a href={href} className={cls} data-track={track} aria-label={ariaLabel} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} data-track={track} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function CallTextButtons({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Button href={links.tel} track="call" ariaLabel={`Call Mike at ${business.phone.display}`}>
        <PhoneIcon size={18} />
        {compact ? "Call" : `Call ${business.phone.display}`}
      </Button>
      <Button href={links.sms} variant="ghost" track="text" ariaLabel={`Text Mike at ${business.phone.display}`}>
        <ChatIcon size={18} />
        Text Mike
      </Button>
    </div>
  );
}

export function QuoteButton({ className, label = "Get a Free Quote", variant = "ghost" }: { className?: string; label?: string; variant?: BtnProps["variant"] }) {
  return (
    <Button href="/#quote" variant={variant} className={className} track="quote_cta">
      {label}
      <ArrowIcon size={18} className="transition-transform group-hover:translate-x-1" />
    </Button>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  className,
  align = "left",
  as: As = "h2",
  eyebrowClass = "text-red-text",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  eyebrowClass?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)} data-reveal={As === "h1" ? undefined : true}>
      <p className={cn("eyebrow mb-4 flex items-center gap-3", align === "center" && "justify-center", eyebrowClass)}>
        <span aria-hidden className="inline-block h-[3px] w-6 rounded bg-current" />
        {eyebrow}
      </p>
      <As className="text-[clamp(2rem,5.2vw,4rem)] leading-[0.98] font-black uppercase">{title}</As>
      {lead && <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

/** Thin hex-chain divider between sections. */
export function HexDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-10 overflow-hidden opacity-70", className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='46' height='40'%3E%3Cpath d='M11.5 20 17.25 10h11.5l5.75 10-5.75 10h-11.5z' fill='none' stroke='%23c9ccd1' stroke-opacity='.2'/%3E%3C/svg%3E\")",
          maskImage: "linear-gradient(90deg, transparent, #000 50%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 50%, transparent)",
        }}
      />
      <div className="absolute top-1/2 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-red to-transparent" />
    </div>
  );
}

export function Stripes({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex flex-col gap-[5px]", className)}>
      {[100, 92, 84, 74, 62, 48].map((w, i) => (
        <span key={i} className="block rounded-full bg-red" style={{ width: `${w}%`, height: 6 - i * 0.6, opacity: 1 - i * 0.08 }} />
      ))}
    </div>
  );
}
