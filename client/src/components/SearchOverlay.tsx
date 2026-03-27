"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Command } from "@/components/ui/command";
import { groupSearchResults, type SiteSearchResult } from "@shared/siteSearch";
const SUGGESTED_SEARCHES = [
  "Million Dollar Quartet",
  "South Coast Repertory",
  "Jo Winiarski",
  "Vectorworks",
  "What scenic projects connect Brandon and Jo Winiarski?",
  "Where does Brandon write about rendering workflow?",
];

type AISearchResult = {
  summary: string;
  insight: string;
  connections: string[];
  recommendations: Array<{
    id: string;
    title: string;
    href: string;
    kind: string;
    meta?: string;
    imageUrl?: string;
    reason: string;
  }>;
  relatedQueries: string[];
};

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
  const [aiResult, setAiResult] = useState<AISearchResult | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim();

  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setResults([]);
      setAiResult(null);
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

    const controller = new AbortController();
    setLocalLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/local?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setResults([]);
          return;
        }

        const payload = await response.json();
        setResults(Array.isArray(payload?.results) ? payload.results : []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLocalLoading(false);
      }
    }, 140);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
      setLocalLoading(false);
    };
  }, [normalizedQuery, open]);

  useEffect(() => {
    if (!open) return;

    const trimmedQuery = normalizedQuery;
    const isQuestion = /\?$/.test(trimmedQuery) || /^(who|what|when|where|why|how|which)\b/i.test(trimmedQuery);

    if (trimmedQuery.length < (isQuestion ? 3 : 5)) {
      setAiResult(null);
      setAiLoading(false);
      return;
    }

    const controller = new AbortController();
    setAiLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/ai?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setAiResult(null);
          return;
        }

        const payload = await response.json();
        setAiResult(payload?.result || null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setAiResult(null);
        }
      } finally {
        setAiLoading(false);
      }
    }, 850);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
      setAiLoading(false);
    };
  }, [normalizedQuery, open]);

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
  const hasAIRecommendations = Boolean(aiResult?.recommendations?.length);
  const hasAIConnections = Boolean(aiResult?.connections?.length);
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
          Ask The Site
        </p>
        <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-white/58">
          Ask about productions, collaborators, theatres, rendering workflow, scenic process, or what connects
          one body of work to another.
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
      <div className="space-y-12">
        <div className="space-y-7">
          {aiLoading ? (
            <p className="text-[0.86rem] tracking-[0.02em] text-white/32">
              Thinking through the archive...
            </p>
          ) : null}

          {aiResult?.summary ? (
            <div className="space-y-4">
              <p className="max-w-3xl text-[1.18rem] leading-9 text-white/88 md:text-[1.28rem]">
                {aiResult.summary}
              </p>
              {aiResult?.insight ? (
                <p className="max-w-3xl text-[1rem] leading-8 text-white/56">
                  {aiResult.insight}
                </p>
              ) : null}
            </div>
          ) : aiLoading ? (
            <p className="max-w-3xl text-[1rem] leading-8 text-white/38">
              Pulling together projects, writing, and collaborators that best answer this question.
            </p>
          ) : (
            <p className="max-w-3xl text-[0.98rem] leading-8 text-white/34">
              Ask a fuller question and the site will answer it, then point you to the most relevant pages.
            </p>
          )}

          {hasAIConnections ? (
            <div className="space-y-3">
              {aiResult?.connections.map((item) => (
                <p key={item} className="max-w-3xl text-[0.96rem] leading-7 text-white/48">
                  {item}
                </p>
              ))}
            </div>
          ) : null}

          {aiResult?.recommendations?.length ? (
            <div className="space-y-4 pt-2">
              <p className="text-[0.76rem] uppercase tracking-[0.16em] text-white/32">
                Related Pages
              </p>
              <div className="space-y-1">
                {aiResult.recommendations.map((item) => (
                  <button
                    key={`${item.id}:${item.href}`}
                    type="button"
                    onClick={() => navigateTo(item.href)}
                    className="group block w-full border-b border-white/8 py-5 text-left transition-colors hover:bg-white/[0.015]"
                  >
                    <div className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-4">
                      <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-white/[0.04]">
                        {item.imageUrl ? (
                          <ProgressiveImage
                            src={item.imageUrl}
                            alt={item.title}
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
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] uppercase tracking-[0.05em] text-white/32">
                          <span>{item.kind}</span>
                          {item.meta ? <span>{item.meta}</span> : null}
                        </div>
                        <div className="mt-2 text-[1.06rem] font-medium tracking-[-0.03em] text-white transition-colors group-hover:text-white/86">
                          {item.title}
                        </div>
                        <div className="mt-1.5 max-w-2xl text-[0.93rem] leading-7 text-white/46">
                          {item.reason}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {aiResult?.relatedQueries?.length ? (
            <div className="pt-2">
              <p className="mb-3 text-[0.76rem] uppercase tracking-[0.16em] text-white/32">
                Try Next
              </p>
              <div className="flex flex-wrap gap-2.5">
                {aiResult.relatedQueries.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleQueryChange(term)}
                    className="rounded-full border border-white/10 px-3.5 py-2 text-[0.85rem] tracking-[-0.02em] text-white/56 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-white/8 pt-10">
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-[0.72rem] uppercase tracking-[0.16em] text-white/36">
              Browse Matches
            </p>
            {localLoading ? (
              <span className="text-[0.82rem] tracking-[-0.01em] text-white/34">Scanning titles, snippets, and collaborators...</span>
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
              No direct page matches yet. Try a fuller question, a production title, or a collaborator name.
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
                placeholder="Ask about a project, collaborator, theatre, or process"
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
