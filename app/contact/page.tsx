import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { QuoteSection } from "@/components/quote/QuoteSection";
import { VisitShop } from "@/components/visit/VisitShop";

export const metadata = pageMeta({
  title: "Contact & Free Quote | Mike's Automotive Detailing, Leonardtown MD",
  description:
    "Get a free quote from Mike's Automotive Detailing. Call or text (301) 752-8505, email, or visit the shop at 26005 Point Lookout Rd, Leonardtown, MD 20650.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <div className="pt-12 sm:pt-16">
        <QuoteSection headingAs="h1" title="Let's talk." />
      </div>
      <VisitShop />
    </>
  );
}
