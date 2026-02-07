import { useState, useEffect } from 'react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  loading?: 'eager' | 'lazy';
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain';
}

export function ProgressiveImage({
  src,
  alt,
  className = '',
  onClick,
  loading = 'lazy',
  aspectRatio,
  objectFit = 'cover',
}: ProgressiveImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setImageLoaded(false);
    setImageError(false);

    // Preload the image
    const img = new Image();
    img.src = src;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [src]);

  return (
    <div 
      className="relative overflow-hidden bg-muted/20"
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur placeholder - shown while loading */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40 animate-pulse" />
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`
          w-full h-full 
          ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}
          transition-all duration-500 ease-out
          ${imageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-lg'}
          ${className}
        `}
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
