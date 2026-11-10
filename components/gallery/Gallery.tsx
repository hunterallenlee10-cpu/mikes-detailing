import { gallery, galleryCategories, type GalleryItem } from "@/content/site";
import { PHOTOS } from "@/content/images.generated";
import { UnderglowCar } from "../fx/CarScene";
import { Photo } from "../Photo";
import { GalleryGrid, type Tile } from "./GalleryGrid";

function Art({ item }: { item: GalleryItem }) {
  if (item.art === "underglow") {
    return (
      <div role="img" aria-label={item.alt} className="absolute inset-0 flex items-start justify-center bg-[radial-gradient(80%_70%_at_50%_40%,#1b0f3a,#0a0a0b)] px-8 pt-[12%]">
        <UnderglowCar lit className="w-full max-w-sm" />
      </div>
    );
  }
  return null;
}

export function Gallery({ limit, filterable = true }: { limit?: number; filterable?: boolean }) {
  const items = limit ? gallery.slice(0, limit) : gallery;
  const tiles: Tile[] = items.map((g) => {
    const tall = g.photo ? PHOTOS[g.photo].height > PHOTOS[g.photo].width : false;
    return {
      key: g.title,
      title: g.title,
      caption: g.caption,
      categories: g.categories,
      tall,
      thumb: g.photo ? <Photo slug={g.photo} alt={g.alt} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" /> : <Art item={g} />,
      large: g.photo ? (
        <Photo slug={g.photo} alt={g.alt} sizes="(min-width: 1024px) 1000px, 96vw" imgClassName="!object-contain" className="!bg-jet" />
      ) : (
        <Art item={g} />
      ),
    };
  });
  return <GalleryGrid tiles={tiles} categories={galleryCategories} filterable={filterable} />;
}
