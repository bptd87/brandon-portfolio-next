import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CreativeStatement() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8 text-center">CREATIVE STATEMENT</p>
          
          <h1 className="text-5xl md:text-7xl font-serif mb-16 leading-tight text-center">
            Architecture, History
            <br />
            & Narrative Storytelling
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-foreground/90 leading-relaxed mb-8 first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
              My passion for scenic design falls somewhere between a love of architecture, history, and narrative storytelling. I'm drawn to projects that have meaning and impact for the communities they serve. I'm especially interested in productions where the design does more than illustrate a setting and becomes part of how the story resonates.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Collaboration
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/90 leading-relaxed">
                I value every collaborator involved in bringing a production to life. That starts with the hidden collaborator, the playwright, and extends to the director, the creative team, and the production teams. I also enjoy working closely with company managers, carpenters, and artisans to realize the best version of the creative team's vision within each unique venue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative py-32 px-6 bg-accent/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Process
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                My process often begins with a lot of ideas that pull in different directions. Early conversations with the director focus on the text: What do they see, and how can we shape a shared vision? From that point forward, I build digital models to explore and sculpt the world. I'm never afraid to start over, no matter where we are in the process.
              </p>
              <p className="text-xl text-foreground/90 leading-relaxed">
                I love the energy of collaborative design conversations, when ideas start bouncing between departments and the production finds its rhythm. Technically, I thrive in the transition from rendering to drafting, translating concepts into fully buildable spaces. I'm drawn to designs where structure and detail work together, and where every choice supports both the narrative and the performers onstage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Philosophy
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-foreground/90 leading-relaxed mb-16">
                Whether I'm working on a classic or a new play, my goal is to create environments that feel inevitable once they're revealed. Ideally, the design feels like it couldn't have been any other way, even if it took many revisions and collaborative breakthroughs to get there.
              </p>
              
              {/* Signature */}
              <div className="border-t border-border/50 pt-12">
                <div className="text-3xl font-serif mb-2">Brandon PT Davis</div>
                <div className="text-lg text-muted-foreground">Scenic Designer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
