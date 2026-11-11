import { business, hours, links, ratings, services, type Service } from "@/content/site";

const url = (path = "/") => new URL(path, business.siteUrl).toString();
const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** AutomotiveBusiness JSON-LD — placed on every page. */
export function businessSchema() {
  const google = ratings.google;
  return {
    "@context": "https://schema.org",
    "@type": ["AutomotiveBusiness", "AutoWash"],
    "@id": url("/#business"),
    name: business.name,
    alternateName: "Mike's Auto Detailing",
    slogan: business.tagline,
    description: `${business.positioning} in Leonardtown, MD. IGL Coatings Certified Installer and LowGlow Certified Dealer & Installer offering detailing, ceramic coating, paint correction, custom lighting, car audio and window tint across Southern Maryland.`,
    url: url("/"),
    logo: url("/images/logo-square.png"),
    image: [url("/images/site/shop-hex-bay-774.webp"), url("/images/site/gmc-at4x-igl-979.webp")],
    telephone: business.phone.e164,
    email: business.email,
    founder: { "@type": "Person", name: business.owner },
    foundingDate: String(business.established),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    openingHoursSpecification: hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${DAY[h.day]}`,
      opens: h.open,
      closes: h.close,
    })),
    areaServed: business.areaServed.map((name) => ({ "@type": name.includes("County") ? "AdministrativeArea" : "Place", name: `${name}, MD` })),
    sameAs: [...Object.values(business.socials), links.mapsListing],
    hasMap: links.mapsListing,
    knowsAbout: ["Ceramic coating", "Paint correction", "Auto detailing", "Underglow lighting", "Starlight headliners", "Car audio", "Window tint"],
    hasCredential: business.certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: `${c.name} ${c.role}`,
    })),
    // Only published when the live Google numbers are filled in content/site.ts
    ...(google.reviewCount
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: google.rating, reviewCount: google.reviewCount, bestRating: 5 } }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Detailing, protection & install services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: url(`/${s.slug}`), description: s.card },
      })),
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: url(t.path) })),
  };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.intro,
    url: url(`/${s.slug}`),
    provider: { "@id": url("/#business") },
    areaServed: business.areaServed.map((name) => ({ "@type": "Place", name: `${name}, MD` })),
  };
}

export { url as absoluteUrl };
