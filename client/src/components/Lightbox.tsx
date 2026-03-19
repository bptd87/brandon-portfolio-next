import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface LightboxProps {
  images: Array<{ imageUrl: string | null; caption: string | null; altText: string | null }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const currentImage = images[currentIndex];
  if (!currentImage) return null;
  const currentSrc = useMemo(() => {
    if (currentImage.imageUrl) return currentImage.imageUrl;
    const fallback = images.find((img) => !!img.imageUrl)?.imageUrl;
    return fallback || "";
  }, [currentImage.imageUrl, images]);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [currentIndex, currentSrc]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center overflow-hidden"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 text-white/56 transition-colors hover:text-white/88"
        aria-label="Close lightbox"
      >
        <X className="h-7 w-7" strokeWidth={1.7} />
      </button>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-5 z-10 text-white/40 transition-colors hover:text-white/82"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={1.6} />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-5 z-10 text-white/40 transition-colors hover:text-white/82"
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8" strokeWidth={1.6} />
        </button>
      )}

      {/* Image counter */}
      <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2 border border-white/10 bg-black/55 px-5 py-2.5 backdrop-blur-sm">
        <p className="text-sm font-medium tracking-[-0.02em] text-white/88">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      {/* Main image */}
      <div
        className="relative grid h-[68vh] w-[78vw] max-h-[68vh] max-w-[1040px] place-items-center overflow-hidden px-6 py-4 md:px-8 md:py-6"
        onClick={(e) => e.stopPropagation()}
      >
        {currentSrc && !imageFailed ? (
          <img
            key={`lightbox-image-${currentIndex}`}
            src={currentSrc}
            alt={currentImage.altText || currentImage.caption || 'Gallery image'}
            className="mx-auto block h-auto max-h-full max-w-full object-contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="h-[60vh] w-full flex items-center justify-center rounded-lg bg-black/40 border border-white/15">
            <p className="text-sm text-white/85">Image unavailable</p>
          </div>
        )}
        
        {/* Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6 rounded-b-lg">
            <p className="text-sm text-foreground/90 text-center">
              {currentImage.caption}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-5 left-1/2 z-10 w-[min(36rem,calc(100vw-6rem))] -translate-x-1/2 overflow-hidden">
        <div className="no-scrollbar flex items-center justify-center gap-2 overflow-x-auto px-4 py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                const diff = idx - currentIndex;
                if (diff > 0) {
                  for (let i = 0; i < diff; i++) onNext();
                } else if (diff < 0) {
                  for (let i = 0; i < Math.abs(diff); i++) onPrev();
                }
              }}
              className={`h-14 w-14 flex-shrink-0 overflow-hidden border transition-colors ${
                idx === currentIndex
                  ? 'border-white/85'
                  : 'border-white/12 hover:border-white/28'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img.imageUrl || ''}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
