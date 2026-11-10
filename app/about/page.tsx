import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { business } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { MeetMike } from "@/components/home/MeetMike";
import { CertStrip } from "@/components/home/CertStrip";
import { VisitShop } from "@/components/visit/VisitShop";
import { CtaBand } from "@/components/home/CtaBand";
import { Container, SectionHead } from "@/components/ui";

export const metadata = pageMeta({
  title: "About Mike Tippett | Mike's Automotive Detailing, Leonardtown MD",
  description:
    "Meet Mike Tippett: full-time detailer since 2020, 1,000+ details, IGL Coatings Certified Installer and LowGlow Certified Dealer with a new shop in Leonardtown, MD.",
  path: "/about",
});

const values = [
  { t: "Honest advice", b: "If your clear coat can't take a heavy cut, we'll tell you — and recommend the safer option." },
  { t: "Factory-clean installs", b: "No exposed components anywhere. Clean connections so installs don't cause long-term issues." },
  { t: "Kept in the loop", b: "Updates by text, call and video while your ride is with us." },
  { t: "Come in and chat", b: "Questions, quotes, products, merch — or just talk cars. The door's open." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <div className="pt-16 sm:pt-20">
        <MeetMike headingAs="h1" />
      </div>
      <CertStrip />
      <section className="py-24 sm:py-32" aria-labelledby="values-title">
        <Container>
          <SectionHead
            eyebrow={business.tagline}
            title={
              <span id="values-title">
                <span className="chrome">How we</span> <span className="text-red">work.</span>
              </span>
            }
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.t} className="rounded-3xl bg-carbon p-6 ring-1 ring-white/10 edge-red" data-reveal data-reveal-delay={i * 80}>
                <span aria-hidden className="hex-clip block h-6 w-7 bg-red" />
                <h3 className="mt-5 text-lg font-black text-white uppercase">{v.t}</h3>
                <p className="mt-2 leading-relaxed text-chrome/85">{v.b}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <VisitShop />
      <CtaBand />
    </>
  );
}
