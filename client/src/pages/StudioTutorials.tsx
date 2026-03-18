import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMemo, useState } from "react";
import { ArrowRight, Clock, PlayCircle, Search, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Input } from "@/components/ui/input";

const categories = [
  { slug: "getting-started", name: "Getting Started" },
  { slug: "2d-drafting", name: "2D Drafting" },
  { slug: "3d-modeling", name: "3D Modeling" },
  { slug: "rendering", name: "Rendering" },
];

const difficulties = [
  { slug: "beginner", name: "Beginner" },
  { slug: "intermediate", name: "Intermediate" },
  { slug: "advanced", name: "Advanced" },
];

const normalizeToken = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getCategoryLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return categories.find((category) => category.slug === normalized)?.name || value || "Tutorial";
};

const getDifficultyLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return difficulties.find((difficulty) => difficulty.slug === normalized)?.name || value || "General";
};

const getTutorialSummary = (tutorial: any) => {
  if (tutorial.description && String(tutorial.description).trim()) {
    return tutorial.description;
  }

  const category = getCategoryLabel(tutorial.category);
  const difficulty = getDifficultyLabel(tutorial.difficulty);
  return `${category} tutorial covering ${tutorial.title.replace(/^Vectorworks Tutorial:\s*/i, "").replace(/^Vectorworks Quick Tip:\s*/i, "").trim()} with a ${difficulty.toLowerCase()} workflow focus.`;
};

