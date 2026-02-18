import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Resume() {
  return (
    <>
      <SEO
        title="Resume & CV | Scenic Designer | 130+ Productions | USA 829"
        description="130+ scenic design productions since 2009. MFA UC Irvine, BFA Stephens College. USA 829 Member. Broadway World Award Winner. California-based designer."
        keywords="scenic designer resume, theatrical designer cv, USA 829 member, scenic design portfolio, Brandon PT Davis production history, regional theatre designer, summer stock designer, California scenic designer, MFA UC Irvine"
        url="https://www.brandonptdavis.com/resume"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic and Experiential Designer",
          url: "https://www.brandonptdavis.com",
          description: "Professional scenic designer with over 130 realized productions across regional theatre, summer stock, and academic theatre. USA 829 Member since 2023. Broadway World Award Winner 2026.",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US"
          },
          alumniOf: [
            {
              name: "University of California, Irvine",
              url: "https://www.uci.edu"
            },
            {
              name: "Stephens College",
              url: "https://www.stephens.edu"
            }
          ],
          awards: [
            "Broadway World Award 2026 - Best Scenic Design of a Musical (South Coast Repertory)",
            "USA 829 Membership 2023"
          ],
          knowsAbout: [
            "Scenic Design",
            "Experiential Design",
            "Regional Theatre Design",
            "Summer Stock Theatre",
            "Academic Theatre",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Scale Model Fabrication",
            "Digital Rendering",
            "Production Design",
            "Set Design"
          ]
        }}
      />
      <Header />
      <AboutNav />
      
      <section className="min-h-screen bg-background pt-20 pb-20">
        <div className="container max-w-6xl">


          {/* Hero */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">RESUME / CV</p>
            <div className="flex items-end justify-between gap-8 flex-wrap">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">Scenic Design Production History</h1>
                <p className="text-xl text-foreground/70 max-w-3xl leading-relaxed">
                  Over 130 realized productions in scenic design since 2009.
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

          {/* Scenic Design */}
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-12 font-semibold">SELECTED SCENIC DESIGN</h2>
            
            <div className="space-y-12">
              {/* 2025 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2025</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">The Glass Menagerie</span> | dir. Kimberly Braun | Maples Repertory Theatre</p>
                  <p><span className="font-semibold italic">Million Dollar Quartet</span> | dir. James Moye | South Coast Repertory Theatre</p>
                  <p><span className="font-semibold italic">How to Succeed in Business</span> | dir. Bernie Monroe | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Deathtrap</span> | dir. Fred Rubeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Bell, Book, and Candle</span> | dir. Richard Biever | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">All's Well That Ends Well</span> | dir. Rob Salas | New Swan Theatre Festival</p>
                  <p><span className="font-semibold italic">Much Ado About Nothing</span> | dir. Eli Simon | New Swan Theatre Festival</p>
                  <p><span className="font-semibold italic">Less Miserable</span> | dir. John Keating | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">Romero</span> | dir. David Crespy | University of Missouri</p>
                  <p><span className="font-semibold italic">Shut Up, Sherlock!</span> | dir. Eric Hoit | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">Guys on Ice</span> | dir. Dan Kalrer | The Great American Melodrama</p>
                </div>
              </div>

              {/* 2024 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2024</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">Clue On Stage</span> | dir. John Hemphill | Stephens College</p>
                  <p><span className="font-semibold italic">Urinetown</span> | dir. Joy Powell | University of Missouri</p>
                  <p><span className="font-semibold italic">The Music Man</span> | dir. Bernie Monroe | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Barefoot in The Park</span> | dir. Brett Olson | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Freaky Friday</span> | dir. Josh Walden | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Baskerville: A Sherlock Holmes Mystery</span> | dir. Stephen Brotebeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">9 to 5</span> | dir. Brandon Riley | University of Missouri</p>
                  <p><span className="font-semibold italic">Footloose</span> | dir. Jamey Grisham | Stephens College</p>
                  <p><span className="font-semibold italic">Boeing, Boeing</span> | dir. John Hemphill | Stephens College</p>
                  <p><span className="font-semibold italic">Bright Star</span> | dir. Andre' Rodriguez | Denver School of the Arts</p>
                </div>
              </div>

              {/* 2023 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2023</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">Christmas Carol</span> | dir. Courtney Crouse | Stephens College</p>
                  <p><span className="font-semibold italic">An Enemy of The People</span> | dir. LR Hults | Stephens College</p>
                  <p><span className="font-semibold italic">Songs For a New World</span> | dir. Lisa Brescia | Stephens College</p>
                  <p><span className="font-semibold italic">The Wedding Singer</span> | dir. Bernie Monroe | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Dial "M" For Murder</span> | dir. Fred Rubeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Cole</span> | dir. Alison Morooney | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Head Over Heels</span> | dir. Josh Walden | Theatre SilCo</p>
                  <p><span className="font-semibold italic">Curtain Up! Stephens</span> | dir. Lisa Brescia | Stephens College</p>
                  <p><span className="font-semibold italic">Loteria</span> | dir. Sara Rodriguez | Theatre SilCo</p>
                  <p><span className="font-semibold italic">Spelling Bee</span> | dir. Todd Davidson | Stephens College</p>
                  <p><span className="font-semibold italic">Merry Wives of Windsor</span> | dir. Jamey Grisham | Stephens College</p>
                </div>
              </div>

              {/* 2022 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2022</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">White Christmas</span> | dir. Lisa Brescia | Stephens College</p>
                  <p><span className="font-semibold italic">Our Town</span> | dir. Elizabeth Palmieri | Stephens College</p>
                  <p><span className="font-semibold italic">Legally Blonde</span> | dir. Amy Fritsche | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Bright Star</span> | dir. Lauren Haughton | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">An Inspector Calls</span> | dir. Stephen Brotebeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Man Of La Mancha</span> | dir. Chris Allerman | Lake Dillon Theatre</p>
                  <p><span className="font-semibold italic">A Funny Thing Happened…</span> | dir. Melissa Livingston | Lake Dillon Theatre</p>
                  <p><span className="font-semibold italic">Curtain Up! Stephens</span> | dir. Stephens Faculty | Stephens College</p>
                  <p><span className="font-semibold italic">Tomas and the Library Lady</span> | dir. Sara Rodriguez | Lake Dillon Theatre</p>
                  <p><span className="font-semibold italic">A Chorus Line</span> | dir. Andre' Rodriguez | Denver School of the Arts</p>
                  <p><span className="font-semibold italic">The Book of Everything</span> | dir. Allison Watrous | Denver School of the Arts</p>
                  <p><span className="font-semibold italic">The Bald Soprano</span> | dir. Brett Olson | Stephens College</p>
                </div>
              </div>

              {/* 2021 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2021</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">A Smalltowne Christmas</span> | dir. Richard Stafford | Stephens College</p>
                  <p><span className="font-semibold italic">Urinetown</span> | dir. Paul Finocchiaro | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">The Marvelous Wonderettes: Dream On</span> | dir. Lauren Haughton | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Clue On Stage</span> | dir. Stephen Brotebeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Lysistrata</span> | dir. Jay Stratton | University of Texas El Paso</p>
                </div>
              </div>

              {/* 2020 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2020</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">A Shayna Maidel</span> | dir. Lamby Hedge | Western Washington University</p>
                  <p><span className="font-semibold italic">The Wolves</span> | dir. Allison Watrous | Denver School of the Arts</p>
                  <p><span className="font-semibold italic">Peter and the Starcatcher</span> | dir. Andre Rodriguez | Denver School of the Arts</p>
                  <p><span className="font-semibold italic">DSA REP</span> | dir. Various | Denver School of the Arts</p>
                  <p><span className="font-semibold italic">The Penelopiad</span> | dir. Sara Rodriguez | University of California Irvine</p>
                </div>
              </div>

              {/* 2019 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2019</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">Company</span> | dir. Eli Simon | University of California Irvine</p>
                  <p><span className="font-semibold italic">Mamma Mia</span> | dir. Jennifer Hemphill | Stephens College</p>
                  <p><span className="font-semibold italic">Spitfire Grill</span> | dir. Lamby Hedge | Western Summer Theatre</p>
                  <p><span className="font-semibold italic">Mamma Mia</span> | dir. Robin Levine | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Living on Love</span> | dir. Fred Rubeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Happily, Ever After</span> | dir. Courtney Crouse | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">An American Daughter</span> | dir. Lamby Hedge | Western Washington University</p>
                  <p><span className="font-semibold italic">The Pajama Game</span> | dir. Don Hill | University of California Irvine</p>
                  <p><span className="font-semibold italic">Parliament Square</span> | dir. Jane Page | University of California Irvine</p>
                </div>
              </div>

              {/* 2018 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2018</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">Scary Poppins</span> | dir. Eric Hoit | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">The Glass Menagerie</span> | dir. Lamby Hedge | Western Summer Theatre</p>
                  <p><span className="font-semibold italic">Young Frankenstein</span> | dir. Deb Currier | Western Summer Theatre</p>
                  <p><span className="font-semibold italic">Thoroughly Modern Millie</span> | dir. Paul Finocchiaro | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Over the River, and through the woods</span> | dir. Fred Rubeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Not Now, Darling</span> | dir. Fred Rubeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">American Idiot</span> | dir. Andrew Palermo | University of California Irvine</p>
                </div>
              </div>

              {/* 2017 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2017</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">Angel Food Cake</span> | dir. Evan Mueller | Western Summer Theatre</p>
                  <p><span className="font-semibold italic">I Love you, You're Perfect, Now Change</span> | dir. Lamby Hedge | Western Summer Theatre</p>
                  <p><span className="font-semibold italic">The Tavern</span> | dir. Suzy Newman | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">The Karaoke Kid</span> | dir. Dan Schultz | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">A Connecticut Yankee in King Arthur's Court</span> | dir. Chuck McLane | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">When Butter Churns Gold</span> | dir. Michael Jenkinson | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">The Foreigner</span> | dir. Dan Schultz | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">Holiday Extravaganza</span> | dir. Suzy Newman | The Great American Melodrama</p>
                </div>
              </div>

              {/* 2016 */}
              <div>
                <h3 className="text-2xl font-bold mb-6">2016</h3>
                <div className="space-y-3 text-foreground/85">
                  <p><span className="font-semibold italic">Trudy and the Beast</span> | dir. Eric Hoit | The Great American Melodrama</p>
                  <p><span className="font-semibold italic">An American Daughter</span> | dir. Lamby Hedge | Stephens College</p>
                  <p><span className="font-semibold italic">Nunsense</span> | dir. Lamby Hedge | Western Washington University</p>
                  <p><span className="font-semibold italic">Cinderella</span> | dir. Liz Piccoli | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">A Murder Is Announced</span> | dir. Karl Kippola | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">The Spitfire Grill</span> | dir. Stephen Brotebeck | Okoboji Summer Theatre</p>
                  <p><span className="font-semibold italic">Vanya, Sonia, Masha, and Spike</span> | dir. Lamby Hedge | Stephens College</p>
                </div>
              </div>
            </div>
          </div>

          {/* Earlier */}
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">EARLIER</h2>
            
            <div className="space-y-3 text-foreground/85">
              <p><span className="font-semibold italic">Urinetown</span> | dir. Lamby Hedge | Western Summer Theatre</p>
              <p><span className="font-semibold italic">Footloose</span> | dir. Stephen Casey | West Virginia Public Theatre</p>
              <p><span className="font-semibold italic">The Liar</span> | dir. Lamby Hedge | Okoboji Summer Theatre</p>
              <p><span className="font-semibold italic">The Giver</span> | dir. Ken Hailey | Kentucky Repertory Theatre</p>
              <p><span className="font-semibold italic">Playhouse Creatures</span> | dir. Becca Kravitz | Warehouse Theatre Company</p>
              <p><span className="font-semibold italic">The Verge</span> | dir. Cheryl Black | University of Missouri</p>
            </div>
          </div>

          {/* Achievements & Education */}
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">ACHIEVEMENTS & EDUCATION</h2>
            
            <div className="space-y-3 text-foreground/85">
              <p>2026 BroadwayWorld Los Angeles Best Scenic Design Nominee</p>
              <p>2023 United Scenic Artists Local 829</p>
              <p>2020 MFA Scenic Design | University of California Irvine</p>
              <p>2010 BFA Theatre Design | Stephens College</p>
            </div>
          </div>



        </div>
      </section>

      <Footer />
    </>
  );
}
