"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Command } from "@/components/ui/command";
import {
  buildSiteSearchEntries,
  searchSiteIndex,
  type SiteSearchResult,
  type SiteSearchSection,
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

const GOOGLE_CSE_URL = "https://cse.google.com/cse";
const GOOGLE_CSE_ID = "31973e1d4b3474539";
const PAGE_RESULT_LIMIT = 8;
const IMAGE_RESULT_LIMIT = 12;

type SearchTab = "All" | "Images" | SiteSearchSection;

const SEARCH_TABS: SearchTab[] = ["All", "Images", "Portfolio", "Writing", "Studio", "People"];
const IMAGE_SEARCH_SECTION_PRIORITY: Record<SiteSearchSection, number> = {
  Portfolio: 0,
  People: 1,
  Studio: 2,
  Writing: 3,
};

function getGoogleSearchHref(query: string) {
  const params = new URLSearchParams({ cx: GOOGLE_CSE_ID });
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  return `${GOOGLE_CSE_URL}?${params.toString()}`;
}

export default function SearchOverlay({
  open,
  onOpenChange,
  initialQuery = "",
  variant = "overlay",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
  variant?: "overlay" | "page";
}) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SiteSearchResult[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchTab>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim();
  const searchEntries = useMemo(() => buildSiteSearchEntries(), []);
  const isPage = variant === "page";

  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setResults([]);
      setActiveTab("All");
      setCurrentPage(1);
    }
  }, [initialQuery, open]);

  useEffect(() => {
    if (isPage) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
  }, [isPage, open, query]);

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
      setResults(searchSiteIndex(searchEntries, trimmedQuery).slice(0, isPage ? 120 : 32));
      setLocalLoading(false);
    }, 80);

    return () => {
      window.clearTimeout(timer);
      setLocalLoading(false);
    };
  }, [normalizedQuery, open, searchEntries]);

  useEffect(() => {
    if (!open || isPage) return;

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
  }, [isPage, onOpenChange, open]);

  const hasQuery = normalizedQuery.length > 0;

  const hasLocalResults = results.length > 0;
  const filteredResults = useMemo(() => {
    if (activeTab === "All") return results;
    if (activeTab === "Images") {
      return results
        .filter((result) => Boolean(result.imageUrl))
        .sort((a, b) => {
          const priorityDifference =
            IMAGE_SEARCH_SECTION_PRIORITY[a.section] - IMAGE_SEARCH_SECTION_PRIORITY[b.section];

          if (priorityDifference !== 0) return priorityDifference;
          return b.score - a.score;
        });
    }

    return results.filter((result) => result.section === activeTab);
  }, [activeTab, results]);
  const isImageSearch = isPage && activeTab === "Images";
  const pageResultLimit = isImageSearch ? IMAGE_RESULT_LIMIT : PAGE_RESULT_LIMIT;
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageResultLimit));
  const paginatedResults = useMemo(() => {
    if (!isPage) return filteredResults;
    const start = (currentPage - 1) * pageResultLimit;
    return filteredResults.slice(start, start + pageResultLimit);
  }, [currentPage, filteredResults, isPage, pageResultLimit]);
  const tabCounts = useMemo(() => {
    const counts = new Map<SearchTab, number>();
    counts.set("All", results.length);

    for (const tab of SEARCH_TABS) {
      if (tab === "Images") {
        counts.set(tab, results.filter((result) => Boolean(result.imageUrl)).length);
      } else if (tab !== "All") {
        counts.set(tab, results.filter((result) => result.section === tab).length);
      }
    }

    return counts;
  }, [results]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, normalizedQuery]);

  const navigateTo = (href: string) => {
    if (isPage) {
      router.push(href);
      return;
    }

    onOpenChange(false);
    router.push(href);
  };

  const handleQueryChange = (nextValue: string) => {
    setQuery(nextValue);
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setCurrentPage(1);
    if (isPage) {
      inputRef.current?.focus();
      return;
    }

    textareaRef.current?.focus();
  };

  const quietTextClass = isPage ? "text-[#68625a]" : "text-white/58";
  const mutedTextClass = isPage ? "text-[#777169]" : "text-white/34";
  const titleClass = isPage
    ? "text-[#111111]"
    : "text-white group-hover:text-white/86";
  const resultButtonClass = isPage
    ? "border-black/12"
    : "border-white/8 hover:bg-white/[0.015]";
  const thumbnailClass = isPage ? "bg-black/[0.045]" : "bg-white/[0.04]";
  const chipClass = isPage
    ? "border-black/10 bg-[#f7f7f5] text-[#5f5a52] hover:border-black/24 hover:bg-white hover:text-[#111111]"
    : "border-white/10 text-white/56 hover:border-white/20 hover:text-white";
  const googleSearchHref = getGoogleSearchHref(normalizedQuery);
  const paginationControls = isPage && totalPages > 1 ? (
    <nav className="flex items-center justify-between gap-4 pt-8" aria-label="Search result pages">
      <button
        type="button"
        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        disabled={currentPage === 1}
        className="text-[0.95rem] font-medium tracking-[-0.025em] text-[#111111]/72 transition-colors disabled:text-[#111111]/24 enabled:hover:text-[#111111]"
      >
        Previous
      </button>
      <p className="text-[0.95rem] tracking-[-0.025em] text-[#76716a]">
        Page {currentPage} of {totalPages}
      </p>
      <button
        type="button"
        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
        className="text-[0.95rem] font-medium tracking-[-0.025em] text-[#111111]/72 transition-colors disabled:text-[#111111]/24 enabled:hover:text-[#111111]"
      >
        Next
      </button>
    </nav>
  ) : null;

  const content = !hasQuery ? (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <p className={`max-w-2xl text-[1.08rem] leading-8 tracking-[-0.025em] ${quietTextClass}`}>
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
            className={`rounded-full border px-3.5 py-2 text-[0.9rem] tracking-[-0.02em] transition-colors ${chipClass}`}
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
          {isPage ? (
            <div className="mb-7 border-b border-black/10">
              <div className="flex items-center gap-8 overflow-x-auto">
                {SEARCH_TABS.map((tab) => {
                  const tabCount = tabCounts.get(tab) || 0;
                  const isActive = activeTab === tab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      data-search-tab={tab}
                      className={`relative shrink-0 pb-3 text-[1rem] font-medium tracking-[-0.025em] transition-colors ${
                        isActive ? "text-[#111111]" : "text-[#76716a] hover:text-[#111111]"
                      }`}
                    >
                      {tab}
                      {hasQuery ? <span className="ml-2 text-current/44">{tabCount}</span> : null}
                      {isActive ? (
                        <span className="absolute inset-x-0 bottom-0 h-px bg-[#111111]" aria-hidden="true" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mb-6 flex items-center justify-between gap-3">
            <p className={`text-[0.95rem] font-medium tracking-[-0.025em] ${mutedTextClass}`}>
              {filteredResults.length
                ? `${filteredResults.length} ${filteredResults.length === 1 ? "result" : "results"} found`
                : "No local results yet"}
            </p>
            {localLoading ? (
              <span className={`text-[0.82rem] tracking-[-0.01em] ${mutedTextClass}`}>
                Searching the site index...
              </span>
            ) : null}
          </div>

          {hasLocalResults && filteredResults.length ? isImageSearch ? (
            <div className="space-y-8">
              <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedResults.map((result, resultIndex) => (
                  <a
                    key={`${result.id}:${result.href}:image`}
                    href={result.href}
                    data-search-result-link
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden bg-black/[0.045]">
                      {result.imageUrl ? (
                        <ProgressiveImage
                          src={result.imageUrl}
                          alt={result.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                          containerClassName="h-full w-full"
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 19rem"
                          width={420}
                          loading={resultIndex < 4 ? "eager" : "lazy"}
                          fetchPriority={resultIndex < 4 ? "high" : "auto"}
                          aspectRatio="1 / 1"
                          enableScrollAnimation={false}
                        />
                      ) : null}
                    </div>
                    <div className="pt-3">
                      <p className="text-[0.92rem] leading-5 tracking-[-0.02em] text-[#76716a]">
                        {result.kind}{result.meta ? ` / ${result.meta}` : ""}
                      </p>
                      <h2 className="mt-1 font-sans text-[1.16rem] font-medium leading-[1.04] tracking-[-0.04em] text-[#111111]">
                        {result.title}
                      </h2>
                      <p className="mt-1 break-all text-[0.86rem] leading-5 tracking-[-0.02em] text-[#0a65cc]">
                        {result.href}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
              {paginationControls}
            </div>
          ) : (
            <div className="space-y-1">
              {paginatedResults.map((result, resultIndex) => {
                const resultContent = (
                  <div className={isPage ? "grid gap-5 md:grid-cols-[minmax(0,1fr)_7.25rem] md:gap-8" : "grid grid-cols-[5.25rem_minmax(0,1fr)] gap-4"}>
                    <div className="min-w-0 flex-1">
                      <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 tracking-[-0.015em] ${
                        isPage ? "text-[0.95rem] text-[#76716a]" : `text-[0.76rem] ${mutedTextClass}`
                      }`}>
                        <span>{result.kind}</span>
                        {result.meta ? <span className="text-current/54">/ {result.meta}</span> : null}
                      </div>
                      <div className={`font-sans font-medium transition-colors ${titleClass} ${
                        isPage
                          ? "mt-2 text-[clamp(1.35rem,2vw,1.85rem)] leading-[1.02] tracking-[-0.045em]"
                          : "mt-2 text-[1.18rem] leading-[1.04] tracking-[-0.04em]"
                      }`}>
                        {result.title}
                      </div>
                      <div className={`max-w-3xl ${
                        isPage
                          ? "mt-2 text-[1rem] leading-7 tracking-[-0.02em] text-[#5f5a52]"
                          : "mt-2.5 text-[0.96rem] leading-7 text-white/48"
                      }`}>
                        {result.snippet}
                      </div>
                      {isPage ? (
                        <p className="mt-1.5 break-all text-[0.92rem] leading-6 tracking-[-0.02em] text-[#0a65cc]">
                          {result.href}
                        </p>
                      ) : null}
                    </div>
                    <div className={`${isPage ? "hidden md:block" : "block"} relative aspect-square overflow-hidden ${thumbnailClass}`}>
                      {result.imageUrl ? (
                        <ProgressiveImage
                          src={result.imageUrl}
                          alt={result.title}
                          className="h-full w-full object-cover"
                          containerClassName="h-full w-full"
                          sizes={isPage ? "116px" : "84px"}
                          width={isPage ? 180 : 160}
                          loading={isPage && resultIndex === 0 ? "eager" : "lazy"}
                          fetchPriority={isPage && resultIndex === 0 ? "high" : "auto"}
                          aspectRatio="1 / 1"
                          enableScrollAnimation={!isPage}
                        />
                      ) : (
                        <div className={`h-full w-full ${thumbnailClass}`} />
                      )}
                    </div>
                  </div>
                );

                return isPage ? (
                  <a
                    key={`${result.id}:${result.href}`}
                    href={result.href}
                    data-search-result-link
                    className={`group block w-full border-b py-6 text-left transition-colors md:py-7 ${resultButtonClass}`}
                  >
                    {resultContent}
                  </a>
                ) : (
                  <button
                    key={`${result.id}:${result.href}`}
                    type="button"
                    onClick={() => navigateTo(result.href)}
                    data-search-result-link
                    className={`group block w-full border-b py-5 text-left transition-colors ${resultButtonClass}`}
                  >
                    {resultContent}
                  </button>
                );
              })}

              {paginationControls}
            </div>
          ) : localLoading ? null : (
            <div className={`py-6 text-left text-[0.98rem] leading-7 ${isPage ? "text-[#68625a]" : "text-white/40"}`}>
              <p>
                No local page matches yet. Try a production title, collaborator, theatre, tag,
                software topic, or article subject.
              </p>
              {isPage ? (
                <a
                  href={googleSearchHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-full border border-black/14 px-4 py-2 text-[0.9rem] font-medium tracking-[-0.025em] text-[#111111]/72 transition-colors hover:border-black/30 hover:text-[#111111]"
                >
                  Search deeper with Google
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (!open) return null;

  return (
    <div className={isPage ? "relative bg-[#f1f0ec]" : "fixed inset-0 z-40 bg-black pt-[74px]"}>
      <Command
        shouldFilter={false}
        className={
          isPage
            ? "mx-auto flex min-h-[calc(100vh-74px)] w-full max-w-[76rem] flex-col overflow-visible bg-transparent px-[clamp(1.35rem,5vw,5rem)] pb-24 pt-[clamp(2.75rem,6vw,5rem)] text-[#111111]"
            : "mx-auto flex h-full w-full max-w-[88rem] flex-col bg-black px-8 pb-12 pt-12 text-white md:px-12 md:pt-14"
        }
      >
        <div className="mx-auto w-full max-w-[60rem]">
          <div className={`pb-5 md:pb-6 ${isPage ? "border-b border-black/10" : "border-b border-white/12"}`}>
            <div className={isPage ? "relative flex items-center rounded-[1.15rem] border border-black/24 px-5 py-4" : "flex items-start"}>
              {isPage ? (
                <span className="mr-3 inline-flex text-[#7d7973]" aria-hidden="true">
                  <Search className="h-6 w-6" strokeWidth={1.75} />
                </span>
              ) : null}
              {isPage ? (
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Search projects, articles, tutorials, tags, people, or process"
                  autoFocus
                  type="search"
                  className="h-[3.4rem] min-w-0 flex-1 bg-transparent px-0 py-0 font-sans text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-none tracking-[-0.045em] text-[#111111] outline-hidden placeholder:text-[#9c958c]/48"
                />
              ) : (
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Search projects, articles, tutorials, tags, people, or process"
                  autoFocus
                  rows={1}
                  className="max-h-[220px] min-h-[3.4rem] w-full resize-none overflow-y-auto bg-transparent px-0 py-0 font-sans text-[clamp(1.25rem,2.3vw,2.35rem)] font-medium leading-[1.14] tracking-[-0.045em] text-white outline-hidden placeholder:text-white/26"
                />
              )}
              {isPage && query ? (
                <button
                  type="button"
                  onClick={clearQuery}
                  className="ml-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8c8c91] text-white transition-colors hover:bg-[#6f6f74]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" strokeWidth={2.2} />
                </button>
              ) : null}
            </div>
            {isPage ? (
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={googleSearchHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.95rem] font-medium tracking-[-0.025em] text-[#111111]/58 transition-colors hover:text-[#111111]"
                >
                  Search with Google
                </a>
              </div>
            ) : null}
          </div>

          <div className={isPage ? "px-0 py-8 md:py-10" : "max-h-[calc(100vh-11rem)] overflow-y-auto px-0 py-8 md:py-10"}>
            {content}
          </div>
        </div>
      </Command>
    </div>
  );
}
