/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MIKE'S AUTOMOTIVE DETAILING — ALL WEBSITE CONTENT LIVES IN THIS ONE FILE.
 * ─────────────────────────────────────────────────────────────────────────────
 *  To change a price, promo, hours, review or FAQ: edit the text below, save,
 *  and push. Vercel rebuilds the site automatically.
 *
 *  Anything marked  // [CONFIRM]  is a fact we still need Mike to double-check.
 *  See README.md → "[CONFIRM] list for Mike".
 */

import type { PhotoSlug } from "./images.generated";

/** Online booking page (his Facebook "Book now" → Koalendar). Leave "" and every "Book Online" button opens the quote form instead. */
export const BOOKING_URL = ""; // [CONFIRM] exact Koalendar URL

/* ───────────────────────────── Business basics ───────────────────────────── */

export const business = {
  name: "Mike's Automotive Detailing",
  legalName: "Mike's Automotive Detailing",
  owner: "Mike Tippett",
  ownerFirst: "Mike",
  tagline: "Because Detail Matters",
  established: 2020,
  positioning: "One Stop Automotive Detailing & Accessory Shop",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://mikes-detailing-xi.vercel.app", // [CONFIRM] switch to the real domain when it is live
  phone: {
    display: "(301) 752-8505",
    e164: "+13017528505",
  },
  email: "mike_tippett4815@icloud.com",
  address: {
    street: "26005 Point Lookout Rd",
    city: "Leonardtown",
    region: "MD",
    regionName: "Maryland",
    postalCode: "20650",
    country: "US",
  },
  // From OpenStreetMap for 26005 Point Lookout Rd. Used for map + search engines.
  geo: { lat: 38.3039, lng: -76.6558 },
  timezone: "America/New_York",
  bookingUrl: BOOKING_URL,
  areaServed: ["Leonardtown", "St. Mary's County", "Calvert County", "Charles County", "Southern Maryland"],
  /** Mobile / on-site service now that the shop is open? Controls the "We will travel" copy + FAQ answer. */
  offersMobileService: null as boolean | null, // [CONFIRM] true = yes, false = shop only, null = "ask Mike"
  socials: {
    instagram: "https://www.instagram.com/mikesautomotivedetailing/",
    facebook: "https://www.facebook.com/Mikes.Auto.Detailing.Services",
    tiktok: "https://www.tiktok.com/@tbss_mike",
  },
  certifications: [
    { name: "IGL Coatings", role: "Dealer & Certified Installer" },
    { name: "LowGlow", role: "Certified Dealer & Installer" },
  ],
  stats: {
    detailsCompleted: "1,000+",
    fleetSince: 2022,
  },
  /** LowGlow kit shop. Swap for Mike's dealer link / code when he has one. */
  lowglowUrl: "https://lowglow.shop", // [CONFIRM] dealer link or discount code
  lowglowCode: "", // [CONFIRM]
  websiteCredit: { label: "Website by Lee Enterprises Unlimited", show: true },
} as const;

export const SMS_PREFILL = "Hey Mike! I found you on your website and I'd like a quote. My vehicle is a ";

