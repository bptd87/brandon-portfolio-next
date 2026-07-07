"use client";

import { Play } from "lucide-react";
import { useMemo, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type DeferredYouTubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
  eagerPoster?: boolean;
  playbackMode?: "inline" | "dialog";
  showLabel?: boolean;
  squareFrame?: boolean;
};

export default function DeferredYouTubeEmbed({
  videoId,
  title,
  className = "",
  eagerPoster = false,
  playbackMode = "inline",
  showLabel = true,
  squareFrame = false,
}: DeferredYouTubeEmbedProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const thumbnailUrl = useMemo(
    () => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    [videoId]
  );
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const posterButton = (
    <button
      type="button"
      onClick={() => (playbackMode === "dialog" ? setIsDialogOpen(true) : setIsActivated(true))}
      className={`group relative block aspect-[16/9] w-full overflow-hidden bg-black text-left ${className}`}
      aria-label={`Play ${title}`}
    >
      <img
        src={thumbnailUrl}
        alt={title}
        loading={eagerPoster ? "eager" : "lazy"}
        decoding="async"
        onError={(event) => {
          const img = event.currentTarget;
          if (!img.src.includes("/hqdefault.jpg")) return;
          img.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`inline-flex items-center justify-center rounded-full border border-white/20 bg-black/45 text-sm font-medium text-[#ffffff] backdrop-blur-sm transition-colors group-hover:border-white/35 group-hover:bg-black/55 ${
            showLabel ? "gap-3 px-5 py-3" : "h-14 w-14"
          }`}
        >
          <Play className="h-5 w-5 translate-x-[1px] fill-current" />
          {showLabel ? "Play video" : null}
        </span>
      </div>
    </button>
  );

  if (playbackMode === "dialog") {
    return (
      <>
        {posterButton}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            className={`max-w-[min(94vw,72rem)] border-white/10 bg-black p-0 shadow-[0_32px_90px_rgba(0,0,0,0.45)] sm:max-w-[min(94vw,72rem)] ${
              squareFrame ? "!rounded-none" : ""
            }`}
            overlayClassName="bg-black/82 backdrop-blur-md"
          >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <div className={`aspect-video w-full overflow-hidden bg-black ${squareFrame ? "" : "rounded-lg"}`}>
              {isDialogOpen ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={embedUrl}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (isActivated) {
    return (
      <div className={`aspect-[16/9] ${className}`}>
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
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

  return posterButton;
}
