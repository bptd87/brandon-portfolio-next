import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ScenicRenderingGalleryItem = {
  id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
};

type ScenicRenderingGalleryProps = {
  items: ScenicRenderingGalleryItem[];
  onOpen: (mediaId: string) => void;
  visibleCount?: number;
  squareItems?: boolean;
};

export default function ScenicRenderingGallery({
  items,
  onOpen,
  visibleCount = 2,
  squareItems = false,
}: ScenicRenderingGalleryProps) {
  const [startIndex, setStartIndex] = useState(0);
  const canGoPrev = startIndex > 0;
  const maxStart = Math.max(items.length - visibleCount, 0);
  const canGoNext = startIndex < maxStart;
  const visibleItems = items.slice(startIndex, startIndex + visibleCount);
  const showControls = items.length > visibleCount;

  return (
    <div className="space-y-5">
      {showControls ? (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            aria-label="Previous renderings"
            disabled={!canGoPrev}
            onClick={() => setStartIndex((current) => Math.max(current - 1, 0))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground disabled:cursor-default disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next renderings"
            disabled={!canGoNext}
            onClick={() => setStartIndex((current) => Math.min(current + 1, maxStart))}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground disabled:cursor-default disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
      <div className={`grid gap-6 ${visibleCount >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {visibleItems.map((item) => (
          <figure key={item.id} className="space-y-3">
            <button
              type="button"
              onClick={() => onOpen(item.id)}
              className="block w-full text-left"
            >
              <div className={squareItems ? "aspect-square overflow-hidden" : ""}>
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                  className={`block w-full object-cover transition-transform duration-500 hover:scale-[1.01] ${
                    squareItems ? "h-full" : ""
                  }`}
                />
              </div>
            </button>
            {item.caption ? (
              <figcaption className="text-[0.92rem] leading-6 tracking-[-0.01em] text-foreground/56">
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </div>
  );
}
