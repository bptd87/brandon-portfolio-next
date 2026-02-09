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

      {/* Hero Section with Integrated Philosophy */}
      <section className="py-32 border-b border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="space-y-12 text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                Renderings
              </h1>
              
              <div className="space-y-8 max-w-3xl mx-auto">
                <p className="text-2xl md:text-3xl leading-relaxed font-light">
                  Rendering is not documentation.
                  <br />
                  It is <em className="font-['Playfair_Display'] not-italic">authored visual storytelling</em>—
                  <br />
                  a deliberate act of framing light, material, and atmosphere
                  <br />
                  to communicate emotion before function.
                </p>
              </div>
            </div>
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

      {/* Art-Led Principles */}
      <section className="py-32 border-t border-border bg-muted/30">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-20">
              Art Before Tools
            </h2>
          </AnimatedSection>

          <div className="space-y-24">
            {/* Composition */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Composition</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Every frame is a deliberate choice. Where the eye enters. Where it rests. 
                    What remains in shadow. Composition is not about filling space—it's about 
                    directing attention and building visual hierarchy that serves the narrative.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Light */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Light</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Light is emotion. It defines time, temperature, and tension. A rendering 
                    without considered lighting is merely geometry. Light transforms space into 
                    place, data into atmosphere, and structure into story.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Material */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Material</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Texture carries memory. Worn wood tells a different story than polished steel. 
                    Material choices communicate history, use, and intention. These details are not 
                    decoration—they are narrative devices that ground the viewer in a believable world.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Atmosphere */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Atmosphere</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    The space between objects matters as much as the objects themselves. Fog, haze, 
                    depth—these atmospheric elements create separation, mystery, and scale. They remind 
                    us that rendering is about capturing a moment in time, not just documenting form.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Process as Layers */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-20">
              Process as Layers
            </h2>
          </AnimatedSection>

          <div className="space-y-16">
            {/* Layer 1 */}
            <AnimatedSection>
              <div className="space-y-4 pb-16 border-b border-border/50">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">01</span>
                  <h3 className="text-2xl font-bold">Authored 3D Modeling</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  Every rendering begins with intentional geometry. Not generic assets—authored forms 
                  that serve the specific vision of the project. The foundation is built with purpose.
                </p>
              </div>
            </AnimatedSection>

            {/* Layer 2 */}
            <AnimatedSection>
              <div className="space-y-4 pb-16 border-b border-border/50">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">02</span>
                  <h3 className="text-2xl font-bold">Lighting & Material Development</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  Light and material are developed in tandem. This is where mood emerges—where technical 
                  accuracy meets artistic interpretation. The rendering engine becomes a canvas.
                </p>
              </div>
            </AnimatedSection>

            {/* Layer 3 */}
            <AnimatedSection>
              <div className="space-y-4 pb-16 border-b border-border/50">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">03</span>
                  <h3 className="text-2xl font-bold">Composite Post-Production</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  The final image is refined through layering—color grading, atmospheric effects, and 
                  compositional adjustments. This is where the rendering transcends technical output and 
                  becomes a finished work.
                </p>
              </div>
            </AnimatedSection>

            {/* Layer 4 */}
            <AnimatedSection>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">04</span>
                  <h3 className="text-2xl font-bold">AI-Assisted Visualization</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  When appropriate, AI tools support the post-production phase—texture generation, 
                  atmospheric enhancement, or rapid iteration. These are instruments in service of the 
                  vision, not replacements for craft.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section - Stunning & Direct */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">The Future is AI</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Let's address what everyone's thinking.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-8">
            {/* FAQ 1 */}
            <AnimatedSection>
              <div className="border-b border-border pb-8">
                <h3 className="text-2xl font-bold mb-4">Do you use AI in your renderings?</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Yes. AI is a tool in the post-production phase—texture generation, atmospheric refinement, 
                  rapid iteration. It sits alongside Photoshop, V-Ray, and every other instrument in the pipeline. 
                  The question isn't whether AI is used, but whether the final image serves the vision.
                </p>
              </div>
            </AnimatedSection>

            {/* FAQ 2 */}
            <AnimatedSection>
              <div className="border-b border-border pb-8">
                <h3 className="text-2xl font-bold mb-4">Isn't that cheating?</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  No more than using a render engine is cheating. Or Photoshop. Or a camera. Every tool in visual 
                  storytelling is an abstraction—a way to translate intention into image. AI accelerates parts of 
                  that process. The craft is in knowing what to ask for, what to keep, and what to discard.
                </p>
              </div>
            </AnimatedSection>

            {/* FAQ 3 */}
            <AnimatedSection>
              <div className="border-b border-border pb-8">
                <h3 className="text-2xl font-bold mb-4">Will AI replace scenic designers?</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  AI will replace designers who don't understand composition, light, narrative, or context. 
                  It won't replace designers who do. The tool doesn't make the artist. The artist makes the work. 
                  AI is a brush, not a painter.
                </p>
              </div>
            </AnimatedSection>

            {/* FAQ 4 */}
            <AnimatedSection>
              <div className="border-b border-border pb-8">
                <h3 className="text-2xl font-bold mb-4">How do you ensure quality?</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Every rendering begins with authored 3D geometry. Lighting is developed manually. Materials are 
                  chosen intentionally. AI enters only after the foundation is built—and only when it serves the 
                  image. The final output is always curated, refined, and aligned with the project's narrative goals.
                </p>
              </div>
            </AnimatedSection>

            {/* FAQ 5 */}
            <AnimatedSection>
              <div className="border-b border-border pb-8">
                <h3 className="text-2xl font-bold mb-4">What's your stance on the ethics of AI?</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  AI models are trained on vast datasets, some of which include copyrighted work. That's a real concern. 
                  My approach: use AI as a compositing tool, not a replacement for original work. I don't generate entire 
                  images from prompts. I build the foundation, then refine. Transparency matters. So does craft.
                </p>
              </div>
            </AnimatedSection>

            {/* FAQ 6 */}
            <AnimatedSection>
              <div className="pb-8">
                <h3 className="text-2xl font-bold mb-4">Why be so open about this?</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Because pretending AI doesn't exist won't make it go away. The conversation around AI in design is 
                  often defensive or dismissive. I'd rather be honest. The tools are here. The question is how we use them. 
                  I choose to use them in service of better storytelling—not as a shortcut, but as an evolution.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
