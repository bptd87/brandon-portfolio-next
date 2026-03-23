export type LocalScenicProjectMedia = {
  id: string;
  type: "image" | "video";
  imageUrl?: string;
  videoUrl?: string;
  altText: string;
  caption?: string;
  kind?: "cover" | "production" | "rendering";
};

export type LocalScenicProjectTeamMember = {
  name: string;
  role: string;
  url?: string;
};

export type LocalScenicProjectLink = {
  label: string;
  url: string;
};

export type LocalScenicProjectSection =
  | {
      type: "text";
      heading?: string;
      content: string[];
    }
  | {
      type: "gallery";
      heading?: string;
      mediaIds: string[];
    }
  | {
      type: "video";
      heading?: string;
      mediaId: string;
      content?: string[];
    };

export type LocalScenicProject = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  discipline: "scenic_design";
  subcategory?: string | null;
  client?: string | null;
  clientUrl?: string | null;
  location?: string | null;
  year?: number | null;
  month?: number | null;
  status: "published" | "draft" | "archived";
  featured: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  coverImageUrl?: string | null;
  coverImagePosition?: string | null;
  coverImageFit?: "cover" | "contain" | null;
  creativeTeam: LocalScenicProjectTeamMember[];
  tags: Array<{ name: string; slug: string }>;
  links?: LocalScenicProjectLink[];
  media: LocalScenicProjectMedia[];
  sections: LocalScenicProjectSection[];
  createdAt?: string | null;
  updatedAt?: string | null;
  publishedAt?: string | null;
};

