import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lightbulb, Users, Laptop, Target, FlaskConical } from "lucide-react";

export default function TeachingPhilosophy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">TEACHING PHILOSOPHY</p>
            <h1 className="text-5xl md:text-6xl font-serif mb-6">Education & Mentorship</h1>
            <p className="text-xl text-muted-foreground">
              Preparing the next generation of scenic designers for theatre, film, television, events, and themed entertainment
            </p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <p className="text-foreground/90 leading-relaxed text-lg mb-8">
              As an educator in Scenic Design, my foremost goal is to equip students with the skills, confidence, and adaptability needed to thrive in today's rapidly evolving entertainment industry.
            </p>

            <h2 className="text-3xl font-serif mt-12 mb-6">A Comprehensive Foundation</h2>
            <p className="text-foreground/90 leading-relaxed mb-6">
              While rooted in the traditions of theatre, my teaching extends across Film, Television, Events, and Themed Entertainment, encouraging students to envision careers that match the breadth of opportunities available to creative designers today.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              I emphasize a comprehensive foundation in scenic design, beginning with spatial awareness, material comprehension, and design aesthetics, and extending into collaboration, an indispensable skill in this field. My courses balance traditional methods — such as hand-drafting, perspective sketching, and tactile rendering in gouache and watercolor — with advanced technologies including Vectorworks, Twinmotion, Adobe Creative Cloud, and AI-driven design tools. By layering old and new methods, I encourage students to respect process while embracing innovation.
            </p>

            <h2 className="text-3xl font-serif mt-12 mb-6">Accessible & Adaptive Pedagogy</h2>
            <p className="text-foreground/90 leading-relaxed mb-6">
              Recognizing that each student learns differently, I employ versatile teaching strategies. Some thrive in communal settings, while others find strength in individual exploration. To support this, I often begin with collaborative projects that build community and confidence, before shifting to individually tailored assignments.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              Accessibility is a cornerstone of my pedagogy: I integrate digital platforms like Canvas's immersive reader, supplemental videos, and hybrid tactile-digital assignments to meet students where they are.
            </p>

            <h2 className="text-3xl font-serif mt-12 mb-6">Mentorship Beyond the Classroom</h2>
            <p className="text-foreground/90 leading-relaxed mb-6">
              My own career trajectory informs my mentorship. Early on, I struggled to find my voice and learn the art of self-promotion. Today, I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              Beyond the classroom, I strive to create a positive design culture. At Stephens, I was adamant about developing a shared studio space where students could work beyond their dorm rooms, exchange supplies, and collaborate across disciplines — a communal environment that fostered both creativity and belonging.
            </p>

            <h2 className="text-3xl font-serif mt-12 mb-6">Teaching as Research</h2>
            <p className="text-foreground/90 leading-relaxed mb-6">
              Finally, I view teaching as a continuous act of research. Just as I bring current industry practices into my classroom, I also explore emerging technologies to expand students' toolkits. Recently, I incorporated AI tools like MidJourney and Adobe Firefly into my Digital Rendering course, inviting students to critically explore both the opportunities and limitations of these new mediums.
            </p>
            <p className="text-foreground/90 leading-relaxed mb-6">
              For me, the classroom is a laboratory for experimentation — a space where design education remains responsive to shifting industry landscapes.
            </p>

            <h2 className="text-3xl font-serif mt-12 mb-6">Core Philosophy</h2>
            <p className="text-foreground/90 leading-relaxed mb-12">
              My teaching philosophy centers on preparing students not only as designers, but as collaborators, innovators, and leaders. By combining foundational craft, technological literacy, and a strong culture of community, I aim to ensure they graduate ready to shape the future of scenic design across theatre and beyond.
            </p>
          </div>

          {/* Core Principles */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif mb-8">Core Principles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Target className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Industry Readiness</h3>
                  <p className="text-sm text-foreground/70">
                    Preparing students for careers across theatre, film, TV, events, and themed entertainment
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Laptop className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Traditional + Digital</h3>
                  <p className="text-sm text-foreground/70">
                    Balancing hand-drafting, painting, and sketching with Vectorworks, Twinmotion, and AI tools
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Collaboration Culture</h3>
                  <p className="text-sm text-foreground/70">
                    Creating shared studio spaces and collaborative projects that build community
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <BookOpen className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Accessible Learning</h3>
                  <p className="text-sm text-foreground/70">
                    Versatile teaching strategies with digital platforms and hybrid assignments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Lightbulb className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Self-Advocacy</h3>
                  <p className="text-sm text-foreground/70">
                    Guiding students toward resilience, confidence, and effective self-promotion
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <FlaskConical className="w-8 h-8 mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Teaching as Research</h3>
                  <p className="text-sm text-foreground/70">
                    Continuously exploring emerging technologies and industry practices
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Teaching Experience */}
          <div className="mb-12">
            <h2 className="text-3xl font-serif mb-8">Teaching Experience</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">Stephens College</h3>
                    <span className="text-sm text-muted-foreground">2024 – 2025</span>
                  </div>
                  <p className="text-sm text-foreground/70">Lecturer (Remote)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">Stephens College</h3>
                    <span className="text-sm text-muted-foreground">2021 – 2024</span>
                  </div>
                  <p className="text-sm text-foreground/70">Lecturer</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">University of Texas at El Paso</h3>
                    <span className="text-sm text-muted-foreground">2021</span>
                  </div>
                  <p className="text-sm text-foreground/70">Visiting Assistant Professor</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">University of California, Irvine</h3>
                    <span className="text-sm text-muted-foreground">2017 – 2020</span>
                  </div>
                  <p className="text-sm text-foreground/70">Adjunct Lecturer & TA</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Courses Taught */}
          <div>
            <h2 className="text-3xl font-serif mb-8">Courses Taught</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-2 text-foreground/80">
                  <li>• Scenic Design</li>
                  <li>• Introduction to Scenic Design</li>
                  <li>• Digital Rendering</li>
                  <li>• Entertainment Design & Collaboration</li>
                  <li>• Vectorworks (Drafting & 3D Modeling)</li>
                  <li>• Technical Theatre</li>
                  <li>• Properties Supervisor (TA)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
