import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";

export default function Resume() {
  return (
    <>
      <Header />
      
      <section className="min-h-screen bg-background pt-32 pb-20">
        <div className="container">
          {/* About Navigation */}
          <AboutNav />

          {/* Hero */}
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">CURRICULUM VITAE</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6">Professional Experience</h1>
            <p className="text-xl text-foreground/80 max-w-3xl">
              Scenic & Experiential Designer specializing in theatrical production, live events, and immersive environments
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-16">
            {/* Main Content - Left */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              
              {/* Education */}
              <h2 className="text-3xl font-serif mb-8">Education</h2>
              
              <div className="mb-8">
                <h3 className="text-2xl font-serif mb-2">University of California, Irvine</h3>
                <p className="text-lg text-foreground/70 mb-3">MFA in Drama [Scenic Design]</p>
                <p className="text-foreground/90 leading-relaxed text-justify">
                  Thesis production: <em>Company</em> (Scenic Design). Designed five realized productions including <em>American Idiot</em>, <em>Parliament Square</em>, and <em>The Penelopiad</em>. Developed advanced scenic design course for upper-level students.
                </p>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-serif mb-2">Stephens College</h3>
                <p className="text-lg text-foreground/70 mb-3">BFA in Theatre Arts</p>
                <p className="text-foreground/90 leading-relaxed text-justify">
                  Capstone: <em>All My Sons</em> (Scenic Design). Received Apprenticeship Scholarship requiring 20+ weekly hours in scene shop, gaining practical training in construction, painting, and technical support.
                </p>
              </div>

              {/* Professional Experience */}
              <h2 className="text-3xl font-serif mt-16 mb-8">Professional Experience</h2>
              
              <div className="space-y-6 mb-16">
                {/* Brandon PT Davis Design LLC */}
                <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-serif">Brandon PT Davis Design LLC</h3>
                    <span className="text-sm text-muted-foreground font-pixel">2024–PRESENT</span>
                  </div>
                  <p className="text-lg text-foreground/80 mb-2">Scenic & Experiential Designer</p>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Independent design practice specializing in theatrical scenic design and experiential environments
                  </p>
                </div>

                {/* Adaptive Design Services */}
                <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-serif">Adaptive Design Services</h3>
                    <span className="text-sm text-muted-foreground font-pixel">2022–PRESENT</span>
                  </div>
                  <p className="text-lg text-foreground/80 mb-2">Sr. Scenic & Experiential Designer</p>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Senior design role creating immersive environments and experiential activations for brands and events
                  </p>
                </div>

                {/* Academic Appointments */}
                <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-serif">Academic Appointments</h3>
                    <span className="text-sm text-muted-foreground font-pixel">2017–2025</span>
                  </div>
                  <p className="text-lg text-foreground/80 mb-2">Various Institutions</p>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Teaching positions at Stephens College, University of Missouri, and other institutions. Courses include Scenic Design, Digital Design Tools, and Production Design.
                  </p>
                </div>

                {/* Regional Theatre */}
                <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-serif">Regional Theatre Positions</h3>
                    <span className="text-sm text-muted-foreground font-pixel">2012–2017</span>
                  </div>
                  <p className="text-lg text-foreground/80 mb-2">Various Theatres</p>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    Resident and guest scenic designer positions at regional theatres across the United States
                  </p>
                </div>
              </div>

              {/* Recent Productions */}
              <h2 className="text-3xl font-serif mt-16 mb-8">Recent Scenic Design</h2>
              <p className="text-foreground/80 mb-6">Selected productions from 2023-2024</p>
              
              <div className="overflow-x-auto mb-12">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-semibold">Production</th>
                      <th className="text-left py-3 px-2 font-semibold">Director</th>
                      <th className="text-left py-3 px-2 font-semibold">Company</th>
                      <th className="text-left py-3 px-2 font-semibold">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Clue On Stage</td>
                      <td className="py-3 px-2 text-foreground/70">John Hemphill</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Urinetown</td>
                      <td className="py-3 px-2 text-foreground/70">Joy Powell</td>
                      <td className="py-3 px-2 text-foreground/70">University of Missouri</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">The Music Man</td>
                      <td className="py-3 px-2 text-foreground/70">Bernie Monroe</td>
                      <td className="py-3 px-2 text-foreground/70">Okoboji Summer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Barefoot in The Park</td>
                      <td className="py-3 px-2 text-foreground/70">Brett Olson</td>
                      <td className="py-3 px-2 text-foreground/70">Okoboji Summer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Freaky Friday</td>
                      <td className="py-3 px-2 text-foreground/70">Josh Walden</td>
                      <td className="py-3 px-2 text-foreground/70">Okoboji Summer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Baskerville</td>
                      <td className="py-3 px-2 text-foreground/70">Stephen Brotebeck</td>
                      <td className="py-3 px-2 text-foreground/70">Okoboji Summer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">9 to 5</td>
                      <td className="py-3 px-2 text-foreground/70">Brandon Riley</td>
                      <td className="py-3 px-2 text-foreground/70">University of Missouri</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Footloose</td>
                      <td className="py-3 px-2 text-foreground/70">Jamey Grisham</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Boeing, Boeing</td>
                      <td className="py-3 px-2 text-foreground/70">John Hemphill</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Bright Star</td>
                      <td className="py-3 px-2 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-3 px-2 text-foreground/70">Denver School of the Arts</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Christmas Carol</td>
                      <td className="py-3 px-2 text-foreground/70">Courtney Crouse</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">An Enemy of The People</td>
                      <td className="py-3 px-2 text-foreground/70">LR Hults</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Songs For a New World</td>
                      <td className="py-3 px-2 text-foreground/70">Lisa Brescia</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">The Wedding Singer</td>
                      <td className="py-3 px-2 text-foreground/70">Bernie Monroe</td>
                      <td className="py-3 px-2 text-foreground/70">Okoboji Summer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Dial 'M' For Murder</td>
                      <td className="py-3 px-2 text-foreground/70">Fred Rubeck</td>
                      <td className="py-3 px-2 text-foreground/70">Okoboji Summer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Cole</td>
                      <td className="py-3 px-2 text-foreground/70">Alison Morooney</td>
                      <td className="py-3 px-2 text-foreground/70">Okoboji Summer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Head Over Heels</td>
                      <td className="py-3 px-2 text-foreground/70">Josh Walden</td>
                      <td className="py-3 px-2 text-foreground/70">Theatre SilCo</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Curtain Up! Stephens</td>
                      <td className="py-3 px-2 text-foreground/70">Lisa Brescia</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Lotería</td>
                      <td className="py-3 px-2 text-foreground/70">Sara Rodriguez</td>
                      <td className="py-3 px-2 text-foreground/70">Theatre SilCo</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Spelling Bee</td>
                      <td className="py-3 px-2 text-foreground/70">Todd Davidson</td>
                      <td className="py-3 px-2 text-foreground/70">Stephens College</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-foreground/60 italic mb-12">
                Over 130 realized productions since 2009. Complete production history available upon request.
              </p>

              {/* Assistant Scenic Design */}
              <h2 className="text-3xl font-serif mt-16 mb-8">Assistant Scenic Design</h2>
              <p className="text-foreground/80 mb-6">Selected assisting credits working with established designers</p>
              
              <div className="overflow-x-auto mb-12">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-semibold">Production</th>
                      <th className="text-left py-3 px-2 font-semibold">Director</th>
                      <th className="text-left py-3 px-2 font-semibold">Company</th>
                      <th className="text-left py-3 px-2 font-semibold">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">The Play that Goes Wrong</td>
                      <td className="py-3 px-2 text-foreground/70">Tom Buderwitz</td>
                      <td className="py-3 px-2 text-foreground/70">Seattle Rep</td>
                      <td className="py-3 px-2 text-foreground/70">2025</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">The Importance of Being Earnest</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Utah Shakespeare Festival</td>
                      <td className="py-3 px-2 text-foreground/70">2025</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">A Gentlemen's Guide to Love and Murder</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Utah Shakespeare Festival</td>
                      <td className="py-3 px-2 text-foreground/70">2025</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Steel Magnolias</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Utah Shakespeare Festival</td>
                      <td className="py-3 px-2 text-foreground/70">2025</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">The Book Club Play</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Cincinnati Playhouse in the Park</td>
                      <td className="py-3 px-2 text-foreground/70">2025</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Souvenir</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Pioneer Theatre</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Ragtime</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">The Ruth: Hale Orem</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Natasha, Pierre, and the Great Comet of 1812</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Pioneer Theatre Company</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Jersey Boys</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Pioneer Theatre Company</td>
                      <td className="py-3 px-2 text-foreground/70">2024</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-2">Matilda</td>
                      <td className="py-3 px-2 text-foreground/70">Jo Winiarski</td>
                      <td className="py-3 px-2 text-foreground/70">Pioneer Theatre Company</td>
                      <td className="py-3 px-2 text-foreground/70">2023</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Technical Proficiencies */}
              <h2 className="text-3xl font-serif mt-16 mb-8">Technical Proficiencies</h2>
              
              <div className="space-y-6 mb-12">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Design & Fabrication</h3>
                  <p className="text-foreground/80 text-justify">
                    Computer Drafting, Digital Rendering, Graphic Design, Hand Drafting, Model Making, 3D Printing, Laser Cutting, Scenic Construction, Foam Construction, Scenic Painting, MIG Welding, PC Build
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3D Modeling</h3>
                  <p className="text-foreground/80">
                    Vectorworks, Trimble SketchUp, Cinema 4D
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Graphics & Design</h3>
                  <p className="text-foreground/80">
                    Photoshop, Illustrator, InDesign, Vectorworks, Filter Forge, Procreate
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Real-Time Rendering</h3>
                  <p className="text-foreground/80">
                    Twinmotion, Enscape, Unreal Engine (basic)
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Tools</h3>
                  <p className="text-foreground/80">
                    MidJourney, Adobe Firefly, Runway, Sora
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Video & Media</h3>
                  <p className="text-foreground/80">
                    Adobe Premiere, After Effects, Resolume, Camtasia
                  </p>
                </div>
              </div>

              <div className="mt-16 p-8 bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl text-center">
                <p className="text-foreground/80 mb-4">
                  Complete production history and references available upon request
                </p>
                <a 
                  href="mailto:contact@brandonptdavis.com" 
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
                >
                  Request Full CV
                </a>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="space-y-12 lg:sticky lg:top-24 lg:self-start">
              
              {/* Key Stats */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">KEY STATS</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-8 space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">130+</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Productions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">15+</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">USA 829</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Union Member</div>
                  </div>
                </div>
              </div>

              {/* Professional Affiliations */}
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">AFFILIATIONS</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-8 space-y-6">
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
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-pixel">CONTACT</p>
                <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-8 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <a href="mailto:contact@brandonptdavis.com" className="text-foreground hover:text-primary transition-colors">
                      contact@brandonptdavis.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground">Southern California</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Website</p>
                    <a href="https://www.brandonptdavis.com" className="text-foreground hover:text-primary transition-colors">
                      brandonptdavis.com
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
