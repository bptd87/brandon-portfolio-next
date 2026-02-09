import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function RenderingPortfolio() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({ 
    status: 'published',
    discipline: 'rendering'
  });

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Ultra Minimal */}
      <section className="py-24 border-b border-border">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-center mb-6">
              Renderings
            </h1>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Architectural visualizations and concept renderings
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid - Gallery Style */}
      <section className="py-20">
        <div className="container max-w-6xl">
          {isLoading ? (
            <div className="space-y-24">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-6">
                  <div className="aspect-[16/9] bg-muted rounded-2xl animate-pulse" />
                  <div className="text-center space-y-2">
                    <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-24">
              {projects.map((project) => (
                <AnimatedSection key={project.id}>
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <article className="space-y-6">
                      {/* Large Project Image - Clean, No Overlay */}
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
                        {project.coverImageUrl ? (
                          <ProgressiveImage
                            src={project.coverImageUrl}
                            alt={`${project.title} - Rendering by Brandon PT Davis`}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:opacity-95"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Image failed to load
                          </div>
                        )}
                      </div>

                      {/* Minimal Info - Centered */}
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold group-hover:text-foreground/70 transition-colors">
                          {project.title}
                        </h2>
                        
                        {project.year && (
                          <p className="text-sm text-muted-foreground tracking-wider">
                            {project.year}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No renderings available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
