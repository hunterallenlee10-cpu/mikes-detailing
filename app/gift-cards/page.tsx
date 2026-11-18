import { business, giftCards, prices } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand } from "@/components/home/CtaBand";
import { GiftCardPicker } from "@/components/giftcards/GiftCardPicker";
import { Container, SectionHead } from "@/components/ui";

export const metadata = pageMeta({
  title: "Gift Cards | Mike's Automotive Detailing, Leonardtown MD",
  description: `Give a detail, ceramic coating or install from ${business.name} in Leonardtown, MD. Pick any amount — a full interior & exterior detail is $${prices.fullDetail}.`,
  path: "/gift-cards",
});

export default function GiftCardsPage() {
  const online = Boolean(giftCards.squareUrl);
  const payApp = giftCards.paypal ? "PayPal" : giftCards.venmo ? "Venmo" : "";
  const steps = [
    { t: "Pick an amount", b: `Any amount works. A full interior & exterior detail is $${prices.fullDetail}.` },
    online
      ? { t: "Pay online", b: "Checkout takes a minute. The gift card is emailed or texted to whoever you choose." }
      : payApp
        ? { t: `Pay with ${payApp}`, b: `Tap “Pay with ${payApp}” — the amount you picked is filled in. Rather pay another way? Text Mike.` }
        : { t: "Text Mike", b: "Tap “Text Mike to order” — he'll send you a quick way to pay." },
    online
      ? { t: "They book", b: "They can keep it in their email or add it to Apple Wallet, then show it at the shop." }
      : payApp
        ? { t: "Tell Mike who it's for", b: "Text Mike after you pay. He sends a gift certificate to print or forward — they show it at the shop." }
        : { t: "Send it", b: "Mike sends you a gift certificate to print or forward — they show it at the shop." },
  ];
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gift Cards", path: "/gift-cards" }])} />
      <section className="relative pt-36 pb-24 sm:pt-44">
        <div aria-hidden className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(50%_80%_at_50%_0%,rgb(227_25_31/0.16),transparent_70%)]" />
        <Container className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHead
              as="h1"
              eyebrow="Gift cards"
              title={
                <>
                  <span className="chrome">Give a clean ride.</span> <span className="text-red">Any amount.</span>
                </>
              }
              lead="The car person who has everything still wants a detail. Good toward anything at the shop — detailing, ceramic coating, tint, lighting or audio."
            />
            <ol className="mt-10 grid gap-3">
              {steps.map((s, i) => (
                <li key={s.t} className="flex gap-4 rounded-2xl bg-carbon p-5 ring-1 ring-white/10">
                  <span className="hex-clip font-wide flex h-10 w-11 shrink-0 items-center justify-center bg-red text-sm font-black text-white">{i + 1}</span>
                  <span>
                    <span className="block font-extrabold text-white uppercase">{s.t}</span>
                    <span className="mt-1 block text-chrome/85">{s.b}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:pt-24">
            <GiftCardPicker />
            <p className="mt-5 text-xs leading-relaxed text-muted">{giftCards.terms}</p>
          </div>
        </Container>
      </section>
      <CtaBand title="Detail makes a good gift." />
    </>
  );
}
