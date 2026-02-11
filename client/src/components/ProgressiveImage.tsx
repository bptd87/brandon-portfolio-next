import { useState, useEffect, useRef } from 'react';

// Apply Cloudinary transformations for automatic optimization
function applyCloudinaryTransformations(src: string, width?: number, blurred?: boolean): string {
  // Only transform Cloudinary URLs
  if (!src.includes('cloudinary.com')) {
    return src;
  }

  // Parse Cloudinary URL: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{path}
  const uploadIndex = src.indexOf('/upload/');
  if (uploadIndex === -1) return src;

  const baseUrl = src.substring(0, uploadIndex + 8); // Include '/upload/'
  const pathAfterUpload = src.substring(uploadIndex + 8);

  // Build transformation string
  const transformations = [];
  
  if (blurred) {
    // Blurred placeholder: TINY width with blur for smooth color wash
    transformations.push('w_10');
    transformations.push('e_blur:1000');
    transformations.push('q_1');
  } else {
    // Normal image: automatic format (WebP with fallback)
    transformations.push('f_auto');
    
    // Quality optimization (85% - good balance)
    transformations.push('q_85');
    
    // Responsive width if specified
    if (width) {
      transformations.push(`w_${width}`);
    }
    
    // Auto DPR (device pixel ratio)
    transformations.push('dpr_auto');
  }

  const transformString = transformations.join(',');
  
  return `${baseUrl}${transformString}/${pathAfterUpload}`;
}

// Generate responsive srcset for Cloudinary images
function generateSrcSet(src: string): string {
  if (!src.includes('cloudinary.com')) {
    return '';
  }

  const widths = [400, 800, 1200, 1600];
  const srcsetEntries = widths.map(width => {
    const transformedUrl = applyCloudinaryTransformations(src, width);
    return `${transformedUrl} ${width}w`;
  });

  return srcsetEntries.join(', ');
}

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

    const timer = setTimeout(() => {
      setShowSharpImage(true);
    }, blurFadeDuration);

    return () => clearTimeout(timer);
  }, [imageLoaded, blurFadeDuration]);

  // Apply Cloudinary transformations to src
  const optimizedSrc = applyCloudinaryTransformations(src, width);
  const blurredSrc = applyCloudinaryTransformations(src, undefined, true);
  const srcSet = generateSrcSet(src);

  return (
    <div 
      ref={imgRef}
      className={`
        relative overflow-hidden bg-muted/10
        ${enableScrollAnimation ? 'transition-all duration-700 ease-out' : ''}
        ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blurred placeholder - tiny smooth color wash */}
      {!imageError && shouldLoad && (
        <img
          src={blurredSrc}
          alt=""
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-500 ease-out
            ${showSharpImage ? 'opacity-0' : 'opacity-100'}
          `}
          aria-hidden="true"
        />
      )}

      {/* Skeleton loader - shown before intersection */}
      {!shouldLoad && (
        <div className="absolute inset-0 bg-muted/30">
          <div className="w-full h-full relative overflow-hidden">
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
              }}
            />
          </div>
        </div>
      )}

      {/* Sharp image - fades in over blurred version */}
      {shouldLoad && (
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
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
