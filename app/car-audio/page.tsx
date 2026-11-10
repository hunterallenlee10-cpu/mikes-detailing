import { serviceBySlug } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { ServicePage } from "@/components/service/ServicePage";

const s = serviceBySlug("car-audio");
export const metadata = pageMeta({ title: s.seo.title, description: s.seo.description, path: "/car-audio" });

export default function Page() {
  return <ServicePage slug="car-audio" />;
}
