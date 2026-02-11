import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { FAQSection } from "@/components/FAQSection";

const renderingFaqs = [
  {
    question: "What makes a rendering successful?",
    answer: "A successful rendering doesn't just document space\u2014it communicates emotion, narrative, and atmosphere. It's about choosing what to reveal and what to withhold. Composition guides the eye. Light establishes mood. Material choices carry memory and history. When these elements align with the story you're telling, the rendering transcends technical accuracy and becomes a piece of visual storytelling."
  },
  {
    question: "How do you approach composition in renderings?",
    answer: "Every frame is a deliberate choice. I start by asking: where should the viewer's eye enter? What's the focal point? What remains in shadow? Composition isn't about filling space\u2014it's about building visual hierarchy that serves the narrative. I use the rule of thirds, leading lines, and negative space to create tension, balance, or unease depending on what the project demands."
  },
  {
    question: "What's your philosophy on light and atmosphere?",
    answer: "Light is emotion. It defines time of day, temperature, and psychological tension. I approach lighting like a cinematographer\u2014motivated sources, intentional shadows, and atmospheric depth. Fog, haze, and volumetric effects aren't decoration; they create separation between foreground and background, add mystery, and remind the viewer they're looking at a moment in time, not just geometry."
  },
  {
    question: "How do you collaborate with directors and designers?",
    answer: "I start by understanding the narrative and emotional goals of the project. What feeling should this space evoke? What's the story being told? From there, I work iteratively\u2014sharing early compositions, testing lighting scenarios, and refining based on feedback. The best collaborations happen when the rendering process becomes part of the design conversation, not just documentation of decisions already made."
  },
  {
    question: "What's the difference between documentation and storytelling?",
    answer: "Documentation shows what a space looks like. Storytelling shows what it feels like. Documentation is neutral, objective, complete. Storytelling is authored\u2014it has a point of view, a mood, a sense of time and place. I'm not interested in creating architectural photography. I'm interested in creating images that make you want to step into the world they depict."
  },
  {
    question: "What is Authored Composite Rendering?",
    answer: "It's my approach to blending traditional 3D rendering with modern post-production techniques. Every image begins with authored geometry, intentional lighting, and curated materials. The composite phase\u2014whether through Photoshop, AI tools, or other methods\u2014refines atmospherics, enhances textures, and accelerates iteration. The result is faster turnaround without sacrificing artistic control. The craft is in knowing what to build, what to enhance, and what to leave alone."
  }
];

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
                <p className="text-2xl md:text-3xl leading-relaxed font-extralight">
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

      <FAQSection
        title="The Craft"
        subtitle="On rendering as an art form, design philosophy, and the process behind the images."
        items={renderingFaqs}
      />

      <Footer />
    </div>
  );
}
