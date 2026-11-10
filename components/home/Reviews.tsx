import { links, ratings, reviews, type Review } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon, FacebookIcon, StarIcon } from "../icons";
import { Container, SectionHead } from "../ui";

export function ReviewCard({ r, className }: { r: Review; className?: string }) {
  return (
    <figure className={cn("relative flex h-full flex-col rounded-3xl bg-carbon p-6 ring-1 ring-white/10 edge-red", className)}>
      <div className="flex items-center gap-0.5 text-[#fbbc04]" role="img" aria-label={r.source.includes("Google") ? "5 star Google review" : "Facebook recommendation"}>
        {r.source.includes("Google") ? Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={16} />) : <span className="text-xs font-bold text-[#7fb1ff]">Recommends</span>}
      </div>
      <blockquote className="mt-4 flex-1 text-[1.02rem] leading-relaxed text-chrome">“{r.quote}”</blockquote>
      <figcaption className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="font-extrabold text-white">{r.name}</span>
        <span className="text-xs font-bold text-muted">{r.source}</span>
      </figcaption>
    </figure>
  );
}

export function Reviews({ ids, title, compact, headingAs = "h2" }: { ids?: string[]; title?: string; compact?: boolean; headingAs?: "h1" | "h2" }) {
  const list = ids ? reviews.filter((r) => ids.includes(r.id)) : reviews;
  return (
    <section id="reviews" className="relative py-24 sm:py-32" aria-labelledby="reviews-title">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            eyebrow="Reviews"
            as={headingAs}
            title={
              <span id="reviews-title">
                <span className="chrome">{title ?? "Don't take our word."}</span> <span className="text-red">Take theirs.</span>
              </span>
            }
          />
          <div className="flex flex-wrap gap-3" data-reveal>
            <a href={links.googleReviews} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl bg-carbon px-5 py-4 ring-1 ring-white/10 hover:ring-white/30" data-track="reviews_google">
              <span className="font-wide text-3xl font-black text-white">{ratings.google.rating.toFixed(1)}</span>
              <span>
                <span className="flex text-[#fbbc04]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} size={14} />
                  ))}
                </span>
                <span className="text-xs font-bold text-muted group-hover:text-white">on Google</span>
              </span>
            </a>
            <a href={links.facebookReviews} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl bg-carbon px-5 py-4 ring-1 ring-white/10 hover:ring-white/30" data-track="reviews_facebook">
              <FacebookIcon size={28} className="text-[#7fb1ff]" />
              <span>
                <span className="block font-extrabold text-white">{ratings.facebook.recommendPercent}% recommend</span>
                <span className="text-xs font-bold text-muted group-hover:text-white">{ratings.facebook.reviewCount} Facebook reviews</span>
              </span>
            </a>
          </div>
        </div>
        <ul className={cn("mt-12 gap-4", compact ? "grid md:grid-cols-2 lg:grid-cols-3" : "columns-1 sm:columns-2 lg:columns-3 [&>li]:mb-4")}>
          {list.map((r, i) => (
            <li key={r.id} className="break-inside-avoid" data-reveal data-reveal-delay={(i % 3) * 90}>
              <ReviewCard r={r} />
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-4 text-sm font-extrabold">
          <a href={links.googleReviews} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-white hover:text-red-text">
            Read all Google reviews <ArrowIcon size={16} className="transition group-hover:translate-x-1" />
          </a>
          <a href={links.facebookReviews} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-white hover:text-red-text">
            Read Facebook reviews <ArrowIcon size={16} className="transition group-hover:translate-x-1" />
          </a>
        </div>
      </Container>
    </section>
  );
}
