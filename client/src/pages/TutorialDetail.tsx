import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, Lightbulb, AlertCircle, Keyboard, ArrowRight, ExternalLink, CheckCircle } from "lucide-react";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEO } from "@/components/SEO";

export default function TutorialDetail() {
  const params = useParams();
  const slug = params.slug;

  // Get current user
  const { data: user } = trpc.auth.me.useQuery();

  // Fetch tutorial progress
  const { data: progressData = [] } = trpc.tutorialProgress.getProgress.useQuery(undefined, {
    enabled: !!user,
  });

  // Toggle watched mutation
  const utils = trpc.useUtils();
  const toggleWatched = trpc.tutorialProgress.toggleWatched.useMutation({
    onSuccess: () => {
      utils.tutorialProgress.getProgress.invalidate();
      toast.success("Progress updated");
    },
    onError: () => {
      toast.error("Failed to update progress");
    },
  });

  const { data: tutorial, isLoading, error } = trpc.tutorials.getBySlug.useQuery(
    { slug: slug as string },
    { enabled: !!slug }
  );

  const isWatched = progressData.some(p => p.tutorialSlug === slug && p.completed);

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
        <Breadcrumb
          items={[
            { label: "Studio", href: "/studio" },
            { label: tutorial.title }
          ]}
        />
      </div>

      {/* Tutorial Header */}
      <section className="py-12 border-b border-[#2196F3]">
        <div className="container max-w-6xl">
          <Link href="/studio/tutorials" className="text-sm text-muted-foreground hover:text-[#2196F3] mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Tutorials
          </Link>

          <div className="flex flex-wrap gap-3 mb-6">
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

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-tight text-foreground">{tutorial.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{tutorial.description}</p>
            </div>
            {user && slug && (
              <Button
                onClick={() => toggleWatched.mutate({ tutorialSlug: slug })}
                variant={isWatched ? "default" : "outline"}
                className={isWatched ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                disabled={toggleWatched.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isWatched ? "Watched" : "Mark as Watched"}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Video Embed */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container max-w-6xl">
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
      </section>

      {/* Tabbed Content */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-lg mb-8 h-auto gap-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="concepts"
                className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Concepts
              </TabsTrigger>
              <TabsTrigger
                value="reference"
                className="data-[state=active]:bg-[#9C27B0] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Quick Ref
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="data-[state=active]:bg-[#F44336] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-6 text-[#2196F3] uppercase tracking-wider">What You'll Learn</h2>
                <div className="space-y-3 mb-12">
                  {(tutorial.learning_objectives || []).map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="w-1.5 h-1.5 bg-[#2196F3] mt-2 flex-shrink-0 group-hover:w-3 transition-all"></div>
                      <span className="text-foreground leading-relaxed">{objective}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#2196F3] pt-8">
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-foreground">Tutorial Overview</h3>
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
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-8 text-[#FF5722] uppercase tracking-wider">Key Concepts</h2>
                <div className="space-y-8">
                  {(tutorial.key_concepts || []).map((concept: any, index: number) => (
                    <div key={index} className="border-l-4 border-[#FF5722] pl-6 py-4 bg-[#FF5722]/10 rounded-r">
                      <div className="flex items-start gap-3 mb-3">
                        <Lightbulb className="w-6 h-6 text-[#FF5722] flex-shrink-0 mt-1" />
                        <h3 className="font-bold text-lg uppercase tracking-wider text-foreground">{concept.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {concept.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#FF5722] mt-12 pt-8">
                  <h3 className="text-xl font-bold mb-6 text-[#FF5722] uppercase tracking-wider">Pro Tips</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(tutorial.pro_tips || []).map((tip: string, index: number) => (
                      <div key={index} className="border border-[#FF5722] rounded-lg p-4 bg-[#FF5722]/10">
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-bold text-[#FF5722] block mb-2 uppercase tracking-wider">PRO TIP</span>
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
              <div className="border border-border rounded-lg p-8 bg-card">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Shortcuts */}
                  <div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-[#9C27B0] uppercase tracking-wider">
                      <Keyboard className="w-6 h-6" />
                      Essential Shortcuts
                    </h3>
                    <div className="space-y-4">
                      {(tutorial.shortcuts || []).map((shortcut: any, index: number) => (
                        <div key={index} className="border border-[#9C27B0] rounded-lg p-4 bg-[#9C27B0]/10">
                          <code className="text-sm font-mono text-[#9C27B0] font-bold block mb-2">
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
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-[#9C27B0] uppercase tracking-wider">
                      <AlertCircle className="w-6 h-6" />
                      Common Pitfalls
                    </h3>
                    <div className="space-y-3">
                      {(tutorial.common_pitfalls || []).map((pitfall: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 border-l-4 border-[#9C27B0] pl-4 py-2 bg-[#9C27B0]/5 rounded-r">
                          <span className="text-[#9C27B0] flex-shrink-0 font-bold">×</span>
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
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-8 text-[#F44336] uppercase tracking-wider">Full Transcript</h2>
                <div className="space-y-4 font-mono text-sm">
                  {(tutorial.transcript || []).map((entry: any, index: number) => (
                    <div key={index} className="flex gap-6 hover:bg-[#F44336]/10 p-3 rounded transition-colors border-l-2 border-transparent hover:border-[#F44336]">
                      <span className="text-[#F44336] flex-shrink-0 w-16 font-bold">
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
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-8 text-[#00BCD4] uppercase tracking-wider">Related Resources</h2>

                <div className="space-y-4 mb-12">
                  {(tutorial.related_resources || []).map((resource: any, index: number) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-border hover:border-[#00BCD4] rounded-lg p-6 transition-all group bg-card hover:bg-[#00BCD4]/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-[#00BCD4] text-white border-0 uppercase tracking-wider font-bold text-xs px-3 py-1">
                              {resource.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-[#00BCD4] transition-colors text-foreground">
                            {resource.title}
                          </h3>
                        </div>
                        <ExternalLink className="w-5 h-5 text-[#00BCD4] flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="border-t border-[#00BCD4] pt-8">
                  <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-foreground">Continue Learning</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {(tutorial.related_tutorials || []).map((related: any, index: number) => (
                      <Link key={index} href={`/studio/tutorials/${related.slug}`}>
                        <div className="border border-border hover:border-[#00BCD4] rounded-lg p-6 transition-all group bg-card hover:bg-[#00BCD4]/10 h-full">
                          <h4 className="font-semibold mb-3 group-hover:text-[#00BCD4] transition-colors text-foreground">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-[#00BCD4] group-hover:gap-3 transition-all uppercase tracking-wider font-bold">
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
      </section>

      <Footer />
    </div>
  );
}
