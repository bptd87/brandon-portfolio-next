"use client";

import Image from "next/image";
import { Fragment } from "react";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PortfolioTopBar from "@/components/PortfolioTopBar";
import { SEO } from "@/components/SEO";
import { becomingPhotos } from "@shared/becomingPhotos.generated";

const orderedPhotos = [...becomingPhotos].sort(
  (a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime()
);

function formatTakenAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
  }).format(new Date(value));
}

export default function Becoming() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Photography Portfolio | Brandon PT Davis"
        description="A chronological photography portfolio and visual reference archive shaped by observation, attention, and scenic design practice."
        url="https://www.brandonptdavis.com/projects/photography"
        type="article"
      />

      <Header />
      <PortfolioTopBar />

      <main>
        <section className="border-b border-white/12 px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-20">
          <AnimatedSection className="mx-auto max-w-[92rem]">
            <div>
              <p className="section-kicker text-white/42">Photo journal</p>
              <h1 className="mt-5 font-sans text-[clamp(3.8rem,9.2vw,10.5rem)] font-medium leading-[0.82] tracking-[-0.09em] text-white">
                Photography
              </h1>
              <div className="mt-8 grid gap-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:items-start">
                <p className="max-w-3xl text-[clamp(1.08rem,1.55vw,1.34rem)] font-medium leading-8 tracking-[-0.024em] text-white/72">
                  Observations gathered before they become drawings, rooms, or
                  designs.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-10 md:py-14">
          <div className="mx-auto grid max-w-[92rem] gap-x-8 gap-y-14 md:grid-cols-2">
            {orderedPhotos.map((photo, index) => (
              <Fragment key={photo.id}>
                {index === 12 ? (
                  <AnimatedSection
                    key="isherwood-quote"
                    className="md:col-span-2"
                  >
                    <figure className="mx-auto max-w-[58rem] rounded-lg border border-white/12 bg-white/[0.035] px-[clamp(1.5rem,5vw,4.5rem)] py-[clamp(2.5rem,6vw,5rem)] text-center shadow-[0_28px_90px_rgba(0,0,0,0.36)]">
                      <blockquote className="mx-auto max-w-[46rem] font-sans text-[clamp(2rem,4.1vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.065em] text-white">
                        &ldquo;I am a camera with its shutter open, quite
                        passive, recording, not thinking.&rdquo;
                      </blockquote>
                      <figcaption className="mx-auto mt-8 max-w-[32rem] text-[0.88rem] leading-6 tracking-[-0.012em] text-white/46">
                        Christopher Isherwood, <cite>The Berlin Stories</cite>.
                        Observation as research.
                      </figcaption>
                    </figure>
                  </AnimatedSection>
                ) : null}
                <AnimatedSection delay={Math.min(index * 18, 220)}>
                  <figure className="group border-t border-white/12 pt-3">
                    <div className="relative overflow-hidden rounded-none bg-white/[0.035]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        priority={index < 2}
                        loading={index < 2 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 92vw, 44vw"
                        className="h-auto w-full rounded-none object-cover transition duration-700 group-hover:brightness-110"
                      />
                    </div>
                    <figcaption className="mt-5 grid gap-4 border-t border-white/14 pt-4 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
                      <div className="text-[0.72rem] font-semibold uppercase leading-5 tracking-[0.16em] text-white/38">
                        <p>{formatTakenAt(photo.takenAt)}</p>
                      </div>
                      <div>
                        <p className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-white/38">
                          {photo.location}
                        </p>
                        <h2 className="mt-2 font-sans text-[1.55rem] font-medium leading-none tracking-[-0.055em] text-white">
                          {photo.title}
                        </h2>
                        <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-6 tracking-[-0.018em] text-white/58">
                          {photo.caption}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                </AnimatedSection>
              </Fragment>
            ))}
          </div>
        </section>

        <section className="border-t border-white/12 px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-20">
          <AnimatedSection className="mx-auto max-w-[92rem]">
            <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end">
              <p className="font-sans text-[clamp(2.4rem,5vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.078em] text-white">
                A working archive, not a finished statement.
              </p>
              <p className="max-w-3xl text-[1.04rem] leading-7 tracking-[-0.018em] text-white/58">
                A quieter record of influence: source material, fragments, and
                visual habits that keep the work looking outward.
              </p>
            </div>
          </AnimatedSection>
        </section>
      </main>

      <Footer tone="dark" />
    </div>
  );
}
