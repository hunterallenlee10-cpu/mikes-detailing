import { business, ratings } from "@/content/site";
import { CeilingBackdrop } from "../hex/HexCeiling";
import { Photo } from "../Photo";
import { CallTextButtons, Container, QuoteButton } from "../ui";
import { StarIcon } from "../icons";

export function TrustChips({ className = "" }: { className?: string }) {
  const chips = [
    { k: "google", node: <><StarIcon size={14} className="text-[#fbbc04]" /> {ratings.google.rating.toFixed(1)} Google</> },
    { k: "fb", node: <>{ratings.facebook.recommendPercent}% Recommend on Facebook</> },
    { k: "details", node: <>{business.stats.detailsCompleted} Details</> },
    { k: "est", node: <>Est. {business.established}</> },
  ];
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Why customers trust us">
      {chips.map((c) => (
        <li
          key={c.k}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white ring-1 ring-white/12 backdrop-blur sm:text-[0.8rem]"
        >
          {c.node}
        </li>
      ))}
    </ul>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-jet pt-36 pb-16 sm:pt-40 lg:min-h-[100svh] lg:pt-44 lg:pb-24" aria-labelledby="hero-title">
      <CeilingBackdrop />
      {/* Glossy floor + reflection + sweep */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgb(20_20_24/0.9)_35%,#0a0a0b)]" />
        <div className="absolute inset-x-[10%] top-[18%] h-24 rounded-[50%] bg-white/[0.07] blur-3xl" />
        <div className="absolute inset-x-0 top-[30%] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-1/3 animate-[sweep_5.5s_2.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_80%_70%,rgb(227_25_31/0.16),transparent_70%)]" />

      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] xl:gap-16">
        <div>
          <p className="eyebrow fade-up flex items-center gap-3 text-red-text" style={{ animationDelay: "0.25s" }}>
            <span aria-hidden className="inline-block h-[3px] w-6 rounded bg-current" />
            Leonardtown, MD · Est. {business.established}
          </p>
          <h1 id="hero-title" className="mt-5 text-[clamp(2.2rem,9.6vw,3.4rem)] leading-[0.92] sm:text-[clamp(3rem,6.6vw,4.6rem)] lg:text-[min(5vw,5.2rem)] font-black uppercase">
            <span className="reveal-line chrome" style={{ animationDelay: "0.35s" }}>
              Southern Maryland&apos;s
            </span>
            <span className="reveal-line chrome" style={{ animationDelay: "0.5s" }}>
              Detail &amp; Ceramic
            </span>
            <span className="reveal-line text-red" style={{ animationDelay: "0.65s" }}>
              Coating Shop.
            </span>
          </h1>
          <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-chrome/90 sm:text-xl" style={{ animationDelay: "0.85s" }}>
            <strong className="font-extrabold text-white">IGL Coatings Certified Installer</strong> &amp;{" "}
            <strong className="font-extrabold text-white">LowGlow Certified Dealer</strong>. Real interior &amp; exterior detailing, paint
            correction, lighting, audio and tint — at our new shop on Point Lookout Rd.
          </p>
          <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "1s" }}>
            <CallTextButtons compact />
            <QuoteButton variant="chrome" />
          </div>
          <TrustChips className="fade-up mt-8" />
        </div>

        <div className="fade-up relative mx-auto w-full max-w-sm lg:max-w-none" style={{ animationDelay: "0.9s" }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] ring-1 ring-white/15 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),0_0_60px_-20px_rgb(227_25_31/0.6)]">
            <Photo
              slug="shop-hex-bay"
              alt="The new Mike's Automotive Detailing bay in Leonardtown: a black supercar with its doors open under a hexagon LED ceiling"
              sizes="(min-width: 1024px) 34vw, (min-width: 640px) 384px, 90vw"
              position="50% 40%"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jet via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="eyebrow text-white/70">Now open</p>
              <p className="font-wide mt-1 text-lg font-black text-white uppercase">The new bay · Leonardtown</p>
            </div>
          </div>
          <div aria-hidden className="absolute -inset-px -z-10 rounded-[30px] bg-gradient-to-b from-red/60 via-transparent to-transparent blur-md" />
        </div>
      </Container>
    </section>
  );
}
