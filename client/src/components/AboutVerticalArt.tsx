"use client";

import Image from "next/image";

type AboutVerticalArtProps = {
  src: string;
  alt: string;
  sizes: string;
  maxWidthClassName?: string;
  className?: string;
};

export default function AboutVerticalArt({
  src,
  alt,
  sizes,
  maxWidthClassName = "max-w-[26rem]",
  className = "",
}: AboutVerticalArtProps) {
  return (
    <div
      className={`mx-auto w-full ${maxWidthClassName} overflow-hidden rounded-[2rem] border border-border/35 bg-card/20 ${className}`.trim()}
    >
      <div className="relative aspect-[9/16] w-full">
        <Image
          src={src}
          alt={alt}
          width={1024}
          height={1024}
          unoptimized
          quality={82}
          sizes={sizes}
          className="absolute left-1/2 top-1/2 h-[185%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90"
        />
      </div>
    </div>
  );
}
