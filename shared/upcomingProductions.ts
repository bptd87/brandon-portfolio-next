export type UpcomingProduction = {
  id: string;
  status?: "upcoming" | "archived";
  title: string;
  company: string;
  companyUrl: string;
  venue: string;
  location: {
    city: string;
    region: string;
  };
  director: string;
  subtitle: string;
  description: string;
  body: string[];
  startDate: string;
  endDate: string;
  imageUrl: string;
  imageAlt: string;
  sourceUrl: string;
  sourceLabel: string;
  portfolioHref?: string;
  portfolioLabel?: string;
};

export const upcomingProductions: UpcomingProduction[] = [
  {
    id: "almost-heaven",
    title: "Almost Heaven",
    company: "Maples Repertory Theatre",
    companyUrl: "https://maplesrep.com/",
    venue: "Maples Repertory Theatre",
    location: {
      city: "Macon",
      region: "MO",
    },
    director: "Trevor Belt",
    subtitle: "Almost Heaven: The Songs of John Denver",
    description:
      "For Maples Repertory Theatre, Almost Heaven gathers the songs of John Denver into an ensemble-driven portrait of open roads, mountain air, and homesickness for a place half remembered. Directed by Trevor Belt, the production moves between concert, memory, and landscape while keeping the intimacy of the music close.",
    body: [
      "Almost Heaven brings the songs of John Denver to Maples Repertory Theatre in Macon, Missouri, through a landscape of open roads, mountain air, and American folk memory. The musical does not depend on a single linear plot so much as an accumulation of feeling: leaving and returning, wanting space, looking for home, and finding community in music that feels both public and deeply personal.",
      "Directed by Trevor Belt, the production offers a scenic opportunity to support a world that can shift between concert, memory, and imagined place without losing the intimacy of the performers. The design language needs room for horizon, warmth, and lyric simplicity while still giving the ensemble a strong theatrical frame for songs that move quickly from celebration to longing.",
    ],
    startDate: "2026-06-17",
    endDate: "2026-07-12",
    imageUrl: "/upcoming-productions/almost-heaven.webp",
    imageAlt: "Green and blue abstract mountain announcement graphic for Almost Heaven.",
    sourceUrl:
      "https://www.broadwayworld.com/equity-audition/Maples-Repertory-Theatre-2026-Season-Maples-Repertory-Theatre-2026-49613",
    sourceLabel: "Maples 2026 season listing",
  },
  {
    id: "youre-a-good-man-charlie-brown",
    title: "You're a Good Man, Charlie Brown",
    company: "Maples Repertory Theatre",
    companyUrl: "https://maplesrep.com/",
    venue: "Maples Repertory Theatre",
    location: {
      city: "Macon",
      region: "MO",
    },
    director: "Brandon McShaffrey",
    subtitle: "A Peanuts musical comedy",
    description:
      "You're a Good Man, Charlie Brown brings the Peanuts world to Maples Repertory Theatre as a series of small musical reckonings with friendship, failure, imagination, and ordinary courage. Directed by Brandon McShaffrey, the piece asks for a visual world that feels playful and specific without flattening childhood into nostalgia.",
    body: [
      "You're a Good Man, Charlie Brown arrives at Maples Repertory Theatre in Macon, Missouri, with the Peanuts characters caught in the familiar scale of childhood: school days, games, crushes, anxieties, tiny triumphs, and defeats that feel enormous in the moment. The musical works best when its world feels simple without becoming thin, allowing the humor and vulnerability of the characters to carry real emotional weight.",
      "Directed by Brandon McShaffrey, the production asks for a scenic environment that can hold sketch-like clarity, musical rhythm, and the elastic logic of a child's imagination. Rather than treating the material as pure nostalgia, the design can support a world where ordinary objects, open space, and precise color help the audience recognize the seriousness and sweetness inside small everyday rituals.",
    ],
    startDate: "2026-07-01",
    endDate: "2026-08-02",
    imageUrl: "/upcoming-productions/charlie-brown.webp",
    imageAlt: "Yellow abstract zigzag announcement graphic for You're a Good Man, Charlie Brown.",
    sourceUrl:
      "https://www.broadwayworld.com/equity-audition/Maples-Repertory-Theatre-2026-Season-Maples-Repertory-Theatre-2026-49613",
    sourceLabel: "Maples 2026 season listing",
  },
  {
    id: "romeo-and-juliet",
    title: "Romeo and Juliet",
    company: "New Swan Shakespeare Festival",
    companyUrl: "https://newswanshakespeare.com/",
    venue: "New Swan Theater",
    location: {
      city: "Irvine",
      region: "CA",
    },
    director: "Rachael VanWormer",
    subtitle: "Shakespeare's tragedy in a Dust Bowl landscape",
    description:
      "At New Swan Shakespeare Festival, Romeo and Juliet is framed through Dust Bowl scarcity, letting romance, humor, family rupture, and public unrest press against one another under the open sky. Directed by Rachael VanWormer, the production gives the familiar tragedy a landscape of want, heat, and fragile hope.",
    body: [
      "Romeo and Juliet comes to New Swan Shakespeare Festival in Irvine, California, through a Dust Bowl frame, placing Shakespeare's story of young love inside a landscape marked by scarcity, heat, migration, and pressure. In that setting, public conflict and private tenderness feel inseparable; the world around the lovers is already unstable before their choices begin to change it.",
      "Directed by Rachael VanWormer, the production gives the familiar tragedy a visual field where romance, family allegiance, humor, and violence can all live under the open air of the New Swan space. The scenic work can lean into dust, exposed structure, and social compression, creating a place where hope appears fragile because the environment itself seems to be asking people to harden.",
    ],
    startDate: "2026-07-07",
    endDate: "2026-08-29",
    imageUrl: "/upcoming-productions/romeo-and-juliet.webp",
    imageAlt: "Dusty sepia announcement graphic for Romeo and Juliet.",
    sourceUrl: "https://newswanshakespeare.com/",
    sourceLabel: "New Swan 2026 season calendar",
  },
  {
    id: "merry-wives-of-windsor-cove",
    title: "The Merry Wives of Windsor Cove",
    company: "New Swan Shakespeare Festival",
    companyUrl: "https://newswanshakespeare.com/",
    venue: "New Swan Theater",
    location: {
      city: "Irvine",
      region: "CA",
    },
    director: "Eli Simon",
    subtitle: "A 1950s SoCal surf-town Shakespeare comedy",
    description:
      "The Merry Wives of Windsor Cove moves Shakespeare’s comedy into a rockin’ 1950s SoCal surf town for New Swan Shakespeare Festival, with skiffle-band energy, romantic mischief, and sitcom-bright reversals. Adapted by Anna Fitzgerald and Eli Simon and directed by Eli Simon, it calls for a world that can hold beach-town playfulness and the machinery of farce.",
    body: [
      "The Merry Wives of Windsor Cove reimagines Shakespeare's comedy for New Swan Shakespeare Festival in Irvine, California, as a rockin' 1950s Southern California surf town. Falstaff's schemes, local gossip, romantic misfires, and domestic reversals become part of a beach-town social world where everyone seems close enough to know everyone else's business.",
      "Adapted by Anna Fitzgerald and Eli Simon and directed by Eli Simon, the production invites a scenic approach that can balance period pleasure with the sharp machinery of farce. The world needs to feel bright, social, and musical, with enough graphic confidence to support skiffle-band energy, quick entrances, and comic exposure while still leaving room for the language to do its work.",
    ],
    startDate: "2026-07-08",
    endDate: "2026-08-30",
    imageUrl: "/upcoming-productions/merry-wives.webp",
    imageAlt: "Pink and blue abstract coastal announcement graphic for The Merry Wives of Windsor Cove.",
    sourceUrl: "https://newswanshakespeare.com/",
    sourceLabel: "New Swan 2026 season calendar",
  },
  {
    id: "never-can-say-goodbye",
    title: "Never Can Say Goodbye",
    company: "Okoboji Summer Theatre",
    companyUrl:
      "https://stephens.edu/conservatory-for-the-performing-arts/immersive-summer-theatre-at-okoboji/",
    venue: "Okoboji Summer Theatre",
    location: {
      city: "Okoboji",
      region: "IA",
    },
    director: "Susie Dycus",
    subtitle: "The 70s Beehive Musical",
    description:
      "At Okoboji Summer Theatre, Never Can Say Goodbye: The 70s Beehive Musical follows the Beehive lineage into a high-spirited celebration of 1970s pop, soul, and disco. Directed by Susie Dycus, the production centers a company of performers moving through the decade’s bold style, cultural charge, and nonstop music.",
    body: [
      "Never Can Say Goodbye: The 70s Beehive Musical continues the Beehive lineage at Okoboji Summer Theatre in Okoboji, Iowa, moving into a decade shaped by pop, soul, disco, changing fashion, and a new kind of stage confidence. The piece is built around musical momentum, but it also carries the pleasure of watching a company move through a cultural style that is bold, rhythmic, and instantly recognizable.",
      "Directed by Susie Dycus, the production calls for a scenic world that can support concert energy without becoming generic. The design can make space for color, height, movement, and performance focus while keeping the performers at the center of the experience. It should feel like a theatrical platform for memory, style, and music rather than a museum display of the decade.",
    ],
    startDate: "2026-07-21",
    endDate: "2026-07-26",
    imageUrl: "/upcoming-productions/never-can-say-goodbye-generated.webp",
    imageAlt: "Minimal magenta, amber, and indigo abstract announcement graphic for Never Can Say Goodbye.",
    sourceUrl: "https://vacationokoboji.com/event/never-can-say-goodbye-the-70s-beehive-musical/",
    sourceLabel: "Okoboji 2026 event listing",
  },
  {
    id: "nine-to-five",
    title: "9 to 5",
    company: "Okoboji Summer Theatre",
    companyUrl:
      "https://stephens.edu/conservatory-for-the-performing-arts/immersive-summer-theatre-at-okoboji/",
    venue: "Okoboji Summer Theatre",
    location: {
      city: "Okoboji",
      region: "IA",
    },
    director: "Bernie Monroe",
    subtitle: "Dolly Parton's workplace comedy musical",
    description:
      "Okoboji Summer Theatre’s 9 to 5 turns the Rolodex-era office into a bright comic battleground where Violet, Judy, and Doralee push back against a boss and a workplace built to underestimate them. Directed by Bernie Monroe, Dolly Parton and Patricia Resnick’s musical can swing from everyday corporate grind to revenge fantasy with wit and momentum.",
    body: [
      "9 to 5 comes to Okoboji Summer Theatre in Okoboji, Iowa, with Dolly Parton and Patricia Resnick's workplace comedy musical turning the Rolodex-era office into a bright comic battleground. Violet, Judy, and Doralee are surrounded by systems designed to diminish them: bad lighting, bad bosses, bad assumptions, and the daily grind of a workplace that treats women as disposable support.",
      "Directed by Bernie Monroe, the production offers a scenic world that can swing between recognizable office routine and the larger-than-life fantasy of getting even. The design can use desks, hierarchy, repetition, and period detail as comic tools, then break those systems open when the musical shifts into dream logic, revenge, and the joy of women claiming space.",
    ],
    startDate: "2026-08-04",
    endDate: "2026-08-09",
    imageUrl: "/upcoming-productions/nine-to-five.webp",
    imageAlt: "Green, yellow, and orange clock announcement graphic for 9 to 5.",
    sourceUrl:
      "https://stephens.edu/conservatory-for-the-performing-arts/immersive-summer-theatre-at-okoboji/",
    sourceLabel: "Okoboji 2026 season listing",
  },
];

