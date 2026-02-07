import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Briefcase, GraduationCap, Mail, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start mb-16">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Profile Photo
              </div>
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl font-serif mb-4">Brandon PT Davis</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Scenic Designer | ART × TECHNOLOGY × DESIGN
              </p>
              
              <div className="flex flex-col gap-3 text-foreground/80 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Southern California, USA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@brandonptdavis.com</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">15+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">130+</div>
                    <div className="text-sm text-muted-foreground">Projects Designed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-semibold mb-1">MFA</div>
                    <div className="text-xs text-muted-foreground">UC Irvine</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm font-semibold mb-1">USA 829</div>
                    <div className="text-xs text-muted-foreground">Union Member</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* The Story */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <h2 className="text-3xl font-serif mb-6">The Story</h2>
            <p className="text-foreground/90 leading-relaxed mb-6">
              I believe scenic design is a form of storytelling—one that starts before the actors speak and lingers after the final bow. My work lives at the intersection of craft and concept, using physical space to shape emotion, tension, and rhythm. With over 15 years of experience in theatre and immersive environments, I've designed productions across the country, collaborated with inspiring creatives, and mentored the next generation of designers. Whether I'm working with a major regional theatre or an ambitious independent company, I approach each project with curiosity, adaptability, and a deep respect for the story being told.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              Brandon PT Davis (he/him) is a scenic designer who transforms theatrical spaces into immersive visual landscapes where story and space move together in harmony. Based in Southern California, Brandon's work is rooted in a lifelong curiosity about how design shapes experience. What began as a high school obsession with set sketches in 2006 has evolved into a professional practice defined by artistic risk-taking, narrative sensitivity, and technical precision.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              At the core of his creative philosophy is a deep respect for storytelling: how visual environments can heighten emotion, clarify conflict, and create rhythm across a production. He draws from a wide range of influences—modern architecture, street art, mid-century design, theatrical history, and even pop culture ephemera—allowing each project to find its own unique visual language.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              Brandon is equally fluent in the analog and digital—combining traditional model-making and drafting with advanced workflows in 3D modeling, real-time rendering, and digital fabrication. His design process often includes tools like Vectorworks, Twinmotion, and 3D printing, allowing directors and collaborators to experience spatial ideas in living motion. As a proud member of United Scenic Artists Local 829, he brings both rigor and play to the collaborative table, supporting teams with conceptual clarity, high-fidelity renderings, and production-ready technical drawings.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              In addition to his freelance work, Brandon has served as a professor of scenic design, and he continues to teach one or two courses each year. He is passionate about mentoring the next generation of designers and helping others navigate the complex, rewarding path of a creative career.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              Brandon also works beyond the stage—as a Senior Scenic and Experiential Designer with Adaptive Design Services, he collaborates on branded events, architectural visualizations, and immersive environments. Whether designing for theatre, theme parks, or concept pitches, he brings the same core vision: to create spaces that breathe with the story, linger in the memory, and reflect the emotional truth of the work.
            </p>
          </div>

          {/* Education */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif mb-6 flex items-center gap-3">
              <GraduationCap className="w-8 h-8" />
              Education
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Master of Fine Arts in Scenic Design</h3>
                  <p className="text-muted-foreground">University of California, Irvine</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Bachelor of Fine Arts in Theatre Arts</h3>
                  <p className="text-muted-foreground">Stephens College</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif mb-6 flex items-center gap-3">
              <Briefcase className="w-8 h-8" />
              Professional Experience
            </h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Senior Scenic and Experiential Designer</h3>
                  <p className="text-muted-foreground mb-2">Adaptive Design Services</p>
                  <p className="text-sm text-foreground/70">
                    Collaborating on branded events, architectural visualizations, and immersive environments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Freelance Scenic Designer</h3>
                  <p className="text-muted-foreground mb-2">Regional Theatres Nationwide</p>
                  <p className="text-sm text-foreground/70">
                    130+ productions designed across major regional theatres
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Honors & Affiliations */}
          <div>
            <h2 className="text-3xl font-serif mb-6 flex items-center gap-3">
              <Award className="w-8 h-8" />
              Honors & Affiliations
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">United Scenic Artists, Local USA 829</h3>
                  <p className="text-sm text-foreground/70">
                    Union member for professional scenic, lighting, and costume designers
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
