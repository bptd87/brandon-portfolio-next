"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { SEO } from "@/components/SEO";
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
  const [selectedPhoto, setSelectedPhoto] = useState<BecomingPhotoItem | null>(
    null
  );

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

  return (
    <div className="min-h-screen bg-white text-[#111111] [--background:#ffffff] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
      <SEO
        title="Photography Portfolio | Brandon PT Davis"
        description="A chronological photography portfolio and visual reference archive shaped by observation, attention, and scenic design practice."
        url="https://www.brandonptdavis.com/projects/photography"
        type="article"
      />

      <Header />
      <PortfolioTopBar />

      <main>
        <section className="border-b border-black/10 px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-20">
          <AnimatedSection className="mx-auto max-w-[92rem]">
            <div>
              <h1 className="font-sans text-[clamp(3.8rem,9.2vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.09em] text-[#111111]">
                Photography
              </h1>
              <div className="mt-8 grid gap-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-start">
                <p className="max-w-3xl text-[clamp(1.08rem,1.55vw,1.34rem)] font-medium leading-8 tracking-[-0.024em] text-black/62">
                  Observations gathered before they become drawings, rooms, or
                  designs.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="py-0">
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {orderedPhotos.map((photo, index) => (
              <AnimatedSection key={photo.id} delay={Math.min(index * 18, 220)}>
                <figure className="group">
                  <button
                    type="button"
                    aria-label={`Open ${photo.title}`}
                    className="relative block aspect-square w-full overflow-hidden rounded-none border border-white bg-neutral-100 text-left focus:outline-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-black/70"
                    onClick={() => setSelectedPhoto(photo)}
                  >
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
                      className="h-full w-full rounded-none object-cover transition duration-700 group-hover:brightness-110"
                    />
                  </button>
                </figure>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="border-t border-black/10 px-[clamp(1.5rem,5vw,6rem)] py-[clamp(4rem,10vw,9rem)]">
          <AnimatedSection className="mx-auto max-w-[72rem] text-center">
            <figure>
              <blockquote className="mx-auto font-sans text-[clamp(2.25rem,5.8vw,7rem)] font-medium leading-[0.92] tracking-[-0.07em] text-[#111111]">
                &ldquo;I am a camera with its shutter open, quite passive,
                recording, not thinking.&rdquo;
              </blockquote>
              <figcaption className="mx-auto mt-8 max-w-[28rem] text-[0.78rem] font-semibold uppercase leading-6 tracking-[0.16em] text-black/38">
                Christopher Isherwood, <cite>The Berlin Stories</cite>
              </figcaption>
            </figure>
          </AnimatedSection>
        </section>
      </main>

      <Footer tone="light" />

      {selectedPhoto ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/82 px-4 py-16 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 px-2 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/70 md:right-8 md:top-8"
            onClick={() => setSelectedPhoto(null)}
          >
            Close
          </button>
          <div
            className="relative max-h-full max-w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              width={selectedPhoto.width}
              height={selectedPhoto.height}
              sizes="100vw"
              className="max-h-[82vh] w-auto max-w-[92vw] object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
