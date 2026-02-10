import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SyllabusExperiential() {
  return (
    <>
      <Header />
      
      <section className="min-h-screen bg-background pt-20 pb-20">
        <div className="container max-w-4xl">
          
          {/* Hero */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">COURSE SYLLABUS</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">Experiential Design</h1>
            <p className="text-xl text-foreground/70 leading-relaxed">
              Bridging theatrical design skills with commercial design for theme parks, restaurants, museums, and immersive experiences.
            </p>
          </div>

          {/* Course Materials Link */}
          <div className="mb-8">
            <a href="/articles?category=themed-entertainment" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
              <span>View Course Materials & Articles</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          {/* Course Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-4">Course Description</h2>
            <p className="text-foreground/80 leading-relaxed">
              Using theatre design skills, this course bridges the world of commercial design—such as theme parks, restaurants, interactive kiosks, museums, film/television, and industrial shows—that are all centered around telling a story or selling a concept. This course challenges the theatrical designer to embrace the unique constraints of commercial work, including integration, longevity, and audience engagement.
            </p>
          </div>

          {/* Course Objectives */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-4">Course Objectives</h2>
            <p className="text-foreground/80 mb-4">By the end of this course, students will be able to:</p>
            <ol className="list-decimal list-inside space-y-2 text-foreground/80">
              <li>Work collaboratively to develop and communicate design concepts for non-traditional venues.</li>
              <li>Analyze client needs and define the narrative within a commercial design process.</li>
              <li>Utilize digital tools (SketchUp, Twinmotion, Photoshop) to visualize complex environments.</li>
              <li>Understand the production pipeline for themed entertainment and immersive experiences.</li>
            </ol>
          </div>

          {/* Required Software */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-4">Required Software & Materials</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Vectorworks / SketchUp (3D Modeling)</li>
              <li>Twinmotion (Real-Time Rendering)</li>
              <li>Adobe Creative Cloud (Photoshop, InDesign)</li>
            </ul>
          </div>

          {/* Evaluation Table */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-6">Evaluation & Projects</h2>
            <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Assignment</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Points</th>
                      <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Guest Presenter Evals</td>
                      <td className="p-4 text-muted-foreground">200</td>
                      <td className="p-4 text-foreground/70">Written responses to industry guest lectures (4 total)</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 1: Theme Park R&D</td>
                      <td className="p-4 text-muted-foreground">50</td>
                      <td className="p-4 text-foreground/70">Initial research and concept development for a park zone</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 2: Themed Maze</td>
                      <td className="p-4 text-muted-foreground">300</td>
                      <td className="p-4 text-foreground/70">(Midterm) Full design package for a walk-through attraction, including floor plans and guest flow analysis</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 3: Mascot Design</td>
                      <td className="p-4 text-muted-foreground">100</td>
                      <td className="p-4 text-foreground/70">Character design and branding integration</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 4: Arena Remodel</td>
                      <td className="p-4 text-muted-foreground">100</td>
                      <td className="p-4 text-foreground/70">Renovation concept for a sports/entertainment venue</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 5: Restaurant</td>
                      <td className="p-4 text-muted-foreground">550</td>
                      <td className="p-4 text-foreground/70">(Final) A comprehensive semester-long collaboration project. Includes Preliminary Treatment (100), Design Updates (150), and Final Pitch (200)</td>
                    </tr>
                    <tr className="hover:bg-accent/5 transition-colors">
                      <td className="p-4 font-semibold">Total</td>
                      <td className="p-4 font-semibold">1300</td>
                      <td className="p-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-6">Weekly Schedule</h2>
            
            <div className="space-y-8">
              {/* Module 1 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 1: Foundations of Immersive Design</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 1:</strong> Introduction to Themed Entertainment & History of the Industry</li>
                  <li><strong>Week 2:</strong> Concept Development & "Blue Sky" Ideation</li>
                  <li><strong>Week 3:</strong> Presentation Techniques for Commercial Clients
                    <br /><span className="text-sm text-muted-foreground ml-4">Guest Speaker: Jess Coil (Industry Professional)</span>
                  </li>
                </ul>
              </div>

              {/* Module 2 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 2: Spatial Design & Visualization</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 4:</strong> SketchUp & 3D Modeling Review
                    <br /><span className="text-sm text-muted-foreground ml-4">Project 2 Launch: Themed Maze Design</span>
                    <br /><span className="text-sm text-muted-foreground ml-4">Guest Speaker: Tyler Scrivner</span>
                  </li>
                  <li><strong>Week 5:</strong> Twinmotion Workshop. Real-time rendering workflows for client presentations</li>
                  <li><strong>Week 6:</strong> Lighting & Sound Integration for Immersive Environments
                    <br /><span className="text-sm text-muted-foreground ml-4">Guest Speaker: Garrett Gagnon / Eb Madry</span>
                  </li>
                </ul>
              </div>

              {/* Module 3 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 3: Character & Brand Integration</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 7:</strong> Character & Costume Design in Commercial Spaces
                    <br /><span className="text-sm text-muted-foreground ml-4">Adobe Photoshop Rendering Workshop</span>
                  </li>
                  <li><strong>Week 8 (Midterm):</strong> Project 3: Mascot Design & Branding
                    <br /><span className="text-sm text-muted-foreground ml-4">Midterm Critiques</span>
                  </li>
                </ul>
              </div>

              {/* Module 4 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 4: Large Scale Environments</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 9:</strong> Project 4: Basketball Arena Remodel. Understanding scale, crowd flow, and sightlines</li>
                  <li><strong>Week 10:</strong> Critique & Feedback on Arena Concepts</li>
                </ul>
              </div>

              {/* Module 5 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 5: The Capstone Collaboration (Themed Restaurant)</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 12:</strong> Project Launch: Concept & Menu Narrative</li>
                  <li><strong>Week 13:</strong> Pitch 1: Initial Design & Scope (Simulated Client Meeting)</li>
                  <li><strong>Week 14:</strong> Design Development (Drafting & 3D Modeling)</li>
                  <li><strong>Week 15:</strong> Pitch 2: Preliminary Design Review</li>
                  <li><strong>Week 16:</strong> Final Design Presentation. Full design deck, renders, and walkthroughs</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
