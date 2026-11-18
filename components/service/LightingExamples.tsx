import { lightingExamples, links, type LightingExample } from "@/content/site";
import { PHOTOS, VIDEOS } from "@/content/images.generated";
import { cn } from "@/lib/cn";
import { LoopVideo } from "../fx/LoopVideo";
import { Photo } from "../Photo";
import { ChatIcon } from "../icons";
import { Button, Container, SectionHead } from "../ui";

const tile = "relative overflow-hidden rounded-3xl bg-jet ring-1 ring-white/10";

function VideoTile({ item, className }: { item: LightingExample; className?: string }) {
  const v = VIDEOS[item.video];
  return (
    <figure className={cn(tile, "aspect-[9/16]", className)}>
      <LoopVideo src={v.src} poster={v.poster} label={item.videoLabel} />
      <figcaption className="pointer-events-none absolute top-3 left-3 hidden rounded-full whitespace-nowrap sm:block bg-black/55 px-3 py-1.5 text-xs font-extrabold tracking-wide text-white uppercase ring-1 ring-white/20 backdrop-blur-sm">
        {item.eyebrow}
      </figcaption>
    </figure>
  );
}

/**
 * Mosaic for landscape photos: tall clip + one wide + two small.
 * Row for portrait photos: clip and three photos side by side.
 */
function Example({ item, index }: { item: LightingExample; index: number }) {
  const portrait = item.photos.every((p) => PHOTOS[p.slug].height > PHOTOS[p.slug].width);
  const [p0, p1, p2] = item.photos;
  const photo = (p: typeof p0, sizes: string, className: string) =>
    p && (
      <div className={cn(tile, className)}>
        <Photo slug={p.slug} alt={p.alt} sizes={sizes} position={p.position} />
      </div>
    );

  return (
    <article aria-labelledby={`ex-${item.id}`} className={cn(index > 0 && "mt-20 sm:mt-28")}>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-end" data-reveal>
        <div>
          <p className="eyebrow flex items-center gap-3 text-cyan">
            <span aria-hidden className="inline-block h-[3px] w-6 rounded bg-current" />
            {item.eyebrow}
          </p>
          <h3 id={`ex-${item.id}`} className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] leading-none font-black uppercase">
            <span className="chrome">{item.title}</span>
          </h3>
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-chrome/85 lg:justify-self-end">{item.body}</p>
      </div>

      {portrait ? (
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" data-reveal data-reveal-delay="80">
          {photo(p0, "(min-width: 1024px) 24vw, 46vw", "aspect-[9/16]")}
          {photo(p1, "(min-width: 1024px) 24vw, 46vw", "aspect-[9/16] lg:aspect-auto")}
          {photo(p2, "(min-width: 1024px) 24vw, 46vw", "aspect-[9/16] lg:aspect-auto")}
          <VideoTile item={item} className="order-first lg:order-last" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-2" data-reveal data-reveal-delay="80">
          <VideoTile item={item} className="row-span-2" />
          {photo(p0, "(min-width: 1024px) 55vw, 46vw", "lg:col-span-2")}
          {photo(p1, "(min-width: 1024px) 28vw, 46vw", "")}
          {photo(p2, "(min-width: 1024px) 28vw, 92vw", "col-span-2 aspect-[16/9] lg:col-span-1 lg:aspect-auto")}
        </div>
      )}
      <p className="mt-3 text-xs text-muted">{item.credit}</p>
    </article>
  );
}

/** "See it lit": LowGlow's own photos and clips, until Mike's own lighting photos are in. */
export function LightingExamples() {
  if (!lightingExamples.show || lightingExamples.items.length === 0) return null;
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="examples-title">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(50%_60%_at_30%_20%,rgb(139_92_246/0.16),transparent_70%)]" />
      <Container>
        <SectionHead
          eyebrow="LowGlow · See it lit"
          eyebrowClass="text-cyan"
          title={
            <span id="examples-title">
              <span className="chrome">Ambient &amp; starlight,</span>{" "}
              <span className="bg-gradient-to-r from-cyan via-violet to-magenta bg-clip-text text-transparent">in real life.</span>
            </span>
          }
          lead={lightingExamples.note}
        />
        <div className="mt-14">
          {lightingExamples.items.map((item, i) => (
            <Example key={item.id} item={item} index={i} />
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-4" data-reveal>
          <Button href={links.sms} variant="red" track="text">
            <ChatIcon size={18} /> Text Mike about your ride
          </Button>
          <Button href="#quote" variant="ghost">
            Get a free quote
          </Button>
        </div>
      </Container>
    </section>
  );
}
