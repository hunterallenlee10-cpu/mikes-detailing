import { serviceBySlug } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { ServicePage } from "@/components/service/ServicePage";

const s = serviceBySlug("paint-correction");
export const metadata = pageMeta({ title: s.seo.title, description: s.seo.description, path: "/paint-correction" });

export default function Page() {
  return <ServicePage slug="paint-correction" />;
}
