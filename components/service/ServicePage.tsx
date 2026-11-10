import Link from "next/link";
import { business, links, reviewById, serviceBySlug, services, type ServiceSlug } from "@/content/site";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { cn } from "@/lib/cn";
import { JsonLd } from "../JsonLd";
import { Photo } from "../Photo";
import { ArrowIcon, CalendarIcon, CheckIcon } from "../icons";
import { Button, CallTextButtons, Container, HexDivider, SectionHead } from "../ui";
import { Faq } from "../home/Faq";
import { CtaBand } from "../home/CtaBand";
import { ReviewCard } from "../home/Reviews";
import { ProtectionLadder } from "../home/ProtectionLadder";
import { Process } from "../home/Process";
import { QuoteSection } from "../quote/QuoteSection";
import { LightsOn } from "../fx/LightsOn";
import { Equalizer } from "../fx/Equalizer";
import { HexCeiling } from "../hex/HexCeiling";

const QUOTE_PRESET: Record<ServiceSlug, string[]> = {
  "auto-detailing": ["Full Interior & Exterior Detail"],
  "ceramic-coating": ["IGL 4-Year Ceramic Coating"],
  "paint-correction": ["Paint Correction"],
  lighting: ["Underglow / Rock Lights"],
  "car-audio": ["Car Audio"],
  "window-tint": ["Window Tint"],
  fleet: ["Fleet Detailing"],
};

