import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ExperientialFAQ } from "@/components/ExperientialFAQ";

export default function ExperientialPortfolio() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({ 
    status: 'published',
    discipline: 'experiential_design'
  });

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Editorial Style */}
      <section className="py-20 md:py-32 border-b border-white/10">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="text-center space-y-8">
              <div>
                <p className="text-sm tracking-[0.3em] text-muted-foreground mb-6 uppercase">Experiential Design</p>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-8">
                  Immersive<br />Environments
                </h1>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl leading-relaxed font-extralight text-muted-foreground">
                  Experiential design is spatial storytelling—<br />
                  <span className="italic">authored environments</span> grounded in real scale,<br />
                  buildable geometry, and artist-led visualization.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-muted rounded-2xl animate-pulse" />
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.slug}`}
                  className="group block"
                >
                  <article className="space-y-4">
                    {/* Project Image - Fill bounds */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                      {project.coverImageUrl && (
                        <ProgressiveImage
                          src={project.coverImageUrl}
                          alt={`${project.title} - Experiential Design by Brandon PT Davis`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>

                    {/* Project Info */}
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold group-hover:text-pink-500 transition-colors">
                        {project.title}
                      </h2>
                      
                      {(project.client || project.year) && (
                        <p className="text-sm text-muted-foreground">
                          {project.client && <span>{project.client}</span>}
                          {project.client && project.year && <span> · </span>}
                          {project.year && <span>{project.year}</span>}
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
                No experiential design projects available yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Four Core Services */}
      <section className="py-32 border-t border-white/10">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Four Core Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                Visualization services for experiential design, from technical documentation to immersive environments.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="p-8 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold mb-3">Technical Drawing</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Scaled plans, elevations, and spatial layouts that establish buildable geometry and inform all downstream visualization.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="p-8 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold mb-3">Point Cloud</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Density-driven spatial studies emphasizing human presence, scale, and perception within immersive environments.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="p-8 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold mb-3">Rendering</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Atmospheric stills grounded in authored geometry, real-world proportion, and cinematic lighting principles.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="p-8 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold mb-3">Authored Composite Visualization</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Hybrid workflow combining authored spatial design, real-time rendering, and selective post-production for photorealistic results.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Integrated Workflow */}
      <section className="py-32 border-t border-white/10 bg-muted/20">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Integrated Workflow
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
                Three tools, one unified process—from technical foundation to immersive visualization.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mb-16">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/cJm1wyoQmDkIbz1B0NNYZs-img-1_1770683225000_na1fn_ZXhwZXJpZW50aWFsLWludGVncmF0ZWQtd29ya2Zsb3ctdjI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L2NKbTF3eW9RbURrSWJ6MUIwTk5ZWnMtaW1nLTFfMTc3MDY4MzIyNTAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFdsdWRHVm5jbUYwWldRdGQyOXlhMlpzYjNjdGRqSS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=jpemnXTZ-aklBX4ShVznToFGBVZJUMgxWYnlyCirrS4HOVPZXkqHaJs842Je3fpbK0b9GGM30GzAcgMIPrWyCwblY-4IqbfAb4rxpwj9zBVStyRCy~rgBkPvkVMiAA1cMZ3O3qTC2j-1ANZa8L2gGFbop5-n25rmUF4QUvco9b5KSTaT9oxOecI9iF~aeMuVHU~6Gt3T6TAO66-PsHKfCMlDy~s4FEtEd7x4vXj2XGuV93tIv1iOkdrI1Wc-dihGV3T~d~4THqmU7lyFSOopGBxljalig-GZFAa7q3xRqvxYu30QWDk-hOMtLHY9MzljFlliKgNg0I21Z~N7hCxgMQ__"
                alt="Integrated Design Workflow for Experiential Visualization"
                className="w-full rounded-lg"
              />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold">Vectorworks</h3>
                <p className="text-sm text-muted-foreground font-light">
                  Precise technical CAD for floor plans, elevations, and spatial systems
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold">Twinmotion</h3>
                <p className="text-sm text-muted-foreground font-light">
                  Real-time 3D rendering with environmental immersion and lighting
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold">Photoshop</h3>
                <p className="text-sm text-muted-foreground font-light">
                  Atmospheric compositing, color grading, and post-production polish
                </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <p className="text-base text-muted-foreground italic font-light leading-relaxed">
                The design and the visualization describe the same space—<br />
                authored geometry ensures accuracy from concept to completion.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container max-w-4xl">
          <ExperientialFAQ />
        </div>
      </section>

      <Footer />
    </div>
  );
}
