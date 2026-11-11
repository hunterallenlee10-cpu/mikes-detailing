import { business, faqs, hoursDisplay, prices, services } from "@/content/site";

/** /llms.txt — a plain-text summary of the business for AI assistants and answer engines. */
export function GET() {
  const base = business.siteUrl.replace(/\/$/, "");
  const body = `# ${business.name}

> ${business.positioning} in ${business.address.city}, ${business.address.regionName}. Owner: ${business.owner}. Established ${business.established}. "${business.tagline}."
> IGL Coatings Dealer & Certified Installer. LowGlow Certified Dealer & Installer. ${business.stats.detailsCompleted} details completed.

## Contact
- Phone (call or text): ${business.phone.display}
- Email: ${business.email}
- Shop: ${business.address.street}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}
- Hours: ${hoursDisplay.map((h) => `${h.label} ${h.value}`).join("; ")}
- Service area: ${business.areaServed.join(", ")}
- Instagram: ${business.socials.instagram}
- Facebook: ${business.socials.facebook}
- TikTok: ${business.socials.tiktok}

## Services
${services.map((s) => `- [${s.name}](${base}/${s.slug}): ${s.card}`).join("\n")}

## Pricing notes
- Full Interior & Exterior Detail: $${prices.fullDetail} (polishing not included)
- IGL ceramic coating packages: from $${prices.ceramicFrom.toLocaleString()}, depending on vehicle size and condition
- Tint removal: from $${prices.tintRemovalPerWindow} per window

## FAQ
${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Pages
- [Home](${base}/)
- [Gallery](${base}/gallery)
- [Reviews](${base}/reviews)
- [About](${base}/about)
- [Contact & quote](${base}/contact)
- [Gift cards](${base}/gift-cards)
- [Refer a friend](${base}/refer)
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
