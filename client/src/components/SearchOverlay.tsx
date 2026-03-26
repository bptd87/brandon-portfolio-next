"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  buildSiteSearchEntries,
  groupSearchResults,
  searchSiteIndex,
} from "@shared/siteSearch";

const SEARCH_ENTRIES = buildSiteSearchEntries();

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
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
    }
  }, [initialQuery, open]);

  const results = useMemo(
    () => searchSiteIndex(SEARCH_ENTRIES, deferredQuery).slice(0, 36),
    [deferredQuery]
  );

  const groupedResults = useMemo(() => groupSearchResults(results), [results]);

  const navigateTo = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Site"
      description="Search the site."
      showCloseButton={false}
      className="border-none bg-transparent p-0 shadow-none sm:max-w-[62rem]"
    >
      <div className="mx-auto w-full max-w-3xl px-6 py-8 md:px-8 md:py-10">
        <div className="border-b border-white/10 pb-4 md:pb-5">
          <div className="flex items-center gap-4">
            <SearchIcon className="h-5 w-5 shrink-0 text-white/38" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search the site"
              className="h-auto border-none bg-transparent px-0 py-0 text-[clamp(1.5rem,3.5vw,3rem)] font-sans font-medium tracking-[-0.05em] text-white placeholder:text-white/28"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close search"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/54 transition-colors hover:border-white/20 hover:text-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <CommandList className="max-h-[min(62vh,40rem)] px-0 py-6 md:py-7">
          <CommandEmpty className="px-0 py-12 text-left">
            <p className="text-[0.98rem] leading-7 text-white/50">No matches found.</p>
          </CommandEmpty>

          {!deferredQuery.trim() ? (
            <div className="px-0 py-10 text-[0.98rem] leading-7 text-white/42">
              Type a project, person, company, or topic.
            </div>
          ) : (
            groupedResults.map(([section, sectionResults]) => (
              <CommandGroup
                key={section}
                heading={section}
                className="mb-8 p-0"
              >
                {sectionResults.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={result.searchText}
                    onSelect={() => navigateTo(result.href)}
                    className="group rounded-[1.15rem] border border-transparent px-0 py-4 data-[selected=true]:border-white/8 data-[selected=true]:bg-white/[0.03] data-[selected=true]:text-white"
                  >
                    <div className="min-w-0 flex-1 px-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] tracking-[-0.01em] text-white/38">
                        <span>{result.kind}</span>
                        {result.meta ? <span>{result.meta}</span> : null}
                      </div>
                      <div className="mt-1.5 font-sans text-[1.08rem] font-medium leading-[1.08] tracking-[-0.03em] text-white">
                        {result.title}
                      </div>
                      <div className="mt-2 text-[0.93rem] leading-7 text-white/52">
                        {result.snippet}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </div>
    </CommandDialog>
  );
}
