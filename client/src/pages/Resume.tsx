"use client";

import { useMemo, useState } from "react";
import { Link } from "wouter";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

import { Download, Award, GraduationCap, Users } from "lucide-react";
import { getLocalRenderingProjects } from "@shared/localPortfolios";
import { getLocalScenicProjects } from "@shared/localScenicProjects";

type ResumeCredit = {
  title: string;
  director: string;
  company: string;
};

type ResumeYearSection = {
  year: string;
  credits: ResumeCredit[];
};

type PortfolioLink = {
  href: string;
  previewImage: string;
};

type HoverPreview = {
  title: string;
  previewImage: string;
  x: number;
  y: number;
} | null;

const LINE_CLASS =
  "text-[1rem] leading-8 md:grid md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-4";

type PortfolioLookupMaps = {
  byTitle: Map<string, PortfolioLink[]>;
  byTitleAndCompany: Map<string, PortfolioLink[]>;
};

const CREDIT_TITLE_ALIASES: Record<string, string[]> = {
  "spelling bee": ["The 25th Annual Putnam County Spelling Bee"],
  "merry wives of windsor": ["The Merry Wives of Windsor"],
  "man of la mancha": ["The Man of La Mancha"],
  "a funny thing happened": ["A Funny Thing Happened on the Way to the Forum"],
  "tomas and the library lady": ["Tomás and the Library Lady"],
  "loteria": ["¡LOTERIA: GAME ON!"],
  'dial "m" for murder': ["Dial “M” for Murder"],
};

