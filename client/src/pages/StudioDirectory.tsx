"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { ExternalLinkPreview } from "@/components/ExternalLinkPreview";
import { ExternalLink, Search } from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import StructuredData from "@/components/StructuredData";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";
import { getLocalStudioDirectory } from "@shared/localStudio";

function getDirectoryPlaceholder(name: string) {
  const value = String(name || "resource");
  const hash = value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const hueA = (hash * 0.91 + 214) % 360;
  const hueB = (hash * 1.23 + 318) % 360;
  const hueC = (hash * 1.51 + 12) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${value}"><defs><filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.8"/></filter><filter id="grain" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${hash % 97}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.03"/></feComponentTransfer></filter></defs><rect width="64" height="64" fill="#08090d"/><rect width="64" height="64" fill="#0f1117" opacity="0.92"/><g filter="url(#soft)"><ellipse cx="22" cy="21" rx="22" ry="16" fill="hsla(${hueA} 96% 58% / 0.80)" transform="rotate(-14 22 21)"/><ellipse cx="44" cy="29" rx="18" ry="13" fill="hsla(${hueB} 94% 60% / 0.66)" transform="rotate(18 44 29)"/><ellipse cx="30" cy="45" rx="21" ry="15" fill="hsla(${hueC} 92% 56% / 0.58)" transform="rotate(-8 30 45)"/><ellipse cx="46" cy="47" rx="11" ry="8" fill="rgba(255,255,255,0.16)" transform="rotate(26 46 47)"/><ellipse cx="15" cy="41" rx="10" ry="7" fill="rgba(255,255,255,0.1)" transform="rotate(-24 15 41)"/></g><rect width="64" height="64" filter="url(#grain)" opacity="0.9"/><rect x="0.5" y="0.5" width="63" height="63" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const categories = [
  { slug: "industry", name: "Industry" },
  { slug: "research", name: "Research" },
  { slug: "software", name: "Software" },
  { slug: "modeling", name: "3D Modeling" },
  { slug: "supplies", name: "Supplies" },
];

