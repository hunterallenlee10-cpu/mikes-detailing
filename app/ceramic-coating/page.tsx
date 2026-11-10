import { serviceBySlug } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { ServicePage } from "@/components/service/ServicePage";

const s = serviceBySlug("ceramic-coating");
export const metadata = pageMeta({ title: s.seo.title, description: s.seo.description, path: "/ceramic-coating" });

export default function Page() {
  return <ServicePage slug="ceramic-coating" />;
}
