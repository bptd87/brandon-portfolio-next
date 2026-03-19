import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  Keyboard,
  Lightbulb,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import StructuredData from "@/components/StructuredData";
import { SEO } from "@/components/SEO";

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
  return (
    difficulties.find((difficulty) => difficulty.slug === normalized)?.name ||
    value ||
    "General"
  );
};

const getTutorialSummary = (tutorial: any) => {
  if (tutorial.description && String(tutorial.description).trim()) {
    return tutorial.description;
  }

  const category = getCategoryLabel(tutorial.category);
  const difficulty = getDifficultyLabel(tutorial.difficulty);
  return `${category} tutorial covering ${tutorial.title
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/^Vectorworks Quick Tip:\s*/i, "")
    .trim()} with a ${difficulty.toLowerCase()} workflow focus.`;
};

const getOverviewParagraphs = (value: string | null | undefined) =>
  String(value || "")
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

export default function TutorialDetail() {
  const params = useParams();
  const slug = params.slug;

  const { data: tutorial, isLoading, error } = trpc.tutorials.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  const getYouTubeId = (url: string | undefined | null) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : url;
  };

  const formatDuration = (duration: string | number | null | undefined) => {
    if (!duration) return "10 min";
    if (typeof duration === "string") {
      if (duration.includes(":")) {
        const [mins] = duration.split(":");
        return `${mins || duration} min`;
      }
      return duration;
    }
    return `${Math.max(1, Math.floor(duration / 60))} min`;
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const overviewParagraphs = getOverviewParagraphs(tutorial?.overview);

  const tabs = useMemo(() => {
    if (!tutorial) return [];

    const available = [];

    if ((tutorial.learning_objectives || []).length || overviewParagraphs.length) {
      available.push({ value: "overview", label: "Overview" });
    }
    if ((tutorial.key_concepts || []).length || (tutorial.pro_tips || []).length) {
      available.push({ value: "concepts", label: "Concepts" });
    }
    if ((tutorial.shortcuts || []).length || (tutorial.common_pitfalls || []).length) {
      available.push({ value: "reference", label: "Reference" });
    }
    if ((tutorial.transcript || []).length) {
      available.push({ value: "transcript", label: "Transcript" });
    }
    if ((tutorial.related_resources || []).length || (tutorial.related_tutorials || []).length) {
      available.push({ value: "resources", label: "Resources" });
    }

    return available;
  }, [overviewParagraphs.length, tutorial]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin text-foreground/56">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <p className="mt-4 text-[0.98rem] text-foreground/52">Loading tutorial...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-sans text-[2.5rem] font-medium tracking-[-0.05em] text-foreground">
              Tutorial not found
            </h1>
            <Link
              href="/studio/tutorials"
              className="mt-6 inline-flex items-center gap-2 text-[0.98rem] font-medium text-foreground/68 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tutorials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeId(tutorial.video_url);
  const tutorialSummary = getTutorialSummary(tutorial);

  const defaultTab = tabs[0]?.value || "overview";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${tutorial.title} | Brandon PT Davis`}
        description={tutorialSummary}
        image={`https://img.youtube.com/vi/${videoId || ""}/maxresdefault.jpg`}
        type="website"
      />
      <StructuredData
        type="VideoObject"
        videoObject={{
          name: tutorial.title,
          description: tutorialSummary || undefined,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId || ""}/maxresdefault.jpg`,
          uploadDate: new Date(tutorial.created_at).toISOString(),
          embedUrl: `https://www.youtube.com/embed/${videoId || ""}`,
          contentUrl: `https://www.youtube.com/watch?v=${videoId || ""}`,
          publisher: {
            name: "Brandon PT Davis Design",
            logo: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/site-assets/publisher-logo-favicon-32.png",
          },
        }}
      />
      <StructuredData
        type="HowTo"
        howTo={{
          name: tutorial.title,
          description: tutorialSummary || undefined,
          image: `https://img.youtube.com/vi/${videoId || ""}/maxresdefault.jpg`,
          totalTime: tutorial.duration
            ? `PT${Math.floor(Number(tutorial.duration) / 60)}M`
            : undefined,
          step: (tutorial.learning_objectives || []).map((objective: string, index: number) => ({
            name: objective,
            url: `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug}#step-${index + 1}`,
          })),
          tool: (tutorial.related_resources || [])
            .filter((resource: any) => resource.type === "Software" || resource.type === "Tool")
            .map((resource: any) => ({
              name: resource.title,
              url: resource.url,
            })),
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Tutorials", url: "https://www.brandonptdavis.com/studio/tutorials" },
          {
            name: tutorial.title,
            url: `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug}`,
          },
        ]}
      />

      <Header />

      <main className="px-6 pb-20 pt-24 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <section className="border-b border-border/25 pb-12">
            <Link
              href="/studio/tutorials"
              className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-foreground/56 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tutorials
            </Link>

            <div className="mt-8 max-w-4xl">
              <h1 className="font-sans text-[clamp(2.9rem,5.6vw,5.3rem)] font-medium leading-[0.95] tracking-[-0.065em] text-foreground">
                {tutorial.title}
              </h1>
              <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-foreground/62 md:text-[1.12rem]">
                {tutorialSummary}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.95rem] text-foreground/56">
              <div className="flex items-center gap-2.5">
                <PlayCircle className="h-4 w-4" />
                <span>{getCategoryLabel(tutorial.category)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <TrendingUp className="h-4 w-4" />
                <span>{getDifficultyLabel(tutorial.difficulty)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(tutorial.duration)}</span>
              </div>
              {tutorial.created_at ? (
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(tutorial.created_at)}</span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="mt-10">
            <div className="overflow-hidden rounded-[1.1rem] border border-border/28 bg-card/10">
              <div className="aspect-[16/9]">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId || ""}`}
                  title={tutorial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-5 border-b border-border/20 pb-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                  In this lesson
                </p>
                {(tutorial.learning_objectives || []).length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {(tutorial.learning_objectives || []).slice(0, 3).map(
                      (objective: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/62" />
                          <p className="text-[0.98rem] leading-7 text-foreground/66">
                            {objective}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-[0.98rem] leading-7 text-foreground/56">
                    Watch the walkthrough, then use the reference and resource sections below to
                    keep building the workflow.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 md:justify-end">
                <a
                  href={tutorial.video_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[0.95rem] font-medium text-black transition-colors hover:bg-white/90"
                >
                  Watch on YouTube
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href="/studio/tutorials"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-white/14"
                >
                  Browse tutorial library
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {tabs.length > 0 ? (
            <section className="mt-12 pt-2">
              <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="mb-10 flex h-auto w-full flex-wrap justify-start gap-x-7 gap-y-3 rounded-none bg-transparent p-0">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="h-auto rounded-none border-b border-transparent px-0 py-0 text-[0.96rem] font-medium tracking-[-0.02em] text-foreground/46 shadow-none transition-colors data-[state=active]:border-foreground/42 data-[state=active]:text-foreground"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
                    <div className="border-t border-border/20 pt-6">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        What you&apos;ll learn
                      </p>
                      <div className="mt-5 space-y-4">
                        {(tutorial.learning_objectives || []).map(
                          (objective: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/62" />
                              <p
                                id={`step-${index + 1}`}
                                className="text-[1rem] leading-7 text-foreground/72"
                              >
                                {objective}
                              </p>
                            </div>
                          )
                        )}
                        {(tutorial.learning_objectives || []).length === 0 ? (
                          <p className="text-[0.98rem] leading-7 text-foreground/48">
                            No learning objectives were added for this tutorial yet.
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-6">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        Overview
                      </p>
                      <div className="mt-5 space-y-5">
                        {overviewParagraphs.length > 0 ? (
                          overviewParagraphs.map((paragraph, index) => (
                            <p key={index} className="text-[1.03rem] leading-8 text-foreground/68">
                              {paragraph}
                            </p>
                          ))
                        ) : (
                          <p className="text-[0.98rem] leading-8 text-foreground/48">
                            No extended overview was added for this tutorial yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="concepts" className="mt-0">
                  <div className="grid gap-10 lg:grid-cols-2">
                    <div className="border-t border-border/20 pt-6">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        Key concepts
                      </p>
                      <div className="mt-5 space-y-6">
                        {(tutorial.key_concepts || []).map((concept: any, index: number) => (
                          <div key={index} className="grid gap-3 border-t border-border/14 pt-5 first:border-t-0 first:pt-0">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-foreground/54" />
                              <div>
                                <h2 className="font-sans text-[1.06rem] font-medium tracking-[-0.02em] text-foreground">
                                  {concept.title}
                                </h2>
                                <p className="mt-2 text-[0.98rem] leading-7 text-foreground/62">
                                  {concept.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {(tutorial.key_concepts || []).length === 0 ? (
                          <p className="text-[0.98rem] leading-7 text-foreground/48">
                            No key concepts were added for this tutorial yet.
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-6">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        Pro tips
                      </p>
                      <div className="mt-5 space-y-4">
                        {(tutorial.pro_tips || []).map((tip: string, index: number) => (
                          <div key={index} className="border-t border-border/14 pt-4 first:border-t-0 first:pt-0">
                            <p className="text-[0.98rem] leading-7 text-foreground/62">{tip}</p>
                          </div>
                        ))}
                        {(tutorial.pro_tips || []).length === 0 ? (
                          <p className="text-[0.98rem] leading-7 text-foreground/48">
                            No pro tips were added for this tutorial yet.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reference" className="mt-0">
                  <div className="grid gap-10 lg:grid-cols-2">
                    <div className="border-t border-border/20 pt-6">
                      <div className="flex items-center gap-3">
                        <Keyboard className="h-4 w-4 text-foreground/54" />
                        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                          Shortcuts
                        </p>
                      </div>
                      <div className="mt-5 space-y-4">
                        {(tutorial.shortcuts || []).map((shortcut: any, index: number) => (
                          <div
                            key={index}
                            className="grid gap-2 border-t border-border/14 pt-4 first:border-t-0 first:pt-0"
                          >
                            <code className="text-[0.9rem] font-semibold text-foreground">
                              {shortcut.keys}
                            </code>
                            <p className="text-[0.96rem] leading-7 text-foreground/62">
                              {shortcut.action}
                            </p>
                          </div>
                        ))}
                        {(tutorial.shortcuts || []).length === 0 ? (
                          <p className="text-[0.98rem] leading-7 text-foreground/48">
                            No shortcut list was added for this tutorial yet.
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-6">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        Common pitfalls
                      </p>
                      <div className="mt-5 space-y-4">
                        {(tutorial.common_pitfalls || []).map((pitfall: string, index: number) => (
                          <div key={index} className="border-t border-border/14 pt-4 first:border-t-0 first:pt-0">
                            <p className="text-[0.98rem] leading-7 text-foreground/62">{pitfall}</p>
                          </div>
                        ))}
                        {(tutorial.common_pitfalls || []).length === 0 ? (
                          <p className="text-[0.98rem] leading-7 text-foreground/48">
                            No common pitfalls were added for this tutorial yet.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transcript" className="mt-0">
                  <div className="border-t border-border/20 pt-6">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                      Transcript
                    </p>
                    <div className="mt-5">
                      {(tutorial.transcript || []).map((entry: any, index: number) => (
                        <div
                          key={index}
                          className="grid gap-4 border-t border-border/14 py-4 first:border-t-0 first:pt-0 md:grid-cols-[88px_minmax(0,1fr)]"
                        >
                          <p className="text-[0.82rem] font-medium tracking-[0.04em] text-foreground/42">
                            {entry.time}
                          </p>
                          <p className="text-[0.98rem] leading-7 text-foreground/64">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="mt-0">
                  <div className="grid gap-10 lg:grid-cols-2">
                    <div className="border-t border-border/20 pt-6">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        Related resources
                      </p>
                      <div className="mt-5">
                        {(tutorial.related_resources || []).map((resource: any, index: number) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start justify-between gap-4 border-t border-border/14 py-4 first:border-t-0 first:pt-0 transition-colors hover:text-foreground"
                          >
                            <div>
                              <p className="text-[0.78rem] uppercase tracking-[0.18em] text-foreground/38">
                                {resource.type}
                              </p>
                              <h2 className="mt-2 font-sans text-[1rem] font-medium tracking-[-0.02em] text-foreground">
                                {resource.title}
                              </h2>
                            </div>
                            <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-foreground/44" />
                          </a>
                        ))}
                        {(tutorial.related_resources || []).length === 0 ? (
                          <p className="text-[0.98rem] leading-7 text-foreground/48">
                            No related resources were added for this tutorial yet.
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-border/20 pt-6">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        Continue learning
                      </p>
                      <div className="mt-5">
                        {(tutorial.related_tutorials || []).map((related: any, index: number) => (
                          <Link
                            key={index}
                            href={`/studio/tutorials/${related.slug}`}
                            className="flex items-center justify-between gap-4 border-t border-border/14 py-4 first:border-t-0 first:pt-0 transition-colors hover:text-foreground"
                          >
                            <div>
                              <h2 className="font-sans text-[1rem] font-medium tracking-[-0.02em] text-foreground">
                                {related.title}
                              </h2>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-foreground/44" />
                          </Link>
                        ))}
                        {(tutorial.related_tutorials || []).length === 0 ? (
                          <p className="text-[0.98rem] leading-7 text-foreground/48">
                            No related tutorials were added for this tutorial yet.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          ) : null}

          <section className="mt-16 border-t border-border/20 pt-16">
            <div className="rounded-[2rem] bg-white/8 px-6 py-14 text-center md:px-12 md:py-16">
              <h2 className="mx-auto max-w-3xl font-sans text-[clamp(2.2rem,4.5vw,3.9rem)] font-medium leading-[1.02] tracking-[-0.055em] text-foreground">
                Keep building your Vectorworks workflow with the full tutorial library.
              </h2>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/studio/tutorials"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[0.95rem] font-medium text-black transition-colors hover:bg-white/90"
                >
                  Browse tutorials
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/studio/directory"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-white/14"
                >
                  Open scenic toolkit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