const accentText = { red: "text-red-text", igl: "text-igl-text", neon: "text-cyan" } as const;
const accentBg = { red: "bg-red", igl: "bg-igl", neon: "bg-gradient-to-r from-cyan via-violet to-magenta" } as const;

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const s = serviceBySlug(slug);
  const proofReviews = s.proof.reviewIds.map(reviewById).filter((r) => !!r);
  const others = services.filter((o) => o.slug !== slug).slice(0, 6);
  const bookHref = business.bookingUrl || "#quote";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: s.name, path: `/${s.slug}` },
        ])}
      />
      <JsonLd data={serviceSchema(s)} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24" aria-labelledby="svc-title">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[55%] opacity-60 [perspective:900px]">
          <div className="absolute inset-x-[-30%] top-[-20%] origin-top [transform:rotateX(60deg)] sm:inset-x-[-10%]">
            <HexCeiling className="h-auto w-full" seed={s.slug.length * 3 + 1} cols={13} rows={5} />
          </div>
        </div>
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10",
            s.accent === "igl"
              ? "bg-[radial-gradient(50%_60%_at_80%_60%,rgb(61_174_73/0.18),transparent_70%)]"
              : s.accent === "neon"
                ? "bg-[radial-gradient(50%_60%_at_80%_60%,rgb(139_92_246/0.25),transparent_70%)]"
                : "bg-[radial-gradient(50%_60%_at_80%_60%,rgb(227_25_31/0.16),transparent_70%)]",
          )}
        />
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <nav aria-label="Breadcrumb" className="fade-up text-sm text-muted">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-white">
                  {s.short}
                </li>
              </ol>
            </nav>
            <p className={cn("eyebrow fade-up mt-6", accentText[s.accent])} style={{ animationDelay: ".1s" }}>
              {s.eyebrow}
            </p>
            <h1 id="svc-title" className="mt-4 text-[clamp(2.3rem,6vw,5rem)] leading-[0.95] font-black uppercase">
              <span className="reveal-line chrome" style={{ animationDelay: ".2s" }}>
                {s.seo.h1.replace(/ in .*$/, "")}
              </span>
              <span className="reveal-line text-red" style={{ animationDelay: ".35s" }}>
                {s.seo.h1.match(/ in .*$/)?.[0].trim() ?? "Southern Maryland"}
              </span>
            </h1>
            <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-chrome/90" style={{ animationDelay: ".5s" }}>
              {s.intro}
            </p>
            <div className="fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: ".65s" }}>
              <CallTextButtons compact />
              <Button href={bookHref} variant="chrome" track="book_online">
                <CalendarIcon size={18} /> Book Online
              </Button>
            </div>
            {s.pricing[0] && (
              <p className="fade-up mt-6 text-sm text-muted" style={{ animationDelay: ".8s" }}>
                {s.pricing.find((p) => p.value !== "Quote")
                  ? `${s.pricing.find((p) => p.value !== "Quote")!.label}: `
                  : "Pricing: "}
                <strong className="text-white">{s.pricing.find((p) => p.value !== "Quote")?.value ?? "Free quote — text a few photos"}</strong>
              </p>
            )}
          </div>
          <div className="fade-up relative" style={{ animationDelay: ".4s" }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] ring-1 ring-white/15 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] lg:aspect-[4/5]">
              <Photo slug={s.photo} alt={s.photoAlt} sizes="(min-width: 1024px) 42vw, 92vw" eager />
              <div className="absolute inset-0 bg-gradient-to-t from-jet/70 via-transparent to-transparent" />
            </div>
            <span aria-hidden className={cn("absolute -bottom-3 left-8 h-1.5 w-32 rounded-full", accentBg[s.accent])} />
          </div>
        </Container>
      </section>

      {/* Signature feature */}
      {s.feature === "water" && <ProtectionLadder showLink={false} />}
      {s.feature === "process" && <Process title="The real process." />}
      {s.feature === "lights" && (
        <section className="relative py-20 sm:py-28" aria-labelledby="lights-title">
          <Container>
            <SectionHead
              eyebrow="LowGlow · Lighting up your ride"
              eyebrowClass="text-cyan"
              title={
                <span id="lights-title">
                  <span className="chrome">Hit the switch.</span>{" "}
                  <span className="bg-gradient-to-r from-cyan via-violet to-magenta bg-clip-text text-transparent">Lights on.</span>
                </span>
              }
              lead="Widely hated — widely loved if done right. Here's what done right looks like."
            />
            <div className="mt-12" data-reveal>
              <LightsOn />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button href={business.lowglowUrl} variant="ghost" track="lowglow_shop">
                Shop LowGlow kits <ArrowIcon size={18} />
              </Button>
              <p className="text-sm text-muted">Buy a kit, get a kit installed, or both.{business.lowglowCode ? ` Use code ${business.lowglowCode}.` : ""}</p>
            </div>
          </Container>
        </section>
      )}
      {s.feature === "audio" && (
        <section className="relative py-20 sm:py-28" aria-labelledby="audio-title">
          <Container>
            <SectionHead
              eyebrow="In-shop listening demo"
              title={
                <span id="audio-title">
                  <span className="chrome">Bring your playlist.</span> <span className="text-red">Play any song.</span>
                </span>
              }
              lead="Come by the shop and test the system with whatever song you want. No pressure, just bass."
            />
            <Equalizer className="mt-12" />
            <p className="mt-3 text-xs text-muted">Visual only — no sound plays on this page.</p>
          </Container>
        </section>
      )}

      {/* Included */}
      <section className="relative py-20 sm:py-28" aria-labelledby="incl-title">
        <Container>
          <SectionHead
            eyebrow="What's included"
            title={
              <span id="incl-title">
                <span className="chrome">Done right,</span> <span className="text-red">top to bottom.</span>
              </span>
            }
          />
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.included.map((it, i) => (
              <li key={it.title} className="group relative overflow-hidden rounded-3xl bg-carbon p-6 ring-1 ring-white/10 edge-red" data-reveal data-reveal-delay={(i % 3) * 80}>
                <span aria-hidden className={cn("hex-clip mb-5 block h-6 w-7", accentBg[s.accent])} />
                <h3 className="text-lg font-black text-white uppercase">{it.title}</h3>
                <p className="mt-2 leading-relaxed text-chrome/85">{it.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Who + pricing */}
      <section className="relative py-12 sm:py-16" aria-label="Who it's for and pricing">
        <Container className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-carbon p-7 ring-1 ring-white/10 sm:p-9" data-reveal>
            <h2 className="text-2xl font-black uppercase sm:text-3xl">
              <span className="chrome">Who it&apos;s for</span>
            </h2>
            <ul className="mt-6 grid gap-3">
              {s.forWho.map((w) => (
                <li key={w} className="flex gap-3 text-lg text-chrome/90">
                  <CheckIcon size={22} className={cn("mt-0.5 shrink-0", accentText[s.accent])} />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-graphite to-carbon p-7 ring-1 ring-white/10 sm:p-9" data-reveal data-reveal-delay="100">
            <h2 className="text-2xl font-black uppercase sm:text-3xl">
              <span className="chrome">Pricing</span>
            </h2>
            <dl className="mt-6 grid gap-1">
              {s.pricing.map((p) => (
                <div key={p.label} className="flex items-start justify-between gap-4 border-b border-white/10 py-4 last:border-0">
                  <dt>
                    <span className="block font-bold text-white">{p.label}</span>
                    {p.note && <span className="text-sm text-muted">{p.note}</span>}
                  </dt>
                  <dd className={cn("font-wide shrink-0 text-xl font-black", p.value === "Quote" ? "text-chrome" : accentText[s.accent])}>{p.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-muted">Final price depends on vehicle size and condition. Text a few photos for an exact number.</p>
            <a href={links.sms} data-track="text" className="mt-5 inline-flex items-center gap-2 font-extrabold text-white hover:text-red-text">
              Text photos for a quote <ArrowIcon size={16} />
            </a>
          </div>
        </Container>
      </section>

      {/* Proof */}
      <section className="relative py-20 sm:py-28" aria-labelledby="proof-title">
        <Container>
          <SectionHead
            eyebrow="Proof"
            title={
              <span id="proof-title" className="chrome">
                {s.proof.headline}
              </span>
            }
            lead={s.proof.body}
          />
          {proofReviews.length > 0 && (
            <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {proofReviews.map((r, i) => (
                <li key={r!.id} data-reveal data-reveal-delay={i * 90}>
                  <ReviewCard r={r!} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <HexDivider />
      <Faq items={s.faqs} title={`${s.short} questions.`} />
      <QuoteSection initialServices={QUOTE_PRESET[slug]} title="Get your price." />

      {/* Other services */}
      <section className="py-16" aria-labelledby="more-title">
        <Container>
          <h2 id="more-title" className="eyebrow text-muted">
            More from the shop
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/${o.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/5 px-5 font-bold text-white ring-1 ring-white/12 hover:bg-white/10">
                  {o.name} <ArrowIcon size={14} className="text-red-text" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
