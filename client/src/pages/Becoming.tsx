"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { SEO } from "@/components/SEO";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";
import { becomingPhotos } from "@shared/becomingPhotos.generated";

const orderedPhotos = [...becomingPhotos].sort(
  (a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime()
);

type BecomingPhotoItem = (typeof orderedPhotos)[number];

const cropPositions: Record<string, string> = {
  "becoming-01": "52% 35%",
  "becoming-02": "58% 52%",
  "becoming-04": "47% 36%",
  "becoming-06": "50% 44%",
  "becoming-07": "50% 50%",
  "becoming-09": "50% 38%",
  "becoming-10": "50% 56%",
  "becoming-11": "52% 34%",
  "becoming-12": "50% 50%",
  "becoming-13": "50% 44%",
  "becoming-14": "50% 56%",
  "becoming-16": "50% 50%",
  "becoming-17": "50% 52%",
  "becoming-18": "50% 32%",
  "becoming-19": "50% 34%",
  "becoming-20": "50% 42%",
  "becoming-21": "50% 58%",
  "becoming-22": "50% 38%",
  "becoming-23": "50% 42%",
  "becoming-24": "50% 43%",
  "becoming-25": "50% 34%",
  "becoming-26": "50% 46%",
  "becoming-27": "50% 36%",
  "becoming-28": "50% 48%",
  "becoming-31": "54% 28%",
  "becoming-32": "50% 34%",
  "becoming-33": "50% 38%",
  "becoming-34": "50% 40%",
  "becoming-35": "50% 34%",
  "becoming-36": "50% 45%",
  "becoming-37": "50% 36%",
  "becoming-38": "50% 48%",
  "becoming-39": "50% 34%",
  "becoming-40": "52% 54%",
  "becoming-41": "50% 42%",
};

export default function Becoming() {
  const { homeTheme } = useHomeTheme();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const lightboxTrackRef = useRef<HTMLDivElement | null>(null);
  const lightboxScrollFrameRef = useRef<number | null>(null);
  const selectedPhoto =
    selectedPhotoIndex === null ? null : orderedPhotos[selectedPhotoIndex] || null;
  const previousPhoto =
    selectedPhotoIndex === null
      ? null
      : orderedPhotos[(selectedPhotoIndex - 1 + orderedPhotos.length) % orderedPhotos.length] || null;
  const nextPhoto =
    selectedPhotoIndex === null
      ? null
      : orderedPhotos[(selectedPhotoIndex + 1) % orderedPhotos.length] || null;

  const showPreviousPhoto = () => {
    setSelectedPhotoIndex((current) =>
      current === null ? null : (current - 1 + orderedPhotos.length) % orderedPhotos.length
    );
  };

  const showNextPhoto = () => {
    setSelectedPhotoIndex((current) =>
      current === null ? null : (current + 1) % orderedPhotos.length
    );
  };

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoIndex(null);
      }
      if (event.key === "ArrowLeft") {
        showPreviousPhoto();
      }
      if (event.key === "ArrowRight") {
        showNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  useLayoutEffect(() => {
    if (selectedPhotoIndex === null) return undefined;

    const selectedSlide = lightboxTrackRef.current?.querySelector<HTMLElement>(
      `[data-lightbox-index="${selectedPhotoIndex}"]`
    );

    selectedSlide?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });

    return undefined;
  }, [selectedPhotoIndex]);

  const syncPhotoIndexFromLightboxScroll = () => {
    if (lightboxScrollFrameRef.current !== null) return;

    lightboxScrollFrameRef.current = window.requestAnimationFrame(() => {
      lightboxScrollFrameRef.current = null;
      const track = lightboxTrackRef.current;
      if (!track) return;

      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      const slides = [...track.querySelectorAll<HTMLElement>("[data-lightbox-index]")];
      const closestSlide = slides.reduce<HTMLElement | null>((closest, slide) => {
        if (!closest) return slide;

        const slideRect = slide.getBoundingClientRect();
        const closestRect = closest.getBoundingClientRect();
        const slideDistance = Math.abs(slideRect.left + slideRect.width / 2 - trackCenter);
        const closestDistance = Math.abs(closestRect.left + closestRect.width / 2 - trackCenter);

        return slideDistance < closestDistance ? slide : closest;
      }, null);

      const closestIndex = Number(closestSlide?.dataset.lightboxIndex);
      if (!Number.isNaN(closestIndex) && closestIndex !== selectedPhotoIndex) {
        setSelectedPhotoIndex(closestIndex);
      }
    });
  };

  return (
    <div
      className="min-h-screen [--border:rgba(17,17,17,0.14)]"
      style={{
        "--background": homeTheme.bg,
        "--foreground": homeTheme.ink,
        backgroundColor: homeTheme.bg,
        color: homeTheme.ink,
        fontFamily: HOME_BODY_FONT,
      } as React.CSSProperties}
    >
      <SEO
        title="Photography Portfolio | Brandon PT Davis"
        description="A chronological photography portfolio and visual reference archive shaped by observation, attention, and scenic design practice."
        url="https://www.brandonptdavis.com/projects/photography"
        type="article"
      />

      <Header />
      <PortfolioTopBar />

      <main className="relative z-10" style={{ backgroundColor: homeTheme.bg }}>
        <section className="px-[clamp(2rem,8vw,9rem)] pb-[clamp(3rem,6vw,5rem)] pt-[clamp(8rem,12vw,11rem)] text-center">
          <AnimatedSection className="mx-auto max-w-[42rem]">
            <div>
              <h1
                className="mx-auto max-w-[10.5ch] text-balance text-[clamp(3.1rem,7vw,6.8rem)] font-black uppercase leading-[0.84] tracking-[0]"
                style={{
                  color: homeTheme.ink,
                  fontFamily: HOME_DISPLAY_FONT,
                  fontStretch: "condensed",
                }}
              >
                PHOTOGRAPHY
              </h1>
              <p
                className="mx-auto mt-5 max-w-[28rem] text-center text-[clamp(0.98rem,1.2vw,1.12rem)] font-medium leading-7 tracking-[-0.02em]"
                style={{ color: homeTheme.muted }}
              >
                Observations gathered before they become drawings, rooms, or
                designs.
              </p>
            </div>
          </AnimatedSection>
        </section>

        <section className="px-[clamp(1.5rem,7vw,8rem)] pb-[clamp(4rem,8vw,7rem)]">
          <div className="mx-auto grid w-full max-w-[64rem] grid-cols-1 gap-[clamp(2.25rem,5vw,4.25rem)] px-[clamp(1rem,3vw,2rem)] sm:grid-cols-2 lg:grid-cols-3">
            {orderedPhotos.map((photo, index) => (
              <figure
                key={photo.id}
                className="group"
              >
                <button
                  type="button"
                  aria-label={`Open ${photo.title}`}
                  className="portfolio-focus-card relative block aspect-square w-full overflow-hidden rounded-[0.85rem] bg-neutral-100 text-left shadow-[0_1rem_2.4rem_rgba(0,0,0,0.12)] ring-1 ring-black/5 focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/70"
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <span className="portfolio-focus-media block h-full w-full overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      priority={index < 2}
                      loading={index < 2 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 92vw, 44vw"
                      style={{
                        objectPosition: cropPositions[photo.id] ?? "50% 50%",
                      }}
                      className="h-full w-full rounded-none object-cover"
                    />
                  </span>
                </button>
              </figure>
            ))}
          </div>
        </section>

        <section className="px-[clamp(2rem,8vw,9rem)] py-[clamp(4rem,10vw,9rem)]">
          <AnimatedSection className="mx-auto max-w-[58rem] text-center">
            <figure>
              <blockquote
                className="mx-auto text-[clamp(2rem,4.8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[0]"
                style={{
                  color: homeTheme.ink,
                  fontFamily: HOME_DISPLAY_FONT,
                  fontStretch: "condensed",
                }}
              >
                &ldquo;I am a camera with its shutter open, quite passive,
                recording, not thinking.&rdquo;
              </blockquote>
              <figcaption
                className="mx-auto mt-8 max-w-[28rem] text-[0.78rem] font-semibold uppercase leading-6 tracking-[0.16em]"
                style={{ color: homeTheme.muted }}
              >
                Christopher Isherwood, <cite>The Berlin Stories</cite>
              </figcaption>
            </figure>
          </AnimatedSection>
        </section>
      </main>

      <Footer tone="light" />

      {selectedPhoto ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 backdrop-blur-sm"
          style={{
            backgroundColor: "color-mix(in srgb, var(--foreground) 42%, transparent)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full text-3xl font-light leading-none shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] transition hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 md:right-8 md:top-8"
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
            aria-label="Close photography lightbox"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            &times;
          </button>
          <div
            data-paper-panel
            className="relative flex h-full w-full items-center overflow-hidden rounded-[1.5rem] py-[clamp(4.5rem,7vw,6rem)]"
            style={{
              backgroundColor: homeTheme.bg,
              color: homeTheme.ink,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              ref={lightboxTrackRef}
              className="flex h-full w-full snap-x snap-mandatory items-center gap-[clamp(1rem,4vw,5rem)] overflow-x-auto overscroll-x-contain px-[clamp(1rem,18vw,26rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={syncPhotoIndexFromLightboxScroll}
              onWheel={(event) => {
                if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
                event.currentTarget.scrollLeft += event.deltaY;
              }}
            >
              {orderedPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  data-lightbox-index={index}
                  className="grid h-full min-w-[min(78vw,56rem)] snap-center place-items-center"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    priority={index === selectedPhotoIndex}
                    loading={index === selectedPhotoIndex ? "eager" : "lazy"}
                    fetchPriority={index === selectedPhotoIndex ? "high" : "low"}
                    sizes="(max-width: 768px) 78vw, 56rem"
                    draggable={false}
                    className="max-h-[78vh] w-auto max-w-full select-none rounded-[0.8rem] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