export const archivedProductionEvents: UpcomingProduction[] = [
  {
    id: "the-glass-menagerie",
    status: "archived",
    title: "The Glass Menagerie",
    company: "Maples Repertory Theatre",
    companyUrl: "https://maplesrep.com/",
    venue: "Maples Repertory Theatre",
    location: {
      city: "Macon",
      region: "MO",
    },
    director: "Kimberly Braun",
    subtitle: "Tennessee Williams' memory play for Maples Repertory Theatre",
    description:
      "The Glass Menagerie was produced by Maples Repertory Theatre in 2025, directed by Kimberly Braun, with scenic design by Brandon PT Davis. The production framed the Wingfield apartment as memory architecture, allowing fragility, longing, and escape to exist inside one haunted domestic space.",
    body: [
      "The Glass Menagerie came to Maples Repertory Theatre in Macon, Missouri, as a memory play held between domestic realism and emotional distortion. Directed by Kimberly Braun, Tennessee Williams' portrait of the Wingfield family asks the scenic world to carry contradiction: the apartment must feel specific enough to trap Tom, Amanda, and Laura, while also remaining unstable enough to belong to recollection rather than documentary fact.",
      "Brandon PT Davis's scenic design shaped the Wingfield apartment as a layered interior of platform, threshold, and drift. The central playing space gave the family a clear domestic pressure point, while surrounding fragments, loose architecture, and memory-wall imagery allowed the room to feel partial and haunted. This archive event preserves the production context and links to the full portfolio project, where the production photography and design writing show how the set held intimacy, absence, and escape in the same frame.",
    ],
    startDate: "2025-10-17",
    endDate: "2025-10-26",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90010-cover-775dc22f.webp",
    imageAlt:
      "The Glass Menagerie scenic design cover at Maples Repertory Theatre, framing the Wingfield apartment as memory architecture.",
    sourceUrl: "https://www.maconmochamber.com/event-calendar/the-glass-menagerie-maples-repertory-theatre",
    sourceLabel: "Macon event listing",
    portfolioHref: "/project/the-glass-menagerie",
    portfolioLabel: "Portfolio project",
  },
  {
    id: "million-dollar-quartet",
    status: "archived",
    title: "Million Dollar Quartet",
    company: "South Coast Repertory Theatre",
    companyUrl: "https://www.scr.org/",
    venue: "South Coast Repertory",
    location: {
      city: "Costa Mesa",
      region: "CA",
    },
    director: "James Moye",
    subtitle: "A Sun Records musical for South Coast Repertory",
    description:
      "Million Dollar Quartet was produced by South Coast Repertory in 2025, originally directed by James Moye and directed by Kim Martin-Cotten, with scenic design by Brandon PT Davis and Efren Delgadillo Jr. The production built Sun Records as both an intimate recording studio and a charged performance environment.",
    body: [
      "Million Dollar Quartet opened South Coast Repertory's 2025-26 season by returning to the December 1956 meeting of Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins at Sun Records. Originally directed for SCR by James Moye and directed by Kim Martin-Cotten, the musical depends on the feeling that history is being made in a room small enough for everyone to hear one another breathe before the music lifts it into myth.",
      "Designed by Brandon PT Davis and Efren Delgadillo Jr., the scenic world treated Sun Records as an intimate working studio with the pressure and electricity of a live concert space. Period recording equipment, wood floors, control-room windows, gold records, and an illuminated SUN sign let the room stay grounded while still opening toward rock-and-roll spectacle. This archive page connects the public production record to the portfolio project, where the images and walkthrough show how the studio became both a place of work and a stage for memory.",
    ],
    startDate: "2025-09-13",
    endDate: "2025-10-19",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90087-cover-5a61d757.webp",
    imageAlt:
      "Million Dollar Quartet scenic design cover at South Coast Repertory, shaping Sun Records as an intimate studio and live music environment.",
    sourceUrl: "https://www.scr.org/plays/productions/25-26-season/million-dollar-quartet/",
    sourceLabel: "South Coast Repertory production",
    portfolioHref: "/project/million-dollar-quartet",
    portfolioLabel: "Portfolio project",
  },
  {
    id: "alls-well-that-ends-well",
    status: "archived",
    title: "All's Well That Ends Well",
    company: "New Swan Shakespeare Festival",
    companyUrl: "https://newswanshakespeare.com/",
    venue: "New Swan Theater",
    location: {
      city: "Irvine",
      region: "CA",
    },
    director: "Rob Salas",
    subtitle: "Shakespeare's problem comedy in a Romantic-era world",
    description:
      "All's Well That Ends Well was produced by New Swan Shakespeare Festival in 2025, directed by Rob Salas, with scenic design by Brandon PT Davis. The production framed Shakespeare's tale of love, pursuit, status, and transformation through drapery, heraldic detail, operatic reveal, and a visual shift between Roussillon and Florence.",
    body: [
      "All's Well That Ends Well joined New Swan Shakespeare Festival's 2025 repertory season as a Romantic-era reading of Shakespeare's uneasy comedy, directed by Rob Salas. The production follows Helena's pursuit of Bertram through questions of class, desire, obligation, deception, and courage, making the story less a simple romance than a theatrical argument about how far someone can move through a world determined to keep rank and feeling in separate rooms.",
      "For Brandon PT Davis's scenic design, the New Swan stage became a place of reveal and transformation rather than fixed architecture. Drapery, heraldic signage, warm stucco texture, and operatic transitions allowed the production to move between the ceremonial restraint of Roussillon and the more open, volatile world of Florence. As an archive event, this page records the production context while the full portfolio entry carries the visual documentation, including production photography and the design notes behind the scenic system.",
    ],
    startDate: "2025-07-02",
    endDate: "2025-08-29",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90071-cover-375c8ade.webp",
    imageAlt:
      "All's Well That Ends Well scenic design cover at New Swan Theatre Festival, with drapery, heraldic detail, and a world that moves between Roussillon and Florence.",
    sourceUrl: "https://newswanshakespeare.com/alls-well-that-ends-well-2025-season/",
    sourceLabel: "New Swan 2025 archive",
    portfolioHref: "/project/alls-well-that-ends-well",
    portfolioLabel: "Portfolio project",
  },
  {
    id: "much-ado-about-nothing",
    status: "archived",
    title: "Much Ado About Nothing",
    company: "New Swan Shakespeare Festival",
    companyUrl: "https://newswanshakespeare.com/",
    venue: "New Swan Theater",
    location: {
      city: "Irvine",
      region: "CA",
    },
    director: "Eli Simon",
    subtitle: "Shakespeare's comedy through a Wild West frame",
    description:
      "Much Ado About Nothing was produced by New Swan Shakespeare Festival in 2025, directed by Eli Simon, with scenic design by Brandon PT Davis. The production reimagined Shakespeare's romantic comedy through saloon architecture, frontier texture, live bluegrass energy, and the repertory demands of New Swan's outdoor theater.",
    body: [
      "Much Ado About Nothing arrived in New Swan Shakespeare Festival's 2025 season as a Wild West version of Shakespeare's comedy, directed by Eli Simon. The familiar sparring of Beatrice and Benedick, the public performance of masculinity, the volatility of rumor, and the joy of communal repair were all sharpened by a frontier setting where everyone is watching, bluffing, teasing, and protecting their own pride in plain sight.",
      "Brandon PT Davis's scenic design treated the western frame as behavior, not decoration. Saloon architecture, rough timber, practical thresholds, and repertory-friendly pieces gave the actors a public room for eavesdropping, pursuit, entrances, music, and comic collision while keeping the New Swan stage agile enough for alternating repertory. This archive event connects the production's public dates and creative context to the portfolio project, where the production photographs and design writing show how the scenic world supported speed, wit, and live theatrical play.",
    ],
    startDate: "2025-07-09",
    endDate: "2025-08-30",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90089-cover-a7f4725c.webp",
    imageAlt: "Much Ado About Nothing scenic design cover at the production venue, by Brandon PT Davis.",
    sourceUrl: "https://drama.arts.uci.edu/events/new-swan-shakespeare-festival-2025",
    sourceLabel: "UCI 2025 season listing",
    portfolioHref: "/project/much-ado-about-nothing",
    portfolioLabel: "Portfolio project",
  },
  {
    id: "bell-book-and-candle",
    status: "archived",
    title: "Bell, Book, and Candle",
    company: "Okoboji Summer Theatre",
    companyUrl:
      "https://stephens.edu/conservatory-for-the-performing-arts/immersive-summer-theatre-at-okoboji/",
    venue: "Okoboji Summer Theatre",
    location: {
      city: "Okoboji",
      region: "IA",
    },
    director: "Richard Biever",
    subtitle: "A mid-century comedy with a trace of magic",
    description:
      "Bell, Book, and Candle was produced by Okoboji Summer Theatre in 2025, directed by Richard Biever, with scenic design by Brandon PT Davis. The production used a grounded mid-century apartment to support wit, intimacy, and supernatural undertones without losing its domestic believability.",
    body: [
      "Bell, Book, and Candle played Okoboji Summer Theatre in July 2025 as John Van Druten's lighthearted 1950s comedy about enchantment, romance, and the consequences of falling honestly in love. Directed by Richard Biever, the production needed a world that could welcome supernatural possibility while still feeling like a complete, lived-in New York apartment where the social comedy could land naturally.",
      "Brandon PT Davis's scenic design built that world through mid-century domestic realism: practical doors, built-in shelving, defined wall planes, furniture pathways, and a green palette that gave the room warmth without overplaying the magic. The apartment held wit and intimacy first, letting the enchantment appear through atmosphere and behavior. This archive event links the public production record to the portfolio project, where the production images and design notes show how the room stayed human, functional, and quietly theatrical.",
    ],
    startDate: "2025-07-15",
    endDate: "2025-07-20",
    imageUrl:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90016-cover-7a4ed712.webp",
    imageAlt:
      "Bell, Book, and Candle scenic design cover at Okoboji Summer Theatre, with a grounded mid-century apartment and subtle magical atmosphere.",
    sourceUrl: "https://vacationokoboji.com/event/bell-book-and-candle/",
    sourceLabel: "Okoboji event listing",
    portfolioHref: "/project/bell-book-and-candle",
    portfolioLabel: "Portfolio project",
  },
];

