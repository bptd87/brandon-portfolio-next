"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import {
  buildSiteSearchEntries,
  groupSearchResults,
  searchSiteIndex,
} from "@shared/siteSearch";

const SEARCH_PROMPTS = [
  "South Coast Repertory",
  "Jo Winiarski",
  "Million Dollar Quartet",
  "Lighting Designer",
  "Stephens College",
  "Vectorworks",
];

const SEARCH_ENTRIES = buildSiteSearchEntries();

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(
    () => searchSiteIndex(SEARCH_ENTRIES, deferredQuery).slice(0, 60),
    [deferredQuery]
  );

  const groupedResults = useMemo(() => groupSearchResults(results), [results]);

  const submitQuery = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Search the Site | Brandon PT Davis"
        description="Search projects, articles, collaborators, tutorials, and design credits across the Brandon PT Davis site."
        url="https://www.brandonptdavis.com/search"
        keywords="site search, scenic design projects, collaborators, articles, tutorials, Brandon PT Davis"
      />

      <Header />

      <main className="pb-24 pt-20 md:pt-28">
        <section className="container max-w-[88rem]">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl md:px-10 md:py-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                Site Search
              </p>
              <h1 className="mt-5 max-w-3xl font-sans text-[clamp(2.5rem,5.6vw,5rem)] font-medium leading-[0.94] tracking-[-0.055em] text-foreground">
                Search projects, writing, collaborators, and credits.
              </h1>
              <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-foreground/62 md:text-[1.08rem]">
                A comprehensive site search for the portfolio, articles, tutorials, collaborators,
                and published project teams. This is a true content index, not AI search.
              </p>

              <form
                className="mt-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitQuery(query);
                }}
              >
                <div className="flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-black/20 p-3 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-2 md:px-3">
                    <SearchIcon className="h-5 w-5 shrink-0 text-foreground/42" />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search a project, director, theatre, article, or collaborator"
                      className="h-12 w-full bg-transparent text-[1.15rem] tracking-[-0.02em] text-foreground outline-none placeholder:text-foreground/34"
                      autoComplete="off"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium tracking-[-0.02em] text-background transition-opacity hover:opacity-90"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {SEARCH_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setQuery(prompt);
                      submitQuery(prompt);
                    }}
                    className="rounded-full border border-white/12 px-3.5 py-2 text-[0.9rem] tracking-[-0.02em] text-foreground/64 transition-colors hover:border-white/20 hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mt-12 max-w-[88rem]">
          <div className="mx-auto max-w-5xl">
            {!deferredQuery.trim() ? (
              <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.02] px-7 py-10 text-foreground/56">
                Search can currently find:
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <p>Scenic, rendering, and experiential portfolio pages</p>
                  <p>Articles, tutorials, and studio resources</p>
                  <p>Collaborators and assistant scenic credits</p>
                  <p>Project teams, tags, organizations, and locations</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.02] px-7 py-10">
                <p className="text-sm uppercase tracking-[0.24em] text-foreground/36">No results</p>
                <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-foreground/60">
                  Nothing matched <span className="text-foreground/86">{deferredQuery}</span>.
                  Try a project title, company, director, collaborator, or tag.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                      Search Results
                    </p>
                    <h2 className="mt-3 font-sans text-[clamp(1.65rem,3vw,2.7rem)] font-medium tracking-[-0.045em] text-foreground">
                      {results.length} result{results.length === 1 ? "" : "s"} for “{deferredQuery}”
                    </h2>
                  </div>
                </div>

                {groupedResults.map(([section, sectionResults]) => (
                  <div key={section}>
                    <div className="mb-5 flex items-center gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                        {section}
                      </p>
                      <div className="h-px flex-1 bg-white/8" />
                    </div>

                    <div className="space-y-3">
                      {sectionResults.map((result) => (
                        <Link
                          key={result.id}
                          href={result.href}
                          className="group block rounded-[1.4rem] border border-white/8 bg-white/[0.02] px-5 py-5 transition-colors hover:border-white/14 hover:bg-white/[0.04]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] tracking-[-0.01em] text-foreground/42">
                                <span>{result.kind}</span>
                                {result.meta ? <span>{result.meta}</span> : null}
                              </div>
                              <h3 className="mt-2 font-sans text-[1.22rem] font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
                                {result.title}
                              </h3>
                              <p className="mt-3 max-w-3xl text-[0.97rem] leading-7 text-foreground/60">
                                {result.description}
                              </p>
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground/38 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
