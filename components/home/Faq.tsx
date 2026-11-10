import { faqSchema } from "@/lib/schema";
import { JsonLd } from "../JsonLd";
import { PlusIcon } from "../icons";
import { Container, SectionHead } from "../ui";

export function Faq({ items, title, id = "faq" }: { items: { q: string; a: string }[]; title?: string; id?: string }) {
  return (
    <section id={id} className="relative py-24 sm:py-32" aria-labelledby={`${id}-title`}>
      <JsonLd data={faqSchema(items)} />
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead
          eyebrow="FAQ"
          title={
            <span id={`${id}-title`}>
              <span className="chrome">{title ?? "Straight answers."}</span>
            </span>
          }
          lead="Don't see yours? Text Mike — he answers."
        />
        <div className="grid gap-3">
          {items.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-carbon ring-1 ring-white/10 open:ring-white/25" data-reveal>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-extrabold text-white [&::-webkit-details-marker]:hidden">
                {f.q}
                <PlusIcon size={20} className="shrink-0 text-red-text transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-chrome/90">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
