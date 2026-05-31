"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { recentScenicProjects } from "@/components/navigationData";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f1f0ec] text-[#111111] [--background:#f1f0ec] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
      <SEO
        title="404 | Brandon PT Davis"
        description="The page you’re looking for isn’t available. Return to the portfolio, studio, or homepage."
        noindex={true}
        nofollow={true}
      />

      <Header />

      <main>
        <section className="border-b border-black/10 px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-end">
            <div>
              <p className="section-kicker text-black/40">404</p>
              <h1 className="mt-6 max-w-[10ch] font-sans text-[clamp(4.4rem,11vw,10rem)] font-medium leading-[0.82] tracking-[-0.09em] text-black">
                Page not found.
              </h1>
            </div>

            <div className="max-w-xl lg:pb-2">
              <p className="text-[clamp(1.05rem,1.4vw,1.24rem)] leading-8 tracking-[-0.02em] text-black/64">
                The link may have moved during a site update. Start with the scenic design
                portfolio, browse recent project pages, or use the sitemap for a full index.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-[0.9rem] font-medium tracking-[-0.02em] transition-colors hover:bg-black/80"
                >
                  <span className="text-[#f1f0ec]">Scenic Design</span>
                  <ArrowUpRight className="h-4 w-4 text-[#f1f0ec]" />
                </Link>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 rounded-full border border-black/14 px-5 py-3 text-[0.9rem] font-medium tracking-[-0.02em] text-black/68 transition-colors hover:border-black/28 hover:text-black"
                >
                  Studio
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sitemap"
                  className="inline-flex items-center gap-2 rounded-full border border-black/14 px-5 py-3 text-[0.9rem] font-medium tracking-[-0.02em] text-black/68 transition-colors hover:border-black/28 hover:text-black"
                >
                  Sitemap
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10">
          <div className="grid md:grid-cols-3">
            {recentScenicProjects.map((project) => (
              <Link
                key={project.href}
                href={project.href}
                className="group border-b border-r border-black/10 md:border-b-0"
              >
                <div className="site-media-square relative aspect-[4/3] overflow-hidden bg-black/[0.035]">
                  <Image
                    src={project.imageUrl}
                    alt={project.imageAlt}
                    fill
                    quality={82}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="site-media-square object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                </div>
                <div className="min-h-[8.5rem] border-t border-black/10 p-[clamp(1rem,2vw,1.5rem)]">
                  <h2 className="max-w-[16ch] font-sans text-[clamp(1.45rem,2.3vw,2.35rem)] font-medium leading-[0.95] tracking-[-0.06em] text-black transition-colors group-hover:text-black/68">
                    {project.title}
                  </h2>
                  <p className="mt-3 max-w-[22ch] text-[0.95rem] leading-6 tracking-[-0.015em] text-black/48">
                    {project.meta}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid border-b border-black/10 md:grid-cols-3">
          <Link
            href="/projects"
            className="group border-b border-r border-black/10 px-[clamp(1.5rem,4vw,3rem)] py-10 md:border-b-0"
          >
            <p className="section-kicker text-black/40">Portfolio</p>
            <p className="mt-4 max-w-[18rem] text-[1.02rem] leading-7 tracking-[-0.015em] text-black/62 group-hover:text-black">
              Browse scenic design projects and production pages.
            </p>
          </Link>
          <Link
            href="/studio/directory"
            className="group border-b border-r border-black/10 px-[clamp(1.5rem,4vw,3rem)] py-10 md:border-b-0"
          >
            <p className="section-kicker text-black/40">Directory</p>
            <p className="mt-4 max-w-[18rem] text-[1.02rem] leading-7 tracking-[-0.015em] text-black/62 group-hover:text-black">
              Find scenic design resources, suppliers, archives, and tools.
            </p>
          </Link>
          <Link
            href="/search"
            className="group px-[clamp(1.5rem,4vw,3rem)] py-10"
          >
            <p className="section-kicker text-black/40">Search</p>
            <p className="mt-4 max-w-[18rem] text-[1.02rem] leading-7 tracking-[-0.015em] text-black/62 group-hover:text-black">
              Search across projects, articles, tools, and studio pages.
            </p>
          </Link>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
