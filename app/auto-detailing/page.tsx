import { serviceBySlug } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { ServicePage } from "@/components/service/ServicePage";

const s = serviceBySlug("auto-detailing");
export const metadata = pageMeta({ title: s.seo.title, description: s.seo.description, path: "/auto-detailing" });

export default function Page() {
  return <ServicePage slug="auto-detailing" />;
}