function normalizePortfolioValue(value: string) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/&/g, " and ")
    .replace(/…/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getTitleLookupKeys(title: string) {
  const normalized = normalizePortfolioValue(title);
  if (!normalized) return [];

  const keys = new Set<string>([
    normalized,
    normalized.replace(/^(a|an|the)\s+/, ""),
  ]);

  for (const alias of CREDIT_TITLE_ALIASES[normalized] || []) {
    const aliasNormalized = normalizePortfolioValue(alias);
    if (aliasNormalized) {
      keys.add(aliasNormalized);
      keys.add(aliasNormalized.replace(/^(a|an|the)\s+/, ""));
    }
  }

  return Array.from(keys).filter(Boolean);
}

function pushLookupValue(map: Map<string, PortfolioLink[]>, key: string, value: PortfolioLink) {
  if (!key) return;
  const existing = map.get(key);
  if (existing) {
    existing.push(value);
    return;
  }
  map.set(key, [value]);
}

function buildPortfolioLookup(): PortfolioLookupMaps {
  const byTitle = new Map<string, PortfolioLink[]>();
  const byTitleAndCompany = new Map<string, PortfolioLink[]>();

  const scenicProjects = getLocalScenicProjects().map((project) => ({
    title: project.title,
    company: project.client || "",
    link: {
      href: `/project/${project.slug}`,
      previewImage: project.coverImageUrl || "",
    },
  }));

  const renderingProjects = getLocalRenderingProjects()
    .filter((project) => !project.galleryOnly)
    .map((project) => ({
      title: project.title,
      company: project.client || "",
      link: {
        href: `/projects/rendering/${project.slug}`,
        previewImage: project.coverImageUrl,
      },
    }));

  for (const project of [...scenicProjects, ...renderingProjects]) {
    if (!project.link.previewImage) continue;

    const companyKey = normalizePortfolioValue(project.company);
    for (const titleKey of getTitleLookupKeys(project.title)) {
      pushLookupValue(byTitle, titleKey, project.link);
      if (companyKey) {
        pushLookupValue(byTitleAndCompany, `${titleKey}|${companyKey}`, project.link);
      }
    }
  }

  return { byTitle, byTitleAndCompany };
}

const PORTFOLIO_LOOKUP = buildPortfolioLookup();

const SCENIC_CREDITS: ResumeYearSection[] = [
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

function dedupePortfolioLinks(items: PortfolioLink[]) {
  return items.filter((item, index, array) => array.findIndex((candidate) => candidate.href === item.href) === index);
}

function findLinkedPortfolio(credit: ResumeCredit) {
  const companyKey = normalizePortfolioValue(credit.company);

  for (const titleKey of getTitleLookupKeys(credit.title)) {
    const directMatch = PORTFOLIO_LOOKUP.byTitleAndCompany.get(`${titleKey}|${companyKey}`);
    if (directMatch?.length) return directMatch[0];
  }

  const titleMatches = dedupePortfolioLinks(
    getTitleLookupKeys(credit.title).flatMap((titleKey) => PORTFOLIO_LOOKUP.byTitle.get(titleKey) || [])
  );

  if (titleMatches.length === 1) {
    return titleMatches[0];
  }

  return null;
}

function ScenicCreditRow({
  credit,
  onPreview,
  onPreviewMove,
  onPreviewLeave,
}: {
  credit: ResumeCredit;
  onPreview: (credit: ResumeCredit, x: number, y: number) => void;
  onPreviewMove: (credit: ResumeCredit, x: number, y: number) => void;
  onPreviewLeave: () => void;
}) {
  const linkedProject = findLinkedPortfolio(credit);

  const inner = (
    <>
      <span className="font-medium italic tracking-[-0.02em] text-foreground/94 transition-colors duration-200 group-hover:text-foreground group-focus-visible:text-foreground">
        {credit.title}
      </span>
      <span className="text-foreground/46">{credit.director}</span>
      <span className="text-foreground/52">{credit.company}</span>
    </>
  );

  if (!linkedProject) {
    return <p className={LINE_CLASS}>{inner}</p>;
  }

  return (
    <Link
      href={linkedProject.href}
      className={`${LINE_CLASS} group block cursor-pointer rounded-[0.35rem] transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/25`}
      onMouseEnter={(event) => onPreview(credit, event.clientX, event.clientY)}
      onMouseMove={(event) => onPreviewMove(credit, event.clientX, event.clientY)}
      onMouseLeave={onPreviewLeave}
      onFocus={() => onPreview(credit, window.innerWidth * 0.72, 220)}
      onBlur={onPreviewLeave}
    >
      {inner}
    </Link>
  );
}

export default function Resume() {
  const achievements = [
    "2026 BroadwayWorld Los Angeles Best Scenic Design Nominee",
    "2023 United Scenic Artists Local 829",
    "2020 MFA Scenic Design | University of California Irvine",
    "2010 BFA Theatre Design | Stephens College",
  ];

  const [hoverPreview, setHoverPreview] = useState<HoverPreview>(null);

  const previewStyle = useMemo(() => {
    if (!hoverPreview) return null;

    const previewWidth = 276;
    const previewHeight = 190;
    const gutter = 26;
    const maxX = Math.max(gutter, window.innerWidth - previewWidth - gutter);
    const maxY = Math.max(gutter, window.innerHeight - previewHeight - gutter);

    return {
      left: Math.min(Math.max(hoverPreview.x + 22, gutter), maxX),
      top: Math.min(Math.max(hoverPreview.y - 34, gutter), maxY),
    };
  }, [hoverPreview]);

  function showPreview(credit: ResumeCredit, x: number, y: number) {
    const linkedProject = findLinkedPortfolio(credit);
    if (!linkedProject) return;
    setHoverPreview({
      title: credit.title,
      previewImage: linkedProject.previewImage,
      x,
      y,
    });
  }

  function movePreview(credit: ResumeCredit, x: number, y: number) {
    const linkedProject = findLinkedPortfolio(credit);
    if (!linkedProject) return;
    setHoverPreview((current) =>
      current
        ? { ...current, x, y, title: credit.title, previewImage: linkedProject.previewImage }
        : {
            title: credit.title,
            previewImage: linkedProject.previewImage,
            x,
            y,
          }
    );
  }

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
          description:
            "Professional scenic designer with over 130 realized productions across regional theatre, summer stock, and academic theatre. USA 829 member since 2023. BroadwayWorld Los Angeles Best Scenic Design Nominee (2026).",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
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

      <section className="min-h-screen bg-background pb-20 pt-20">
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="mb-18">
            <div className="grid gap-10 border-b border-border/25 pb-12 xl:grid-cols-[minmax(0,1.12fr)_minmax(18rem,22rem)] xl:items-center">
              <div className="max-w-3xl xl:max-w-4xl">
                <p className="text-[0.95rem] leading-7 text-foreground/72">Resume / CV</p>
                <h1 className="mt-6 max-w-4xl font-sans text-[clamp(3rem,6.4vw,5.85rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                  Resume, CV, and selected scenic design credits.
                </h1>
                <p className="mt-7 max-w-3xl text-[1.05rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                  Scenic design credits across regional theatre, summer stock, academic production,
                  and new work development, with downloadable resume and CV for full reference.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-[0.95rem] text-foreground/72">
                  <a
                    href="https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/Downloads/resume/KZOFqPARnjQauvWm-8d5c0155c1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-background transition-colors hover:bg-foreground/88"
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </a>
                  <a
                    href="https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/Downloads/resume/mSMkRDmbSOQtUykO-58989945e6.pdf"
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
                      <Users className="h-4 w-4" />
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
                      <GraduationCap className="h-4 w-4" />
                      MFA Scenic Design
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full xl:justify-self-end">
                <div className="mx-auto w-full max-w-[26rem] overflow-hidden rounded-[2rem] border border-border/35 bg-card/20 xl:mx-0">
                  <div className="relative aspect-[9/16] w-full">
                    <img
                      src="/assets/about/about-resume-art.png"
                      alt="Abstract cyan resume artwork"
                      className="absolute left-1/2 top-1/2 h-[185%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                  Selected Scenic Design
                </h2>
                <p className="mt-4 max-w-2xl text-[0.98rem] leading-7 text-foreground/58">
                  Selected credits by year. Hover linked productions to preview the matching
                  portfolio entry, then click through to the project page.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-12">
              {SCENIC_CREDITS.map((section) => (
                <div key={section.year} className="border-t border-border/20 pt-6 md:pt-7">
                  <h3 className="font-sans text-[1.28rem] font-medium tracking-[-0.03em] text-foreground/88">
                    {section.year}
                  </h3>
                  <div className="mt-6 space-y-2 text-foreground/85">
                    {section.credits.map((credit) => (
                      <ScenicCreditRow
                        key={`${section.year}-${credit.title}-${credit.company}`}
                        credit={credit}
                        onPreview={showPreview}
                        onPreviewMove={movePreview}
                        onPreviewLeave={() => setHoverPreview(null)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
              Earlier
            </h2>

            <div className="mt-6 space-y-2 border-t border-border/20 pt-6 text-foreground/85 md:pt-7">
              {EARLIER_CREDITS.map((credit) => (
                <ScenicCreditRow
                  key={`${credit.title}-${credit.company}`}
                  credit={credit}
                  onPreview={showPreview}
                  onPreviewMove={movePreview}
                  onPreviewLeave={() => setHoverPreview(null)}
                />
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
              Achievements & Education
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {achievements.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-border/25 bg-card/10 px-4 py-3.5 text-foreground/82"
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
          </div>
        </div>

        {hoverPreview && previewStyle ? (
          <div
            className="pointer-events-none fixed z-50 hidden w-[15rem] overflow-hidden rounded-[0.72rem] border border-white/10 bg-black/88 shadow-[0_22px_50px_rgba(0,0,0,0.45)] backdrop-blur-sm lg:block"
            style={previewStyle}
          >
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={hoverPreview.previewImage}
                alt={`${hoverPreview.title} scenic preview`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}
      </section>

      <Footer />
    </>
  );
}
