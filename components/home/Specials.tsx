import Link from "next/link";
import { promos } from "@/content/site";
import { serverNow } from "@/lib/now";
import { activeItems } from "@/lib/time";
import { ArrowIcon } from "../icons";
import { Container, Stripes } from "../ui";
import { DateGate } from "./DateGate";

/** Promo cards for every promo inside its date window. Renders nothing when none are active. */
export async function Specials() {
  const now = new Date(await serverNow());
  const active = activeItems(promos, now);
  if (!active.length) return null;
  return (
    <DateGate windows={active.map(({ startsAt, endsAt }) => ({ startsAt, endsAt }))}>
    <section id="specials" aria-label="Current specials" className="relative overflow-hidden py-20 sm:py-24">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_0%,rgb(158_15_20/0.35),transparent_70%)]" />
      <Container className="relative grid gap-8">
        {active.map((p) => (
          <DateGate key={p.id} windows={[{ startsAt: p.startsAt, endsAt: p.endsAt }]}>
            <article className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-graphite to-carbon p-6 ring-1 ring-red/30 sm:p-10" data-promo={p.id}>
              <Stripes className="absolute top-8 right-8 hidden w-32 opacity-40 sm:flex" />
              <p className="eyebrow text-red-text">{p.kicker}</p>
              <h2 className="mt-3 text-[clamp(1.9rem,4.5vw,3.4rem)] leading-none font-black uppercase">
                <span className="chrome">{p.title}</span>
              </h2>
              <ul className={`mt-8 grid gap-3 ${p.items.length > 1 ? "sm:grid-cols-2 lg:grid-cols-4" : ""}`}>
                {p.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex h-full flex-col rounded-2xl bg-jet/70 p-5 ring-1 ring-white/10 transition hover:ring-red/60"
                    >
                      <span className="text-sm font-bold text-white">{item.name}</span>
                      <span className="mt-3 flex flex-wrap items-baseline gap-x-2">
                        {item.was && <s className="text-sm font-bold text-muted">{item.was}</s>}
                        <span className="font-wide text-[1.7rem] leading-none font-black whitespace-nowrap text-red-text xl:text-3xl">
                          {item.price.startsWith("from ") ? (
                            <>
                              <span className="mr-1 align-middle text-sm font-bold text-muted">from</span>
                              {item.price.slice(5)}
                            </>
                          ) : (
                            item.price
                          )}
                        </span>
                      </span>
                      <span className="mt-2 mb-4 text-sm leading-snug text-muted">{item.note}</span>
                      <ArrowIcon size={18} className="mt-auto shrink-0 translate-y-3 text-white/60 transition group-hover:translate-x-1 group-hover:text-white" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/#quote" className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-3 font-extrabold text-white hover:bg-[#f0262c]" data-track="promo_book">
                  Claim this special <ArrowIcon size={16} />
                </Link>
              </div>
              <details className="mt-6 text-xs leading-relaxed text-muted">
                <summary className="cursor-pointer font-bold text-chrome hover:text-white">Terms &amp; conditions</summary>
                <p className="mt-2 max-w-4xl">{p.terms}</p>
              </details>
            </article>
          </DateGate>
        ))}
      </Container>
    </section>
    </DateGate>
  );
}
