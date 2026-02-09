import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Eye, Layers } from "lucide-react";

export default function RenderingPortfolio() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({ 
    status: 'published',
    discipline: 'rendering'
  });

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Technical & Clean */}
      <section className="py-28 border-b border-border">
        <div className="container">
          <div className="flex items-start gap-4 mb-8">
            <Layers className="w-8 h-8 text-cyan-500 mt-2" />
            <div>
              <p className="text-xs tracking-widest text-muted-foreground mb-4">RENDERING & VISUALIZATION</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Precision<br />
                Visualization
              </h1>
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl ml-auto">
            Technical renderings and concept visualizations that bring designs to life 
            before construction begins. Detailed, accurate, and visually compelling.
          </p>
        </div>
      </section>

      {/* Projects Grid - Large Showcase */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="space-y-16">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-6">
                  <div className="aspect-[16/9] bg-muted rounded-2xl animate-pulse" />
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="h-8 w-2/3 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-20">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <article className="space-y-8">
                    {/* Large Project Image */}
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted border border-border">
                      {project.coverImageUrl && (
                        <ProgressiveImage
                          src={project.coverImageUrl}
                          alt={`${project.title} - Rendering by Brandon PT Davis`}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.02]"
                        />
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <div className="flex items-center gap-3 text-white">
                          <Eye className="w-5 h-5" />
                          <span className="text-sm tracking-wide uppercase">View Full Project</span>
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="flex justify-between items-start gap-8">
                      <div className="space-y-3 flex-1">
                        <h2 className="text-4xl font-bold group-hover:text-cyan-500 transition-colors">
                          {project.title}
                        </h2>
                        
                        {project.description && (
                          <p className="text-lg text-muted-foreground max-w-3xl">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {(project.client || project.year) && (
                        <div className="text-right text-muted-foreground shrink-0">
                          {project.client && <p className="font-medium">{project.client}</p>}
                          {project.year && <p className="text-sm">{project.year}</p>}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No rendering projects available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
