import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ExperientialFAQ } from "@/components/ExperientialFAQ";
import { ArrowRight, Layers, Ruler, Video, Sparkles, Cloud, Box } from "lucide-react";

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

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Integrated Philosophy */}
      <section className="py-32 border-b border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="space-y-12 text-center">
              <div>
                <p className="text-xs tracking-widest text-muted-foreground mb-6">EXPERIENTIAL DESIGN</p>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                  Experiential
                </h1>
              </div>
              
              <div className="space-y-8 max-w-3xl mx-auto">
                <p className="text-2xl md:text-3xl leading-relaxed font-extralight">
                  Artist-led environments grounded in real space and scale.
                </p>
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
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border">
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

      {/* Capabilities Overview */}
      <section className="py-32 border-t border-border bg-muted/20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Capabilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                What I bring to agile creative teams.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <AnimatedSection key={index}>
                <div className="border border-border rounded-xl p-8 bg-background hover:border-white/40 transition-colors">
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

      {/* Unified Workflow */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                A Unified Experiential Workflow
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-12">
              <p className="text-xl text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
                My process maintains continuity from early design through visualization and presentation. 
                By authoring both the spatial design and the visual output, scale and intent remain aligned 
                across drawings, renderings, and walkthroughs.
              </p>

              <div className="flex items-center justify-center gap-4 text-lg font-light text-muted-foreground flex-wrap">
                <span>Design</span>
                <ArrowRight className="w-5 h-5" />
                <span>Model</span>
                <ArrowRight className="w-5 h-5" />
                <span>Visualize</span>
                <ArrowRight className="w-5 h-5" />
                <span>Refine</span>
                <ArrowRight className="w-5 h-5" />
                <span>Communicate</span>
              </div>

              <p className="text-2xl font-light text-center italic border-t border-b border-border py-8">
                The design and the visualization describe the same space.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Authored Composite Visualization */}
      <section className="py-32 border-t border-border bg-muted/20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Authored Composite Visualization
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Authored composite visualization integrates authored spatial design, real-time rendering, 
                and selective AI-assisted post-production into a single, controlled workflow.
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-6">
                AI tools are used to support environmental density, atmospheric depth, and surface 
                refinement—always grounded in authored geometry, composition, and real-world scale.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/RpgW6FNNV9U39IWzGpwxQn-img-2_1770680369000_na1fn_ZXhwZXJpZW50aWFsLWNvbXBvc2l0ZS1lbnZpcm9ubWVudA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L1JwZ1c2Rk5OVjlVMzlJV3pHcHd4UW4taW1nLTJfMTc3MDY4MDM2OTAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFdOdmJYQnZjMmwwWlMxbGJuWnBjbTl1YldWdWRBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ahclSudWVU~P-~4yf1lUL3fpZpluNqQeLifxTmE3jP5Waxh7YlnC1dt~6jHa0foq05oOGWAMfGImRzIq1kwIt3lB3~aChwuNvHfK7Bs628v86RxdKB21dgadXIBEXBQUv~wxy5r7W~nF1pTAoUf~yQXCJ4Kyf0E~LbhXu6GfKfUlLq6jUhxEj8ceU0hc9vac-z3gnWN6IAu1zXB7hWslgMomqwTHw8WXBLNoEg~e4SoTBohUiDnhGOTUQAwmzz6fCYIknAR7jlCA2EnlkU1k5ZffHB6wOLNKijyPBdC5NptIefPS0g~h~wz416ws1-MiXbZo9w3WZDeAXLj7HhtyCA__"
                    alt="Authored Composite Visualization - Immersive Environment"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Authored Composite Visualization</strong><br />
                  Experiential environment developed from authored geometry and atmospheric post-production.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/RpgW6FNNV9U39IWzGpwxQn-img-3_1770680364000_na1fn_ZXhwZXJpZW50aWFsLWFjdGl2YXRpb24tc3BhY2U.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L1JwZ1c2Rk5OVjlVMzlJV3pHcHd4UW4taW1nLTNfMTc3MDY4MDM2NDAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFdGamRHbDJZWFJwYjI0dGMzQmhZMlUuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Tp3nkAz2SLwqJ~RS87sU7euIlokkCQcAcdgOP2QX1dIy~7Wd-37qvNABmeqsh4KSe~xmcCziTwcLvb2nbGlarOh3bEhce4y0fiO95KI1EM7ufEcM8bA8bgpt1bStOwZcxITMLk2Nzl1npu4~~bLnIrKU18JySO3d1nt5mx77G57SuDMoi2sWBu9LLo23kQHhpA92VQmAPA7eqPyHEb568HwbL9InxJEkTHFEPXPtS9MFQdoYY1H1N~ibnwE7HC68KXbSJdgj40o3hV-fZMFvpsex6RtIqb25Sy838RMQ2BS8qmEgmRqNGddP8Cd0VcVGWnQ3pH-RwIOE7Bqds1t5wQ__"
                    alt="Large-Scale Activation Space"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Large-Scale Activation</strong><br />
                  Bold installation environment showing scale, circulation, and spatial hierarchy.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <img 
                    src="https://private-us-east-1.manuscdn.com/sessionFile/erhSK1Z2iEewnSpDHueKVU/sandbox/RpgW6FNNV9U39IWzGpwxQn-img-1_1770680370000_na1fn_ZXhwZXJpZW50aWFsLXBvaW50LWNsb3Vk.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZXJoU0sxWjJpRWV3blNwREh1ZUtWVS9zYW5kYm94L1JwZ1c2Rk5OVjlVMzlJV3pHcHd4UW4taW1nLTFfMTc3MDY4MDM3MDAwMF9uYTFmbl9aWGh3WlhKcFpXNTBhV0ZzTFhCdmFXNTBMV05zYjNWay5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LVMPyZO3B4ZlNz2c9SSP4NPdLD2nPfvJyNj9BhbmLbCZLcKlfoN~jpALOz7IBG-7NeTIAf0jULpGfgvPM1ZsNx0naPcxRMIOH2kGx8c-y-VfQ03zHieEqPNRldwuN5FEg2IelSrlYQgHThtWNFYOVSSC9xRc4g8yzKsPKwG27jdwx0xCKsjr-QUSDWjWBjk3AOafI8SZ2faZXT1O2~7uBHJM74q9f8DMdDrAH2Svpk05F6EqTfcooMlMH7IHMlzMlOoJfYiozim0hjleVB3AfaNRDQznA5UC85jDcD6mOv976Y6wyeMM2~IDusdO0u3Kkt09~ZViv7NKjok2Kt0K7A__"
                    alt="Point-Cloud Spatial Study"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Point-Cloud Spatial Study</strong><br />
                  Density-driven visualization emphasizing human scale and spatial perception.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Point-Cloud Differentiator */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-black">
                Point-Cloud–Driven Visualization
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Point-cloud–driven visualization treats space as a field of information rather than a 
                collection of isolated objects. This approach emphasizes density, scale, and human 
                perception—allowing environments to be evaluated as they will be experienced.
              </p>
              <p className="text-2xl font-light italic border-t border-b border-border py-8">
                Like a portrait composed of thousands of points, the environment resolves through 
                accumulation rather than surface detail alone.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 border-t border-border bg-muted/20">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Designed for Agile Teams
              </h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                <p className="text-xl text-muted-foreground">
                  One author across design and visualization
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                <p className="text-xl text-muted-foreground">
                  Faster iteration without rescaling or reinterpretation
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                <p className="text-xl text-muted-foreground">
                  Visuals grounded in real circulation and proportion
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0" />
                <p className="text-xl text-muted-foreground">
                  Clear communication between creative and production
                </p>
              </div>

              <p className="text-2xl font-light text-center pt-8 border-t border-border">
                I extend what small teams can deliver without adding complexity.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <ExperientialFAQ />

      {/* Close */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <div className="text-center space-y-8">
              <p className="text-2xl md:text-3xl font-light leading-relaxed">
                Experiential design sits at the intersection of art, technology, and real environments.
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
