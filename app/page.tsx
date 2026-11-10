import Link from "next/link";
import { faqs } from "@/content/site";
import { Hero } from "@/components/home/Hero";
import { CertStrip } from "@/components/home/CertStrip";
import { Specials } from "@/components/home/Specials";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { ProtectionLadder } from "@/components/home/ProtectionLadder";
import { Process } from "@/components/home/Process";
import { Gallery } from "@/components/gallery/Gallery";
import { Reviews } from "@/components/home/Reviews";
import { MeetMike } from "@/components/home/MeetMike";
import { QuoteSection } from "@/components/quote/QuoteSection";
import { VisitShop } from "@/components/visit/VisitShop";
import { Faq } from "@/components/home/Faq";
import { CtaBand } from "@/components/home/CtaBand";
import { Container, HexDivider, SectionHead } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";

export default function Home() {
  return (
    <>
      <Hero />
      <CertStrip />
      <Specials />
      <ServicesGrid />
      <HexDivider />
      <ProtectionLadder />
      <Process />
      <section className="relative py-24 sm:py-32" aria-labelledby="work-title">
        <Container>
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHead
              eyebrow="Recent work"
              title={
                <span id="work-title">
                  <span className="chrome">Fresh out</span> <span className="text-red">of the bay.</span>
                </span>
              }
            />
            <Link href="/gallery" className="group inline-flex items-center gap-2 font-extrabold text-white hover:text-red-text">
              See the full gallery <ArrowIcon size={18} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <Gallery limit={6} filterable={false} />
        </Container>
      </section>
      <Reviews compact ids={["jason-h", "blake-a", "kirk-b", "danielle-k", "carah-p", "jacob-w"]} />
      <MeetMike />
      <QuoteSection />
      <HexDivider />
      <VisitShop />
      <Faq items={faqs} />
      <CtaBand />
    </>
  );
}
