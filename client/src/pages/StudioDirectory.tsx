import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import StructuredData from "@/components/StructuredData";
import { getLocalStudioDirectory } from "@shared/localStudio";

function getDirectoryPlaceholder(name: string) {
  const value = String(name || "resource");
  const hash = value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const hueA = (hash * 0.82 + 12) % 360;
  const hueB = (hash * 1.19 + 96) % 360;
  const hueC = (hash * 1.57 + 208) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${value}"><defs><clipPath id="clip"><circle cx="32" cy="32" r="28"/></clipPath><filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.8"/></filter><filter id="paper" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${hash % 97}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.035"/></feComponentTransfer></filter></defs><g clip-path="url(#clip)"><rect width="64" height="64" fill="#f4efe7"/><rect width="64" height="64" fill="hsl(${hueA} 32% 92%)" opacity="0.42"/><g filter="url(#soft)"><ellipse cx="22" cy="21" rx="22" ry="16" fill="hsla(${hueA} 88% 60% / 0.70)" transform="rotate(-14 22 21)"/><ellipse cx="44" cy="29" rx="18" ry="13" fill="hsla(${hueB} 92% 56% / 0.58)" transform="rotate(18 44 29)"/><ellipse cx="30" cy="45" rx="21" ry="15" fill="hsla(${hueC} 84% 58% / 0.54)" transform="rotate(-8 30 45)"/><ellipse cx="46" cy="47" rx="11" ry="8" fill="hsla(${hueA} 98% 72% / 0.36)" transform="rotate(26 46 47)"/><ellipse cx="15" cy="41" rx="10" ry="7" fill="hsla(${hueB} 98% 74% / 0.30)" transform="rotate(-24 15 41)"/></g><rect width="64" height="64" filter="url(#paper)" opacity="0.9"/></g><circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="0.9"/></svg>`;
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
    <div className="min-h-screen bg-background">
      <SEO
        title="Scenic Directory | Brandon PT Davis"
        description="A curated collection of essential resources for scenic designers, including industry organizations, software, suppliers, and research archives."
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
            "Curated scenic design resource directory for industry, software, modeling, and supplier links.",
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
            "Outbound links to scenic design resources, software, suppliers, and research references.",
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

      <main className="px-6 pb-20 pt-24 md:pt-28">
        <section className="mx-auto max-w-5xl border-b border-border/25 pb-12">
          <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
            Studio Directory
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-center font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
            Scenic Directory
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[1.08rem] leading-8 text-foreground/60 md:text-[1.16rem]">
            A curated index of organizations, archives, software, references, and suppliers that
            support scenic design research and professional practice.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-6xl border-b border-border/35 pb-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`border-b pb-1 text-[0.88rem] font-medium tracking-[-0.02em] transition-colors ${
                  selectedCategory === null
                    ? "border-foreground/45 text-foreground"
                    : "border-transparent text-foreground/44 hover:text-foreground/74"
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
                      ? "border-foreground/45 text-foreground"
                      : "border-transparent text-foreground/44 hover:text-foreground/74"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search the directory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-full border-border/60 bg-background pl-9 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSortBy("alphabetical")}
                  className={`rounded-full px-4 py-1.5 text-[0.78rem] font-medium tracking-[-0.01em] transition-colors ${
                    sortBy === "alphabetical"
                      ? "bg-white text-black"
                      : "bg-white/6 text-foreground/56 hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  Alphabetical
                </button>
                <button
                  onClick={() => setSortBy("category")}
                  className={`rounded-full px-4 py-1.5 text-[0.78rem] font-medium tracking-[-0.01em] transition-colors ${
                    sortBy === "category"
                      ? "bg-white text-black"
                      : "bg-white/6 text-foreground/56 hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  By category
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl py-14">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="grid animate-pulse gap-4 border-t border-border/35 py-5 md:grid-cols-[64px_minmax(0,1.3fr)_minmax(0,1.5fr)_auto]"
                >
                  <div className="h-12 w-12 rounded-xl bg-muted" />
                  <div className="h-7 w-48 rounded bg-muted" />
                  <div className="h-5 w-full rounded bg-muted" />
                  <div className="h-5 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : sortBy === "category" ? (
            <div className="space-y-14">
              {groupedResources.map((group) => (
                <section key={group.slug}>
                  <div className="border-b border-border/35 pb-4">
                    <h2 className="font-sans text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.02] tracking-[-0.045em] text-foreground">
                      {group.name}
                    </h2>
                  </div>

                  <div className="divide-y divide-border/30">
                    {group.items.map((resource: any) => (
                      <button
                        key={resource.id}
                        onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}
                        className="grid w-full items-start gap-4 border-t border-transparent py-5 text-left transition-colors hover:bg-white/[0.02] md:grid-cols-[64px_minmax(0,1.15fr)_minmax(0,1.5fr)_auto]"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                          <img
                            src={resource.cover_image || getDirectoryPlaceholder(resource.name)}
                            onError={(e) => {
                              e.currentTarget.src = getDirectoryPlaceholder(resource.name);
                            }}
                            className="h-full w-full object-cover"
                            alt=""
                          />
                        </div>

                        <div>
                          <p className="font-sans text-[1.05rem] font-medium leading-[1.15] tracking-[-0.03em] text-foreground">
                            {resource.name}
                          </p>
                          <p className="mt-2 text-[0.82rem] leading-5 text-foreground/38">
                            {group.name}
                          </p>
                        </div>

                        <p className="max-w-2xl text-[0.96rem] leading-7 text-foreground/58">
                          {resource.description}
                        </p>

                        <div className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-foreground/48">
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
            <div className="divide-y divide-border/30 border-t border-border/35">
              {filteredResources.map((resource: any) => {
                const category = categories.find((entry) => entry.slug === resource.category_slug);

                return (
                  <button
                    key={resource.id}
                    onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}
                    className="grid w-full items-start gap-4 py-5 text-left transition-colors hover:bg-white/[0.02] md:grid-cols-[64px_minmax(0,1.15fr)_minmax(0,1.5fr)_auto]"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <img
                        src={resource.cover_image || getDirectoryPlaceholder(resource.name)}
                        onError={(e) => {
                          e.currentTarget.src = getDirectoryPlaceholder(resource.name);
                        }}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    </div>

                    <div>
                      <p className="font-sans text-[1.05rem] font-medium leading-[1.15] tracking-[-0.03em] text-foreground">
                        {resource.name}
                      </p>
                      <p className="mt-2 text-[0.82rem] leading-5 text-foreground/38">
                        {category?.name || "Resource"}
                      </p>
                    </div>

                    <p className="max-w-2xl text-[0.96rem] leading-7 text-foreground/58">
                      {resource.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-foreground/48">
                      <span>Open</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!isLoading && filteredResources.length === 0 && (
            <div className="py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/6">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-6 font-sans text-[1.5rem] font-medium tracking-[-0.04em] text-foreground">
                No resources found
              </h3>
              <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-7 text-foreground/56">
                Try a different category or search term. Nothing in the directory matched the
                current filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="mt-6 text-[0.92rem] font-medium text-foreground/72 transition-colors hover:text-foreground"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-[108rem] border-t border-border/25 pt-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.06] px-6 py-16 text-center md:px-12 md:py-20">
            <h2 className="mx-auto max-w-4xl font-sans text-[clamp(2.4rem,4.5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.06em] text-foreground">
              Know a scenic design resource that belongs in the directory?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-foreground/58">
              Suggest an organization, archive, supplier, or tool that should be part of this
              working list.
            </p>
            <a
              href="/contact"
              className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/92"
            >
              Submit Suggestion
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
