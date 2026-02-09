import { useState, useEffect } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  onClick?: () => void;
}

/**
 * SmartImage component that automatically detects image orientation
 * and applies optimal positioning:
 * - Portrait images (height > width): object-top to show faces/upper content
 * - Landscape images (width >= height): object-center for balanced composition
 */
export default function SmartImage({ src, alt, className = "", aspectRatio = "aspect-[3/2]", onClick }: SmartImageProps) {
  const [objectPosition, setObjectPosition] = useState<"object-top" | "object-center">("object-center");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      // Detect orientation: portrait uses top positioning, landscape uses center
      if (img.naturalHeight > img.naturalWidth) {
        setObjectPosition("object-top");
      } else {
        setObjectPosition("object-center");
      }
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={`relative ${aspectRatio} overflow-hidden rounded-lg bg-muted ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${objectPosition} transition-all duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onClick={onClick}
        loading="lazy"
      />
    </div>
  );
}
