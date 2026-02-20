import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const externalBySlug = {
  'the-glass-menagerie': [
    {
      title: 'The Glass Menagerie',
      url: 'https://maplesrep.com/the-glass-menagerie/',
      source: 'Maples Repertory Theatre',
    },
  ],
  'million-dollar-quartet': [
    {
      title: 'Million Dollar Quartet (2025 Production)',
      url: 'https://www.scr.org/plays/productions/25-26-season/million-dollar-quartet/',
      source: 'South Coast Repertory',
    },
  ],
  'much-ado-about-nothing': [
    {
      title: 'Double the Drama: New Swan\'s Shakespeare Season Embraces Romance, Wit and Reinvention',
      url: 'https://www.cultureoc.org/post/double-the-drama-new-swan-s-shakespeare-season-embraces-romance-wit-and-reinvention',
      source: 'Culture OC',
      publishedAt: '2025-07-23',
    },
  ],
  'alls-well-that-ends-well': [
    {
      title: 'Double the Drama: New Swan\'s Shakespeare Season Embraces Romance, Wit and Reinvention',
      url: 'https://www.cultureoc.org/post/double-the-drama-new-swan-s-shakespeare-season-embraces-romance-wit-and-reinvention',
      source: 'Culture OC',
      publishedAt: '2025-07-23',
    },
  ],
  'bell-book-and-candle': [
    {
      title: 'Bell, Book and Candle (Event Listing)',
      url: 'https://vacationokoboji.com/event/bell-book-and-candle/',
      source: 'Vacation Okoboji',
    },
  ],
  'romero': [
    {
      title: 'The Daily Blend w/ AC: Dr. David Crespy, Mizzou Theatre opens "Romero"',
      url: 'https://www.kbia.org/show/the-daily-blend/2025-04-18/the-daily-blend-w-ac-dr-david-crespy-mizzou-theatre-opens-romero',
      source: 'KBIA',
      publishedAt: '2025-04-18',
    },
  ],
  'urinetown': [
    {
      title: 'Urinetown the Musical at Rhynsburger Theater',
      url: 'https://www.broadwayworld.com/st-louis/regional/Urinetown-the-Musical-4285079',
      source: 'BroadwayWorld',
    },
  ],
  'barefoot-in-the-park': [
    {
      title: 'Okoboji Summer Theatre presents "Barefoot In The Park"',
      url: 'https://kiwaradio.com/event/okoboji-summer-theatre-presents-barefoot-in-the-park/',
      source: 'KIWA Radio',
    },
  ],
  'freaky-friday': [
    {
      title: 'Freaky Friday - 2024, Okoboji Summer Theatre (Production Photos)',
      url: 'https://www.wyattmunsey.com/production-photos/project-three-sng7y-9b7xy',
      source: 'Wyatt Munsey',
    },
  ],
  'head-over-heels': [
    {
      title: 'Keystone Art Festival returns ... and things to do this weekend',
      url: 'https://www.summitdaily.com/news/keystone-art-festival-returns-with-1-major-change-and-3-other-things-to-do-in-summit-county-this-weekend/',
      source: 'Summit Daily',
    },
  ],
  'loteria-game-on': [
    {
      title: '¡Lotería: Game On! (Play Page)',
      url: 'https://www.mabellereynoso.com/loter%C3%ADa-game-on',
      source: 'Mabelle Reynoso',
    },
  ],
  'boeing-boeing': [
    {
      title: 'Boeing Boeing - Playhouse Theatre Company (Event Listing)',
      url: 'https://stephensconnect.stephens.edu/events',
      source: 'Stephens Connect',
    },
  ],
  'an-inspector-calls': [
    {
      title: 'Lakes News Shopper listing for An Inspector Calls at OST',
      url: 'https://939c9b01811224bb3dcf-d6f090436a6f3838a347f2f22505b78d.ssl.cf5.rackcdn.com/uploads/editions/19979/original_aabc36875119d266f2f8d42af0ae4f5c7af53d2f.pdf',
      source: 'Lakes News Shopper',
      publishedAt: '2022-07-21',
    },
  ],
  'the-merry-wives-of-windsor': [
    {
      title: 'Stephens College theatre season listing including The Merry Wives of Windsor',
      url: 'https://www.patreon.com/posts/there-is-here-71725274',
      source: 'There Is Something Here for Everyone',
    },
  ],
  'tomas-and-the-library-lady': [
    {
      title: 'Membership Spotlight – April 2024',
      url: 'https://www.tyausa.org/tya-today/membership-spotlight-april-2024/',
      source: 'TYA/USA',
    },
  ],
  'the-penelopiad': [
    {
      title: 'UCI Drama Presents Margaret Atwood\'s THE PENELOPIAD',
      url: 'https://www.arts.uci.edu/press-room/uci-drama-presents-penelopiad',
      source: 'UCI Claire Trevor School of the Arts',
      publishedAt: '2020-01-17',
    },
  ],
  'company': [
    {
      title: 'UCI Drama\'s Relevant Take On “Company”',
      url: 'https://newuniversity.org/2019/12/02/uci-dramas-relevant-take-on-company/',
      source: 'New University (UC Irvine)',
      publishedAt: '2019-12-02',
    },
  ],
  'the-pajama-game': [
    {
      title: 'The Pajama Game',
      url: 'https://drama.arts.uci.edu/events/pajama-game',
      source: 'UCI Drama',
    },
  ],
  'parliament-square': [
    {
      title: 'UCI Drama Presents the California Premiere of PARLIAMENT SQUARE',
      url: 'https://www.arts.uci.edu/press-room/uci-drama-CA-premiere-parliament-square',
      source: 'UCI Claire Trevor School of the Arts',
      publishedAt: '2019-02-28',
    },
  ],
  'american-idiot': [
    {
      title: 'American Idiot',
      url: 'https://drama.arts.uci.edu/events/american-idiot',
      source: 'UCI Drama',
    },
  ],
  'angel-street': [
    {
      title: 'Summer theater announces 2013 schedule (includes Angel Street)',
      url: 'https://www.dglobe.com/news/summer-theater-announces-2013-schedule',
      source: 'The Globe',
      publishedAt: '2013-02-01',
    },
  ],
  'all-my-sons': [
    {
      title: 'Arthur Miller 2010 productions listing (includes Stephens College All My Sons)',
      url: 'https://www.ibiblio.org/miller/2010productions',
      source: 'The Arthur Miller Society',
    },
  ],
  'a-funny-thing-happened': [
    {
      title: 'Travel to ancient Rome with “A Funny Thing Happened on the Way to the Forum”',
      url: 'https://www.summitdaily.com/news/travel-to-ancient-rome-with-a-funny-thing-happened-on-the-way-to-the-forum/',
      source: 'Summit Daily',
    },
  ],
};