const millionDollarQuartet: LocalScenicProject = {
  id: 90087,
  title: "Million Dollar Quartet",
  slug: "million-dollar-quartet",
  excerpt:
    "A co-scenic design for South Coast Repertory’s 2025 production of Million Dollar Quartet, built around the intimacy of Sun Records and the explosive energy of four artists changing music history together.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "South Coast Repertory Theatre",
  clientUrl: "https://www.scr.org/plays/productions/25-26-season/million-dollar-quartet/",
  location: "Costa Mesa, CA",
  year: 2025,
  month: 9,
  status: "published",
  featured: true,
  seoTitle: "Million Dollar Quartet | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Million Dollar Quartet at South Coast Repertory, balancing the intimacy of Sun Records with the scale and electricity of a mythic live jam session.",
  seoKeywords:
    "Million Dollar Quartet, scenic design, South Coast Repertory, musical theatre, Sun Records, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-cover.webp",
  creativeTeam: [
    { name: "Colin Escott and Floyd Mutrux", role: "Book By" },
    { name: "Floyd Mutrux", role: "Original Concept and Direction By" },
    { name: "James Moye", role: "Director" },
    { name: "Kim Martin-Cotten", role: "Associate Director" },
    { name: "Wiley DeWeese", role: "Music Director" },
    { name: "Brandon PT Davis and Efren Delgadillo Jr.", role: "Co-Scenic Designers" },
    { name: "Kish Finnegan", role: "Costume Designer" },
    { name: "Lonnie Rafael Alcaraz", role: "Lighting Designer" },
    { name: "Jeff Polunas", role: "Sound Designer" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "1950s", slug: "1950s" },
    { name: "Rock and Roll", slug: "rock-and-roll" },
    { name: "Regional Theatre", slug: "regional-theatre" },
    { name: "Million Dollar Quartet", slug: "million-dollar-quartet" },
  ],
  links: [
    {
      label: "South Coast Repertory Production",
      url: "https://www.scr.org/plays/productions/25-26-season/million-dollar-quartet/",
    },
  ],
  media: [
    {
      id: "mdq-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-cover.webp",
      altText: "Million Dollar Quartet scenic design cover image.",
      kind: "cover",
    },
    {
      id: "mdq-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150210.webp",
      altText:
        "Cast blocking across the studio set architecture in Million Dollar Quartet at SCR, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "mdq-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150207.webp",
      altText:
        "Performance moment on the Sun Records-inspired set for Million Dollar Quartet at South Coast Repertory, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "mdq-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150223.webp",
      altText:
        "Band-centered stage composition with warm practical lighting in Million Dollar Quartet, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "mdq-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150174.webp",
      altText:
        "Scene work on the vintage studio interior built for Million Dollar Quartet, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "mdq-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150067.webp",
      altText:
        "Onstage action framed by the recording booth and studio details in Million Dollar Quartet, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "mdq-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150108.webp",
      altText:
        "Wide audience-view perspective of the Million Dollar Quartet set at South Coast Repertory, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "mdq-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150190.webp",
      altText:
        "Production image highlighting the full studio footprint for Million Dollar Quartet, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "mdq-video",
      type: "video",
      videoUrl: "https://youtu.be/XMi4Z9oLiNk",
      altText: "Walkthrough video for Million Dollar Quartet scenic design.",
    },
    {
      id: "mdq-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150244.webp",
      altText:
        "Rendering study showing depth, instrument placement, and sightlines for Million Dollar Quartet, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "mdq-render-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150087.webp",
      altText:
        "Early rendering pass for Million Dollar Quartet emphasizing period texture and performance focus, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "mdq-render-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90087-gallery-150123.webp",
      altText:
        "Concept rendering of the period recording studio environment for Million Dollar Quartet, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Inside Sun Records",
      content: [
        "The design invites audiences into Sun Records on the day Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins came together for their legendary jam session. Collaborating with co-scenic designer Efren Delgadillo Jr., director James Moye, and associate director Kim Martin-Cotten, the work balances authenticity with theatricality, capturing both the intimacy of a Memphis studio and the explosive energy of rock and roll in the making.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["mdq-prod-1", "mdq-prod-3"],
    },
    {
      type: "text",
      heading: "The Room as Performance Engine",
      content: [
        "The environment stays detailed and grounded: wood floors, period recording equipment, and control-room windows lined with gold records. At the same time, theatrical elements heighten the musical impact. Chief among them is the illuminated SUN sign, drawn from Elvis concert signage, which lets the studio become both a place of work and a stage for myth.",
        "That double identity was important. The room needed to hold the closeness of a rehearsal space while still supporting the heightened, public feeling of history happening in front of an audience.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["mdq-prod-4", "mdq-prod-5"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The goal was to honor the spirit of collaboration at the heart of the play. The space amplifies the relationships in the room: musicians facing one another, sharing energy, finding rhythm, and pushing boundaries. The set becomes not just a place to perform, but a portrait of how artists influence one another and, together, change the course of American music.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["mdq-prod-6", "mdq-prod-7", "mdq-prod-8"],
    },
    {
      type: "video",
      heading: "Walkthrough",
      mediaId: "mdq-video",
    },
    {
      type: "gallery",
      mediaIds: ["mdq-render-1", "mdq-render-2", "mdq-render-3"],
    },
  ],
  createdAt: "2026-02-07T05:46:01+00:00",
  updatedAt: "2026-02-12T15:03:58+00:00",
};

const glassMenagerie: LocalScenicProject = {
  id: 90010,
  title: "The Glass Menagerie",
  slug: "the-glass-menagerie",
  excerpt:
    "A memory-driven Wingfield apartment for Maples Repertory Theatre, shaped to let fragility, longing, and escape coexist within the same haunted domestic space.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Maples Repertory Theatre",
  location: "Macon, MO",
  year: 2025,
  month: 10,
  status: "published",
  featured: true,
  seoTitle: "The Glass Menagerie | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Glass Menagerie at Maples Repertory Theatre, shaped as a memory play environment that emphasizes emotional geography, fragility, and the pull between domestic enclosure and imagined escape.",
  seoKeywords:
    "The Glass Menagerie, scenic design, Maples Repertory Theatre, Tennessee Williams, Brandon PT Davis, memory play, theatre design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-cover.webp",
  creativeTeam: [
    { name: "Tennessee Williams", role: "By" },
    { name: "Kimberly Braun", role: "Director" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Jack A. Smith", role: "Costume Design" },
    { name: "Vincente Williams", role: "Lighting Design" },
    { name: "Leo Basinger", role: "Sound Design" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Memory Play", slug: "memory-play" },
    { name: "Regional Theatre", slug: "regional-theatre" },
    { name: "The Glass Menagerie", slug: "the-glass-menagerie" },
  ],
  links: [
    {
      label: "Maples Repertory Theatre Production",
      url: "https://maplesrep.com/the-glass-menagerie/",
    },
  ],
  media: [
    {
      id: "gm-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-cover.webp",
      altText: "The Glass Menagerie scenic design cover image.",
      kind: "cover",
    },
    {
      id: "gm-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150121.webp",
      altText: "Stage production photo of scenic design for The Glass Menagerie at Maples Repertory Theatre. View 2.",
      kind: "production",
    },
    {
      id: "gm-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150167.webp",
      altText: "Wide production view of The Glass Menagerie at Maples Repertory Theatre in Macon, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150147.webp",
      altText: "Performance moment centered in the fragile interior world of The Glass Menagerie, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150109.webp",
      altText: "Scene work across the primary platform system in The Glass Menagerie, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150052.webp",
      altText: "Audience perspective of The Glass Menagerie with layered scenic planes, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150084.webp",
      altText: "Actors framed by the memory-play architecture in The Glass Menagerie, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150168.webp",
      altText: "Concept rendering for The Glass Menagerie exploring atmosphere and spatial drift, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "gm-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150020.webp",
      altText: "Production still emphasizing sightlines and negative space in The Glass Menagerie, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-prod-9",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150106.webp",
      altText: "Stage production photo of scenic design for The Glass Menagerie at Maples Repertory Theatre. View 1.",
      kind: "production",
    },
    {
      id: "gm-prod-10",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150095.webp",
      altText: "Full-stage composition showing layered depth in The Glass Menagerie at Maples Repertory Theatre, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-prod-11",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150022.webp",
      altText: "House view of the scenic environment for The Glass Menagerie in Macon, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gm-prod-12",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90010-gallery-150211.webp",
      altText: "Ensemble stage picture inside the poetic world of The Glass Menagerie, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Memory as Space",
      content: [
        "This production of The Glass Menagerie was grounded in the idea of the memory play, not as a literal reconstruction of the Wingfield apartment, but as a fluid, impressionistic landscape shaped by Tom's recollection. From the outset, the design sought to feel unstable and permeable, allowing memory to drift, overlap, and distort rather than lock the play into a fixed domestic realism.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["gm-prod-1", "gm-prod-2"],
    },
    {
      type: "text",
      heading: "Platform and Threshold",
      content: [
        "The central scenic gesture was a large, elevated interior platform that defined the apartment's primary playing space. This platform functioned both practically and metaphorically: it created a clear home base for the action while reinforcing Tom's sense of entrapment within the last place he ever called home. The elevation subtly separated the family from the surrounding world, heightening the emotional pressure of scenes that unfold there.",
        "Surrounding the platform, I developed a series of loosely defined architectural structures, brick fragments, doorways, and thresholds that suggested environment without enclosing it. These elements allowed actors to move freely through the space, supporting the play's fluid shifts between interior and exterior, past and present. The lack of complete walls was intentional; nothing in this world is fully contained.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["gm-prod-3", "gm-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "A key visual component was the memory wall, a collage of framed images depicting fragments of Tom and Laura's past. These images were intentionally vague, grayed photographs with subtle noise and muted color, designed to feel incomplete and unreliable. Rather than illustrating specific moments, they functioned as emotional echoes, reinforcing the idea that memory is selective, fragile, and shaped by longing.",
        "Throughout the process, the design remained focused on supporting the actors and the text. The space was built to breathe, allowing lighting, movement, and performance to activate it. The production photographs reveal how the design held different scales of intimacy: close domestic exchanges, larger ensemble compositions, and moments where the architecture itself seemed to recede into memory. The world was never meant to be fully solid; it was meant to hold pressure and tenderness at the same time.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["gm-prod-5", "gm-prod-7", "gm-prod-8", "gm-prod-9", "gm-prod-10", "gm-prod-11", "gm-prod-12"],
    },
    {
      type: "gallery",
      mediaIds: ["gm-render-1"],
    },
  ],
  createdAt: "2026-02-19T11:01:51.231Z",
  updatedAt: "2026-02-19T11:01:51.231Z",
  publishedAt: "2026-02-19T11:01:51.231Z",
};

const allsWellThatEndsWell: LocalScenicProject = {
  id: 90071,
  title: "All's Well That Ends Well",
  slug: "alls-well-that-ends-well",
  excerpt:
    "Drapery, heraldic detail, and operatic reveal carried this New Swan production between the ceremonial restraint of Roussillon and the warmer theatrical world of Florence.",
  discipline: "scenic_design",
  subcategory: "Shakespeare",
  client: "New Swan Theatre Festival",
  location: "Irvine, CA",
  year: 2025,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "All's Well That Ends Well | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for All's Well That Ends Well at New Swan Theatre Festival, using curtains, heraldic signage, stucco textures, and operatic transitions to shape Shakespeare’s shifting worlds.",
  seoKeywords:
    "All's Well That Ends Well, scenic design, New Swan Theatre Festival, Shakespeare, Brandon PT Davis, theatre design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-cover.webp",
  creativeTeam: [
    { name: "William Shakespeare", role: "By" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Ayrika Johnson", role: "Costume Designer" },
    { name: "Nita Mendoza", role: "Lighting Designer" },
    { name: "Aerik Harbert", role: "Sound Designer" },
    { name: "Rob Salas", role: "Director" },
  ],
  tags: [
    { name: "Shakespeare", slug: "shakespeare" },
    { name: "Classical Theatre", slug: "classical-theatre" },
    { name: "Festival Production", slug: "festival-production" },
    { name: "All's Well That Ends Well", slug: "alls-well-that-ends-well" },
  ],
  links: [
    {
      label: "Culture OC Feature",
      url: "https://www.cultureoc.org/post/double-the-drama-new-swan-s-shakespeare-season-embraces-romance-wit-and-reinvention",
    },
  ],
  media: [
    {
      id: "aw-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-cover.webp",
      altText: "All's Well That Ends Well scenic design cover image.",
      kind: "cover",
    },
    {
      id: "aw-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-gallery-150012.webp",
      altText:
        "Production image from All's Well That Ends Well at New Swan Theatre Festival, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "aw-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-gallery-150047.webp",
      altText:
        "Performance image from All's Well That Ends Well with the New Swan stage world visible, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "aw-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-gallery-150057.webp",
      altText:
        "Stage picture from All's Well That Ends Well at New Swan Theatre Festival, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "aw-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-gallery-150162.webp",
      altText:
        "Stage image from All's Well That Ends Well at New Swan Theatre Festival, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "aw-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-gallery-150178.webp",
      altText:
        "Performance image from All's Well That Ends Well with actor pathways visible, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "aw-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90071-gallery-150229.webp",
      altText:
        "Production image from All's Well That Ends Well at New Swan with cast and scenic world visible, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Curtains as Architecture",
      content: [
        "This production of All’s Well That Ends Well, directed by Rob Salas, was approached through an operatic lens. Rather than relying on heavy architecture, the design treated curtains as the primary engine of transformation, turning drapery into structure, threshold, and spectacle.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["aw-prod-1", "aw-prod-2"],
    },
    {
      type: "text",
      heading: "From Roussillon to Florence",
      content: [
        "In Roussillon, blue drapes and heraldic signage established the French court with clarity and restraint. A pedestal used to present the rings gave the world a ceremonial anchor, something that could return throughout the play and accumulate meaning as the story moved through acts of promise, pursuit, and disguise.",
        "When the action shifted to Florence, the curtains swept back to reveal stucco walls, vines, and topiary elements that instantly warmed the stage. The transition was not just scenic; it changed the emotional temperature of the play, opening a more playful and theatrical environment for romance, deception, and resolution.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["aw-prod-3", "aw-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The central design goal was to let reveal and conceal do the storytelling. Each movement of the drapery had to feel precise and charged, carrying the grand, stylized rhythm of opera while still leaving room for actor movement and comedic clarity. The architecture stayed intentionally light so the audience could feel the stage changing in front of them.",
        "The result was a world that could move between courtly restraint and Mediterranean warmth without losing coherence. The production photographs show how fabric, signage, and garden detail worked together to create a stage picture that was both elegant and flexible, giving Shakespeare’s shifting worlds a strong visual logic without overbuilding them.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["aw-prod-5", "aw-prod-6"],
    },
  ],
  updatedAt: "2026-02-12T15:04:00+00:00",
};

const bellBookAndCandle: LocalScenicProject = {
  id: 90016,
  title: "Bell, Book, and Candle",
  slug: "bell-book-and-candle",
  excerpt:
    "A grounded mid-century apartment for Bell, Book, and Candle, built to let wit, intimacy, and supernatural undertones emerge from a believable domestic interior.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Okoboji Summer Theatre",
  clientUrl: "https://vacationokoboji.com/event/bell-book-and-candle/",
  location: "Okoboji, IA",
  year: 2025,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "Bell, Book, and Candle | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Bell, Book, and Candle at Okoboji Summer Theatre, built as a grounded mid-century apartment that supports intimacy, wit, and subtle magical undertones.",
  seoKeywords:
    "Bell, Book, and Candle, scenic design, Okoboji Summer Theatre, comedy, Brandon PT Davis, theatre design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-cover.webp",
  creativeTeam: [
    { name: "John Van Druten", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Ashley Harrison", role: "Costume Design" },
    { name: "Lennox Emery", role: "Lighting Design" },
    { name: "Anastasiia Didenko", role: "Sound Design" },
    { name: "Richard Biever", role: "Director" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Mid-Century", slug: "mid-century" },
    { name: "Regional Theatre", slug: "regional-theatre" },
    { name: "Bell, Book, and Candle", slug: "bell-book-and-candle" },
  ],
  links: [
    {
      label: "Vacation Okoboji Listing",
      url: "https://vacationokoboji.com/event/bell-book-and-candle/",
    },
  ],
  media: [
    {
      id: "bbc-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-cover.webp",
      altText: "Bell, Book, and Candle scenic design cover image.",
      kind: "cover",
    },
    {
      id: "bbc-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-gallery-150114.webp",
      altText:
        "Production image from Bell, Book, and Candle at Okoboji Summer Theatre, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bbc-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-gallery-150253.webp",
      altText:
        "Stage image from Bell, Book, and Candle showing the domestic apartment world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bbc-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-gallery-150160.webp",
      altText:
        "Performance image from Bell, Book, and Candle within the grounded interior setting, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bbc-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-gallery-150137.webp",
      altText:
        "Production view of Bell, Book, and Candle emphasizing furniture layout and actor pathways, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bbc-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-gallery-150247.webp",
      altText:
        "Stage picture from Bell, Book, and Candle at Okoboji Summer Theatre, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bbc-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90016-gallery-150203.webp",
      altText:
        "Rendering for Bell, Book, and Candle exploring the grounded apartment interior and green mid-century palette, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Room Built for Realism",
      content: [
        "The scenic design for Bell, Book and Candle, directed by Richard Biever, was rooted in realism. The goal was to create a fully realized apartment interior that felt lived-in, functional, and emotionally specific, an environment where the characters could exist naturally and the performances could carry the theatrical weight.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["bbc-prod-1", "bbc-prod-2"],
    },
    {
      type: "text",
      heading: "Domestic Scale and Subtle Magic",
      content: [
        "The space was conceived as a complete room rather than a suggestion of one. Built-in bookshelves, practical doors, and defined wall planes established permanence and weight, while furniture placement supported blocking and sightlines without sacrificing the rhythms of everyday life.",
        "Color shaped the atmosphere in quieter ways. The decision to use green walls gave the apartment warmth and personality without pushing it into stylization. That palette helped the set hold the play’s familiar wit and slight enchantment at the same time, keeping the world grounded while letting the supernatural elements live just beneath the surface.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["bbc-prod-3", "bbc-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Textures and finishes reinforced the realism of the room. Wood flooring, soft furnishings, framed artwork, and practical lighting helped the environment feel curated but not precious. The apartment suggested history and routine, allowing the magical undertones of the story to emerge through action and performance rather than through overt scenic effects.",
        "Ultimately, the design aimed to disappear into the storytelling. By committing fully to realism, the set created a stable world in which humor, relationships, and subtle enchantment could unfold organically.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["bbc-prod-5"],
    },
    {
      type: "gallery",
      mediaIds: ["bbc-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:59+00:00",
};

const muchAdoAboutNothing: LocalScenicProject = {
  id: 90089,
  title: "Much Ado About Nothing",
  slug: "much-ado-about-nothing",
  excerpt:
    "Shakespeare’s romantic comedy reframed through a wild-west visual world of saloon architecture, rough timber, and repertory-friendly frontier detail.",
  discipline: "scenic_design",
  subcategory: "Shakespeare",
  client: "New Swan Theatre Festival",
  clientUrl:
    "https://www.cultureoc.org/post/double-the-drama-new-swan-s-shakespeare-season-embraces-romance-wit-and-reinvention",
  location: "Irvine, CA",
  year: 2025,
  month: 7,
  status: "published",
  featured: true,
  seoTitle: "Much Ado About Nothing | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Much Ado About Nothing at New Swan Theatre Festival, reimagining Shakespeare’s comedy through the language of the spaghetti western and the architecture of a frontier saloon.",
  seoKeywords:
    "Much Ado About Nothing, scenic design, New Swan Theatre Festival, Shakespeare, Brandon PT Davis, western scenic design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90089-cover.webp",
  creativeTeam: [
    { name: "William Shakespeare", role: "By" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Kathryn Poppen", role: "Costume Designer" },
    { name: "Karyn D. Lawrence", role: "Lighting Designer" },
    { name: "Aerik Harbert", role: "Sound Designer" },
    { name: "Eli Simon", role: "Director" },
  ],
  tags: [
    { name: "Shakespeare", slug: "shakespeare" },
    { name: "Comedy", slug: "comedy" },
    { name: "Western", slug: "western" },
    { name: "Much Ado About Nothing", slug: "much-ado-about-nothing" },
  ],
  links: [
    {
      label: "Culture OC Feature",
      url: "https://www.cultureoc.org/post/double-the-drama-new-swan-s-shakespeare-season-embraces-romance-wit-and-reinvention",
    },
  ],
  media: [
    {
      id: "man-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90089-cover.webp",
      altText: "Much Ado About Nothing scenic design cover image.",
      kind: "cover",
    },
    {
      id: "man-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90089-gallery-150032.webp",
      altText:
        "Production image from Much Ado About Nothing at New Swan Theatre Festival, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "man-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90089-gallery-150124.webp",
      altText:
        "Scene transition on the open-air Shakespearean set for Much Ado About Nothing at New Swan, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "man-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90089-gallery-150063.webp",
      altText:
        "Wide stage view of the courtyard-inspired set for Much Ado About Nothing at New Swan Theatre Festival in Irvine, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "man-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90089-gallery-150079.webp",
      altText:
        "Ensemble stage picture framed by the rustic architecture of Much Ado About Nothing, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "man-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90089-gallery-150096.webp",
      altText:
        "Night-lit stage composition showing arches and playing levels in Much Ado About Nothing, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Shakespeare Through a Western Lens",
      content: [
        "This Wild West–inspired production of Much Ado About Nothing, directed by Eli Simon, reimagined Shakespeare’s comedy through the lens of the spaghetti western. The design embraced the grit and romance of the American frontier while staying flexible enough to work within New Swan’s repertory conditions.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["man-prod-1", "man-prod-2"],
    },
    {
      type: "text",
      heading: "Saloon Architecture and Frontier Texture",
      content: [
        "The primary backdrop was a saloon interior, with red wallpaper created using a hand-painted roller to achieve an authentic period texture. At the center stood a bar built from rough wood slabs and barrels, complete with swinging saloon doors, giving the stage a clear focal point that could be quickly struck or reconfigured as the story moved.",
        "Antique signage, weathered finishes, and layered frontier details grounded the world in both history and cinematic influence. The environment needed to hold wit, pursuit, deception, and music without becoming overbuilt, so each scenic element had to do multiple jobs at once.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["man-prod-3", "man-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "By merging Shakespeare’s battles of love and misunderstanding with the visual language of western cinema, the design aimed to create a world that felt playful, textured, and theatrically legible. The saloon backdrop, bar, and signage invited the audience into a dust-filled landscape of gamblers, gunfighters, and lovers while still leaving space for performance to lead.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["man-prod-5"],
    },
  ],
  updatedAt: "2026-02-12T15:04:01+00:00",
};

const guysOnIce: LocalScenicProject = {
  id: 90045,
  title: "Guys on Ice",
  slug: "guys-on-ice",
  excerpt:
    "A playable frozen-lake environment for Guys on Ice, balancing broad musical comedy with the quiet sincerity of Midwestern winter life.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "The Great American Melodrama",
  clientUrl: "https://sloreview.org/2025/02/15/guys-on-ice-is-warm-and-funny/",
  location: "Oceano, CA",
  year: 2025,
  month: 1,
  status: "published",
  featured: true,
  seoTitle: "Guys on Ice | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Guys on Ice at The Great American Melodrama, balancing a playable frozen-lake comedy world with Midwestern specificity, winter texture, and a clear performance environment.",
  seoKeywords:
    "Guys on Ice, scenic design, Great American Melodrama, musical comedy, Brandon PT Davis, theatre design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-cover.webp",
  creativeTeam: [
    { name: "Fred Alley", role: "Book & Lyrics" },
    { name: "James Kaplan", role: "Music" },
    { name: "Andy Hudson", role: "Music Director" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Dan Klarer", role: "Costume Designer" },
    { name: "Cody Soper", role: "Lighting Designer" },
    { name: "Nathan Miklas", role: "Sound Designer" },
    { name: "Dan Klarer", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Comedy", slug: "comedy" },
    { name: "Winter", slug: "winter" },
    { name: "Guys on Ice", slug: "guys-on-ice" },
  ],
  links: [
    {
      label: "SLO Review",
      url: "https://sloreview.org/2025/02/15/guys-on-ice-is-warm-and-funny/",
    },
  ],
  media: [
    {
      id: "goi-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-cover.webp",
      altText: "Guys on Ice scenic design cover image.",
      kind: "cover",
    },
    {
      id: "goi-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-gallery-150164.webp",
      altText:
        "Audience perspective of the completed Guys on Ice set at The Great American Melodrama, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "goi-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-gallery-150062.webp",
      altText:
        "Cast interaction framed by the cabin-inspired scenic world of Guys on Ice, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "goi-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-gallery-150179.webp",
      altText:
        "Wide stage view showing environment and actor pathways in Guys on Ice, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "goi-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-gallery-150163.webp",
      altText:
        "Performance moment across the central scenic playing area in Guys on Ice, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "goi-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-gallery-150156.webp",
      altText:
        "Production image of Guys on Ice at The Great American Melodrama with full set context, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "goi-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90045-gallery-150050.webp",
      altText:
        "Scenic rendering for Guys on Ice with focus on atmosphere, structure, and sightlines, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Frozen-Lake Playing Space",
      content: [
        "For Guys on Ice, the scenic design focused on creating a playable frozen-lake environment that could support both broad comedy and moments of quiet sincerity. The composition balances a strong horizon line and open negative space with practical ice-fishing architecture so performers can move cleanly while the audience always reads relationship dynamics.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["goi-prod-1", "goi-prod-2"],
    },
    {
      type: "text",
      heading: "Midwestern Winter Vernacular",
      content: [
        "Material and texture choices were built around Midwestern winter vernacular, with surfaces suggesting wear, weather, and local history rather than caricature. The design needed to feel specific to place and season while still supporting the comic energy of the piece.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["goi-prod-3", "goi-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The larger goal was to ground the humor in a recognizable world. By keeping the environment legible and specific, the production could hold both the exaggerated rhythms of musical comedy and the quieter emotional texture of friendship, ritual, and community.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["goi-prod-5"],
    },
    {
      type: "gallery",
      mediaIds: ["goi-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:57+00:00",
};

const romero: LocalScenicProject = {
  id: 90077,
  title: "Romero",
  slug: "romero",
  excerpt:
    "The world premiere of Romero was staged as a ritual container for memory, rupture, and spiritual reckoning rather than a literal historical reconstruction.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "University of Missouri",
  clientUrl:
    "https://www.kbia.org/show/the-daily-blend/2025-04-18/the-daily-blend-w-ac-dr-david-crespy-mizzou-theatre-opens-romero",
  location: "Columbia, MO",
  year: 2025,
  month: 1,
  status: "published",
  featured: true,
  seoTitle: "Romero | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Romero at the University of Missouri, shaped as a ritual space for memory, grief, witness, and spiritual rupture.",
  seoKeywords:
    "Romero scenic design, University of Missouri theatre, world premiere scenic design, Brandon PT Davis, ritual staging",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-cover.webp",
  creativeTeam: [
    { name: "Xiomara Cornejo", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Mark Vital", role: "Costume Designer" },
    { name: "Vincete Williams", role: "Lighting Designer" },
    { name: "Michael Webb & Joseph Seevers", role: "Sound Designer" },
    { name: "Cherie Sampson", role: "Projection Design" },
    { name: "Lil Lamberta & Claire Bronchick", role: "Puppetry" },
    { name: "David Crespy", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "World Premiere", slug: "world-premiere" },
    { name: "Political Drama", slug: "political-drama" },
    { name: "Romero", slug: "romero" },
  ],
  links: [
    {
      label: "KBIA Interview",
      url: "https://www.kbia.org/show/the-daily-blend/2025-04-18/the-daily-blend-w-ac-dr-david-crespy-mizzou-theatre-opens-romero",
    },
  ],
  media: [
    {
      id: "rom-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-cover.webp",
      altText: "Romero scenic design cover image.",
      kind: "cover",
    },
    {
      id: "rom-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-gallery-150014.webp",
      altText:
        "Wide house perspective of the Romero set with layered playing spaces, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rom-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-gallery-150117.webp",
      altText:
        "Lighting and scenic texture interplay in a dramatic scene from Romero, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rom-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-gallery-150169.webp",
      altText:
        "Primary stage composition for Romero at University of Missouri, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rom-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-gallery-150192.webp",
      altText:
        "Scene transition across the central platform system in Romero at University of Missouri, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rom-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-gallery-150236.webp",
      altText:
        "Final production view of Romero showing the full environment and actor pathways, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rom-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90077-gallery-150246.webp",
      altText:
        "Actors positioned within the architectural and symbolic scenic world of Romero, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Ritual Rather Than a Reconstruction",
      content: [
        "When I first read Xiomara Cornejo’s Romero, I knew the design had to hold more than history; it had to hold ghosts. Set in the final hours of Archbishop Óscar Romero’s life, the play bends time and invites the dead to speak. It is not realism. It is ritual.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["rom-prod-1", "rom-prod-2"],
    },
    {
      type: "text",
      heading: "Sacredness and Rupture",
      content: [
        "The scenic world emerged from the tension between sacredness and rupture. At the center stood a cruciform arch, part cathedral and part memory portal. Below it, a fractured platform and a textured black floor marked with five-point stars anchored the action in both earth and spirit.",
        "The play’s nonlinear structure demanded a space that could shift between a beach, a church, a war zone, and the afterlife without literal transitions. Projection surfaces echoed the altar at Hospital de la Divina Providencia, while lighting and media traced the line between past and present.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["rom-prod-3", "rom-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Puppeteer Lil Lamberta’s masks and oversized figures punctured realism, while Cherie Sampson’s layered projections grounded each moment in living memory. The entire design was built to support rupture, allowing sudden shifts in tone, time, and identity while still holding the audience.",
        "This was not a play about one man. It was about a nation in spiritual reckoning. Designing Romero meant listening, holding space, and letting the silence speak.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["rom-prod-5", "rom-prod-6"],
    },
  ],
  updatedAt: "2026-02-12T15:03:57+00:00",
};

const urinetownProject: LocalScenicProject = {
  id: 90041,
  title: "Urinetown",
  slug: "urinetown",
  excerpt:
    "A compressed civic machine for Urinetown, industrial, stratified, and sharply theatrical, built to hold the musical’s satire of scarcity, power, and class.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "University of Missouri",
  location: "Columbia, MO",
  year: 2024,
  month: 11,
  status: "published",
  featured: false,
  seoTitle: "Urinetown | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Urinetown at the University of Missouri, using industrial levels, distressed infrastructure, and civic architecture to support satire, power, and ensemble movement.",
  seoKeywords:
    "Urinetown scenic design, University of Missouri theatre, dystopian musical design, Brandon PT Davis, scenic design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-cover.webp",
  creativeTeam: [
    { name: "Mark Hollman", role: "Music & Lyrics by" },
    { name: "Greg Koti", role: "Book & Lyrics by" },
    { name: "Audra Sergel", role: "Music Direction" },
    { name: "Emily Ehling", role: "Choreographed by" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Marc W. Vial II", role: "Costume Designer" },
    { name: "Vincente Williams", role: "Lighting Designer" },
    { name: "Devin Stevenson", role: "Sound Designer" },
    { name: "Joy Powell", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Satire", slug: "satire" },
    { name: "Dystopian", slug: "dystopian" },
    { name: "Urinetown", slug: "urinetown" },
  ],
  links: [],
  media: [
    {
      id: "uri-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-cover.webp",
      altText: "Urinetown scenic design cover image.",
      kind: "cover",
    },
    {
      id: "uri-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150035.webp",
      altText:
        "Production image of Urinetown at University of Missouri with the full scenic footprint, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150049.webp",
      altText:
        "Cast moment on the industrial comic world of Urinetown, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150071.webp",
      altText:
        "Onstage action framed by the urban architecture in Urinetown at Mizzou, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150089.webp",
      altText:
        "Production still of Urinetown highlighting ensemble traffic through the set, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150111.webp",
      altText:
        "Scene transition on the multi-level structure for Urinetown, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150209.webp",
      altText:
        "Performance image of Urinetown with the civic-industrial set framing the cast, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150217.webp",
      altText:
        "House-right audience view of Urinetown at University of Missouri, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-9",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150238.webp",
      altText:
        "Final production angle showing the complete Urinetown scenic composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-prod-10",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150023.webp",
      altText:
        "Stage picture from Urinetown emphasizing texture, levels, and ensemble composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "uri-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150082.webp",
      altText:
        "Scenic rendering for Urinetown testing massing, pathways, and tonal contrast, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "uri-render-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150120.webp",
      altText:
        "Rendering pass for Urinetown establishing geometry and actor flow, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "uri-render-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90041-gallery-150199.webp",
      altText:
        "Perspective rendering of Urinetown with emphasis on depth and silhouette, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Civic Machine",
      content: [
        "Urinetown was designed as a civic machine: industrial, compressed, and deliberately stratified to support the musical’s satire of power, scarcity, and class. Layered levels and clear circulation paths allowed scenes to pivot quickly between public spectacle and private confrontation while preserving visual pressure on the ensemble.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["uri-prod-1", "uri-prod-2"],
    },
    {
      type: "text",
      heading: "Infrastructure as Storytelling",
      content: [
        "The palette and detailing leaned into distressed infrastructure so the environment felt governed, policed, and monetized. Steel framing, elevated offices, and the logic of containment all helped turn the world into an apparatus of control rather than a neutral backdrop.",
        "Transitions were structured to keep momentum high, reinforcing the show’s tonal shift between absurd comedy and political warning. The set needed to support ensemble traffic, musical energy, and abrupt changes in status while always keeping hierarchy visible.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["uri-prod-4", "uri-prod-5"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The overall goal was to make the satire feel both distant and uncomfortably familiar. The architecture had to feel theatrical enough to support the show’s comic exaggeration, but grounded enough that the power structures onstage still felt recognizable.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["uri-prod-6", "uri-prod-7", "uri-prod-8", "uri-prod-9", "uri-prod-10"],
    },
    {
      type: "gallery",
      mediaIds: ["uri-render-1", "uri-render-2", "uri-render-3"],
    },
  ],
  updatedAt: "2026-02-12T15:04:00+00:00",
};

const barefootInTheParkProject: LocalScenicProject = {
  id: 90042,
  title: "Barefoot in the Park",
  slug: "barefoot-in-the-park",
  excerpt:
    "A compact New York walk-up whose scale, stairs, and thresholds turn Barefoot in the Park into a comedy of spatial pressure.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Okoboji Summer Theatre",
  clientUrl: "https://okobojisummertheatre.org/",
  location: "Okoboji, IA",
  year: 2024,
  month: 8,
  status: "published",
  featured: false,
  seoTitle: "Barefoot in the Park | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Barefoot in the Park at Okoboji Summer Theatre, using a compact New York walk-up to support comedy, pressure, and relationship dynamics.",
  seoKeywords:
    "Barefoot in the Park scenic design, Neil Simon, Okoboji Summer Theatre, Brandon PT Davis, comedy scenic design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-cover.webp",
  creativeTeam: [
    { name: "Neil Simon", role: "Book By" },
    { name: "Brett Olson", role: "Director" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Shannon King", role: "Costume Designer" },
    { name: "Lennox Emery", role: "Lighting Designer" },
    { name: "Kayla Slinger", role: "Sound Designer" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Neil Simon", slug: "neil-simon" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Barefoot in the Park", slug: "barefoot-in-the-park" },
  ],
  links: [
    {
      label: "KIWA Radio Listing",
      url: "https://kiwaradio.com/event/okoboji-summer-theatre-presents-barefoot-in-the-park/",
    },
  ],
  media: [
    {
      id: "barefoot-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-cover.webp",
      altText: "Barefoot in the Park scenic design cover image.",
      kind: "cover",
    },
    {
      id: "barefoot-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150044.webp",
      altText:
        "Production image from Barefoot in the Park showing the apartment environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150045.webp",
      altText:
        "Scene from Barefoot in the Park using the walk-up layout for comic staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150048.webp",
      altText:
        "Production still emphasizing the apartment geometry in Barefoot in the Park, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150140.webp",
      altText:
        "Barefoot in the Park production image with actors framed by the compact set, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150158.webp",
      altText:
        "Performance image from Barefoot in the Park showing the apartment in use, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150161.webp",
      altText:
        "Production still highlighting sightlines and furnishing relationships in Barefoot in the Park, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150193.webp",
      altText:
        "Comedy scene from Barefoot in the Park staged through the apartment’s compressed architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150226.webp",
      altText:
        "Final production angle from Barefoot in the Park, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "barefoot-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90042-gallery-150042.webp",
      altText:
        "Scenic rendering for Barefoot in the Park testing the walk-up apartment layout, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A New York Walk-Up",
      content: [
        "The design for Barefoot in the Park centered on a compact New York walk-up that amplifies the play’s emotional temperature through scale, proximity, and verticality. Tight architectural boundaries and selective furnishing choices helped stage the couple’s shifting rhythms while preserving clarity for fast comic timing.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["barefoot-prod-1", "barefoot-prod-2"],
    },
    {
      type: "text",
      heading: "Geometry for Comedy",
      content: [
        "Rather than over-rendering period detail, the scenic approach prioritized playable geometry and social pressure. Doors, stairs, and window relationships all functioned as storytelling tools, giving actors clean pathways for entrances, reversals, and escalating comic friction.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["barefoot-prod-3", "barefoot-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The apartment needed to track the movement from romantic idealism to negotiated partnership without losing the wit of the play. The set works less as a realistic container than as a pressure system, letting architecture shape tempo, intimacy, and the comic stakes of everyday domestic life.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["barefoot-prod-5", "barefoot-prod-6", "barefoot-prod-7", "barefoot-prod-8"],
    },
    {
      type: "gallery",
      mediaIds: ["barefoot-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:58+00:00",
};

const freakyFridayProject: LocalScenicProject = {
  id: 90056,
  title: "Freaky Friday",
  slug: "freaky-friday",
  excerpt:
    "A fast, flexible scenic system for Freaky Friday, designed to hold body-swap comedy, emotional reversals, and high-energy ensemble motion without losing clarity.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Okoboji Summer Theatre",
  clientUrl: "https://okobojisummertheatre.org/",
  location: "Okoboji, IA",
  year: 2024,
  month: 7,
  status: "published",
  featured: true,
  seoTitle: "Freaky Friday | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Freaky Friday at Okoboji Summer Theatre, using modular zones and legible transitions to support comedy, transformation, and musical momentum.",
  seoKeywords:
    "Freaky Friday scenic design, musical theatre scenic design, Okoboji Summer Theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-cover.webp",
  creativeTeam: [
    { name: "Bridget Carpenter", role: "Book By" },
    { name: "Tom Kitt", role: "Music By" },
    { name: "Brian Yorkey", role: "Lyrics By" },
    { name: "Josh Walden", role: "Director / Choreographer" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Zachary Phelps", role: "Costume Designer" },
    { name: "Savannah Bell", role: "Lighting Designer" },
    { name: "Kayla Slinger", role: "Sound Designer" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Comedy", slug: "comedy" },
    { name: "Transformation", slug: "transformation" },
    { name: "Freaky Friday", slug: "freaky-friday" },
  ],
  links: [
    {
      label: "Wyatt Munsey Production Photos",
      url: "https://www.wyattmunsey.com/production-photos/project-three-sng7y-9b7xy",
    },
  ],
  media: [
    {
      id: "freaky-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-cover.webp",
      altText: "Freaky Friday scenic design cover image.",
      kind: "cover",
    },
    {
      id: "freaky-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150101.webp",
      altText:
        "Production image from Freaky Friday showing the scenic environment in action, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "freaky-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150041.webp",
      altText:
        "Scene from Freaky Friday framed by the modular scenic system, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "freaky-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150068.webp",
      altText:
        "Production still emphasizing transitions and stage zones in Freaky Friday, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "freaky-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150130.webp",
      altText:
        "Performance image from Freaky Friday showing scenic flexibility for musical staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "freaky-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150149.webp",
      altText:
        "Freaky Friday production moment using the set’s contemporary domestic and school cues, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "freaky-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150198.webp",
      altText:
        "Production still highlighting ensemble flow through the Freaky Friday set, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "freaky-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150151.webp",
      altText:
        "Final production image from Freaky Friday, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "freaky-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150088.webp",
      altText:
        "Scenic rendering for Freaky Friday testing scenic zones and movement paths, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "freaky-render-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150046.webp",
      altText:
        "Rendering pass for Freaky Friday showing transformation-based scene logic, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "freaky-render-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90056-gallery-150145.webp",
      altText:
        "Perspective rendering for Freaky Friday exploring modular units and tonal contrast, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Transformation in Motion",
      content: [
        "Freaky Friday required a scenic system capable of fast identity shifts, tonal contrast, and high-energy ensemble flow. The design strategy emphasized modular zones and legible transitions so the audience could instantly read changing contexts while performers maintained pace through musical numbers and dialogue scenes.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["freaky-prod-1", "freaky-prod-2"],
    },
    {
      type: "text",
      heading: "Zones for Comedy and Pace",
      content: [
        "The visual language was built around contemporary domestic and school-world cues, with flexible units supporting both intimacy and spectacle. Scenic logic had to stay clear even as the show bounced between emotional sincerity, comic confusion, and ensemble-driven momentum.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["freaky-prod-3", "freaky-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The set was tuned for transformation: spaces had to feel stable enough for character stakes while remaining agile enough for the show’s body-swap mechanics. Rather than locking scenes into realism, the design focused on clarity, speed, and contrast so each shift could land instantly.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["freaky-prod-5", "freaky-prod-6", "freaky-prod-7"],
    },
    {
      type: "gallery",
      mediaIds: ["freaky-render-1", "freaky-render-2", "freaky-render-3"],
    },
  ],
  updatedAt: "2026-02-12T15:03:57+00:00",
};

const anEnemyOfThePeopleProject: LocalScenicProject = {
  id: 27,
  title: "An Enemy of the People",
  slug: "an-enemy-of-the-people",
  excerpt:
    "A grayscale illustrated world punctured by red furniture, making scrutiny feel constant and comfort impossible in An Enemy of the People.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2023,
  month: 10,
  status: "published",
  featured: false,
  seoTitle: "An Enemy of the People | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for An Enemy of the People at Stephens College, using a grayscale illustrated world and red accents to heighten moral tension and exposure.",
  seoKeywords:
    "An Enemy of the People scenic design, Stephens College theatre, Brandon PT Davis, grayscale set design, dramatic theatre scenery",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-6-of-6-7499.webp",
  creativeTeam: [
    { name: "Henrik Ibsen", role: "Book By" },
    { name: "L.R. Hults", role: "Director" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Martha C. Clarke", role: "Costume Design" },
    { name: "Zack Anderson", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Ibsen", slug: "ibsen" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "An Enemy of the People", slug: "an-enemy-of-the-people" },
  ],
  links: [],
  media: [
    {
      id: "enemy-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-6-of-6-7499.webp",
      altText: "An Enemy of the People scenic design cover image.",
      kind: "cover",
    },
    {
      id: "enemy-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-6-of-6-8866.webp",
      altText:
        "Production image from An Enemy of the People showing the grayscale scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "enemy-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-2-of-6-8866.webp",
      altText:
        "Scene from An Enemy of the People framed by the illustrated architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "enemy-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-1-of-6-8866.webp",
      altText:
        "Production still emphasizing the monochrome visual language in An Enemy of the People, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "enemy-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-3-of-6-8866.webp",
      altText:
        "Performance image from An Enemy of the People showing the red furniture against the grayscale world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "enemy-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-4-of-6-8866.webp",
      altText:
        "Final production image from An Enemy of the People, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "enemy-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-enemy-of-the-people-5-of-6-8886.webp",
      altText:
        "Rendering for An Enemy of the People testing the flattened grayscale environment and red focal furniture, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A World Without Comfort",
      content: [
        "For An Enemy of the People at Stephens College, I wanted the world to feel stripped down and confrontational. I kept the entire environment in grayscale, walls, architecture, and floor, treating the space almost like a three-dimensional drawing. The inspiration came from Tokyo’s 2D Cafe, where depth feels flattened and reality feels slightly unstable.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["enemy-prod-1", "enemy-prod-2"],
    },
    {
      type: "text",
      heading: "Architecture as Exposure",
      content: [
        "The backdrop included rough, sketch-like line work that suggested architecture without fully rendering it. It wasn’t about realism. It was about exposure. In a play centered on truth and public scrutiny, I didn’t want the room to provide comfort.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["enemy-prod-3", "enemy-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The only real color in the space came from the red furniture. Those pieces punctured the monochrome world. Red became a visual interruption: pressure, danger, accusation. It made the actors feel like they were standing inside an argument.",
        "The minimal palette forced focus onto performance and language. There was nowhere to hide. The environment felt stark, almost clinical, but still theatrical. The design wasn’t decorative. It was a frame that amplified the play’s themes of power, resistance, and the cost of speaking out.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["enemy-prod-5"],
    },
    {
      type: "gallery",
      mediaIds: ["enemy-render-1"],
    },
  ],
  updatedAt: "2026-03-01T10:26:51.60406+00:00",
};

const dialMForMurderProject: LocalScenicProject = {
  id: 25,
  title: "Dial “M” for Murder",
  slug: "dial-m-for-murder",
  excerpt:
    "An elegant apartment held inside darkness, where every threshold, sightline, and piece of furniture sharpens suspense in Dial “M” for Murder.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Okoboji Summer Theatre",
  clientUrl: "https://okobojisummertheatre.org/",
  location: "Okoboji, IA",
  year: 2023,
  month: 8,
  status: "published",
  featured: false,
  seoTitle: "Dial “M” for Murder | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Dial “M” for Murder at Okoboji Summer Theatre, using a precise apartment interior, negative space, and controlled sightlines to heighten suspense.",
  seoKeywords:
    "Dial M for Murder scenic design, Okoboji Summer Theatre, suspense scenic design, Brandon PT Davis, dramatic apartment set",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-8-of-9-0343.webp",
  creativeTeam: [
    { name: "Frederic Knott", role: "Book By" },
    { name: "Fred Rubeck", role: "Director" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Alice Crist", role: "Lighting Design" },
    { name: "Savannah Bell", role: "Lighting Design" },
    { name: "Kayla Sliger", role: "Sound Design" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Suspense", slug: "suspense" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Dial M for Murder", slug: "dial-m-for-murder" },
  ],
  links: [],
  media: [
    {
      id: "dialm-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-8-of-9-0343.webp",
      altText: "Dial M for Murder scenic design cover image.",
      kind: "cover",
    },
    {
      id: "dialm-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-8-of-9-1391.webp",
      altText:
        "Production image from Dial M for Murder showing the apartment set in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dialm-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-2-of-9-1570.webp",
      altText:
        "Scene from Dial M for Murder framed by the apartment architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dialm-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-5-of-9-1570.webp",
      altText:
        "Production still emphasizing the controlled apartment palette in Dial M for Murder, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dialm-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-7-of-9-1570.webp",
      altText:
        "Performance image from Dial M for Murder using doors and sightlines to build suspense, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dialm-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-4-of-9-1570.webp",
      altText:
        "Dial M for Murder production image showing the room’s centered fireplace and formal composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dialm-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/lindsey-21-1750.webp",
      altText:
        "Production still highlighting the isolated apartment environment in Dial M for Murder, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dialm-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-6-of-9-1570.webp",
      altText:
        "Final production image from Dial M for Murder, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dialm-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-dial-m-for-murder-1-of-9-1570.webp",
      altText:
        "Rendering for Dial M for Murder testing the apartment layout and negative space, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Control as Architecture",
      content: [
        "For Dial “M” for Murder at Okoboji Summer Theatre, I wanted the room to feel precise. This play is about control, who has it, who loses it, and how long that illusion lasts. The apartment of Tony and Margot Wendice needed to look composed and intentional, almost curated.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["dialm-prod-1", "dialm-prod-2"],
    },
    {
      type: "text",
      heading: "Negative Space as Pressure",
      content: [
        "I leaned into clean architectural lines, paneled walls, balanced bookcases, and a centered fireplace to create a sense of order. The palette stayed cool and refined, allowing the actors and lighting to drive emotional shifts. Surrounding the apartment, I let darkness take over. The negative space wasn’t empty, it was pressure. It made the room feel isolated, suspended, and slightly exposed.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["dialm-prod-3", "dialm-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The layout was built around movement and sightlines. Every door, threshold, and furniture placement supported the mechanics of the plot. Suspense in this play is spatial: who can see whom, who can hear what, and who is trapped.",
        "The design avoided clutter because clutter distracts from tension. The apartment felt elegant, but never comfortable. As the story tightened, the room didn’t change, it revealed how fragile that control really was.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["dialm-prod-5", "dialm-prod-6", "dialm-prod-7"],
    },
    {
      type: "gallery",
      mediaIds: ["dialm-render-1"],
    },
  ],
  updatedAt: "2026-03-01T08:59:54.564733+00:00",
};

const coleProject: LocalScenicProject = {
  id: 26,
  title: "Cole",
  slug: "cole",
  excerpt:
    "A late-night jazz-age room for Cole, anchored by a grounded bar, black-and-white tile, and an onstage band so the music feels intimate and sourced from the space itself.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Okoboji Summer Theatre",
  clientUrl: "https://okobojisummertheatre.org/",
  location: "Okoboji, IA",
  year: 2023,
  month: 6,
  status: "published",
  featured: false,
  seoTitle: "Cole | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Cole at Okoboji Summer Theatre, using a jazz-age bar, integrated band, and cabaret intimacy to support Cole Porter’s music.",
  seoKeywords:
    "Cole scenic design, Okoboji Summer Theatre, cabaret scenic design, jazz-age stage design, Brandon PT Davis, musical revue scenery",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-7-of-8-8632.webp",
  creativeTeam: [
    { name: "Benny Green and Alan Strachan", role: "Written By" },
    { name: "Cole Porter", role: "Music By" },
    { name: "Alison Morooney", role: "Director" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Kirsteen Buchanan", role: "Costume Design" },
    { name: "Savannah Bell", role: "Lighting Design" },
    { name: "Kayla Sliger", role: "Sound Design" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Cabaret", slug: "cabaret" },
    { name: "Cole Porter", slug: "cole-porter" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
  ],
  links: [],
  media: [
    {
      id: "cole-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-7-of-8-8632.webp",
      altText: "Cole scenic design cover image.",
      kind: "cover",
    },
    {
      id: "cole-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-7-of-8-9492.webp",
      altText:
        "Production image from Cole showing the jazz-age room and bar, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "cole-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-1-of-8-9656.webp",
      altText:
        "Scene from Cole framed by the cabaret environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "cole-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-2-of-8-9656.webp",
      altText:
        "Production still emphasizing the integrated band and room layout in Cole, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "cole-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-4-of-8-9657.webp",
      altText:
        "Performance image from Cole showing art deco-inspired geometry and proximity, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "cole-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-5-of-8-9657.webp",
      altText:
        "Production image from Cole highlighting choreography and microphone work, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "cole-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-3-of-8-9657.webp",
      altText:
        "Cole production still showing the room’s texture and proportion, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "cole-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-6-of-8-9657.webp",
      altText:
        "Final production image from Cole, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "cole-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2023-cole-8-of-8-9688.webp",
      altText:
        "Rendering for Cole testing the jazz-age room, onstage band, and bar geometry, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Late-Night Room",
      content: [
        "For Cole at Okoboji Summer Theatre, I wanted the audience to feel like they had stepped into a late-night room in the 1920s. Not a museum version of the jazz age, something alive. The foundation was a black-and-white tile floor, rich walnut millwork, and a grounded bar that anchored the room architecturally.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["cole-prod-1", "cole-prod-2"],
    },
    {
      type: "text",
      heading: "Music in the Room",
      content: [
        "The bar wasn’t just decorative. It defined the social hierarchy of the space. It gave performers levels to work on and around, and it created depth across the proscenium. The band lived onstage, fully integrated into the environment. That decision changed the energy immediately. The music didn’t feel underscored, it felt sourced.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["cole-prod-3", "cole-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "I kept the layout relatively open so choreography and microphone work could breathe, but framed it with vertical elements that referenced art deco geometry without becoming ornamental. The design relied on texture and proportion more than decoration.",
        "This production wasn’t about spectacle. It was about proximity. The set created an intimate cabaret atmosphere where Cole Porter’s music could feel conversational, elegant, and just slightly dangerous.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["cole-prod-5", "cole-prod-6", "cole-prod-7"],
    },
    {
      type: "gallery",
      mediaIds: ["cole-render-1"],
    },
  ],
  updatedAt: "2026-03-01T10:13:53.302815+00:00",
};

const headOverHeelsProject: LocalScenicProject = {
  id: 90044,
  title: "Head Over Heels",
  slug: "head-over-heels",
  excerpt:
    "Arcadia reimagined through 1980s club culture, using a modular, high-saturation world that moves with the pulse of the Go-Go’s.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Theatre SilCo",
  location: "Silverthorne, CO",
  year: 2023,
  month: 6,
  status: "published",
  featured: false,
  seoTitle: "Head Over Heels | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Head Over Heels at Theatre SilCo, using club-culture energy, modular scenery, and vibrant color to support transformation, rebellion, and joy.",
  seoKeywords:
    "Head Over Heels scenic design, Theatre SilCo, Brandon PT Davis, musical theatre design, Go-Go's musical, club-inspired stage design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-cover.webp",
  coverImagePosition: "center top",
  coverImageFit: "contain",
  creativeTeam: [
    { name: "Jeff Whitty", role: "Book By" },
    { name: "James Magruder", role: "Adapted By" },
    { name: "The Go-Go’s", role: "Music & Lyrics By" },
    { name: "Timothy Fletcher", role: "Music Direction" },
    { name: "Josh Walden", role: "Directed & Choreographed By" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Melissa Livingston", role: "Costume Designer" },
    { name: "Merle DeWitt III", role: "Lighting Designer" },
    { name: "Hudson Waldrop", role: "Sound Designer" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "The Go-Go's", slug: "the-go-gos" },
    { name: "Queer Theatre", slug: "queer-theatre" },
    { name: "Head Over Heels", slug: "head-over-heels" },
  ],
  links: [
    {
      label: "Summit Daily Listing",
      url: "https://www.summitdaily.com/news/keystone-art-festival-returns-with-1-major-change-and-3-other-things-to-do-in-summit-county-this-weekend/",
    },
  ],
  media: [
    {
      id: "hoh-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-cover.webp",
      altText: "Head Over Heels scenic design cover image.",
      kind: "cover",
    },
    {
      id: "hoh-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-gallery-150097.webp",
      altText:
        "Production image from Head Over Heels showing the modular Arcadian world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "hoh-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-gallery-150127.webp",
      altText:
        "Scene from Head Over Heels framed by vivid color and stylized architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "hoh-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-gallery-150148.webp",
      altText:
        "Production still from Head Over Heels emphasizing club-inspired theatricality, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "hoh-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-gallery-150064.webp",
      altText:
        "Head Over Heels performance image showing the set’s modular scene shifts, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "hoh-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-gallery-150201.webp",
      altText:
        "Production image from Head Over Heels highlighting electric palette and theatrical rhythm, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "hoh-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-gallery-150231.webp",
      altText:
        "Final production image from Head Over Heels, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "hoh-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90044-gallery-150090.webp",
      altText:
        "Rendering for Head Over Heels testing the modular, club-inspired Arcadian world, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Arcadia in Club Color",
      content: [
        "For Head Over Heels, I partnered with director Josh Walden to channel the bold, unapologetic spirit of the Go-Go’s and reimagine ancient Arcadia through the lens of 1980s club culture. We drew from the visual language of New York’s Palladium, where theatre, fashion, and music collided under pulsing lights and graphic intensity.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["hoh-prod-1", "hoh-prod-2"],
    },
    {
      type: "text",
      heading: "A Modular Party",
      content: [
        "The set was built to feel like an immersive party. Pop Art motifs, geometric shapes, and vivid neon-inspired colors formed a modular world that transformed fluidly between scenes. Instead of medieval architecture, we leaned into a playful mashup, columns glowing in electric pinks, castle facades borrowing from record-sleeve graphics rather than stone.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["hoh-prod-3", "hoh-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "A custom high-saturation palette amplified the show’s irreverent tone. Shifting panels, stylized platforms, and dynamic projection elements let each location evolve with the characters’ emotional arcs, creating a visual rhythm that matched the pulse of the Go-Go’s music.",
        "Our goal was to honor the themes of transformation, identity, and freedom while embedding a pop sensibility that felt fresh and theatrical. Whether evoking a dance floor, a throne room, or a forest of fabulous confusion, the design kept its eye on the core: joy, rebellion, and love in all its forms.",
        "Ultimately, the scenic world acted as a visual celebration, of queerness, of musical energy, and of theatre’s power to transport. This wasn’t nostalgia; it was momentum in full technicolor.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["hoh-prod-5", "hoh-prod-6"],
    },
    {
      type: "gallery",
      mediaIds: ["hoh-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:57+00:00",
};

const putnamCountySpellingBeeProject: LocalScenicProject = {
  id: 20,
  title: "The 25th Annual Putnam County Spelling Bee",
  slug: "the-25th-annual-putnam-county-spelling-bee",
  excerpt:
    "A recognizable middle school gymnasium whose plainspoken details ground the awkward humor and surprising sincerity of Spelling Bee.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2023,
  month: 4,
  status: "published",
  featured: false,
  seoTitle: "The 25th Annual Putnam County Spelling Bee | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The 25th Annual Putnam County Spelling Bee at Stephens College, using a detailed middle school gymnasium to support comedy, competition, and emotional sincerity.",
  seoKeywords:
    "Putnam County Spelling Bee scenic design, Stephens College theatre, Brandon PT Davis, musical theatre scenic design, school gymnasium set",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-6-of-6-5514.webp",
  creativeTeam: [
    { name: "Rachael Sheinkin", role: "Book By" },
    { name: "William Finn", role: "Music and Lyrics" },
    { name: "Rebecca Feldman", role: "Conceived By" },
    { name: "Todd Davidson", role: "Director" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Comedy", slug: "comedy" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "Putnam County Spelling Bee", slug: "putnam-county-spelling-bee" },
  ],
  links: [],
  media: [
    {
      id: "spelling-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-6-of-6-5514.webp",
      altText: "The 25th Annual Putnam County Spelling Bee scenic design cover image.",
      kind: "cover",
    },
    {
      id: "spelling-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-5-of-6-7204.webp",
      altText:
        "Production image from The 25th Annual Putnam County Spelling Bee showing the gymnasium set, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "spelling-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-4-of-6-7204.webp",
      altText:
        "Scene from Putnam County Spelling Bee framed by the competition setup, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "spelling-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-1-of-6-7204.webp",
      altText:
        "Production still emphasizing the school-gym atmosphere in Putnam County Spelling Bee, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "spelling-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-2-of-6-7204.webp",
      altText:
        "Performance image from Putnam County Spelling Bee showing the spelling platform and ensemble staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "spelling-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-3-of-6-7204.webp",
      altText:
        "Putnam County Spelling Bee production image highlighting the local sponsor details and gym setting, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "spelling-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2023-spellng-bee-stephens-college-6-of-6-7204.webp",
      altText:
        "Final production image from The 25th Annual Putnam County Spelling Bee, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A School Gym with Stakes",
      content: [
        "For The 25th Annual Putnam County Spelling Bee at Stephens College, the scenic design transformed the stage into a recognizable middle school gymnasium, functional, slightly outdated, and brimming with community pride. The architecture leaned into wood-paneled walls, acoustic panels, mounted basketball hoops, and practical overhead fixtures to evoke the institutional tone of a multipurpose school space.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["spelling-prod-1", "spelling-prod-2"],
    },
    {
      type: "text",
      heading: "Ceremony and Sincerity",
      content: [
        "The composition centered on a raised platform framed by a bold competition banner, allowing the spelling bee to feel both ceremonial and modest. A recessed upstage area created depth while providing flexible staging for musical numbers and ensemble moments. Chairs, tables, and sponsor signage reinforced the local, volunteer-driven atmosphere of the event.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["spelling-prod-3", "spelling-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Material choices were intentionally straightforward: durable finishes, painted surfaces, and clear graphic elements that echoed the sincerity of a school environment. This grounded realism provided contrast to the musical’s vibrant costumes and emotional arcs.",
        "The scenic design supported fast transitions and character-driven comedy while maintaining a cohesive visual world, nostalgic, playful, and rooted in everyday Americana.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["spelling-prod-5", "spelling-prod-6"],
    },
  ],
  updatedAt: "2026-02-27T10:50:09.45356+00:00",
};

const loteriaGameOnProject: LocalScenicProject = {
  id: 90009,
  title: "¡LOTERIA: GAME ON!",
  slug: "loteria-game-on",
  excerpt:
    "Beginning in a suburban basement family room, the design transforms into a vivid Loteria card-world where childhood play, digital spectacle, and cultural memory collide in full view of the audience.",
  discipline: "scenic_design",
  subcategory: "Theatre for Young Audiences",
  client: "Theatre SilCo",
  location: "Silverthorne, CO",
  year: 2023,
  month: 3,
  status: "published",
  featured: false,
  seoTitle: "¡LOTERIA: GAME ON! | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for ¡LOTERIA: GAME ON! at Theatre SilCo, moving from a suburban family basement into a bright, 8-bit-inspired Loteria universe built for theatrical play and young audiences.",
  seoKeywords:
    "Loteria Game On, scenic design, Theatre SilCo, theatre for young audiences, projection design, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-cover.webp",
  creativeTeam: [
    { name: "Mabelle Reynoso", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Lauryn Terceira", role: "Costume Design" },
    { name: "Jesús Lopez", role: "Lighting Design" },
    { name: "Grayson Moreno", role: "Sound Design" },
    { name: "Merle Dewitt", role: "Projection Design" },
    { name: "Sara Rodriguez", role: "Director" },
  ],
  tags: [
    { name: "Theatre for Young Audiences", slug: "theatre-for-young-audiences" },
    { name: "New Work", slug: "new-work" },
    { name: "Projection Design", slug: "projection-design" },
    { name: "Theatre SilCo", slug: "theatre-silco" },
    { name: "Loteria Game On", slug: "loteria-game-on" },
  ],
  links: [
    {
      label: "Mabelle Reynoso Play Page",
      url: "https://www.mabellereynoso.com/loteria-game-on",
    },
  ],
  media: [
    {
      id: "loteria-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-cover.webp",
      altText: "¡LOTERIA: GAME ON! scenic design cover image.",
      kind: "cover",
    },
    {
      id: "loteria-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150069.webp",
      altText:
        "Production image from ¡LOTERIA: GAME ON! showing the basement family-room world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150072.webp",
      altText:
        "Performance image from ¡LOTERIA: GAME ON! with the family-room environment and central playing space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150075.webp",
      altText:
        "Production still from ¡LOTERIA: GAME ON! highlighting the domestic room before transformation, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150086.webp",
      altText:
        "Stage image from ¡LOTERIA: GAME ON! featuring actors within the modular basement set, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150115.webp",
      altText:
        "Production image from ¡LOTERIA: GAME ON! emphasizing the playful theatrical world of the show, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150122.webp",
      altText:
        "Performance image from ¡LOTERIA: GAME ON! showing scenic color and layered stage action, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150153.webp",
      altText:
        "Production still from ¡LOTERIA: GAME ON! highlighting theatrical play and audience-facing composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150213.webp",
      altText:
        "Image from ¡LOTERIA: GAME ON! showing the transformed game-inspired world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-prod-9",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150233.webp",
      altText:
        "Production image from ¡LOTERIA: GAME ON! with performers inside the vibrant scenic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "loteria-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150191.webp",
      altText:
        "Rendering for ¡LOTERIA: GAME ON! showing the family-room environment before transformation, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "loteria-render-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90009-gallery-150222.webp",
      altText:
        "Rendering for ¡LOTERIA: GAME ON! exploring the heightened Loteria card-world, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "From Basement to Game Board",
      content: [
        "The scenic design for ¡LOTERIA: GAME ON! began in a familiar suburban basement family room, the kind of space where a young person might gather with family, retreat into imagination, and build a world of play from whatever is at hand. That realism provided the launch point for the evening, grounding the story before the design expanded into something brighter, faster, and more theatrical.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["loteria-prod-1", "loteria-prod-2"],
    },
    {
      type: "text",
      heading: "Transformation Through Play",
      content: [
        "At the center of the room was a large pillow fort that functioned as both a child-built refuge and a theatrical engine. As the story shifted, the fort and surrounding furniture allowed the basement to transform into a playful 8-bit-inspired Lotería world. The design embraced a game aesthetic without losing the handmade quality of live theatre, letting the stage move between domestic intimacy and heightened spectacle.",
        "Projection became a major storytelling device in that transition. Gaming consoles, cards, and visual effects carried the audience into the rules and rhythm of the game, while keeping the performers at the center of the action rather than burying them inside technology.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["loteria-prod-3", "loteria-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The overall goal was to create a world that felt flexible, playful, and immediately legible to young audiences. Scenic elements needed to support quick shifts in space and tone, while still feeling rooted in the live presence of actors and objects. LED integration, Rosco black light paint, and projection helped push the production into a heightened visual register, but the design always returned to the idea of shared imaginative play.",
        "Rather than separating realism and fantasy, the production treated them as part of the same continuum. The photographs show how the room could open outward into theatrical possibility while still feeling connected to the emotional core of the story.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["loteria-prod-5", "loteria-prod-6", "loteria-prod-7", "loteria-prod-8", "loteria-prod-9"],
    },
    {
      type: "gallery",
      mediaIds: ["loteria-render-1", "loteria-render-2"],
    },
  ],
  updatedAt: "2026-02-12T15:03:56+00:00",
};

const boeingBoeingProject: LocalScenicProject = {
  id: 90054,
  title: "Boeing, Boeing",
  slug: "boeing-boeing",
  excerpt:
    "A sleek Paris apartment turned into a machine for farce, using polished surfaces, calibrated entrances, and escalating comic collapse in Boeing, Boeing.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2023,
  month: 2,
  status: "published",
  featured: false,
  seoTitle: "Boeing, Boeing | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Boeing, Boeing at Stephens College, using midcentury architecture, color, and precise door placement to support the timing and choreography of classic farce.",
  seoKeywords:
    "Boeing Boeing, scenic design, Stephens College, farce, comedy, midcentury modern, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-cover.webp",
  creativeTeam: [
    { name: "Marc Camoletti", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Fae Riemann-Royer", role: "Costume Designer" },
    { name: "Katie Cohen", role: "Lighting Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
    { name: "John Hemphill", role: "Director" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Farce", slug: "farce" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "Boeing, Boeing", slug: "boeing-boeing" },
  ],
  links: [
    {
      label: "Stephens Connect Listing",
      url: "https://stephensconnect.stephens.edu/events",
    },
  ],
  media: [
    {
      id: "boeing-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-cover.webp",
      altText: "Boeing, Boeing scenic design cover image.",
      kind: "cover",
    },
    {
      id: "boeing-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-gallery-150017.webp",
      altText:
        "Production image from Boeing, Boeing showing the midcentury apartment interior, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "boeing-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-gallery-150104.webp",
      altText:
        "Performance image from Boeing, Boeing emphasizing the apartment layout and multiple entrances, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "boeing-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-gallery-150139.webp",
      altText:
        "Rendering for Boeing, Boeing exploring the polished Paris apartment and farce-driven door layout, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "boeing-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-gallery-150141.webp",
      altText:
        "Production still from Boeing, Boeing highlighting the central living room composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "boeing-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-gallery-150185.webp",
      altText:
        "Scene from Boeing, Boeing showing actors moving through the apartment's choreographed doorways, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "boeing-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-gallery-150243.webp",
      altText:
        "Production image from Boeing, Boeing with the apartment's furniture and graphic detail visible, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "boeing-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90054-gallery-150251.webp",
      altText:
        "Final production image from Boeing, Boeing showing the complete scenic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Paris Apartment Built for Farce",
      content: [
        "For Boeing, Boeing, I leaned fully into midcentury modernism to evoke the stylish, high-stakes world of Marc Camoletti’s French farce. A sleek 1960s Paris apartment, defined by clean geometry, rich wood, warm neutrals, and bold accents, became an active comic partner rather than a passive backdrop.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["boeing-prod-1", "boeing-prod-2"],
    },
    {
      type: "text",
      heading: "Timing Through Architecture",
      content: [
        "Bernard’s entry vestibule, framed by blonde brick and anchored by a cobalt-blue front door, served as a visual and rhythmic focal point as lives spiraled into farce. Above, an orange Sputnik chandelier pushed the period language further while heightening the visual tempo of the room. Every furnishing and every angle had to reinforce the image of curated control.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["boeing-prod-3", "boeing-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The apartment was designed around six doors, each positioned to support the timing and choreography essential to farce. Furniture, décor, and circulation patterns had to look elegant while also functioning like a machine. The world projected polish and illusion, but that order was always meant to feel precarious.",
        "As the comedy escalated, subtle visual clues, mismatched details, creeping plants, and the increasing pressure of the architecture, suggested the chaos gathering beneath Bernard’s carefully managed life. The set was never just background; it drove pace, stakes, and absurdity.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["boeing-prod-5", "boeing-prod-6"],
    },
    {
      type: "gallery",
      mediaIds: ["boeing-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:58+00:00",
};

const anInspectorCallsProject: LocalScenicProject = {
  id: 90036,
  title: "An Inspector Calls",
  slug: "an-inspector-calls",
  excerpt:
    "The Birling home rendered as a composed domestic world built to fracture under pressure, with order, sightlines, and entrances serving the play’s moral unraveling.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2022,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "An Inspector Calls | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for An Inspector Calls at Okoboji Summer Theatre, using period restraint, controlled entrances, and unstable domestic order to support Priestley’s moral thriller.",
  seoKeywords:
    "An Inspector Calls, scenic design, Okoboji Summer Theatre, J.B. Priestley, Brandon PT Davis, drama, theatre design",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90036-cover.webp",
  creativeTeam: [
    { name: "J.B. Priestley", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Kirsteen Buchanan", role: "Costume Designer" },
    { name: "Lennox Emery", role: "Lighting Designer" },
    { name: "Stephen Brotebeck", role: "Sound Design" },
    { name: "Stephen Brotebeck", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Period Piece", slug: "period-piece" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "An Inspector Calls", slug: "an-inspector-calls" },
  ],
  links: [
    {
      label: "Lakes News Shopper Listing",
      url: "https://939c9b01811224bb3dcf-d6f090436a6f3838a347f2f22505b78d.ssl.cf5.rackcdn.com/uploads/editions/19979/original_aabc36875119d266f2f8d42af0ae4f5c7af53d2f.pdf",
    },
  ],
  media: [
    {
      id: "inspector-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90036-cover.webp",
      altText: "An Inspector Calls scenic design cover image.",
      kind: "cover",
    },
    {
      id: "inspector-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90036-gallery-150019.webp",
      altText:
        "Production image from An Inspector Calls showing the Birling interior, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "inspector-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90036-gallery-150118.webp",
      altText:
        "Performance image from An Inspector Calls highlighting the domestic world before it begins to fracture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "inspector-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90036-gallery-150134.webp",
      altText:
        "Rendering for An Inspector Calls exploring the poised but unstable domestic interior, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "inspector-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90036-gallery-150183.webp",
      altText:
        "Production still from An Inspector Calls with actors framed by the controlled geometry of the set, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "inspector-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90036-gallery-150221.webp",
      altText:
        "Final production image from An Inspector Calls showing the family under increasing pressure, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Composure on the Surface",
      content: [
        "For An Inspector Calls, the scenic design framed the Birling household as outwardly composed yet structurally unstable. The room needed to project social confidence and domestic order at first glance, while quietly setting up the pressure points that would be exposed as the inspector’s revelations accumulated.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["inspector-prod-1", "inspector-prod-2"],
    },
    {
      type: "text",
      heading: "Interrogation Through Space",
      content: [
        "Sightlines, entrances, and the arrangement of furniture were all calibrated to support the play’s interrogation dynamics. The world had to accommodate drawing-room realism, but also gradually feel less like a protected domestic interior and more like a stage for moral accountability. That shift depended less on visual excess than on control, where people entered, where they could hide, and how the room held tension.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["inspector-prod-3", "inspector-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Period-informed detailing was used with restraint so atmosphere and composition could carry the central tension. The design needed to preserve the social polish of the setting while allowing the audience to feel the instability underneath it. As the evening progressed, the room itself began to feel complicit in the unraveling, an architecture of manners that could no longer protect the family from consequence.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["inspector-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:58+00:00",
};

const theManOfLaManchaProject: LocalScenicProject = {
  id: 22,
  title: "The Man of La Mancha",
  slug: "the-man-of-la-mancha",
  excerpt:
    "A warehouse-inspired found-object environment for Man of La Mancha, letting imagination emerge from raw material, live transformation, and a central ritual playing space.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Lake Dillon Theatre Company",
  location: "Silverthorne, CO",
  year: 2022,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "The Man of La Mancha | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Man of La Mancha at Lake Dillon Theatre Company, using industrial textures, modular construction, and a ritual central arena to support Don Quixote’s world of imagination and resilience.",
  seoKeywords:
    "The Man of La Mancha, scenic design, Lake Dillon Theatre Company, musical theatre, Don Quixote, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2022-man-of-la-mancha-3-of-5-large-4479.webp",
  creativeTeam: [
    { name: "Dale Wasserman", role: "Written by" },
    { name: "Mitch Leigh", role: "Music by" },
    { name: "Joe Darion", role: "Lyrics by" },
    { name: "Len Rhodes", role: "Music Director" },
    { name: "Rachel Leigh Dolan", role: "Choreographer" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Shivanna Sooknanan", role: "Costume Design" },
    { name: "Kenrick Fischer", role: "Lighting Design" },
    { name: "Matthew Eckstein", role: "Sound Design" },
    { name: "Christopher Alleman", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Classics", slug: "classics" },
    { name: "Lake Dillon Theatre Company", slug: "lake-dillon-theatre-company" },
    { name: "The Man of La Mancha", slug: "the-man-of-la-mancha" },
  ],
  links: [],
  media: [
    {
      id: "lamancha-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2022-man-of-la-mancha-3-of-5-large-4479.webp",
      altText: "The Man of La Mancha scenic design cover image.",
      kind: "cover",
    },
    {
      id: "lamancha-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2022-man-of-la-mancha-3-of-5-large-5473.webp",
      altText:
        "Production image from The Man of La Mancha showing the warehouse-inspired playing space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "lamancha-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2022-man-of-la-mancha-2-of-5-large-5474.webp",
      altText:
        "Production image from The Man of La Mancha with industrial textures and modular scenic structure visible, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "lamancha-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2022-man-of-la-mancha-1-of-5-large-5473.webp",
      altText:
        "Performance image from The Man of La Mancha centered in the circular ritual floor pattern, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "lamancha-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2022-man-of-la-mancha-4-of-5-large-5474.webp",
      altText:
        "Production still from The Man of La Mancha with actors and musicians inhabiting the scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "lamancha-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2022-man-of-la-mancha-5-of-5-large-5521.webp",
      altText:
        "Final production image from The Man of La Mancha showing the full found-object warehouse environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A World Built in Front of Us",
      content: [
        "For The Man of La Mancha at Lake Dillon Theatre Company, I didn’t want to build a picturesque Spain. The director and I talked early about the story living inside a warehouse, a space where actors could assemble the world in front of us. That idea shaped everything, making the environment feel raw, performative, and always on the edge of transformation.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["lamancha-prod-1", "lamancha-prod-2"],
    },
    {
      type: "text",
      heading: "Industrial Ritual",
      content: [
        "The brick walls, exposed piping, and steel stair structure weren’t decorative. They grounded the room in something honest and industrial. At the center of the stage, a circular pattern scored into the floor created a playing arena that felt part ritual space and part proving ground. The musicians lived inside the environment rather than outside it, reinforcing the sense that this world was being made in real time.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["lamancha-prod-3", "lamancha-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Upstage, a windmill traced out of industrial pipe was never meant to feel literal. It worked more like an idea projected onto reality, the image of Quixote rather than an object itself. Distressed textures, modular crates, and repurposed materials let transformation come from performance and light rather than scene changes. The set didn’t illustrate fantasy; it asked the audience to create it with us.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["lamancha-prod-5"],
    },
  ],
  updatedAt: "2026-02-28T10:25:58.120028+00:00",
};

const aFunnyThingHappenedProject: LocalScenicProject = {
  id: 90049,
  title: "A Funny Thing Happened on the Way to the Forum",
  slug: "a-funny-thing-happened",
  excerpt:
    "Three heightened Roman façades turned A Funny Thing Happened on the Way to the Forum into a comic machine, balancing classical reference with cartoon-like exaggeration and the speed of farce.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Lake Dillon Theatre Company",
  location: "Silverthorne, CO",
  year: 2022,
  month: 6,
  status: "published",
  featured: false,
  seoTitle: "A Funny Thing Happened on the Way to the Forum | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for A Funny Thing Happened on the Way to the Forum at Lake Dillon Theatre Company, using playful Roman architecture and three distinct house façades to support the pace and absurdity of farce.",
  seoKeywords:
    "A Funny Thing Happened on the Way to the Forum, scenic design, Lake Dillon Theatre Company, musical comedy, farce, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90049-cover.webp",
  creativeTeam: [
    { name: "Stephen Sondheim", role: "Music and Lyrics" },
    { name: "Len Rhodes", role: "Music Director" },
    { name: "Rachel Leigh Dolan", role: "Choreographer" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Rachel Anne Germinario", role: "Costume Designer" },
    { name: "Kenrick Fischer", role: "Lighting Designer" },
    { name: "Matthew Eckstein", role: "Sound Designer" },
    { name: "Mellisa Livingston", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Comedy", slug: "comedy" },
    { name: "Farce", slug: "farce" },
    { name: "A Funny Thing Happened on the Way to the Forum", slug: "a-funny-thing-happened" },
  ],
  links: [
    {
      label: "Summit Daily Listing",
      url: "https://www.summitdaily.com/news/travel-to-ancient-rome-with-a-funny-thing-happened-on-the-way-to-the-forum/",
    },
  ],
  media: [
    {
      id: "forum-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90049-cover.webp",
      altText: "A Funny Thing Happened on the Way to the Forum scenic design cover image.",
      kind: "cover",
    },
    {
      id: "forum-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90049-gallery-150103.webp",
      altText:
        "Production image from Forum showing the trio of Roman house façades, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "forum-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90049-gallery-150216.webp",
      altText:
        "Performance image from Forum with actors moving through the farce-driven Roman architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "forum-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90049-gallery-150228.webp",
      altText:
        "Production still from Forum highlighting the exaggerated façades and playful classical motifs, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "forum-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90049-gallery-150235.webp",
      altText:
        "Final production image from Forum showing the full scenic environment and comic staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "forum-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90049-gallery-150252.webp",
      altText:
        "Rendering for Forum exploring the trio of Roman houses and the heightened comic world, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Three Houses, Three Comic Engines",
      content: [
        "Three houses stood at the center of the design for A Funny Thing Happened on the Way to the Forum: the home of Senex, the lively brothel of Lycus, and the worn, modest dwelling of Erronius. Each façade was rendered in a heightened, cartoon-like style that matched the musical’s farcical humor while still carrying echoes of ancient Rome.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["forum-prod-1", "forum-prod-2"],
    },
    {
      type: "text",
      heading: "Classical Texture, Comic Precision",
      content: [
        "To strike that balance, the design drew from Greco-Roman pottery and decorative motifs. Columns and carved details appeared throughout the architecture, treated with just enough exaggeration to feel witty without tipping into parody. The set needed clarity and flexibility, anchoring comic situations while transforming easily as the farce unfolded.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["forum-prod-3", "forum-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Each house held its own personality: Senex’s home suggested domestic order ready to unravel; Lycus’s façade leaned into flamboyance and theatricality; Erronius’s dwelling offered contrast in its simplicity. Together, the trio formed a visual shorthand for tangled relationships and chaotic schemes.",
        "What tied the design together was its overall sense of exaggeration, architectural features pushed just far enough to feel humorous while preserving the sophistication of a classical world. That blend of whimsy and structure created a stage where disguises, comic chases, and mistaken identities felt perfectly at home.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["forum-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:57+00:00",
};

const tomasAndTheLibraryLadyProject: LocalScenicProject = {
  id: 90039,
  title: "Tomás and the Library Lady",
  slug: "tomas-and-the-library-lady",
  excerpt:
    "Warm, legible spaces for Tomás and the Library Lady, designed to move between domestic reality and imaginative expansion while supporting bilingual storytelling and literacy.",
  discipline: "scenic_design",
  subcategory: "Theatre for Young Audiences",
  client: "Lake Dillon Theatre Company",
  location: "Silverthorne, CO",
  year: 2022,
  month: 3,
  status: "published",
  featured: false,
  seoTitle: "Tomás and the Library Lady | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Tomás and the Library Lady at Lake Dillon Theatre Company, using warm, readable spaces and library motifs as portals into literacy, belonging, and imaginative growth.",
  seoKeywords:
    "Tomás and the Library Lady, scenic design, Lake Dillon Theatre Company, theatre for young audiences, bilingual theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-cover.webp",
  creativeTeam: [
    { name: "Pat Mora", role: "From the Book by" },
    { name: "José Cruz González", role: "Adapted by" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Lauryn Terciera", role: "Costume Designer" },
    { name: "Nita Mendoza", role: "Lighting Designer" },
    { name: "Noel Nichols", role: "Sound Designer" },
    { name: "Jesús López Vargas", role: "Projection Designer" },
    { name: "Sara Rodriguez", role: "Director" },
  ],
  tags: [
    { name: "Theatre for Young Audiences", slug: "theatre-for-young-audiences" },
    { name: "Bilingual Theatre", slug: "bilingual-theatre" },
    { name: "Education", slug: "education" },
    { name: "Tomás and the Library Lady", slug: "tomas-and-the-library-lady" },
  ],
  links: [
    {
      label: "TYA/USA Membership Spotlight",
      url: "https://www.tyausa.org/tya-today/membership-spotlight-april-2024/",
    },
  ],
  media: [
    {
      id: "tomas-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-cover.webp",
      altText: "Tomás and the Library Lady scenic design cover image.",
      kind: "cover",
    },
    {
      id: "tomas-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-gallery-150021.webp",
      altText:
        "Production image from Tomás and the Library Lady showing the welcoming scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "tomas-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-gallery-150030.webp",
      altText:
        "Performance image from Tomás and the Library Lady highlighting the domestic space and storytelling environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "tomas-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-gallery-150034.webp",
      altText:
        "Production still from Tomás and the Library Lady emphasizing movement between intimate and imaginative space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "tomas-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-gallery-150080.webp",
      altText:
        "Stage image from Tomás and the Library Lady showing the library motifs within the scenic design, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "tomas-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-gallery-150092.webp",
      altText:
        "Production image from Tomás and the Library Lady with performers framed by the scenic architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "tomas-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-gallery-150177.webp",
      altText:
        "Final production image from Tomás and the Library Lady showing the complete theatrical environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "tomas-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90039-gallery-150225.webp",
      altText:
        "Rendering for Tomás and the Library Lady exploring the library as a portal of imagination, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Invitation Through Space",
      content: [
        "Tomás and the Library Lady was designed to honor storytelling as an act of invitation. The scenic approach created warm, readable spaces that support bilingual performance, audience access, and fluid movement between domestic reality and imaginative expansion.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["tomas-prod-1", "tomas-prod-2"],
    },
    {
      type: "text",
      heading: "Libraries as Portals",
      content: [
        "Library architecture and visual motifs were treated as portals rather than static background. The goal was to give the production a sense of discovery while maintaining clarity for young audiences, creating an environment where movement, language, and image could work together without overcomplicating the stage picture.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["tomas-prod-3", "tomas-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The design reinforces the play’s core themes of literacy, belonging, and cultural memory. Warmth and legibility were essential, but so was the feeling that the world could open outward into imagination at any moment. The environment needed to welcome the audience in, then reward that openness with theatrical discovery.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["tomas-prod-5", "tomas-prod-6"],
    },
    {
      type: "gallery",
      mediaIds: ["tomas-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:04:01+00:00",
};

const theBaldSopranoProject: LocalScenicProject = {
  id: 90011,
  title: "The Bald Soprano",
  slug: "the-bald-soprano",
  excerpt:
    "An absurd domestic interior bent out of proportion, where scenic and lighting design worked together to turn polite drawing-room order into something unstable, comic, and quietly threatening.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2022,
  month: 1,
  status: "published",
  featured: false,
  seoTitle: "The Bald Soprano | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic and lighting design for The Bald Soprano at Stephens College, featuring a distorted domestic setting that reflects miscommunication, repetition, and the breakdown of meaning.",
  seoKeywords:
    "The Bald Soprano, Eugene Ionesco, scenic design, lighting design, Stephens College, absurdism, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-2d959ef49b.jpeg",
  creativeTeam: [
    { name: "Eugene Ionesco", role: "By" },
    { name: "Brandon PT Davis", role: "Scenic and Lighting Designer" },
    { name: "Briann Johnson", role: "Costume Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
    { name: "Brett Olson", role: "Director" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Absurdism", slug: "absurdism" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "The Bald Soprano", slug: "the-bald-soprano" },
  ],
  media: [
    {
      id: "bald-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-2d959ef49b.jpeg",
      altText: "The Bald Soprano scenic and lighting design cover image.",
      kind: "cover",
    },
    {
      id: "bald-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-caf4556cac.jpg",
      altText:
        "Rendering for The Bald Soprano showing the distorted domestic environment and heightened composition, scenic and lighting design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "bald-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-06201e4480.jpg",
      altText:
        "Production still from The Bald Soprano emphasizing the absurd domestic scale and actor framing, scenic and lighting design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bald-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-39e8a0ac44.jpg",
      altText:
        "Production image from The Bald Soprano showing the fractured drawing-room world in performance, scenic and lighting design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bald-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-8ffd19e8bf.jpeg",
      altText:
        "Performance still from The Bald Soprano highlighting warped domestic architecture and comic tension, scenic and lighting design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bald-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-2d959ef49b.jpeg",
      altText:
        "Production image from The Bald Soprano showing the full scenic composition and heightened lighting contrast, scenic and lighting design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bald-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-bald-soprano/the-bald-soprano-33fb979f6b.jpeg",
      altText:
        "Final production image from The Bald Soprano showing the absurd domestic setting in performance, scenic and lighting design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Distorted Drawing Room",
      content: [
        "The Bald Soprano called for a domestic world that felt recognizable at first glance, then increasingly unstable the longer the audience sat with it. For Stephens College, the scenic and lighting design approached the room as an absurd drawing-room interior pushed slightly out of alignment, a polite domestic setting that could no longer support the logic it claimed to represent.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["bald-prod-2", "bald-prod-3"],
    },
    {
      type: "text",
      heading: "Miscommunication in Space",
      content: [
        "Because the play is built on repetition, interruption, and the collapse of ordinary language, proportion and composition became central design tools. The environment leaned into distortion rather than realism, allowing furniture, architecture, and light to reinforce the feeling that communication had broken down inside a room still trying to perform civility.",
        "Lighting was treated as part of that same architecture. Instead of simply illuminating the room, it sharpened awkward pauses, exaggerated tonal shifts, and helped the domestic image slide from familiar to surreal.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["bald-prod-4", "bald-prod-5"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The goal was to build an absurdist environment that could hold both comedy and unease. The world needed to feel visually coherent enough for the audience to enter it, but unstable enough to reflect the play's deeper concern with ritualized speech, failed understanding, and the breakdown of meaning itself.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["bald-prod-6"],
    },
    {
      type: "gallery",
      mediaIds: ["bald-prod-1"],
    },
  ],
  updatedAt: "2026-03-23T18:30:00.000Z",
};

const notNowDarlingProject: LocalScenicProject = {
  id: 90012,
  title: "Not Now, Darling",
  slug: "not-now-darling",
  excerpt:
    "A British boutique interior sharpened with Wes Anderson-inspired color and farce-ready door logic, giving Not Now, Darling a polished comic world built for speed, confusion, and precision.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2018,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "Not Now, Darling | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Not Now, Darling at Okoboji Summer Theatre, blending British elegance with Wes Anderson-inspired color and farce-ready architecture.",
  seoKeywords:
    "Not Now, Darling, scenic design, Okoboji Summer Theatre, comedy, farce, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/not-now-darling/not-now-darling-06dc38d64a.jpg",
  creativeTeam: [
    { name: "Ray Cooney and John Chapman", role: "Written By" },
    { name: "Fred Rubeck", role: "Director" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Ashley Harrison", role: "Costume Designer" },
    { name: "Savannah Bell", role: "Lighting Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Farce", slug: "farce" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Not Now, Darling", slug: "not-now-darling" },
  ],
  media: [
    {
      id: "darling-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/not-now-darling/not-now-darling-06dc38d64a.jpg",
      altText: "Not Now, Darling scenic design cover image.",
      kind: "cover",
    },
    {
      id: "darling-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/not-now-darling/not-now-darling-fdeaa527ac.jpg",
      altText:
        "Production image from Not Now, Darling showing the polished boutique interior and farce architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "darling-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/not-now-darling/not-now-darling-06dc38d64a.jpg",
      altText:
        "Production still from Not Now, Darling emphasizing British elegance, color, and choreographed door placement, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "darling-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/not-now-darling/not-now-darling-e1d080dc14.jpg",
      altText:
        "Final production image from Not Now, Darling showing the full comic boutique environment in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Boutique Built for Farce",
      content: [
        "For Not Now, Darling at Okoboji Summer Theatre, the scenic design centered on a polished British boutique interior engineered for comic confusion. The world needed to feel elegant enough to support the play's upper-crust veneer, but also clear and nimble enough to sustain the speed, hiding, and rapid reversals that farce demands.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["darling-prod-1", "darling-prod-2", "darling-prod-3"],
    },
    {
      type: "text",
      heading: "Color, Precision, and Timing",
      content: [
        "The palette leaned into Wes Anderson-inspired color relationships, using controlled contrast and visual polish to sharpen the heightened comedy without losing the setting's retail specificity. Doors and thresholds remained essential compositional devices, giving actors the clean entrances, exits, and near-misses that make this kind of comedy feel effortless when it is actually tightly engineered.",
        "The design goal was to create a world that looked refined on the surface while functioning like a comic machine underneath. That balance between elegance and precision gave the production a lively visual rhythm and supported the play's escalating misunderstandings with architectural clarity.",
      ],
    },
  ],
  updatedAt: "2026-03-23T19:05:00.000Z",
};

const bingoTheWinningMusicalProject: LocalScenicProject = {
  id: 90013,
  title: "Bingo: The Winning Musical",
  slug: "bingo-the-winning-musical",
  excerpt:
    "A playful nautical world for Okoboji Summer Theatre, using lakeside color, retail-comedy brightness, and musical-theatre clarity to support the show's fast humor and local charm.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2013,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "Bingo: The Winning Musical | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Bingo: The Winning Musical at Okoboji Summer Theatre, blending nautical themes with playful color to capture the spirit of the Okoboji Lakes region.",
  seoKeywords:
    "Bingo The Winning Musical, scenic design, Okoboji Summer Theatre, musical theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/bingo-the-winning-musical/bingo-the-winning-musical-dfa9f8cd99.jpeg",
  creativeTeam: [
    {
      name: "Michael Heitzman, Ilene Reid, and David Holcenberg",
      role: "Music and Lyrics By",
    },
    { name: "Michael Heitzman and Ilene Reid", role: "Book By" },
    { name: "Andrew David Sotomayor", role: "Music Director" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Kirsteen Buchanan", role: "Costume Designer" },
    { name: "Justin Hoffecker", role: "Lighting Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
    { name: "Dylan Bean", role: "Projection Design" },
    { name: "Tricia Brouk", role: "Directed and Choreographed By" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Comedy", slug: "comedy" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Bingo: The Winning Musical", slug: "bingo-the-winning-musical" },
  ],
  media: [
    {
      id: "bingo-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/bingo-the-winning-musical/bingo-the-winning-musical-dfa9f8cd99.jpeg",
      altText: "Bingo: The Winning Musical scenic design cover image.",
      kind: "cover",
    },
    {
      id: "bingo-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/bingo-the-winning-musical/bingo-the-winning-musical-f0bb8f349b.jpg",
      altText:
        "Production image from Bingo: The Winning Musical showing the bright nautical-inspired scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bingo-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/bingo-the-winning-musical/bingo-the-winning-musical-f4c0047f35.jpg",
      altText:
        "Production still from Bingo: The Winning Musical emphasizing playful color and musical-theatre staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "bingo-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/bingo-the-winning-musical/bingo-the-winning-musical-f7f07b768a.jpg",
      altText:
        "Final production image from Bingo: The Winning Musical showing the full Okoboji-inspired environment in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Okoboji Through a Playful Lens",
      content: [
        "For Bingo: The Winning Musical at Okoboji Summer Theatre, the scenic design pulled from the spirit of the Okoboji Lakes region rather than treating the world as a generic community-hall comedy. Nautical motifs, cheerful color, and a polished sense of playful charm helped the production feel rooted in place while still serving the heightened rhythm of musical theatre.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["bingo-prod-1", "bingo-prod-2", "bingo-prod-3"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The goal was to support the show's lively pace with a world that was bright, legible, and theatrically generous. The design needed enough specificity to evoke the character of the region, but enough clarity and openness to keep musical storytelling moving cleanly. That balance between local flavor and compositional simplicity gave the production its buoyant comic energy.",
      ],
    },
  ],
  updatedAt: "2026-03-23T19:18:00.000Z",
};

const completeWorksAbridgedProject: LocalScenicProject = {
  id: 90014,
  title: "The Complete Works of William Shakespeare (abridged)",
  slug: "the-complete-works-of-william-shakespeare-abridged",
  excerpt:
    "A playful, modular comic set built for speed, theatrical irreverence, and rapid-fire transitions through Shakespeare’s canon.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2014,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "The Complete Works of William Shakespeare (abridged) | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Complete Works of William Shakespeare (abridged) at Okoboji Summer Theatre, featuring a playful and modular set built for fast transitions and comic energy.",
  seoKeywords:
    "The Complete Works of William Shakespeare abridged, scenic design, Okoboji Summer Theatre, comedy, Shakespeare, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-complete-works-of-william-shakespeare-abridged/the-complete-works-of-william-shakespeare-abridged-fcc6f3ed4f.jpg",
  creativeTeam: [
    { name: "Adam Long, Daniel Singer, and Jess Winfield", role: "Written By" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Theresa Hartman", role: "Costume Designer" },
    { name: "Justin Hoffecker", role: "Lighting Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
    { name: "David Davalos", role: "Director" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Shakespeare", slug: "shakespeare" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    {
      name: "The Complete Works of William Shakespeare (abridged)",
      slug: "the-complete-works-of-william-shakespeare-abridged",
    },
  ],
  media: [
    {
      id: "complete-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-complete-works-of-william-shakespeare-abridged/the-complete-works-of-william-shakespeare-abridged-fcc6f3ed4f.jpg",
      altText: "The Complete Works of William Shakespeare (abridged) scenic design cover image.",
      kind: "cover",
    },
    {
      id: "complete-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-complete-works-of-william-shakespeare-abridged/the-complete-works-of-william-shakespeare-abridged-7160001f26.jpg",
      altText:
        "Production image from The Complete Works of William Shakespeare (abridged) showing the modular comic stage environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "complete-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-complete-works-of-william-shakespeare-abridged/the-complete-works-of-william-shakespeare-abridged-9ba7165f14.jpg",
      altText:
        "Production still from The Complete Works of William Shakespeare (abridged) highlighting fast-paced theatrical transitions, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "complete-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-complete-works-of-william-shakespeare-abridged/the-complete-works-of-william-shakespeare-abridged-5f6ec9e90b.jpg",
      altText:
        "Production image from The Complete Works of William Shakespeare (abridged) showing the comic ensemble within the scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "complete-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-complete-works-of-william-shakespeare-abridged/the-complete-works-of-william-shakespeare-abridged-b0e77e71fe.jpg",
      altText:
        "Final production image from The Complete Works of William Shakespeare (abridged) emphasizing the playful modular environment and comic momentum, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Modular World for Comic Velocity",
      content: [
        "For The Complete Works of William Shakespeare (abridged) at Okoboji Summer Theatre, the scenic design embraced the playful and irreverent spirit of the show. The set was conceived as a modular comic machine, able to pivot quickly through Shakespeare's iconic works without slowing the production's momentum or flattening its theatrical humor.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["complete-prod-1", "complete-prod-2"],
    },
    {
      type: "text",
      heading: "Fast Transitions, Bold Compositions",
      content: [
        "Because the show depends on rapid-fire shifts in style, reference, and performance mode, the environment prioritized flexibility and legibility. Bold visual elements, clear staging zones, and a dynamic layout gave the actors room for physical comedy and improvisational energy while keeping the storytelling readable for the audience.",
        "The goal was not to illustrate every Shakespearean world literally, but to provide a scenic structure that could absorb chaos, parody, and theatrical invention. That modularity let the production celebrate the speed, humor, and affectionate irreverence at the center of the piece.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["complete-prod-3", "complete-prod-4"],
    },
  ],
  updatedAt: "2026-03-23T19:28:00.000Z",
};

const theMerryWivesOfWindsorProject: LocalScenicProject = {
  id: 90053,
  title: "The Merry Wives of Windsor",
  slug: "the-merry-wives-of-windsor",
  excerpt:
    "Shakespeare’s comedy reframed as a campy 1950s sitcom, with bold color, graphic framing, and flown doors giving Merry Wives a faster, more cinematic rhythm.",
  discipline: "scenic_design",
  subcategory: "Shakespeare",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2022,
  month: 2,
  status: "published",
  featured: false,
  seoTitle: "The Merry Wives of Windsor | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Merry Wives of Windsor at Stephens College, reimagined through the campy visual language of a 1950s sitcom with flown color doors, graphic framing, and playful theatrical transitions.",
  seoKeywords:
    "The Merry Wives of Windsor, scenic design, Stephens College, Shakespeare, comedy, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-cover.webp",
  creativeTeam: [
    { name: "William Shakespeare", role: "By" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Alice Crist", role: "Costume Designer" },
    { name: "Lennox Emery", role: "Lighting Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
    { name: "Jamey Grisham", role: "Director" },
  ],
  tags: [
    { name: "Shakespeare", slug: "shakespeare" },
    { name: "Comedy", slug: "comedy" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "The Merry Wives of Windsor", slug: "the-merry-wives-of-windsor" },
  ],
  links: [
    {
      label: "Season Listing",
      url: "https://www.patreon.com/posts/there-is-here-71725274",
    },
  ],
  media: [
    {
      id: "wives-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-cover.webp",
      altText: "The Merry Wives of Windsor scenic design cover image.",
      kind: "cover",
    },
    {
      id: "wives-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150015.webp",
      altText:
        "Rendering for The Merry Wives of Windsor exploring the comic civic world and open architecture, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "wives-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150051.webp",
      altText:
        "Production image from The Merry Wives of Windsor showing the shared scenic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wives-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150074.webp",
      altText:
        "Performance image from The Merry Wives of Windsor with actors moving through the public playing space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wives-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150170.webp",
      altText:
        "Production still from The Merry Wives of Windsor highlighting doorways, concealment, and comic staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wives-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150181.webp",
      altText:
        "Stage image from The Merry Wives of Windsor showing architectural framing and ensemble action, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wives-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150197.webp",
      altText:
        "Production image from The Merry Wives of Windsor emphasizing shared civic space and comic movement, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wives-render-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150212.webp",
      altText:
        "Rendering for The Merry Wives of Windsor studying the scenic composition and pathways for farce, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "wives-render-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150218.webp",
      altText:
        "Rendering for The Merry Wives of Windsor showing the social world and threshold-driven scenic logic, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "wives-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150237.webp",
      altText:
        "Production image from The Merry Wives of Windsor highlighting the playful public atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wives-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90053-gallery-150250.webp",
      altText:
        "Final production image from The Merry Wives of Windsor showing the complete scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Shakespeare Sitcom",
      content: [
        "The Merry Wives of Windsor was approached through the lens of a campy 1950s sitcom. Rather than treating Windsor as a purely historical townscape, the design leaned into bright theatrical framing, heightened perspective, and a comic visual language that could support quick reversals, overheard schemes, and the playful energy of the production.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["wives-prod-1", "wives-prod-2"],
    },
    {
      type: "text",
      heading: "Color, Portals, and Transitions",
      content: [
        "A central green wall with a circular portal created the primary visual anchor of the set, giving actors a clean, memorable entrance point at center while reinforcing the graphic, stylized tone of the world. To help the show feel more cinematic, each scene was marked by a different brightly colored door that could fly in, turning transitions into part of the theatrical joke rather than something to hide.",
        "Those flown doors gave each location its own comic identity while keeping the stage open and flexible. The effect was playful and crisp: scenes could shift quickly, rhythms could stay alive, and the visual world kept reinforcing the sitcom energy of the production.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["wives-prod-3", "wives-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The goal was to make the production feel nimble, campy, and audience-facing without losing the mechanics of Shakespeare’s comedy. Scenic composition had to support eavesdropping, concealment, and surprise, but it also needed to deliver a bold visual joke the moment a new scene arrived.",
        "By combining the flown color doors, the central portal wall, and a heightened 1950s perspective, the set created a world that felt theatrical, witty, and immediately legible. The comedy could move fast, and the design moved with it.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["wives-prod-5", "wives-prod-6", "wives-prod-7"],
    },
    {
      type: "gallery",
      mediaIds: ["wives-render-1", "wives-render-2", "wives-render-3"],
    },
  ],
  updatedAt: "2026-02-12T15:03:59+00:00",
};

const theMarvelousWonderettesDreamOnProject: LocalScenicProject = {
  id: 24,
  title: "The Marvelous Wonderettes: Dream On",
  slug: "the-marvelous-wonderettes-dream-on",
  excerpt:
    "A familiar high school gym stage becomes a container for time, letting 1960s polish shift into 1970s warmth, nostalgia, and reunion energy in Wonderettes: Dream On.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2021,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "The Marvelous Wonderettes: Dream On | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Marvelous Wonderettes: Dream On at Okoboji Summer Theatre, using a high school reunion gym that evolves from early-1960s polish into 1970s nostalgia.",
  seoKeywords:
    "The Marvelous Wonderettes Dream On, scenic design, Okoboji Summer Theatre, musical theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-2-of-10-4679.webp",
  creativeTeam: [
    { name: "Roger Bean", role: "Written by" },
    { name: "Tom Andes", role: "Music Director" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Asher Lipscomb", role: "Costume Design" },
    { name: "Savannah Bell", role: "Lighting Design" },
    { name: "Austen Yim", role: "Sound Design" },
    { name: "Lauren Haughton", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Jukebox Musical", slug: "jukebox-musical" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "The Marvelous Wonderettes: Dream On", slug: "the-marvelous-wonderettes-dream-on" },
  ],
  links: [],
  media: [
    {
      id: "wonderettes-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-2-of-10-4679.webp",
      altText: "The Marvelous Wonderettes: Dream On scenic design cover image.",
      kind: "cover",
    },
    {
      id: "wonderettes-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-1-of-10-5746.webp",
      altText:
        "Production image from The Marvelous Wonderettes: Dream On showing the reunion gym stage, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wonderettes-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-2-of-10-5746.webp",
      altText:
        "Production image from The Marvelous Wonderettes: Dream On highlighting the polished 1960s reunion atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wonderettes-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-3-of-10-5785.webp",
      altText:
        "Performance image from The Marvelous Wonderettes: Dream On with the reunion stage and period details visible, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wonderettes-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-4-of-10-5870.webp",
      altText:
        "Production still from The Marvelous Wonderettes: Dream On emphasizing the gym architecture and stage composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wonderettes-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-6-of-10-5870.webp",
      altText:
        "Production image from The Marvelous Wonderettes: Dream On showing the warmer later-decade palette and reunion staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wonderettes-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-8-of-10-5870.webp",
      altText:
        "Final production image from The Marvelous Wonderettes: Dream On showing the complete reunion environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "wonderettes-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2021-marvelous-wonderettes-photo-call-7-of-10-5870.webp",
      altText:
        "Rendering for The Marvelous Wonderettes: Dream On exploring the reunion stage environment and period atmosphere, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Gym as a Memory Container",
      content: [
        "For The Marvelous Wonderettes: Dream On at Okoboji Summer Theatre, the setting is a reunion, but it is really about time. The design was built around a recognizable high school gym stage: wood paneling, risers, school signage, and those rectangular basketball backboards that immediately signal mid-century Americana.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["wonderettes-prod-1", "wonderettes-prod-2"],
    },
    {
      type: "text",
      heading: "The Structure Stayed, the Tone Shifted",
      content: [
        "The structure did not change between acts. The gym stayed the gym. What changed was tone. Act One leaned into the early 1960s with clean lines, controlled color, and a polished reunion atmosphere framed by tinsel and a crescent motif that made the performers feel almost like a televised variety act.",
        "By Act Two, the space loosened. The palette warmed, balloon arches appeared, and the lighting embraced deeper saturation. The 1970s energy felt more personal and less formal, allowing the environment to age with the characters without needing a complete scenic transformation.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["wonderettes-prod-3", "wonderettes-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "I was not interested in parodying the decades. The goal was for the audience to recognize the space immediately and then feel it evolve. The gym became a container for memory, structured, familiar, and slowly shifting as the Wonderettes revisited who they were and who they became.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["wonderettes-prod-5", "wonderettes-prod-6"],
    },
    {
      type: "gallery",
      mediaIds: ["wonderettes-render-1"],
    },
  ],
  updatedAt: "2026-02-28T21:00:18.614718+00:00",
};

const thePenelopiadProject: LocalScenicProject = {
  id: 90051,
  title: "The Penelopiad",
  slug: "the-penelopiad",
  excerpt:
    "A ritual memory space for The Penelopiad, where Penelope and the maids testify within the same visual architecture, balancing epic framing with intimate address.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "University of California Irvine",
  location: "Irvine, CA",
  year: 2020,
  month: 2,
  status: "published",
  featured: true,
  seoTitle: "The Penelopiad | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Penelopiad at University of California Irvine, building a ritual memory space for testimony, chorus visibility, and layered mythic staging.",
  seoKeywords:
    "The Penelopiad, scenic design, UC Irvine, Margaret Atwood, classical theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-cover.webp",
  creativeTeam: [
    { name: "Margaret Atwood", role: "Playwright" },
    { name: "Luke Shepherd", role: "Composer" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Sarah Monaghan", role: "Costume Designer" },
    { name: "Avery Reagan", role: "Lighting Designer" },
    { name: "Jack Bueermann", role: "Sound Designer" },
    { name: "Merle DeWitt III", role: "Projection Design" },
    { name: "Sara Rodriguez", role: "Director" },
  ],
  tags: [
    { name: "Classical Theatre", slug: "classical-theatre" },
    { name: "University of California Irvine", slug: "university-of-california-irvine" },
    { name: "Margaret Atwood", slug: "margaret-atwood" },
    { name: "The Penelopiad", slug: "the-penelopiad" },
  ],
  links: [
    {
      label: "Review",
      url: "https://newuniversity.org/2020/02/10/ucis-the-penelopiad-brings-new-narrative-to-a-classic-greek-epic/",
    },
  ],
  media: [
    {
      id: "penelopiad-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-cover.webp",
      altText: "The Penelopiad scenic design cover image.",
      kind: "cover",
    },
    {
      id: "penelopiad-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150077.webp",
      altText:
        "Production image from The Penelopiad showing the ritual scenic environment and chorus staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150085.webp",
      altText:
        "Production image from The Penelopiad highlighting the layered memory space and ensemble composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150099.webp",
      altText:
        "Scene from The Penelopiad emphasizing chorus visibility and mythic geometry, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150132.webp",
      altText:
        "Production still from The Penelopiad showing the scenic architecture as container and witness, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150154.webp",
      altText:
        "Rendering for The Penelopiad exploring the ritual scenic composition and staging framework, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "penelopiad-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150227.webp",
      altText:
        "Production image from The Penelopiad focusing on testimony, procession, and shared visual authority, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150232.webp",
      altText:
        "Production image from The Penelopiad showing the scenic world supporting both epic framing and intimacy, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150239.webp",
      altText:
        "Production still from The Penelopiad highlighting spatial layering and chorus movement, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150245.webp",
      altText:
        "Final production image from The Penelopiad showing the full scenic environment in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "penelopiad-prod-9",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90051-gallery-150059.webp",
      altText:
        "Production image from The Penelopiad reinforcing the set's symbolic texture and mythic atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Memory Space for Penelope and the Maids",
      content: [
        "The Penelopiad was conceived as a layered memory space where testimony, ritual, and counter-narrative could coexist. Rather than locating the story in a literal reconstruction of ancient Greece, the design framed the stage as a world of witness, one where Penelope and the maids could occupy the same visual architecture while speaking from different positions of power.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["penelopiad-prod-1", "penelopiad-prod-2"],
    },
    {
      type: "text",
      heading: "Chorus Visibility and Flexible Geometry",
      content: [
        "A central concern was chorus visibility. The scenic composition needed to support group presence without flattening the action, so the environment used open geometry and layered playing levels that could expand into epic framing or compress into intimate address. That flexibility allowed the production to move fluidly between narrative distance and emotional immediacy.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["penelopiad-prod-3", "penelopiad-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Material language balanced austerity with symbolic texture, supporting the work's interrogation of authorship, gendered history, and inherited myth. The set functioned as both container and witness, giving Penelope and the maids equal visual authority inside the same world while maintaining theatrical tension across the evening.",
      ],
    },
    {
      type: "gallery",
      mediaIds: [
        "penelopiad-prod-5",
        "penelopiad-prod-6",
        "penelopiad-prod-7",
        "penelopiad-prod-8",
        "penelopiad-prod-9",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["penelopiad-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:56+00:00",
};

const companyProject: LocalScenicProject = {
  id: 90019,
  title: "Company",
  slug: "company",
  excerpt:
    "New York framed as a landscape of longing in Company, pairing coupled buildings, a lone brick structure, and a color-shifting skyline to reflect connection, solitude, and modern adulthood.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "University of California Irvine",
  location: "Irvine, CA",
  year: 2019,
  month: 11,
  status: "published",
  featured: true,
  seoTitle: "Company | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Company at University of California Irvine, creating a New York cityscape of longing, movement, and shifting emotional rhythm.",
  seoKeywords:
    "Company, scenic design, Stephen Sondheim, UC Irvine, musical theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-cover.webp",
  creativeTeam: [
    { name: "Stephen Sondheim", role: "Music and Lyrics" },
    { name: "George Furth", role: "Book By" },
    { name: "Lex Leigh", role: "Music Director" },
    { name: "Allison Eversol", role: "Choreographer" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Cassie DeFile", role: "Costume Designer" },
    { name: "Jacob P. Brinkman", role: "Lighting Designer" },
    { name: "Garrett Gagnon", role: "Sound Designer" },
    { name: "Eli Simon", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "University of California Irvine", slug: "university-of-california-irvine" },
    { name: "Stephen Sondheim", slug: "stephen-sondheim" },
    { name: "Company", slug: "company" },
  ],
  links: [
    {
      label: "Review",
      url: "https://newuniversity.org/2019/12/02/uci-dramas-relevant-take-on-company/",
    },
  ],
  media: [
    {
      id: "company-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-cover.webp",
      altText: "Company scenic design cover image.",
      kind: "cover",
    },
    {
      id: "company-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150026.webp",
      altText:
        "Production image from Company showing the coupled buildings and urban scenic composition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150028.webp",
      altText:
        "Production image from Company highlighting the exterior city world and embedded orchestra, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150031.webp",
      altText:
        "Production still from Company emphasizing architectural contrast and stage movement, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150033.webp",
      altText:
        "Performance image from Company showing stoops, levels, and shifting emotional proximity, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150076.webp",
      altText:
        "Production image from Company with backlit windows and skyline color shaping the mood, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150100.webp",
      altText:
        "Production image from Company showing the cityscape as a landscape of longing, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150102.webp",
      altText:
        "Rendering for Company exploring the coupled buildings, lone brick structure, and skyline rhythm, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "company-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150116.webp",
      altText:
        "Production image from Company highlighting ladders, escapes, and movement through the city, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150125.webp",
      altText:
        "Performance image from Company reinforcing the exterior architecture and ensemble relationships, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-9",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150165.webp",
      altText:
        "Production still from Company with the glowing skyline and nonlinear emotional rhythm in view, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-10",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150208.webp",
      altText:
        "Production image from Company emphasizing the set's view of intimacy from the outside looking in, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "company-prod-11",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90019-gallery-150240.webp",
      altText:
        "Final production image from Company showing the complete New York scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A New York of Exterior Lives",
      content: [
        "For Company at UCI, the design grew out of observation. A solo trip to New York the spring before the production became the seed: white or cream walls, trim layered in decades of paint, and buildings that felt strangely uninhabited because life seemed to happen outside, in motion, in the city itself.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["company-prod-1", "company-prod-2"],
    },
    {
      type: "text",
      heading: "Coupled Buildings and Solitude",
      content: [
        "That sensibility shaped the architecture. Two coupled buildings framed stage right, linked structures echoing partnership, while a lone red-brick building stood apart at stage left, reflecting Bobby's solitude. Fire escapes, stoops, and ladders climbed throughout the composition, offering both physical and metaphorical mobility.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["company-prod-3", "company-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Backlit windows glowed in purples, pinks, and blues, hinting at private lives just out of reach, while a color-shifting cyc formed the skyline and moved with mood and music. Rather than literal apartments, the design created a landscape of longing: an exterior world where people connect, drift, and orbit love, holding the ache and possibility of modern adulthood.",
      ],
    },
    {
      type: "gallery",
      mediaIds: [
        "company-prod-5",
        "company-prod-6",
        "company-prod-7",
        "company-prod-8",
        "company-prod-9",
        "company-prod-10",
        "company-prod-11",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["company-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:04:01+00:00",
};

const thePajamaGameProject: LocalScenicProject = {
  id: 90048,
  title: "The Pajama Game",
  slug: "the-pajama-game",
  excerpt:
    "Bold signage, modular factory architecture, and mid-century graphic energy support both romance and labor tension in The Pajama Game.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "University of California Irvine",
  location: "Irvine, CA",
  year: 2019,
  month: 6,
  status: "published",
  featured: false,
  seoTitle: "The Pajama Game | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Pajama Game at University of California Irvine, using bold factory signage, modular staging, and 1950s graphic language to support dance, romance, and labor conflict.",
  seoKeywords:
    "The Pajama Game, scenic design, UC Irvine, musical theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-cover.webp",
  creativeTeam: [
    { name: "George Abbott & Richard Bissell", role: "Book By" },
    { name: "Richard Adler & Jerry Ross", role: "Music and Lyrics" },
    { name: "Lex Leigh", role: "Music Director" },
    { name: "Allison Eversol", role: "Choreographer" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Sarah Monaghan", role: "Costume Designer" },
    { name: "Natori Cummings-Haynes", role: "Lighting Designer" },
    { name: "Ningru Guo", role: "Sound Designer" },
    { name: "Don Hill", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "University of California Irvine", slug: "university-of-california-irvine" },
    { name: "The Pajama Game", slug: "the-pajama-game" },
    { name: "Mid-Century Musical", slug: "mid-century-musical" },
  ],
  links: [
    {
      label: "Listing",
      url: "https://drama.arts.uci.edu/events/pajama-game",
    },
  ],
  media: [
    {
      id: "pajama-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-cover.webp",
      altText: "The Pajama Game scenic design cover image.",
      kind: "cover",
    },
    {
      id: "pajama-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150024.webp",
      altText:
        "Production image from The Pajama Game showing the Sleep-Tite factory world and ensemble staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150038.webp",
      altText:
        "Rendering for The Pajama Game exploring the factory signage and modular scenic composition, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "pajama-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150053.webp",
      altText:
        "Production image from The Pajama Game emphasizing the graphic factory environment and choreography space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150081.webp",
      altText:
        "Production image from The Pajama Game highlighting signage and period workplace structure, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150083.webp",
      altText:
        "Performance image from The Pajama Game showing modular scenic units in motion, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150091.webp",
      altText:
        "Production still from The Pajama Game with dance staging and factory signage in view, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150113.webp",
      altText:
        "Production image from The Pajama Game showing the scenic world supporting romance and labor conflict, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150119.webp",
      altText:
        "Production image from The Pajama Game highlighting the modular factory atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150126.webp",
      altText:
        "Production still from The Pajama Game emphasizing period color and ensemble movement, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-render-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150138.webp",
      altText:
        "Rendering for The Pajama Game showing factory transitions and theatrical composition, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "pajama-prod-9",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150146.webp",
      altText:
        "Production image from The Pajama Game reinforcing the postwar factory energy, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-render-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150172.webp",
      altText:
        "Rendering for The Pajama Game exploring signage, movement paths, and period theatricality, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "pajama-render-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150204.webp",
      altText:
        "Rendering for The Pajama Game studying scenic transitions and factory architecture, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "pajama-prod-10",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150206.webp",
      altText:
        "Production image from The Pajama Game showing scenic rhythm during a large musical number, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-prod-11",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150219.webp",
      altText:
        "Production image from The Pajama Game highlighting the adaptability of the modular set, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "pajama-render-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150230.webp",
      altText:
        "Rendering for The Pajama Game showing the Sleep-Tite world with bold period signage, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "pajama-render-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90048-gallery-150242.webp",
      altText:
        "Final rendering for The Pajama Game capturing the lively factory world and musical energy, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Factory with Personality",
      content: [
        "The Pajama Game needed a world that could move as fast as the score. Bold signage and shifting factory elements framed the 1950s Sleep-Tite Pajama Factory, giving the stage a strong graphic identity while keeping transitions quick and dance-friendly.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["pajama-prod-1", "pajama-prod-2"],
    },
    {
      type: "text",
      heading: "Romance and Labor in the Same Space",
      content: [
        "The story balances spirited romance with a sharp labor dispute, so the scenic world had to support both. Repeating structures and a vibrant factory palette suggested postwar optimism, while signage and movable units emphasized workplace mechanics and the conflict over fair wages driving the plot.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["pajama-prod-3", "pajama-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "A modular approach supported dance-heavy staging, allowing rolling units to transform quickly from intimate encounters to full-ensemble numbers. The result was a world that felt playful yet pointed: period-authentic enough to ground the audience, theatrical enough to energize a story about love, labor, and finding joy amid conflict.",
      ],
    },
    {
      type: "gallery",
      mediaIds: [
        "pajama-prod-5",
        "pajama-prod-6",
        "pajama-prod-7",
        "pajama-prod-8",
        "pajama-prod-9",
        "pajama-prod-10",
        "pajama-prod-11",
      ],
    },
    {
      type: "gallery",
      mediaIds: [
        "pajama-render-1",
        "pajama-render-2",
        "pajama-render-3",
        "pajama-render-4",
        "pajama-render-5",
        "pajama-render-6",
      ],
    },
  ],
  updatedAt: "2026-02-12T15:03:56+00:00",
};

const parliamentSquareProject: LocalScenicProject = {
  id: 90018,
  title: "Parliament Square",
  slug: "parliament-square",
  excerpt:
    "A circular stone path and fractured concrete world create a ritual landscape of protest, sacrifice, and political exhaustion in Parliament Square.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "University of California Irvine",
  location: "Irvine, CA",
  year: 2019,
  month: 2,
  status: "published",
  featured: false,
  seoTitle: "Parliament Square | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Parliament Square at University of California Irvine, using a circular stone path, fractured concrete, and a cold ritual landscape to support protest and political tension.",
  seoKeywords:
    "Parliament Square, scenic design, UC Irvine, drama, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-cover.webp",
  creativeTeam: [
    { name: "James Fritz", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Matthew Martinez", role: "Costume Designer" },
    { name: "Jacob P. Brinkman", role: "Lighting Designer" },
    { name: "Ezra Anisman & Garrett Gagnon", role: "Sound Design" },
    { name: "Merle DeWitt III", role: "Projection Design" },
    { name: "Jane Page", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "University of California Irvine", slug: "university-of-california-irvine" },
    { name: "Parliament Square", slug: "parliament-square" },
    { name: "Political Theatre", slug: "political-theatre" },
  ],
  links: [
    {
      label: "Listing",
      url: "https://www.arts.uci.edu/press-room/uci-drama-CA-premiere-parliament-square",
    },
  ],
  media: [
    {
      id: "parliament-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-cover.webp",
      altText: "Parliament Square scenic design cover image.",
      kind: "cover",
    },
    {
      id: "parliament-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150128.webp",
      altText:
        "Production image from Parliament Square showing the circular stone path and sparse political landscape, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150143.webp",
      altText:
        "Production image from Parliament Square highlighting the ritual staging geometry and fractured environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150150.webp",
      altText:
        "Production still from Parliament Square emphasizing concrete textures and political isolation, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150159.webp",
      altText:
        "Performance image from Parliament Square showing the stone circle as a container for protest, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150166.webp",
      altText:
        "Production image from Parliament Square with the cold palette and minimal architecture in view, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150188.webp",
      altText:
        "Production image from Parliament Square emphasizing the environment's meditative austerity, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150202.webp",
      altText:
        "Production image from Parliament Square showing the scenic world pressing the political against the personal, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150205.webp",
      altText:
        "Production still from Parliament Square highlighting symbolic decay and empty public space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-prod-9",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150214.webp",
      altText:
        "Production image from Parliament Square reinforcing the scenic world's tension between resilience and sacrifice, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "parliament-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90018-gallery-150241.webp",
      altText:
        "Rendering for Parliament Square exploring the circular path, concrete surfaces, and ritual scenic composition, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Ritual Path Through the Stage",
      content: [
        "A circular stone path cut through the stage, anchoring Parliament Square in a space that felt both ritualistic and inescapable. That central image became a symbol of repetition, echoing cycles of social struggle while reflecting Kat's inner journey toward her final act of protest.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["parliament-prod-1", "parliament-prod-2"],
    },
    {
      type: "text",
      heading: "Concrete, Decay, and Isolation",
      content: [
        "Concrete and fractured surfaces shaped the environment, their erosion mirroring Kat's unraveling faith in institutions. A cold, gray palette stripped away comfort and created a setting that felt both public and isolating, pressing the political against private despair.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["parliament-prod-3", "parliament-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "By keeping the design minimal, the focus stayed on action and the questions the play demands. Without ornamentation, the stage invited a meditative rhythm with a sharp edge of confrontation. The scenic world became more than backdrop: stone circle, textures of decay, and empty expanse together embodied sacrifice and resilience long after the final scene.",
      ],
    },
    {
      type: "gallery",
      mediaIds: [
        "parliament-prod-5",
        "parliament-prod-6",
        "parliament-prod-7",
        "parliament-prod-8",
        "parliament-prod-9",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["parliament-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:59+00:00",
};

const americanIdiotProject: LocalScenicProject = {
  id: 90038,
  title: "American Idiot",
  slug: "american-idiot",
  excerpt:
    "Southern California concrete infrastructure fused with Green Day’s pulse, creating a stark environment of suburban monotony, urban decay, and restless transformation in American Idiot.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "University of California Irvine",
  location: "Irvine, CA",
  year: 2018,
  month: 6,
  status: "published",
  featured: false,
  seoTitle: "American Idiot | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for American Idiot at University of California Irvine, using modular concrete architecture, projection, and industrial atmosphere to support rebellion and transformation.",
  seoKeywords:
    "American Idiot, scenic design, UC Irvine, Green Day, musical theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-cover.webp",
  creativeTeam: [
    { name: "Billie Joe Armstrong & Michael Mayer", role: "Book By" },
    { name: "Green Day", role: "Music By" },
    { name: "Billie Joe Armstrong", role: "Lyrics By" },
    { name: "Lex Leigh", role: "Music Director" },
    { name: "Allison Eversol", role: "Choreographer" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Jennifer Clark", role: "Costume Designer" },
    { name: "David Hern", role: "Lighting Designer" },
    { name: "Jordan Tani", role: "Sound Designer" },
    { name: "Elizabeth Barrett", role: "Projection Design" },
    { name: "Andrew Palermo", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "University of California Irvine", slug: "university-of-california-irvine" },
    { name: "Green Day", slug: "green-day" },
    { name: "American Idiot", slug: "american-idiot" },
  ],
  links: [
    {
      label: "Listing",
      url: "https://drama.arts.uci.edu/events/american-idiot",
    },
  ],
  media: [
    {
      id: "idiot-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-cover.webp",
      altText: "American Idiot scenic design cover image.",
      kind: "cover",
    },
    {
      id: "idiot-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150011.webp",
      altText:
        "Production image from American Idiot showing the modular concrete environment and ensemble staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "idiot-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150036.webp",
      altText:
        "Production image from American Idiot emphasizing the hard-edged architectural world and rebellious energy, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "idiot-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150065.webp",
      altText:
        "Production still from American Idiot showing industrial forms and the show's kinetic physicality, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "idiot-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150066.webp",
      altText:
        "Production image from American Idiot highlighting the concrete framework and projection atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "idiot-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150094.webp",
      altText:
        "Production image from American Idiot showing the conflict between space and identity, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "idiot-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150105.webp",
      altText:
        "Production image from American Idiot reinforcing the score's raw energy within a minimalist industrial frame, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "idiot-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150152.webp",
      altText:
        "Production still from American Idiot with projection and concrete forms supporting emotional transition, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "idiot-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150176.webp",
      altText:
        "Rendering for American Idiot exploring the Southern California concrete metaphor and industrial scenic world, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "idiot-prod-8",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90038-gallery-150196.webp",
      altText:
        "Final production image from American Idiot showing the full scenic environment in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Concrete Rebellion",
      content: [
        "For American Idiot on the Claire Trevor Theatre stage at UCI, the design channeled Green Day's raw energy into a visual world built on the tension between suburban monotony and urban decay, reimagined through a Southern California lens.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["idiot-prod-1", "idiot-prod-2"],
    },
    {
      type: "text",
      heading: "A Southern California Metaphor",
      content: [
        "A concrete pedestrian bridge in Irvine linking campus to University Town Center sparked the central metaphor. Modular concrete forms and industrial elements created a stark, permanent environment that felt emotionally suffocating, mirroring a generation's disconnection and frustration in post-9/11 America.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["idiot-prod-3", "idiot-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "We moved away from Broadway's heavy TV-screen concept and leaned into immersion. Elizabeth Barrett's projections became a kinetic layer, trading static media for visceral spectacle and fluid transitions so the emotional undercurrents of the score could sit inside a minimalist frame. The set stayed unyielding while the characters fought to redefine themselves within it.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["idiot-prod-5", "idiot-prod-6", "idiot-prod-7", "idiot-prod-8"],
    },
    {
      type: "gallery",
      mediaIds: ["idiot-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:04:00+00:00",
};

const lastTrainToNibrocProject: LocalScenicProject = {
  id: 28,
  title: "Last Train to Nibroc",
  slug: "last-train-to-nibroc",
  excerpt:
    "An intimate, warm playing space carved inside a much larger proscenium, using reclaimed barn wood, a slight rake, and a long backdrop to support closeness and quiet change in Last Train to Nibroc.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2016,
  month: 6,
  status: "published",
  featured: false,
  seoTitle: "Last Train to Nibroc | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Last Train to Nibroc at Okoboji Summer Theatre, creating an intimate barn-wood frame inside a large proscenium to support closeness, memory, and gentle transition.",
  seoKeywords:
    "Last Train to Nibroc, scenic design, Okoboji Summer Theatre, drama, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-3-of-10-7894.webp",
  creativeTeam: [
    { name: "Arlene Hutton", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Kristin Cook", role: "Costume Design" },
    { name: "Josh Hiser", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Janice Goldberg", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Last Train to Nibroc", slug: "last-train-to-nibroc" },
    { name: "Period Drama", slug: "period-drama" },
  ],
  links: [],
  media: [
    {
      id: "nibroc-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-3-of-10-7894.webp",
      altText: "Last Train to Nibroc scenic design cover image.",
      kind: "cover",
    },
    {
      id: "nibroc-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-1-of-10-9188.webp",
      altText:
        "Production image from Last Train to Nibroc showing the intimate barn-wood framed stage, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "nibroc-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-1-of-1-9386.webp",
      altText:
        "Production image from Last Train to Nibroc highlighting the compressed proscenium and warm material palette, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "nibroc-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-3-of-10-9188.webp",
      altText:
        "Production still from Last Train to Nibroc showing the environment's closeness and stillness, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "nibroc-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-4-of-10-9386.webp",
      altText:
        "Production image from Last Train to Nibroc emphasizing the raked stage and intimate playing space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "nibroc-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-5-of-10-9386.webp",
      altText:
        "Production image from Last Train to Nibroc showing the long backdrop supporting fluid scene changes, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "nibroc-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-6-of-10-9386.webp",
      altText:
        "Production still from Last Train to Nibroc reinforcing the design's quiet emotional tone, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "nibroc-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-7-of-10-9386.webp",
      altText:
        "Production image from Last Train to Nibroc showing the architecture holding the characters gently, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "nibroc-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-9-of-10-9386.webp",
      altText:
        "Rendering for Last Train to Nibroc exploring the compressed proscenium and barn-wood material language, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "nibroc-render-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-8-of-10-9386.webp",
      altText:
        "Rendering for Last Train to Nibroc showing the intimate scenic scale and backdrop system, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "nibroc-render-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/03/2016-the-last-train-to-nibroc-10-of-10-9386.webp",
      altText:
        "Final rendering for Last Train to Nibroc capturing the quiet, close scenic atmosphere, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Compressing the Proscenium",
      content: [
        "For Last Train to Nibroc, scale was the first problem to solve. The script is intimate. The proscenium was not. I built a smaller, textured frame inside the larger architecture using reclaimed Kentucky barn wood, immediately compressing the stage into a world that felt personal rather than theatrical.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["nibroc-prod-1", "nibroc-prod-2"],
    },
    {
      type: "text",
      heading: "Warmth, Sightlines, and Quiet Tension",
      content: [
        "The stage was raked slightly to focus sightlines and give the environment a gentle push forward. It added subtle tension without feeling stylized. The barn wood brought warmth and history into the room, something grounded and honest that reflected the play's rural setting and emotional vulnerability.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["nibroc-prod-3", "nibroc-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "A 30-foot backdrop carried the journey between locations, allowing transitions to remain fluid without breaking the rhythm of the characters' conversations. This design wasn't about spectacle. It was about proximity. The architecture supported stillness, and the materials carried nostalgia without becoming sentimental.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["nibroc-prod-5", "nibroc-prod-6", "nibroc-prod-7"],
    },
    {
      type: "gallery",
      mediaIds: ["nibroc-render-1", "nibroc-render-2", "nibroc-render-3"],
    },
  ],
  updatedAt: "2026-03-01T10:42:52.420651+00:00",
};

const vanyaAndSoniaAndMashaAndSpikeProject: LocalScenicProject = {
  id: 21,
  title: "Vanya and Sonia and Masha and Spike",
  slug: "vanya-and-sonia-and-masha-and-spike",
  excerpt:
    "A Bucks County porch that feels both sheltering and restrictive, giving Vanya and Sonia and Masha and Spike a nostalgic domestic frame for rivalry, wit, and longing.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2016,
  month: 2,
  status: "published",
  featured: false,
  seoTitle: "Vanya and Sonia and Masha and Spike | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Vanya and Sonia and Masha and Spike at Stephens College, using a Bucks County porch and warm domestic architecture to support nostalgia, comedy, and emotional tension.",
  seoKeywords:
    "Vanya and Sonia and Masha and Spike, scenic design, Stephens College, comedy, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2016-vanya-sonia-masha-and-spike-stephens-1-of-7-1190.webp",
  creativeTeam: [
    { name: "Christopher Durang", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Elizabeth McManus", role: "Costume Design" },
    { name: "Sarah Aker", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Lamby Hedge", role: "Director" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "Christopher Durang", slug: "christopher-durang" },
    { name: "Vanya and Sonia and Masha and Spike", slug: "vanya-and-sonia-and-masha-and-spike" },
  ],
  links: [],
  media: [
    {
      id: "vanya-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2016-vanya-sonia-masha-and-spike-stephens-1-of-7-1190.webp",
      altText: "Vanya and Sonia and Masha and Spike scenic design cover image.",
      kind: "cover",
    },
    {
      id: "vanya-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2016-vanya-sonia-masha-and-spike-stephens-2-of-7-2374.webp",
      altText:
        "Production image from Vanya and Sonia and Masha and Spike showing the Bucks County porch and domestic architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "vanya-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2016-vanya-sonia-masha-and-spike-stephens-3-of-7-2374.webp",
      altText:
        "Production image from Vanya and Sonia and Masha and Spike highlighting the porch as a threshold and gathering space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "vanya-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2016-vanya-sonia-masha-and-spike-stephens-1-of-7-2374.webp",
      altText:
        "Production image from Vanya and Sonia and Masha and Spike emphasizing the warm wood tones and lived-in domestic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "vanya-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2016-vanya-sonia-masha-and-spike-stephens-1-of-2-8633.webp",
      altText:
        "Production still from Vanya and Sonia and Masha and Spike showing the scenic environment supporting layered comic staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "vanya-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/vanya-act-2-45-large-2372.webp",
      altText:
        "Production image from Vanya and Sonia and Masha and Spike reinforcing the porch as both sanctuary and constraint, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "vanya-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2016-vanya-sonia-masha-and-spike-stephens-2-of-2-8670.webp",
      altText:
        "Final production image from Vanya and Sonia and Masha and Spike showing the full domestic scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Porch as Sanctuary and Constraint",
      content: [
        "For Vanya and Sonia and Masha and Spike at Stephens College, the scenic design drew from the architectural charm of a Bucks County country home, comfortable, rooted, and steeped in familiarity. The porch became the visual and dramaturgical anchor of the space, operating as both an extension of the interior and a threshold to the outside world.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["vanya-prod-1", "vanya-prod-2"],
    },
    {
      type: "text",
      heading: "Warmth, Detail, and Generational Weight",
      content: [
        "The architecture leaned into traditional American detailing: warm wood tones, practical molding, and grounded proportions that suggested generational stability. A garden bench constructed from scrap lumber introduced a subtle handmade quality, underscoring the lived-in authenticity of the home and the play's quiet relationship to nostalgia.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["vanya-prod-3", "vanya-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Spatially, the design allowed for layered staging. Intimate conversations near the porch edge contrasted with broader ensemble moments in the shared living area. The environment held comedic energy without becoming caricature, instead providing a restrained, elegant frame that let Christopher Durang's humor and emotional undercurrents unfold naturally.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["vanya-prod-5", "vanya-prod-6"],
    },
  ],
  updatedAt: "2026-02-27T11:15:14.646195+00:00",
};

const theLiarProject: LocalScenicProject = {
  id: 90015,
  title: "The Liar",
  slug: "the-liar",
  excerpt:
    "A classical comic world built with elegance, color, and playful exaggeration, giving The Liar a refined environment that could support wit, deception, and fast-moving farce.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2012,
  month: 8,
  status: "published",
  featured: false,
  seoTitle: "The Liar | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Liar at Okoboji Summer Theatre, blending classical elegance with bold playful elements to heighten the comedy's wit and charm.",
  seoKeywords:
    "The Liar, David Ives, Pierre Corneille, scenic design, Okoboji Summer Theatre, comedy, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-liar/the-liar-daa6bff258.jpg",
  creativeTeam: [
    { name: "David Ives (adapted from Pierre Corneille)", role: "Written By" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Theresa Hartman", role: "Costume Design" },
    { name: "Justin Hoffecker", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Lamby Hedge", role: "Director" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Classical Adaptation", slug: "classical-adaptation" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "The Liar", slug: "the-liar" },
  ],
  links: [],
  media: [
    {
      id: "liar-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-liar/the-liar-daa6bff258.jpg",
      altText: "The Liar scenic design cover image.",
      kind: "cover",
    },
    {
      id: "liar-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-liar/the-liar-214d560e4b.jpg",
      altText:
        "Production image from The Liar showing the classical comic setting and staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "liar-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-liar/the-liar-c183f7b9fc.jpg",
      altText:
        "Stage image from The Liar emphasizing wit, movement, and the scenic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "liar-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-liar/the-liar-cc3083db71.jpg",
      altText:
        "Production still from The Liar highlighting the playful period world and comic staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "liar-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-liar/the-liar-edc3844ade.jpg",
      altText:
        "Performance image from The Liar reinforcing the bold visual rhythm of the comic setting, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "liar-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-liar/the-liar-fe95892931.jpg",
      altText:
        "Final production image from The Liar showing the full comic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Classical Elegance with Comic Lift",
      content: [
        "The Liar was approached as a classical comedy with enough visual elegance to support heightened language, but enough playfulness to keep the world active and theatrical. The scenic environment balanced refinement with exaggeration, giving the production a setting that could hold both period wit and farcical momentum.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["liar-prod-1", "liar-prod-2"],
    },
    {
      type: "text",
      heading: "A World for Wit and Deception",
      content: [
        "Because the play thrives on mistaken identity, verbal agility, and social performance, the design needed to feel orderly at first glance while still leaving room for comic disruption. Bold accents and carefully framed architecture helped make the environment feel lively rather than museum-like, allowing the comedy to stay buoyant and clear.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["liar-prod-3", "liar-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The goal was to create a setting that honored the classical source while giving the adaptation its own theatrical snap. The world needed to feel polished, quick, and welcoming to the audience, supporting the play's wit and charm without losing the precision that makes the farce land.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["liar-prod-5"],
    },
  ],
  updatedAt: "2026-03-23T20:12:00.000Z",
};

const aSmalltowneChristmasProject: LocalScenicProject = {
  id: 90016,
  title: "A Smalltowne Christmas",
  slug: "a-smalltowne-christmas",
  excerpt:
    "A nostalgic holiday setting shaped around warmth, tradition, and small-town cheer, creating a festive world that supports community, memory, and seasonal spectacle.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2021,
  month: 11,
  status: "published",
  featured: false,
  seoTitle: "A Smalltowne Christmas | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for A Smalltowne Christmas at Stephens College, capturing the warmth, nostalgia, and festive spirit of a small-town holiday celebration.",
  seoKeywords:
    "A Smalltowne Christmas, scenic design, Stephens College, holiday musical, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/a-smalltowne-christmas/a-smalltowne-christmas-9717e6782b.jpg",
  creativeTeam: [
    { name: "Stacia Fernandez", role: "Written By" },
    { name: "Danny J. Rooney", role: "Music and Lyrics By" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Briann Johnson & Martha Clarke", role: "Costume Design" },
    { name: "Vincente Williams", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Andrew David Sotomayor", role: "Music Director" },
    { name: "Stacia Fernandez", role: "Associate Director" },
    { name: "Richard Stafford", role: "Directed and Choreographed By" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Holiday Musical", slug: "holiday-musical" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "A Smalltowne Christmas", slug: "a-smalltowne-christmas" },
  ],
  links: [],
  media: [
    {
      id: "smalltowne-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/a-smalltowne-christmas/a-smalltowne-christmas-9717e6782b.jpg",
      altText: "A Smalltowne Christmas scenic design cover image.",
      kind: "cover",
    },
    {
      id: "smalltowne-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/a-smalltowne-christmas/a-smalltowne-christmas-384b222098.jpg",
      altText:
        "Production image from A Smalltowne Christmas showing the festive scenic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "smalltowne-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/a-smalltowne-christmas/a-smalltowne-christmas-3691d27c7b.jpg",
      altText:
        "Production still from A Smalltowne Christmas highlighting holiday staging and scenic warmth, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "smalltowne-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/a-smalltowne-christmas/a-smalltowne-christmas-be19cc2be0.jpg",
      altText:
        "Final production image from A Smalltowne Christmas showing the complete holiday world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Holiday Warmth and Small-Town Memory",
      content: [
        "A Smalltowne Christmas was designed to capture the charm of a community gathering around shared holiday traditions. The scenic world leaned into familiarity, warmth, and seasonal texture, creating an environment where nostalgia and performance could live side by side without losing theatrical clarity.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["smalltowne-prod-1", "smalltowne-prod-2"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The design needed to balance festive spectacle with the intimacy of a small-town celebration. Rather than overwhelm the story with decoration, the goal was to create a setting that felt welcoming and communal, allowing the production's music, choreography, and seasonal sentiment to emerge inside a world of believable Christmas cheer.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["smalltowne-prod-3"],
    },
  ],
  updatedAt: "2026-03-23T20:25:00.000Z",
};

const urinetown2021Project: LocalScenicProject = {
  id: 90018,
  title: "Urinetown",
  slug: "urinetown-2021",
  excerpt:
    "A dystopian musical world shaped through Brechtian and German Expressionist influence, using angular architecture, concrete textures, and symbolic lighting to sharpen the satire of Urinetown.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2021,
  month: 8,
  status: "published",
  featured: false,
  seoTitle: "Urinetown (2021) | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for the 2021 production of Urinetown at Okoboji Summer Theatre, inspired by Brechtian and German Expressionist styles with angular concrete textures and symbolic lighting.",
  seoKeywords:
    "Urinetown 2021, Greg Kotis, Mark Hollmann, scenic design, Okoboji Summer Theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/urinetown-2021/urinetown-2021-c871282d6b.jpeg",
  creativeTeam: [
    { name: "Greg Kotis", role: "Book By" },
    { name: "Mark Hollmann and Greg Kotis", role: "Music and Lyrics By" },
    { name: "Jamie Reed", role: "Music Direction" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Cami Huebert", role: "Costume Design" },
    { name: "Savannah Bell", role: "Lighting Design" },
    { name: "Austen Yim", role: "Sound Design" },
    { name: "Paul Finocchiaro", role: "Directed and Choreographed By" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Dystopian Comedy", slug: "dystopian-comedy" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Urinetown", slug: "urinetown" },
  ],
  links: [],
  media: [
    {
      id: "urinetown-2021-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/urinetown-2021/urinetown-2021-c871282d6b.jpeg",
      altText: "Urinetown 2021 scenic design cover image.",
      kind: "cover",
    },
    {
      id: "urinetown-2021-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/urinetown-2021/urinetown-2021-51b22c1e9d.jpeg",
      altText:
        "Production image from the 2021 Urinetown showing the angular dystopian environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "urinetown-2021-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/urinetown-2021/urinetown-2021-96279a9e54.jpeg",
      altText:
        "Production still from the 2021 Urinetown emphasizing the expressionist shapes and musical staging, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "urinetown-2021-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/urinetown-2021/urinetown-2021-42a3af6d44.jpeg",
      altText:
        "Production image from the 2021 Urinetown highlighting concrete texture and dystopian atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "urinetown-2021-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/urinetown-2021/urinetown-2021-61fded10c7.jpeg",
      altText:
        "Final production image from the 2021 Urinetown showing the complete comic-dystopian scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "Brecht and Expressionism as Musical Satire",
      content: [
        "This 2021 production of Urinetown was built around the collision of theatrical satire and authoritarian architecture. The design drew from Brechtian staging and German Expressionist distortion, creating a world of angular forms, hard textures, and visible theatricality that could support both the show's comedy and its political edge.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["urinetown-2021-prod-1", "urinetown-2021-prod-2"],
    },
    {
      type: "text",
      heading: "Concrete, Symbol, and Social Pressure",
      content: [
        "Concrete textures and exaggerated structural rhythms helped make the city feel oppressive without pinning the production to literal realism. The environment needed to function as a symbolic civic machine, one where authority, scarcity, and public control could all be felt spatially, while still leaving enough openness for movement, choreography, and comic address.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["urinetown-2021-prod-3", "urinetown-2021-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The goal was to create a stage world that sharpened the musical's dystopian absurdity while giving performers a strong graphic environment to play against. By combining angular composition, raw surfaces, and symbolic lighting, the set reinforced the production's satirical critique without flattening its humor or musical vitality.",
      ],
    },
  ],
  updatedAt: "2026-03-23T20:50:00.000Z",
};

const glassMenagerie2011Project: LocalScenicProject = {
  id: 90017,
  title: "The Glass Menagerie",
  slug: "the-glass-menagerie-2011",
  excerpt:
    "A memory-driven domestic environment shaped through scrim walls and a revealed cityscape, giving The Glass Menagerie a world suspended between fragile realism and the urge to escape.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2011,
  month: 8,
  status: "published",
  featured: false,
  seoTitle: "The Glass Menagerie (2011) | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for the 2011 production of The Glass Menagerie at Okoboji Summer Theatre, using memory-inspired scrim walls and a revealed cityscape to reflect nostalgia and escape.",
  seoKeywords:
    "The Glass Menagerie 2011, Tennessee Williams, scenic design, Okoboji Summer Theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-glass-menagerie-2011/the-glass-menagerie-2011-18e039c8c0.jpg",
  creativeTeam: [
    { name: "Tennessee Williams", role: "Written By" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Cynda Galikan", role: "Costume Design" },
    { name: "Justine Hoffecker", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Lamby Hedge", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "The Glass Menagerie", slug: "the-glass-menagerie" },
    { name: "Memory Play", slug: "memory-play" },
  ],
  links: [],
  media: [
    {
      id: "glass-2011-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-glass-menagerie-2011/the-glass-menagerie-2011-18e039c8c0.jpg",
      altText: "The Glass Menagerie 2011 scenic design cover image.",
      kind: "cover",
    },
    {
      id: "glass-2011-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-glass-menagerie-2011/the-glass-menagerie-2011-a53c40ae0e.jpg",
      altText:
        "Production image from the 2011 Glass Menagerie showing the domestic memory world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "glass-2011-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-glass-menagerie-2011/the-glass-menagerie-2011-eb79367a23.jpg",
      altText:
        "Production still from the 2011 Glass Menagerie highlighting the scrim walls and layered stage space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "glass-2011-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-glass-menagerie-2011/the-glass-menagerie-2011-2acc2d20ef.jpg",
      altText:
        "Performance image from the 2011 Glass Menagerie emphasizing nostalgia and theatrical framing, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "glass-2011-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/rescued/the-glass-menagerie-2011/the-glass-menagerie-2011-a598d1ca19.jpg",
      altText:
        "Final production image from the 2011 Glass Menagerie showing the full scenic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Memory Space for Longing and Escape",
      content: [
        "This production of The Glass Menagerie was designed as a world shaped by memory rather than strict realism. The domestic environment needed to feel present enough for the family drama to land, but also unstable enough to suggest the emotional filtering of recollection, longing, and distance.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["glass-2011-prod-1", "glass-2011-prod-2"],
    },
    {
      type: "text",
      heading: "Scrim Walls and the City Beyond",
      content: [
        "Memory-inspired scrim walls allowed the apartment to feel both enclosed and permeable. As sightlines shifted, the city beyond could emerge through the scenic architecture, reinforcing the play's tension between confinement and escape. That revealed urban layer extended the emotional world of the family rather than acting as a simple background image.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["glass-2011-prod-3", "glass-2011-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The goal was to support Tennessee Williams' fragile emotional architecture with a setting that felt haunted by memory but still playable for intimate domestic scenes. The environment needed to hold nostalgia, pressure, and the desire to leave, allowing the scenic world to echo the play's central tension without overwhelming it.",
      ],
    },
  ],
  updatedAt: "2026-03-23T20:38:00.000Z",
};

const littleShopOfHorrorsProject: LocalScenicProject = {
  id: 23,
  title: "Little Shop of Horrors",
  slug: "little-shop-of-horrors",
  excerpt:
    "A weathered, believable Skid Row storefront grounds Little Shop of Horrors, using brick, patched trim, and a compressed frame to support the show’s darker sci-fi stakes.",
  discipline: "scenic_design",
  subcategory: "Musical Theatre",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2014,
  month: 8,
  status: "published",
  featured: false,
  seoTitle: "Little Shop of Horrors | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Little Shop of Horrors at Okoboji Summer Theatre, creating a gritty Skid Row storefront with real pressure, texture, and claustrophobic tension.",
  seoKeywords:
    "Little Shop of Horrors, scenic design, Okoboji Summer Theatre, musical theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/little-shop-of-horrors-02-0430.webp",
  creativeTeam: [
    { name: "Howard Ashman", role: "Written by" },
    { name: "Alan Menken", role: "Music By" },
    { name: "Erik James", role: "Music Director" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Cami Huebert", role: "Costume Design" },
    { name: "Justin Hoffecker", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Terry Berliner", role: "Director" },
  ],
  tags: [
    { name: "Musical Theatre", slug: "musical-theatre" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Little Shop of Horrors", slug: "little-shop-of-horrors" },
    { name: "Horror Comedy", slug: "horror-comedy" },
  ],
  links: [],
  media: [
    {
      id: "little-shop-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/little-shop-of-horrors-02-0430.webp",
      altText: "Little Shop of Horrors scenic design cover image.",
      kind: "cover",
    },
    {
      id: "little-shop-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2015-little-shop-of-horrors-7-of-9-1481.webp",
      altText:
        "Production image from Little Shop of Horrors showing the gritty flower shop and Skid Row environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "little-shop-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2015-little-shop-of-horrors-2-of-9-1481.webp",
      altText:
        "Production image from Little Shop of Horrors emphasizing the brick storefront and cramped scenic frame, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "little-shop-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2015-little-shop-of-horrors-3-of-9-1481.webp",
      altText:
        "Production still from Little Shop of Horrors highlighting the grounded storefront realism, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "little-shop-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2015-little-shop-of-horrors-4-of-9-1481.webp",
      altText:
        "Production image from Little Shop of Horrors showing practical counters, windows, and detailed shop textures, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "little-shop-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2015-little-shop-of-horrors-6-of-9-1481.webp",
      altText:
        "Production image from Little Shop of Horrors reinforcing the claustrophobic tension of the small scenic world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "little-shop-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2015-little-shop-of-horrors-8-of-9-1481.webp",
      altText:
        "Production still from Little Shop of Horrors showing the world as danger increases around the shop, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "little-shop-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/little-shop-of-horrors-02-1481.webp",
      altText:
        "Final production image from Little Shop of Horrors showing the full scenic environment in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Grounded Skid Row",
      content: [
        "For Little Shop of Horrors at Okoboji Summer Theatre, I didn't want to lean into camp. The script is funny, but the stakes are real. The design was grounded in a worn, urban storefront that felt structurally honest: brick, aging trim, patched surfaces, and practical doors that made the space believable.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["little-shop-prod-1", "little-shop-prod-2"],
    },
    {
      type: "text",
      heading: "Pressure Inside the Shop",
      content: [
        "The flower shop sat inside a slightly compressed proscenium frame, giving the environment a boxed-in quality. That pressure mattered. Seymour's world needed to feel small before Audrey II made it feel dangerous. The palette stayed gritty and desaturated so the plant and costumes could carry visual contrast while the realism gave the horror weight.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["little-shop-prod-3", "little-shop-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Details were specific: layered brick texture, working windows, period signage, and practical counters that allowed choreography to move cleanly through the shop. The goal wasn't nostalgia for a 1960s musical. It was tension. As the plant grew, the environment didn't become bigger. It became more claustrophobic.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["little-shop-prod-5", "little-shop-prod-6", "little-shop-prod-7"],
    },
  ],
  updatedAt: "2026-02-28T11:19:53.894921+00:00",
};

const richGirlProject: LocalScenicProject = {
  id: 19,
  title: "Rich Girl",
  slug: "rich-girl",
  excerpt:
    "A contemporary Manhattan penthouse becomes an elegant shell for Rich Girl, pairing polished minimalism with emotional exposure to reflect wealth, restraint, and fracture.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2014,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "Rich Girl | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Rich Girl at Okoboji Summer Theatre, using a sleek Manhattan penthouse to balance polish, privilege, and emotional vulnerability.",
  seoKeywords:
    "Rich Girl, scenic design, Okoboji Summer Theatre, drama, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2014-rich-girl-okoboji-summer-theatre-3-of-8-2094.webp",
  creativeTeam: [
    { name: "Victoria Stewart", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Kirsteen Buchanan", role: "Costume Design" },
    { name: "Savannah Bell", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Rich Cole", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Rich Girl", slug: "rich-girl" },
    { name: "Contemporary Drama", slug: "contemporary-drama" },
  ],
  links: [],
  media: [
    {
      id: "rich-girl-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2014-rich-girl-okoboji-summer-theatre-3-of-8-2094.webp",
      altText: "Rich Girl scenic design cover image.",
      kind: "cover",
    },
    {
      id: "rich-girl-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2014-rich-girl-okoboji-summer-theatre-3-of-8-3670.webp",
      altText:
        "Production image from Rich Girl showing the contemporary penthouse environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rich-girl-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/rich-girl-5-3670.webp",
      altText:
        "Production image from Rich Girl highlighting the sleek domestic architecture and polished palette, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rich-girl-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2014-rich-girl-okoboji-summer-theatre-4-of-8-3670.webp",
      altText:
        "Production image from Rich Girl emphasizing openness, scale, and emotional distance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rich-girl-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2014-rich-girl-okoboji-summer-theatre-5-of-8-3670.webp",
      altText:
        "Production still from Rich Girl showing the refined interior shell and city-facing atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rich-girl-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2014-rich-girl-okoboji-summer-theatre-6-of-8-3707.webp",
      altText:
        "Production image from Rich Girl highlighting the elegant restraint of the penthouse world, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rich-girl-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2014-rich-girl-okoboji-summer-theatre-7-of-8-3759.webp",
      altText:
        "Final production image from Rich Girl showing the complete scenic environment in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "rich-girl-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/rich-girl-sketch-large-3759.webp",
      altText:
        "Rendering for Rich Girl exploring the penthouse composition, furnishings, and emotional restraint, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Penthouse as Emotional Armor",
      content: [
        "For Rich Girl at Okoboji Summer Theatre, the scenic design centered on a contemporary Manhattan penthouse that visually embodied privilege, polish, and emotional distance. The environment drew from high-end real estate staging and luxury interior publications: sleek lines, controlled color, and carefully selected furnishings that suggested generational wealth without clutter.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["rich-girl-prod-1", "rich-girl-prod-2"],
    },
    {
      type: "text",
      heading: "Scale, Exposure, and Detail",
      content: [
        "The architecture emphasized openness and scale, allowing the actors to move through a space that felt expansive yet psychologically exposed. Large window framing implied skyline views, reinforcing the urban setting and social status of the characters. A faux palm tree, later replaced by a Christmas tree, became a subtle marker of Eve's cultivated taste and the passage of time.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["rich-girl-prod-3", "rich-girl-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Minimalism became a dramaturgical tool. The restraint of the set contrasted with the emotionally charged relationships unfolding within it. The result was a scenic design that balanced refinement with vulnerability, an elegant architectural shell that amplified the fractures beneath its glossy surface.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["rich-girl-prod-5", "rich-girl-prod-6"],
    },
    {
      type: "gallery",
      mediaIds: ["rich-girl-render-1"],
    },
  ],
  updatedAt: "2026-02-27T10:18:35.878251+00:00",
};

const angelStreetProject: LocalScenicProject = {
  id: 90043,
  title: "Angel Street",
  slug: "angel-street",
  excerpt:
    "A dense Victorian drawing room for Angel Street, letting domestic realism and psychological unease coexist inside the same controlled interior.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Okoboji Summer Theatre",
  location: "Columbia, MO",
  year: 2013,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "Angel Street | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Angel Street at Okoboji Summer Theatre, building a formal Victorian drawing room where domestic realism and psychological tension coexist.",
  seoKeywords:
    "Angel Street, Gaslight, scenic design, Okoboji Summer Theatre, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-cover.webp",
  creativeTeam: [
    { name: "Patrick Hamilton", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Ashley Harrison", role: "Costume Designer" },
    { name: "Christopher Boew", role: "Lighting Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
    { name: "Rich Cole", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Angel Street", slug: "angel-street" },
    { name: "Victorian Thriller", slug: "victorian-thriller" },
  ],
  links: [
    {
      label: "Listing",
      url: "https://www.dglobe.com/news/summer-theater-announces-2013-schedule",
    },
  ],
  media: [
    {
      id: "angel-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-cover.webp",
      altText: "Angel Street scenic design cover image.",
      kind: "cover",
    },
    {
      id: "angel-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150025.webp",
      altText:
        "Production image from Angel Street showing the Victorian drawing room and formal architecture, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "angel-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150110.webp",
      altText:
        "Production image from Angel Street highlighting wainscoting, staircase, and enclosed domestic atmosphere, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "angel-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150129.webp",
      altText:
        "Production still from Angel Street showing period furnishings and practical lighting, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "angel-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150215.webp",
      altText:
        "Production image from Angel Street emphasizing domestic control and observation in the drawing room, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "angel-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150234.webp",
      altText:
        "Rendering for Angel Street exploring the formal Victorian room and psychological tension, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
    {
      id: "angel-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150142.webp",
      altText:
        "Production image from Angel Street reinforcing the density and enclosure of the room, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "angel-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150155.webp",
      altText:
        "Production still from Angel Street showing shifts in power within a stable realistic environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "angel-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90043-gallery-150194.webp",
      altText:
        "Final production image from Angel Street showing the complete drawing room world in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Formal Interior",
      content: [
        "The setting for Angel Street centers on a Victorian drawing room shaped by period detail and domestic realism. The space reflects late nineteenth-century order, refinement, and social structure while accommodating the play's psychological tension.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["angel-prod-1", "angel-prod-2"],
    },
    {
      type: "text",
      heading: "Observation and Enclosure",
      content: [
        "Architectural elements such as wainscoting, decorative trim, and a functional staircase establish a formal interior defined by control and observation. Period furnishings and practical lighting create a believable, lived-in environment. As the story progresses, the room's density and enclosure quietly reinforce a growing sense of confinement without relying on overt visual metaphor.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["angel-prod-3", "angel-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The design supports the performers by allowing shifts in power and perception to unfold within a stable, realistic setting. The drawing room becomes an active container for the narrative, where domestic order and manipulation coexist in plain sight.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["angel-prod-5", "angel-prod-6", "angel-prod-7"],
    },
    {
      type: "gallery",
      mediaIds: ["angel-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:04:01+00:00",
};

const dontDressForDinnerProject: LocalScenicProject = {
  id: 18,
  title: "Don't Dress for Dinner",
  slug: "dont-dress-for-dinner",
  excerpt:
    "A restored French farmhouse reimagined as both romantic getaway and comedic trap, using exposed timber beams, textured plaster, and a tightly organized layout to support farce.",
  discipline: "scenic_design",
  subcategory: "Comedy",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2013,
  month: 6,
  status: "published",
  featured: false,
  seoTitle: "Don't Dress for Dinner | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for Don't Dress for Dinner at Okoboji Summer Theatre, using a French farmhouse setting with timber framing, rustic detail, and precise farce-driven layout.",
  seoKeywords:
    "Don't Dress for Dinner, scenic design, Okoboji Summer Theatre, comedy, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-1-of-7-3733.webp",
  creativeTeam: [
    { name: "Marc Camoletti", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Ashley Harrison", role: "Costume Design" },
    { name: "Halea Coulter", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Dan Schultz", role: "Director" },
  ],
  tags: [
    { name: "Comedy", slug: "comedy" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Don't Dress for Dinner", slug: "dont-dress-for-dinner" },
    { name: "Farce", slug: "farce" },
  ],
  links: [],
  media: [
    {
      id: "dinner-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-1-of-7-3733.webp",
      altText: "Don't Dress for Dinner scenic design cover image.",
      kind: "cover",
    },
    {
      id: "dinner-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-7-of-7-5278.webp",
      altText:
        "Production image from Don't Dress for Dinner showing the restored French farmhouse environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dinner-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-6-of-7-5280.webp",
      altText:
        "Production image from Don't Dress for Dinner highlighting exposed timber beams and rustic architectural detail, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dinner-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-1-of-7-5333.webp",
      altText:
        "Production image from Don't Dress for Dinner emphasizing layered depth and door placement for farce, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dinner-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-2-of-7-5502.webp",
      altText:
        "Production still from Don't Dress for Dinner showing the farmhouse interior as romantic setting and comic engine, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dinner-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-3-of-7-5321.webp",
      altText:
        "Production image from Don't Dress for Dinner reinforcing sightlines and timing within the scenic layout, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dinner-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-4-of-7-5292.webp",
      altText:
        "Production image from Don't Dress for Dinner highlighting warmth, elegance, and ensemble movement, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "dinner-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/2013-dont-dress-for-dinner-okoboji-summer-theatre-5-of-7-5280.webp",
      altText:
        "Final production image from Don't Dress for Dinner showing the complete French farmhouse world in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Farmhouse for Farce",
      content: [
        "Designed for Don't Dress for Dinner at Okoboji Summer Theatre, the scenic concept reimagined a restored French farmhouse as both romantic getaway and comedic trap. The architecture was rooted in exposed timber beam work, textured plaster walls, and a grounded palette that suggested age, authenticity, and rural charm.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["dinner-prod-1", "dinner-prod-2"],
    },
    {
      type: "text",
      heading: "Doors, Sightlines, and Precision",
      content: [
        "Farce relies on clarity of movement, so the layout prioritized clean sightlines, purposeful door placement, and layered depth to support the rapid entrances and exits central to Marc Camoletti's script. The beam grid became both a visual anchor and a compositional tool, helping define playing areas without overcrowding the stage.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["dinner-prod-3", "dinner-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "Close collaboration with the lighting designer and technical director ensured the timber details caught light with warmth, adding dimensionality without overpowering the actors. The result was a scenic design that supported the intricate humor and tangled relationships at the heart of the production, elegant, grounded, and engineered for precision timing.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["dinner-prod-5", "dinner-prod-6", "dinner-prod-7"],
    },
  ],
  updatedAt: "2026-02-26T06:19:09.582627+00:00",
};

const allMySonsProject: LocalScenicProject = {
  id: 90017,
  title: "All My Sons",
  slug: "all-my-sons",
  excerpt:
    "A postwar suburban home that looks orderly on the surface, then uses that openness to expose the moral tension and quiet collapse beneath the Keller family’s carefully maintained world.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Stephens College",
  location: "Columbia, MO",
  year: 2010,
  month: 10,
  status: "published",
  featured: false,
  seoTitle: "All My Sons | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for All My Sons at Stephens College, using a postwar suburban home and open yard to support realism, moral pressure, and the unraveling of the American Dream.",
  seoKeywords:
    "All My Sons, scenic design, Stephens College, Arthur Miller, drama, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-cover.webp",
  creativeTeam: [
    { name: "Brandon PT Davis", role: "Scenic Designer" },
    { name: "Kate Wood", role: "Costume Designer" },
    { name: "Emily Swenson", role: "Lighting Designer" },
    { name: "Michael Burke", role: "Sound Designer" },
    { name: "Lamby Hedge", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Stephens College", slug: "stephens-college" },
    { name: "Arthur Miller", slug: "arthur-miller" },
    { name: "All My Sons", slug: "all-my-sons" },
  ],
  links: [
    {
      label: "Listing",
      url: "https://www.ibiblio.org/miller/2010productions",
    },
  ],
  media: [
    {
      id: "sons-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-cover.webp",
      altText: "All My Sons scenic design cover image.",
      kind: "cover",
    },
    {
      id: "sons-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150013.webp",
      altText:
        "Production image from All My Sons showing the postwar suburban house and yard, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "sons-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150018.webp",
      altText:
        "Production image from All My Sons highlighting the open porch and domestic realism, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "sons-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150054.webp",
      altText:
        "Production still from All My Sons emphasizing the ordered suburban environment, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "sons-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150070.webp",
      altText:
        "Production image from All My Sons showing how the open setting exposes private conflict, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "sons-prod-5",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150078.webp",
      altText:
        "Production image from All My Sons reinforcing the tension between comfort and moral collapse, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "sons-prod-6",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150175.webp",
      altText:
        "Production still from All My Sons showing the suburban framework for the play's emotional shifts, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "sons-prod-7",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150182.webp",
      altText:
        "Final production image from All My Sons showing the complete family home in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "sons-render-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/project-images/project-90017-gallery-150073.webp",
      altText:
        "Rendering for All My Sons exploring the porch, yard, and postwar suburban composition, scenic design by Brandon PT Davis.",
      kind: "rendering",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A Familiar American Exterior",
      content: [
        "All My Sons is set within a postwar suburban home defined by a modest house, open porch, and backyard. The scenic environment reflects the optimism and order associated with the American Dream, presenting a space that initially feels stable, welcoming, and complete.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["sons-prod-1", "sons-prod-2"],
    },
    {
      type: "text",
      heading: "Openness Working Against Comfort",
      content: [
        "As the play unfolds, the openness of the setting begins to work against that sense of comfort. Private conversations and moral conflicts are placed in full view, allowing tension to emerge through realism rather than overt symbolism. The layout and scenic details suggest a world carefully maintained, echoing the emotional restraint and denial within the Keller family.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["sons-prod-3", "sons-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "The design grounded the story in a familiar domestic setting while allowing emotional shifts to register clearly. The everyday suburban space became a quiet framework for the play's central moral questions and the consequences of choices made in silence.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["sons-prod-5", "sons-prod-6", "sons-prod-7"],
    },
    {
      type: "gallery",
      mediaIds: ["sons-render-1"],
    },
  ],
  updatedAt: "2026-02-12T15:03:58+00:00",
};

const theEffectOfGammaRaysProject: LocalScenicProject = {
  id: 17,
  title: "The Effect of Gamma Rays on Man-in-the-Moon Marigolds",
  slug: "the-effect-of-gamma-rays",
  excerpt:
    "A deteriorating domestic interior for The Effect of Gamma Rays on Man-in-the-Moon Marigolds, where faded surfaces, exposed repairs, and reclaimed timber mirror the family’s emotional instability.",
  discipline: "scenic_design",
  subcategory: "Drama",
  client: "Okoboji Summer Theatre",
  location: "Okoboji, IA",
  year: 2010,
  month: 7,
  status: "published",
  featured: false,
  seoTitle: "The Effect of Gamma Rays on Man-in-the-Moon Marigolds | Scenic Design by Brandon PT Davis",
  seoDescription:
    "Scenic design for The Effect of Gamma Rays on Man-in-the-Moon Marigolds at Okoboji Summer Theatre, using distressed wallpaper, reclaimed dock lumber, and a compressed interior to support emotional instability and resilience.",
  seoKeywords:
    "The Effect of Gamma Rays on Man-in-the-Moon Marigolds, scenic design, Okoboji Summer Theatre, drama, Brandon PT Davis",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/gamma-rays-1-5794.webp",
  creativeTeam: [
    { name: "Paul Zindel", role: "Playwright" },
    { name: "Brandon PT Davis", role: "Scenic Design" },
    { name: "Cami Huebert", role: "Costume Design" },
    { name: "Joe Hodge", role: "Lighting Design" },
    { name: "Michael Burke", role: "Sound Design" },
    { name: "Beth Leonard", role: "Director" },
  ],
  tags: [
    { name: "Drama", slug: "drama" },
    { name: "Okoboji Summer Theatre", slug: "okoboji-summer-theatre" },
    { name: "Paul Zindel", slug: "paul-zindel" },
    { name: "The Effect of Gamma Rays on Man-in-the-Moon Marigolds", slug: "the-effect-of-gamma-rays-on-man-in-the-moon-marigolds" },
  ],
  links: [],
  media: [
    {
      id: "gamma-cover",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/gamma-rays-1-5794.webp",
      altText: "The Effect of Gamma Rays on Man-in-the-Moon Marigolds scenic design cover image.",
      kind: "cover",
    },
    {
      id: "gamma-prod-1",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/gamma-rays-2-6823.webp",
      altText:
        "Production image from The Effect of Gamma Rays on Man-in-the-Moon Marigolds showing the distressed domestic interior, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gamma-prod-2",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/gamma-rays-3-6823.webp",
      altText:
        "Production image from The Effect of Gamma Rays on Man-in-the-Moon Marigolds highlighting faded wallpaper and emotional erosion, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gamma-prod-3",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/gamma-rays-4-6823.webp",
      altText:
        "Production still from The Effect of Gamma Rays on Man-in-the-Moon Marigolds showing the brittle interior surfaces and compressed space, scenic design by Brandon PT Davis.",
      kind: "production",
    },
    {
      id: "gamma-prod-4",
      type: "image",
      imageUrl:
        "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/portfolio/projects/2026/02/gamma-rays-1-6823.webp",
      altText:
        "Final production image from The Effect of Gamma Rays on Man-in-the-Moon Marigolds showing the full scenic environment in performance, scenic design by Brandon PT Davis.",
      kind: "production",
    },
  ],
  sections: [
    {
      type: "text",
      heading: "A House of Erosion",
      content: [
        "The environment was shaped by layers of deterioration and memory. Faded yellow wallpaper, sun-bleached and subtly stained, suggested years of exposure and emotional erosion. Sections of exposed newspaper lining beneath the paper hinted at past attempts to insulate or repair the home, reinforcing both economic strain and the passage of time.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["gamma-prod-1", "gamma-prod-2"],
    },
    {
      type: "text",
      heading: "Distressed Surfaces and Physical Weight",
      content: [
        "The walls carried a brittle quality, curling edges, uneven seams, and tonal shifts that caught the light in uneasy ways. To ground the world in physical authenticity, portions of the set were built from reclaimed dock lumber sourced from Lake Okoboji. The wood's natural weathering introduced a tactile realism that contrasted with the fragile interior surfaces.",
      ],
    },
    {
      type: "gallery",
      mediaIds: ["gamma-prod-3", "gamma-prod-4"],
    },
    {
      type: "text",
      heading: "Design Goal",
      content: [
        "That combination of distressed paper and worn timber created a space that felt both structurally present and emotionally unraveling. The environment gave the characters a world marked by damage, but not without endurance, allowing the play's fragile hope to register against a setting that had clearly survived too much.",
      ],
    },
  ],
  updatedAt: "2026-02-23T09:57:49.72121+00:00",
};

const localScenicProjects: LocalScenicProject[] = [
  millionDollarQuartet,
  glassMenagerie,
  allsWellThatEndsWell,
  bellBookAndCandle,
  muchAdoAboutNothing,
  guysOnIce,
  romero,
  urinetownProject,
  barefootInTheParkProject,
  freakyFridayProject,
  anEnemyOfThePeopleProject,
  dialMForMurderProject,
  coleProject,
  headOverHeelsProject,
  putnamCountySpellingBeeProject,
  loteriaGameOnProject,
  boeingBoeingProject,
  anInspectorCallsProject,
  theManOfLaManchaProject,
  aFunnyThingHappenedProject,
  theBaldSopranoProject,
  tomasAndTheLibraryLadyProject,
  theMerryWivesOfWindsorProject,
  theMarvelousWonderettesDreamOnProject,
  thePenelopiadProject,
  companyProject,
  thePajamaGameProject,
  parliamentSquareProject,
  notNowDarlingProject,
  bingoTheWinningMusicalProject,
  completeWorksAbridgedProject,
  theLiarProject,
  aSmalltowneChristmasProject,
  urinetown2021Project,
  glassMenagerie2011Project,
  americanIdiotProject,
  lastTrainToNibrocProject,
  vanyaAndSoniaAndMashaAndSpikeProject,
  littleShopOfHorrorsProject,
  richGirlProject,
  angelStreetProject,
  dontDressForDinnerProject,
  allMySonsProject,
  theEffectOfGammaRaysProject,
];

export function getLocalScenicProjects() {
  return localScenicProjects;
}

export function getLocalScenicProjectBySlug(slug: string) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  return localScenicProjects.find((project) => project.slug === normalizedSlug) || null;
}
