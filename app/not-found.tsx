import { HexCeiling } from "@/components/hex/HexCeiling";
import { Button, CallTextButtons, Container } from "@/components/ui";
import { ArrowIcon } from "@/components/icons";

export const metadata = { title: "Page not found | Mike's Automotive Detailing", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-32 pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%] [perspective:900px]">
        <div className="absolute inset-x-[-30%] top-[-10%] origin-top [transform:rotateX(58deg)] sm:inset-x-[-10%]">
          <HexCeiling className="h-auto w-full" baseDelay={0} flickerOut seed={404} />
        </div>
      </div>
      <Container className="text-center">
        <p className="eyebrow text-red-text">Error 404</p>
        <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.92] font-black uppercase">
          <span className="chrome">Lights out.</span>
          <br />
          <span className="text-red">Wrong bay.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-chrome/90">That page doesn&apos;t exist — but your ride still needs a detail.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="chrome">
            Back to the shop <ArrowIcon size={18} />
          </Button>
          <CallTextButtons compact />
        </div>
      </Container>
    </section>
  );
}