function normalizeNotes(raw) {
  if (!raw) return null;
  let text = String(raw).trim();
  if (!text) return null;

  if (text.startsWith('[') && text.endsWith(']')) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        text = parsed
          .map((part) => String(part || '').trim())
          .filter(Boolean)
          .join('\n\n');
      }
    } catch {
      // keep original if parse fails
    }
  }

  text = text.replace(/\[Input\]/gi, '').replace(/\r\n/g, '\n').trim();
  text = text.replace(/\n{3,}/g, '\n\n');

  return text || null;
}

const { data: projects, error } = await supabase
  .from('projects')
  .select('id,slug,discipline,design_notes,external_articles')
  .eq('discipline', 'scenic_design')
  .neq('status', 'archived');

if (error) {
  console.error(error);
  process.exit(1);
}

let touched = 0;
for (const p of projects || []) {
  const normalized = normalizeNotes(p.design_notes);
  const currentArticles = Array.isArray(p.external_articles) ? p.external_articles : [];
  const additions = externalBySlug[p.slug] || [];

  const mergedByUrl = new Map();
  for (const item of currentArticles) {
    if (item?.url) mergedByUrl.set(item.url, item);
  }
  for (const item of additions) {
    if (item?.url) mergedByUrl.set(item.url, item);
  }

  const nextArticles = Array.from(mergedByUrl.values());

  const shouldUpdateNotes = normalized !== (p.design_notes || null);
  const shouldUpdateArticles = JSON.stringify(nextArticles) !== JSON.stringify(currentArticles);

  if (!shouldUpdateNotes && !shouldUpdateArticles) continue;

  const payload = {};
  if (shouldUpdateNotes) payload.design_notes = normalized;
  if (shouldUpdateArticles) payload.external_articles = nextArticles;

  const { error: updateError } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', p.id);

  if (updateError) {
    console.error(`Failed ${p.slug}:`, updateError.message);
    continue;
  }

  touched += 1;
  console.log(`Updated ${p.slug}`);
}

console.log(`Done. Updated ${touched} scenic projects.`);
