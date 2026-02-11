import { useState, useEffect } from 'react';

// Generate srcset for responsive images using image proxy
function generateSrcSet(src: string): string {
  // Check if URL is from manuscdn or cloudfront
  if (src.includes('manuscdn.com') || src.includes('cloudfront.net')) {
    // Use our image proxy for resizing (preserves PNG, converts JPEG to WebP at 90%)
    const widths = [640, 768, 1024, 1536, 1920];
    return widths
      .map(w => {
        const proxyUrl = `/api/img?url=${encodeURIComponent(src)}&w=${w}`;
        return `${proxyUrl} ${w}w`;
      })
      .join(', ');
  }
  // For other images, return empty srcset (will use src only)
  return '';
}

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  loading?: 'eager' | 'lazy';
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain';
  smartPosition?: boolean; // Enable automatic orientation detection
  sizes?: string; // Responsive sizes attribute
}

export function ProgressiveImage({
  src,
  alt,
  className = '',
  onClick,
  loading = 'lazy',
  aspectRatio,
  objectFit = 'cover',
  smartPosition = false,
  sizes,
}: ProgressiveImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [objectPosition, setObjectPosition] = useState<string>('object-center');

  useEffect(() => {
    if (!smartPosition) return;
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      // Portrait images: show top (faces), Landscape: center
      if (img.naturalHeight > img.naturalWidth) {
        setObjectPosition('object-top');
      } else {
        setObjectPosition('object-center');
      }
    };
  }, [src, smartPosition]);

  return (
    <div 
      className="relative overflow-hidden bg-muted/10"
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton loader - shown while loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-muted/30">
          <div 
            className="w-full h-full relative overflow-hidden"
          >
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

      {/* Actual image - NO transitions at all */}
      <img
        src={(src.includes('manuscdn.com') || src.includes('cloudfront.net')) ? `/api/img?url=${encodeURIComponent(src)}&w=1920` : src}
        srcSet={generateSrcSet(src)}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        alt={alt}
        className={`
          w-full h-full 
          ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}
          ${smartPosition ? objectPosition : ''}
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        style={{ transition: 'none' }} // Explicitly disable all transitions
        onClick={onClick}
        loading={loading}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />

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
