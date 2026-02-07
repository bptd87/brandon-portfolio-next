import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { Download, ExternalLink } from "lucide-react";

export default function Resume() {
  return (
    <>
      <Header />
      
      <section className="min-h-screen bg-background pt-20 pb-20">
        <div className="container">
          {/* About Navigation */}
          <AboutNav />

          {/* Hero */}
          <div className="mb-20">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">CURRICULUM VITAE</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">Professional Experience</h1>
            <p className="text-xl text-foreground/70 max-w-4xl leading-relaxed">
              Scenic & Experiential Designer specializing in theatrical production, live events, and immersive environments. Over 130 realized productions across regional theatres, academic institutions, and experiential design projects.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-20">
            {/* Main Content - Left */}
            <div className="max-w-none">
              
              {/* Education */}
              <div className="mb-20">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">EDUCATION</h2>
                <div className="space-y-6">
                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-primary font-pixel mb-2">MFA</div>
                        <h3 className="text-2xl font-serif mb-2">University of California, Irvine</h3>
                        <p className="text-lg text-foreground/70 mb-4">Drama [Scenic Design]</p>
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-justify">
                      Thesis production: <em>Company</em> (Scenic Design). Designed five realized productions including <em>American Idiot</em>, <em>Parliament Square</em>, and <em>The Penelopiad</em>. Developed advanced scenic design course for upper-level students.
                    </p>
                  </div>

                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-primary font-pixel mb-2">BFA</div>
                        <h3 className="text-2xl font-serif mb-2">Stephens College</h3>
                        <p className="text-lg text-foreground/70 mb-4">Theatre Arts</p>
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed text-justify">
                      Capstone: <em>All My Sons</em> (Scenic Design). Received Apprenticeship Scholarship requiring 20+ weekly hours in scene shop, gaining practical training in construction, painting, and technical support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Experience */}
              <div className="mb-20">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">PROFESSIONAL EXPERIENCE</h2>
                <div className="space-y-6">
                  {/* Brandon PT Davis Design LLC */}
                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-serif">Brandon PT Davis Design LLC</h3>
                      <span className="text-sm text-muted-foreground font-pixel whitespace-nowrap ml-4">2024–PRESENT</span>
                    </div>
                    <p className="text-lg text-foreground/80 mb-3">Scenic & Experiential Designer</p>
                    <p className="text-foreground/70 leading-relaxed text-justify">
                      Independent design practice specializing in theatrical scenic design and experiential environments. Providing comprehensive design services from concept development through technical documentation and installation supervision.
                    </p>
                  </div>

                  {/* Adaptive Design Services */}
                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-serif">Adaptive Design Services</h3>
                      <span className="text-sm text-muted-foreground font-pixel whitespace-nowrap ml-4">2022–PRESENT</span>
                    </div>
                    <p className="text-lg text-foreground/80 mb-3">Sr. Scenic & Experiential Designer</p>
                    <p className="text-foreground/70 leading-relaxed text-justify">
                      Senior design role creating immersive environments and experiential activations for brands and events. Collaborating on architectural visualizations, branded environments, and large-scale experiential projects bringing theatrical storytelling techniques to commercial applications.
                    </p>
                  </div>

                  {/* Academic Appointments */}
                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-serif">Academic Appointments</h3>
                      <span className="text-sm text-muted-foreground font-pixel whitespace-nowrap ml-4">2017–2025</span>
                    </div>
                    <p className="text-lg text-foreground/80 mb-3">Various Institutions</p>
                    <p className="text-foreground/70 leading-relaxed text-justify">
                      Teaching positions at Stephens College, University of Missouri, and other institutions. Courses include Scenic Design, Digital Design Tools, and Production Design. Mentoring emerging designers in both traditional craft and contemporary digital workflows.
                    </p>
                  </div>

                  {/* Regional Theatre */}
                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-serif">Regional Theatre Positions</h3>
                      <span className="text-sm text-muted-foreground font-pixel whitespace-nowrap ml-4">2012–2017</span>
                    </div>
                    <p className="text-lg text-foreground/80 mb-3">Various Theatres</p>
                    <p className="text-foreground/70 leading-relaxed text-justify">
                      Resident and guest scenic designer positions at regional theatres across the United States. Designed productions ranging from intimate dramas to large-scale musicals, developing expertise in diverse theatrical styles and production scales.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Productions */}
              <div className="mb-20">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">RECENT SCENIC DESIGN</h2>
                <p className="text-foreground/70 mb-8 text-lg">Selected productions from 2023-2024</p>
                
                <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50 bg-card/20">
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Production</th>
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Director</th>
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Company</th>
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Clue On Stage</td>
                          <td className="py-4 px-6 text-foreground/70">John Hemphill</td>
                          <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Urinetown</td>
                          <td className="py-4 px-6 text-foreground/70">Joy Powell</td>
                          <td className="py-4 px-6 text-foreground/70">University of Missouri</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">The Music Man</td>
                          <td className="py-4 px-6 text-foreground/70">Bernie Monroe</td>
                          <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Barefoot in The Park</td>
                          <td className="py-4 px-6 text-foreground/70">Brett Olson</td>
                          <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Freaky Friday</td>
                          <td className="py-4 px-6 text-foreground/70">Josh Walden</td>
                          <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Baskerville</td>
                          <td className="py-4 px-6 text-foreground/70">Stephen Brotebeck</td>
                          <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">9 to 5</td>
                          <td className="py-4 px-6 text-foreground/70">Brandon Riley</td>
                          <td className="py-4 px-6 text-foreground/70">University of Missouri</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Footloose</td>
                          <td className="py-4 px-6 text-foreground/70">Jamey Grisham</td>
                          <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Boeing, Boeing</td>
                          <td className="py-4 px-6 text-foreground/70">John Hemphill</td>
                          <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Bright Star</td>
                          <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                          <td className="py-4 px-6 text-foreground/70">Denver School of the Arts</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Christmas Carol</td>
                          <td className="py-4 px-6 text-foreground/70">Courtney Crouse</td>
                          <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">An Enemy of The People</td>
                          <td className="py-4 px-6 text-foreground/70">LR Hults</td>
                          <td className="py-4 px-6 text-foreground/70">University of Missouri</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Songs For a New World</td>
                          <td className="py-4 px-6 text-foreground/70">Lisa Brescia</td>
                          <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">The Wedding Singer</td>
                          <td className="py-4 px-6 text-foreground/70">Bernie Monroe</td>
                          <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Dial 'M' For Murder</td>
                          <td className="py-4 px-6 text-foreground/70">Fred Rubeck</td>
                          <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Cole</td>
                          <td className="py-4 px-6 text-foreground/70">Alison Morooney</td>
                          <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Head Over Heels</td>
                          <td className="py-4 px-6 text-foreground/70">Josh Walden</td>
                          <td className="py-4 px-6 text-foreground/70">Theatre SilCo</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Curtain Up! Stephens</td>
                          <td className="py-4 px-6 text-foreground/70">Lisa Brescia</td>
                          <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Lotería</td>
                          <td className="py-4 px-6 text-foreground/70">Sara Rodriguez</td>
                          <td className="py-4 px-6 text-foreground/70">Theatre SilCo</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                        <tr className="hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Spelling Bee</td>
                          <td className="py-4 px-6 text-foreground/70">Todd Davidson</td>
                          <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-sm text-foreground/60 italic mt-6 text-center">
                  Over 130 realized productions since 2009. Complete production history available upon request.
                </p>
              </div>

              {/* Assistant Scenic Design */}
              <div className="mb-20">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">ASSISTANT SCENIC DESIGN</h2>
                <p className="text-foreground/70 mb-8 text-lg">Selected assisting credits working with established designers</p>
                
                <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50 bg-card/20">
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Production</th>
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Director</th>
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Company</th>
                          <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">The Play that Goes Wrong</td>
                          <td className="py-4 px-6 text-foreground/70">Tom Buderwitz</td>
                          <td className="py-4 px-6 text-foreground/70">Seattle Rep</td>
                          <td className="py-4 px-6 text-foreground/70">2025</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">The Importance of Being Earnest</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                          <td className="py-4 px-6 text-foreground/70">2025</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">A Gentlemen's Guide to Love and Murder</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                          <td className="py-4 px-6 text-foreground/70">2025</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Steel Magnolias</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                          <td className="py-4 px-6 text-foreground/70">2025</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">The Book Club Play</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Cincinnati Playhouse in the Park</td>
                          <td className="py-4 px-6 text-foreground/70">2025</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Souvenir</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Pioneer Theatre</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Ragtime</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">The Ruth: Hale Orem</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Natasha, Pierre, and the Great Comet of 1812</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Pioneer Theatre Company</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Jersey Boys</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Pioneer Theatre Company</td>
                          <td className="py-4 px-6 text-foreground/70">2024</td>
                        </tr>
                        <tr className="hover:bg-card/20 transition-colors">
                          <td className="py-4 px-6 font-medium">Matilda</td>
                          <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                          <td className="py-4 px-6 text-foreground/70">Pioneer Theatre Company</td>
                          <td className="py-4 px-6 text-foreground/70">2023</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Technical Proficiencies */}
              <div className="mb-20">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">TECHNICAL PROFICIENCIES</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">Design & Fabrication</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Computer Drafting, Digital Rendering, Graphic Design, Hand Drafting, Model Making, 3D Printing, Laser Cutting, Scenic Construction, Foam Construction, Scenic Painting, MIG Welding, PC Build
                    </p>
                  </div>

                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">3D Modeling</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Vectorworks, Trimble SketchUp, Cinema 4D
                    </p>
                  </div>

                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">Graphics & Design</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Photoshop, Illustrator, InDesign, Vectorworks, Filter Forge, Procreate
                    </p>
                  </div>

                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">Real-Time Rendering</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Twinmotion, Enscape, Unreal Engine (basic)
                    </p>
                  </div>

                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">AI Tools</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      MidJourney, Adobe Firefly, Runway, Sora
                    </p>
                  </div>

                  <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">Video & Media</h3>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      Adobe Premiere, After Effects, Resolume, Camtasia
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="backdrop-blur-md bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-12 text-center">
                <h3 className="text-2xl font-serif mb-4">Request Complete CV</h3>
                <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                  Complete production history, detailed project descriptions, and professional references available upon request
                </p>
                <a 
                  href="mailto:info@brandonptdavis.com" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Request Full CV
                </a>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              
              {/* Key Stats */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">KEY STATS</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-8 space-y-8">
                  <div className="text-center pb-6 border-b border-border/50">
                    <div className="text-5xl font-bold mb-2 text-primary">130+</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Productions</div>
                  </div>
                  <div className="text-center pb-6 border-b border-border/50">
                    <div className="text-5xl font-bold mb-2 text-primary">15+</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">USA 829</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Union Member</div>
                  </div>
                </div>
              </div>

              {/* Professional Affiliations */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">AFFILIATIONS</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-8 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-1">United Scenic Artists</h3>
                    <p className="text-sm text-muted-foreground">Local 829</p>
                    <p className="text-xs text-muted-foreground mt-1">Member, 2023–Present</p>
                  </div>
                  <div className="border-t border-border/50 pt-6">
                    <h3 className="font-semibold mb-1">USITT</h3>
                    <p className="text-sm text-muted-foreground">United States Institute of Theatre Technology</p>
                    <p className="text-xs text-muted-foreground mt-1">Member, 2009–Present</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">CONTACT</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-8 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Email</p>
                    <a href="mailto:info@brandonptdavis.com" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                      info@brandonptdavis.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Location</p>
                    <p className="text-foreground">Southern California</p>
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Website</p>
                    <a href="https://www.brandonptdavis.com" className="text-foreground hover:text-primary transition-colors flex items-center gap-2">
                      brandonptdavis.com
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
