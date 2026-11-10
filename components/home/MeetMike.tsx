import { business } from "@/content/site";
import { Photo } from "../Photo";
import { CallTextButtons, Container, SectionHead } from "../ui";

export function MeetMike({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  const stats = [
    { k: `Est. ${business.established}`, v: "Full time, all in" },
    { k: business.stats.detailsCompleted, v: "Details completed" },
    { k: "2", v: "Certifications (IGL + LowGlow)" },
    { k: `Since ${business.stats.fleetSince}`, v: "Trusted with a local truck fleet" },
  ];
  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="mike-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_40%,rgb(227_25_31/0.12),transparent_70%)]" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative grid grid-cols-[1.15fr_1fr] gap-4">
          <div className="relative row-span-2 aspect-[434/646] overflow-hidden rounded-[2rem] ring-1 ring-white/15" data-reveal>
            <Photo slug="mike-polisher-c8" alt="Mike Tippett with a polisher next to a black C8 Corvette" sizes="(min-width: 1024px) 26vw, 52vw" position="50% 30%" />
          </div>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/15" data-reveal data-reveal-delay="140">
            <Photo slug="mike-pressure-wash" alt="Mike pressure-washing a customer's car in his Mike's Automotive Detailing IGL shirt" sizes="(min-width: 1024px) 22vw, 44vw" position="45% 50%" />
          </div>
          <div className="flex items-end" data-reveal data-reveal-delay="220">
            <p className="font-wide text-sm leading-snug font-black text-white uppercase">
              Real person.
              <br />
              <span className="text-red-text">Real work.</span>
            </p>
          </div>
        </div>

        <div>
          <SectionHead
            eyebrow={`Meet ${business.ownerFirst}`}
            as={headingAs}
            title={
              <span id="mike-title">
                <span className="chrome">Hey, I&apos;m Mike.</span> <span className="text-red">Come holla.</span>
              </span>
            }
          />
          <div className="mt-6 grid gap-4 text-lg leading-relaxed text-chrome/90" data-reveal>
            <p>
              I started {business.name} in {business.established} and I run it full time. A thousand-plus details later, we just opened our own shop on Point Lookout Rd in Leonardtown — hex lights, the whole thing.
            </p>
            <p>
              I&apos;m an IGL Coatings Certified Installer and a LowGlow Certified Dealer &amp; Installer, and I know electrical. Every install looks factory: clean connections, no exposed components anywhere.
            </p>
            <p>
              And I&apos;ll give it to you straight. On a 2025 Z06 with GM&apos;s thin factory clear coat, I recommended a polish instead of a heavy cut — so the owner keeps that clear for UV protection down the road. I won&apos;t upsell you into damage.
            </p>
            <p className="font-bold text-white">We love when customers come in and chat. Stop by for questions, quotes, products — or just to talk cars.</p>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-3" data-reveal>
            {stats.map((s) => (
              <div key={s.v} className="rounded-2xl bg-carbon p-4 ring-1 ring-white/10">
                <dt className="sr-only">{s.v}</dt>
                <dd>
                  <span className="font-wide block text-2xl font-black text-white">{s.k}</span>
                  <span className="text-sm text-muted">{s.v}</span>
                </dd>
              </div>
            ))}
          </dl>
          <CallTextButtons className="mt-8" />
        </div>
      </Container>
    </section>
  );
}
