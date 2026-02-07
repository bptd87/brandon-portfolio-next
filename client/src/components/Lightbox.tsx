import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

interface LightboxProps {
  images: Array<{ imageUrl: string | null; caption: string | null; altText: string | null }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ images, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const currentImage = images[currentIndex];

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
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-background/80 hover:bg-background border-2 border-border transition-all hover:scale-110"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 p-4 rounded-full bg-background/80 hover:bg-background border-2 border-border transition-all hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 p-4 rounded-full bg-background/80 hover:bg-background border-2 border-border transition-all hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      )}

      {/* Image counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-3 rounded-full bg-background/80 backdrop-blur-sm border border-border">
        <p className="text-sm font-semibold">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      {/* Main image */}
      <div 
        className="relative max-w-7xl max-h-[90vh] w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.imageUrl || ''}
          alt={currentImage.altText || currentImage.caption || 'Gallery image'}
          className="w-full h-full object-contain rounded-lg"
        />
        
        {/* Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6 rounded-b-lg">
            <p className="text-sm text-foreground/90 text-center">
              {currentImage.caption}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail strip (optional, for future enhancement) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4">
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
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              idx === currentIndex 
                ? 'border-foreground scale-110' 
                : 'border-border opacity-50 hover:opacity-100'
            }`}
          >
            <img
              src={img.imageUrl || ''}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
