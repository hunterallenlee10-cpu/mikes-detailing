import { serviceBySlug } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { ServicePage } from "@/components/service/ServicePage";

const s = serviceBySlug("fleet");
export const metadata = pageMeta({ title: s.seo.title, description: s.seo.description, path: "/fleet" });

export default function Page() {
  return <ServicePage slug="fleet" />;
}
