"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import StructuredData from "@/components/StructuredData";
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

  const resources = getLocalStudioDirectory();
  const isLoading = false;

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
    <div className="publish-editorial min-h-screen bg-[#f4f5f7] text-[#111111] [--background:#f4f5f7] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
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
      <PublishingTopBar active="directory" tone="light" />

      <main className="pb-0">
        <section className="border-b border-black/10 px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-18">
          <p className="section-kicker text-black/40">
            Studio Directory
          </p>
          <h1 className="mt-6 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.8rem)] font-medium leading-[0.88] tracking-[-0.075em] text-[#111111]">
            Scenic Directory
          </h1>
          <p className="mt-8 max-w-3xl text-[1.02rem] leading-8 tracking-[-0.018em] text-black/60 md:text-[1.16rem]">
            A curated index of theatre organizations, archives, software, drafting references, and
            suppliers that support scenic design research and professional practice.
          </p>
        </section>

        <section className="border-b border-black/10 bg-[#f4f5f7] px-[clamp(1.5rem,5vw,6rem)] py-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`border-b pb-1 text-[0.88rem] font-medium tracking-[-0.02em] transition-colors ${
                  selectedCategory === null
                    ? "border-black/50 text-black"
                    : "border-transparent text-black/44 hover:text-black/74"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`border-b pb-1 text-[0.88rem] font-medium tracking-[-0.02em] transition-colors ${
                    selectedCategory === category.slug
                      ? "border-black/50 text-black"
                      : "border-transparent text-black/44 hover:text-black/74"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/42" />
                <Input
                  placeholder="Search the directory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-full border-black/12 bg-[#fbfaf7] pl-9 text-sm text-black placeholder:text-black/36"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy("alphabetical")}
                  className={`rounded-full px-4 py-1.5 text-[0.78rem] font-medium tracking-[-0.01em] transition-colors ${
                    sortBy === "alphabetical"
                      ? "bg-black text-white"
                      : "border border-black/10 text-black/56 hover:border-black/20 hover:text-black"
                  }`}
                >
                  <span style={sortBy === "alphabetical" ? { color: "#f1f0ec" } : undefined}>
                    Alphabetical
                  </span>
                </button>
                <button
                  onClick={() => setSortBy("category")}
                  className={`rounded-full px-4 py-1.5 text-[0.78rem] font-medium tracking-[-0.01em] transition-colors ${
                    sortBy === "category"
                      ? "bg-black text-white"
                      : "border border-black/10 text-black/56 hover:border-black/20 hover:text-black"
                  }`}
                >
                  <span style={sortBy === "category" ? { color: "#f1f0ec" } : undefined}>
                    By category
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f4f5f7]">
          {isLoading ? (
            <div className="px-[clamp(1.5rem,5vw,6rem)] py-10">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="grid animate-pulse gap-4 border-t border-black/10 py-5 md:grid-cols-[64px_minmax(0,1.3fr)_minmax(0,1.5fr)_auto]"
                >
                  <div className="h-12 w-12 bg-black/8" />
                  <div className="h-7 w-48 bg-black/8" />
                  <div className="h-5 w-full bg-black/8" />
                  <div className="h-5 w-20 bg-black/8" />
                </div>
              ))}
            </div>
          ) : sortBy === "category" ? (
            <div>
              {groupedResources.map((group) => (
                <section key={group.slug} className="border-t border-black/10">
                  <div className="px-[clamp(1.5rem,5vw,6rem)] py-6">
                    <h2 className="font-sans text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.02] tracking-[-0.045em] text-black">
                      {group.name}
                    </h2>
                  </div>

                  <div className="border-t border-black/10">
                    {group.items.map((resource: any) => (
                      <button
                        key={resource.id}
                        onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}
                        className="grid w-full items-start gap-4 border-b border-black/8 px-[clamp(1.5rem,5vw,6rem)] py-5 text-left transition-colors hover:bg-white md:grid-cols-[64px_minmax(0,1.15fr)_minmax(0,1.5fr)_auto]"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden border border-black/10 bg-black/[0.035] [border-radius:0]">
                          <img
                            src={resource.cover_image || getDirectoryPlaceholder(resource.name)}
                            onError={(e) => {
                              e.currentTarget.src = getDirectoryPlaceholder(resource.name);
                            }}
                            className="h-full w-full object-cover [border-radius:0]"
                            alt=""
                          />
                        </div>

                        <div>
                          <p className="font-sans text-[1.05rem] font-medium leading-[1.15] tracking-[-0.03em] text-black">
                            {resource.name}
                          </p>
                          <p className="mt-2 text-[0.82rem] leading-5 text-black/38">
                            {group.name}
                          </p>
                        </div>

                        <p className="max-w-2xl text-[0.96rem] leading-7 text-black/58">
                          {resource.description}
                        </p>

                        <div className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-black/48">
                          <span>Open</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="border-t border-black/10">
              {filteredResources.map((resource: any) => {
                const category = categories.find((entry) => entry.slug === resource.category_slug);

                return (
                  <button
                    key={resource.id}
                    onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}
                    className="grid w-full items-start gap-4 border-b border-black/8 px-[clamp(1.5rem,5vw,6rem)] py-5 text-left transition-colors hover:bg-white md:grid-cols-[64px_minmax(0,1.15fr)_minmax(0,1.5fr)_auto]"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden border border-black/10 bg-black/[0.035] [border-radius:0]">
                      <img
                        src={resource.cover_image || getDirectoryPlaceholder(resource.name)}
                        onError={(e) => {
                          e.currentTarget.src = getDirectoryPlaceholder(resource.name);
                        }}
                        className="h-full w-full object-cover [border-radius:0]"
                        alt=""
                      />
                    </div>

                    <div>
                      <p className="font-sans text-[1.05rem] font-medium leading-[1.15] tracking-[-0.03em] text-black">
                        {resource.name}
                      </p>
                      <p className="mt-2 text-[0.82rem] leading-5 text-black/38">
                        {category?.name || "Resource"}
                      </p>
                    </div>

                    <p className="max-w-2xl text-[0.96rem] leading-7 text-black/58">
                      {resource.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-black/48">
                      <span>Open</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!isLoading && filteredResources.length === 0 && (
            <div className="px-6 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center border border-black/10 bg-black/[0.035]">
                <Search className="h-6 w-6 text-black/42" />
              </div>
              <h3 className="mt-6 font-sans text-[1.5rem] font-medium tracking-[-0.04em] text-black">
                No resources found
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-7 text-black/56">
                Try a different category or search term. Nothing in the directory matched the
                current filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="mt-6 text-[0.92rem] font-medium text-black/72 transition-colors hover:text-black"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="border-t border-black/10 bg-[#f1f0ec] px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
          <div className="max-w-4xl">
            <h2 className="font-sans text-[clamp(2.4rem,4.5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.06em] text-black">
              Know a scenic design resource that belongs in the directory?
            </h2>
            <p className="mt-6 max-w-2xl text-[1rem] leading-8 text-black/58">
              Suggest an organization, archive, supplier, or tool that should be part of this
              working list.
            </p>
            <a
              href="/contact"
              className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-black/80"
            >
              <span style={{ color: "#f1f0ec" }}>Submit Suggestion</span>
            </a>
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
