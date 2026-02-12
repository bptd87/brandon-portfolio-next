import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Box, Ruler } from "lucide-react";

export default function ScenicModelsPortfolio() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({ 
    status: 'published',
    discipline: 'scenic_models'
  });

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Craftsmanship Focus */}
      <section className="py-28 border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          <div className="flex items-center gap-4 mb-8">
            <Box className="w-10 h-10 text-pink-500" />
            <Ruler className="w-8 h-8 text-cyan-500" />
          </div>
          <p className="text-xs tracking-widest text-muted-foreground mb-4">SCENIC MODELS</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl">
            Scale Model<br />
            Archive
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Handcrafted scale models that capture the essence of theatrical design. 
            Each piece represents meticulous attention to detail, materiality, and spatial relationships.
          </p>
        </div>
      </section>

      {/* Projects Grid - Detail-Focused */}
      <section className="py-20">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <article className="space-y-5">
                    {/* Square Model Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
                      {project.coverImageUrl && (
                        <ProgressiveImage
                          src={project.coverImageUrl}
                          alt={`${project.title} - Scale Model by Brandon PT Davis`}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                      )}
                      
                      {/* Corner Detail Indicator */}
                      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Project Info */}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold group-hover:text-pink-500 transition-colors">
                        {project.title}
                      </h2>
                      
                      {(project.client || project.year) && (
                        <p className="text-sm text-muted-foreground">
                          {project.client && <span>{project.client}</span>}
                          {project.client && project.year && <span className="mx-2">·</span>}
                          {project.year && <span>{project.year}</span>}
                        </p>
                      )}

                      {project.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No scenic model projects available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
