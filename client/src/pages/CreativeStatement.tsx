import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CreativeStatement() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-serif leading-tight">
            <span className="text-blue-500 italic">Design</span> is{" "}
            <span className="text-red-500 italic">storytelling</span>.
            <br />
            <span className="text-purple-500 italic">Space</span> is the{" "}
            <span className="text-blue-600 italic">narrative</span>.
          </h1>
        </div>
      </section>

      {/* Section 2 */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-serif leading-tight mb-12">
            <span className="text-orange-500 italic">Architecture</span> meets{" "}
            <span className="text-blue-500 italic">narrative</span>.
            <br />
            <span className="text-green-600 italic">History</span> shapes{" "}
            <span className="text-purple-500 italic">meaning</span>.
          </h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            My work lives at the intersection of craft and concept, where physical space becomes a tool for shaping emotion, tension, and rhythm.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-serif leading-tight mb-12">
            <span className="text-green-500 italic">Every voice</span> matters.
            <br />
            From <span className="text-blue-500 italic">playwright</span> to{" "}
            <span className="text-orange-500 italic">carpenter</span>.
          </h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Great design emerges from collaboration. I value every member of the creative and production teams who bring the vision to life.
          </p>
        </div>
      </section>

      {/* Section 4 */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-serif leading-tight mb-12">
            <span className="text-purple-500 italic">Explore</span>.{" "}
            <span className="text-blue-500 italic">Sculpt</span>.{" "}
            <span className="text-green-500 italic">Refine</span>.
            <br />
            Never afraid to <span className="text-red-500 italic">start over</span>.
          </h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Through conversation and digital modeling, I explore and sculpt the world—always willing to restart, no matter where we are in the journey.
          </p>
        </div>
      </section>

      {/* Section 5 */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-serif leading-tight mb-12">
            From <span className="text-blue-500 italic">rendering</span> to{" "}
            <span className="text-green-500 italic">reality</span>.
            <br />
            <span className="text-orange-500 italic">Structure</span> meets{" "}
            <span className="text-purple-500 italic">detail</span>.
          </h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            I thrive in the transition from concept to construction—translating ideas into fully buildable spaces where every choice supports the narrative.
          </p>
        </div>
      </section>

      {/* Section 6 - Final */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-serif leading-tight mb-12">
            Designs that feel <span className="text-blue-500 italic">inevitable</span>.
            <br />
            Spaces that <span className="text-purple-500 italic">resonate</span>.
          </h2>
          <p className="text-xl md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-16">
            My goal is to create environments that feel like they couldn't have been any other way—even if it took many revisions to get there.
          </p>
          <div className="text-2xl md:text-3xl font-serif text-foreground/60">
            Brandon PT Davis
            <br />
            <span className="text-lg">Scenic Designer</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
