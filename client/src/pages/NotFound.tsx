"use client";

import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="404 | Brandon PT Davis"
        description="The page you’re looking for isn’t available. Return to the portfolio, studio, or homepage."
        noindex={true}
        nofollow={true}
      />

      <Header />

      <main>
        <section className="border-b border-border">
          <div className="container max-w-6xl py-20 md:py-28">
            <div className="max-w-4xl">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                404
              </p>
              <h1 className="max-w-[11ch] font-sans text-[clamp(3.2rem,7vw,6.2rem)] font-medium leading-[0.92] tracking-[-0.075em] text-foreground">
                This page is no longer on the stage.
              </h1>
              <p className="mt-6 max-w-[38rem] text-[clamp(1rem,1.45vw,1.18rem)] leading-[1.7] tracking-[-0.015em] text-foreground/64">
                The page may have moved, been retired, or never existed in this version of the
                site. The best next step is to return to the main portfolio or continue through the
                studio and site index.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-white/18 px-5 py-3 text-[0.88rem] font-medium tracking-[-0.01em] text-foreground transition-colors hover:border-white/28 hover:bg-white/6"
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full border border-white/18 px-5 py-3 text-[0.88rem] font-medium tracking-[-0.01em] text-foreground transition-colors hover:border-white/28 hover:bg-white/6"
                >
                  Scenic Design
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sitemap"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-[0.88rem] font-medium tracking-[-0.01em] text-foreground/68 transition-colors hover:border-white/22 hover:text-foreground"
                >
                  Sitemap
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="container max-w-6xl py-14 md:py-16">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="border-t border-white/10 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Portfolio
              </p>
              <p className="max-w-[20rem] text-[1rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                Browse scenic design, rendering, experiential work, and assistant scenic credits.
              </p>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Studio
              </p>
              <p className="max-w-[20rem] text-[1rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                Articles, tutorials, tools, and scenic resources gathered into one working archive.
              </p>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Contact
              </p>
              <p className="max-w-[20rem] text-[1rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                Need a direct route? Use the contact page and I’ll point you in the right direction.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
