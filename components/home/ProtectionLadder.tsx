import Link from "next/link";
import { protectionTiers } from "@/content/site";
import { cn } from "@/lib/cn";
import { WaterBeading } from "../fx/WaterBeading";
import { ArrowIcon, CheckIcon } from "../icons";
import { Container, SectionHead } from "../ui";

export function ProtectionLadder({ showLink = true, headingLevel = "h2" }: { showLink?: boolean; headingLevel?: "h2" }) {
  return (
    <section id="protection" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="ladder-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_10%,rgb(61_174_73/0.14),transparent_70%)]" />
      <Container className="relative">
        <SectionHead
          eyebrow="IGL Coatings Certified Installer"
          eyebrowClass="text-igl-text"
          as={headingLevel}
          title={
            <span id="ladder-title">
              <span className="chrome">Pick your</span> <span className="text-igl">protection.</span>
            </span>
          }
          lead="From a 3-month sealant before winter to a professional 4-year IGL ceramic coating on everything. Here's how the ladder climbs."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
          {/* The wow moment */}
          <figure className="relative min-h-[22rem] overflow-hidden rounded-[2rem] ring-1 ring-igl/30 sm:min-h-[28rem]" data-reveal>
            <WaterBeading />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-jet/90 to-transparent p-5 sm:p-6">
              <span>
                <span className="eyebrow block text-igl-text">Try it</span>
                <span className="font-wide mt-1 block text-lg font-black text-white uppercase sm:text-xl">
                  Swipe the paint. <span className="text-igl-text">Watch it bead off.</span>
                </span>
              </span>
              <span aria-hidden className="hidden rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 sm:block">
                Hydrophobic
              </span>
            </figcaption>
          </figure>

          <ol className="grid gap-4">
            {protectionTiers.map((t, i) => (
              <li
                key={t.name}
                data-reveal
                data-reveal-delay={i * 110}
                className={cn(
                  "relative overflow-hidden rounded-3xl p-6 ring-1",
                  t.level === 3 ? "bg-gradient-to-br from-igl/20 via-carbon to-carbon ring-igl/50" : "bg-carbon ring-white/10",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="eyebrow text-muted">Level {t.level}</p>
                    <h3 className="mt-1 text-xl font-black text-white uppercase sm:text-2xl">{t.name}</h3>
                  </div>
                  <div className="shrink-0 sm:text-right">
                    <p className={cn("font-wide text-2xl font-black sm:text-3xl", t.level === 3 ? "text-igl-text" : "text-white")}>{t.duration}</p>
                    <p className="text-xs font-bold text-muted">{t.price}</p>
                  </div>
                </div>
                {/* durability meter */}
                <div className="mt-4 flex gap-1" aria-hidden>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <span
                      key={j}
                      className={cn("h-1.5 flex-1 rounded-full", j < [2, 5, 12][i] ? (t.level === 3 ? "bg-igl" : "bg-chrome/70") : "bg-white/10")}
                    />
                  ))}
                </div>
                <ul className="mt-4 grid gap-1.5 text-sm text-chrome/90">
                  {t.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <CheckIcon size={16} className={cn("mt-0.5 shrink-0", t.level === 3 ? "text-igl-text" : "text-red-text")} />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        {showLink && (
          <Link href="/ceramic-coating" className="group mt-8 inline-flex items-center gap-2 font-extrabold text-white hover:text-igl-text">
            Everything about ceramic coating <ArrowIcon size={18} className="transition group-hover:translate-x-1" />
          </Link>
        )}
      </Container>
    </section>
  );
}
