import { useState, useEffect, useRef } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain';
  smartPosition?: boolean;
  sizes?: string;
  width?: number;
  preloadMargin?: string;
  blurFadeDuration?: number;
  enableScrollAnimation?: boolean; // Enable fade-in on scroll (default: true)
  animationDelay?: number; // Delay in ms before animation starts (for stagger effect)
}

export function ProgressiveImage({
  src,
  alt,
  className = '',
  onClick,
  loading = 'lazy',
  fetchPriority,
  aspectRatio,
  objectFit = 'cover',
  smartPosition = false,
  sizes,
  width,
  preloadMargin = '200px',
  blurFadeDuration = 300,
  enableScrollAnimation = true,
  animationDelay = 0,
}: ProgressiveImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const [showSharpImage, setShowSharpImage] = useState(false);
  const [isInView, setIsInView] = useState(!enableScrollAnimation); // Start visible if animation disabled
  const [objectPosition, setObjectPosition] = useState<string>('object-center');
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    if (!enableScrollAnimation || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay before triggering animation
            setTimeout(() => {
              setIsInView(true);
            }, animationDelay);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px', // Start slightly before entering viewport
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [enableScrollAnimation, animationDelay]);

  // Intersection Observer for preloading
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: preloadMargin,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [loading, preloadMargin]);

  // Smart positioning for portrait vs landscape
  useEffect(() => {
    if (!smartPosition || !shouldLoad) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (img.naturalHeight > img.naturalWidth) {
        setObjectPosition('object-top');
      } else {
        setObjectPosition('object-center');
      }
    };
  }, [src, smartPosition, shouldLoad]);

  // Hold blurred version for minimum duration, then fade to sharp
  useEffect(() => {
    if (!imageLoaded) return;

    // If eager loading, show immediately without delay
    if (loading === 'eager') {
      setShowSharpImage(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowSharpImage(true);
    }, blurFadeDuration);

    return () => clearTimeout(timer);
  }, [imageLoaded, blurFadeDuration, loading]);

  return (
    <div
      ref={imgRef}
      className={`
        relative overflow-hidden
        ${enableScrollAnimation ? 'transition-all duration-700 ease-out' : ''}
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder - simple loading state */}
      {!imageError && !imageLoaded && shouldLoad && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" aria-hidden="true" />
      )}

      {/* Skeleton loader - shown before intersection */}
      {!shouldLoad && (
        <div className="absolute inset-0">
          <div className="w-full h-full relative overflow-hidden">
            {/* Shimmer effect - subtle */}
            <div
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Main image */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`
            w-full h-full 
            ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}
            ${smartPosition ? objectPosition : ''}
            transition-opacity duration-500 ease-out
            ${showSharpImage ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          onClick={onClick}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}

      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="text-center text-muted-foreground">
            <svg
              className="w-12 h-12 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Image failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
}
