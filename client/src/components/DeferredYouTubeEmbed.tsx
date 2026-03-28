"use client";

import { PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";

type DeferredYouTubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
  eagerPoster?: boolean;
};

export default function DeferredYouTubeEmbed({
  videoId,
  title,
  className = "",
  eagerPoster = false,
}: DeferredYouTubeEmbedProps) {
  const [isActivated, setIsActivated] = useState(false);

  const thumbnailUrl = useMemo(
    () => `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    [videoId]
  );

  if (isActivated) {
    return (
      <div className={`aspect-[16/9] ${className}`}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsActivated(true)}
      className={`group relative block aspect-[16/9] w-full overflow-hidden bg-black text-left ${className}`}
      aria-label={`Play ${title}`}
    >
      <img
        src={thumbnailUrl}
        alt={title}
        loading={eagerPoster ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/45 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors group-hover:border-white/35 group-hover:bg-black/55">
          <PlayCircle className="h-5 w-5" />
          Play video
        </span>
      </div>
    </button>
  );
}
