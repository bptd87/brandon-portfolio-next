import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

import { Download, Award, GraduationCap, Users } from "lucide-react";

export default function Resume() {
  const achievements = [
    "2026 BroadwayWorld Los Angeles Best Scenic Design Nominee",
    "2023 United Scenic Artists Local 829",
    "2020 MFA Scenic Design | University of California Irvine",
    "2010 BFA Theatre Design | Stephens College",
  ];

  return (
    <>
      <SEO
        title="Resume & CV | Scenic Designer | 130+ Productions | USA 829"
        description="130+ scenic design productions since 2009. MFA UC Irvine, BFA Stephens College, and USA 829 membership. Professional scenic designer based in Southern California."
        keywords="scenic designer resume, theatrical designer cv, USA 829 member, scenic design portfolio, Brandon PT Davis production history, regional theatre designer, summer stock designer, California scenic designer, MFA UC Irvine"
        url="https://www.brandonptdavis.com/resume"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Resume", url: "https://www.brandonptdavis.com/resume" },
        ]}
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: "https://www.brandonptdavis.com",
          description: "Professional scenic designer with over 130 realized productions across regional theatre, summer stock, and academic theatre. USA 829 member since 2023. BroadwayWorld Los Angeles Best Scenic Design Nominee (2026).",
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
            "BroadwayWorld Los Angeles 2026 - Best Scenic Design Nominee",
            "USA 829 Membership 2023"
          ],
          knowsAbout: [
            "Scenic Design",
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
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-18">
            <div className="grid gap-10 border-b border-border/25 pb-12 xl:grid-cols-[minmax(0,1.12fr)_minmax(18rem,22rem)] xl:items-center">
              <div className="max-w-3xl xl:max-w-4xl">
                <p className="text-[0.95rem] leading-7 text-foreground/72">
                  Resume / CV
                </p>
                <h1 className="mt-6 max-w-4xl font-sans text-[clamp(3rem,6.4vw,5.85rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                  Resume, CV, and selected scenic design credits.
                </h1>
                <p className="mt-7 max-w-3xl text-[1.05rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                  Scenic design credits across regional theatre, summer stock, academic production,
                  and new work development, with downloadable resume and CV for full reference.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-[0.95rem] text-foreground/72">
                  <a
                    href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/KZOFqPARnjQauvWm.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-background transition-colors hover:bg-foreground/88"
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </a>
                  <a
                    href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/mSMkRDmbSOQtUykO.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-white/14"
                  >
                    <Download className="h-4 w-4" />
                    CV
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-border/25 bg-card/10 px-4 py-3.5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/38">Productions</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-[0.98rem] font-medium text-foreground/82">
                      <Users className="w-4 h-4" />
                      130+
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/25 bg-card/10 px-4 py-3.5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/38">Union</p>
                    <p className="mt-2 text-[0.98rem] font-medium text-foreground/82">USA 829</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border/25 bg-card/10 px-4 py-3.5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/38">Training</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-[0.98rem] font-medium text-foreground/82">
                      <GraduationCap className="w-4 h-4" />
                      MFA Scenic Design
                    </p>
                  </div>
                </div>
              </div>

              <div className="xl:justify-self-end">
                <div className="overflow-hidden rounded-[2rem] border border-border/35 bg-card/20">
                  <img
                    src="/assets/about/about-resume-art.png"
                    alt="Abstract cyan resume artwork"
                    className="aspect-[9/16] w-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scenic Design */}
          <div className="mb-16">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">Selected Scenic Design</h2>
            <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-foreground/58">
              Selected credits by year. Full lists remain available in the downloadable resume and CV.
            </p>
            
            <div className="mt-12 space-y-12">
              {/* 2025 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2025</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Glass Menagerie</span><span className="text-foreground/46">Dir. Kimberly Braun</span><span className="text-foreground/52">Maples Repertory Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Million Dollar Quartet</span><span className="text-foreground/46">Dir. James Moye</span><span className="text-foreground/52">South Coast Repertory Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">How to Succeed in Business</span><span className="text-foreground/46">Dir. Bernie Monroe</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Deathtrap</span><span className="text-foreground/46">Dir. Fred Rubeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Bell, Book, and Candle</span><span className="text-foreground/46">Dir. Richard Biever</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">All's Well That Ends Well</span><span className="text-foreground/46">Dir. Rob Salas</span><span className="text-foreground/52">New Swan Theatre Festival</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Much Ado About Nothing</span><span className="text-foreground/46">Dir. Eli Simon</span><span className="text-foreground/52">New Swan Theatre Festival</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Less Miserable</span><span className="text-foreground/46">Dir. John Keating</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Romero</span><span className="text-foreground/46">Dir. David Crespy</span><span className="text-foreground/52">University of Missouri</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Shut Up, Sherlock!</span><span className="text-foreground/46">Dir. Eric Hoit</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Guys on Ice</span><span className="text-foreground/46">Dir. Dan Kalrer</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                </div>
              </div>

              {/* 2024 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2024</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Clue On Stage</span><span className="text-foreground/46">Dir. John Hemphill</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Urinetown</span><span className="text-foreground/46">Dir. Joy Powell</span><span className="text-foreground/52">University of Missouri</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Music Man</span><span className="text-foreground/46">Dir. Bernie Monroe</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Barefoot in The Park</span><span className="text-foreground/46">Dir. Brett Olson</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Freaky Friday</span><span className="text-foreground/46">Dir. Josh Walden</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Baskerville: A Sherlock Holmes Mystery</span><span className="text-foreground/46">Dir. Stephen Brotebeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">9 to 5</span><span className="text-foreground/46">Dir. Brandon Riley</span><span className="text-foreground/52">University of Missouri</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Footloose</span><span className="text-foreground/46">Dir. Jamey Grisham</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Boeing, Boeing</span><span className="text-foreground/46">Dir. John Hemphill</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Bright Star</span><span className="text-foreground/46">Dir. Andre' Rodriguez</span><span className="text-foreground/52">Denver School of the Arts</span></p>
                </div>
              </div>

              {/* 2023 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2023</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Christmas Carol</span><span className="text-foreground/46">Dir. Courtney Crouse</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">An Enemy of the People</span><span className="text-foreground/46">Dir. LR Hults</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Songs for a New World</span><span className="text-foreground/46">Dir. Lisa Brescia</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Wedding Singer</span><span className="text-foreground/46">Dir. Bernie Monroe</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Dial "M" for Murder</span><span className="text-foreground/46">Dir. Fred Rubeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Cole</span><span className="text-foreground/46">Dir. Alison Morooney</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Head Over Heels</span><span className="text-foreground/46">Dir. Josh Walden</span><span className="text-foreground/52">Theatre SilCo</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Curtain Up! Stephens</span><span className="text-foreground/46">Dir. Lisa Brescia</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Loteria</span><span className="text-foreground/46">Dir. Sara Rodriguez</span><span className="text-foreground/52">Theatre SilCo</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Spelling Bee</span><span className="text-foreground/46">Dir. Todd Davidson</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Merry Wives of Windsor</span><span className="text-foreground/46">Dir. Jamey Grisham</span><span className="text-foreground/52">Stephens College</span></p>
                </div>
              </div>

              {/* 2022 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2022</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">White Christmas</span><span className="text-foreground/46">Dir. Lisa Brescia</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Our Town</span><span className="text-foreground/46">Dir. Elizabeth Palmieri</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Legally Blonde</span><span className="text-foreground/46">Dir. Amy Fritsche</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Bright Star</span><span className="text-foreground/46">Dir. Lauren Haughton</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">An Inspector Calls</span><span className="text-foreground/46">Dir. Stephen Brotebeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Man of La Mancha</span><span className="text-foreground/46">Dir. Chris Allerman</span><span className="text-foreground/52">Lake Dillon Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">A Funny Thing Happened…</span><span className="text-foreground/46">Dir. Melissa Livingston</span><span className="text-foreground/52">Lake Dillon Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Curtain Up! Stephens</span><span className="text-foreground/46">Dir. Stephens Faculty</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Tomas and the Library Lady</span><span className="text-foreground/46">Dir. Sara Rodriguez</span><span className="text-foreground/52">Lake Dillon Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">A Chorus Line</span><span className="text-foreground/46">Dir. Andre' Rodriguez</span><span className="text-foreground/52">Denver School of the Arts</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Book of Everything</span><span className="text-foreground/46">Dir. Allison Watrous</span><span className="text-foreground/52">Denver School of the Arts</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Bald Soprano</span><span className="text-foreground/46">Dir. Brett Olson</span><span className="text-foreground/52">Stephens College</span></p>
                </div>
              </div>

              {/* 2021 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2021</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">A Smalltowne Christmas</span><span className="text-foreground/46">Dir. Richard Stafford</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Urinetown</span><span className="text-foreground/46">Dir. Paul Finocchiaro</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Marvelous Wonderettes: Dream On</span><span className="text-foreground/46">Dir. Lauren Haughton</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Clue On Stage</span><span className="text-foreground/46">Dir. Stephen Brotebeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Lysistrata</span><span className="text-foreground/46">Dir. Jay Stratton</span><span className="text-foreground/52">University of Texas El Paso</span></p>
                </div>
              </div>

              {/* 2020 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2020</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">A Shayna Maidel</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Western Washington University</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Wolves</span><span className="text-foreground/46">Dir. Allison Watrous</span><span className="text-foreground/52">Denver School of the Arts</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Peter and the Starcatcher</span><span className="text-foreground/46">Dir. Andre Rodriguez</span><span className="text-foreground/52">Denver School of the Arts</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">DSA REP</span><span className="text-foreground/46">Dir. Various</span><span className="text-foreground/52">Denver School of the Arts</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Penelopiad</span><span className="text-foreground/46">Dir. Sara Rodriguez</span><span className="text-foreground/52">University of California Irvine</span></p>
                </div>
              </div>

              {/* 2019 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2019</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Company</span><span className="text-foreground/46">Dir. Eli Simon</span><span className="text-foreground/52">University of California Irvine</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Mamma Mia</span><span className="text-foreground/46">Dir. Jennifer Hemphill</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Spitfire Grill</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Western Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Mamma Mia</span><span className="text-foreground/46">Dir. Robin Levine</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Living on Love</span><span className="text-foreground/46">Dir. Fred Rubeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Happily, Ever After</span><span className="text-foreground/46">Dir. Courtney Crouse</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">An American Daughter</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Western Washington University</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Pajama Game</span><span className="text-foreground/46">Dir. Don Hill</span><span className="text-foreground/52">University of California Irvine</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Parliament Square</span><span className="text-foreground/46">Dir. Jane Page</span><span className="text-foreground/52">University of California Irvine</span></p>
                </div>
              </div>

              {/* 2018 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2018</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Scary Poppins</span><span className="text-foreground/46">Dir. Eric Hoit</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Glass Menagerie</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Western Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Young Frankenstein</span><span className="text-foreground/46">Dir. Deb Currier</span><span className="text-foreground/52">Western Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Thoroughly Modern Millie</span><span className="text-foreground/46">Dir. Paul Finocchiaro</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Over the River, and Through the Woods</span><span className="text-foreground/46">Dir. Fred Rubeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Not Now, Darling</span><span className="text-foreground/46">Dir. Fred Rubeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">American Idiot</span><span className="text-foreground/46">Dir. Andrew Palermo</span><span className="text-foreground/52">University of California Irvine</span></p>
                </div>
              </div>

              {/* 2017 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2017</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Angel Food Cake</span><span className="text-foreground/46">Dir. Evan Mueller</span><span className="text-foreground/52">Western Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">I Love You, You're Perfect, Now Change</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Western Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Tavern</span><span className="text-foreground/46">Dir. Suzy Newman</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Karaoke Kid</span><span className="text-foreground/46">Dir. Dan Schultz</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">A Connecticut Yankee in King Arthur's Court</span><span className="text-foreground/46">Dir. Chuck McLane</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">When Butter Churns Gold</span><span className="text-foreground/46">Dir. Michael Jenkinson</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Foreigner</span><span className="text-foreground/46">Dir. Dan Schultz</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Holiday Extravaganza</span><span className="text-foreground/46">Dir. Suzy Newman</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                </div>
              </div>

              {/* 2016 */}
              <div className="border-t border-border/20 pt-6 md:pt-7">
                <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">2016</h3>
                <div className="mt-6 space-y-2 text-foreground/85">
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Trudy and the Beast</span><span className="text-foreground/46">Dir. Eric Hoit</span><span className="text-foreground/52">The Great American Melodrama</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">An American Daughter</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Stephens College</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Nunsense</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Western Washington University</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Cinderella</span><span className="text-foreground/46">Dir. Liz Piccoli</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">A Murder Is Announced</span><span className="text-foreground/46">Dir. Karl Kippola</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Spitfire Grill</span><span className="text-foreground/46">Dir. Stephen Brotebeck</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
                  <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Vanya, Sonia, Masha, and Spike</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Stephens College</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Earlier */}
          <div className="mb-16">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">Earlier</h2>
            
            <div className="mt-6 space-y-2 border-t border-border/20 pt-6 text-foreground/85 md:pt-7">
              <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Urinetown</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Western Summer Theatre</span></p>
              <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Footloose</span><span className="text-foreground/46">Dir. Stephen Casey</span><span className="text-foreground/52">West Virginia Public Theatre</span></p>
              <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Liar</span><span className="text-foreground/46">Dir. Lamby Hedge</span><span className="text-foreground/52">Okoboji Summer Theatre</span></p>
              <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Giver</span><span className="text-foreground/46">Dir. Ken Hailey</span><span className="text-foreground/52">Kentucky Repertory Theatre</span></p>
              <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">Playhouse Creatures</span><span className="text-foreground/46">Dir. Becca Kravitz</span><span className="text-foreground/52">Warehouse Theatre Company</span></p>
              <p className="text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4"><span className="font-medium italic tracking-[-0.02em] text-foreground/94">The Verge</span><span className="text-foreground/46">Dir. Cheryl Black</span><span className="text-foreground/52">University of Missouri</span></p>
            </div>
          </div>

          {/* Achievements & Education */}
          <div className="mb-16">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">Achievements & Education</h2>
            
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {achievements.map((item, index) => (
                <div key={item} className="rounded-[1.25rem] border border-border/25 bg-card/10 px-4 py-3.5 text-foreground/82">
                  <p className="inline-flex items-start gap-2">
                    {index === 0 ? <Award className="mt-0.5 w-4 h-4 text-foreground/62" /> : <span className="mt-0.5 h-4 w-4 rounded-full border border-foreground/14" />}
                    <span>{item}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>



        </div>
      </section>

      <Footer />
    </>
  );
}
