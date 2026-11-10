import Link from "next/link";
import { business, hoursDisplay, links, nav, services } from "@/content/site";
import { Container, Stripes } from "../ui";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "../icons";

export function Footer() {
  const year = 2026;
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-carbon pt-16 pb-32 lg:pb-12">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-red/10 blur-3xl" />
      <Container className="relative grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-320.webp" alt={`${business.name} logo`} width={320} height={239} loading="lazy" className="h-20 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            {business.positioning}. IGL Coatings Certified Installer & LowGlow Certified Dealer serving Leonardtown and all of Southern Maryland since {business.established}.
          </p>
          <div className="mt-6 flex gap-2">
            {[
              { href: business.socials.instagram, label: "Instagram", Icon: InstagramIcon },
              { href: business.socials.facebook, label: "Facebook", Icon: FacebookIcon },
              { href: business.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${business.name} on ${label}`}
                data-track={`social_${label.toLowerCase()}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white ring-1 ring-white/15 transition hover:bg-red hover:ring-red"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="eyebrow text-white">Services</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="text-muted transition hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-white">Explore</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {[{ label: "Home", href: "/" }, ...nav, { label: "Get a Quote", href: "/#quote" }, { label: "Privacy", href: "/privacy" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted transition hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow text-white">Visit the shop</h2>
          <address className="mt-4 text-sm leading-relaxed text-muted not-italic">
            <a href={links.directions} target="_blank" rel="noopener noreferrer" data-track="directions" className="hover:text-white">
              {business.address.street}
              <br />
              {business.address.city}, {business.address.region} {business.address.postalCode}
            </a>
            <br />
            <a href={links.tel} data-track="call" className="mt-3 inline-block text-lg font-extrabold text-white hover:text-red-text">
              {business.phone.display}
            </a>
            <br />
            <a href={links.email} data-track="email" className="inline-block py-1.5 break-all hover:text-white">
              {business.email}
            </a>
          </address>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {hoursDisplay.map((h) => (
              <div key={h.label} className="contents">
                <dt className="text-muted">{h.label}</dt>
                <dd className="text-white">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      <Container className="relative mt-16">
        <Stripes className="w-40 opacity-80" />
        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}. {business.tagline}.
          </p>
          {business.websiteCredit.show && <p>{business.websiteCredit.label}</p>}
        </div>
      </Container>
    </footer>
  );
}
