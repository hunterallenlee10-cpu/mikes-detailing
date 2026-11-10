import { business } from "@/content/site";
import { CallTextButtons, Container, QuoteButton } from "../ui";

export function CtaBand({ title = "Because Detail Matters." }: { title?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden py-24 sm:py-32">
      {/* the logo's red sunset stripes */}
      <div aria-hidden className="absolute inset-0 flex flex-col justify-center gap-[clamp(6px,1.2vw,14px)] opacity-90">
        {[18, 15, 12, 10, 8, 6, 5, 4, 3].map((h, i) => (
          <span
            key={i}
            className="block bg-gradient-to-r from-transparent via-red to-transparent"
            style={{ height: `clamp(${h * 0.5}px, ${h * 0.14}vw, ${h}px)`, opacity: 0.9 - i * 0.08 }}
          />
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_50%,rgb(10_10_11/0.92),rgb(10_10_11/0.55))]" />
      <Container className="relative text-center">
        <p className="eyebrow text-red-text" data-reveal>
          {business.name}
        </p>
        <h2 id="cta-title" className="mx-auto mt-4 max-w-5xl text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] font-black uppercase" data-reveal>
          <span className="chrome">{title}</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-chrome/90" data-reveal>
          Call or text {business.phone.display}. Tell us the ride, we&apos;ll tell you the plan.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3" data-reveal>
          <CallTextButtons />
          <QuoteButton variant="chrome" />
        </div>
      </Container>
    </section>
  );
}
