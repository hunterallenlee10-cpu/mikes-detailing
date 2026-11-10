import { business, links } from "@/content/site";
import { CalendarIcon, ChatIcon, MailIcon, PhoneIcon } from "../icons";
import { Container, SectionHead } from "../ui";
import { QuoteBuilder } from "./QuoteBuilder";

export function QuoteSection({ initialServices, title, headingAs = "h2" }: { initialServices?: string[]; title?: string; headingAs?: "h1" | "h2" }) {
  const rows = [
    { href: links.tel, label: "Call", value: business.phone.display, Icon: PhoneIcon, track: "call" },
    { href: links.sms, label: "Text", value: business.phone.display, Icon: ChatIcon, track: "text" },
    { href: links.email, label: "Email", value: business.email, Icon: MailIcon, track: "email" },
    ...(business.bookingUrl ? [{ href: business.bookingUrl, label: "Book online", value: "Pick a time", Icon: CalendarIcon, track: "book_online" }] : []),
  ];
  return (
    <section id="quote" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32" aria-labelledby="quote-title">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_10%_30%,rgb(227_25_31/0.14),transparent_70%)]" />
      <Container className="relative grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
        <div>
          <SectionHead
            eyebrow="Free quote"
            as={headingAs}
            title={
              <span id="quote-title">
                <span className="chrome">{title ?? "Get your price."}</span> <span className="text-red">60 seconds.</span>
              </span>
            }
            lead="Tell us about the ride. Mike gets back to you personally — usually by text."
          />
          <ul className="mt-8 grid gap-2" data-reveal>
            {rows.map(({ href, label, value, Icon, track }) => (
              <li key={label}>
                <a
                  href={href}
                  data-track={track}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex min-h-14 items-center gap-4 rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/[0.07] hover:ring-white/25"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red/15 text-red-text">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="eyebrow block text-muted">{label}</span>
                    <span className="block truncate font-extrabold text-white">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <QuoteBuilder initialServices={initialServices} />
      </Container>
    </section>
  );
}
