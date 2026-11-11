import { audioBrands } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Audio brands Mike installs. Official logos, shown flat white so they sit together on the dark page.
 * Each logo's height is set from its proportions so long, thin wordmarks and compact ones look equally big.
 */
export function BrandStrip() {
  return (
    <div className="mt-16" data-reveal>
      <h3 className="eyebrow text-muted">Brands we install</h3>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {audioBrands.map((b) => {
          const ratio = b.width && b.height ? b.width / b.height : 0;
          const wide = ratio > 9;
          return (
            <li
              key={b.name}
              className={cn("flex h-24 items-center justify-center rounded-2xl bg-carbon px-5 ring-1 ring-white/10 sm:h-28", wide && "col-span-2 sm:col-span-3 lg:col-span-2")}
            >
              {b.file ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/images/brands/${b.file}`}
                  alt={b.name}
                  width={b.width}
                  height={b.height}
                  loading="lazy"
                  decoding="async"
                  className="w-auto max-w-full object-contain opacity-90 [filter:brightness(0)_invert(1)]"
                  style={{ height: `${(4.6 / Math.sqrt(ratio)).toFixed(2)}rem` }}
                />
              ) : (
                <span className="font-wide text-xl font-black tracking-wide text-white uppercase sm:text-2xl">{b.name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
