import { business, referral } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand } from "@/components/home/CtaBand";
import { ReferLinkMaker } from "@/components/referral/ReferLinkMaker";
import { Container, SectionHead } from "@/components/ui";

export const metadata = pageMeta({
  title: "Refer a Friend | Mike's Automotive Detailing, Leonardtown MD",
  description: `Send a friend to ${business.name} with your own referral link. They get ${referral.forFriend}, you get ${referral.forYou}.`,
  path: "/refer",
});

const steps = [
  { t: "Make your link", b: "Type your name below. Your personal link appears instantly." },
  { t: "Send it", b: "Text it, share it, post it — whoever opens it is tagged as your referral." },
  { t: "You both save", b: `When they book their first service, they get ${referral.forFriend} and you get ${referral.forYou}.` },
];

export default function ReferPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Refer a Friend", path: "/refer" }])} />
      <section className="relative pt-36 pb-24 sm:pt-44">
        <div aria-hidden className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(50%_80%_at_50%_0%,rgb(227_25_31/0.16),transparent_70%)]" />
        <Container className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHead
              as="h1"
              eyebrow="Refer a friend"
              title={
                <>
                  <span className="chrome">Send a friend.</span> <span className="text-red">You both save.</span>
                </>
              }
              lead={`Most of Mike's customers come from word of mouth. Know someone whose ride needs help? Send them your link — they get ${referral.forFriend}, and you get ${referral.forYou}.`}
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
            <ReferLinkMaker />
            <p className="mt-5 text-xs leading-relaxed text-muted">{referral.terms}</p>
          </div>
        </Container>
      </section>
      <CtaBand title="Good work travels." />
    </>
  );
}
