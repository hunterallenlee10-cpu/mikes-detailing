import { serviceBySlug } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { ServicePage } from "@/components/service/ServicePage";

const s = serviceBySlug("lighting");
export const metadata = pageMeta({ title: s.seo.title, description: s.seo.description, path: "/lighting" });

export default function Page() {
  return <ServicePage slug="lighting" />;
}
