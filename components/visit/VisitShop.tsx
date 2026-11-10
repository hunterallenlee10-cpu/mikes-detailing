import { business, hoursDisplay, links } from "@/content/site";
import { ArrowIcon, ClockIcon, PinIcon } from "../icons";
import { Photo } from "../Photo";
import { Button, Container, SectionHead } from "../ui";
import { ShopMap } from "./ShopMap";
import { OpenNow } from "./OpenNow";

export function VisitShop({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <section id="visit" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="visit-title">
      <Container>
        <SectionHead
          eyebrow="Visit the shop"
          as={headingAs}
          title={
            <span id="visit-title">
              <span className="chrome">Lights on</span> <span className="text-red">in the bay.</span>
            </span>
          }
          lead="Our new Leonardtown shop is open. Look for our sign on the road board on Point Lookout Rd."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] ring-1 ring-white/15" data-reveal>
            <Photo
              slug="shop-hex-bay"
              alt="Inside the new shop: a black supercar with doors up under a hexagon LED light ceiling"
              sizes="(min-width: 1024px) 40vw, 92vw"
              position="50% 35%"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jet via-jet/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 grid gap-3 p-6">
              <p className="font-wide text-xl font-black text-white uppercase">More than a detail shop</p>
              <ul className="grid gap-1.5 text-sm text-chrome">
                <li>• Detailing products &amp; Mike&apos;s merch — hoodies too</li>
                <li>• Test the car audio with any song you pick</li>
                <li>• Questions, quotes, or just talking cars — come in and chat</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-6 rounded-[2rem] bg-carbon p-6 ring-1 ring-white/10 sm:grid-cols-2 sm:p-8" data-reveal>
              <div>
                <p className="eyebrow flex items-center gap-2 text-muted">
                  <PinIcon size={16} /> Address
                </p>
                <address className="mt-3 text-lg leading-snug font-bold text-white not-italic">
                  {business.address.street}
                  <br />
                  {business.address.city}, {business.address.region} {business.address.postalCode}
                </address>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button href={links.directions} track="directions" className="!min-h-11 !px-5 !text-sm">
                    Directions <ArrowIcon size={16} />
                  </Button>
                </div>
              </div>
              <div>
                <p className="eyebrow flex items-center gap-2 text-muted">
                  <ClockIcon size={16} /> Hours
                </p>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                  {hoursDisplay.map((h) => (
                    <div key={h.label} className="contents">
                      <dt className="text-muted">{h.label}</dt>
                      <dd className="font-bold text-white">{h.value}</dd>
                    </div>
                  ))}
                </dl>
                <OpenNow className="mt-4" />
              </div>
            </div>
            <div className="min-h-72 flex-1" data-reveal>
              <ShopMap />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
