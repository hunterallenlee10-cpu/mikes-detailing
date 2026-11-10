import { Container } from "../ui";

/** Text-only certification badges (no trademarked logos reproduced). */
export function CertStrip() {
  return (
    <section aria-label="Certifications" className="relative border-y border-white/10 bg-carbon/80">
      <Container className="grid gap-px py-2 sm:grid-cols-2">
        <div className="flex items-center gap-4 px-2 py-5 sm:px-6" data-reveal>
          <span aria-hidden className="hex-clip flex h-12 w-14 shrink-0 items-center justify-center bg-igl/15 ring-1 ring-igl/40">
            <span className="hex-clip h-6 w-7 bg-igl" />
          </span>
          <div>
            <p className="font-wide text-lg font-black tracking-wide text-white uppercase">IGL Coatings</p>
            <p className="text-sm font-semibold text-igl-text">Dealer &amp; Certified Installer</p>
          </div>
        </div>
        <div className="flex items-center gap-4 px-2 py-5 sm:border-l sm:border-white/10 sm:px-6" data-reveal data-reveal-delay="120">
          <span aria-hidden className="hex-clip flex h-12 w-14 shrink-0 items-center justify-center bg-violet/15 ring-1 ring-violet/40">
            <span className="hex-clip h-6 w-7 bg-gradient-to-r from-cyan via-violet to-magenta" />
          </span>
          <div>
            <p className="font-wide text-lg font-black tracking-wide text-white uppercase">LowGlow</p>
            <p className="bg-gradient-to-r from-cyan via-[#b8a2ff] to-magenta bg-clip-text text-sm font-semibold text-transparent">
              Certified Dealer &amp; Installer
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
