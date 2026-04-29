"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Command } from "@/components/ui/command";
import {
  buildSiteSearchEntries,
  groupSearchResults,
  searchSiteIndex,
  type SiteSearchResult,
} from "@shared/siteSearch";
const SUGGESTED_SEARCHES = [
  "Million Dollar Quartet",
  "South Coast Repertory",
  "Jo Winiarski",
  "Vectorworks",
  "Rendering workflow",
  "Texture tutorials",
  "Teaching philosophy",
  "Design process",
];

export default function SearchOverlay({
  open,
  onOpenChange,
  initialQuery = "",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim();
  const searchEntries = useMemo(() => buildSiteSearchEntries(), []);

  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setResults([]);
    }
  }, [initialQuery, open]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, [open, query]);

  useEffect(() => {
    if (!open) return;

    const trimmedQuery = normalizedQuery;
    if (trimmedQuery.length < 2) {
      setResults([]);
      setLocalLoading(false);
      return;
    }

    setLocalLoading(true);

    const timer = window.setTimeout(() => {
      setResults(searchSiteIndex(searchEntries, trimmedQuery).slice(0, 32));
      setLocalLoading(false);
    }, 80);

    return () => {
      window.clearTimeout(timer);
      setLocalLoading(false);
    };
  }, [normalizedQuery, open, searchEntries]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  const hasQuery = normalizedQuery.length > 0;

  const groupedResults = useMemo(() => groupSearchResults(results), [results]);
  const hasLocalResults = results.length > 0;

  const navigateTo = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const handleQueryChange = (nextValue: string) => {
    setQuery(nextValue);
  };

  const content = !hasQuery ? (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <p className="text-[0.78rem] uppercase tracking-[0.18em] text-white/34">
          Site Search
        </p>
        <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-white/58">
          Search across portfolio projects, articles, tutorials, collaborators, studio resources,
          teaching pages, tags, and process writing.
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {SUGGESTED_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handleQueryChange(term)}
            className="rounded-full border border-white/10 px-3.5 py-2 text-[0.9rem] tracking-[-0.02em] text-white/56 transition-colors hover:border-white/20 hover:text-white"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <>
      <div className="space-y-10">
        <div>
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-[0.72rem] uppercase tracking-[0.16em] text-white/36">
              {hasLocalResults
                ? `${results.length} ${results.length === 1 ? "result" : "results"}`
                : "Search Results"}
            </p>
            {localLoading ? (
              <span className="text-[0.82rem] tracking-[-0.01em] text-white/34">
                Searching the site index...
              </span>
            ) : null}
          </div>

          {hasLocalResults ? (
            <div className="space-y-10">
              {groupedResults.map(([section, sectionResults]) => (
                <section key={section} className="space-y-3">
                  <p className="text-[0.76rem] uppercase tracking-[0.16em] text-white/30">
                    {section}
                  </p>
                  <div className="space-y-1">
                    {sectionResults.map((result) => (
                      <button
                        key={`${result.id}:${result.href}`}
                        type="button"
                        onClick={() => navigateTo(result.href)}
                        className="group block w-full border-b border-white/8 py-5 text-left transition-colors hover:bg-white/[0.015]"
                      >
                        <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-4">
                          <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-white/[0.04]">
                            {result.imageUrl ? (
                              <ProgressiveImage
                                src={result.imageUrl}
                                alt={result.title}
                                className="h-full w-full object-cover"
                                containerClassName="h-full w-full"
                                sizes="84px"
                                width={160}
                                aspectRatio="1 / 1"
                              />
                            ) : (
                              <div className="h-full w-full bg-white/[0.04]" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] tracking-[0.02em] text-white/34 uppercase">
                              <span>{result.kind}</span>
                              {result.meta ? <span>{result.meta}</span> : null}
                            </div>
                            <div className="mt-2 font-sans text-[1.18rem] font-medium leading-[1.04] tracking-[-0.04em] text-white transition-colors group-hover:text-white/86">
                              {result.title}
                            </div>
                            <div className="mt-2.5 max-w-3xl text-[0.96rem] leading-7 text-white/48">
                              {result.snippet}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : localLoading ? null : (
            <div className="py-6 text-left text-[0.98rem] leading-7 text-white/40">
              No page matches yet. Try a production title, collaborator, theatre, tag, software topic,
              or article subject.
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (!open) return null;

  return (
      <div className="fixed inset-0 z-40 bg-black pt-[74px]">
      <Command
        shouldFilter={false}
        className="mx-auto flex h-full w-full max-w-[88rem] flex-col bg-black px-8 pb-12 pt-12 text-white md:px-12 md:pt-14"
      >
        <div className="mx-auto w-full max-w-[56rem]">
          <div className="border-b border-white/12 pb-5 md:pb-6">
            <div className="flex items-start">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="Search projects, articles, tutorials, tags, people, or process"
                autoFocus
                rows={1}
                className="max-h-[220px] min-h-[3.4rem] w-full resize-none overflow-y-auto bg-transparent px-0 py-0 text-[clamp(1.25rem,2.3vw,2.35rem)] leading-[1.14] font-sans font-medium tracking-[-0.045em] text-white outline-hidden placeholder:text-white/26"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto px-0 py-8 md:py-10">
            {content}
          </div>
        </div>
      </Command>
    </div>
  );
}