export default function StudioDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"alphabetical" | "category">("alphabetical");
  const [searchQuery, setSearchQuery] = useState("");
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);

  const resources = getLocalStudioDirectory();
  const isLoading = false;
  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
    "--background": homeTheme.bg,
    "--foreground": homeTheme.ink,
    "--border": homeTheme.ghost,
  } as CSSProperties;
  const displayStyle = {
    color: homeTheme.ink,
    fontFamily: HOME_DISPLAY_FONT,
    fontStretch: "condensed",
  } as CSSProperties;
  const mutedStyle = { color: homeTheme.muted } as CSSProperties;
  const softPanelStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.ink,
  } as CSSProperties;
  const quietControlStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.muted,
  } as CSSProperties;
  const inputStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.ink,
  } as CSSProperties;

  const filteredResources = useMemo(() => {
    const filtered = resources.filter((resource: any) => {
      if (selectedCategory && resource.category_slug !== selectedCategory) return false;
      if (
        searchQuery &&
        !resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === "category") {
        const byCategory = (a.category_slug || "").localeCompare(b.category_slug || "");
        if (byCategory !== 0) return byCategory;
      }
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [resources, selectedCategory, searchQuery, sortBy]);

  const groupedResources = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        items: filteredResources.filter((resource: any) => resource.category_slug === category.slug),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredResources]);

  return (
    <div className="min-h-screen transition-colors duration-500" style={pageStyle}>
      <SEO
        title="Scenic Design Resource Directory | Brandon PT Davis"
        description="A curated scenic design resource directory covering theatre organizations, archives, software, drafting references, and production suppliers."
        keywords="scenic design resources, theatre suppliers, design software, theatrical organizations, scenic design community"
        type="website"
        url="https://www.brandonptdavis.com/studio/directory"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Scenic Directory", url: "https://www.brandonptdavis.com/studio/directory" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
          collectionPage={{
            name: "Scenic Directory",
            url: "https://www.brandonptdavis.com/studio/directory",
            description:
            "Curated scenic design resource directory for theatre organizations, archives, software, modeling, and supplier links.",
            about: "External resources for scenic designers and theatre production teams.",
          mainEntity: {
            name: "Directory Resources",
            itemListElement: (resources || []).slice(0, 150).map((resource: any, index: number) => ({
              position: index + 1,
              name: resource.name,
              url: resource.url,
              image: resource.cover_image || undefined,
            })),
          },
        }}
      />
      <StructuredData
        type="ItemList"
        itemList={{
          name: "Scenic Directory Resource Links",
          description:
            "Outbound links to scenic design resources, software, suppliers, and theatre research references.",
          url: "https://www.brandonptdavis.com/studio/directory",
          itemListElement: (resources || [])
            .filter((resource: any) => typeof resource.url === "string" && resource.url.startsWith("http"))
            .slice(0, 200)
            .map((resource: any, index: number) => ({
              position: index + 1,
              name: resource.name,
              url: resource.url,
              image: resource.cover_image || getDirectoryPlaceholder(resource.name),
            })),
        }}
      />

      <Header />
      <PublishingTopBar active="directory" tone="white" />

      <main className="pb-0" style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}>
        <section className="px-[clamp(1.5rem,5vw,6rem)] pb-10 pt-28 md:pb-14 md:pt-32">
          <div className="mx-auto flex max-w-[76rem] flex-col items-center text-center">
            <h1
              className="max-w-[10ch] text-[clamp(4.2rem,10vw,9.6rem)] font-black uppercase leading-[0.8] tracking-[0]"
              style={displayStyle}
            >
              DIRECTORY
          </h1>
            <p
              className="mt-7 max-w-[42rem] text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium leading-[1.35] tracking-[0]"
              style={mutedStyle}
            >
              A working list of theatre organizations, archives, software, drafting references, and suppliers for scenic design practice.
            </p>
          </div>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-5">
          <div
            className="mx-auto flex max-w-[76rem] flex-col gap-5 rounded-[1.75rem] p-4 shadow-[0_18px_54px_rgba(17,17,17,0.08)] md:p-5"
            style={softPanelStyle}
          >
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-2 text-[0.82rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5 ${
                  selectedCategory === null
                    ? ""
                    : "opacity-62 hover:opacity-100"
                }`}
                style={selectedCategory === null ? { backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk } : { color: homeTheme.ink }}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`rounded-full px-4 py-2 text-[0.82rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5 ${
                    selectedCategory === category.slug
                      ? ""
                      : "opacity-62 hover:opacity-100"
                  }`}
                  style={selectedCategory === category.slug ? { backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk } : { color: homeTheme.ink }}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                <Input
                  placeholder="Search the directory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 rounded-full border-0 pl-10 text-sm font-medium shadow-none placeholder:text-current placeholder:opacity-45"
                  style={inputStyle}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy("alphabetical")}
                  className="rounded-full px-4 py-2 text-[0.82rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                  style={sortBy === "alphabetical" ? { backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk } : quietControlStyle}
                >
                  Alphabetical
                </button>
                <button
                  onClick={() => setSortBy("category")}
                  className="rounded-full px-4 py-2 text-[0.82rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                  style={sortBy === "category" ? { backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk } : quietControlStyle}
                >
                  By category
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-8">
          {isLoading ? (
            <div className="mx-auto max-w-[76rem] space-y-4 py-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="grid animate-pulse gap-4 rounded-[1.5rem] p-5 md:grid-cols-[64px_minmax(0,1.3fr)_minmax(0,1.5fr)_auto]"
                  style={softPanelStyle}
                >
                  <div className="h-12 w-12 rounded-2xl bg-current opacity-10" />
                  <div className="h-7 w-48 rounded-full bg-current opacity-10" />
                  <div className="h-5 w-full rounded-full bg-current opacity-10" />
                  <div className="h-5 w-20 rounded-full bg-current opacity-10" />
                </div>
              ))}
            </div>
          ) : sortBy === "category" ? (
            <div className="mx-auto max-w-[76rem] space-y-8">
              {groupedResources.map((group) => (
                <section key={group.slug}>
                  <div className="py-2">
                    <h2
                      className="text-[clamp(1.7rem,3vw,2.6rem)] font-black uppercase leading-[0.9] tracking-[0]"
                      style={displayStyle}
                    >
                      {group.name}
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    {group.items.map((resource: any) => (
                      <ExternalLinkPreview
                        key={resource.id}
                        href={resource.url}
                        className="grid w-full items-start gap-4 rounded-[1.5rem] p-5 text-left shadow-[0_14px_42px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-0.5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.5fr)_auto]"
                        style={softPanelStyle}
                        previewLabel={resource.name}
                      >
                        <div>
                          <p className="text-[1.08rem] font-black leading-[1.05] tracking-[0]" style={{ color: homeTheme.ink }}>
                            {resource.name}
                          </p>
                          <p className="mt-2 text-[0.82rem] font-medium leading-5" style={mutedStyle}>
                            {group.name}
                          </p>
                        </div>

                        <p className="max-w-2xl text-[0.96rem] font-medium leading-7" style={mutedStyle}>
                          {resource.description}
                        </p>

                        <div className="inline-flex items-center gap-2 text-[0.84rem] font-black uppercase tracking-[0.04em]" style={mutedStyle}>
                          <span>Open</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </div>
                      </ExternalLinkPreview>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="mx-auto grid max-w-[76rem] gap-4">
              {filteredResources.map((resource: any) => {
                const category = categories.find((entry) => entry.slug === resource.category_slug);

                return (
                  <ExternalLinkPreview
                    key={resource.id}
                    href={resource.url}
                    className="grid w-full items-start gap-4 rounded-[1.5rem] p-5 text-left shadow-[0_14px_42px_rgba(17,17,17,0.08)] transition-transform hover:-translate-y-0.5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.5fr)_auto]"
                    style={softPanelStyle}
                    previewLabel={resource.name}
                  >
                    <div>
                      <p className="text-[1.08rem] font-black leading-[1.05] tracking-[0]" style={{ color: homeTheme.ink }}>
                        {resource.name}
                      </p>
                      <p className="mt-2 text-[0.82rem] font-medium leading-5" style={mutedStyle}>
                        {category?.name || "Resource"}
                      </p>
                    </div>

                    <p className="max-w-2xl text-[0.96rem] font-medium leading-7" style={mutedStyle}>
                      {resource.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-[0.84rem] font-black uppercase tracking-[0.04em]" style={mutedStyle}>
                      <span>Open</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </ExternalLinkPreview>
                );
              })}
            </div>
          )}

          {!isLoading && filteredResources.length === 0 && (
            <div className="px-6 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={softPanelStyle}>
                <Search className="h-6 w-6 opacity-50" />
              </div>
              <h3 className="mt-6 text-[1.5rem] font-black tracking-[0]" style={displayStyle}>
                No resources found
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[0.98rem] font-medium leading-7" style={mutedStyle}>
                Try a different category or search term. Nothing in the directory matched the
                current filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="mt-6 text-[0.92rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                style={{ color: homeTheme.ink }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
          <div
            className="mx-auto max-w-[76rem] rounded-[2rem] p-7 shadow-[0_18px_54px_rgba(17,17,17,0.08)] md:p-10"
            style={softPanelStyle}
          >
            <h2
              className="max-w-[16ch] text-[clamp(2.2rem,4.5vw,4.6rem)] font-black uppercase leading-[0.86] tracking-[0]"
              style={displayStyle}
            >
              Know a scenic design resource that belongs in the directory?
            </h2>
            <p className="mt-6 max-w-2xl text-[1rem] font-medium leading-8" style={mutedStyle}>
              Suggest an organization, archive, supplier, or tool that should be part of this
              working list.
            </p>
            <a
              href="/contact"
              className="mt-10 inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.04em] transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
            >
              Submit Suggestion
            </a>
          </div>
        </section>
      </main>

      <Footer
        tone="light"
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
      />
    </div>
  );
}
