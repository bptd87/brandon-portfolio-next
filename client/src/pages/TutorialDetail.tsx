import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, Lightbulb, AlertCircle, Keyboard, ArrowRight, ExternalLink } from "lucide-react";
import { useParams, Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEO } from "@/components/SEO";

export default function TutorialDetail() {
  const params = useParams();
  const slug = params.slug;

  const { data: tutorial, isLoading, error } = trpc.tutorials.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-[#2196F3]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <p className="text-muted-foreground animate-pulse">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tutorial Not Found</h1>
          <Link href="/studio/tutorials" className="text-[#2196F3] hover:underline">
            ← Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string | undefined | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : url; // Fallback to returning the input if it looks like an ID (no simple way to distinguish 11 chars ID vs random text, but this covers legacy IDs)
  };

  const formatDuration = (duration: string | number | null | undefined) => {
    if (!duration) return '10:00'; // Default
    // If already a string like "21:14", return as-is
    if (typeof duration === 'string') return duration;
    // Otherwise convert seconds to MM:SS format
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const videoId = getYouTubeId(tutorial.video_url);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${tutorial.title} | Brandon PT Davis`}
        description={tutorial.description || ""}
        image={`https://img.youtube.com/vi/${videoId || ""}/maxresdefault.jpg`}
        type="website"
      />
      <StructuredData
        type="VideoObject"
        videoObject={{
          name: tutorial.title,
          description: tutorial.description || undefined,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId || ""}/maxresdefault.jpg`,
          uploadDate: new Date(tutorial.created_at).toISOString(),
          embedUrl: `https://www.youtube.com/embed/${videoId || ""}`,
          contentUrl: `https://www.youtube.com/watch?v=${videoId || ""}`,
          publisher: {
            name: "Brandon PT Davis Design",
            logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YiqCsZPgtoSSsQyE.png",
          },
        }}
      />
      <StructuredData
        type="HowTo"
        howTo={{
          name: tutorial.title,
          description: tutorial.description || undefined,
          image: `https://img.youtube.com/vi/${videoId || ""}/maxresdefault.jpg`,
          totalTime: tutorial.duration ? `PT${Math.floor(Number(tutorial.duration) / 60)}M` : undefined,
          step: (tutorial.learning_objectives || []).map((objective: string, i: number) => ({
            name: objective,
            url: `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug}#step-${i + 1}`
          })),
          tool: (tutorial.related_resources || []).filter((r: any) => r.type === 'Software' || r.type === 'Tool').map((r: any) => ({
            name: r.title,
            url: r.url
          }))
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Tutorials", url: "https://www.brandonptdavis.com/studio/tutorials" },
          { name: tutorial.title, url: `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug}` },
        ]}
      />
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="container py-6">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb
            items={[
              { label: "Studio", href: "/studio" },
              { label: tutorial.title }
            ]}
          />
        </div>
      </div>

      {/* Tutorial Header */}
      <section className="py-8 border-b border-border/50 bg-card/10">
        <div className="container">
          <div className="max-w-6xl mx-auto">
          <Link href="/studio/tutorials" className="text-sm text-muted-foreground hover:text-[#2196F3] mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Tutorials
          </Link>

          <div className="flex flex-wrap gap-2.5 mb-5">
            <Badge className="bg-[#2196F3] text-white border border-[#2196F3] uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              {tutorial.category || "General"}
            </Badge>
            <Badge className="bg-transparent text-foreground border border-border flex items-center gap-1.5 uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              {tutorial.difficulty || "Beginner"}
            </Badge>
            <Badge className="bg-transparent text-foreground border border-border flex items-center gap-1.5 uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(tutorial.duration)}
            </Badge>
            <Badge className="bg-transparent text-foreground border border-border flex items-center gap-1.5 uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(tutorial.created_at)}
            </Badge>
          </div>

          <h1 className="mb-3 text-4xl md:text-6xl font-serif tracking-tight leading-[1.02] text-foreground">{tutorial.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">{tutorial.description}</p>
          </div>
        </div>
      </section>

      {/* Video Embed */}
      <section className="py-10 bg-muted/30 border-b border-border">
        <div className="container">
          <div className="max-w-6xl mx-auto">
          <div className="aspect-video overflow-hidden rounded-lg shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId || ""}`}
              title={tutorial.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-5xl mx-auto grid-cols-5 bg-muted/50 p-1 rounded-lg mb-6 h-auto gap-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#2196F3]/20 data-[state=active]:text-[#7ec8ff] data-[state=active]:border-[#2196F3]/40 data-[state=active]:shadow-lg border border-transparent text-foreground uppercase tracking-[0.08em] font-bold py-2.5 px-3 rounded-md transition-all text-[11px] md:text-xs"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="concepts"
                className="data-[state=active]:bg-[#FF5722]/20 data-[state=active]:text-[#ff9c7a] data-[state=active]:border-[#FF5722]/40 data-[state=active]:shadow-lg border border-transparent text-foreground uppercase tracking-[0.08em] font-bold py-2.5 px-3 rounded-md transition-all text-[11px] md:text-xs"
              >
                Concepts
              </TabsTrigger>
              <TabsTrigger
                value="reference"
                className="data-[state=active]:bg-[#9C27B0]/20 data-[state=active]:text-[#ce93d8] data-[state=active]:border-[#9C27B0]/40 data-[state=active]:shadow-lg border border-transparent text-foreground uppercase tracking-[0.08em] font-bold py-2.5 px-3 rounded-md transition-all text-[11px] md:text-xs"
              >
                Quick Ref
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="data-[state=active]:bg-[#F44336]/20 data-[state=active]:text-[#ef9a9a] data-[state=active]:border-[#F44336]/40 data-[state=active]:shadow-lg border border-transparent text-foreground uppercase tracking-[0.08em] font-bold py-2.5 px-3 rounded-md transition-all text-[11px] md:text-xs"
              >
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="data-[state=active]:bg-[#00BCD4]/20 data-[state=active]:text-[#80deea] data-[state=active]:border-[#00BCD4]/40 data-[state=active]:shadow-lg border border-transparent text-foreground uppercase tracking-[0.08em] font-bold py-2.5 px-3 rounded-md transition-all text-[11px] md:text-xs"
              >
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="border border-border/60 rounded-xl p-6 md:p-7 bg-card/70">
                <h2 className="text-2xl font-semibold mb-6 text-[#2196F3] tracking-tight">What You'll Learn</h2>
                <div className="space-y-3 mb-12">
                  {(tutorial.learning_objectives || []).map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="w-1.5 h-1.5 bg-[#2196F3] mt-2 flex-shrink-0 group-hover:w-3 transition-all"></div>
                      <span className="text-foreground leading-relaxed">{objective}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/60 pt-8">
                  <h3 className="text-xl font-semibold mb-4 tracking-tight text-foreground">Tutorial Overview</h3>
                  <div className="space-y-4">
                    {(tutorial.overview || "").split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Key Concepts Tab */}
            <TabsContent value="concepts" className="mt-0">
              <div className="border border-border/60 rounded-xl p-6 md:p-7 bg-card/70">
                <h2 className="text-2xl font-semibold mb-8 text-[#FF5722] tracking-tight">Key Concepts</h2>
                <div className="space-y-8">
                  {(tutorial.key_concepts || []).map((concept: any, index: number) => (
                    <div key={index} className="border-l-2 border-[#FF5722] pl-6 py-4 bg-[#FF5722]/8 rounded-r-lg">
                      <div className="flex items-start gap-3 mb-3">
                        <Lightbulb className="w-6 h-6 text-[#FF5722] flex-shrink-0 mt-1" />
                        <h3 className="font-semibold text-lg tracking-tight text-foreground">{concept.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {concept.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/60 mt-12 pt-8">
                  <h3 className="text-xl font-semibold mb-6 text-foreground tracking-tight">Pro Tips</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(tutorial.pro_tips || []).map((tip: string, index: number) => (
                      <div key={index} className="border border-border/60 rounded-lg p-4 bg-[#FF5722]/8">
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-semibold text-[#FF5722] block mb-2 uppercase tracking-[0.12em]">Pro Tip</span>
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Quick Reference Tab */}
            <TabsContent value="reference" className="mt-0">
              <div className="border border-border/60 rounded-xl p-6 md:p-7 bg-card/70">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Shortcuts */}
                  <div>
                    <h3 className="font-semibold text-xl mb-6 flex items-center gap-3 text-[#9C27B0] tracking-tight">
                      <Keyboard className="w-6 h-6 text-[#9C27B0]" />
                      Essential Shortcuts
                    </h3>
                    <div className="space-y-4">
                      {(tutorial.shortcuts || []).map((shortcut: any, index: number) => (
                        <div key={index} className="border border-border/60 rounded-lg p-4 bg-card/50">
                          <code className="text-sm font-mono text-[#9C27B0] font-semibold block mb-2">
                            {shortcut.keys}
                          </code>
                          <span className="text-sm text-muted-foreground">
                            {shortcut.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Pitfalls */}
                  <div>
                    <h3 className="font-semibold text-xl mb-6 flex items-center gap-3 text-[#9C27B0] tracking-tight">
                      <AlertCircle className="w-6 h-6 text-[#9C27B0]" />
                      Common Pitfalls
                    </h3>
                    <div className="space-y-3">
                      {(tutorial.common_pitfalls || []).map((pitfall: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 border-l-2 border-[#9C27B0] pl-4 py-2 bg-[#9C27B0]/8 rounded-r">
                          <span className="text-[#9C27B0] flex-shrink-0 font-semibold">×</span>
                          <span className="text-sm text-foreground">{pitfall}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Transcript Tab */}
            <TabsContent value="transcript" className="mt-0">
              <div className="border border-border/60 rounded-xl p-6 md:p-7 bg-card/70">
                <h2 className="text-2xl font-semibold mb-8 text-[#F44336] tracking-tight">Full Transcript</h2>
                <div className="space-y-4 font-mono text-sm">
                  {(tutorial.transcript || []).map((entry: any, index: number) => (
                    <div key={index} className="flex gap-6 hover:bg-[#F44336]/8 p-3 rounded transition-colors border-l-2 border-transparent hover:border-[#F44336]">
                      <span className="text-[#F44336] flex-shrink-0 w-16 font-semibold">
                        {entry.time}
                      </span>
                      <p className="text-foreground leading-relaxed">
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="mt-0">
              <div className="border border-border/60 rounded-xl p-6 md:p-7 bg-card/70">
                <h2 className="text-2xl font-semibold mb-8 text-[#00BCD4] tracking-tight">Related Resources</h2>

                <div className="space-y-4 mb-12">
                  {(tutorial.related_resources || []).map((resource: any, index: number) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-border/60 hover:border-[#00BCD4] rounded-lg p-6 transition-all group bg-card/50 hover:bg-[#00BCD4]/8"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-[#00BCD4] text-black border-0 uppercase tracking-[0.12em] font-semibold text-xs px-3 py-1">
                              {resource.type}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-[#00BCD4] transition-colors text-foreground">
                            {resource.title}
                          </h3>
                        </div>
                        <ExternalLink className="w-5 h-5 text-[#00BCD4] flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="border-t border-border/60 pt-8">
                  <h3 className="text-xl font-semibold mb-6 tracking-tight text-foreground">Continue Learning</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {(tutorial.related_tutorials || []).map((related: any, index: number) => (
                      <Link key={index} href={`/studio/tutorials/${related.slug}`}>
                        <div className="border border-border/60 hover:border-[#00BCD4] rounded-lg p-6 transition-all group bg-card/50 hover:bg-[#00BCD4]/8 h-full">
                          <h4 className="font-semibold mb-3 group-hover:text-[#00BCD4] transition-colors text-foreground">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-[#00BCD4] group-hover:gap-3 transition-all uppercase tracking-[0.12em] font-semibold">
                            Watch Tutorial <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
