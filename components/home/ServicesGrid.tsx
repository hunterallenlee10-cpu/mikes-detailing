import Link from "next/link";
import { homeServiceCards, serviceBySlug } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon, ServiceIcon } from "../icons";
import { Photo } from "../Photo";
import { Container, SectionHead } from "../ui";

export function ServicesGrid() {
  return (
    <section id="services" className="relative py-24 sm:py-32" aria-labelledby="services-title">
      <Container>
        <SectionHead
          eyebrow="One stop shop"
          title={
            <span id="services-title">
              <span className="chrome">Everything your ride needs.</span> <span className="text-red">Under one hex-lit roof.</span>
            </span>
          }
          lead="Detailing, protection, lighting, audio, tint and accessories — done by the same guy who answers your text."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {homeServiceCards.map((card, i) => {
            const s = serviceBySlug(card.slug);
            const accent = s.accent;
            return (
              <li key={card.slug} data-reveal data-reveal-delay={(i % 3) * 90}>
                <Link
                  href={`/${card.slug}`}
                  className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl bg-carbon p-6 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1 hover:ring-white/25"
                >
                  <Photo
                    slug={s.photo}
                    alt=""
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className="opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/80 to-jet/10" />
                  {/* hex outline lights up on hover */}
                  <svg aria-hidden viewBox="0 0 120 104" className="absolute top-5 right-5 h-16 w-[4.6rem]">
                    <path
                      d="M30 2h60l28 50-28 50H30L2 52z"
                      fill="none"
                      strokeWidth="2.5"
                      className={cn(
                        "stroke-white/15 transition-all duration-500 [stroke-dasharray:340] [stroke-dashoffset:340] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]",
                        accent === "igl" ? "group-hover:stroke-igl" : accent === "neon" ? "group-hover:stroke-cyan" : "group-hover:stroke-red",
                      )}
                    />
                    <path d="M30 2h60l28 50-28 50H30L2 52z" fill="none" strokeWidth="1" className="stroke-white/15" />
                  </svg>
                  <span
                    className={cn(
                      "relative mb-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1",
                      accent === "igl" ? "bg-igl/15 text-igl-text ring-igl/30" : accent === "neon" ? "bg-violet/15 text-cyan ring-violet/40" : "bg-red/15 text-red-text ring-red/30",
                    )}
                  >
                    <ServiceIcon name={card.icon} size={24} />
                  </span>
                  <div className="relative">
                    <h3 className="text-2xl font-black text-white uppercase">{card.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-chrome/85">{card.blurb}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-white">
                      Explore {card.title.toLowerCase()}
                      <ArrowIcon size={16} className="text-red-text transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