export default function StudioTutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "alphabetical" | "duration">("newest");

  const { data: tutorials = [], isLoading } = trpc.tutorials.list.useQuery({ status: "published" });

  const sortedTutorials = useMemo(() => {
    const filtered = tutorials.filter((tutorial: any) => {
      if (selectedCategory && normalizeToken(tutorial.category) !== selectedCategory) return false;
      if (selectedDifficulty && normalizeToken(tutorial.difficulty) !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
          !tutorial.title.toLowerCase().includes(query) &&
          !tutorial.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });

    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === "alphabetical") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }
      if (sortBy === "duration") {
        return Number(b.duration || 0) - Number(a.duration || 0);
      }
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  }, [tutorials, selectedCategory, selectedDifficulty, searchQuery, sortBy]);

  const hasActiveFilters = Boolean(selectedCategory || selectedDifficulty || searchQuery.trim());
  const featuredTutorials = hasActiveFilters ? [] : sortedTutorials.slice(0, 3);
  const tutorialIndex = hasActiveFilters ? sortedTutorials : sortedTutorials.slice(3);

  const formatDuration = (duration: string | number | null | undefined) => {
    if (!duration) return "10 min";
    if (typeof duration === "string") {
      const [mins] = duration.split(":");
      return `${mins || duration} min`;
    }
    return `${Math.floor(duration / 60)} min`;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Vectorworks Tutorials | Brandon PT Davis"
        description="Free Vectorworks tutorials for scenic designers. Step-by-step video lessons covering 2D drafting, 3D modeling, rendering, and advanced techniques for theatrical design."
        keywords="Vectorworks tutorials, scenic design software, 3D modeling theatre, rendering tutorials, CAD for theatre, Vectorworks training, theatrical design software"
        type="website"
        url="https://www.brandonptdavis.com/studio/tutorials"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Tutorials", url: "https://www.brandonptdavis.com/studio/tutorials" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Vectorworks Tutorials",
          url: "https://www.brandonptdavis.com/studio/tutorials",
          description:
            "Structured tutorial paths for scenic designers using Vectorworks and rendering workflows.",
          about: "Tutorial videos and walkthroughs by Brandon PT Davis.",
          primaryImageOfPage: tutorials?.[0]?.cover_image || undefined,
          mainEntity: {
            name: "Tutorials",
            itemListElement: tutorials.slice(0, 60).map((tutorial: any, index: number) => ({
              position: index + 1,
              name: tutorial.title,
              url: `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug || tutorial.id}`,
              image: tutorial.cover_image || undefined,
            })),
          },
        }}
      />
      <StructuredData
        type="Course"
        course={{
          name: "Vectorworks Tutorials for Scenic Designers",
          description:
            "A structured tutorial library covering drafting, modeling, rendering, and production-ready documentation workflows.",
          url: "https://www.brandonptdavis.com/studio/tutorials",
          provider: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
            type: "EducationalOrganization",
          },
          teaches: [
            "2D drafting workflows",
            "3D scenic modeling",
            "Rendering and visualization",
            "Production documentation",
          ],
          inLanguage: "en-US",
          keywords: [
            "vectorworks tutorials",
            "scenic design education",
            "theatre drafting training",
          ],
        }}
      />

      <Header />

      <main className="px-6 pb-20 pt-24 md:pt-28">
        <section className="mx-auto max-w-5xl border-b border-border/25 pb-12">
          <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
            Studio Tutorials
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-center font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
            Vectorworks tutorials for scenic designers.
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[1.08rem] leading-8 text-foreground/60 md:text-[1.16rem]">
            A structured library of walkthroughs covering drafting, modeling, rendering, and
            production-ready workflow for theatrical design.
          </p>

          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                Tutorials
              </p>
              <p className="mt-2 text-[1.05rem] text-foreground/72">{tutorials.length}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                Filtered
              </p>
              <p className="mt-2 text-[1.05rem] text-foreground/72">{sortedTutorials.length}</p>
            </div>
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                Difficulty
              </p>
              <p className="mt-2 text-[1.05rem] text-foreground/72">Beginner to Advanced</p>
            </div>
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                Format
              </p>
              <p className="mt-2 text-[1.05rem] text-foreground/72">Video + steps</p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-6xl border-b border-border/20 pb-8">
          <div className="flex flex-col gap-6">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-full border-border/60 bg-background pl-9 text-sm"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                  Category
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`border-b pb-1 text-[0.86rem] font-medium tracking-[-0.02em] transition-colors ${
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
                      className={`border-b pb-1 text-[0.86rem] font-medium tracking-[-0.02em] transition-colors ${
                        selectedCategory === category.slug
                          ? "border-foreground/45 text-foreground"
                          : "border-transparent text-foreground/44 hover:text-foreground/74"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                  Difficulty
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  <button
                    onClick={() => setSelectedDifficulty(null)}
                    className={`border-b pb-1 text-[0.86rem] font-medium tracking-[-0.02em] transition-colors ${
                      selectedDifficulty === null
                        ? "border-foreground/45 text-foreground"
                        : "border-transparent text-foreground/44 hover:text-foreground/74"
                    }`}
                  >
                    All levels
                  </button>
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty.slug}
                      onClick={() => setSelectedDifficulty(difficulty.slug)}
                      className={`border-b pb-1 text-[0.86rem] font-medium tracking-[-0.02em] transition-colors ${
                        selectedDifficulty === difficulty.slug
                          ? "border-foreground/45 text-foreground"
                          : "border-transparent text-foreground/44 hover:text-foreground/74"
                      }`}
                    >
                      {difficulty.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/36">
                  Sort
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`border-b pb-1 text-[0.86rem] font-medium tracking-[-0.02em] transition-colors ${
                      sortBy === "newest"
                        ? "border-foreground/45 text-foreground"
                        : "border-transparent text-foreground/44 hover:text-foreground/74"
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortBy("alphabetical")}
                    className={`border-b pb-1 text-[0.86rem] font-medium tracking-[-0.02em] transition-colors ${
                      sortBy === "alphabetical"
                        ? "border-foreground/45 text-foreground"
                        : "border-transparent text-foreground/44 hover:text-foreground/74"
                    }`}
                  >
                    A-Z
                  </button>
                  <button
                    onClick={() => setSortBy("duration")}
                    className={`border-b pb-1 text-[0.86rem] font-medium tracking-[-0.02em] transition-colors ${
                      sortBy === "duration"
                        ? "border-foreground/45 text-foreground"
                        : "border-transparent text-foreground/44 hover:text-foreground/74"
                    }`}
                  >
                    Duration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <section className="mx-auto max-w-6xl py-14">
            <div className="grid gap-6 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.25rem] border border-border/20 bg-card/10"
                >
                  <div className="aspect-[16/10] animate-pulse bg-muted" />
                  <div className="p-5">
                    <div className="h-5 w-24 rounded bg-muted" />
                    <div className="mt-4 h-7 w-48 rounded bg-muted" />
                    <div className="mt-4 h-4 w-full rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            {featuredTutorials.length > 0 && (
              <section className="mx-auto max-w-6xl py-14">
                <div className="max-w-3xl">
                  <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                    Start here.
                  </h2>
                  <p className="mt-6 text-[1.04rem] leading-8 text-foreground/60 md:text-[1.1rem]">
                    A few recommended tutorials to anchor the library. These are good entry points
                    into drafting, modeling, and scenic workflow.
                  </p>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-3">
                  {featuredTutorials.map((tutorial: any) => {
                    const slug = tutorial.slug || tutorial.id.toString();
                    return (
                      <Link key={tutorial.id} href={`/studio/tutorials/${slug}`} className="group block">
                        <div className="overflow-hidden rounded-[1.25rem] border border-border/20 bg-card/10 transition-colors hover:border-border/40">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={tutorial.cover_image}
                              alt={tutorial.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                            <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/72 px-3 py-1.5 text-[0.74rem] font-medium text-white backdrop-blur-sm">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDuration(tutorial.duration)}
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                                {getCategoryLabel(tutorial.category)}
                              </p>
                              {tutorial.difficulty && (
                                <p className="text-[0.76rem] uppercase tracking-[0.14em] text-foreground/44">
                                  {getDifficultyLabel(tutorial.difficulty)}
                                </p>
                              )}
                            </div>
                            <h3 className="mt-3 font-sans text-[1.34rem] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                              {tutorial.title}
                            </h3>
                            <p className="mt-4 text-[0.96rem] leading-7 text-foreground/58">
                              {getTutorialSummary(tutorial)}
                            </p>
                            <div className="mt-6 inline-flex items-center gap-2 text-[0.9rem] font-medium text-foreground/72 transition-colors group-hover:text-foreground">
                              <PlayCircle className="h-4 w-4" />
                              <span>Watch tutorial</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="mx-auto max-w-6xl border-t border-border/20 py-14">
              <div className="max-w-3xl">
                <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                  Tutorial index.
                </h2>
                <p className="mt-6 text-[1.04rem] leading-8 text-foreground/60 md:text-[1.1rem]">
                  Browse the full library as a cleaner index. Use the filters above to narrow by
                    category or difficulty.
                  </p>
                </div>

              <div className="mt-10 divide-y divide-border/18 border-t border-border/18">
                {tutorialIndex.map((tutorial: any) => {
                  const slug = tutorial.slug || tutorial.id.toString();
                  return (
                    <Link
                      key={tutorial.id}
                      href={`/studio/tutorials/${slug}`}
                      className="grid items-start gap-4 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-[minmax(0,1.2fr)_120px_minmax(0,1.6fr)_auto]"
                    >
                      <div>
                        <p className="font-sans text-[1.05rem] font-medium leading-[1.15] tracking-[-0.03em] text-foreground">
                          {tutorial.title}
                        </p>
                        <p className="mt-2 text-[0.82rem] leading-5 text-foreground/38">
                          {getCategoryLabel(tutorial.category)}
                        </p>
                      </div>

                      <div className="text-[0.84rem] leading-6 text-foreground/46">
                        {getDifficultyLabel(tutorial.difficulty)}
                      </div>

                      <p className="max-w-2xl text-[0.96rem] leading-7 text-foreground/58">
                        {getTutorialSummary(tutorial)}
                      </p>

                      <div className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-foreground/48">
                        <span>{formatDuration(tutorial.duration)}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {tutorialIndex.length === 0 && sortedTutorials.length > 0 && (
                <div className="mt-8 text-[0.92rem] text-foreground/42">
                  The current filter set is showing everything in the library.
                </div>
              )}
            </section>
          </>
        )}

        {!isLoading && sortedTutorials.length === 0 && (
          <section className="mx-auto max-w-6xl py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/6">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-6 font-sans text-[1.5rem] font-medium tracking-[-0.04em] text-foreground">
              No tutorials found
            </h3>
            <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-7 text-foreground/56">
              Try another category, difficulty level, or search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDifficulty(null);
                setSearchQuery("");
                setSortBy("newest");
              }}
              className="mt-6 text-[0.92rem] font-medium text-foreground/72 transition-colors hover:text-foreground"
            >
              Clear filters
            </button>
          </section>
        )}

        <section className="mx-auto max-w-[108rem] border-t border-border/25 pt-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.06] px-6 py-16 text-center md:px-12 md:py-20">
            <h2 className="mx-auto max-w-4xl font-sans text-[clamp(2.4rem,4.5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.06em] text-foreground">
              Keep learning beyond the tutorial library.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-8 text-foreground/58">
              For official software training and deeper certification pathways, continue into the
              wider Vectorworks ecosystem or related scenic design articles.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://university.vectorworks.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/92"
              >
                <span>Visit Vectorworks University</span>
                <TrendingUp className="h-4 w-4" />
              </a>
              <a
                href="/articles?category=technology-tutorials"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-white/14"
              >
                <span>Read Related Articles</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
