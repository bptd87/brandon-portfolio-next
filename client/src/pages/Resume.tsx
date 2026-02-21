import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

import { Download, Award, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      
      <section className="min-h-screen bg-background [background-image:radial-gradient(circle_at_10%_10%,rgba(255,87,34,0.10),transparent_36%),radial-gradient(circle_at_88%_15%,rgba(0,188,212,0.08),transparent_35%)] pt-20 pb-20">
        <div className="container max-w-6xl">


          {/* Hero */}
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Resume / CV</p>
            <div className="flex items-end justify-between gap-8 flex-wrap border-b border-border/50 pb-8">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif mb-4 leading-tight tracking-tight">Resume</h1>
                <p className="text-xl text-foreground/75 max-w-3xl leading-relaxed">
                  Scenic design production history across regional theatre, summer stock, academic theatre, and new work development.
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <Button size="lg" className="gap-2 bg-[#FF5722] hover:bg-[#ff6a3a] text-white" asChild>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-3xl">
              <div className="rounded-xl border border-border/60 bg-card/30 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">Productions</p>
                <p className="text-sm font-semibold inline-flex items-center gap-2"><Users className="w-4 h-4 text-primary" />130+</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/30 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">Union</p>
                <p className="text-sm font-semibold">USA 829</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/30 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-1">Training</p>
                <p className="text-sm font-semibold inline-flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />MFA Scenic Design</p>
              </div>
            </div>
          </div>

          {/* Scenic Design */}
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3 font-semibold">Selected Scenic Design</h2>
            <p className="text-foreground/70 mb-12">Selected credits by year. Full list available in downloadable resume/CV.</p>
            
            <div className="space-y-12">
              {/* 2025 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2025</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Glass Menagerie</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Kimberly Braun</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Maples Repertory Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Million Dollar Quartet</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. James Moye</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">South Coast Repertory Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">How to Succeed in Business</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Bernie Monroe</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Deathtrap</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Fred Rubeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Bell, Book, and Candle</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Richard Biever</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">All's Well That Ends Well</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Rob Salas</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">New Swan Theatre Festival</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Much Ado About Nothing</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Eli Simon</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">New Swan Theatre Festival</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Less Miserable</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. John Keating</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Romero</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. David Crespy</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of Missouri</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Shut Up, Sherlock!</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Eric Hoit</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Guys on Ice</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Dan Kalrer</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                </div>
              </div>

              {/* 2024 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2024</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Clue On Stage</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. John Hemphill</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Urinetown</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Joy Powell</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of Missouri</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Music Man</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Bernie Monroe</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Barefoot in The Park</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Brett Olson</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Freaky Friday</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Josh Walden</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Baskerville: A Sherlock Holmes Mystery</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Stephen Brotebeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">9 to 5</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Brandon Riley</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of Missouri</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Footloose</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Jamey Grisham</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Boeing, Boeing</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. John Hemphill</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Bright Star</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Andre' Rodriguez</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Denver School of the Arts</span></p>
                </div>
              </div>

              {/* 2023 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2023</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Christmas Carol</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Courtney Crouse</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">An Enemy of the People</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. LR Hults</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Songs for a New World</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lisa Brescia</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Wedding Singer</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Bernie Monroe</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Dial "M" for Murder</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Fred Rubeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Cole</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Alison Morooney</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Head Over Heels</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Josh Walden</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Theatre SilCo</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Curtain Up! Stephens</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lisa Brescia</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Loteria</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Sara Rodriguez</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Theatre SilCo</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Spelling Bee</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Todd Davidson</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Merry Wives of Windsor</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Jamey Grisham</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                </div>
              </div>

              {/* 2022 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2022</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">White Christmas</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lisa Brescia</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Our Town</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Elizabeth Palmieri</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Legally Blonde</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Amy Fritsche</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Bright Star</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lauren Haughton</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">An Inspector Calls</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Stephen Brotebeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Man of La Mancha</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Chris Allerman</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Lake Dillon Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">A Funny Thing Happened…</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Melissa Livingston</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Lake Dillon Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Curtain Up! Stephens</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Stephens Faculty</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Tomas and the Library Lady</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Sara Rodriguez</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Lake Dillon Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">A Chorus Line</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Andre' Rodriguez</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Denver School of the Arts</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Book of Everything</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Allison Watrous</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Denver School of the Arts</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Bald Soprano</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Brett Olson</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                </div>
              </div>

              {/* 2021 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2021</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">A Smalltowne Christmas</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Richard Stafford</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Urinetown</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Paul Finocchiaro</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Marvelous Wonderettes: Dream On</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lauren Haughton</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Clue On Stage</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Stephen Brotebeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Lysistrata</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Jay Stratton</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of Texas El Paso</span></p>
                </div>
              </div>

              {/* 2020 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2020</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">A Shayna Maidel</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Washington University</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Wolves</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Allison Watrous</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Denver School of the Arts</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Peter and the Starcatcher</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Andre Rodriguez</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Denver School of the Arts</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">DSA REP</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Various</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Denver School of the Arts</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Penelopiad</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Sara Rodriguez</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of California Irvine</span></p>
                </div>
              </div>

              {/* 2019 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2019</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Company</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Eli Simon</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of California Irvine</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Mamma Mia</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Jennifer Hemphill</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Spitfire Grill</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Mamma Mia</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Robin Levine</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Living on Love</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Fred Rubeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Happily, Ever After</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Courtney Crouse</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">An American Daughter</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Washington University</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Pajama Game</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Don Hill</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of California Irvine</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Parliament Square</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Jane Page</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of California Irvine</span></p>
                </div>
              </div>

              {/* 2018 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2018</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Scary Poppins</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Eric Hoit</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Glass Menagerie</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Young Frankenstein</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Deb Currier</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Thoroughly Modern Millie</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Paul Finocchiaro</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Over the River, and Through the Woods</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Fred Rubeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Not Now, Darling</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Fred Rubeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">American Idiot</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Andrew Palermo</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of California Irvine</span></p>
                </div>
              </div>

              {/* 2017 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2017</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Angel Food Cake</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Evan Mueller</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">I Love You, You're Perfect, Now Change</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Tavern</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Suzy Newman</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Karaoke Kid</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Dan Schultz</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">A Connecticut Yankee in King Arthur's Court</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Chuck McLane</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">When Butter Churns Gold</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Michael Jenkinson</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Foreigner</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Dan Schultz</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Holiday Extravaganza</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Suzy Newman</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                </div>
              </div>

              {/* 2016 */}
              <div className="rounded-2xl border border-border/50 bg-card/20 p-6">
                <h3 className="text-2xl font-bold mb-6">2016</h3>
                <div className="space-y-2 text-foreground/85">
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Trudy and the Beast</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Eric Hoit</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">The Great American Melodrama</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">An American Daughter</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Nunsense</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Washington University</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Cinderella</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Liz Piccoli</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">A Murder Is Announced</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Karl Kippola</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Spitfire Grill</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Stephen Brotebeck</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
                  <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Vanya, Sonia, Masha, and Spike</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Stephens College</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Earlier */}
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">EARLIER</h2>
            
            <div className="space-y-2 text-foreground/85 rounded-2xl border border-border/50 bg-card/20 p-6">
              <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Urinetown</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Western Summer Theatre</span></p>
              <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Footloose</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Stephen Casey</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">West Virginia Public Theatre</span></p>
              <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Liar</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Lamby Hedge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Okoboji Summer Theatre</span></p>
              <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Giver</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Ken Hailey</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Kentucky Repertory Theatre</span></p>
              <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">Playhouse Creatures</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Becca Kravitz</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">Warehouse Theatre Company</span></p>
              <p className="text-[0.95rem] leading-7 md:flex md:items-baseline"><span className="font-semibold italic text-foreground md:inline-block md:min-w-[20rem]">The Verge</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/75 md:inline-block md:min-w-[15rem]">Dir. Cheryl Black</span><span className="text-foreground/40 px-2">•</span><span className="text-foreground/70 md:inline-block">University of Missouri</span></p>
            </div>
          </div>

          {/* Achievements & Education */}
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold">ACHIEVEMENTS & EDUCATION</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {achievements.map((item, index) => (
                <div key={item} className="rounded-xl border border-border/50 bg-card/20 px-4 py-3 text-foreground/85">
                  <p className="inline-flex items-start gap-2">
                    {index === 0 ? <Award className="w-4 h-4 text-primary mt-0.5" /> : <span className="w-4 h-4 mt-0.5 rounded-full border border-primary/40" />}
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
