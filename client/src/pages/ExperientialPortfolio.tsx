import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { ArrowRight } from "lucide-react";

export default function ExperientialPortfolio() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({ 
    status: 'published',
    discipline: 'experiential_design'
  });

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Bold & Immersive */}
      <section className="py-32 border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-cyan-500/5" />
        <div className="container relative">
          <p className="text-xs tracking-widest text-muted-foreground mb-6">EXPERIENTIAL DESIGN</p>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-none">
            Immersive<br />
            Brand<br />
            Experiences
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            Creating memorable brand activations, interactive installations, and spatial experiences 
            that engage audiences and transform spaces into stories.
          </p>
        </div>
      </section>

      {/* Projects Grid - Flexible Layout */}
      <section className="py-20">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map((project, index) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <article className="space-y-6">
                    {/* Project Image */}
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                      {project.coverImageUrl && (
                        <ProgressiveImage
                          src={project.coverImageUrl}
                          alt={`${project.title} - Experiential Design by Brandon PT Davis`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Project Info */}
                    <div className="space-y-3">
                      <h2 className="text-3xl font-bold group-hover:text-pink-500 transition-colors">
                        {project.title}
                      </h2>
                      
                      {(project.client || project.year) && (
                        <p className="text-muted-foreground flex items-center gap-2">
                          {project.client && <span>{project.client}</span>}
                          {project.client && project.year && <span>·</span>}
                          {project.year && <span>{project.year}</span>}
                        </p>
                      )}

                      {project.description && (
                        <p className="text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm tracking-wide">VIEW PROJECT</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No experiential design projects available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