export const links = {
  tel: `tel:${business.phone.e164}`,
  sms: `sms:${business.phone.e164}?&body=${encodeURIComponent(SMS_PREFILL)}`,
  email: `mailto:${business.email}?subject=${encodeURIComponent("Quote request from your website")}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    "Mike's Automotive Detailing, 26005 Point Lookout Rd, Leonardtown, MD 20650",
  )}`,
  mapsListing: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Mike's Automotive Detailing 26005 Point Lookout Rd Leonardtown MD 20650",
  )}`,
  mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent("26005 Point Lookout Rd, Leonardtown, MD 20650")}&z=15&output=embed`,
  googleReviews: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Mike's Automotive Detailing Leonardtown MD reviews",
  )}`, // [CONFIRM] swap for his exact Google review link (g.page/r/…)
  facebookReviews: "https://www.facebook.com/Mikes.Auto.Detailing.Services/reviews",
};

/* ──────────────────────────────── Hours ──────────────────────────────────── */
// day: 0 = Sunday … 6 = Saturday. 24-hour times, Eastern time.
export const hours: { day: number; open: string; close: string }[] = [
  { day: 1, open: "07:00", close: "18:00" },
  { day: 2, open: "07:00", close: "18:00" },
  { day: 3, open: "07:00", close: "18:00" },
  { day: 4, open: "07:00", close: "18:00" },
  { day: 5, open: "07:00", close: "18:00" },
  { day: 6, open: "09:00", close: "15:00" },
];
export const hoursDisplay = [
  { label: "Mon – Fri", value: "7:00 AM – 6:00 PM" },
  { label: "Saturday", value: "9:00 AM – 3:00 PM" },
  { label: "Sunday", value: "Closed" },
];

/* ─────────────────────────── Ratings (update as they change) ─────────────── */
export const ratings = {
  google: { rating: 5.0, reviewCount: null as number | null }, // [CONFIRM] Google review count → enables star rating in search schema
  facebook: { recommendPercent: 100, reviewCount: 18 },
};

/* ──────────────────────────────── Prices ─────────────────────────────────── */
export const prices = {
  fullDetail: 350, // Full Interior & Exterior Detail (regular, no polishing)
  ceramicFrom: 1500, // [CONFIRM] IGL ceramic packages "starting at" (an older post said $800)
  tintRemovalPerWindow: 20,
};

/* ──────────────────────────────── Promos ─────────────────────────────────── */
// Promos show automatically between startsAt and endsAt (Eastern time) and hide themselves after.
export type Promo = {
  id: string;
  title: string;
  kicker: string;
  startsAt: string; // ISO date-time with offset
  endsAt: string;
  banner: string; // one-liner for the top banner
  items: { name: string; price: string; was?: string; note: string; href: string }[];
  terms: string;
};

export const promos: Promo[] = [
  {
    id: "grand-opening-2026",
    title: "Grand Opening Specials",
    kicker: "New Leonardtown shop · 4 weeks only",
    startsAt: "2026-10-24T00:00:00-04:00", // [CONFIRM] official grand-opening date
    endsAt: "2026-11-21T23:59:59-05:00", // [CONFIRM] 4 weeks after grand opening
    banner: "Grand Opening Specials — Full Detail $279 · IGL Ceramic from $1,299",
    items: [
      { name: "Full Interior & Exterior Detail", price: "$279", was: "$350", note: "First 20 bookings. No polishing included.", href: "/auto-detailing" },
      { name: "IGL Ceramic Coating Packages", price: "from $1,299", was: "$1,500", note: "Save $201 · first 10 bookings.", href: "/ceramic-coating" },
      { name: "LowGlow Interior Ambient Lighting", price: "$100 off", note: "Qualifying installations.", href: "/lighting" },
      { name: "Starlight Headliner Install", price: "$150 off", note: "Qualifying installations.", href: "/lighting" },
    ],
    terms:
      "Valid for four weeks from the official grand-opening date. New bookings only. Full detail includes interior and exterior detailing; paint polishing is not included. $279 full-detail offer limited to the first 20 qualifying bookings. Ceramic coating offer limited to the first 10 qualifying bookings; $201 discount applies to the regular quoted package price. Ceramic coating packages start at $1,299 after discount for qualifying vehicles. Vehicle size, condition, preparation requirements, and service eligibility may affect final pricing. LowGlow and starlight headliner discounts apply to qualifying installations only. Offers cannot be combined. Booking deposits may be required; cancellation terms will be provided before payment.",
  },
  {
    id: "fall-exterior-2026",
    title: "Fall Exterior Special",
    kicker: "Beat the winter road salt",
    startsAt: "2026-09-22T00:00:00-04:00",
    endsAt: "2026-11-30T23:59:59-05:00", // [CONFIRM] still running? end date?
    banner: "Fall Exterior Special — $100 wash + 3-month sealant + tire coating",
    items: [
      {
        name: "Fall Exterior Special",
        price: "$100",
        note: "Detailed exterior wash + 3-month paint & exterior sealant + tire coating. Get protected before the salt trucks roll.",
        href: "/auto-detailing",
      },
    ],
    terms: "New bookings only. Final price depends on vehicle size and condition. Can't be combined with other offers.",
  },
];

/* ──────────────────────────────── Services ───────────────────────────────── */

export type ServiceSlug =
  | "auto-detailing"
  | "ceramic-coating"
  | "paint-correction"
  | "lighting"
  | "car-audio"
  | "window-tint"
  | "fleet";

export type Service = {
  slug: ServiceSlug;
  name: string;
  short: string;
  card: string; // home-page card blurb
  accent: "red" | "igl" | "neon";
  photo: PhotoSlug;
  photoAlt: string;
  seo: { title: string; description: string; h1: string };
  eyebrow: string;
  intro: string;
  included: { title: string; body: string }[];
  forWho: string[];
  proof: { headline: string; body: string; reviewIds: string[] };
  pricing: { label: string; value: string; note?: string }[];
  faqs: { q: string; a: string }[];
  feature?: "water" | "process" | "lights" | "audio";
};

export const services: Service[] = [
  {
    slug: "auto-detailing",
    name: "Auto Detailing",
    short: "Detailing",
    card: "Real interior & exterior detailing. Pet hair, carpets, engine bays, decon, tire coating — done right.",
    accent: "red",
    photo: "ford-explorer",
    photoAlt: "Grey Ford Explorer after a full exterior detail and paint sealant, parked on gravel in front of trees",
    seo: {
      title: "Auto Detailing in Leonardtown, MD | Interior & Exterior Detailing | Mike's Automotive Detailing",
      description:
        "REAL interior & exterior detailing in Leonardtown and Southern Maryland. Full detail $350, engine bays, paint decon, pet hair removal, fleet detailing. Call or text (301) 752-8505.",
      h1: "Auto Detailing in Leonardtown, MD",
    },
    eyebrow: "Interior · Exterior · Engine bay",
    intro:
      "Not a drive-thru wash. Real interior & exterior detailing by hand — paint, glass, trim, wheels, carpets, jambs, the stuff everyone else skips. Drop it off before work, pick it up after, and see your reflection in the paint.",
    included: [
      { title: "Exterior Detail", body: "Detailed exterior wash of paint, glass, trim, wheels and tires." },
      { title: "Interior Detail", body: "In-depth interior detail, carpet cleaning, pet hair removal and trunk cleaning." },
      { title: "Full Interior & Exterior", body: "The whole car, inside and out. Regular price $350. Polishing isn't included — that's paint correction." },
      { title: "Engine Bay & Frunk/Trunk", body: "Engine bay detail and frunk or trunk area detail, so it's clean where it counts." },
      { title: "Paint Decontamination", body: "Mechanical (clay) plus chemical (iron/fallout) decon to pull out what washing can't." },
      { title: "Tire Coating", body: "A rich black finish that finishes the look." },
      { title: "Fleet & Work Trucks", body: "Keep the whole fleet looking professional. We've detailed a local fleet since 2022." },
    ],
    forWho: [
      "Daily drivers that need a reset (kids, pets, road trips — we've seen it)",
      "Anyone selling or trading in and wants top dollar",
      "Busy people — drop off before work, pick up after",
      "Businesses with work trucks and fleets",
    ],
    proof: {
      headline: "“Could see my own reflection in my white paint.”",
      body: "Full exterior details, interiors kids have wrecked, and fleets kept spotless since 2022 — the reviews say it better than we can.",
      reviewIds: ["blake-a", "carah-p", "jacob-w"],
    },
    pricing: [
      { label: "Full Interior & Exterior Detail", value: "$350", note: "Polishing not included." },
      { label: "Exterior or interior only", value: "Quote", note: "Based on vehicle size and condition." },
    ],
    faqs: [
      { q: "Can I drop my car off before work?", a: "Yes. Plenty of customers drop off in the morning and pick up after work — the shop opens at 7:00 AM on weekdays." },
      { q: "Does the full detail include polishing?", a: "No. The full interior & exterior detail is a deep clean inside and out. Removing swirls and scratches is paint correction, which we quote separately." },
      { q: "Can you get pet hair out?", a: "Yes — pet hair removal is part of our interior detail." },
      { q: "Do you detail engine bays?", a: "Yes. Engine bay and frunk/trunk area details are available on their own or added to any detail." },
    ],
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating & Paint Protection",
    short: "Ceramic Coating",
    card: "IGL Certified Installer. Sealants to 4-year professional coatings — paint, glass, wheels, PPF, everything.",
    accent: "igl",
    photo: "gmc-at4x-igl",
    photoAlt: "Red GMC Sierra 2500HD AT4X with a fresh 4-year IGL ceramic coating, glossy paint reflecting the trees",
    seo: {
      title: "Ceramic Coating in Leonardtown, MD | IGL Certified Installer | Mike's Automotive Detailing",
      description:
        "IGL Coatings Dealer & Certified Installer in Leonardtown, MD. 3-month sealants, 6–9 month ceramic sealants and 4-year IGL professional ceramic coatings for paint, glass, wheels, PPF and more.",
      h1: "Ceramic Coating in Leonardtown, MD",
    },
    eyebrow: "IGL Coatings Certified Installer",
    intro:
      "Ceramic is our #1 specialty. As an IGL Coatings Dealer & Certified Installer we can coat everything — paint, glass, PPF, wheels, door jambs, engine bay, carbon fiber, trim and plastics. Water beads and slides right off. Dirt doesn't stick. Gloss for years.",
    included: [
      { title: "Paint coating", body: "Single-stage protection layered on properly prepped, decontaminated paint." },
      { title: "Glass coating", body: "Ceramic windshield and glass treatment so rain sheets off." },
      { title: "Wheel coating", body: "Brake dust and road grime wipe off instead of baking on." },
      { title: "PPF, trim & plastics", body: "Coat your PPF, carbon fiber, trim and plastics too." },
      { title: "Jambs & engine bay", body: "The places nobody looks — until they do." },
      { title: "Aftercare links", body: "You get the product links to maintain your finish the right way." },
    ],
    forWho: [
      "New vehicles you want to keep looking new",
      "Black and dark paint that shows everything",
      "Trucks that see Southern Maryland road salt every winter",
      "Show cars and weekend toys",
    ],
    proof: {
      headline: "“Like it came straight off the show room floor.”",
      body: "Jason's '86 Monte Carlo SS got a light polish and IGL Professional Arcane 4-year coating — updates by text, call and video the whole way.",
      reviewIds: ["jason-h", "anthony-o", "danielle-k"],
    },
    pricing: [
      { label: "3-Month Paint & Exterior Sealant", value: "Quote", note: "Great before winter." },
      { label: "6–9 Month Ceramic Sealant", value: "Quote" },
      { label: "IGL Professional 4-Year Ceramic Coating", value: `from $${prices.ceramicFrom.toLocaleString()}`, note: "Depends on vehicle size and condition." },
    ],
    faqs: [
      { q: "What's the difference between a sealant and a ceramic coating?", a: "Think of it as a ladder. Our 3-month paint & exterior sealant adds gloss, water repellency and winter protection. The 6–9 month ceramic sealant lasts longer. The IGL Professional 4-year ceramic coating is the top tier — the longest-lasting protection, and it can go on everything." },
      { q: "Are you IGL certified?", a: "Yes. We're an IGL Coatings Dealer & Certified Installer." },
      { q: "Can you coat wheels, glass, PPF and the engine bay?", a: "Yes — everything: paint, glass, PPF, wheels, door jambs, engine bay, carbon fiber, trim and plastics." },
      { q: "How much does a ceramic coating cost?", a: `IGL ceramic coating packages start at $${prices.ceramicFrom.toLocaleString()}, depending on vehicle size and condition. Text a few photos for an exact quote.` },
      { q: "How do I take care of it after?", a: "We send you the product links to maintain the finish, and walk you through it when you pick up." },
    ],
    feature: "water",
  },
  {
    slug: "paint-correction",
    name: "Paint Correction",
    short: "Paint Correction",
    card: "Swirls, haze, scratches, etched water spots, wet-sanding marks. Cut, polish, enhance — within safe limits.",
    accent: "red",
    photo: "mike-polisher-c8",
    photoAlt: "Mike Tippett holding a dual-action polisher beside a black C8 Corvette",
    seo: {
      title: "Paint Correction in Leonardtown, MD | Swirl & Scratch Removal | Mike's Automotive Detailing",
      description:
        "Paint correction in Southern Maryland: compounding, polishing and paint enhancement to remove swirl marks, haze, scratches and etched water spots. Headlight restoration too.",
      h1: "Paint Correction in Leonardtown, MD",
    },
    eyebrow: "Cut · Polish · Enhance",
    intro:
      "Swirl marks, haze, scratches, wet-sanding marks, polish and wax stains — even a previous detailer's chemical spotting and etched water spots. We correct within safe limits and we'll tell you the truth about what your clear coat can take.",
    included: [
      { title: "Heavy compounding cut", body: "For deeper defects — only when the paint can afford it." },
      { title: "Polish", body: "Refines the finish to that deep, wet gloss." },
      { title: "Paint enhancement", body: "A lighter one-step that pops gloss and color without removing much clear." },
      { title: "Scratch removal", body: "Spot correction for the scratches that bug you every time you walk up." },
      { title: "Headlight restoration", body: "Yellow, hazy headlights back to clear." },
      { title: "Lock it in", body: "Finish with a sealant or IGL ceramic coating so it stays that way." },
    ],
    forWho: [
      "Black paint that looks hazy grey in the sun",
      "Cars with swirls from automatic washes",
      "Anyone burned by a previous detailer",
      "New cars with thin factory clear coat",
    ],
    proof: {
      headline: "Honest advice > upselling.",
      body: "A 2025 Z06 came in. GM's factory clear coat is thin, so instead of a heavy cut Mike recommended a polish — leaving the owner clear coat for UV protection down the road. And a Scat Pack with wet-sanding marks, acid-proof etched water spots and swirling so bad the black looked hazy grey? It left glossy and protected.",
      reviewIds: ["danielle-k", "jason-h"],
    },
    pricing: [{ label: "Paint correction", value: "Quote", note: "Depends on paint condition — text photos in daylight." }],
    faqs: [
      { q: "Do you do paint correction on thin factory clear coat?", a: "Yes — carefully. On a 2025 Z06 with GM's thin factory clear, Mike recommended a polish instead of a heavy cut so the owner keeps clear coat for future UV protection. We'll always recommend the safest option that gets the result." },
      { q: "Can you remove every scratch?", a: "We remove what's safely removable. If a scratch is through the clear coat, we'll tell you straight instead of burning through your paint chasing it." },
      { q: "Can you fix etched water spots?", a: "Often, yes. We've corrected etched water spots that acid couldn't remove — within safe limits of your clear coat." },
      { q: "Do you restore headlights?", a: "Yes, headlight restoration is available on its own or with any detail." },
    ],
    feature: "process",
  },
  {
    slug: "lighting",
    name: "Custom Lighting",
    short: "Lighting",
    card: "LowGlow Certified Dealer & Installer. Underglow, rock lights, starlight headliners, ambient kits — no exposed wiring.",
    accent: "neon",
    photo: "shop-hex-ceiling",
    photoAlt: "Hexagon LED light ceiling glowing over the bay at the Leonardtown shop",
    seo: {
      title: "Underglow, Starlight Headliners & Ambient Lighting in Leonardtown, MD | LowGlow Certified | Mike's",
      description:
        "LowGlow Certified Dealer & Installer in Southern Maryland. Exterior underglow, rock lights, starlight headliners and interior ambient lighting installed like factory — no exposed wiring.",
      h1: "Custom Lighting in Leonardtown, MD",
    },
    eyebrow: "LowGlow Certified Dealer & Installer",
    intro:
      "Underglow is widely hated — but widely loved if done right. We install LowGlow lighting like it came from the factory: clean connections, no exposed components ANYWHERE. Buy a kit, get a kit installed, or both.",
    included: [
      { title: "Exterior underglow", body: "Turn heads day or night — wired clean, switched right." },
      { title: "Rock lights", body: "For trucks and Jeeps that actually go places." },
      { title: "Starlight headliners", body: "Bring the night sky inside your ride." },
      { title: "Interior ambient lighting", body: "Custom colors, endless vibes, factory-looking install." },
      { title: "Vehicle accessories", body: "Backup cameras, dash cameras — all vehicle accessories installed." },
      { title: "& more", body: "Ask about anything that lights up." },
    ],
    forWho: [
      "Cars & trucks that deserve a night-time presence",
      "Anyone who's seen a bad install and wants it done right",
      "DIYers who just want the kit",
      "People who want factory-looking OEM installs",
    ],
    proof: {
      headline: "No exposed wiring. Anywhere.",
      body: "On a 2025 C8 Z06 underglow install, Mike re-ran and extended the supplied harness so the cutoff switch sits inside the car and nothing is exposed at the battery. Clean connections now means no long-term issues later.",
      reviewIds: ["danielle-k", "anthony-o"],
    },
    pricing: [
      { label: "LowGlow kits", value: "Buy / install / both" },
      { label: "Install", value: "Quote", note: "Depends on the vehicle and kit." },
    ],
    faqs: [
      { q: "Will your lighting install look factory?", a: "That's the whole point. Clean connections and no exposed components anywhere — we go the extra mile so installs don't cause long-term issues." },
      { q: "Can I just buy a LowGlow kit?", a: "Yes. Buy a kit, get a kit installed, or both. We're a LowGlow Certified Dealer & Installer." },
      { q: "Do you install backup and dash cameras?", a: "Yes — backup cameras, dash cameras and all vehicle accessories." },
    ],
    feature: "lights",
  },
  {
    slug: "car-audio",
    name: "Custom Car Audio",
    short: "Audio",
    card: "Factory upgrades to custom enclosures. Come in and test it with any song you want.",
    accent: "red",
    photo: "shop-hex-bay",
    photoAlt: "The new Leonardtown shop bay under a hexagon LED ceiling, where customers can demo car audio",
    seo: {
      title: "Custom Car Audio in Leonardtown, MD | Subwoofers & Stereo Upgrades | Mike's Automotive Detailing",
      description:
        "Car audio in Southern Maryland: factory stereo upgrades, custom subwoofer enclosures and speaker installs with clean wiring. Come test the system with your own song.",
      h1: "Custom Car Audio in Leonardtown, MD",
    },
    eyebrow: "Budget builds to custom",
    intro:
      "Want to shake the neighborhood? From budget-friendly factory upgrades to custom-made audio equipment — subwoofer enclosures, speakers, and top-notch clean wiring. Come in and play whatever song you'd like.",
    included: [
      { title: "Factory stereo upgrades", body: "Better sound without ripping the dash apart." },
      { title: "Custom subwoofer enclosures", body: "Built for your vehicle and your space." },
      { title: "Speaker installs", body: "Clarity you can actually hear at highway speed." },
      { title: "Clean wiring", body: "Top-notch, hidden, done right — same standard as our lighting." },
      { title: "In-shop listening demo", body: "Bring your playlist. Hear it before you buy." },
    ],
    forWho: ["Factory systems that sound flat", "Bass heads", "Anyone who wants it clean and reliable", "Budget builds — we'll make it hit"],
    proof: {
      headline: "Come in. Play any song.",
      body: "Pick your track, turn it up, and hear the difference in person at the shop on Point Lookout Rd.",
      reviewIds: ["anthony-o"],
    },
    pricing: [{ label: "Audio builds", value: "Quote", note: "Budget to custom." }],
    faqs: [
      { q: "Can I hear the audio before I buy?", a: "Yes! Come in and play whatever song you'd like." },
      { q: "Do you do budget builds?", a: "Yes — from budget builds to custom-made audio equipment." },
    ],
    feature: "audio",
  },
  {
    slug: "window-tint",
    name: "Window Tint",
    short: "Tint",
    card: "Bubble-free tint on the trucks other shops won't touch. Tint removal from $20/window.",
    accent: "red",
    photo: "toyota-tacoma",
    photoAlt: "Black Toyota Tacoma front end after an exterior detail",
    seo: {
      title: "Window Tint & Tint Removal in Leonardtown, MD | Mike's Automotive Detailing",
      description:
        "Window tint installs and tint removal from $20/window in Leonardtown and Southern Maryland. Clean, bubble-free installs — even on trucks that are tough to tint.",
      h1: "Window Tint in Leonardtown, MD",
    },
    eyebrow: "Install · Removal",
    intro:
      "Clean, bubble-free window tint — even on trucks that are notoriously difficult to tint. Got pulled over for your tint, or want to go darker or lighter? Tint removal starts at $20 a window.",
    included: [
      { title: "Window tint installs", body: "Flawless, clean edges, no bubbles." },
      { title: "Tint removal", body: `From $${prices.tintRemovalPerWindow}/window — glue and all.` },
      { title: "Go darker or lighter", body: "Remove the old film and start fresh." },
    ],
    forWho: ["Got a ticket for your tint", "Old purple, bubbling film", "Trucks other shops passed on", "Fresh new rides"],
    proof: {
      headline: "“Guess Mike didn't get the memo.”",
      body: "A truck that's notoriously difficult to tint — not a single blemish or bubble.",
      reviewIds: ["fb-tint"],
    },
    pricing: [
      { label: "Tint removal", value: `from $${prices.tintRemovalPerWindow}/window` },
      { label: "Tint install", value: "Quote" },
    ],
    faqs: [
      { q: "Do you remove tint?", a: `Yes, tint removal starts at $${prices.tintRemovalPerWindow} per window.` },
      { q: "How dark can I go?", a: "Ask us in the shop — we'll talk through your options for your vehicle. We don't guess at legal limits over the internet." },
    ],
  },
  {
    slug: "fleet",
    name: "Fleet & Work Truck Detailing",
    short: "Fleet",
    card: "Work trucks and fleets kept spotless — a local fleet has trusted us since 2022.",
    accent: "red",
    photo: "gmc-at4x-igl",
    photoAlt: "Red heavy-duty GMC pickup truck, freshly detailed and coated",
    seo: {
      title: "Fleet & Work Truck Detailing in Southern Maryland | Mike's Automotive Detailing",
      description:
        "Fleet and work truck detailing for Southern Maryland businesses. Keep every vehicle looking professional. Trusted by a local fleet since 2022.",
      h1: "Fleet & Work Truck Detailing in Southern Maryland",
    },
    eyebrow: "For businesses",
    intro:
      "Your trucks are rolling billboards. We keep business fleets and work trucks spotless so your company looks as professional as the work you do — on a schedule that works for you.",
    included: [
      { title: "Interior & exterior", body: "Work-truck interiors that actually come clean." },
      { title: "Protection", body: "Sealants or ceramic to make the next wash faster." },
      { title: "Scheduling", body: "Drop-off windows that keep your crews moving." },
    ],
    forWho: ["Contractors", "Service companies", "Dealerships", "Anyone running more than one vehicle"],
    proof: {
      headline: "Spotless since 2022.",
      body: "A commercial customer has trusted Mike with their truck fleet since 2022.",
      reviewIds: ["kirk-b"],
    },
    pricing: [{ label: "Fleet programs", value: "Quote", note: "Based on fleet size and schedule." }],
    faqs: [{ q: "Do you detail fleets and work trucks?", a: "Yes. We've kept a local fleet spotless since 2022. Call or text to set up a schedule." }],
  },
];

export const serviceBySlug = (slug: ServiceSlug) => services.find((s) => s.slug === slug)!;

/** Home-page grid: 6 cards (Tint card also covers accessories). */
export const homeServiceCards: { slug: ServiceSlug; title: string; blurb: string; icon: string }[] = [
  { slug: "auto-detailing", title: "Auto Detailing", blurb: services[0].card, icon: "spray" },
  { slug: "ceramic-coating", title: "Ceramic Coating", blurb: services[1].card, icon: "shield" },
  { slug: "paint-correction", title: "Paint Correction", blurb: services[2].card, icon: "polish" },
  { slug: "lighting", title: "Custom Lighting", blurb: services[3].card, icon: "bulb" },
  { slug: "car-audio", title: "Car Audio", blurb: services[4].card, icon: "speaker" },
  { slug: "window-tint", title: "Tint & Accessories", blurb: "Bubble-free tint, tint removal from $20/window, backup & dash cams — all vehicle accessories installed.", icon: "tint" },
];

/** Options shown in the quote builder. */
export const quoteServiceOptions = [
  "Exterior Detail",
  "Interior Detail",
  "Full Interior & Exterior Detail",
  "Engine Bay / Frunk Detail",
  "Paint Decontamination",
  "3-Month Sealant",
  "6–9 Month Ceramic Sealant",
  "IGL 4-Year Ceramic Coating",
  "Glass / Wheel Ceramic",
  "Paint Correction",
  "Scratch Removal",
  "Headlight Restoration",
  "Underglow / Rock Lights",
  "Starlight Headliner",
  "Ambient Lighting",
  "Car Audio",
  "Window Tint",
  "Tint Removal",
  "Backup / Dash Camera",
  "Fleet Detailing",
];

/* ──────────────────────────── Detailing process ──────────────────────────── */
export const processSteps: { title: string; body: string; photo?: PhotoSlug; alt?: string }[] = [
  { title: "Detailed Wash", body: "Foam, contact wash, wheels, tires, jambs. Every panel, by hand.", photo: "z06-foam-wash", alt: "Corvette Z06 covered in thick foam during a detailed wash" },
  { title: "Mechanical Decontamination", body: "Clay pulls bonded contamination out of the paint so it feels like glass.", photo: "jeep-gladiator", alt: "Jeep Gladiator after a wash plus mechanical and chemical decontamination" },
  { title: "Chemical Decontamination", body: "Iron and fallout remover dissolves what clay can't reach.", photo: "ford-explorer", alt: "Ford Explorer after a full exterior detail with paint decontamination" },
  { title: "Compound (if needed)", body: "Only when the paint needs it — and only when the clear coat can afford it.", photo: "mike-polisher-c8", alt: "Mike holding a polisher next to a black Corvette" },
  { title: "Polish", body: "Refine to a deep, wet, mirror finish.", photo: "monte-carlo-gloss", alt: "Mirror reflections in the black paint of an '86 Monte Carlo SS after a light polish and IGL coating" },
  { title: "Ceramic Coating", body: "Lock it in with IGL protection that lasts.", photo: "gmc-at4x-igl", alt: "Red GMC AT4X with a glossy 4-year IGL ceramic coating" },
];

/* ──────────────────────────── Protection ladder ──────────────────────────── */
export const protectionTiers = [
  { name: "Paint & Exterior Sealant", duration: "3 months", level: 1, points: ["Gloss boost", "Water repellency", "Winter protection"], price: "Quote" },
  { name: "Ceramic Sealant", duration: "6–9 months", level: 2, points: ["Longer-lasting slickness", "Strong water beading", "Easier washes"], price: "Quote" },
  {
    name: "IGL Professional Ceramic Coating",
    duration: "4 years",
    level: 3,
    points: ["Our top tier", "Paint, glass, PPF, wheels, jambs, engine bay, carbon, trim & plastics", "Product links for aftercare"],
    price: `from $${prices.ceramicFrom.toLocaleString()}`,
  },
];

/* ──────────────────────────────── Reviews ────────────────────────────────── */
// Real quotes only. Trim with "…" if needed — never change the words.
export type Review = { id: string; name: string; source: "Google" | "Facebook" | "Google & Facebook"; quote: string; tags: ServiceSlug[] };

export const reviews: Review[] = [
  {
    id: "jason-h",
    name: "Jason H.",
    source: "Google",
    quote:
      "Mike is the best, great personality, great customer service, very professional, and very knowledgeable! He ceramic coated my 86 monte carlo SS and made it look like it came straight off the show room floor… He kept his word on the time limit and kept me informed every step of the way via text, calls, and video. He is the one and only person I will trust with detailing…",
    tags: ["ceramic-coating", "paint-correction"],
  },
  { id: "blake-a", name: "Blake A.", source: "Google", quote: "Mike hooked me up with a full exterior detail and did an amazing job. Could see my own reflection in my white paint. Would 100% recommend.", tags: ["auto-detailing"] },
  { id: "kirk-b", name: "Kirk B.", source: "Google", quote: "Mike has been taking care of our fleet since 2022, and has always left the trucks spotless. 100% recommend to anyone that needs professional detailing done!!", tags: ["fleet", "auto-detailing"] },
  { id: "anthony-o", name: "Anthony O.", source: "Google", quote: "Mike is definitely the man for all of your detailing and ceramic coating needs!", tags: ["ceramic-coating"] },
  {
    id: "danielle-k",
    name: "Danielle K.",
    source: "Google & Facebook",
    quote:
      "…His attention to detail is unmatched, and you can tell he puts his heart into what he does. He doesn't just rush through a job to get it done; he takes his time and makes sure everything is done right. My car looks absolutely amazing…",
    tags: ["auto-detailing"],
  },
  { id: "carah-p", name: "Carah P.", source: "Google", quote: "Had Michael detail my car and I swear it looks better than when I bought it! My kids take a toll on my car and he was able to make it look so good!…", tags: ["auto-detailing"] },
  { id: "jacob-w", name: "Jacob W.", source: "Facebook", quote: "Took my RAV4 to Mike for an exterior detail and it looks great. I dropped it off before work and picked it up after…", tags: ["auto-detailing"] },
  {
    id: "fb-tint",
    name: "Facebook review",
    source: "Facebook",
    quote:
      "…not a single blemish or bubble. Was fast, courteous, and just an all around real professional. These trucks are notoriously difficult to tint I've been told, guess Mike didn't get the memo.",
    tags: ["window-tint"],
  },
];
export const reviewById = (id: string) => reviews.find((r) => r.id === id);

/* ──────────────────────────────── Gallery ────────────────────────────────── */
export type GalleryCategory = "Detailing" | "Ceramic" | "Lighting" | "Audio";
export const galleryCategories: GalleryCategory[] = ["Detailing", "Ceramic", "Lighting", "Audio"];
export type GalleryItem = {
  /** A real photo… */
  photo?: PhotoSlug;
  /** …or a drawn illustration when there's no clean photo yet. */
  art?: "underglow";
  title: string;
  caption: string;
  alt: string;
  categories: GalleryCategory[];
};
export const gallery: GalleryItem[] = [
  { photo: "gmc-at4x-igl", title: "2026 GMC 2500HD AT4X", caption: "Wash, mechanical + chemical decon, polish, 4-year IGL ceramic coating.", alt: "Red 2026 GMC Sierra 2500HD AT4X after polish and 4-year IGL ceramic coating", categories: ["Ceramic", "Detailing"] },
  { photo: "monte-carlo-gloss", title: "Procharged 434ci '86 Monte Carlo SS", caption: "Light polish + IGL Professional Arcane 4-year ceramic coating.", alt: "Mirror-like reflections in the black paint of an '86 Monte Carlo SS after IGL coating", categories: ["Ceramic"] },
  { photo: "z06-frunk-engine-bay", title: "2025 C8 Z06", caption: "Wash, frunk + engine bay detail, decon, paint enhancement, professional 4-year ceramic on everything — glass, paint, PPF, wheels, jambs, engine bay, carbon fiber, trim.", alt: "Detailed frunk and engine bay of a 2025 Corvette C8 Z06", categories: ["Ceramic", "Detailing"] },
  { photo: "jeep-gladiator", title: "Jeep Gladiator", caption: "Detailed wash, mechanical + chemical decon, 6-month ceramic sealant.", alt: "Grey Jeep Gladiator after wash, decontamination and ceramic sealant", categories: ["Detailing", "Ceramic"] },
  { photo: "ford-explorer", title: "2021 Ford Explorer", caption: "Full exterior detail, paint decon, 6–9 month sealant.", alt: "Grey 2021 Ford Explorer after a full exterior detail", categories: ["Detailing"] },
  { art: "underglow", title: "2025 C8 Z06 — underglow install", caption: "Hidden-wiring underglow install: harness re-run and extended so the cutoff switch sits inside — nothing exposed at the battery. (Illustration — ask Mike to see the real thing.)", alt: "Illustration of a sports car with glowing cyan-to-magenta underglow", categories: ["Lighting"] },
  { photo: "z06-foam-wash", title: "2025 C8 Z06 — the wash", caption: "Foam first, always. Every detail starts with a detailed wash.", alt: "Corvette Z06 covered in thick foam during a detailed wash", categories: ["Detailing"] },
  { photo: "chevy-trax", title: "2025 Chevy Trax", caption: "Polish + ceramic coating.", alt: "Silver 2025 Chevy Trax after polish and ceramic coating", categories: ["Ceramic"] },
  { photo: "toyota-tacoma", title: "Toyota Tacoma", caption: "Exterior detail.", alt: "Black Toyota Tacoma after an exterior detail", categories: ["Detailing"] },
  { photo: "shop-hex-bay", title: "The new shop", caption: "The hex-lit bay at 26005 Point Lookout Rd — where the audio demos and the gloss happen.", alt: "Black supercar with doors open under the hexagon LED ceiling of the new Leonardtown shop", categories: ["Lighting", "Audio"] },
  { photo: "mike-pressure-wash", title: "On the job", caption: "Real person, real work.", alt: "Mike pressure-washing a car, wearing a Mike's Automotive Detailing IGL shirt", categories: ["Detailing"] },
];

/* ─────────────────────────────── General FAQ ─────────────────────────────── */
const travelAnswer =
  business.offersMobileService === true
    ? "Yes — we will travel! Call or text to set up on-site service anywhere in Southern Maryland."
    : business.offersMobileService === false
      ? "Our work is done at the new shop on Point Lookout Rd, where we have the lighting, power and space to do it right."
      : "Most work happens at the new shop on Point Lookout Rd. Need on-site service? Call or text Mike and ask — he's covered all of Southern Maryland.";

export const faqs: { q: string; a: string }[] = [
  services[1].faqs[0],
  services[1].faqs[1],
  services[1].faqs[2],
  services[2].faqs[0],
  services[3].faqs[0],
  services[3].faqs[1],
  services[4].faqs[0],
  services[5].faqs[0],
  services[0].faqs[0],
  services[6].faqs[0],
  {
    q: "Where are you, and what are your hours?",
    a: "26005 Point Lookout Rd, Leonardtown, MD 20650 — look for our sign on the road board. Mon–Fri 7:00 AM–6:00 PM, Saturday 9:00 AM–3:00 PM, closed Sunday. Stop by any time we're open — we love when customers come in and chat.",
  },
  { q: "Do you travel?", a: travelAnswer },
];

/* ──────────────────────────────── Navigation ─────────────────────────────── */
export const nav = [
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Visit", href: "/contact" },
];
