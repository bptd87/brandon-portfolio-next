export const ASSISTANT_SCENIC_DESIGN_PATH = "/assistant-scenic-design";
export const ASSISTANT_SCENIC_DESIGN_SEO_TITLE =
  "Assistant Scenic Design Credits | Brandon PT Davis";
export const ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION =
  "Assistant scenic design credits supporting Tom Buderwitz and Jo Winiarski across regional theatre, Off-Broadway productions, and Utah Shakespeare Festival.";

export interface AssistantScenicDesignEntry {
  anchorId: string;
  legacyNewsSlugs: string[];
  title: string;
  organization: string;
  collaborator: string;
  role: string;
  date: string;
  excerpt: string;
  coverImageUrl: string;
  coverImageAlt: string;
  location?: string | null;
  externalUrl?: string | null;
  featured?: boolean;
}

export const assistantScenicDesignEntries: AssistantScenicDesignEntry[] = [
  {
    anchorId: "the-play-that-goes-wrong-seattle-rep",
    legacyNewsSlugs: ["assisting-the-play-that-goes-wrong"],
    title: "The Play That Goes Wrong",
    organization: "Seattle Rep",
    collaborator: "Tom Buderwitz",
    role: "Assistant Scenic Designer",
    date: "2025-08-28",
    excerpt:
      "Assistant scenic design credit on Seattle Rep's The Play That Goes Wrong, supporting a precision comedy environment where scenic timing is part of the performance engine.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-2-cover.webp",
    coverImageAlt: "The Play That Goes Wrong at Seattle Rep",
    location: "Seattle, WA",
    externalUrl: "https://www.seattlerep.org/plays/202526-season/the-play-that-goes-wrong",
    featured: true,
  },
  {
    anchorId: "utah-shakespeare-festival-fifth-season",
    legacyNewsSlugs: ["fifth-season-utah-shakespeare-festival"],
    title: "Utah Shakespeare Festival, Fifth Season",
    organization: "Utah Shakespeare Festival",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2025-06-27",
    excerpt:
      "Fifth season of assistant scenic collaboration with Jo Winiarski at Utah Shakespeare Festival, reinforcing continuity, scale management, and high-volume repertory support.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-4-cover.webp",
    coverImageAlt: "Utah Shakespeare Festival fifth season milestone",
    featured: true,
  },
  {
    anchorId: "utah-shakespeare-festival-2025",
    legacyNewsSlugs: ["utah-shakespeare-festival-2025-season"],
    title: "Utah Shakespeare Festival 2025 Season",
    organization: "Utah Shakespeare Festival",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2025-06-15",
    excerpt:
      "Assistant scenic design support for Utah Shakespeare Festival 2025, including The Importance of Being Earnest, A Gentleman's Guide to Love and Murder, and Steel Magnolias.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90005-cover.webp",
    coverImageAlt: "Utah Shakespeare Festival 2025 season",
    featured: true,
  },
  {
    anchorId: "the-book-club-play-cincinnati-playhouse",
    legacyNewsSlugs: ["the-book-club-play-cincinnati-playhouse"],
    title: "The Book Club Play",
    organization: "Cincinnati Playhouse in the Park",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2025-04-20",
    excerpt:
      "Assistant scenic design credit for The Book Club Play at Cincinnati Playhouse in the Park, supporting scenic development, drafting, and design execution.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90007-cover.webp",
    coverImageAlt: "The Book Club Play at Cincinnati Playhouse in the Park",
    featured: true,
  },
  {
    anchorId: "ragtime-ruth-nathan-hale",
    legacyNewsSlugs: ["ragtime-the-ruth-nathan-hale-theater"],
    title: "Ragtime",
    organization: "The Ruth and Nathan Hale Theater",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2025-02-22",
    excerpt:
      "Assistant scenic design support for Ragtime at The Ruth and Nathan Hale Theater, focused on documentation, drafting, and production-ready scenic communication.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90009-cover.webp",
    coverImageAlt: "Ragtime at The Ruth and Nathan Hale Theater",
    featured: true,
  },
  {
    anchorId: "souvenir-pioneer-theatre-company",
    legacyNewsSlugs: ["souvenir-pioneer-theatre-company"],
    title: "Souvenir",
    organization: "Pioneer Theatre Company",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2024-12-21",
    excerpt:
      "Assistant scenic design work for Souvenir at Pioneer Theatre Company, supporting scenic drawings, 3D coordination, and design implementation.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90008-cover.webp",
    coverImageAlt: "Souvenir at Pioneer Theatre Company",
    featured: true,
  },
  {
    anchorId: "jersey-boys-pioneer-theatre-company",
    legacyNewsSlugs: ["jersey-boys-pioneer-theatre"],
    title: "Jersey Boys",
    organization: "Pioneer Theatre Company",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2024-09-28",
    excerpt:
      "Assistant scenic design credit for Jersey Boys at Pioneer Theatre Company, with drafting and 3D model support for a fast-moving, music-driven production.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-120001-cover.webp",
    coverImageAlt: "Jersey Boys at Pioneer Theatre Company",
    location: "Pioneer Theatre Company, Salt Lake City, UT",
    externalUrl: "https://pioneertheatre.org/shows/jersey-boys/",
  },
  {
    anchorId: "utah-shakespeare-festival-2024",
    legacyNewsSlugs: ["utah-shakespeare-festival-2024-season"],
    title: "Utah Shakespeare Festival 2024 Season",
    organization: "Utah Shakespeare Festival",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2024-06-15",
    excerpt:
      "Supporting Jo Winiarski's scenic designs for The Mountaintop and Silent Sky at the Utah Shakespeare Festival.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90004-cover.webp",
    coverImageAlt: "Utah Shakespeare Festival 2024 season",
  },
  {
    anchorId: "natasha-pierre-great-comet-pioneer-theatre",
    legacyNewsSlugs: ["natasha-pierre-great-comet-pioneer-theatre"],
    title: "Natasha, Pierre & The Great Comet of 1812",
    organization: "Pioneer Theatre Company",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2024-05-25",
    excerpt:
      "Assistant scenic design support for Natasha, Pierre & The Great Comet of 1812 at Pioneer Theatre Company, including drafting and production coordination.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90010-cover.webp",
    coverImageAlt: "Natasha, Pierre & The Great Comet of 1812 at Pioneer Theatre Company",
    location: "Pioneer Theatre Company, Salt Lake City, UT",
    externalUrl: "https://pioneertheatre.org/shows/natasha-pierre-the-great-comet-of-1812/",
  },
  {
    anchorId: "native-gardens-pioneer-theatre-company",
    legacyNewsSlugs: ["native-gardens-pioneer-theatre"],
    title: "Native Gardens",
    organization: "Pioneer Theatre Company",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2024-01-27",
    excerpt:
      "Assistant scenic design support for Native Gardens at Pioneer Theatre Company, including detailed drafting and spatial development for two contrasting homes.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-120002-cover.webp",
    coverImageAlt: "Native Gardens at Pioneer Theatre Company",
    location: "Pioneer Theatre Company, Salt Lake City, UT",
    externalUrl: "https://pioneertheatre.org/production/native-gardens/",
  },
  {
    anchorId: "bottle-shock-the-musical",
    legacyNewsSlugs: ["bottle-shock-musical-ccae"],
    title: "Bottle Shock! The Musical",
    organization: "California Center for the Arts, Escondido",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2023-07-12",
    excerpt:
      "Assistant scenic design credit on the world premiere of Bottle Shock! The Musical at California Center for the Arts, Escondido.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-120003-cover.webp",
    coverImageAlt: "Bottle Shock! The Musical at California Center for the Arts, Escondido",
    location: "California Center for the Arts Escondido, Escondido, CA",
    externalUrl: "https://artcenter.org/event/bottleshockthemusical/",
  },
  {
    anchorId: "the-fears-signature-theatre",
    legacyNewsSlugs: ["the-fears-signature-theatre-off-broadway", "assisting-the-fears"],
    title: "The Fears",
    organization: "Signature Theatre",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2023-07-09",
    excerpt:
      "Assistant scenic design work on The Fears at Signature Theatre in New York, supporting execution, communication, and design continuity in an Off-Broadway production context.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90006-cover.webp",
    coverImageAlt: "The Fears at Signature Theatre",
  },
  {
    anchorId: "utah-shakespeare-festival-2023",
    legacyNewsSlugs: ["utah-shakespeare-festival-2023-season"],
    title: "Utah Shakespeare Festival 2023 Season",
    organization: "Utah Shakespeare Festival",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2023-06-15",
    excerpt:
      "Supporting Jo Winiarski's scenic designs for Romeo and Juliet and A Midsummer Night's Dream at the Utah Shakespeare Festival.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio-images/Assistant%20Scenic%20Design/KAR_1163a.jpg",
    coverImageAlt: "Utah Shakespeare Festival 2023 production photo",
  },
  {
    anchorId: "clue-on-stage-dallas-theater-center",
    legacyNewsSlugs: ["clue-on-stage-dallas-theatre-center"],
    title: "Clue: On Stage",
    organization: "Dallas Theater Center",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2022-09-08",
    excerpt:
      "Assistant scenic design work for Clue On Stage at Dallas Theater Center, supporting production drafting, layout coordination, and scenic documentation.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-120005-cover.webp",
    coverImageAlt: "Clue: On Stage at Dallas Theater Center",
    location: "Dallas Theatre Center, Dallas, TX",
    externalUrl: "https://www.dallastheatercenter.org/",
  },
  {
    anchorId: "utah-shakespeare-festival-2022",
    legacyNewsSlugs: ["utah-shakespeare-festival-2022-season"],
    title: "Utah Shakespeare Festival 2022 Season",
    organization: "Utah Shakespeare Festival",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2022-06-15",
    excerpt:
      "Supporting Jo Winiarski's scenic designs for Trouble in Mind, Clue: On Stage, and The Sound of Music during an on-site summer season in Cedar City, Utah.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90002-cover.webp",
    coverImageAlt: "Utah Shakespeare Festival 2022 season",
  },
  {
    anchorId: "a-distinct-society-pioneer-theatre-company",
    legacyNewsSlugs: ["a-distinct-society-pioneer-theatre"],
    title: "A Distinct Society",
    organization: "Pioneer Theatre Company",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2022-06-15",
    excerpt:
      "Assistant scenic design support for the world premiere of A Distinct Society at Pioneer Theatre Company, including drafting and 3D model deliverables.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-120002-cover.webp",
    coverImageAlt: "A Distinct Society at Pioneer Theatre Company",
    location: "Pioneer Theatre Company, Salt Lake City, UT",
    externalUrl: "https://pioneertheatre.org/",
  },
  {
    anchorId: "utah-shakespeare-festival-2021",
    legacyNewsSlugs: ["utah-shakespeare-festival-2021-season"],
    title: "Utah Shakespeare Festival 2021 Season",
    organization: "Utah Shakespeare Festival",
    collaborator: "Jo Winiarski",
    role: "Assistant Scenic Designer",
    date: "2021-06-15",
    excerpt:
      "Supporting Jo Winiarski's scenic designs for The Pirates of Penzance and Ragtime during an on-site summer season in Cedar City, Utah.",
    coverImageUrl:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-90001-cover.webp",
    coverImageAlt: "Utah Shakespeare Festival 2021 season",
  },
];

export const assistantScenicYearRange = (() => {
  const years = assistantScenicDesignEntries.map((entry) => new Date(entry.date).getFullYear());
  return {
    start: Math.min(...years),
    end: Math.max(...years),
  };
})();
