import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ExperientialFAQ } from "@/components/ExperientialFAQ";
import { ArrowRight, Layers, Ruler, Video, Sparkles, Cloud, Box, Hammer, Zap } from "lucide-react";

export default function ExperientialPortfolio() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({ 
    status: 'published',
    discipline: 'experiential_design'
  });

  const capabilities = [
    {
      icon: Box,
      title: "Experiential Environment Design",
      description: "Concept-driven spatial design for installations, activations, and performance-based environments."
    },
    {
      icon: Ruler,
      title: "Technical Drawing & Spatial Systems",
      description: "Scaled plans and layouts that inform both visualization and production."
    },
    {
      icon: Sparkles,
      title: "Rendering & Visualization",
      description: "Atmospheric stills grounded in authored geometry and real-world proportion."
    },
    {
      icon: Video,
      title: "Video Walkthroughs",
      description: "Camera-driven sequences that communicate movement, scale, and narrative flow."
    },
    {
      icon: Layers,
      title: "Authored Composite Visualization",
      description: "Hybrid visualization combining authored spatial design, real-time rendering, and selective AI-assisted post-production."
    },
    {
      icon: Cloud,
      title: "Point-Cloud Spatial Studies",
      description: "Density- and perception-driven visualization emphasizing human presence and scale."
    }
  ];

  const softwareTools = [
    { name: "Vectorworks", color: "text-blue-400", description: "Technical CAD Drawings" },
    { name: "Twinmotion", color: "text-green-400", description: "Real-Time 3D Visualization" },
    { name: "Photoshop", color: "text-purple-400", description: "Layered Image Editing" },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Bold Agency Style */}
      <section className="py-20 md:py-32 border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-widest text-pink-500 mb-4 font-bold">EXPERIENTIAL DESIGN</p>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none">
                  Immersive<br />
                  <span className="text-pink-500">Environments</span>
                </h1>
              </div>
              
              <div className="max-w-2xl">
                <p className="text-xl md:text-2xl leading-relaxed font-light text-muted-foreground">
                  Artist-led spatial design grounded in real scale, buildable geometry, and authored visualization.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-background/50">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">Fast Turnaround</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-background/50">
                  <Hammer className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Buildable Designs</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-background/50">
                  <Layers className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">Integrated Workflow</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid - Portfolio First */}
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
                    {/* Project Image */}
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

      {/* Technical Toolkit Showcase - Agency Style */}
      <section className="py-32 border-t border-border bg-muted/20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black mb-6">
                Technical Toolkit
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Industry-standard software for integrated design, modeling, and visualization workflows.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="mb-16">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/cJm1wyoQmDkIbz1B0NNYZs-img-1_1770683225000_na1fn_ZXhwZXJpZW50aWFsLWludGVncmF0ZWQtd29ya2Zsb3ctdjI.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L2NKbTF3eW9RbURrSWJ6MUIwTk5ZWnMtaW1nLTFfMTc3MDY4MzIyNTAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFdsdWRHVm5jbUYwWldRdGQyOXlhMlpzYjNjdGRqSS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=jpemnXTZ-aklBX4ShVznToFGBVZJUMgxWYnlyCirrS4HOVPZXkqHaJs842Je3fpbK0b9GGM30GzAcgMIPrWyCwblY-4IqbfAb4rxpwj9zBVStyRCy~rgBkPvkVMiAA1cMZ3O3qTC2j-1ANZa8L2gGFbop5-n25rmUF4QUvco9b5KSTaT9oxOecI9iF~aeMuVHU~6Gt3T6TAO66-PsHKfCMlDy~s4FEtEd7x4vXj2XGuV93tIv1iOkdrI1Wc-dihGV3T~d~4THqmU7lyFSOopGBxljalig-GZFAa7q3xRqvxYu30QWDk-hOMtLHY9MzljFlliKgNg0I21Z~N7hCxgMQ__"
                alt="Design Software Toolkit - Integrated Workflows"
                className="w-full rounded-2xl border border-border"
              />
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {softwareTools.map((tool, index) => (
              <AnimatedSection key={index}>
                <div className="text-center p-6 border border-border rounded-xl bg-background hover:border-white/40 transition-all hover:scale-105">
                  <h3 className={`text-2xl font-black mb-2 ${tool.color}`}>
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="mt-12 text-center">
              <p className="text-lg text-muted-foreground italic">
                + Authored Composite Visualization workflow
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Workflow Showcase with Images */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black mb-6">
                Integrated Workflow
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From technical drawings to real-time visualization to buildable documentation—one unified process.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <AnimatedSection>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/pRn7KB2SHCH92g5NCN7fw4-img-1_1770681296000_na1fn_ZXhwZXJpZW50aWFsLXRlY2huaWNhbC1kcmF3aW5n.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L3BSbjdLQjJTSENIOTJnNU5DTjdmdzQtaW1nLTFfMTc3MDY4MTI5NjAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFhSbFkyaHVhV05oYkMxa2NtRjNhVzVuLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XJfLFeDyTtPOJKferZWZjqbx53cb8ex9t1162d4RvMj86qdtXYGCNeEeYzAFcdm8nfa61OAUqqgPAh3OY2m9cobsCK0SsSBUidb8R4FbHuafpMtlPZwTfiOo8HXkhPeaEAoRWITN2XUkBdEHkc8IZMwbwVOQBwykscovr3XeF5AGXedOTHuTq1ngMA8VWWohgxvHdx22LBWHiu5tzWQ~sgi-5dmiTyZX~2PZiRLZwlEiYZSRLPodpsFbYEColB1AiWPAKyEe3L1-wjpol01lTU9JbVzvujUyJuXFVY2eGLVCvxOssEaoQJ7Gu8cMqrYIpqqAIUFz~CWUqy8IcS3xqw__"
                    alt="Technical Drawing Workspace - Vectorworks CAD"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">01. Technical Drawing</h3>
                  <p className="text-sm text-muted-foreground">
                    Scaled plans, elevations, and sections in Vectorworks establish buildable geometry and spatial relationships.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/pRn7KB2SHCH92g5NCN7fw4-img-2_1770681283000_na1fn_ZXhwZXJpZW50aWFsLTNkLW1vZGVsaW5n.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L3BSbjdLQjJTSENIOTJnNU5DTjdmdzQtaW1nLTJfMTc3MDY4MTI4MzAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFROa0xXMXZaR1ZzYVc1bi5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OipeVDqt9n4zuGxxfI6FK9gIKin1zXoW4jXpMJILtWKgLo4NfYQei6ICLsCJtHnD5wRCzqSWUsN6EDNdkQoOMs6O04JiotAdR9yVZ8wJzqiiGJ2FtytvK5awYAPXhgC8BQOrtUgWLamucUNYVL8NGIc6AiWNe8dqATOv9JUap7E813n8kVY-Q0W8kYIDm1jsDyZ1cByOgB2yhD0wU6kwM3m6IES5mV7XCqDoAHR4RKwlLButqi5ghI8aKafac1CdKkowmSPBXJq6YEGGqhfQPrELDJjWB4cMvn2pAyBvJ7unaqsAyqJQsMmvll7VbOfl0wzw~lV~h0ziiXOverW5Rw__"
                    alt="3D Modeling Workflow - Twinmotion and Cinema 4D"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">02. 3D Modeling & Real-Time Rendering</h3>
                  <p className="text-sm text-muted-foreground">
                    Twinmotion and Cinema 4D transform technical drawings into immersive 3D environments with real-time lighting and materials.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/pRn7KB2SHCH92g5NCN7fw4-img-3_1770681289000_na1fn_ZXhwZXJpZW50aWFsLWZhYnJpY2F0aW9u.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L3BSbjdLQjJTSENIOTJnNU5DTjdmdzQtaW1nLTNfMTc3MDY4MTI4OTAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFdaaFluSnBZMkYwYVc5dS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ddyt52-UxXJSNppbUkKeV6~bwkXKs-nnUpnn5vdezRvhkLwQPWdT030NnKZaPLdRpFjwOada5z0E~0B2dyE32YjD0bvav7bku66f4fkX7wfXwEx91uvfBolXXkTzWVp~9hAei7pWa06WqmvJPCqnUXIPII6O71YXCuPL19MoUks7B0RFrjeHbwaj-Sq4ivKjg138Pd7sxH0mjtK9C2EAZxwz337QaljhAuC9C7cZ3tYql77FK8HOni-w6qfdw1zd~YqF-QjCFuFek5T2Fx-17eA0PCgEts5x1CNrEKBkf2xKs~Kr1g0UmdJ-ydek35Iq8fL-aGGQACfAtONPu6P-9Q__"
                    alt="Fabrication and Buildability Documentation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">03. Buildability & Fabrication</h3>
                  <p className="text-sm text-muted-foreground">
                    Technical documentation supports production teams from concept through construction with scaled drawings and material specifications.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-2xl font-light italic border-t border-b border-border py-8">
                The design and the visualization describe the same space—<br />
                authored geometry ensures buildability from concept to completion.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Buildability & Fabrication Experience */}
      <section className="py-32 border-t border-border bg-muted/20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div>
                  <p className="text-xs tracking-widest text-pink-500 mb-4 font-bold">PRODUCTION-READY</p>
                  <h2 className="text-5xl md:text-6xl font-black mb-6">
                    Built to Build
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every experiential design is developed with fabrication and installation in mind. Technical drawings 
                  include construction details, material specifications, and scaled dimensions that translate directly 
                  to production.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Experience collaborating with fabrication shops, technical directors, and production teams ensures 
                  designs are not only visually compelling but structurally sound and budget-conscious.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="border border-border rounded-lg p-4 bg-background">
                    <Hammer className="w-6 h-6 mb-2 text-blue-400" />
                    <h4 className="font-bold mb-1">Fabrication-Ready</h4>
                    <p className="text-sm text-muted-foreground">Scaled drawings with construction details</p>
                  </div>
                  <div className="border border-border rounded-lg p-4 bg-background">
                    <Ruler className="w-6 h-6 mb-2 text-green-400" />
                    <h4 className="font-bold mb-1">Material Specs</h4>
                    <p className="text-sm text-muted-foreground">Detailed material and finish specifications</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <img 
                  src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/pRn7KB2SHCH92g5NCN7fw4-img-3_1770681289000_na1fn_ZXhwZXJpZW50aWFsLWZhYnJpY2F0aW9u.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L3BSbjdLQjJTSENIOTJnNU5DTjdmdzQtaW1nLTNfMTc3MDY4MTI4OTAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFdaaFluSnBZMkYwYVc5dS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ddyt52-UxXJSNppbUkKeV6~bwkXKs-nnUpnn5vdezRvhkLwQPWdT030NnKZaPLdRpFjwOada5z0E~0B2dyE32YjD0bvav7bku66f4fkX7wfXwEx91uvfBolXXkTzWVp~9hAei7pWa06WqmvJPCqnUXIPII6O71YXCuPL19MoUks7B0RFrjeHbwaj-Sq4ivKjg138Pd7sxH0mjtK9C2EAZxwz337QaljhAuC9C7cZ3tYql77FK8HOni-w6qfdw1zd~YqF-QjCFuFek5T2Fx-17eA0PCgEts5x1CNrEKBkf2xKs~Kr1g0UmdJ-ydek35Iq8fL-aGGQACfAtONPu6P-9Q__"
                  alt="Production team reviewing technical drawings in fabrication shop"
                  className="w-full rounded-2xl border border-border"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Capabilities Overview */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Full-Service Capabilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From concept sketches to final installation—integrated design and visualization services.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <AnimatedSection key={index}>
                <div className="border border-border rounded-xl p-8 bg-background hover:border-pink-500/40 transition-all hover:scale-105">
                  <capability.icon className="w-8 h-8 mb-4 text-pink-500" />
                  <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 border-t border-border bg-muted/20">
        <div className="container max-w-4xl">
          <ExperientialFAQ />
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <div className="text-center space-y-8">
              <p className="text-3xl md:text-4xl font-light leading-relaxed">
                Experiential design sits at the intersection of<br />
                art, technology, and real environments.
              </p>
              <p className="text-xl text-muted-foreground">
                This work is developed to be seen, shared, and built.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
