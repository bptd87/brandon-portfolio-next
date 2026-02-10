import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Syllabus3DModeling() {
  return (
    <>
      <Header />
      
      <section className="min-h-screen bg-background pt-20 pb-20">
        <div className="container max-w-4xl">
          
          {/* Hero */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">COURSE SYLLABUS</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">3D Modeling and Rendering</h1>
            <p className="text-xl text-foreground/70 leading-relaxed mb-4">
              THA 211: Vectorworks for Theatrical Design
            </p>
            <div className="text-foreground/60">
              <p><strong>Instructor:</strong> Brandon PT Davis</p>
              <p><strong>Office Hours:</strong> By Appointment</p>
            </div>
          </div>

          {/* Course Materials Link */}
          <div className="mb-8">
            <a href="/studio/tutorials" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
              <span>View Vectorworks Video Tutorials</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          {/* Course Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-4">Course Description</h2>
            <p className="text-foreground/80 leading-relaxed">
              This course serves as an advanced introduction to Computer-Aided Drafting (CAD) and 3D visualization for theatrical design. Moving beyond basic drafting, students will master the workflow of Vectorworks 2024, focusing on 3D modeling, hybrid symbol creation, texturing, lighting, and the generation of industry-standard construction documents (Ground Plans, Sections, and Elevations) directly from the 3D model.
            </p>
          </div>

          {/* Course Objectives */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-4">Course Objectives</h2>
            <p className="text-foreground/80 mb-4">By the end of this course, students will be able to:</p>
            <ol className="list-decimal list-inside space-y-2 text-foreground/80">
              <li><strong>Master the 3D Workflow:</strong> Create complex scenic environments using solid modeling and hybrid objects in Vectorworks.</li>
              <li><strong>Visualize Concepts:</strong> Utilize Twinmotion to create real-time renders and visualizations for client presentations.</li>
              <li><strong>Generate Documentation:</strong> Produce 2D construction drawings (Plans, Sections, Elevations) derived from 3D geometry.</li>
              <li><strong>Manage Data:</strong> Understand proper file organization, classes, layers, and viewport management for professional collaboration.</li>
            </ol>
          </div>

          {/* Required Software */}
          <div className="mb-12">
            <h2 className="text-2xl font-serif mb-4">Required Software & Hardware</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/80">
              <li>Vectorworks 2024 (Educational License)</li>
              <li>Twinmotion (Real-Time Rendering)</li>
              <li>3-Button Mouse (Required for efficient modeling)</li>
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
                      <td className="p-4">Weekly Skill Quizzes</td>
                      <td className="p-4 text-muted-foreground">120</td>
                      <td className="p-4 text-foreground/70">10 Technical quizzes covering tools, palettes, and standards</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Assignment 1-3</td>
                      <td className="p-4 text-muted-foreground">150</td>
                      <td className="p-4 text-foreground/70">Initial setup, 3D primitive worksheets, and Rendering basics</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 1: 3D Object</td>
                      <td className="p-4 text-muted-foreground">100</td>
                      <td className="p-4 text-foreground/70">Modeling a complex prop/object to learn solid addition/subtraction</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 2: Sitcom Set</td>
                      <td className="p-4 text-muted-foreground">200</td>
                      <td className="p-4 text-foreground/70">(Midterm) Modeling a multi-camera realistic interior (walls, doors, windows, furniture) to understand architectural tools</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 3: Conceptual Research</td>
                      <td className="p-4 text-muted-foreground">100</td>
                      <td className="p-4 text-foreground/70">Research and concept development for Wait Until Dark</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 4: Scenic Model</td>
                      <td className="p-4 text-muted-foreground">100</td>
                      <td className="p-4 text-foreground/70">Full 3D Digital Model of the set for Wait Until Dark</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 5: Visualization</td>
                      <td className="p-4 text-muted-foreground">100</td>
                      <td className="p-4 text-foreground/70">Final lit renderings and textures using Renderworks/Twinmotion</td>
                    </tr>
                    <tr className="border-b border-border/50 hover:bg-accent/5 transition-colors">
                      <td className="p-4">Project 6: Drafting Package</td>
                      <td className="p-4 text-muted-foreground">350</td>
                      <td className="p-4 text-foreground/70">(Final) Industry-standard drafting plate including Ground Plan, Front Elevations, and Centerline Section derived from the Project 4 model</td>
                    </tr>
                    <tr className="hover:bg-accent/5 transition-colors">
                      <td className="p-4 font-semibold">Total</td>
                      <td className="p-4 font-semibold">1120</td>
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
                <h3 className="text-xl font-semibold mb-3">Module 1: The Vectorworks Environment</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 1:</strong> UI Setup, Workspaces, and Drafting Standards</li>
                  <li><strong>Week 2:</strong> Introduction to 3D Tools (Extrude, Sweep, Loft)</li>
                  <li><strong>Week 3:</strong> Lab: Complex Modeling Techniques & Solids Modeling</li>
                </ul>
              </div>

              {/* Module 2 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 2: Architectural Modeling (The Sitcom Project)</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 4:</strong> Hybrid Objects (Walls, Doors, Windows)</li>
                  <li><strong>Week 5:</strong> Resource Manager & Symbol Creation</li>
                  <li><strong>Week 6:</strong> Project 2 Due: "My Life" Sitcom Set
                    <br /><span className="text-sm text-muted-foreground ml-4">Focus: Clean geometry and proper layer/class organization</span>
                  </li>
                </ul>
              </div>

              {/* Module 3 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 3: Theatrical Application (Wait Until Dark)</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 7:</strong> Script Analysis & Research for Wait Until Dark</li>
                  <li><strong>Week 8 (Midterm):</strong> Twinmotion Integration
                    <br /><span className="text-sm text-muted-foreground ml-4">Lab: Exporting models to Twinmotion for rapid texture and lighting iteration</span>
                  </li>
                  <li><strong>Week 9:</strong> Project 4: The Digital Model
                    <br /><span className="text-sm text-muted-foreground ml-4">Focus: Modeling specific theatrical elements (stairs, platforms, masking)</span>
                  </li>
                </ul>
              </div>

              {/* Module 4 */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Module 4: Rendering & Documentation</h3>
                <ul className="space-y-2 text-foreground/80">
                  <li><strong>Week 12:</strong> Advanced Texturing & Lighting in Renderworks</li>
                  <li><strong>Week 13:</strong> From 3D to 2D: Generating Viewports and Cutting Sections</li>
                  <li><strong>Week 14:</strong> Dimensioning & Annotation Standards (USITT)</li>
                  <li><strong>Week 15:</strong> Project 6: The Drafting Package
                    <br /><span className="text-sm text-muted-foreground ml-4">Lab: Compiling the Ground Plan, Section, and Elevations into a printable PDF</span>
                  </li>
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
