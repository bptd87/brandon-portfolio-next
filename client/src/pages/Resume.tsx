"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "wouter";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import SectionIntro from "@/components/SectionIntro";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

import { ArrowRight, Download, Award, Users } from "lucide-react";
import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  assistantScenicDesignEntries,
} from "@shared/localAssistantScenic";

type ResumeCredit = {
  title: string;
  director: string;
  company: string;
};

type ResumeYearSection = {
  year: string;
  credits: ResumeCredit[];
};

const LINE_CLASS =
  "grid gap-1 py-3.5 text-[1.02rem] leading-7 md:grid-cols-[minmax(13rem,1.1fr)_minmax(10rem,0.75fr)_minmax(12rem,0.95fr)] md:items-baseline md:gap-x-8 lg:gap-x-14";
const RESUME_SECTION_CLASS =
  "mb-16 pt-7 md:pt-8";

const USA_829_LOGO_SRC = "/images/about/icons/usa-829-logo.png";
const UCI_LOGO_SRC =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/uci-logo-real.png";
const RESUME_METRIC_CARD_CLASS =
  "group relative isolate flex min-h-[11.25rem] flex-col overflow-hidden rounded-[1.65rem] p-6 text-white shadow-[0_18px_46px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-1 md:min-h-[11.75rem] md:p-7";
const RESUME_METRIC_GLOW_CLASS =
  "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_0%,rgba(255,255,255,0.06),transparent_32%),radial-gradient(circle_at_88%_4%,rgba(139,92,246,0.12),transparent_44%)]";
const RESUME_METRIC_MARK_CLASS = "flex h-[3.35rem] items-start md:h-[3.5rem]";
const RESUME_METRIC_LABEL_CLASS =
  "text-[0.78rem] font-black uppercase tracking-[0.08em] text-white/58";
const RESUME_METRIC_TITLE_CLASS =
  "mt-2 text-[clamp(1.2rem,1.5vw,1.75rem)] font-black uppercase leading-[0.94] tracking-[0] text-white";
const RESUME_METRIC_BODY_CLASS =
  "mt-2 max-w-[17rem] text-[0.9rem] font-medium leading-[1.38] tracking-[-0.02em] text-white/68";

type ResumeMetricCardProps = {
  label: string;
  title: string;
  body: string;
  children: ReactNode;
  glow?: string;
  surfaceClassName?: string;
};

function ResumeMetricCard({
  label,
  title,
  body,
  children,
  glow = "",
  surfaceClassName = "bg-black",
}: ResumeMetricCardProps) {
  return (
    <article className={`${RESUME_METRIC_CARD_CLASS} ${surfaceClassName}`}>
      <div className={`${RESUME_METRIC_GLOW_CLASS} ${glow}`} aria-hidden="true" />
      <div className={RESUME_METRIC_MARK_CLASS}>{children}</div>
      <div className="mt-auto pt-5">
        <p className={RESUME_METRIC_LABEL_CLASS}>{label}</p>
        <h3 className={RESUME_METRIC_TITLE_CLASS} style={{ fontFamily: HOME_DISPLAY_FONT }}>
          {title}
        </h3>
        <p className={RESUME_METRIC_BODY_CLASS}>{body}</p>
      </div>
    </article>
  );
}

