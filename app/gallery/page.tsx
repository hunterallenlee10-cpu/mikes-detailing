import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Gallery } from "@/components/gallery/Gallery";
import { CtaBand } from "@/components/home/CtaBand";
import { Container, SectionHead } from "@/components/ui";

export const metadata = pageMeta({
  title: "Detailing & Ceramic Coating Gallery | Leonardtown, MD | Mike's Automotive Detailing",
  description:
    "Real work from Mike's Automotive Detailing in Leonardtown, MD: IGL ceramic coatings, full details, paint enhancement, engine bays and lighting installs across Southern Maryland.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} />
      <section className="relative pt-36 pb-24 sm:pt-44">
        <div aria-hidden className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(50%_80%_at_50%_0%,rgb(227_25_31/0.16),transparent_70%)]" />
        <Container className="relative">
          <SectionHead
            as="h1"
            eyebrow="Gallery"
            title={
              <>
                <span className="chrome">Real cars.</span> <span className="text-red">Real results.</span>
              </>
            }
            lead="Every photo here is Mike's own work. Filter by service, tap to zoom."
          />
          <div className="mt-12">
            <Gallery />
          </div>
        </Container>
      </section>
      <CtaBand title="Your ride's next." />
    </>
  );
}
