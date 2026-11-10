import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Reviews } from "@/components/home/Reviews";
import { CtaBand } from "@/components/home/CtaBand";

export const metadata = pageMeta({
  title: "Reviews | 5.0★ Google | Mike's Automotive Detailing, Leonardtown MD",
  description:
    "What Southern Maryland customers say about Mike's Automotive Detailing: ceramic coatings, full details, fleet work and tint. 5.0 on Google and 100% recommended on Facebook.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Reviews", path: "/reviews" }])} />
      <div className="pt-16 sm:pt-20">
        <h1 className="sr-only">Customer reviews of Mike&apos;s Automotive Detailing</h1>
        <Reviews title="Southern Maryland says it best." />
      </div>
      <CtaBand title="Be the next 5-star review." />
    </>
  );
}
