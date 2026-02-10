import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Resume() {
  return (
    <>
      <Header />
      <AboutNav />
      
      <section className="min-h-screen bg-background pt-20 pb-20">
        <div className="container max-w-6xl">


          {/* Hero */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">RESUME / CV</p>
            <div className="flex items-end justify-between gap-8 flex-wrap">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">Production History</h1>
                <p className="text-xl text-foreground/70 max-w-3xl leading-relaxed">
                  Over 130 realized productions since 2009 across scenic design and assistant scenic design roles.
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <Button size="lg" className="gap-2" asChild>
                  <a href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/KZOFqPARnjQauvWm.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5" />
                    Resume
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <a href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/mSMkRDmbSOQtUykO.pdf" target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5" />
                    CV
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Scenic Design Table */}
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">SCENIC DESIGN</h2>
            
            <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-card/20">
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Year</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Production</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Director</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">The Glass Menagerie</td>
                      <td className="py-4 px-6 text-foreground/70">Kimberly Braun</td>
                      <td className="py-4 px-6 text-foreground/70">Maples Repertory Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Million Dollar Quartet</td>
                      <td className="py-4 px-6 text-foreground/70">James Moye</td>
                      <td className="py-4 px-6 text-foreground/70">South Coast Repertory Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">How to Succeed in Business</td>
                      <td className="py-4 px-6 text-foreground/70">Bernie Monroe</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Deathtrap</td>
                      <td className="py-4 px-6 text-foreground/70">Fred Rubeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Bell, Book, and Candle</td>
                      <td className="py-4 px-6 text-foreground/70">Richard Biever</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">All's Well That Ends Well</td>
                      <td className="py-4 px-6 text-foreground/70">Rob Salas</td>
                      <td className="py-4 px-6 text-foreground/70">New Swan Theatre Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Much Ado About Nothing</td>
                      <td className="py-4 px-6 text-foreground/70">Eli Simon</td>
                      <td className="py-4 px-6 text-foreground/70">New Swan Theatre Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Less Miserable</td>
                      <td className="py-4 px-6 text-foreground/70">John Keating</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Romero</td>
                      <td className="py-4 px-6 text-foreground/70">David Crespy</td>
                      <td className="py-4 px-6 text-foreground/70">University of Missouri</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Shut Up, Sherlock!</td>
                      <td className="py-4 px-6 text-foreground/70">Eric Hoit</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Guys on Ice</td>
                      <td className="py-4 px-6 text-foreground/70">Dan Kalrer</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Clue On Stage</td>
                      <td className="py-4 px-6 text-foreground/70">John Hemphill</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Urinetown</td>
                      <td className="py-4 px-6 text-foreground/70">Joy Powell</td>
                      <td className="py-4 px-6 text-foreground/70">University of Missouri</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">The Music Man</td>
                      <td className="py-4 px-6 text-foreground/70">Bernie Monroe</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Barefoot in The Park</td>
                      <td className="py-4 px-6 text-foreground/70">Brett Olson</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Freaky Friday</td>
                      <td className="py-4 px-6 text-foreground/70">Josh Walden</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Baskerville: A Sherlock Holmes Mystery</td>
                      <td className="py-4 px-6 text-foreground/70">Stephen Brotebeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">9 to 5</td>
                      <td className="py-4 px-6 text-foreground/70">Brandon Riley</td>
                      <td className="py-4 px-6 text-foreground/70">University of Missouri</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Footloose</td>
                      <td className="py-4 px-6 text-foreground/70">Jamey Grisham</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Boeing, Boeing</td>
                      <td className="py-4 px-6 text-foreground/70">John Hemphill</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Bright Star</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Denver School of the Arts</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Christmas Carol</td>
                      <td className="py-4 px-6 text-foreground/70">Courtney Crouse</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">An Enemy of The People</td>
                      <td className="py-4 px-6 text-foreground/70">LR Hults</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Songs For a New World</td>
                      <td className="py-4 px-6 text-foreground/70">Lisa Brescia</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">The Wedding Singer</td>
                      <td className="py-4 px-6 text-foreground/70">Bernie Monroe</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Dial "M" For Murder</td>
                      <td className="py-4 px-6 text-foreground/70">Fred Rubeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Cole</td>
                      <td className="py-4 px-6 text-foreground/70">Alison Morooney</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Head Over Heels</td>
                      <td className="py-4 px-6 text-foreground/70">Josh Walden</td>
                      <td className="py-4 px-6 text-foreground/70">Theatre SilCo</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Curtain Up! Stephens</td>
                      <td className="py-4 px-6 text-foreground/70">Lisa Brescia</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Lotería</td>
                      <td className="py-4 px-6 text-foreground/70">Sara Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Theatre SilCo</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Spelling Bee</td>
                      <td className="py-4 px-6 text-foreground/70">Todd Davidson</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Merry Wives of Windsor</td>
                      <td className="py-4 px-6 text-foreground/70">Jamey Grisham</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">White Christmas</td>
                      <td className="py-4 px-6 text-foreground/70">Lisa Brescia</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Our Town</td>
                      <td className="py-4 px-6 text-foreground/70">Elizabeth Palmieri</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Legally Blonde</td>
                      <td className="py-4 px-6 text-foreground/70">Amy Fritsche</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Bright Star</td>
                      <td className="py-4 px-6 text-foreground/70">Lauren Haughton</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">An Inspector Calls</td>
                      <td className="py-4 px-6 text-foreground/70">Stephen Brotebeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Man Of La Mancha</td>
                      <td className="py-4 px-6 text-foreground/70">Chris Allerman</td>
                      <td className="py-4 px-6 text-foreground/70">Lake Dillon Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">A Funny Thing Happened…</td>
                      <td className="py-4 px-6 text-foreground/70">Melissa Livingston</td>
                      <td className="py-4 px-6 text-foreground/70">Lake Dillon Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Curtain Up! Stephens</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens Faculty</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Tomas and the Library Lady</td>
                      <td className="py-4 px-6 text-foreground/70">Sara Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Lake Dillon Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">A Chorus Line</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Denver School of the Arts</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">The Book of Everything</td>
                      <td className="py-4 px-6 text-foreground/70">Allison Watrous</td>
                      <td className="py-4 px-6 text-foreground/70">Denver School of the Arts</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">The Bald Soprano</td>
                      <td className="py-4 px-6 text-foreground/70">Brett Olson</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2021</td>
                      <td className="py-4 px-6 font-medium">A Smalltowne Christmas</td>
                      <td className="py-4 px-6 text-foreground/70">Richard Stafford</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2021</td>
                      <td className="py-4 px-6 font-medium">Urinetown</td>
                      <td className="py-4 px-6 text-foreground/70">Paul Finocchiaro</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2021</td>
                      <td className="py-4 px-6 font-medium">The Marvelous Wonderettes: Dream On</td>
                      <td className="py-4 px-6 text-foreground/70">Lauren Haughton</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2021</td>
                      <td className="py-4 px-6 font-medium">Clue On Stage</td>
                      <td className="py-4 px-6 text-foreground/70">Stephen Brotebeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2021</td>
                      <td className="py-4 px-6 font-medium">Lysistrata</td>
                      <td className="py-4 px-6 text-foreground/70">Jay Stratton</td>
                      <td className="py-4 px-6 text-foreground/70">University of Texas El Paso</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2020</td>
                      <td className="py-4 px-6 font-medium">A Shayna Maidel</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Western Washington University</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2020</td>
                      <td className="py-4 px-6 font-medium">The Wolves</td>
                      <td className="py-4 px-6 text-foreground/70">Allison Watrous</td>
                      <td className="py-4 px-6 text-foreground/70">Denver School of the Arts</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2020</td>
                      <td className="py-4 px-6 font-medium">Peter and the Starcatcher</td>
                      <td className="py-4 px-6 text-foreground/70">Andre Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Denver School of the Arts</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2020</td>
                      <td className="py-4 px-6 font-medium">DSA REP</td>
                      <td className="py-4 px-6 text-foreground/70">Various</td>
                      <td className="py-4 px-6 text-foreground/70">Denver School of the Arts</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2020</td>
                      <td className="py-4 px-6 font-medium">The Penelopiad</td>
                      <td className="py-4 px-6 text-foreground/70">Sara Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">University of California Irvine</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">Company</td>
                      <td className="py-4 px-6 text-foreground/70">Eli Simon</td>
                      <td className="py-4 px-6 text-foreground/70">University of California Irvine</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">Mamma Mia</td>
                      <td className="py-4 px-6 text-foreground/70">Jennifer Hemphill</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">Spitfire Grill</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Western Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">Mamma Mia</td>
                      <td className="py-4 px-6 text-foreground/70">Robin Levine</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">Living on Love</td>
                      <td className="py-4 px-6 text-foreground/70">Fred Rubeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">Happily, Ever After</td>
                      <td className="py-4 px-6 text-foreground/70">Courtney Crouse</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">An American Daughter</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Western Washington University</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">The Pajama Game</td>
                      <td className="py-4 px-6 text-foreground/70">Don Hill</td>
                      <td className="py-4 px-6 text-foreground/70">University of California Irvine</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2019</td>
                      <td className="py-4 px-6 font-medium">Parliament Square</td>
                      <td className="py-4 px-6 text-foreground/70">Jane Page</td>
                      <td className="py-4 px-6 text-foreground/70">University of California Irvine</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">Scary Poppins</td>
                      <td className="py-4 px-6 text-foreground/70">Eric Hoit</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">The Glass Menagerie</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Western Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">Young Frankenstein</td>
                      <td className="py-4 px-6 text-foreground/70">Deb Currier</td>
                      <td className="py-4 px-6 text-foreground/70">Western Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">Thoroughly Modern Millie</td>
                      <td className="py-4 px-6 text-foreground/70">Paul Finocchiaro</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">Over the River, and through the woods</td>
                      <td className="py-4 px-6 text-foreground/70">Fred Rubeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">Not Now, Darling</td>
                      <td className="py-4 px-6 text-foreground/70">Fred Rubeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">American Idiot</td>
                      <td className="py-4 px-6 text-foreground/70">Andrew Palermo</td>
                      <td className="py-4 px-6 text-foreground/70">University of California Irvine</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">Angel Food Cake</td>
                      <td className="py-4 px-6 text-foreground/70">Evan Mueller</td>
                      <td className="py-4 px-6 text-foreground/70">Western Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">I Love you, You're Perfect, Now Change</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Western Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">The Tavern</td>
                      <td className="py-4 px-6 text-foreground/70">Suzy Newman</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">The Karaoke Kid</td>
                      <td className="py-4 px-6 text-foreground/70">Dan Schultz</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">A Connecticut Yankee in King Arthur's Court</td>
                      <td className="py-4 px-6 text-foreground/70">Chuck McLane</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">Tarzan</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Westminster High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">When Butter Churns Gold</td>
                      <td className="py-4 px-6 text-foreground/70">Michael Jenkinson</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">The Foreigner</td>
                      <td className="py-4 px-6 text-foreground/70">Dan Schultz</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">Holiday Extravaganza</td>
                      <td className="py-4 px-6 text-foreground/70">Suzy Newman</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2017</td>
                      <td className="py-4 px-6 font-medium">Peter and the Starcatcher</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Westminster High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">Reckless</td>
                      <td className="py-4 px-6 text-foreground/70">Jace Smykil</td>
                      <td className="py-4 px-6 text-foreground/70">Lakewood High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">Trudy and the Beast</td>
                      <td className="py-4 px-6 text-foreground/70">Eric Hoit</td>
                      <td className="py-4 px-6 text-foreground/70">The Great American Melodrama</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">An American Daughter</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">Nunsense</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Western Washington University</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">Cinderella</td>
                      <td className="py-4 px-6 text-foreground/70">Liz Piccoli</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">A Murder Is Announced</td>
                      <td className="py-4 px-6 text-foreground/70">Karl Kippola</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">The Spitfire Grill</td>
                      <td className="py-4 px-6 text-foreground/70">Stephen Brotebeck</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">Spelling Bee</td>
                      <td className="py-4 px-6 text-foreground/70">Sarah Hairston</td>
                      <td className="py-4 px-6 text-foreground/70">Battle High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2016</td>
                      <td className="py-4 px-6 font-medium">Vanya, Sonia, Masha, and Spike</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Urinetown</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Western Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Smoke on The Mountain</td>
                      <td className="py-4 px-6 text-foreground/70">Michael Bollinger</td>
                      <td className="py-4 px-6 text-foreground/70">West Virginia Public Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Footloose</td>
                      <td className="py-4 px-6 text-foreground/70">Stephen Casey</td>
                      <td className="py-4 px-6 text-foreground/70">West Virginia Public Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">A Grand Night for Singing</td>
                      <td className="py-4 px-6 text-foreground/70">James Zager</td>
                      <td className="py-4 px-6 text-foreground/70">West Virginia Public Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Barefoot in The Park</td>
                      <td className="py-4 px-6 text-foreground/70">Kymberly Mellen</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Last Train to Nibroc</td>
                      <td className="py-4 px-6 text-foreground/70">Janice Goldberg</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">On Thin Ice</td>
                      <td className="py-4 px-6 text-foreground/70">Dan Schultz</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Rent</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Westminster High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Hello, Dolly</td>
                      <td className="py-4 px-6 text-foreground/70">Tami LoSasso</td>
                      <td className="py-4 px-6 text-foreground/70">Lakewood High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Avenue Q</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Westminster High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2015</td>
                      <td className="py-4 px-6 font-medium">Cinderella</td>
                      <td className="py-4 px-6 text-foreground/70">Jazz Rucker</td>
                      <td className="py-4 px-6 text-foreground/70">Battle High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2014</td>
                      <td className="py-4 px-6 font-medium">Little Shop of Horrors</td>
                      <td className="py-4 px-6 text-foreground/70">Terry Berliner</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2014</td>
                      <td className="py-4 px-6 font-medium">The Complete Works of Shakespeare</td>
                      <td className="py-4 px-6 text-foreground/70">David Davalos</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2014</td>
                      <td className="py-4 px-6 font-medium">Rich Girl</td>
                      <td className="py-4 px-6 text-foreground/70">Rich Cole</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2014</td>
                      <td className="py-4 px-6 font-medium">Little Shop of Horrors</td>
                      <td className="py-4 px-6 text-foreground/70">Jazz Rucker</td>
                      <td className="py-4 px-6 text-foreground/70">Battle High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2014</td>
                      <td className="py-4 px-6 font-medium">Angel Street</td>
                      <td className="py-4 px-6 text-foreground/70">Rich Cole</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2013</td>
                      <td className="py-4 px-6 font-medium">Bingo: The Winning Musical</td>
                      <td className="py-4 px-6 text-foreground/70">Tricia Brouke</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2013</td>
                      <td className="py-4 px-6 font-medium">Don't Dress for Dinner</td>
                      <td className="py-4 px-6 text-foreground/70">Dan Schultz</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2013</td>
                      <td className="py-4 px-6 font-medium">Les Miserable</td>
                      <td className="py-4 px-6 text-foreground/70">Tami LoSasso</td>
                      <td className="py-4 px-6 text-foreground/70">Lakewood High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2013</td>
                      <td className="py-4 px-6 font-medium">Almost, Maine</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Westminster High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2013</td>
                      <td className="py-4 px-6 font-medium">Chicago</td>
                      <td className="py-4 px-6 text-foreground/70">Millie Garvey</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2012</td>
                      <td className="py-4 px-6 font-medium">The Liar</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2012</td>
                      <td className="py-4 px-6 font-medium">Crimes of The Heart</td>
                      <td className="py-4 px-6 text-foreground/70">Jana Robbins</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2012</td>
                      <td className="py-4 px-6 font-medium">Xanadu</td>
                      <td className="py-4 px-6 text-foreground/70">Andre' Rodriguez</td>
                      <td className="py-4 px-6 text-foreground/70">Pomona High School</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2012</td>
                      <td className="py-4 px-6 font-medium">The Giver</td>
                      <td className="py-4 px-6 text-foreground/70">Ken Hailey</td>
                      <td className="py-4 px-6 text-foreground/70">Kentucky Repertory Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2012</td>
                      <td className="py-4 px-6 font-medium">The Glass Menagerie</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2012</td>
                      <td className="py-4 px-6 font-medium">Steel Magnolias</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2011</td>
                      <td className="py-4 px-6 font-medium">Thoroughly Modern Millie</td>
                      <td className="py-4 px-6 text-foreground/70">Millie Garvey</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2011</td>
                      <td className="py-4 px-6 font-medium">All My Sons</td>
                      <td className="py-4 px-6 text-foreground/70">Lamby Hedge</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2011</td>
                      <td className="py-4 px-6 font-medium">The Effect of Gamma Rays</td>
                      <td className="py-4 px-6 text-foreground/70">Beth Leonard</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2010</td>
                      <td className="py-4 px-6 font-medium">Playhouse Creatures</td>
                      <td className="py-4 px-6 text-foreground/70">Becca Kravitz</td>
                      <td className="py-4 px-6 text-foreground/70">Warehouse Theatre Company</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2010</td>
                      <td className="py-4 px-6 font-medium">Greensleeves Magic</td>
                      <td className="py-4 px-6 text-foreground/70">Shana Prentice</td>
                      <td className="py-4 px-6 text-foreground/70">Okoboji Summer Theatre</td>
                    </tr>
                    <tr className="hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2009</td>
                      <td className="py-4 px-6 font-medium">The Verge</td>
                      <td className="py-4 px-6 text-foreground/70">Cheryl Black</td>
                      <td className="py-4 px-6 text-foreground/70">University of Missouri</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Assistant Scenic Design Table */}
          <div className="mb-20">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">ASSISTANT SCENIC DESIGN</h2>
            
            <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-card/20">
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Year</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Production</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Scenic Designer</th>
                      <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wide">Company</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">The Play that Goes Wrong</td>
                      <td className="py-4 px-6 text-foreground/70">Tom Buderwitz</td>
                      <td className="py-4 px-6 text-foreground/70">Seattle Rep</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">The Importance of Being Earnest</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">A Gentlemen's Guide to Love and Murder</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">Steel Magnolias</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2025</td>
                      <td className="py-4 px-6 font-medium">The Book Club Play</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Cincinnati Playhouse in the Park</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Souvenir</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Pioneer Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Ragtime</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">The Ruth: Hale Orem</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Natasha, Pierre, and the Great Comet of 1812</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Pioneer Theatre Company</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Jersey Boys</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Pioneer Theatre Company</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">Silent Sky</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2024</td>
                      <td className="py-4 px-6 font-medium">The Mountain Top</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Native Gardens</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Pioneer Theatre Company</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Bottle Shock</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">California Center for the Arts, Escondido</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">Romeo and Juliette</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">A Midsummer Night Dream</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2023</td>
                      <td className="py-4 px-6 font-medium">The Fears</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Off Broadway: Signature Theatre</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">A Distinct Society</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Pioneer Theatre/ Theatre Works Silicon Valley</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Clue: On Stage</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Dallas Theatre Center</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Clue: On Stage</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">The Sound of Music</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2022</td>
                      <td className="py-4 px-6 font-medium">Trouble in Mind</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2021</td>
                      <td className="py-4 px-6 font-medium">Ragtime</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2021</td>
                      <td className="py-4 px-6 font-medium">The Pirates of Penzance</td>
                      <td className="py-4 px-6 text-foreground/70">Jo Winiarski</td>
                      <td className="py-4 px-6 text-foreground/70">Utah Shakespeare Festival</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2018</td>
                      <td className="py-4 px-6 font-medium">Your Ocean, My Ocean</td>
                      <td className="py-4 px-6 text-foreground/70">Dipu Gupta</td>
                      <td className="py-4 px-6 text-foreground/70">John Crawford (Producer)</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2014</td>
                      <td className="py-4 px-6 font-medium">Mrs. Packard</td>
                      <td className="py-4 px-6 text-foreground/70">Travis Deck</td>
                      <td className="py-4 px-6 text-foreground/70">University of California Irvine</td>
                    </tr>
                    <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2010</td>
                      <td className="py-4 px-6 font-medium">The King and I</td>
                      <td className="py-4 px-6 text-foreground/70">Ryan J Zirngibl</td>
                      <td className="py-4 px-6 text-foreground/70">Arrow Rock Lyceum Theatre</td>
                    </tr>
                    <tr className="hover:bg-card/20 transition-colors">
                      <td className="py-4 px-6 text-foreground/70">2009</td>
                      <td className="py-4 px-6 font-medium">H.M.S. Pinafore</td>
                      <td className="py-4 px-6 text-foreground/70">Ryan J Zirngibl</td>
                      <td className="py-4 px-6 text-foreground/70">Stephens College</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
