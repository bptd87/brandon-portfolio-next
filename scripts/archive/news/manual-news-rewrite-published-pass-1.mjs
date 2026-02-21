import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  {
    id: 150001,
    subtitle: 'Profile interview on career trajectory, process, and scenic values',
    excerpt: 'VoyageLA featured Brandon PT Davis in a Rising Stars profile focused on scenic design growth, artistic voice, and long-term career direction in Southern California.',
    seo_title: 'VoyageLA Interview: Brandon PT Davis Scenic Design Career',
    seo_description: 'Rising Stars interview with Brandon PT Davis on scenic design process, career milestones, and current work in theatre and production design.',
    blocks: [
      { type: 'heading', level: 2, content: 'VoyageLA Feature Interview' },
      { type: 'text', content: 'VoyageLA published a Rising Stars interview profiling my path from early regional theatre work to current scenic design and teaching leadership. The conversation covers process, collaboration, and how production realities shape design decisions.' },
      { type: 'heading', level: 3, content: 'Editorial Focus' },
      { type: 'list', ordered: false, items: ['Career progression across regional and academic theatre', 'How storytelling goals drive scenic systems and material choices', 'Building sustainable professional authority through visible, documented work'] },
      { type: 'text', content: 'This feature is an important external reference for the broader narrative of my design practice and ongoing body of work.' }
    ]
  },
  {
    id: 30005,
    subtitle: 'Independent review coverage of Million Dollar Quartet at SCR',
    excerpt: 'The Orange Curtain Review highlighted scenic and performance energy in South Coast Repertory’s Million Dollar Quartet, adding third-party critical context to the production.',
    seo_title: 'Million Dollar Quartet Review at SCR | Orange Curtain Review',
    seo_description: 'Independent review coverage of Million Dollar Quartet at South Coast Repertory, documenting scenic impact and production response.',
    blocks: [
      { type: 'heading', level: 2, content: 'Critical Response at South Coast Repertory' },
      { type: 'text', content: 'The Orange Curtain Review published a positive response to Million Dollar Quartet at South Coast Repertory, recognizing the show’s momentum and production polish. For this project, scenic design had to support music-forward storytelling without competing with performance rhythm.' },
      { type: 'heading', level: 3, content: 'Design Takeaway' },
      { type: 'text', content: 'The work balanced period specificity with a flexible stage picture that could carry transitions, ensemble traffic, and musical focus cleanly through the evening.' },
      { type: 'heading', level: 3, content: 'Key Details' },
      { type: 'list', ordered: false, items: ['Production: Million Dollar Quartet', 'Venue: South Coast Repertory (Costa Mesa, CA)', 'Coverage: The Orange Curtain Review, Stage Raw, and SCR publications'] }
    ]
  },
  {
    id: 1,
    subtitle: 'Production debut at South Coast Repertory in 2025',
    excerpt: 'Million Dollar Quartet marked Brandon PT Davis’s South Coast Repertory debut, with a scenic approach built for tempo, nostalgia, and clean musical storytelling.',
    seo_title: 'SCR Debut: Million Dollar Quartet Scenic Design Notes',
    seo_description: 'Design notes and production context for Million Dollar Quartet at South Coast Repertory, including scenic priorities and opening response.',
    blocks: [
      { type: 'heading', level: 2, content: 'South Coast Repertory Debut' },
      { type: 'text', content: 'Million Dollar Quartet at SCR was a milestone debut and a strong opportunity to contribute to a high-visibility production with tight musical pacing. Scenic planning centered on rhythm, performer support, and a visual language that held period character without visual clutter.' },
      { type: 'heading', level: 3, content: 'Scenic Priorities' },
      { type: 'list', ordered: false, items: ['Maintain sightline clarity for music-driven staging', 'Support rapid emotional and energy shifts in the room', 'Integrate period texture without sacrificing stage functionality'] },
      { type: 'text', content: 'External press and production coverage around this opening expanded visibility for the work and documented the project’s public reception.' }
    ]
  },
  {
    id: 2,
    subtitle: 'Assistant Scenic Designer to Tom Buderwitz',
    excerpt: 'Assistant scenic design credit on Seattle Rep’s The Play That Goes Wrong, supporting a precision comedy environment where scenic timing is part of the performance engine.',
    seo_title: 'Assistant Scenic Design: The Play That Goes Wrong at Seattle Rep',
    seo_description: 'Assistant scenic design work with Tom Buderwitz at Seattle Rep for The Play That Goes Wrong, focused on timing, safety, and comedic scenic precision.',
    blocks: [
      { type: 'heading', level: 2, content: 'Assistant Scenic Design Credit at Seattle Rep' },
      { type: 'text', content: 'On The Play That Goes Wrong, I supported scenic implementation as Assistant Scenic Designer to Tom Buderwitz. The show depends on exact technical choreography; design decisions and construction details directly impact comic timing and performer safety.' },
      { type: 'heading', level: 3, content: 'Role Scope' },
      { type: 'list', ordered: false, items: ['Coordinate detail-level scenic communication', 'Support execution of mechanical and sequence-based moments', 'Maintain consistency between design intent and build reality'] },
      { type: 'text', content: 'This credit reflects high-trust assistant scenic practice in a production where precision is the storytelling mechanism.' }
    ]
  },
  {
    id: 3,
    subtitle: 'Milestone season marker at Okoboji Summer Theatre',
    excerpt: 'Crossing 40 productions at Okoboji Summer Theatre reflects sustained scenic practice, production range, and long-term collaboration in repertory-style summer stock.',
    seo_title: '40 Productions at Okoboji Summer Theatre | Scenic Milestone',
    seo_description: 'Career milestone post marking 40 productions at Okoboji Summer Theatre and the production discipline developed through summer repertory work.',
    blocks: [
      { type: 'heading', level: 2, content: '40-Production Milestone' },
      { type: 'text', content: 'Reaching 40 productions at Okoboji Summer Theatre marks years of sustained scenic work under fast schedules and high output conditions. Summer stock sharpened my approach to clarity, collaboration, and build-aware design choices.' },
      { type: 'heading', level: 3, content: 'What the Milestone Represents' },
      { type: 'list', ordered: false, items: ['Consistent scenic execution across multiple genres', 'Deep collaboration with directors, shops, and crews', 'Improved speed-to-quality balance in production workflows'] },
      { type: 'text', content: 'The milestone also tracks cumulative trust built across teams and seasons, not just volume of credits.' }
    ]
  },
  {
    id: 30009,
    subtitle: 'Opening coverage from the 2025 Okoboji season',
    excerpt: 'Deathtrap opened at Okoboji Summer Theatre with press coverage and strong audience response, highlighting suspense-driven scenic storytelling and stage control.',
    seo_title: 'Deathtrap Opening Night at Okoboji Summer Theatre',
    seo_description: 'Opening-night post for Deathtrap at Okoboji Summer Theatre with scenic design notes and external production coverage context.',
    blocks: [
      { type: 'heading', level: 2, content: 'Deathtrap Opening at Okoboji' },
      { type: 'text', content: 'Deathtrap opened as part of the Okoboji Summer Theatre season with press attention and strong local engagement. The design challenge was sustaining tension through visual restraint while preserving clear actor pathways and reveal mechanics.' },
      { type: 'heading', level: 3, content: 'Scenic Approach' },
      { type: 'list', ordered: false, items: ['Build suspense through controlled visual information', 'Support shifts in tone without breaking narrative momentum', 'Prioritize reliability in cue-heavy sequence work'] },
      { type: 'text', content: 'Coverage around the opening adds useful third-party documentation of the production’s early response.' }
    ]
  },
  {
    id: 4,
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Fifth season of assistant scenic collaboration with Jo Winiarski at Utah Shakespeare Festival, reinforcing continuity, scale management, and high-volume repertory support.',
    seo_title: 'Assistant Scenic Design: Fifth Season at Utah Shakespeare Festival',
    seo_description: 'Fifth season assistant scenic credit at Utah Shakespeare Festival with Jo Winiarski, focused on repertory execution and design continuity.',
    blocks: [
      { type: 'heading', level: 2, content: 'Fifth Season at Utah Shakespeare Festival' },
      { type: 'text', content: 'This season marked my fifth year supporting Jo Winiarski as Assistant Scenic Designer at Utah Shakespeare Festival. Repertory structures demand rapid alignment between concept, drafting, construction, and stage operations across multiple productions.' },
      { type: 'heading', level: 3, content: 'Assistant Scenic Value in Repertory' },
      { type: 'list', ordered: false, items: ['Maintain continuity across overlapping show timelines', 'Translate design intent into dependable production communication', 'Reduce handoff risk between design and build teams'] },
      { type: 'text', content: 'Long-term collaboration at this scale strengthens both artistic consistency and technical reliability.' }
    ]
  },
  {
    id: 30011,
    subtitle: 'Season scenic design work across New Swan productions',
    excerpt: '2025 New Swan season work emphasized flexible staging systems and text-forward design choices tailored to repertory demands and audience intimacy.',
    seo_title: 'New Swan Shakespeare Festival 2025 Scenic Design Season',
    seo_description: 'Season overview of scenic design work for New Swan Shakespeare Festival in 2025, including process and production priorities.',
    blocks: [
      { type: 'heading', level: 2, content: '2025 New Swan Scenic Design Season' },
      { type: 'text', content: 'Designing for New Swan in 2025 required systems thinking: each production needed visual specificity while still functioning inside practical repertory constraints. The focus stayed on actor-centered space, compositional clarity, and adaptable scenic vocabulary.' },
      { type: 'heading', level: 3, content: 'Season Strategy' },
      { type: 'list', ordered: false, items: ['Create a coherent design language across titles', 'Support rapid technical turnover requirements', 'Preserve strong story readability from all seating angles'] },
      { type: 'text', content: 'The season reinforced how disciplined scenic planning can expand artistic range without sacrificing production efficiency.' }
    ]
  },
  {
    id: 30012,
    subtitle: 'Opening report from University of Missouri production',
    excerpt: 'Romero opened at University of Missouri with a design world shaped by memory, ritual, and tension between realism and spiritual space.',
    seo_title: 'Romero Opening Night Scenic Design at University of Missouri',
    seo_description: 'Opening-night scenic design notes for Romero at University of Missouri, including concept and performance-space priorities.',
    blocks: [
      { type: 'heading', level: 2, content: 'Opening Night: Romero' },
      { type: 'text', content: 'Romero opened at the University of Missouri with a scenic world designed to hold memory, conflict, and spiritual gravity in the same visual frame. The design language favored layered atmosphere over literal documentary reconstruction.' },
      { type: 'heading', level: 3, content: 'Design Intent' },
      { type: 'list', ordered: false, items: ['Balance historical reference with theatrical compression', 'Create visual tension between sacred and political space', 'Support ensemble staging without diluting intimacy'] },
      { type: 'text', content: 'The opening confirmed that restrained scenic structure can deliver strong emotional scale when composition and texture are doing focused dramaturgical work.' }
    ]
  },
  {
    id: 30013,
    subtitle: 'Season planning and design coverage for summer stock programming',
    excerpt: 'Okoboji Summer Theatre’s 2025 slate advanced a wide scenic range, requiring modular planning and fast adaptation across the season lineup.',
    seo_title: 'Okoboji Summer Theatre 2025 Scenic Design Season',
    seo_description: 'Season post on scenic design planning for Okoboji Summer Theatre in 2025, with focus on workflow and multi-show coordination.',
    blocks: [
      { type: 'heading', level: 2, content: 'Summer 2025 Season Planning at Okoboji' },
      { type: 'text', content: 'The 2025 season at Okoboji demanded range: comedy, period material, and music-forward titles each required distinct visual treatment under compressed timelines. Scenic systems were designed for quick pivots while preserving show-specific identity.' },
      { type: 'heading', level: 3, content: 'Production Priorities' },
      { type: 'list', ordered: false, items: ['Modular scenic solutions across changing repertory needs', 'Clear drafting and communication for accelerated build cycles', 'Audience-first composition despite tight technical windows'] },
      { type: 'text', content: 'This season work reflects the practical discipline required to deliver high-volume scenic output without flattening artistic intent.' }
    ]
  },
  {
    id: 30014,
    subtitle: 'Independent review response from SLO Review',
    excerpt: 'SLO Review recognized Shut Up, Sherlock with strong critical language, documenting audience-facing success for the production’s comedic scenic framing.',
    seo_title: 'Shut Up, Sherlock Review Coverage | SLO Review',
    seo_description: 'Press coverage post documenting SLO Review response to Shut Up, Sherlock and scenic storytelling outcomes.',
    blocks: [
      { type: 'heading', level: 2, content: 'SLO Review Coverage: Shut Up, Sherlock' },
      { type: 'text', content: 'SLO Review published a strong response to Shut Up, Sherlock, noting the production’s entertainment value and stage vitality. Scenic choices for this show leaned into pace, sightline readability, and comic reveal support.' },
      { type: 'heading', level: 3, content: 'Why This Coverage Matters' },
      { type: 'list', ordered: false, items: ['Independent review source', 'Public validation of production execution', 'Search-visible documentation of show reception'] }
    ]
  },
  {
    id: 30015,
    subtitle: 'Opening-night production record from Okoboji season',
    excerpt: 'How to Succeed in Business Without Really Trying opened at OST with a scenic package built for comedy timing, musical flow, and clean transitions.',
    seo_title: 'How to Succeed Opening Night at OST | Scenic Notes',
    seo_description: 'Opening-night scenic design notes for How to Succeed in Business Without Really Trying at Okoboji Summer Theatre.',
    blocks: [
      { type: 'heading', level: 2, content: 'Opening Night: How to Succeed at OST' },
      { type: 'text', content: 'The production opened at Okoboji Summer Theatre with a scenic strategy tuned to musical pace and broad comic timing. The visual system prioritized efficient transitions and performer-forward staging across ensemble-heavy moments.' },
      { type: 'heading', level: 3, content: 'Scenic Mechanics' },
      { type: 'list', ordered: false, items: ['Transition structure to preserve musical momentum', 'Spatial framing that supports comic beats', 'Repeatable scenic reliability for full run consistency'] }
    ]
  },
  {
    id: 30016,
    subtitle: 'Press and review response for Guys on Ice',
    excerpt: 'Guys on Ice received favorable independent coverage, reinforcing the production’s local impact and visibility for scenic execution in comic storytelling.',
    seo_title: 'Guys on Ice Review Coverage | SLO Review',
    seo_description: 'Coverage archive for Guys on Ice, including external review context and scenic storytelling priorities.',
    blocks: [
      { type: 'heading', level: 2, content: 'Review Coverage: Guys on Ice' },
      { type: 'text', content: 'Independent press recognized Guys on Ice with positive commentary, adding visible third-party context to the production run. Scenic work for this project centered on tonal precision and practical performer support in a comedy format.' },
      { type: 'heading', level: 3, content: 'Coverage Value' },
      { type: 'list', ordered: false, items: ['Captures public response during run', 'Adds external credibility to production record', 'Supports long-tail discoverability for scenic credits'] }
    ]
  },
  {
    id: 30017,
    subtitle: 'Regional review coverage for OST production',
    excerpt: 'Freaky Friday at OST received regional review attention, documenting audience reception and the production’s visual storytelling balance.',
    seo_title: 'Freaky Friday at Okoboji Summer Theatre Review Coverage',
    seo_description: 'Regional press coverage post for Freaky Friday at OST, with scenic design context and performance response.',
    blocks: [
      { type: 'heading', level: 2, content: 'Review Coverage: Freaky Friday at OST' },
      { type: 'text', content: 'Regional coverage of Freaky Friday captured the production’s strong reception and helped document the season’s design outcomes. Scenic priorities emphasized flexibility, quick shifts in perspective, and readable visual contrasts aligned with the script’s body-swap premise.' },
      { type: 'heading', level: 3, content: 'Design Focus' },
      { type: 'list', ordered: false, items: ['Visual clarity through rapid narrative turns', 'Scenery that supports comedic and emotional transitions', 'Efficient run-of-show operation for summer stock pacing'] }
    ]
  },
  {
    id: 5,
    subtitle: 'Professional affiliation milestone in scenic design career',
    excerpt: 'Joining United Scenic Artists Local USA 829 marked a major professional milestone and formal alignment with industry labor and craft standards.',
    seo_title: 'Joined United Scenic Artists Local USA 829',
    seo_description: 'Career milestone post marking union affiliation with United Scenic Artists Local USA 829 and its impact on professional practice.',
    blocks: [
      { type: 'heading', level: 2, content: 'United Scenic Artists Local 829 Milestone' },
      { type: 'text', content: 'Joining United Scenic Artists, Local USA 829, marked a significant step in my professional trajectory as a scenic designer. This affiliation aligns my practice with recognized labor standards, peer networks, and long-term career infrastructure in the field.' },
      { type: 'heading', level: 3, content: 'Professional Impact' },
      { type: 'list', ordered: false, items: ['Formal recognition inside the scenic design labor ecosystem', 'Stronger positioning for major regional and national opportunities', 'Commitment to sustained professional craft standards'] }
    ]
  },
  {
    id: 30019,
    subtitle: 'Press highlight for Theatre SilCo production work',
    excerpt: 'Summit Daily coverage of Forum at Theatre SilCo added regional visibility to scenic contributions and production storytelling outcomes.',
    seo_title: 'Forum at Theatre SilCo Press Coverage | Summit Daily',
    seo_description: 'Regional press coverage post for Forum at Theatre SilCo with scenic design context and production notes.',
    blocks: [
      { type: 'heading', level: 2, content: 'Summit Daily Coverage: Forum at Theatre SilCo' },
      { type: 'text', content: 'Forum at Theatre SilCo was highlighted in Summit Daily, providing public documentation of the production and design team’s work. Scenic execution focused on durability, readability, and tonal support for a classic farce structure.' },
      { type: 'heading', level: 3, content: 'Production Context' },
      { type: 'list', ordered: false, items: ['Venue: Theatre SilCo', 'Coverage source: Summit Daily', 'Discipline: Scenic Design'] }
    ]
  },
  {
    id: 30020,
    subtitle: 'Season announcement with scenic design slate visibility',
    excerpt: 'The 2024 Okoboji season announcement highlighted upcoming scenic design contributions and expanded public visibility for the summer lineup.',
    seo_title: '2024 Okoboji Summer Theatre Season Scenic Design Announcement',
    seo_description: 'Season announcement post documenting 2024 Okoboji Summer Theatre scenic design lineup and production planning context.',
    blocks: [
      { type: 'heading', level: 2, content: '2024 Season Announcement at Okoboji' },
      { type: 'text', content: 'The 2024 season announcement at Okoboji Summer Theatre established the upcoming production slate and framed the year’s scenic design scope. Early visibility around season planning supports audience engagement, donor interest, and production momentum.' },
      { type: 'heading', level: 3, content: 'Season-Level Design Priorities' },
      { type: 'list', ordered: false, items: ['Prepare scalable scenic systems for multiple productions', 'Maintain strong visual identity across contrasting titles', 'Coordinate design planning with accelerated summer timelines'] }
    ]
  },
  {
    id: 30021,
    subtitle: 'Production and feature visibility for Theatre SilCo work',
    excerpt: 'Scenic design for ¡Lotería: Game On! at Theatre SilCo received public feature visibility, documenting bilingual storytelling support and regional engagement.',
    seo_title: 'Scenic Design for ¡Lotería: Game On! at Theatre SilCo',
    seo_description: 'Production post and coverage context for scenic design work on ¡Lotería: Game On! at Theatre SilCo.',
    blocks: [
      { type: 'heading', level: 2, content: 'Theatre SilCo Production: ¡Lotería: Game On!' },
      { type: 'text', content: 'This production at Theatre SilCo offered a strong platform for culturally specific storytelling and high-clarity scenic support. The design needed to carry playful energy while maintaining practical flexibility for performers and transitions.' },
      { type: 'heading', level: 3, content: 'Scenic Considerations' },
      { type: 'list', ordered: false, items: ['Visual language responsive to the script’s cultural texture', 'Flexible stage composition for pacing and movement', 'Durable, audience-readable scenic choices for full run'] }
    ]
  },
  {
    id: 30022,
    subtitle: 'Assistant Scenic Designer credit on Off-Broadway production',
    excerpt: 'Assistant scenic design work on The Fears at Signature Theatre (Off-Broadway), supporting execution, communication, and design continuity in a New York production context.',
    seo_title: 'Assistant Scenic Design: The Fears at Signature Theatre',
    seo_description: 'Assistant scenic design credit for The Fears at Signature Theatre Off-Broadway, including role scope and production context.',
    blocks: [
      { type: 'heading', level: 2, content: 'Off-Broadway Assistant Scenic Credit' },
      { type: 'text', content: 'On The Fears at Signature Theatre, I served as Assistant Scenic Designer supporting design delivery in an Off-Broadway context. The role required rigorous communication, detail tracking, and consistency as the production moved through previews and run.' },
      { type: 'heading', level: 3, content: 'Assistant Role Scope' },
      { type: 'list', ordered: false, items: ['Support principal designer intent across departments', 'Help manage scenic documentation and implementation details', 'Maintain alignment between rehearsal discoveries and design continuity'] }
    ]
  },
  {
    id: 30023,
    subtitle: 'Teaching and design priorities at Stephens College',
    excerpt: 'Spring 2022 update from Stephens College focused on classroom mentorship, production planning, and scenic process development with students.',
    seo_title: 'Stephens College Spring 2022 Scenic Design & Teaching Update',
    seo_description: 'Spring 2022 update on scenic design teaching and production work at Stephens College.',
    blocks: [
      { type: 'heading', level: 2, content: 'Spring 2022 at Stephens College' },
      { type: 'text', content: 'This period at Stephens College balanced active teaching with production planning and student mentorship. The work emphasized repeatable process habits, drafting clarity, and practical collaboration standards for emerging designers.' },
      { type: 'heading', level: 3, content: 'Focus Areas' },
      { type: 'list', ordered: false, items: ['Studio pedagogy rooted in real production constraints', 'Applied scenic design development through mainstage work', 'Building communication discipline for student design teams'] }
    ]
  },
  {
    id: 30024,
    subtitle: 'Faculty transition into scenic design leadership role',
    excerpt: 'Return to Stephens College as Assistant Professor of Scenic Design marked a major teaching and mentorship transition aligned with ongoing production practice.',
    seo_title: 'Returning to Stephens College as Assistant Professor of Scenic Design',
    seo_description: 'Career and faculty update on returning to Stephens College as Assistant Professor of Scenic Design.',
    blocks: [
      { type: 'heading', level: 2, content: 'Return to Stephens College' },
      { type: 'text', content: 'Returning to Stephens College as Assistant Professor of Scenic Design formalized a new chapter focused on training designers while maintaining active production practice. The role brings together mentorship, curriculum delivery, and real-world scenic execution.' },
      { type: 'heading', level: 3, content: 'Teaching Philosophy in Practice' },
      { type: 'list', ordered: false, items: ['Prioritize communication clarity as a design skill', 'Train students to connect concept and build feasibility', 'Use production work to ground classroom instruction'] }
    ]
  },
  {
    id: 30025,
    subtitle: 'Post-shutdown in-person production work at UTEP',
    excerpt: 'Lysistrata at UTEP documented a return-to-stage moment where scenic design had to balance artistic intent with operational and safety realities.',
    seo_title: 'Lysistrata Scenic Design at UTEP | Spring 2021',
    seo_description: 'Scenic design notes for Lysistrata at UTEP during the return to in-person production in 2021.',
    blocks: [
      { type: 'heading', level: 2, content: 'Lysistrata at UTEP: Scenic Process' },
      { type: 'text', content: 'Lysistrata at UTEP was developed during a critical return-to-stage period. Scenic planning had to deliver narrative clarity while adapting to updated operational conditions and rehearsal realities.' },
      { type: 'heading', level: 3, content: 'Project Priorities' },
      { type: 'list', ordered: false, items: ['Design choices that remained robust under changing constraints', 'Clear traffic and composition for actor-centered storytelling', 'Practical scenic systems suitable for safe, reliable execution'] }
    ]
  },
  {
    id: 30026,
    subtitle: 'MFA completion milestone during pandemic conditions',
    excerpt: 'Graduating from UC Irvine in 2020 marked the transition from MFA training into expanded professional practice during an industry-wide disruption period.',
    seo_title: 'Graduating from UC Irvine MFA Scenic Design Program (2020)',
    seo_description: 'Career milestone post on completing the MFA in Scenic Design at UC Irvine during the pandemic period.',
    blocks: [
      { type: 'heading', level: 2, content: 'UC Irvine MFA Milestone' },
      { type: 'text', content: 'Completing the MFA in Scenic Design at UC Irvine during the pandemic marked a pivotal transition point. The period reinforced resilience, process discipline, and the value of maintaining artistic momentum under uncertain production conditions.' },
      { type: 'heading', level: 3, content: 'Long-Term Impact' },
      { type: 'list', ordered: false, items: ['Strengthened conceptual and technical design foundation', 'Expanded readiness for varied production contexts', 'Clarified a practice centered on story, collaboration, and build logic'] }
    ]
  },
  {
    id: 30027,
    subtitle: 'Academic leadership role in scenic design and technology',
    excerpt: 'Career update on joining UTEP as Assistant Professor of Scenic Design & Technology, integrating pedagogy, production mentorship, and applied design workflows.',
    seo_title: 'Assistant Professor of Scenic Design & Technology at UTEP',
    seo_description: 'Career update on joining UTEP as Assistant Professor, with scenic teaching and production focus areas.',
    blocks: [
      { type: 'heading', level: 2, content: 'Career Update: UTEP Faculty Appointment' },
      { type: 'text', content: 'Joining UTEP as Assistant Professor of Scenic Design & Technology expanded my work at the intersection of design practice and education. The role supports both classroom development and production mentorship in a fast-changing theatre landscape.' },
      { type: 'heading', level: 3, content: 'Primary Focus' },
      { type: 'list', ordered: false, items: ['Scenic curriculum with strong technical integration', 'Student preparation for professional production standards', 'Design leadership grounded in practical collaboration'] }
    ]
  },
  {
    id: 30028,
    subtitle: 'Third-party review visibility for UC Irvine production',
    excerpt: 'StageSceneLA coverage of Company at UC Irvine provided public critical context for scenic design decisions and overall production response.',
    seo_title: 'Company at UC Irvine | StageSceneLA Coverage',
    seo_description: 'External review coverage post for Company at UC Irvine with scenic design context and production documentation.',
    blocks: [
      { type: 'heading', level: 2, content: 'StageSceneLA Coverage: Company at UCI' },
      { type: 'text', content: 'Company at UC Irvine received StageSceneLA coverage, adding independent documentation to the production record. Scenic choices for this project aimed to support Sondheim’s tonal complexity while preserving staging flexibility.' },
      { type: 'heading', level: 3, content: 'Design Priorities' },
      { type: 'list', ordered: false, items: ['Compose playable space for musical and dramatic shifts', 'Keep visual language elegant but actor-supportive', 'Sustain clarity across ensemble scenes and transitions'] }
    ]
  },
  {
    id: 30029,
    subtitle: 'Critical and institutional response to UCI production',
    excerpt: 'The Pajama Game at UC Irvine received multiple coverage mentions, creating a strong external record of the production and scenic design contribution.',
    seo_title: 'The Pajama Game at UC Irvine Review Coverage',
    seo_description: 'Press and institutional coverage archive for The Pajama Game at UC Irvine and associated scenic design outcomes.',
    blocks: [
      { type: 'heading', level: 2, content: 'Coverage Roundup: The Pajama Game at UCI' },
      { type: 'text', content: 'The Pajama Game generated multiple external references, including review and institutional coverage. This broader documentation strengthens the production’s archive value and gives prospective collaborators clearer evidence of design impact.' },
      { type: 'heading', level: 3, content: 'Coverage Footprint' },
      { type: 'list', ordered: false, items: ['StageSceneLA review coverage', 'UCI Arts and UCI Drama references', 'Additional student press visibility via New University'] }
    ]
  },
  {
    id: 30030,
    subtitle: 'California premiere production context at UC Irvine',
    excerpt: 'Parliament Square at UC Irvine carried the visibility of a California premiere with scenic design priorities centered on political tone, composition, and pace.',
    seo_title: 'Parliament Square California Premiere at UC Irvine',
    seo_description: 'Production context and scenic design notes for Parliament Square California premiere at UC Irvine.',
    blocks: [
      { type: 'heading', level: 2, content: 'Parliament Square at UC Irvine' },
      { type: 'text', content: 'For UC Irvine’s California premiere of Parliament Square, scenic work needed to support a politically charged script with sharp tonal control. The visual strategy prioritized compositional discipline and playable space for rapid dramatic escalation.' },
      { type: 'heading', level: 3, content: 'Scenic Objectives' },
      { type: 'list', ordered: false, items: ['Establish a credible political-social world quickly', 'Support tension-building through spatial control', 'Keep stage language focused on actor relationships'] }
    ]
  },
  {
    id: 30031,
    subtitle: 'External review response for UC Irvine production',
    excerpt: 'American Idiot at UC Irvine received outside review attention, documenting scenic contribution to a high-energy music-theatre production environment.',
    seo_title: 'American Idiot at UC Irvine Review | Scenic Design Context',
    seo_description: 'Review-linked production post for American Idiot at UC Irvine with scenic design and staging context.',
    blocks: [
      { type: 'heading', level: 2, content: 'Review Coverage: American Idiot at UCI' },
      { type: 'text', content: 'American Idiot at UC Irvine was reviewed by The Show Report, adding public-facing context to the production archive. Scenic priorities focused on kinetic composition, layered texture, and support for music-driven theatrical intensity.' },
      { type: 'heading', level: 3, content: 'Production Considerations' },
      { type: 'list', ordered: false, items: ['High-energy staging with clear visual anchors', 'Scenery that supports fast tonal and musical shifts', 'Durable design language for sustained run performance'] }
    ]
  },
  {
    id: 30032,
    subtitle: 'Graduate training transition into advanced scenic practice',
    excerpt: 'Starting the MFA at UC Irvine marked a foundational transition into advanced scenic design research, production development, and long-term professional growth.',
    seo_title: 'Beginning MFA Scenic Design Training at UC Irvine',
    seo_description: 'Career milestone post on beginning MFA studies in Scenic Design at UC Irvine and the resulting professional trajectory.',
    blocks: [
      { type: 'heading', level: 2, content: 'Beginning the MFA at UC Irvine' },
      { type: 'text', content: 'Beginning graduate study at UC Irvine was a foundational career transition, opening deeper investigation into scenic dramaturgy, technical development, and collaborative production methods.' },
      { type: 'heading', level: 3, content: 'Program Value' },
      { type: 'list', ordered: false, items: ['Advanced training in conceptual and technical scenic methods', 'Mentored production experience across varied texts', 'Long-term framework for professional design leadership'] }
    ]
  },
  {
    id: 30033,
    subtitle: 'Regional press visibility for Great American Melodrama production',
    excerpt: 'The Foreigner at Great American Melodrama received Tribune coverage, adding independent validation to scenic storytelling and production delivery.',
    seo_title: 'The Foreigner Review Coverage at Great American Melodrama',
    seo_description: 'Regional review coverage post for The Foreigner at Great American Melodrama with scenic design context.',
    blocks: [
      { type: 'heading', level: 2, content: 'Tribune Coverage: The Foreigner' },
      { type: 'text', content: 'The Foreigner at Great American Melodrama was covered by The Tribune, strengthening the public record of the production’s reception. Scenic design focused on comedic precision, clean spatial logic, and strong visual support for ensemble timing.' },
      { type: 'heading', level: 3, content: 'Key Details' },
      { type: 'list', ordered: false, items: ['Production: The Foreigner', 'Venue: The Great American Melodrama', 'Coverage source: The Tribune'] }
    ]
  }
];

for (const u of updates) {
  const { id, ...payload } = u;
  const { error } = await s.from('news').update(payload).eq('id', id);
  if (error) {
    console.error('Failed', id, error);
    process.exit(1);
  }
}

console.log(JSON.stringify({ updated: updates.length, ids: updates.map((u) => u.id) }, null, 2));
