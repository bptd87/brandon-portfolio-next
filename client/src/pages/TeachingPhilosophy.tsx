import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Lightbulb, Users, Laptop, Target, FlaskConical } from "lucide-react";

export default function TeachingPhilosophy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      <section className="container py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">TEACHING PHILOSOPHY</p>
            <h1 className="text-5xl md:text-6xl font-serif mb-6">Education & Mentorship</h1>
            <p className="text-xl text-muted-foreground">
              Preparing the next generation of scenic designers for theatre, film, television, events, and themed entertainment
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-16">
            {/* Main Content - Left */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-foreground/90 leading-relaxed text-lg mb-8 text-justify">
                As an educator in Scenic Design, my foremost goal is to equip students with the skills, confidence, and adaptability needed to thrive in today's rapidly evolving entertainment industry.
              </p>

              <h2 className="text-3xl font-serif mt-12 mb-6">A Comprehensive Foundation</h2>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                While rooted in the traditions of theatre, my teaching extends across Film, Television, Events, and Themed Entertainment, encouraging students to envision careers that match the breadth of opportunities available to creative designers today.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                I emphasize a comprehensive foundation in scenic design, beginning with spatial awareness, material comprehension, and design aesthetics, and extending into collaboration, an indispensable skill in this field. My courses balance traditional methods — such as hand-drafting, perspective sketching, and tactile rendering in gouache and watercolor — with advanced technologies including Vectorworks, Twinmotion, Adobe Creative Cloud, and AI-driven design tools. By layering old and new methods, I encourage students to respect process while embracing innovation.
              </p>

              <h2 className="text-3xl font-serif mt-12 mb-6">Accessible & Adaptive Pedagogy</h2>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                Recognizing that each student learns differently, I employ versatile teaching strategies. Some thrive in communal settings, while others find strength in individual exploration. To support this, I often begin with collaborative projects that build community and confidence, before shifting to individually tailored assignments.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                Accessibility is a cornerstone of my pedagogy: I integrate digital platforms like Canvas's immersive reader, supplemental videos, and hybrid tactile-digital assignments to meet students where they are.
              </p>

              <h2 className="text-3xl font-serif mt-12 mb-6">Mentorship Beyond the Classroom</h2>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                My own career trajectory informs my mentorship. Early on, I struggled to find my voice and learn the art of self-promotion. Today, I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                Beyond the classroom, I strive to create a positive design culture. At Stephens, I was adamant about developing a shared studio space where students could work beyond their dorm rooms, exchange supplies, and collaborate across disciplines — a communal environment that fostered both creativity and belonging.
              </p>

              <h2 className="text-3xl font-serif mt-12 mb-6">Teaching as Research</h2>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                Finally, I view teaching as a continuous act of research. Just as I bring current industry practices into my classroom, I also explore emerging technologies to expand students' toolkits. Recently, I incorporated AI tools like MidJourney and Adobe Firefly into my Digital Rendering course, inviting students to critically explore both the opportunities and limitations of these new mediums.
              </p>
              <p className="text-foreground/90 leading-relaxed mb-6 text-justify">
                For me, the classroom is a laboratory for experimentation — a space where design education remains responsive to shifting industry landscapes.
              </p>

              <h2 className="text-3xl font-serif mt-12 mb-6">Core Philosophy</h2>
              <p className="text-foreground/90 leading-relaxed mb-12 text-justify">
                My teaching philosophy centers on preparing students not only as designers, but as collaborators, innovators, and leaders. By combining foundational craft, technological literacy, and a strong culture of community, I aim to ensure they graduate ready to shape the future of scenic design across theatre and beyond.
              </p>


            </div>

            {/* Right Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              {/* Core Principles */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">CORE PRINCIPLES</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Target className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Industry Readiness</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Preparing students for careers across theatre, film, TV, events, and themed entertainment
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Laptop className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Traditional + Digital</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Balancing hand-drafting, painting, and sketching with Vectorworks, Twinmotion, and AI tools
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Collaboration Culture</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Creating shared studio spaces and collaborative projects that build community
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Accessible Learning</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Versatile teaching strategies with digital platforms and hybrid assignments
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Self-Advocacy</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Guiding students toward resilience, confidence, and effective self-promotion
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <FlaskConical className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Teaching as Research</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Continuously exploring emerging technologies and industry practices
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teaching Experience */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">TEACHING EXPERIENCE</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Stephens College</h3>
                    <p className="text-sm text-muted-foreground">Lecturer (Remote)</p>
                    <p className="text-sm text-muted-foreground">2024 – 2025</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Stephens College</h3>
                    <p className="text-sm text-muted-foreground">Lecturer</p>
                    <p className="text-sm text-muted-foreground">2021 – 2024</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">University of Texas at El Paso</h3>
                    <p className="text-sm text-muted-foreground">Visiting Assistant Professor</p>
                    <p className="text-sm text-muted-foreground">2021</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">University of California, Irvine</h3>
                    <p className="text-sm text-muted-foreground">Adjunct Lecturer & TA</p>
                    <p className="text-sm text-muted-foreground">2017 – 2020</p>
                  </div>
                </div>
              </div>

              {/* Courses Taught */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">COURSES TAUGHT</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-8">
                  <ul className="space-y-2 text-sm text-foreground/80">
                    <li>• Scenic Design</li>
                    <li>• Introduction to Scenic Design</li>
                    <li>• Digital Rendering</li>
                    <li>• Entertainment Design & Collaboration</li>
                    <li>• Vectorworks (Drafting & 3D Modeling)</li>
                    <li>• Technical Theatre</li>
                    <li>• Properties Supervisor (TA)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