const SCENIC_CREDITS: ResumeYearSection[] = [
  {
    year: "2026",
    credits: [
      { title: "9 to 5", director: "Dir. Bernie Monroe", company: "Okoboji Summer Theatre" },
      { title: "Never Can Say Goodbye", director: "Dir. Susie Dycus", company: "Okoboji Summer Theatre" },
      { title: "You're a Good Man, Charlie Brown", director: "Dir. Brandon McShaffey", company: "Maples Repertory Theatre" },
      { title: "Almost Heaven", director: "Dir. Trevor Belt", company: "Maples Repertory Theatre" },
      { title: "Merry Wives of Windsor Cove", director: "Dir. Eli Simon", company: "New Swan Theatre Festival" },
      { title: "Romeo and Juliet", director: "Dir. Rachel VanWormer", company: "New Swan Theatre Festival" },
    ],
  },
  {
    year: "2025",
    credits: [
      { title: "The Glass Menagerie", director: "Dir. Kimberly Braun", company: "Maples Repertory Theatre" },
      { title: "Million Dollar Quartet", director: "Dir. James Moye", company: "South Coast Repertory Theatre" },
      { title: "How to Succeed in Business", director: "Dir. Bernie Monroe", company: "Okoboji Summer Theatre" },
      { title: "Deathtrap", director: "Dir. Fred Rubeck", company: "Okoboji Summer Theatre" },
      { title: "Bell, Book, and Candle", director: "Dir. Richard Biever", company: "Okoboji Summer Theatre" },
      { title: "All's Well That Ends Well", director: "Dir. Rob Salas", company: "New Swan Theatre Festival" },
      { title: "Much Ado About Nothing", director: "Dir. Eli Simon", company: "New Swan Theatre Festival" },
      { title: "Less Miserable", director: "Dir. John Keating", company: "The Great American Melodrama" },
      { title: "Romero", director: "Dir. David Crespy", company: "University of Missouri" },
      { title: "Shut Up, Sherlock!", director: "Dir. Eric Hoit", company: "The Great American Melodrama" },
      { title: "Guys on Ice", director: "Dir. Dan Kalrer", company: "The Great American Melodrama" },
    ],
  },
  {
    year: "2024",
    credits: [
      { title: "Clue On Stage", director: "Dir. John Hemphill", company: "Stephens College" },
      { title: "Urinetown", director: "Dir. Joy Powell", company: "University of Missouri" },
      { title: "The Music Man", director: "Dir. Bernie Monroe", company: "Okoboji Summer Theatre" },
      { title: "Barefoot in The Park", director: "Dir. Brett Olson", company: "Okoboji Summer Theatre" },
      { title: "Freaky Friday", director: "Dir. Josh Walden", company: "Okoboji Summer Theatre" },
      { title: "Baskerville: A Sherlock Holmes Mystery", director: "Dir. Stephen Brotebeck", company: "Okoboji Summer Theatre" },
      { title: "9 to 5", director: "Dir. Brandon Riley", company: "University of Missouri" },
      { title: "Footloose", director: "Dir. Jamey Grisham", company: "Stephens College" },
      { title: "Boeing, Boeing", director: "Dir. John Hemphill", company: "Stephens College" },
      { title: "Bright Star", director: "Dir. Andre' Rodriguez", company: "Denver School of the Arts" },
    ],
  },
  {
    year: "2023",
    credits: [
      { title: "Christmas Carol", director: "Dir. Courtney Crouse", company: "Stephens College" },
      { title: "An Enemy of the People", director: "Dir. LR Hults", company: "Stephens College" },
      { title: "Songs for a New World", director: "Dir. Lisa Brescia", company: "Stephens College" },
      { title: "The Wedding Singer", director: "Dir. Bernie Monroe", company: "Okoboji Summer Theatre" },
      { title: 'Dial "M" for Murder', director: "Dir. Fred Rubeck", company: "Okoboji Summer Theatre" },
      { title: "Cole", director: "Dir. Alison Morooney", company: "Okoboji Summer Theatre" },
      { title: "Head Over Heels", director: "Dir. Josh Walden", company: "Theatre SilCo" },
      { title: "Curtain Up! Stephens", director: "Dir. Lisa Brescia", company: "Stephens College" },
      { title: "Loteria", director: "Dir. Sara Rodriguez", company: "Theatre SilCo" },
      { title: "Spelling Bee", director: "Dir. Todd Davidson", company: "Stephens College" },
      { title: "Merry Wives of Windsor", director: "Dir. Jamey Grisham", company: "Stephens College" },
    ],
  },
  {
    year: "2022",
    credits: [
      { title: "White Christmas", director: "Dir. Lisa Brescia", company: "Stephens College" },
      { title: "Our Town", director: "Dir. Elizabeth Palmieri", company: "Stephens College" },
      { title: "Legally Blonde", director: "Dir. Amy Fritsche", company: "Okoboji Summer Theatre" },
      { title: "Bright Star", director: "Dir. Lauren Haughton", company: "Okoboji Summer Theatre" },
      { title: "An Inspector Calls", director: "Dir. Stephen Brotebeck", company: "Okoboji Summer Theatre" },
      { title: "Man of La Mancha", director: "Dir. Chris Allerman", company: "Lake Dillon Theatre" },
      { title: "A Funny Thing Happened…", director: "Dir. Melissa Livingston", company: "Lake Dillon Theatre" },
      { title: "Curtain Up! Stephens", director: "Dir. Stephens Faculty", company: "Stephens College" },
      { title: "Tomas and the Library Lady", director: "Dir. Sara Rodriguez", company: "Lake Dillon Theatre" },
      { title: "A Chorus Line", director: "Dir. Andre' Rodriguez", company: "Denver School of the Arts" },
      { title: "The Book of Everything", director: "Dir. Allison Watrous", company: "Denver School of the Arts" },
      { title: "The Bald Soprano", director: "Dir. Brett Olson", company: "Stephens College" },
    ],
  },
  {
    year: "2021",
    credits: [
      { title: "A Smalltowne Christmas", director: "Dir. Richard Stafford", company: "Stephens College" },
      { title: "Urinetown", director: "Dir. Paul Finocchiaro", company: "Okoboji Summer Theatre" },
      { title: "The Marvelous Wonderettes: Dream On", director: "Dir. Lauren Haughton", company: "Okoboji Summer Theatre" },
      { title: "Clue On Stage", director: "Dir. Stephen Brotebeck", company: "Okoboji Summer Theatre" },
      { title: "Lysistrata", director: "Dir. Jay Stratton", company: "University of Texas El Paso" },
    ],
  },
  {
    year: "2020",
    credits: [
      { title: "A Shayna Maidel", director: "Dir. Lamby Hedge", company: "Western Washington University" },
      { title: "The Wolves", director: "Dir. Allison Watrous", company: "Denver School of the Arts" },
      { title: "Peter and the Starcatcher", director: "Dir. Andre Rodriguez", company: "Denver School of the Arts" },
      { title: "DSA REP", director: "Dir. Various", company: "Denver School of the Arts" },
      { title: "The Penelopiad", director: "Dir. Sara Rodriguez", company: "University of California Irvine" },
    ],
  },
  {
    year: "2019",
    credits: [
      { title: "Company", director: "Dir. Eli Simon", company: "University of California Irvine" },
      { title: "Mamma Mia", director: "Dir. Jennifer Hemphill", company: "Stephens College" },
      { title: "Spitfire Grill", director: "Dir. Lamby Hedge", company: "Western Summer Theatre" },
      { title: "Mamma Mia", director: "Dir. Robin Levine", company: "Okoboji Summer Theatre" },
      { title: "Living on Love", director: "Dir. Fred Rubeck", company: "Okoboji Summer Theatre" },
      { title: "Happily, Ever After", director: "Dir. Courtney Crouse", company: "Okoboji Summer Theatre" },
      { title: "An American Daughter", director: "Dir. Lamby Hedge", company: "Western Washington University" },
      { title: "The Pajama Game", director: "Dir. Don Hill", company: "University of California Irvine" },
      { title: "Parliament Square", director: "Dir. Jane Page", company: "University of California Irvine" },
    ],
  },
  {
    year: "2018",
    credits: [
      { title: "Scary Poppins", director: "Dir. Eric Hoit", company: "The Great American Melodrama" },
      { title: "The Glass Menagerie", director: "Dir. Lamby Hedge", company: "Western Summer Theatre" },
      { title: "Young Frankenstein", director: "Dir. Deb Currier", company: "Western Summer Theatre" },
      { title: "Thoroughly Modern Millie", director: "Dir. Paul Finocchiaro", company: "Okoboji Summer Theatre" },
      { title: "Over the River, and Through the Woods", director: "Dir. Fred Rubeck", company: "Okoboji Summer Theatre" },
      { title: "Not Now, Darling", director: "Dir. Fred Rubeck", company: "Okoboji Summer Theatre" },
      { title: "American Idiot", director: "Dir. Andrew Palermo", company: "University of California Irvine" },
    ],
  },
  {
    year: "2017",
    credits: [
      { title: "Angel Food Cake", director: "Dir. Evan Mueller", company: "Western Summer Theatre" },
      { title: "I Love You, You're Perfect, Now Change", director: "Dir. Lamby Hedge", company: "Western Summer Theatre" },
      { title: "The Tavern", director: "Dir. Suzy Newman", company: "The Great American Melodrama" },
      { title: "The Karaoke Kid", director: "Dir. Dan Schultz", company: "The Great American Melodrama" },
      { title: "A Connecticut Yankee in King Arthur's Court", director: "Dir. Chuck McLane", company: "The Great American Melodrama" },
      { title: "When Butter Churns Gold", director: "Dir. Michael Jenkinson", company: "The Great American Melodrama" },
      { title: "The Foreigner", director: "Dir. Dan Schultz", company: "The Great American Melodrama" },
      { title: "Holiday Extravaganza", director: "Dir. Suzy Newman", company: "The Great American Melodrama" },
    ],
  },
  {
    year: "2016",
    credits: [
      { title: "Trudy and the Beast", director: "Dir. Eric Hoit", company: "The Great American Melodrama" },
      { title: "An American Daughter", director: "Dir. Lamby Hedge", company: "Stephens College" },
      { title: "Nunsense", director: "Dir. Lamby Hedge", company: "Western Washington University" },
      { title: "Cinderella", director: "Dir. Liz Piccoli", company: "Okoboji Summer Theatre" },
      { title: "A Murder Is Announced", director: "Dir. Karl Kippola", company: "Okoboji Summer Theatre" },
      { title: "The Spitfire Grill", director: "Dir. Stephen Brotebeck", company: "Okoboji Summer Theatre" },
      { title: "Vanya, Sonia, Masha, and Spike", director: "Dir. Lamby Hedge", company: "Stephens College" },
    ],
  },
];