export const productionEvents: UpcomingProduction[] = [
  ...upcomingProductions,
  ...archivedProductionEvents,
];

export function getUpcomingProductionById(id: string) {
  return upcomingProductions.find((production) => production.id === id) || null;
}

export function getProductionEventById(id: string) {
  return productionEvents.find((production) => production.id === id) || null;
}

export function formatUpcomingDateRange(production: UpcomingProduction) {
  const start = new Date(`${production.startDate}T00:00:00Z`);
  const end = new Date(`${production.endDate}T00:00:00Z`);
  const sameMonth = start.getUTCMonth() === end.getUTCMonth();
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
  const day = new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: "UTC" });

  if (sameMonth) {
    return `${month.format(start)} ${day.format(start)}-${day.format(end)}, ${end.getUTCFullYear()}`;
  }

  return `${month.format(start)} ${day.format(start)}-${month.format(end)} ${day.format(end)}, ${end.getUTCFullYear()}`;
}

export function getUpcomingMonthLabel(production: UpcomingProduction) {
  return new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
    new Date(`${production.startDate}T00:00:00Z`)
  );
}

export function getUpcomingDayLabel(production: UpcomingProduction) {
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone: "UTC" }).format(
    new Date(`${production.startDate}T00:00:00Z`)
  );
}