const EARLIER_CREDITS: ResumeCredit[] = [
  { title: "Urinetown", director: "Dir. Lamby Hedge", company: "Western Summer Theatre" },
  { title: "Footloose", director: "Dir. Stephen Casey", company: "West Virginia Public Theatre" },
  { title: "The Liar", director: "Dir. Lamby Hedge", company: "Okoboji Summer Theatre" },
  { title: "The Giver", director: "Dir. Ken Hailey", company: "Kentucky Repertory Theatre" },
  { title: "Playhouse Creatures", director: "Dir. Becca Kravitz", company: "Warehouse Theatre Company" },
  { title: "The Verge", director: "Dir. Cheryl Black", company: "University of Missouri" },
];

function ScenicCreditRow({ credit }: { credit: ResumeCredit }) {
  return (
    <p className={LINE_CLASS}>
      <span className="font-medium italic tracking-[-0.02em] text-foreground/94">
        {credit.title}
      </span>
      <span className="text-foreground/46">{credit.director}</span>
      <span className="text-foreground/52">{credit.company}</span>
    </p>
  );
}

export default function Resume() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);

  const achievements = [
    "2026 BroadwayWorld Los Angeles Best Scenic Design Nominee",
    "2023 United Scenic Artists Local 829",
    "2020 MFA Scenic Design | University of California Irvine",
    "2010 BFA Theatre Design | Stephens College",
  ];

  return (
    <div
      className="about-profile-light min-h-screen transition-colors duration-500"
      style={
        {
          backgroundColor: homeTheme.bg,
          color: homeTheme.ink,
          fontFamily: HOME_BODY_FONT,
          "--background": homeTheme.bg,
          "--foreground": homeTheme.ink,
        } as CSSProperties
      }
    >
      <SEO
        title="Resume & CV | Scenic Designer | 130+ Productions | USA 829"
        description="130+ scenic design productions since 2009. MFA UC Irvine, BFA Stephens College, and USA 829 membership. Professional scenic designer based in San Diego, California."
        keywords="scenic designer resume, theatrical designer cv, USA 829 member, scenic design portfolio, Brandon PT Davis production history, regional theatre designer, summer stock designer, San Diego scenic designer, California scenic designer, MFA UC Irvine"
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
          description:
            "Professional scenic designer with over 130 realized productions across regional theatre, summer stock, and academic theatre. USA 829 member since 2023. BroadwayWorld Los Angeles Best Scenic Design Nominee (2026).",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "San Diego",
            addressRegion: "CA",
            addressCountry: "US",
          },
          alumniOf: [
            { name: "University of California, Irvine", url: "https://www.uci.edu" },
            { name: "Stephens College", url: "https://www.stephens.edu" },
          ],
          awards: [
            "BroadwayWorld Los Angeles 2026 - Best Scenic Design Nominee",
            "USA 829 Membership 2023",
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
            "Set Design",
          ],
        }}
      />
      <Header />
      <AboutNav />

      <ProfileSectionHero
        canonicalPath="/resume"
        description="A working production record across scenic design, assistant scenic design, rendering, teaching, and related creative practice."
        imageAlt="File archive icon for resume and production credits"
        imageSrc="/images/about/icons/resume-icon.png"
        showImage={false}
        title="Resume"
        updatedAt="July 5, 2026"
      />

      <section
        className="about-profile-light pb-20 pt-8 md:pt-12"
        style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
      >
        <div className="mx-auto w-full max-w-[1180px] px-[clamp(1.5rem,5vw,5rem)]">
          <AnimatedSection className="mb-18">
            <div className="pb-12">
              <div className="mx-auto flex max-w-[58rem] flex-col items-center gap-7 text-center">
                <p
                  className="text-balance text-[1rem] font-medium leading-7 tracking-[-0.015em] md:text-[1.08rem]"
                  style={{ color: homeTheme.muted }}
                >
                    Scenic design credits across regional theatre, summer stock, academic
                    production, and new work development, with resume and CV downloads for a fuller
                    professional record.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[0.95rem]">
                  <a
                    href="https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/pdf/downloads/resume/kzofqparnjqauvwm-8d5c0155c1-c3638d1b.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.84rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </a>
                  <a
                    href="https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/pdf/downloads/resume/msmkrdmbsoqtuyko-58989945e6-d6f5c926.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.84rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: homeTheme.accentSoft, color: homeTheme.ink }}
                  >
                    <Download className="h-4 w-4" />
                    CV
                  </a>
                </div>
              </div>

              <div className="mt-12 grid gap-5 lg:grid-cols-3 xl:gap-6">
                <ResumeMetricCard
                  label="Education"
                  title="MFA Scenic Design"
                  body="University of California, Irvine."
                  glow="bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_88%_8%,rgba(73,103,132,0.34),transparent_40%)]"
                  surfaceClassName="bg-[#496784]"
                >
                  <div className="relative h-12 w-12 opacity-95 transition-transform duration-500 group-hover:scale-[1.05] md:h-14 md:w-14">
                    <Image
                      src={UCI_LOGO_SRC}
                      alt="University of California, Irvine seal"
                      fill
                      sizes="3.5rem"
                      className="object-contain object-left-top drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
                    />
                  </div>
                </ResumeMetricCard>

                <ResumeMetricCard
                  label="Union"
                  title="United Scenic Artists Local USA 829"
                  body="Professional scenic design membership since 2023."
                  glow="bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_88%_8%,rgba(168,72,44,0.34),transparent_40%)]"
                  surfaceClassName="bg-[#a8482c]"
                >
                  <div className="relative h-12 w-[6.5rem] opacity-95 transition-transform duration-500 group-hover:scale-[1.05] md:h-14 md:w-28">
                    <Image
                      src={USA_829_LOGO_SRC}
                      alt="United Scenic Artists Local USA 829 logo"
                      fill
                      sizes="7rem"
                      className="object-contain object-left-top drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
                    />
                  </div>
                </ResumeMetricCard>

                <ResumeMetricCard
                  label="Production Count"
                  title="Realized scenic designs"
                  body="Across regional theatre, summer stock, and academic production."
                  glow="bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.16),transparent_42%),radial-gradient(circle_at_88%_8%,rgba(93,116,77,0.34),transparent_40%)]"
                  surfaceClassName="bg-[#5d744d]"
                >
                  <div className="flex items-start gap-2 text-white">
                    <span className="text-[clamp(2.55rem,3.1vw,3rem)] font-semibold leading-[0.9] tracking-[-0.08em]">
                      130+
                    </span>
                    <Users className="mt-1.5 h-5 w-5 text-white/42" aria-hidden="true" />
                  </div>
                </ResumeMetricCard>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={140} className={RESUME_SECTION_CLASS}>
            <div className="flex items-end justify-between gap-6">
              <SectionIntro
                title="Selected Scenic Design"
                description="Selected production credits by year, organized as a working record of scenic design, collaboration, and venue."
                tone="profile"
                size="compact"
              />
            </div>

            <div className="mt-12 space-y-16 md:space-y-20">
              {SCENIC_CREDITS.map((section, sectionIndex) => (
                <AnimatedSection
                  key={section.year}
                  delay={Math.min(sectionIndex * 50, 300)}
                  className="pt-7 md:pt-8"
                >
                  <div className="grid gap-8 md:grid-cols-[8rem_minmax(0,1fr)] md:gap-14 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-20">
                    <h3
                      className="text-[clamp(2.1rem,3.6vw,3.75rem)] font-black uppercase leading-none tracking-[0] text-foreground/88 md:sticky md:top-28 md:self-start"
                      style={{ fontFamily: HOME_DISPLAY_FONT }}
                    >
                      {section.year}
                    </h3>
                    <div className="text-foreground/85">
                      {section.credits.map((credit) => (
                        <ScenicCreditRow
                          key={`${section.year}-${credit.title}-${credit.company}`}
                          credit={credit}
                        />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className={RESUME_SECTION_CLASS}>
            <SectionIntro title="Earlier" tone="profile" size="compact" />

            <div className="mt-6 text-foreground/85">
              {EARLIER_CREDITS.map((credit) => (
                <ScenicCreditRow
                  key={`${credit.title}-${credit.company}`}
                  credit={credit}
                />
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className={RESUME_SECTION_CLASS}>
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <SectionIntro
                title="Assistant Scenic Design"
                description="Selected assistant scenic design credits supporting scenic designers through drafting, model coordination, and production communication."
                tone="profile"
                size="compact"
              />
              <Link
                href={ASSISTANT_SCENIC_DESIGN_PATH}
                className="inline-flex w-fit items-center gap-2 text-[0.98rem] font-semibold tracking-[-0.02em] text-[#496784] underline decoration-[#496784]/24 underline-offset-4 transition-colors hover:text-[#2f4c66] hover:decoration-[#496784]/60"
              >
                View assistant scenic design gallery
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 text-foreground/85">
              {assistantScenicDesignEntries.map((credit) => (
                <p
                  key={credit.anchorId}
                  className={LINE_CLASS}
                >
                  <span className="font-medium italic tracking-[-0.02em] text-foreground/94">
                    {credit.title}
                  </span>
                  <span className="text-foreground/46">Design: {credit.collaborator}</span>
                  <span className="text-foreground/52">{credit.organization}</span>
                </p>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mb-16">
            <h2
              className="text-[1.2rem] font-black uppercase leading-[0.96] tracking-[0] text-foreground/58"
              style={{ fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
            >
              Achievements & Education
            </h2>

            <div className="mt-6 grid gap-x-6 gap-y-4 pt-6 sm:grid-cols-2">
              {achievements.map((item, index) => (
                <div
                  key={item}
                  className="pb-4 text-foreground/82"
                >
                  <p className="inline-flex items-start gap-2">
                    {index === 0 ? (
                      <Award className="mt-0.5 h-4 w-4 text-foreground/62" />
                    ) : (
                      <span className="mt-0.5 h-4 w-4 rounded-full border border-foreground/14" />
                    )}
                    <span>{item}</span>
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

      </section>

      <Footer tone="light" />
    </div>
  );
}
