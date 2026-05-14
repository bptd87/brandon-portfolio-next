import { generatedLocalArticles } from "./localArticles.generated";
import { applyBlobMediaManifest } from "./mediaBlob";
import {
  fileFirstArticleContentBySlug,
  fileFirstArticleFieldsBySlug,
} from "./fileFirstArticles.generated";
import urinetownArticleBlocks from "../content/articles/urinetown-scenic-design-building-a-dystopia-that-feels-uncomfortably-familiar/blocks.json";
import conceptMusicalArticleBlocks from "../content/articles/when-broadway-got-a-revolution-the-rise-of-the-concept-musical-in-the-1970s/blocks.json";
import britishMegamusicalArticleBlocks from "../content/articles/when-broadway-got-spectacular-the-rise-of-the-british-megamusical/blocks.json";
import evolutionNarrativeCinemaArticleBlocks from "../content/articles/the-evolutionof-narrativein-cinema/blocks.json";
import musicalCinema1980sArticleBlocks from "../content/articles/the-1980s-musical-cinema-revolution-when-mtv-met-broadway-on-the-silver-screen/blocks.json";
import lightingStylesArticleBlocks from "../content/articles/lighting-styles-in-ai-models/blocks.json";
import computerHardwareArticleBlocks from "../content/articles/computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care/blocks.json";
import soraArticleBlocks from "../content/articles/sora-in-the-studio-testing-ais-potential-for-theatrical-design/blocks.json";
import themedEntertainmentArticleBlocks from "../content/articles/the-evolution-of-themed-entertainment-from-ancient-gardens-to-modern-immersive-experienceses-everything/blocks.json";

export type LocalArticleBlock = Record<string, any>;

export interface LocalArticleAudio {
  url: string;
  label?: string;
  durationLabel?: string;
}

export interface LocalArticleSeries {
  name: string;
  slug: string;
  order: number;
}

export interface LocalArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  coverImageAlt: string;
  publishedAt: string;
  updatedAt: string;
  createdAt?: string;
  categoryName: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string | null;
  sourcePublication?: string | null;
  sourceUrl?: string | null;
  audio?: LocalArticleAudio;
  series?: LocalArticleSeries;
  linkedScenicProjectSlugs?: string[];
  tags?: Array<{ id: number; name: string; slug: string }>;
  content: LocalArticleBlock[] | string;
  featured?: boolean;
  readTime?: number | null;
}

export const VOYAGELA_ARTICLE_SLUG = "voyagela-rising-stars-interview";
export const VOYAGELA_EXTERNAL_URL =
  "https://voyagela.com/interview/rising-stars-meet-brandon-pt-davis-of-irvine-ca/";

const countWords = (value: string) => value.split(/\s+/).filter(Boolean).length;

const estimateReadTime = (content: LocalArticle["content"]) => {
  if (!Array.isArray(content)) {
    return Math.max(1, Math.ceil(countWords(String(content || "")) / 200));
  }

  const words = content.reduce((total, block) => {
    if (!block || typeof block !== "object") return total;

    if (typeof block.text === "string") {
      return total + countWords(block.text);
    }

    if (typeof block.content === "string") {
      return total + countWords(block.content.replace(/<[^>]+>/g, " "));
    }

    if (Array.isArray(block.items)) {
      return total + block.items.reduce((sum: number, item: string) => sum + countWords(String(item)), 0);
    }

    if (Array.isArray(block.images)) {
      return total;
    }

    if (Array.isArray(block.items) && block.type === "faq") {
      return (
        total +
        block.items.reduce(
          (sum: number, item: { question?: string; answer?: string }) =>
            sum + countWords(item.question || "") + countWords(item.answer || ""),
          0
        )
      );
    }

    return total;
  }, 0);

  return Math.max(1, Math.ceil(words / 200));
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeArticleCategory = (categoryName?: string | null) => {
  switch (categoryName) {
    case "Technology & Tutorials":
      return "Tools & Technology";
    case "Design Philosophy":
      return "Scenic Design";
    case "Scenic Design Process":
      return "Design Process";
    case "Musical Theatre & Cinema":
      return "Performance History & Culture";
    case "Editorial Profiles":
      return "Profiles & Interviews";
    default:
      return categoryName || "";
  }
};

const audioBySlug: Record<string, LocalArticleAudio> = {
  "empowering-theatre-students-with-computer-literacy": {
    url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/audio/migrated/supabase/local-articles/computer-literacy-751a62f4.mp3",
    label: "Listen to article",
    durationLabel: "5:50",
  },
  "youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision": {
    url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/audio/migrated/supabase/local-articles/your-wasting-my-time-a8f5760c.mp3",
    label: "Listen to article",
  },
  "online-portfolio-theatrical-design-2026": {
    url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/audio/migrated/supabase/local-articles/modern-portfolio-a0618467.mp3",
    label: "Listen to article",
  },
};

const articleFieldOverridesBySlug: Record<string, Partial<LocalArticle>> = {
  "online-portfolio-theatrical-design-2026": {
    categoryName: "Tools & Technology",
  },
  "becoming-a-scenic-designer-a-comprehensive-guide": {
    categoryName: "Scenic Design",
  },
  "video-game-environments-lessons-for-scenic-design": {
    categoryName: "Scenic Design",
  },
  "artistic-vision-in-scenic-design-finding-my-creative-voice": {
    categoryName: "Scenic Design",
  },
  "minimalist-scenic-design-dominating-regional-theatres-in-2025": {
    categoryName: "Scenic Design",
  },
  "the-lights-were-already-on-maude-adams-legacy-at-stephens-college": {
    categoryName: "Scenic Design",
  },
  "the-1960s-musical-revolution-when-hollywoods-golden-formula-met-rock-and-rebellion": {
    categoryName: "Performance History & Culture",
  },
  "building-the-visual-world-art-direction-in-film-television": {
    categoryName: "Performance History & Culture",
  },
  "the-golden-age-of-cinema-musicals-in-the-spotlight": {
    categoryName: "Performance History & Culture",
  },
  "the-golden-age-of-broadway-a-defining-era-in-musical-theatre": {
    categoryName: "Performance History & Culture",
  },
  "operas-foundations-the-evolution-of-scenic-design-in-opera": {
    categoryName: "Performance History & Culture",
  },
  "sora-in-the-studio-testing-ais-potential-for-theatrical-design": {
    categoryName: "Tools & Technology",
    coverImageAlt:
      "Desk with architectural sketches, a laptop, and a tablet displaying ruins against a yellow wall with shadows and drawings.",
    seoTitle: "Sora in the Studio | AI for Scenic Design Workflows",
    seoDescription:
      "Field-tested notes on using Sora for scenic design ideation, communication, and iteration, including practical limits and production-safe use cases.",
  },
  "lighting-styles-in-ai-models": {
    categoryName: "Tools & Technology",
    excerpt:
      "Explore how 20 different lighting styles transform AI-generated scenes in Sora and Midjourney, with practical prompt strategies for theatre designers and visual storytellers.",
    coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/lighting-styles-in-ai-models/cover-generated.png",
    coverImageAlt:
      "A blank canvas on an easel in a hazy artist's studio, lit by a warm spotlight and cool window light.",
    seoTitle: "Lighting Styles in AI Models: How Lighting Changes Everything",
    seoDescription:
      "Explore how 20 different lighting styles transform AI-generated scenes in Sora and Midjourney, with practical prompts for theatre designers and visual storytellers.",
    publishedAt: "2025-03-30T10:35:16.063Z",
    updatedAt: "2025-03-31T10:02:51.299Z",
    readTime: 10,
  },
  "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care": {
    categoryName: "Tools & Technology",
  },
  "how-to-create-trim-profiles-in-vectorworks-using-the-polyline-tool": {
    categoryName: "Tools & Technology",
  },
  "the-art-of-presenting-theatre-design-a-guide-for-designers": {
    categoryName: "Tools & Technology",
  },
  "empowering-theatre-students-with-computer-literacy": {
    categoryName: "Tools & Technology",
  },
  "scenic-design-process": {
    categoryName: "Design Process",
    series: {
      name: "Process and Practice",
      slug: "process-and-practice",
      order: 1,
    },
  },
  "youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision": {
    categoryName: "Design Process",
    coverImageAlt:
      "Scenic design student standing beside a review display with a model, drawings, and rendering boards.",
    excerpt:
      "A reflective essay on critique, revision, and the moment scenic design shifted from presentation toward real-time design thinking.",
    seoDescription:
      "A scenic design essay about critique, revision, URTAs, and learning to think like a designer under pressure.",
    series: {
      name: "Process and Practice",
      slug: "process-and-practice",
      order: 2,
    },
  },
  "framing-the-martyr-scenic-design-as-memory-work-in-romero": {
    categoryName: "Design Process",
    series: {
      name: "Process and Practice",
      slug: "process-and-practice",
      order: 3,
    },
    linkedScenicProjectSlugs: ["romero"],
  },
  "designing-the-keller-home-a-look-back-at-all-my-sons": {
    categoryName: "Design Process",
    series: {
      name: "Process and Practice",
      slug: "process-and-practice",
      order: 4,
    },
    linkedScenicProjectSlugs: ["all-my-sons"],
  },
  "urinetown-scenic-design-building-a-dystopia-that-feels-uncomfortably-familiar": {
    categoryName: "Design Process",
    publishedAt: "2024-11-03",
    series: {
      name: "Process and Practice",
      slug: "process-and-practice",
      order: 5,
    },
    linkedScenicProjectSlugs: ["urinetown"],
  },
  "what-makes-a-good-scenic-design-rendering": {
    categoryName: "Tools & Technology",
    publishedAt: "2026-03-13",
    coverImageAlt:
      "Designer seated at a drafting table under a warm spotlight inside a teal studio space.",
    series: {
      name: "Design Communication",
      slug: "design-communication",
      order: 2,
    },
  },
  "the-evolution-of-themed-entertainment-from-ancient-gardens-to-modern-immersive-experienceses-everything": {
    categoryName: "Themed Entertainment",
    series: {
      name: "Themed Experience",
      slug: "themed-experience",
      order: 1,
    },
  },
};

const contentOverridesBySlug: Record<string, LocalArticle["content"]> = {
  "lighting-styles-in-ai-models":
    lightingStylesArticleBlocks as LocalArticle["content"],
  "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care":
    computerHardwareArticleBlocks as LocalArticle["content"],
  "sora-in-the-studio-testing-ais-potential-for-theatrical-design":
    soraArticleBlocks as LocalArticle["content"],
  "the-evolution-of-themed-entertainment-from-ancient-gardens-to-modern-immersive-experienceses-everything":
    themedEntertainmentArticleBlocks as LocalArticle["content"],
  "urinetown-scenic-design-building-a-dystopia-that-feels-uncomfortably-familiar":
    urinetownArticleBlocks as LocalArticle["content"],
  "what-makes-a-good-scenic-design-rendering": [
    {
      type: "paragraph",
      text: "A strong scenic rendering is not judged only by beauty. It succeeds when directors, shops, and collaborators can read the image quickly and make better decisions because the visual hierarchy is clear.",
    },
    {
      type: "paragraph",
      text: "Before we get into lighting styles or textures, let’s talk about the software that supports this work: Vectorworks.",
    },
    {
      type: "heading",
      level: 2,
      text: "Vectorworks: A Tool for Storytelling and Precision",
    },
    {
      type: "paragraph",
      text: "Vectorworks serves a dual purpose: it's a drafting/documentation tool and a 3D rendering engine. Its strength lies in accuracy—you can build from the plan up with real-world scale and dimensional clarity. That precision makes it ideal for scenic design, where collaboration with technical directors and production teams is constant.",
    },
    {
      type: "paragraph",
      text: "Unlike mesh-heavy software, Vectorworks models stay clean, geometric, and readable, especially for beginners. While it isn’t optimized for organic modeling, it creates a solid foundation for scenic work that needs to communicate both art and feasibility.",
    },
    {
      type: "paragraph",
      text: "I use Vectorworks because it keeps the technical side as strong as the artistic side—and that balance matters.",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/ikugmbpwghzuoial-compressed-db4d6373.webp",
      alt: "Vectorworks rendering in progress, showing layered viewports and material textures in a scenic design project.",
      caption: "Vectorworks rendering in progress. Drafting and visualization happen in the same space.",
    },
    {
      type: "heading",
      level: 2,
      text: "Lessons from Fine Art: Rendering as Visual Storytelling",
    },
    {
      type: "paragraph",
      text: "To teach what makes a rendering successful, I often turn not to software—but to painting. In a recent lecture, I led students through examples by Caravaggio, De La Tour, Rembrandt, and Hopper. These artists didn’t just paint spaces. They crafted moments.",
    },
    {
      type: "paragraph",
      text: "Their tools were oil and canvas. Ours are digital. But the goals are identical: guide the eye, evoke emotion, and give clarity.",
    },
    {
      type: "heading",
      level: 3,
      text: "Georges de La Tour – The Penitent Magdalene",
    },
    {
      type: "paragraph",
      text: "Georges de La Tour was a seventeenth-century French Baroque painter known for quiet interiors lit by a single candle or lamp. Unlike painters who built drama through movement, La Tour often built it through stillness. The result is contemplative rather than loud.",
    },
    {
      type: "paragraph",
      text: "That matters for scenic rendering because many designers assume impact has to come from complexity. La Tour shows the opposite. A restrained image can feel emotionally rich if the light source is specific and the atmosphere is controlled.",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/beiquvbjtryzwfml-compressed-e4cf948e.webp",
      alt: "Georges de La Tour’s The Penitent Magdalene, lit by a single candle source in a dark room.",
      caption: "Georges de La Tour, The Penitent Magdalene. A single controlled light source creates both atmosphere and clarity.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "Focus: Atmospheric Lighting",
        "Takeaway: A single light source creates emotional tone and spatial clarity.",
        "Rendering Insight: Less is often more. Lighting should support story, not just visibility."
      ],
    },
    {
      type: "heading",
      level: 3,
      text: "Caravaggio – The Calling of Saint Matthew",
    },
    {
      type: "paragraph",
      text: "Caravaggio worked in Rome at the turn of the seventeenth century, and his paintings are often taught through the lens of chiaroscuro: the use of intense contrast between light and dark. But what makes his work useful for scenic designers is not just contrast. It is staging.",
    },
    {
      type: "paragraph",
      text: "His figures feel arranged with purpose, as if the painting already understands blocking, cueing, and audience focus. In a rendering, that kind of compositional decisiveness helps an image communicate before anyone reads the design notes.",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/cwacyunzazoypajr-compressed-a24696a0.webp",
      alt: "Caravaggio’s The Calling of Saint Matthew, using dramatic directional light and diagonal composition.",
      caption: "Caravaggio, The Calling of Saint Matthew. Light direction and composition tell the story before a viewer reads the scene.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "Focus: Focal Point & Composition",
        "Takeaway: Diagonals, light direction, and body placement tell the whole story.",
        "Rendering Insight: Stage your scene. Guide the eye intentionally."
      ],
    },
    {
      type: "heading",
      level: 3,
      text: "Rembrandt – The Night Watch",
    },
    {
      type: "paragraph",
      text: "Rembrandt’s The Night Watch is often discussed as a group portrait, but it behaves more like a lesson in hierarchy. Not every figure is given the same emphasis. Light, gesture, and placement determine who matters first and who supports the composition from the edges.",
    },
    {
      type: "paragraph",
      text: "That principle is essential in rendering. Scenic images often fail when they try to describe everything evenly. Rembrandt reminds us that clarity comes from choosing what deserves attention and allowing the rest of the world to recede.",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/euxnbpvehxyliqcy-compressed-d2fa63b8.webp",
      alt: "Rembrandt’s The Night Watch, demonstrating layered depth and selective emphasis through light.",
      caption: "Rembrandt, The Night Watch. Hierarchy comes from where the light concentrates and where it recedes.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "Focus: Visual Hierarchy",
        "Takeaway: Use light to highlight important figures, and shadow to let others recede.",
        "Rendering Insight: Complex spaces still need clarity. Prioritize depth."
      ],
    },
    {
      type: "heading",
      level: 3,
      text: "Edward Hopper – Nighthawks",
    },
    {
      type: "paragraph",
      text: "Edward Hopper is a twentieth-century American painter whose work is often associated with urban loneliness, distance, and psychological atmosphere. In Nighthawks, the architecture does as much emotional work as the figures. Glass, light, and empty street space frame the human isolation inside the diner.",
    },
    {
      type: "paragraph",
      text: "For scenic rendering, Hopper is a useful reminder that mood does not have to come from spectacle. It can come from spacing, framing, and what is withheld. Sometimes the most powerful part of an image is the world implied just outside it.",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/hxxvtrihykhsdkaa-compressed-79554678.webp",
      alt: "Edward Hopper’s Nighthawks, showing isolated figures in a diner framed by architecture and negative space.",
      caption: "Edward Hopper, Nighthawks. Mood is carried by silence, spacing, and the world implied just beyond the frame.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "Focus: Architectural Framing & Mood",
        "Takeaway: Emotion comes from silence, spacing, and negative space.",
        "Rendering Insight: What’s outside the rendering matters too. Suggest a world beyond the walls."
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "The Core Elements of a Good Scenic Rendering",
    },
    {
      type: "heading",
      level: 3,
      text: "1. Story Comes First",
    },
    {
      type: "paragraph",
      text: "A rendering without story is just a diagram. Before it sells a space, it should feel like a moment. Whether it's tension, warmth, anticipation, or emptiness, your rendering should communicate something even if the viewer doesn’t know the play, script, or event yet.",
    },
    {
      type: "paragraph",
      text: "If your image doesn’t evoke an emotional cue, then no amount of detail will matter.",
    },
    {
      type: "heading",
      level: 3,
      text: "2. Human Figures",
    },
    {
      type: "paragraph",
      text: "People seek connection with people.",
    },
    {
      type: "paragraph",
      text: "We are hardwired to seek out other people. That’s why we look at faces in crowds, pause at silhouettes, or follow the gesture of a figure in an image.",
    },
    {
      type: "paragraph",
      text: "In scenic rendering, figures aren’t just placeholders—they’re emotional touchstones. They let the viewer place themselves in the world. They scale the space, yes—but more importantly, they activate it. A single figure looking out a window can do more storytelling than any object on a shelf.",
    },
    {
      type: "paragraph",
      text: "This is what makes a space feel inhabited, even in stillness.",
    },
    {
      type: "heading",
      level: 3,
      text: "3. Composition Directs the Eye",
    },
    {
      type: "paragraph",
      text: "Just like a director blocks a scene, the designer blocks a frame. Where the eye lands, where it travels next—those are choices.",
    },
    {
      type: "paragraph",
      text: "A strong composition tells the viewer how to look at the world you're creating. It's rhythm, framing, and spatial relationships. Composition isn’t a background element. It’s an invisible script, guiding attention, revealing story, and holding emotion in place.",
    },
    {
      type: "heading",
      level: 3,
      text: "4. Lighting is the Invisible Narrator",
    },
    {
      type: "paragraph",
      text: "Light is the design element we feel before we process. It tells us time of day, source, temperature—and more importantly, it tells us how to feel about what we’re seeing.",
    },
    {
      type: "paragraph",
      text: "Lighting creates depth, defines form, and focuses attention. A shaft of light can suggest revelation. A shadow can imply danger.",
    },
    {
      type: "paragraph",
      text: "Think of lighting as scenic storytelling in motion, frozen in time.",
    },
    {
      type: "heading",
      level: 3,
      text: "5. Color Communicates Instantly",
    },
    {
      type: "paragraph",
      text: "Before we read space, we read tone. Warm tones imply safety, nostalgia, or intimacy. Cool tones may suggest isolation, control, or modernity. Highly saturated colors feel heightened, theatrical. Muted colors can suggest realism or restraint.",
    },
    {
      type: "paragraph",
      text: "Your palette does more than decorate—it sets expectations. It’s emotional shorthand. Use it to reinforce genre, story, and atmosphere, not just aesthetics.",
    },
    {
      type: "heading",
      level: 3,
      text: "6. Focal Points = Visual Priorities",
    },
    {
      type: "paragraph",
      text: "The eye needs a place to land. And once it lands, it needs a reason to stay.",
    },
    {
      type: "paragraph",
      text: "In a scenic rendering, focal points aren’t just about clarity—they’re about intention. Whether it’s a figure under a pool of light, a glowing portal, or a single object in an empty room, your focal point should be where the story concentrates.",
    },
    {
      type: "paragraph",
      text: "Every scenic image should have visual hierarchy. If everything is emphasized, nothing is understood.",
    },
    {
      type: "heading",
      level: 3,
      text: "7. Atmosphere Breathes Life",
    },
    {
      type: "paragraph",
      text: "Atmosphere is what separates a digital model from a lived-in world. It's not just fog or glow—it's space between things. It's the distance between figure and wall, the bounce of light off a surface, the hint of air in the room.",
    },
    {
      type: "paragraph",
      text: "Atmosphere tells us the world has depth, weight, and movement, even if no one is speaking or walking through it. It gives the image breath.",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/kritdqpcckglmgqc-compressed-c76d5db0.webp",
      alt: "Rendering for Tomás and the Library Lady with layered shelves, warm light, and spatial depth.",
      caption: "Tomás and the Library Lady. Layered depth, warm directional light, and atmosphere combine into a complete scenic image.",
    },
    {
      type: "paragraph",
      text: "Taken together, these principles are not a checklist so much as a way of seeing. A successful scenic rendering does not simply document a set. It organizes attention, creates emotional temperature, and helps other people understand the world of the production before it is built.",
    },
    {
      type: "paragraph",
      text: "That is why I return to the rendering for Tomás and the Library Lady. It is not successful because it is detailed for its own sake. It works because story, light, composition, hierarchy, color, and atmosphere all support one another in a single image. The rendering invites the viewer into the world and tells them how to feel once they arrive.",
    },
    {
      type: "heading",
      level: 2,
      text: "FAQ: Scenic Rendering & Vectorworks",
    },
    {
      type: "faq",
      items: [
        {
          question: "What software is best for scenic rendering?",
          answer: "The best software depends on your goals and your workflow. Vectorworks is a strong option for scenic design because it supports both drafting/documentation and rendering in the same environment, and it stays precise and readable for collaboration with production teams."
        },
        {
          question: "What’s the most important part of a rendering?",
          answer: "Story. A rendering should communicate a moment—tone, emotion, and intention—before it communicates detail. If the image doesn’t evoke an emotional cue, no amount of polish will matter."
        },
        {
          question: "Do you always add people to your renderings?",
          answer: "Not always, but I often do when the rendering benefits from scale and emotional activation. Figures help viewers place themselves in the world and can communicate story through gesture, placement, and focus."
        },
        {
          question: "Can Vectorworks produce realistic renderings?",
          answer: "Yes—especially when you leverage strong composition, lighting choices, material control, and atmosphere. Vectorworks also provides a clean geometric foundation that supports clarity and feasibility, which is central to scenic work."
        },
        {
          question: "Is it okay to leave things implied?",
          answer: "Yes. A good rendering isn’t trying to show everything—it’s trying to communicate what matters most. Suggestion and restraint can strengthen mood and focus, especially when the goal is storytelling rather than inventory."
        }
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "Final Thoughts",
    },
    {
      type: "paragraph",
      text: "Scenic rendering is about more than polish—it’s about precision, composition, and emotional weight. A good rendering isn’t trying to show everything. It’s trying to communicate what matters most.",
    },
    {
      type: "paragraph",
      text: "If you’d like to see how these ideas translate into practice, visit the Rendering & Visualization page to explore examples from past projects.",
    },
    {
      type: "paragraph",
      text: "In the next post, I’ll break down how camera angles and field of view inside Vectorworks can shift the storytelling of your renderings—without adding complexity.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/story-first-3a6d4484.webp",
          alt: "Infographic illustrating story-first priorities in scenic rendering.",
          caption: "Story comes first.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/human-figure-cbbc32f2.webp",
          alt: "Infographic showing how human figures establish scale and emotional connection in scenic rendering.",
          caption: "Human figures.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/composition-directs-the-eye_-07469e04.webp",
          alt: "Infographic about composition and visual direction in scenic rendering.",
          caption: "Composition directs the eye.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/lighting-is-the-invisible-narrator_-653d28bf.webp",
          alt: "Infographic showing how lighting creates focus, tone, and dramatic meaning in scenic rendering.",
          caption: "Lighting is the invisible narrator.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/color-communicates-instantly-7721ee21.webp",
          alt: "Infographic about using color to establish emotional register and genre in scenic rendering.",
          caption: "Color communicates instantly.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/focal-points-visual-priorities-353a2475.webp",
          alt: "Infographic explaining focal points and visual priorities in scenic rendering.",
          caption: "Focal points and visual priorities.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/what-makes-a-good-scenic-design-rendering/body/atmosphere-breathes-life-5c8933c1.webp",
          alt: "Infographic about atmosphere, depth, and environmental mood in scenic rendering.",
          caption: "Atmosphere breathes life.",
        },
      ],
    },
  ],
  "youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision": [
    {
      type: "paragraph",
      text: "Some critique moments stay with you because they force a choice: defend instinct or improve process. This story is about learning to revise with intention while building the professional stamina scenic design demands.",
    },
    {
      type: "paragraph",
      text: "To save money on checked luggage, I decided I would buy my foam core once I arrived. There was a Blick down the street from the hotel. Everything felt organized. At that point, I already had a fair amount of experience. I felt confident. My love for Chicago was certain. And I was planning on attending Northwestern.",
    },
    {
      type: "paragraph",
      text: "The beginning of the day felt like a dream. There was praise. Conversations were easy. People were engaging with my work.",
    },
    {
      type: "paragraph",
      text: "It felt like everything was lining up.",
    },
    {
      type: "paragraph",
      text: "We were at URTAs. I was standing beside my boards, portfolio open, trying to keep up with the pace of the day. I remember one designer I deeply admired pausing in front of my setup. He glanced at my presentation boards and said:",
    },
    {
      type: "quote",
      text: "Oh, they’re black. How original.",
    },
    {
      type: "paragraph",
      text: "It was quick, dry, and dismissive. I wasn’t sure how to respond.",
    },
    {
      type: "paragraph",
      text: "Then he flipped to a ground plan from a show I had designed five years earlier and asked:",
    },
    {
      type: "quote",
      text: "How would you change this?",
    },
    {
      type: "paragraph",
      text: "It was a living room scene. And I knew exactly what he meant. The layout was stiff. The staging felt flat. The environment read more like a set than a place someone might actually live.",
    },
    {
      type: "paragraph",
      text: "But in that moment, I froze.",
    },
    {
      type: "paragraph",
      text: "Not because I had never thought critically about the design — but because I had not yet developed the instinct to revise my own work aloud, under pressure.",
    },
    {
      type: "paragraph",
      text: "Before I could find the words, he cut in:",
    },
    {
      type: "quote",
      text: "You’re wasting my time.",
    },
    {
      type: "paragraph",
      text: "And then he walked away.",
    },
    {
      type: "heading",
      level: 2,
      text: "What That Moment Revealed",
    },
    {
      type: "paragraph",
      text: "It was quiet after that. I stood there with my boards, stunned. In that instant, I knew I wasn’t going to be attending that program.",
    },
    {
      type: "paragraph",
      text: "I wasn’t angry. I was embarrassed. Northwestern had been my top choice. He was someone I respected. And I had completely blanked.",
    },
    {
      type: "paragraph",
      text: "The hardest part wasn’t the comment itself. It was realizing how unprepared I felt for the kind of conversation that moment required.",
    },
    {
      type: "paragraph",
      text: "Looking back now, I understand that the interaction was not really about that one drawing. It was not even about finding the “correct” answer. It was about demonstrating the ability to think like a designer in real time — to respond, to question, to revise. And at that point in my development, I didn’t yet have that skill.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Instinct to Re-Enter",
    },
    {
      type: "paragraph",
      text: "That question — How would you change this? — was not a trap. It was an invitation to re-engage with my own work. I simply did not yet have the tools to do so.",
    },
    {
      type: "paragraph",
      text: "Freezing did not mean I lacked potential. It meant I was still developing a fundamental part of design practice: the instinct to re-enter a design and see it as something living and flexible.",
    },
    {
      type: "paragraph",
      text: "At the time, I believed my responsibility was to present a polished version of what I had already created. I had not yet realized that scenic design is never truly finished.",
    },
    {
      type: "paragraph",
      text: "What matters most is not having the “right” answer. It is staying in the conversation. It is showing that you can keep thinking.",
    },
    {
      type: "heading",
      level: 2,
      text: "What I Carry Forward in Scenic Design",
    },
    {
      type: "paragraph",
      text: "Since then, I have come to understand that the work of a designer is constantly evolving. Whether in rehearsal, in technical rehearsals, or in an interview, the ability to revisit your ideas — to challenge them, reshape them, and respond to feedback — is essential.",
    },
    {
      type: "paragraph",
      text: "I think about that moment often. Not with resentment, but as a marker of growth. That silence, that freeze, and that quick walk away clarified what the profession actually demands.",
    },
    {
      type: "paragraph",
      text: "There is a quote I return to again and again:",
    },
    {
      type: "quote",
      text: "Art is never finished, only abandoned.",
      author: "Leonardo da Vinci",
    },
    {
      type: "paragraph",
      text: "That set was never finished. Neither was I.",
    },
    {
      type: "paragraph",
      text: "And that moment was not a waste of time.",
    },
    {
      type: "paragraph",
      text: "It was the beginning of learning how to think like a designer.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision/body/brandon-urtas-chicago-2017--1-84401178.webp",
          alt: "Brandon PT Davis at URTAs Chicago 2017.",
          caption: "URTAs, Chicago, 2017.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision/body/brandon-urtas-chicago-2017--2-9a8ef6f1.webp",
          alt: "Portfolio review moment at URTAs Chicago 2017.",
          caption: "Portfolio review, URTAs Chicago, 2017.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision/body/brandon-urtas-chicago-2017--4-351716e8.webp",
          alt: "Photo of Chicago's Water Tower district with the historic Water Tower and the John Hancock building.",
          caption: "Chicago Water Tower district, with the Water Tower and John Hancock building.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision/body/brandon-urtas-chicago-2017--3-66ac8b67.webp",
          alt: "Hotel room selfie from the Chicago URTAs trip in 2017.",
          caption: "Hotel room selfie, Chicago, 2017.",
        },
      ],
    },
  ],
};

const fileFirstFieldMap =
  fileFirstArticleFieldsBySlug as unknown as Record<string, Partial<LocalArticle>>;
const fileFirstContentMap =
  fileFirstArticleContentBySlug as unknown as Record<string, LocalArticle["content"]>;

const mergeArticleSources = (article: LocalArticle): LocalArticle => {
  const runtimeFieldOverrides = articleFieldOverridesBySlug[article.slug] ?? {};
  const fileFirstFields = fileFirstFieldMap[article.slug] ?? {};
  const categoryName = normalizeArticleCategory(
    fileFirstFields.categoryName ?? runtimeFieldOverrides.categoryName ?? article.categoryName
  );
  const content =
    fileFirstContentMap[article.slug] ?? contentOverridesBySlug[article.slug] ?? article.content;

  return {
    ...article,
    ...runtimeFieldOverrides,
    ...fileFirstFields,
    categoryName,
    content,
    audio: audioBySlug[article.slug] ?? article.audio,
  };
};

const visualLanguageArticle: LocalArticle = {
  id: 100004,
  slug: "the-visual-language-of-scenic-design",
  title: "The Visual Language of Scenic Design",
  excerpt:
    "How the elements and principles of design shape live performance before an audience understands the story intellectually.",
  coverImageUrl:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/visual-language/cover.png",
  coverImageAlt:
    "Abstract scenic environment with layered architectural forms, a glowing focal portal, and a solitary figure establishing scale.",
  publishedAt: "2026-03-05",
  updatedAt: "2026-03-20",
  createdAt: "2026-03-20",
  categoryName: "Scenic Design",
  seoTitle: "The Visual Language of Scenic Design | Elements and Principles in Performance",
  seoDescription:
    "An essay on how the elements and principles of design shape scenic environments, audience perception, and live theatrical storytelling.",
  seoKeywords:
    "scenic design principles, elements of design, principles of design, scenic design education, theatrical design, live performance design",
  series: {
    name: "Design Communication",
    slug: "design-communication",
    order: 1,
  },
  tags: [
    { id: 100401, name: "Scenic Design", slug: "scenic-design" },
    { id: 100402, name: "Design Education", slug: "design-education" },
    { id: 100403, name: "Design Principles", slug: "design-principles" },
    { id: 100404, name: "Visual Storytelling", slug: "visual-storytelling" },
  ],
  featured: false,
  content: [
    {
      type: "paragraph",
      text:
        "Live theatre is experienced visually before it is understood intellectually.",
    },
    {
      type: "paragraph",
      text:
        "An audience does not wait for dialogue to begin forming impressions. They register spatial balance, light intensity, color relationships, and architectural scale almost immediately. Scenic design operates within this instinctive perception. It shapes emotional tone, supports storytelling, and guides attention long before narrative context is fully processed.",
    },
    {
      type: "paragraph",
      text:
        "Because of this, scenic designers are not simply arranging objects onstage. They are constructing environments that influence movement, define relationships, and create emotional conditions for performance.",
    },
    {
      type: "paragraph",
      text:
        "At some point in the design process, I often remind students of something essential:",
    },
    {
      type: "quote",
      text:
        "My job isn’t to create a rendering. My job is to create a live experience. Renderings help sell it, but the real goal is the audience’s feelings.",
    },
    {
      type: "paragraph",
      text:
        "To shape meaningful theatrical environments, designers rely on the foundational elements and principles of design. These ideas are not academic abstractions. They are practical tools that help directors stage action, help performers navigate space, and help audiences understand the world of the play.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Elements of Design in Scenic Practice",
    },
    {
      type: "heading",
      level: 3,
      text: "Point — Establishing Focus",
    },
    {
      type: "paragraph",
      text:
        "A point is the simplest visual element, yet it can carry enormous dramatic weight. A single illuminated doorway in a dark environment creates anticipation. A solitary chair placed downstage can suggest emotional isolation before a performer even enters.",
    },
    {
      type: "paragraph",
      text:
        "Designers use points to anchor visual attention. In large scenic compositions, small concentrated moments often become the audience’s first emotional connection to the space.",
    },
    {
      type: "heading",
      level: 3,
      text: "Line — Directing Movement and Energy",
    },
    {
      type: "paragraph",
      text:
        "Lines exist everywhere in theatre: in staircases, platform edges, portals, railings, and lighting angles. They guide how the audience’s eye travels through the performance.",
    },
    {
      type: "paragraph",
      text:
        "Diagonal lines often introduce urgency or instability. Horizontal lines can create calm or inevitability. Vertical elements may suggest confinement, ritual, or authority. Designers also consider how performers move in relation to these visual pathways. Movement aligned with scenic lines can feel harmonious, while movement against them can create tension.",
    },
    {
      type: "paragraph",
      text:
        "Line shapes dramatic momentum as much as visual composition.",
    },
    {
      type: "heading",
      level: 3,
      text: "Shape — Organizing the Stage Picture",
    },
    {
      type: "paragraph",
      text:
        "Shape refers to how scenic elements relate graphically across the stage. Clear geometric compositions can make environments feel intentional and legible. Fragmented or irregular shapes may suggest emotional disruption or social instability.",
    },
    {
      type: "paragraph",
      text:
        "Directors often respond strongly to shape because it influences blocking patterns. A triangular playing area encourages different staging choices than a symmetrical rectangular one.",
    },
    {
      type: "heading",
      level: 3,
      text: "Form and Mass — Creating Physical Presence",
    },
    {
      type: "paragraph",
      text:
        "Form gives scenic environments dimensional weight. Large architectural masses can establish power relationships. Elevated platforms create hierarchy. Compressed spaces may intensify intimacy or conflict.",
    },
    {
      type: "paragraph",
      text:
        "Audiences instinctively read form. They sense scale, distance, and physical risk even before performers interact with the environment.",
    },
    {
      type: "heading",
      level: 3,
      text: "Color — Establishing Emotional Temperature",
    },
    {
      type: "paragraph",
      text:
        "Color communicates mood immediately. Warm palettes may suggest memory, comfort, or celebration. Cooler tones can introduce emotional distance, melancholy, or psychological tension.",
    },
    {
      type: "paragraph",
      text:
        "Onstage, color interacts continuously with lighting and costume. Designers use color not simply for decoration, but as emotional framing that supports genre, period, and tone.",
    },
    {
      type: "heading",
      level: 3,
      text: "Value — Guiding Attention Through Contrast",
    },
    {
      type: "paragraph",
      text:
        "Value describes the relationship between light and dark. Strong contrast can isolate performers and create clear visual hierarchy. Low contrast environments may support realism or ambiguity.",
    },
    {
      type: "paragraph",
      text:
        "Value also defines spatial depth. Bright foreground areas feel immediate and intimate. Darkened backgrounds can feel distant or unknowable. These relationships help structure audience focus throughout a performance.",
    },
    {
      type: "heading",
      level: 3,
      text: "Texture — Suggesting Material History",
    },
    {
      type: "paragraph",
      text:
        "Texture communicates how a world has been lived in. Rough surfaces can imply age, labor, or decay. Smooth finishes may suggest modernity, wealth, or institutional control.",
    },
    {
      type: "paragraph",
      text:
        "Lighting reveals texture in subtle ways, enriching scenic environments without adding visual clutter. Even minimal sets gain narrative depth when material surfaces feel authentic.",
    },
    {
      type: "heading",
      level: 3,
      text: "Space — Constructing Depth and Relationship",
    },
    {
      type: "paragraph",
      text:
        "Designers manipulate spatial relationships to influence emotional experience. Layered scenic environments allow simultaneous action across visual planes. Elevation changes reinforce social hierarchy. Narrow spaces intensify confrontation. Open environments can suggest freedom or isolation.",
    },
    {
      type: "paragraph",
      text:
        "Space in theatre is both physical and psychological.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Principles of Design in Live Scenic Storytelling",
    },
    {
      type: "heading",
      level: 3,
      text: "Balance — Stability and Instability",
    },
    {
      type: "paragraph",
      text:
        "Balance refers to how visual weight is distributed across the stage picture. Symmetrical environments often feel formal, ritualistic, or inevitable. Asymmetrical compositions can introduce unease or anticipation.",
    },
    {
      type: "paragraph",
      text:
        "Designers use balance to shape emotional tone before narrative conflict becomes explicit.",
    },
    {
      type: "heading",
      level: 3,
      text: "Emphasis — Directing Audience Focus",
    },
    {
      type: "paragraph",
      text:
        "Every stage moment requires a focal point. Light concentration, scale contrast, or spatial isolation can establish emphasis. When everything competes equally for attention, audiences may struggle to understand what matters.",
    },
    {
      type: "paragraph",
      text:
        "Clear emphasis supports both staging clarity and emotional engagement.",
    },
    {
      type: "heading",
      level: 3,
      text: "Contrast — Defining Difference and Dramatic Tension",
    },
    {
      type: "paragraph",
      text:
        "Contrast occurs through differences in value, color, scale, texture, or spatial density. A bright performer against a dark environment becomes instantly significant. A delicate interior placed inside a vast architectural frame can heighten vulnerability.",
    },
    {
      type: "paragraph",
      text:
        "Designers use contrast to clarify relationships and intensify dramatic stakes.",
    },
    {
      type: "heading",
      level: 3,
      text: "Rhythm — Creating Visual Pacing",
    },
    {
      type: "paragraph",
      text:
        "Rhythm emerges through repetition and variation. Repeating scenic forms can guide the eye across the stage. Alternating light and shadow patterns can support emotional transitions.",
    },
    {
      type: "paragraph",
      text:
        "Just as dialogue and music create temporal rhythm, scenic design can create visual pacing that shapes how audiences experience time within a performance.",
    },
    {
      type: "heading",
      level: 3,
      text: "Movement — Dynamic Spatial Experience",
    },
    {
      type: "paragraph",
      text:
        "Movement in scenic design is not limited to moving scenery. It exists in how visual energy travels across the stage picture.",
    },
    {
      type: "paragraph",
      text:
        "Angled compositions, layered sightlines, and directional lighting can suggest motion even in still moments. Designers consider how the eye moves before actors do.",
    },
    {
      type: "heading",
      level: 3,
      text: "Proportion and Scale — Human Relationship to Environment",
    },
    {
      type: "paragraph",
      text:
        "The relationship between performer and architecture communicates meaning immediately. Oversized environments can create vulnerability or awe. Compressed spaces can intensify psychological pressure.",
    },
    {
      type: "paragraph",
      text:
        "Proportion helps audiences understand power dynamics before they are spoken.",
    },
    {
      type: "heading",
      level: 3,
      text: "Unity — Creating a Cohesive World",
    },
    {
      type: "paragraph",
      text:
        "Unity occurs when scenic elements, lighting, color palette, and spatial logic function together. Even highly stylized productions require internal consistency for audiences to trust the environment.",
    },
    {
      type: "paragraph",
      text:
        "When unity is achieved, the design becomes expressive rather than decorative.",
    },
    {
      type: "heading",
      level: 3,
      text: "Variety — Sustaining Visual Interest",
    },
    {
      type: "paragraph",
      text:
        "Variety prevents monotony. Differences in texture, scale, lighting intensity, or spatial arrangement can keep environments visually engaging while still maintaining unity.",
    },
    {
      type: "paragraph",
      text:
        "Designers balance consistency with variation to support long-form storytelling.",
    },
    {
      type: "heading",
      level: 2,
      text: "From Live Experience to Visual Communication",
    },
    {
      type: "paragraph",
      text:
        "Live theatre is collaborative and temporary. Scenic environments must be imagined, discussed, and refined long before they are physically built. The same visual language that shapes stage pictures must also guide how designers communicate ideas through drawings, models, and renderings.",
    },
    {
      type: "paragraph",
      text:
        "Understanding the elements and principles of design allows scenic designers to construct images that convey atmosphere, hierarchy, and emotional tone with clarity. In the next article, we will explore how this live visual language translates into scenic rendering practice and how digital tools can support storytelling while keeping the live experience at the center of the work.",
    },
  ],
};

const ghibliImmersiveDiningArticle: LocalArticle = {
  id: 100005,
  slug: "studio-ghibli-inspired-immersive-dining-experience",
  title: "Studio Ghibli-Inspired Immersive Dining Experience",
  excerpt:
    "A themed entertainment studio project exploring how theatre design students translated environmental storytelling into a Studio Ghibli-inspired immersive dining concept.",
  coverImageUrl:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/local-articles/9e1774_73b851ea12d14fce8575a0e36e3cf92f-e82d34cd.jpeg",
  coverImageAlt:
    "Studio Ghibli-inspired immersive dining design project developed by theatre students.",
  publishedAt: "2025-04-14",
  updatedAt: "2026-03-20",
  createdAt: "2025-04-14",
  categoryName: "Themed Entertainment",
  seoTitle:
    "Studio Ghibli-Inspired Immersive Dining Experience | Themed Entertainment Design",
  seoDescription:
    "Discover how theatre design students developed a Studio Ghibli-inspired immersive dining concept, using scenic storytelling tools in a themed entertainment studio project.",
  seoKeywords:
    "themed entertainment design, immersive dining, studio ghibli inspired design, theatre design education, environmental storytelling, themed experience design",
  series: {
    name: "Themed Experience",
    slug: "themed-experience",
    order: 2,
  },
  tags: [
    { id: 100411, name: "Themed Entertainment", slug: "themed-entertainment" },
    { id: 100412, name: "Design Education", slug: "design-education" },
    { id: 100413, name: "Immersive Design", slug: "immersive-design" },
    { id: 100414, name: "Environmental Storytelling", slug: "environmental-storytelling" },
  ],
  featured: false,
  readTime: 9,
  content: [
    {
      type: "heading",
      level: 2,
      text: "Course Foundation: Theatrical Design Meets Themed Entertainment",
    },
    {
      type: "paragraph",
      text:
        "I created Entertainment and Collaboration during my first year as a full-time professor at Stephens College, and it remains one of the highlights of my teaching career. The course emerged during the College’s transition to a Conservatory model, and I saw an opportunity to address a meaningful gap in traditional theatrical design education. With a background in both academia and professional design, I wanted to give students an honest window into the broader design industries—spaces where theatre artists could thrive, but were rarely taught to see themselves.",
    },
    {
      type: "paragraph",
      text:
        "The course was built to bridge the rich storytelling of theatrical design with the demands and opportunities of commercial entertainment. I wanted students to apply their skills to areas like theme parks, immersive dining, film and television, and brand-based experience design. I knew that many students had never considered these paths as valid or accessible, and I wanted to change that.",
    },
    {
      type: "paragraph",
      text:
        "The class alternates annually between a focus on Themed Entertainment and Film & Television Design, giving students a well-rounded set of tools and exposure to multiple formats. It's specifically designed for second- and third-year production students and encourages repeat enrollment: first in a support role, then in a leadership role. This cycle simulates the kind of progression they’ll experience in a creative career.",
    },
    {
      type: "paragraph",
      text:
        "Depending on the year, students explore how scenic design, costume, branding, and visual storytelling apply within either a themed entertainment or a film/TV context. Themed entertainment years focus on environmental storytelling, branding, spatial design, and immersive narrative environments. In film/TV years, students concentrate on cinematic design principles, script-based analysis, and production workflows specific to media and screen-based storytelling processes.",
    },
    {
      type: "paragraph",
      text:
        "More than anything, I built this class to empower students. To show them that the work they do in a theatre classroom has value far beyond the black box. That with the right mindset, collaboration, and a few new tools, they can shape the future of storytelling environments—not just react to them.",
    },
    {
      type: "heading",
      level: 2,
      text: "Structured Learning Path: From Theory to Practice",
    },
    {
      type: "paragraph",
      text:
        "The structure of Entertainment and Collaboration adapts each year depending on whether the course focuses on themed entertainment or film/TV. What follows reflects the structure used during the themed entertainment iteration—the one that produced the Ghibli restaurant project highlighted in this post.",
    },
    {
      type: "paragraph",
      text: "The course is divided into four interconnected phases:",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Contextual Grounding: Students begin with lectures on the history and theory of experiential design.",
        "Industry Perspective: Guest speakers from theatre, film, and themed entertainment join via Zoom to offer professional insight and portfolio critique.",
        "Independent Project: A short individual assignment bridges lecture content and collaborative practice.",
        "Collaborative Studio Simulation: The class operates as a design studio team tasked with a professional-scale final pitch project.",
      ],
    },
    {
      type: "paragraph",
      text:
        "Historical and conceptual topics included ancient Roman and Baroque garden design, medieval fairs and pageant wagons, World’s Fairs and early amusement parks, Disneyland, and the emergence of narrative environments. These discussions introduced environmental storytelling, audience interaction, multisensory design, and the cultural roles of themed space.",
    },
    {
      type: "paragraph",
      text:
        "In the final phase, students self-organized into specialized leadership roles including art director, project manager, interior designer, uniform designer, menu developer, and presentation lead. Together, the group set internal milestones, delegated work, and delivered a fully imagined final presentation modeled after an industry pitch.",
    },
    {
      type: "heading",
      level: 2,
      text: "Featured Project: Studio Ghibli Immersive Restaurant",
    },
    {
      type: "heading",
      level: 3,
      text: "Concept Development Process",
    },
    {
      type: "paragraph",
      text:
        "This showcase project simulated real-world entertainment design challenges within a condensed five-week timeline. The all-costume design major student team approached the assignment with minimal previous spatial modeling experience, highlighting the course's focus on adaptability and cross-disciplinary application.",
    },
    {
      type: "paragraph",
      text: "Project parameters established deliverable requirements without dictating creative direction:",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Brand identity system",
        "Comprehensive menu design",
        "3D scenic modeling and layout",
        "Staff uniform designs",
        "Video walkthrough presentation",
      ],
    },
    {
      type: "paragraph",
      text:
        "Students independently generated all spatial and narrative decisions by starting with an empty SketchUp file representing a blank restaurant shell. After concept exploration, they selected Studio Ghibli films as their thematic foundation.",
    },
    {
      type: "paragraph",
      text:
        "Market research led to the selection of Atlanta, Georgia, as the ideal location, citing a strong local anime fan community, a vibrant food culture scene, demographic alignment with the target audience, and growth potential in the themed entertainment market.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_86ddee990fb443c2908e868498a96aca-3777e957.jpeg",
          alt: "Ghibli's Delight logo design for the themed entertainment concept.",
          caption: "Ghibli's Delight Logo Design Themed Entertainment.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_22f94b16c0a24deea95c15b9ef3cb0f8-1bcb3b1d.jpeg",
          alt: "Production team credits for the Stephens College student project.",
          caption: "Production Team Credits, Stephens College Students.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_1ad9c76522ee4767b6b6c30554d95252-b3eaa20d.jpeg",
          alt: "Location study identifying Atlanta, Georgia, for the themed project.",
          caption: "Location: Atlanta, GA for Themed Project.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_a668d0d7c5804e0ea645138ad7e92e4a-af3a8d50.jpeg",
          alt: "Research board featuring Studio Ghibli imagery for the themed dining project.",
          caption: "Ghibli Film Theme Research Images.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_ba4f8a2f0e1c42358544825959579ff4-cfb6bb8c.jpeg",
          alt: "Additional Studio Ghibli research references gathered by the student team.",
          caption: "Research Images from Studio Ghibli.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_8920e870105c482fb3afd92049dafb1d-b1664a8d.jpeg",
          alt: "Themed entertainment precedent imagery used during concept development.",
          caption: "Themed Entertainment Images.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_4a5d11ca16ff4831ae7b8d17bbadf035-73cfb98c.jpeg",
          alt: "Uniform research images supporting the themed restaurant concept.",
          caption: "Uniform Research for themed project.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_184e465cf6b54645bda7776237e51c7d-91204026.jpeg",
          alt: "Ghibli-inspired food research images gathered for menu development.",
          caption: "Ghibli Inspired Food Reserach Images.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_297818c5541842cc9f3c8677b441f35d-aedf7552.jpeg",
          alt: "Food research references used to build the themed menu.",
          caption: "Food Research Images.",
        },
      ],
    },
    {
      type: "heading",
      level: 3,
      text: "Spatial Design and Narrative Integration",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_178b77734f664399ad1781073a591459-1bbb9ee2.jpg",
      alt: "Theatre design students behind the Studio Ghibli-inspired immersive dining project, pictured left to right: Arch Crist, Fae Rieman-Royer, Shannon King, Alice Crist, and Makenzie Schutter.",
      caption:
        "Theatre design students behind the project, pictured left to right: Arch Crist, Fae Rieman-Royer, Shannon King, Alice Crist, and Makenzie Schutter.",
    },
    {
      type: "paragraph",
      text:
        "The team transformed the blank model into a fully realized themed restaurant with a main dining area inspired by My Neighbor Totoro, five side rooms tied to individual Ghibli films, and a themed retail space extending the guest experience.",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Main dining area inspired by My Neighbor Totoro, with natural textures and dappled lighting",
        "Five themed side rooms representing Howl's Moving Castle, Ponyo, Spirited Away, Princess Mononoke, and My Neighbor Totoro",
        "A themed retail space extending the guest experience",
      ],
    },
    {
      type: "paragraph",
      text:
        "Each area featured custom scenic treatments, atmospheric lighting design, and character-specific environmental storytelling elements.",
    },
    {
      type: "heading",
      level: 3,
      text: "Brand Extensions and Guest Experience",
    },
    {
      type: "paragraph",
      text:
        "The immersive concept extended beyond spatial design to include film-inspired uniforms, a custom menu with playful dishes like Soot Sprite Macarons, themed cocktails, and branded merchandise concepts for the retail space.",
    },
    {
      type: "paragraph",
      text:
        "Students learned to use SketchUp for spatial modeling and Twinmotion for animated walkthroughs with integrated lighting effects, building a presentation language that felt much closer to professional themed entertainment pitching than a standard classroom project.",
    },
    {
      type: "heading",
      level: 2,
      text: "Skill Development and Professional Applications",
    },
    {
      type: "paragraph",
      text:
        "The five-week project yielded measurable growth across technical proficiency, professional practice, transferable design skills, and leadership development.",
    },
    {
      type: "heading",
      level: 3,
      text: "Technical Proficiency",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Rapid acquisition of 3D modeling and visualization software skills",
        "Translation of 2D design principles into spatial planning concepts",
        "Implementation of environmental storytelling techniques",
      ],
    },
    {
      type: "heading",
      level: 3,
      text: "Professional Practice",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Development of industry-aligned project management workflows",
        "Creation of client-ready presentation materials and pitch techniques",
        "Collaborative problem-solving under realistic timeline constraints",
      ],
    },
    {
      type: "heading",
      level: 3,
      text: "Transferable Design Skills",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Application of costume design principles to branded uniforms and environmental aesthetics",
        "Adaptation of narrative structure to physical space progression",
        "Integration of sensory design elements into cohesive guest experiences",
      ],
    },
    {
      type: "heading",
      level: 3,
      text: "Leadership Development",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Implementation of studio-style role specialization and accountability",
        "Peer-to-peer feedback integration and design iteration processes",
        "Cross-disciplinary communication and collaborative decision-making",
      ],
    },
    {
      type: "paragraph",
      text:
        "This comprehensive simulation prepared students for diverse career paths in themed entertainment firms, immersive dining concepts, museum exhibition design, and environmental storytelling practice.",
    },
    {
      type: "heading",
      level: 2,
      text: "Visual Showcase",
    },
    {
      type: "heading",
      level: 3,
      text: "Main Room",
    },
    {
      type: "paragraph",
      text:
        "Ghibli’s Delights invites guests into a fully realized storybook setting, where the boundary between dining and narrative dissolves. At the heart of the space stands a monumental weeping willow tree, its canopy transforming the room into a lush, animated forest. Lanterns glow softly over curved wooden booths, while hand-crafted props—miniature planes, ribbons, and characters—float above, evoking the wonder of Studio Ghibli films. The visual layering and organic materials create a welcoming environment that feels both fantastical and grounded.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_e70b7b314e9640149e69ed68aaa58aa7-fc5e0ded.jpeg",
          alt: "Main dining room rendering from the Ghibli restaurant concept.",
          caption: "Main Room Rendering, Twinmotion.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_ae64299bdc744e1a862aba64bc5a7bbc-f7666497.jpeg",
          alt: "Second main dining room rendering from the Twinmotion walkthrough set.",
          caption: "Main Room Rendering, Twinmotion.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_9a64fc01f81042738ef1a038b90529dd-e9ea8554.jpeg",
          alt: "Main room menu items designed for the themed restaurant.",
          caption: "Main Room Menu Items. Resturant Design.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_313ff4a76c05405dbbd2524e17b75f9a-b45458b6.jpeg",
          alt: "Main room themed uniform design for staff in the immersive concept.",
          caption: "Main Room Themed Uniform Design.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_a668d0d7c5804e0ea645138ad7e92e4a-af3a8d50.jpeg",
          alt: "Research imagery for the main room concept.",
          caption: "Research Images.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_ba4f8a2f0e1c42358544825959579ff4-cfb6bb8c.jpeg",
          alt: "Additional research imagery supporting the main room concept.",
          caption: "Reseach Images.",
        },
      ],
    },
    {
      type: "paragraph",
      text:
        "The experience extends beyond architecture to include costume and graphic design. Staff uniforms echo the restaurant’s nature-forward palette, and the illustrated menu reinforces the tone with items like No Face Sushi and Kiki’s Chocolate Cake. Together, these elements build a cohesive, multisensory environment that blends hospitality, animation, and themed entertainment design.",
    },
    {
      type: "video",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/video/articles/studio-ghibli-inspired-immersive-dining-experience/video/9e1774_eeb3f5c5725e4a4c829aed62842238b0-696dc42d.mp4",
      caption: "Main Dining Room Twinmotion Walkthrough",
    },
    {
      type: "heading",
      level: 3,
      text: "My Neighbor Totoro",
    },
    {
      type: "paragraph",
      text:
        "The My Neighbor Totoro room is an intimate, forest-nestled hideaway designed to transport guests directly into the rural charm and magical realism of the film. Anchored by a life-sized Totoro holding a leaf umbrella, the space uses warm wood textures, mossy green walls, and a ceiling of interwoven branches to evoke the enchanted woods of the story.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_cc2ee6a3cfe846909596c206343f0c76-5436b28d.jpeg",
          alt: "My Neighbor Totoro rendering from the themed side room.",
          caption: "My Neighbor Totoro Rendering Twinmotion.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_f6fe10fdf9e14419b17e698f5db576ce-11c79c51.jpeg",
          alt: "Specialty menu design for the My Neighbor Totoro side room.",
          caption: "My Neighbor Totoro Specialty Menu Themed Design.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_dbc85f35e2324d59997b78d94b8aa128-02c5f71e.jpeg",
          alt: "Themed uniform design for the Totoro room.",
          caption: "My Neighbor Totoro Themed Uniform Design.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_c388bca412434470964b9968278b70af-b37e0c9e.jpeg",
          alt: "Research imagery for the My Neighbor Totoro concept.",
          caption: "My Neighbor Totoro Research Images.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_d4e22d4d194f4447a8a8791701665318-442c299e.jpeg",
          alt: "Additional research imagery for the My Neighbor Totoro concept.",
          caption: "My Neighbor Totoro Research Images.",
        },
      ],
    },
    {
      type: "paragraph",
      text:
        "The experience is brought to life through more than décor. Staff uniforms echo the film’s warm palette, directly referencing Mei’s yellow and orange outfit and Totoro’s soft grey tones. On the menu, Grandma’s Ohagi Mochi and Soot Sprite Macaroons continue the world-building through food.",
    },
    {
      type: "video",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/video/articles/studio-ghibli-inspired-immersive-dining-experience/video/9e1774_253418d025f04fe5b579126461857c96-be7f2d61.mp4",
      caption: "My Neighbor Totoro Twinmotion Walkthrough",
    },
    {
      type: "heading",
      level: 3,
      text: "Princess Mononoke",
    },
    {
      type: "paragraph",
      text:
        "The Princess Mononoke side room immerses guests in a forest sanctuary that honors the spiritual and environmental themes of the film. Natural textures define the space—from stone flooring and tree trunk columns to vine-covered walls and forest canopy lighting. A life-sized Forest Spirit sculpture watches over the room while Kodama figures observe from surrounding shelves.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_061ec2761c384613a9ca1ecf1c6ee3e2-89b4a256.jpeg",
          alt: "Princess Mononoke rendering from the themed side room concept.",
          caption: "Princess Mononoke room rendering.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_c56cda73f5a848acabf9fe2e59177573-8a67752d.jpeg",
          alt: "Alternate Princess Mononoke rendering from the student project.",
          caption: "Princess Mononoke room rendering.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_3eaf4da0f7f043449ade480b837d4ada-3b3cf486.jpeg",
          alt: "Princess Mononoke themed menu or collateral design.",
          caption: "Princess Mononoke project development image.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_92300c16da8e486c9cb1231d51515c28-b23808a4.jpeg",
          alt: "Princess Mononoke costume or branding development image.",
          caption: "Princess Mononoke project development image.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_e24ad2be54ac4ea0b998478efce810ed-7f04cbb5.jpeg",
          alt: "Princess Mononoke inspiration research image.",
          caption: "Princess Mononoke inspiration research.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_9dc27567f94c4360a1894b69d55c4a0f-97b6a62a.jpeg",
          alt: "Additional Princess Mononoke inspiration research image.",
          caption: "Princess Mononoke inspiration research.",
        },
      ],
    },
    {
      type: "paragraph",
      text:
        "The themed experience is supported by costuming and cuisine that reinforce the film’s reverence for nature. Uniforms draw on Ashitaka’s palette and San’s tribal earth tones, while menu items like Tree Spirit Cake Balls and the Spirit of the Forest cocktail extend the story into the guest experience.",
    },
    {
      type: "video",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/video/articles/studio-ghibli-inspired-immersive-dining-experience/video/9e1774_db4c7b43f9a24bb8aeb29cd51b9952e4-aebfa44a.mp4",
      caption: "The Princess Mononoke Twinmotion Walkthrough",
    },
    {
      type: "heading",
      level: 3,
      text: "Ponyo",
    },
    {
      type: "paragraph",
      text:
        "Bright, buoyant, and overflowing with childhood whimsy, the Ponyo side room plunges guests into an underwater fantasy teeming with charm. Rock formations, fish tank columns, suspended sea creatures, and playful bubble details evoke the film’s aquatic sequences, while a raindrop-inspired chandelier lights the vivid blue walls.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_8e1ed7d996e54539b6c2fb8f15b2dd23-2951de09.jpeg",
          alt: "Ponyo rendering from the themed side room concept.",
          caption: "Ponyo room rendering.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_1491bfc552964da88c025647963c62e3-4c557d22.jpeg",
          alt: "Alternate Ponyo rendering from the student project.",
          caption: "Ponyo room rendering.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_3108e5433887440ca6bb2d2cb35ec8ee-c2df9e49.jpeg",
          alt: "Ponyo menu or collateral design image.",
          caption: "Ponyo project development image.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_0ec4b61c87d6408199fa706416ea03e4-af02f7e3.jpeg",
          alt: "Ponyo costume or branding development image.",
          caption: "Ponyo project development image.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_1997f0253d7242b8a6d90f9687a7da6c-a70e89d1.jpeg",
          alt: "Ponyo inspiration research image.",
          caption: "Ponyo inspiration research.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_da1584e0cb0347ec9a88f7527ba19a2f-bc083b6c.jpeg",
          alt: "Additional Ponyo inspiration research image.",
          caption: "Ponyo inspiration research.",
        },
      ],
    },
    {
      type: "paragraph",
      text:
        "Costumes and menu design extend the tone. The Bucket Dirt Cake and Essence of the Sea drink turn the dining experience into a playful extension of Ponyo’s world, keeping the space accessible to families while maintaining a strong visual identity.",
    },
    {
      type: "video",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/video/articles/studio-ghibli-inspired-immersive-dining-experience/video/9e1774_185d929cb671450e9c83d0c806e4cdad-8face6f8.mp4",
      caption: "Ponyo Twinmotion Walkthrough",
    },
    {
      type: "heading",
      level: 3,
      text: "Spirited Away",
    },
    {
      type: "paragraph",
      text:
        "Inspired by the mysterious bathhouse of Spirited Away, this side room becomes a dimly lit lounge where guests can unwind in the ambiance of the spirit realm. Deep red walls, glowing lanterns, cherry blossom branches, and No-Face masks shape a space that feels both elegant and uncanny.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_4381eba15641435e9cd0516c150edb3b-5fc5e15c.jpeg",
          alt: "Spirited Away rendering from the themed side room.",
          caption: "Spirited Away Rendering in Twinmotin.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_c24525de37c741b486cf5059533c0d76-77f59399.jpeg",
          alt: "Alternate Spirited Away rendering from Twinmotion.",
          caption: "Spirited Away in Twinmotion.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_6983e616f1fd4978bad2fdace8cef1fb-8629b9b1.jpeg",
          alt: "Spirited Away themed uniform design.",
          caption: "Spirited Away Themed Uniform Design.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_463521a106b6440e83a232f893ef9b9f-3ffc890c.jpeg",
          alt: "Additional Spirited Away development image.",
          caption: "Spirited Away project development image.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_8e1f92a8f40a43e59f62b12e733bca14-8f4645b7.jpeg",
          alt: "Spirited Away inspiration research image.",
          caption: "Spirited Away Inspiration Research.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_08c8e27eb2214b7fb4324a6a411d332e-8ce5162a.jpeg",
          alt: "Additional Spirited Away inspiration research image.",
          caption: "Spirited Away Inspiration Research.",
        },
      ],
    },
    {
      type: "paragraph",
      text:
        "Uniforms nod to Chihiro’s transformation, and the menu features Steam Buns and Sponge Cake as modest but iconic references to her journey. The room functions as a quiet portal into the world of spirits, where a meal becomes part of the story.",
    },
    {
      type: "video",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/video/articles/studio-ghibli-inspired-immersive-dining-experience/video/9e1774_67126968704e47d58f1504177be573a9-7eca867c.mp4",
      caption: "Spirited Away Twinmotion Walkthrough",
    },
    {
      type: "heading",
      level: 3,
      text: "Howl's Moving Castle",
    },
    {
      type: "paragraph",
      text:
        "The Howl’s Moving Castle room captures the enchanting clutter and romantic mystique of Howl’s traveling home. Deep red wallpaper, eclectic wall art, ornate masks, chandeliers, stained glass details, and velvet upholstery create a richly layered interior inspired by the film’s balance of opulence and chaos.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_c311ef858b894aa88b04e1d508faafe6-151023dc.jpeg",
          alt: "Howl's Moving Castle rendering from the themed side room.",
          caption: "Howl's Moving Castle Rendering in Twinmotion.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_ed919a65b8054981b5cdc95262d1589c-beffc0db.jpeg",
          alt: "Alternate Howl's Moving Castle rendering from Twinmotion.",
          caption: "Howl's Moving Castle Reindering in Twinmotion.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_9b6ff8a4a3e7473fbeb9e2d4ea78872b-f13203e1.jpeg",
          alt: "Howl's Moving Castle themed uniform design.",
          caption: "Howl's Moving Castle Themed Uniform Design.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_6d5e75b7a0fc4afa91284fca90cd8394-930158f7.jpeg",
          alt: "Additional Howl's Moving Castle development image.",
          caption: "Howl's Moving Castle project development image.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_056fa8bfa351456bae15e721f4b4ff08-f90d97c3.jpeg",
          alt: "Howl's Moving Castle inspiration research image.",
          caption: "Howl's Moving Castle Inspiration Research.",
        },
        {
          url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/studio-ghibli-inspired-immersive-dining-experience/body/9e1774_13c2220500ec4088b87db69b6446c37d-6c1b0947.jpeg",
          alt: "Additional Howl's Moving Castle inspiration research image.",
          caption: "Howl's Moving Castle Inspiration Research.",
        },
      ],
    },
    {
      type: "paragraph",
      text:
        "Staff uniforms echo Howl’s palette and Sophie’s hat shop aesthetic, while themed menu items like Sophie’s Hat Cookies and Turnip Head Skewers extend the room’s nostalgia and wit into the guest experience.",
    },
    {
      type: "video",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/video/articles/studio-ghibli-inspired-immersive-dining-experience/video/9e1774_b200c45eaaee4bb28161d9714cc80300-251e1a52.mp4",
      caption: "Howl's Moving Castle Twinmotion Walkthrough",
    },
    {
      type: "faq",
      items: [
        {
          question: "What software tools do students learn in this course?",
          answer:
            "<p>Students are introduced to industry-standard visualization tools including SketchUp for 3D modeling, Twinmotion for animated walkthroughs, and Adobe Creative Suite for presentation materials and branding.</p>",
        },
        {
          question: "How does the course manage collaboration within a single large team?",
          answer:
            "<p>Students establish specialized roles based on individual strengths while maintaining collaborative decision-making. Regular internal deadlines and structured check-ins help maintain accountability and momentum.</p>",
        },
        {
          question: "How do theatrical costume design skills transfer to themed entertainment?",
          answer:
            "<p>Costume designers bring expertise in character development, material selection, narrative communication, and visual storytelling—skills that translate directly to themed environments, staff presentation, and immersive guest experience design.</p>",
        },
        {
          question: "What career opportunities does this project preparation support?",
          answer:
            "<p>Graduates with this experience are better prepared for roles in themed entertainment firms, immersive dining concepts, museum exhibition design, retail storytelling environments, and experiential marketing agencies.</p>",
        },
        {
          question: "Where can I learn more about Stephens College Theatre programs?",
          answer:
            "<p>Visit the Stephens College Theatre Program website to explore the broader range of production and design opportunities available to students.</p>",
        },
      ],
    },
  ],
};

const workingOffstageArticle: LocalArticle = {
  id: 100006,
  slug: "working-offstage-expanding-a-scenic-design-career-beyond-theatre",
  title: "Working Offstage: Expanding a Scenic Design Career Beyond Theatre",
  excerpt:
    "A practical essay on how scenic designers can expand into themed entertainment, architectural visualization, rendering, and other adjacent industries without abandoning theatre.",
  coverImageUrl:
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/working-offstage/cover.webp",
  coverImageAlt:
    "Abstract theatrical architecture opening into adjacent design worlds beyond the stage, with a solitary figure standing in a warm amber haze.",
  publishedAt: "2026-03-26",
  updatedAt: "2026-03-26",
  createdAt: "2026-03-26",
  categoryName: "Design Process",
  seoTitle:
    "Working Offstage: Expanding a Scenic Design Career Beyond Theatre",
  seoDescription:
    "How scenic designers can build sustainable careers beyond theatre through themed entertainment, visualization, rendering, freelance pricing, and better scope management.",
  seoKeywords:
    "scenic design career, themed entertainment careers, architectural rendering freelance, scenic designer freelance rates, offstage design work, experiential design career, scenic design beyond theatre",
  series: {
    name: "Process and Practice",
    slug: "process-and-practice",
    order: 6,
  },
  tags: [
    { id: 100415, name: "Career Development", slug: "career-development" },
    { id: 100416, name: "Scenic Design", slug: "scenic-design" },
    { id: 100417, name: "Themed Entertainment", slug: "themed-entertainment" },
    { id: 100418, name: "Experiential Design", slug: "experiential-design" },
    { id: 100419, name: "Freelance Practice", slug: "freelance-practice" },
  ],
  featured: false,
  content: [
    {
      type: "paragraph",
      text:
        "There are moments in a career where things shift.",
    },
    {
      type: "paragraph",
      text:
        "Sometimes the change is external. Work slows down. A theatre you have worked with regularly brings in new designers. Or something larger hits, like a global pandemic, and the industry pauses in a way no one expected.",
    },
    {
      type: "paragraph",
      text:
        "Other times, the shift is internal. You want to try something different. You want a better balance. Or you are looking for a way to make the career more sustainable over time.",
    },
    {
      type: "paragraph",
      text:
        "That is not failure. That is the job.",
    },
    {
      type: "quote",
      text:
        "Working offstage does not mean starting over. It means applying the same skill set in a different context.",
    },
    {
      type: "paragraph",
      text:
        "Most scenic designers do not follow a single path. They build a mix. For many, that second lane is education. I have done that, and it works well for a lot of designers. But it is not for everyone, and it is not the only option.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "Themed entertainment",
        "Architectural rendering",
        "Drafting and visualization",
        "Film and television",
      ],
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/working-offstage/transfer-editorial.webp",
      alt: "Atmospheric blue editorial artwork with layered translucent planes and luminous architectural openings suggesting expansion beyond a single path.",
      caption:
        "A broader career can still grow from the same core scenic instincts.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Skill Set Already Transfers",
    },
    {
      type: "paragraph",
      text:
        "Scenic designers are already trained to move between disciplines. We interpret ideas quickly. We build environments from partial information. We translate conversations into visual form. We move between drafting, modeling, rendering, and communication without thinking twice about it.",
    },
    {
      type: "paragraph",
      text:
        "That workflow is not specific to theatre. It applies directly to themed environments, architectural visualization, and production design for camera. The tools may shift slightly, and clients may speak a different language, but the core process is the same.",
    },
    {
      type: "paragraph",
      text:
        "In many ways, you are not learning something entirely new. You are recognizing the value of what you already know how to do.",
    },
    {
      type: "heading",
      level: 2,
      text: "When Theatre Is Not Enough or Not Available",
    },
    {
      type: "paragraph",
      text:
        "Theatre work is not always consistent. Even in a strong network, seasons fluctuate. Budgets change. Priorities shift.",
    },
    {
      type: "paragraph",
      text:
        "There are also moments where you might want something different, whether that means more financial stability, a different pace, or simply a different kind of problem to solve.",
    },
    {
      type: "paragraph",
      text:
        "That is where working offstage becomes useful. It is not a replacement for theatre. It is a parallel track, and for many designers it becomes part of a broader career model that shifts over time.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Real Adjustment: Time Becomes the Product",
    },
    {
      type: "paragraph",
      text:
        "The biggest shift when stepping into offstage work is not design. It is how the work is structured.",
    },
    {
      type: "paragraph",
      text:
        "In theatre, you are often paid per production. There is an understanding of the scope, even if it is not always clearly defined. In adjacent industries, especially in freelance work, you are billing for time.",
    },
    {
      type: "paragraph",
      text:
        "That changes how you approach everything. You are not just delivering a design. You are managing hours, revisions, file conditions, and expectations in a much more direct way.",
    },
    {
      type: "paragraph",
      text:
        "That is where many scenic designers need to recalibrate.",
    },
    {
      type: "heading",
      level: 2,
      text: "Start with the Market, Not Guessing",
    },
    {
      type: "paragraph",
      text:
        "When I first started working outside of theatre, the instinct was to pick a number that felt reasonable. That is not how this works.",
    },
    {
      type: "paragraph",
      text:
        "Instead, look at what companies are already paying. Spend time on LinkedIn and review full-time roles in your area: 3D designers, visualization artists, experiential designers. Take those salary ranges and break them into hourly equivalents. That becomes your baseline.",
    },
    {
      type: "paragraph",
      text:
        "If you are unsure where to land, a simple approach is to start at the lower end of that range and add around 20 percent to account for freelance realities like taxes, software, and downtime between projects.",
    },
    {
      type: "paragraph",
      text:
        "That adjustment is not about inflating your rate. It is about aligning it with how you are actually working.",
    },
    {
      type: "heading",
      level: 2,
      text: "Where Things Actually Go Wrong: Scope",
    },
    {
      type: "paragraph",
      text:
        "One of the first projects I took on outside of theatre was described as a quick rendering pass: clean up the model, add some texture, and get it presentable. It did not go that way.",
    },
    {
      type: "paragraph",
      text:
        "The file needed more than cleanup. Geometry had to be rebuilt. Materials did not translate. Lighting had to be rethought. What sounded like a short task turned into something much closer to a full design pass.",
    },
    {
      type: "paragraph",
      text:
        "That experience stuck with me, because the issue was not the work. The issue was agreeing to it before fully understanding what I was stepping into.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "Open the files",
        "Review PDFs",
        "Look at reference images",
        "Ask what the deliverables actually are",
      ],
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/working-offstage/scope-editorial.webp",
      alt: "Warm charcoal editorial artwork of stacked translucent planes and shifting surfaces suggesting unseen layers of complexity inside a project.",
      caption:
        "Scope rarely appears all at once. It usually reveals itself in layers.",
    },
    {
      type: "paragraph",
      text:
        "Pricing matters, but scope is where projects fall apart. What gets described as a quick rendering is often asking for far more work than the original language suggests.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Core Strategy: Give a Range",
    },
    {
      type: "paragraph",
      text:
        "Once you understand the scope, do not lock yourself into a fixed number of hours. Always give a range.",
    },
    {
      type: "paragraph",
      text:
        "If something feels like it will take around 30 hours, say: “This will likely take between 20 and 40 hours depending on revisions and file condition.”",
    },
    {
      type: "paragraph",
      text:
        "This is one of the most important habits you can build. It protects you from unknowns, sets expectations early, and gives you flexibility without renegotiating mid-project. Clients in architecture, film, and experiential work are used to this structure. It signals that you understand how these projects function.",
    },
    {
      type: "image",
      url: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/working-offstage/pricing-editorial.webp",
      alt: "Soft blue editorial artwork with measured horizontal bands and quiet shifts in light suggesting structure, calibration, and flexibility.",
      caption:
        "A useful range creates structure without pretending the work is fixed.",
    },
    {
      type: "heading",
      level: 2,
      text: "Why the Range Matters More Than the Rate",
    },
    {
      type: "paragraph",
      text:
        "You can have a solid hourly rate and still lose money if the scope expands. That is why the range matters more than the number itself.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "Files are rarely clean",
        "Expectations evolve",
        "Creative work is not fixed",
      ],
    },
    {
      type: "paragraph",
      text:
        "Scenic designers already understand this instinctively. We are used to things changing in the room. The adjustment is learning how to account for that change before the work begins.",
    },
    {
      type: "heading",
      level: 2,
      text: "Be Honest. That Is the Long Game.",
    },
    {
      type: "paragraph",
      text:
        "The goal is not to stretch hours or overestimate. It is to be accurate. Track your time. Stay within the range you set. If something shifts, communicate early.",
    },
    {
      type: "paragraph",
      text:
        "Because the real goal is not a single project. It is building relationships that lead to more work. That only happens if people trust how you work.",
    },
    {
      type: "heading",
      level: 2,
      text: "A Broader Career Model",
    },
    {
      type: "paragraph",
      text:
        "Most sustainable careers in scenic design are built across multiple lanes. Theatre may remain central, but it does not have to carry everything.",
    },
    {
      type: "list",
      listType: "bullet",
      items: [
        "A regional production",
        "A themed entertainment concept",
        "A rendering package for an architectural client",
        "A short-term project for a brand or agency",
      ],
    },
    {
      type: "paragraph",
      text:
        "Those shifts are not a step away from theatre. They are part of a larger practice. Working offstage is not about leaving the field. It is about expanding how you operate within it.",
    },
    {
      type: "paragraph",
      text:
        "Once you start approaching your career that way, those transitions stop feeling like disruptions. They just become part of the rhythm of the work.",
    },
    {
      type: "heading",
      level: 2,
      text: "Related Reading",
    },
    {
      type: "html",
      content:
        '<ul><li><a href="/articles/the-evolution-of-themed-entertainment-from-ancient-gardens-to-modern-immersive-experienceses-everything">The Evolution of Themed Entertainment</a></li><li><a href="/projects/experiential">Experiential Design Portfolio</a></li><li><a href="/about/teaching">Teaching Philosophy</a></li></ul>',
    },
    {
      type: "heading",
      level: 2,
      text: "FAQ: Working Offstage as a Scenic Designer",
    },
    {
      type: "faq",
      items: [
        {
          question: "Is it common for scenic designers to work outside of theatre?",
          answer:
            "Yes. Many scenic designers build careers across multiple areas, including education, drafting, rendering, and design work in adjacent industries. Theatre is often the foundation, but not the only lane.",
        },
        {
          question: "Do I need to learn completely new skills to work in other industries?",
          answer:
            "Not usually. The core skills, including visual storytelling, drafting, modeling, and rendering, transfer directly. The adjustment is more about workflow, pace, and communication.",
        },
        {
          question: "How do I figure out what to charge as a freelancer?",
          answer:
            "Start by looking at full-time salary ranges for similar roles in your area. Convert that into an hourly rate, then add around 20 percent to account for freelance costs like taxes, software, and downtime.",
        },
        {
          question: "Why is giving an hourly range better than a fixed estimate?",
          answer:
            "A range accounts for unknowns like file condition, revisions, and scope changes. It protects your time and sets clearer expectations with clients before the work begins.",
        },
        {
          question: "What if I underestimate the time required?",
          answer:
            "Communicate early. If you have provided a range, you already have a structure for explaining why the project is shifting. Transparency is key to maintaining trust.",
        },
        {
          question: "Is working offstage a replacement for theatre?",
          answer:
            "No. It is a way to expand your practice. Many designers move between theatre and adjacent industries depending on the season, workload, and opportunities available.",
        },
      ],
    },
  ],
};

const conceptMusicalArticle: LocalArticle = {
  id: 100007,
  slug: "when-broadway-got-a-revolution-the-rise-of-the-concept-musical-in-the-1970s",
  title: "The Rise of the Concept Musical in the 1970s",
  excerpt:
    "A scenic-focused history of the concept musical and the artists who pushed Broadway away from tidy plots and toward thematic structure, fragmentation, and theatrical self-awareness.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/concept-musical-1970s/cover.webp",
  coverImageAlt:
    "Warm theatrical montage cover featuring Stephen Sondheim, Harold Prince, Michael Bennett, and Bob Fosse.",
  publishedAt: "2025-03-05T10:56:06.270Z",
  updatedAt: "2025-03-17T09:06:34.261Z",
  createdAt: "2025-03-05T10:56:06.270Z",
  categoryName: "Performance History & Culture",
  seoTitle: "The Rise of the Concept Musical in the 1970s",
  seoDescription:
    "Explore how Sondheim, Prince, Bennett, and Fosse reshaped Broadway in the 1970s through concept musicals that prioritized theme, structure, and theatrical form over conventional plot.",
  seoKeywords:
    "concept musical, Broadway history, Stephen Sondheim, Harold Prince, Bob Fosse, Michael Bennett, musical theatre history",
  tags: [
    { id: 100420, name: "Concept Musical", slug: "concept-musical" },
    { id: 100421, name: "Broadway History", slug: "broadway-history" },
    { id: 100422, name: "Musical Theatre History", slug: "musical-theatre-history" },
    { id: 100423, name: "Stephen Sondheim", slug: "stephen-sondheim" },
    { id: 100424, name: "Entertainment History", slug: "entertainment-history" },
  ],
  featured: false,
  readTime: 11,
  sourcePublication: "Scenic Insights Archive",
  sourceUrl:
    "https://ggjwk4vwfr.wixstudio.com/bptd/post/when-broadway-got-a-revolution-the-rise-of-the-concept-musical-in-the-1970s",
  content: conceptMusicalArticleBlocks as LocalArticle["content"],
};

const britishMegamusicalArticle: LocalArticle = {
  id: 100008,
  slug: "when-broadway-got-spectacular-the-rise-of-the-british-megamusical",
  title: "When Broadway Got Spectacular: The Rise of the British Megamusical",
  excerpt:
    "A scenic-focused look at how British megamusicals turned Broadway into a global entertainment machine through spectacle, branding, technology, and industrial-scale production.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/british-megamusical/cover.webp",
  coverImageAlt:
    "Warm cinematic megamusical cover with a chandelier, barricade imagery, and sweeping theatrical light.",
  publishedAt: "2025-03-10T09:55:44.718Z",
  updatedAt: "2025-03-17T09:05:54.095Z",
  createdAt: "2025-03-10T09:55:44.718Z",
  categoryName: "Performance History & Culture",
  seoTitle: "The Rise of the British Megamusical",
  seoDescription:
    "Explore how Andrew Lloyd Webber, Cameron Mackintosh, and their collaborators reshaped Broadway through megamusicals like Cats, Les Miserables, The Phantom of the Opera, and Miss Saigon.",
  seoKeywords:
    "british megamusical, Broadway history, Andrew Lloyd Webber, Cameron Mackintosh, Phantom of the Opera, Les Miserables, Cats musical, theatre spectacle",
  tags: [
    { id: 100430, name: "British Megamusical", slug: "british-megamusical" },
    { id: 100431, name: "Broadway History", slug: "broadway-history" },
    { id: 100432, name: "Andrew Lloyd Webber", slug: "andrew-lloyd-webber" },
    { id: 100433, name: "Cameron Mackintosh", slug: "cameron-mackintosh" },
    { id: 100434, name: "Phantom of the Opera", slug: "phantom-of-the-opera" },
    { id: 100435, name: "Theatre Spectacle", slug: "theatre-spectacle" },
  ],
  featured: false,
  readTime: 8,
  sourcePublication: "Scenic Insights Archive",
  sourceUrl:
    "https://ggjwk4vwfr.wixstudio.com/bptd/post/when-broadway-got-spectacular-the-rise-of-the-british-megamusical",
  content: britishMegamusicalArticleBlocks as LocalArticle["content"],
};

const evolutionNarrativeCinemaArticle: LocalArticle = {
  id: 100009,
  slug: "the-evolutionof-narrativein-cinema",
  title: "The Evolution of Narrative in Cinema",
  excerpt:
    "A scenic-focused history of early film language, tracing how editing, framing, sound, color, and mise-en-scene reshaped visual storytelling before the 1940s.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/evolution-narrative-cinema/cover.webp",
  coverImageAlt:
    "Cinematic editorial cover showing the transition from silent film grammar to sound, color, and deep-focus cinema.",
  publishedAt: "2025-01-31T00:00:00.000Z",
  updatedAt: "2025-03-17T00:00:00.000Z",
  createdAt: "2025-01-31T00:00:00.000Z",
  categoryName: "Performance History & Culture",
  seoTitle: "The Evolution of Narrative in Cinema",
  seoDescription:
    "Explore how early filmmakers built cinematic storytelling through editing, camera logic, synchronized sound, Technicolor, and expressive mise-en-scene.",
  seoKeywords:
    "early cinema history, film narrative evolution, mise-en-scene, silent film, technicolor history, citizen kane cinematography",
  tags: [
    { id: 100440, name: "Film History", slug: "film-history" },
    { id: 100441, name: "Cinematic Language", slug: "cinematic-language" },
    { id: 100442, name: "Mise-en-Scene", slug: "mise-en-scene" },
    { id: 100443, name: "Visual Storytelling", slug: "visual-storytelling" },
    { id: 100444, name: "Early Cinema", slug: "early-cinema" }
  ],
  featured: false,
  readTime: 8,
  sourcePublication: "Scenic Insights Archive",
  sourceUrl: "https://ggjwk4vwfr.wixstudio.com/bptd/post/the-evolutionof-narrativein-cinema",
  content: evolutionNarrativeCinemaArticleBlocks as LocalArticle["content"],
};

const musicalCinema1980sArticle: LocalArticle = {
  id: 100010,
  slug: "the-1980s-musical-cinema-revolution-when-mtv-met-broadway-on-the-silver-screen",
  title: "The 1980s Musical Cinema Revolution",
  excerpt:
    "A scenic-focused study of how MTV aesthetics, youth-centered narratives, and cross-platform adaptation reshaped musical storytelling in the 1980s.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/articles/musical-cinema-1980s/hero-art.jpeg",
  coverImageAlt:
    "Stylized 1980s musical-cinema collage with dancers, records, neon light, and theatrical motion.",
  publishedAt: "2025-03-16T02:22:53.114Z",
  updatedAt: "2025-03-17T09:01:52.098Z",
  createdAt: "2025-03-16T02:22:53.114Z",
  categoryName: "Performance History & Culture",
  seoTitle: "The 1980s Musical Cinema Revolution",
  seoDescription:
    "Explore how MTV, Fame, Flashdance, Footloose, Hairspray, Menken and Ashman, and Disney's renaissance transformed movie musicals and Broadway adaptation logic.",
  seoKeywords:
    "1980s movie musicals, MTV musical cinema, Flashdance, Footloose, Hairspray, Menken and Ashman, Disney Renaissance, film to stage adaptation",
  tags: [
    { id: 100450, name: "Musical Cinema", slug: "musical-cinema" },
    { id: 100451, name: "Film History", slug: "film-history" },
    { id: 100452, name: "Broadway History", slug: "broadway-history" },
    { id: 100453, name: "MTV", slug: "mtv" },
    { id: 100454, name: "Disney Renaissance", slug: "disney-renaissance" },
    { id: 100455, name: "Bob Fosse", slug: "bob-fosse" }
  ],
  featured: false,
  readTime: 10,
  sourcePublication: "Scenic Insights Archive",
  sourceUrl:
    "https://ggjwk4vwfr.wixstudio.com/bptd/post/the-1980s-musical-cinema-revolution-when-mtv-met-broadway-on-the-silver-screen",
  content: musicalCinema1980sArticleBlocks as LocalArticle["content"],
};

const vectorworksRenderingTags = [
  { id: 101001, name: "Vectorworks", slug: "vectorworks" },
  { id: 101002, name: "Scenic Rendering", slug: "scenic-rendering" },
  { id: 101003, name: "Renderworks", slug: "renderworks" },
  { id: 101004, name: "Scenic Design", slug: "scenic-design" },
];

const vectorworksRenderingWorkflowArticle: LocalArticle = {
  id: 100020,
  slug: "vectorworks-rendering-workflow-file-size-and-speed",
  title: "Vectorworks Rendering Workflow: File Size and Speed",
  excerpt:
    "A practical rendering workflow for keeping Vectorworks scenic files responsive through imported model cleanup, USDZ handoffs, texture size, and final output decisions.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/vectorworks-rendering-series/file-size-speed-workflow-cover.png",
  coverImageAlt: "Abstract scenic rendering workflow moving from dense imported mesh geometry to a clean render-ready Vectorworks model.",
  publishedAt: "2026-03-14",
  updatedAt: "2026-04-29",
  categoryName: "Tools & Technology",
  seoTitle: "Vectorworks Rendering Workflow: File Size and Speed",
  seoDescription:
    "A practical Vectorworks rendering workflow for keeping scenic files responsive by managing SketchUp imports, USDZ handoffs, mesh cleanup, texture size, and bitmap publishing.",
  tags: [
    ...vectorworksRenderingTags,
    { id: 101005, name: "File Optimization", slug: "file-optimization" },
    { id: 101006, name: "SketchUp", slug: "sketchup" },
    { id: 101007, name: "USDZ", slug: "usdz" },
  ],
  featured: false,
  readTime: 7,
  linkedScenicProjectSlugs: [],
  series: { name: "Vectorworks Rendering", slug: "vectorworks-rendering", order: 2 },
  content: [],
};

const vectorworksCameraSetupArticle: LocalArticle = {
  id: 100021,
  slug: "setting-up-vectorworks-cameras-for-scenic-renderings",
  title: "Setting Up Vectorworks Cameras for Scenic Renderings",
  excerpt:
    "A camera setup workflow for scenic renderings in Vectorworks, from visualization layers to camera viewports.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/vectorworks-rendering-series/camera-setup-poster.jpg",
  coverImageAlt: "Vectorworks camera setup over a scenic ground plan.",
  publishedAt: "2026-03-15",
  updatedAt: "2026-04-29",
  categoryName: "Tools & Technology",
  seoTitle: "Setting Up Vectorworks Cameras for Scenic Renderings",
  seoDescription:
    "A practical guide to setting up Vectorworks cameras for scenic design renderings, including lens choice, aspect ratio, viewport scale, and rendering sheet setup.",
  tags: [
    ...vectorworksRenderingTags,
    { id: 101006, name: "Cameras", slug: "cameras" },
  ],
  featured: false,
  readTime: 5,
  linkedScenicProjectSlugs: [],
  series: { name: "Vectorworks Rendering", slug: "vectorworks-rendering", order: 3 },
  content: [],
};

const vectorworksLightingRenderStylesArticle: LocalArticle = {
  id: 100022,
  slug: "lighting-and-render-styles-in-vectorworks",
  title: "Renderworks Settings and Lighting in Vectorworks",
  excerpt:
    "A scenic rendering workflow for comparing the same model across render looks, building a lighting layer, and choosing Renderworks settings with intention.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/vectorworks-rendering-series/render-tabs-cropped/custom-realistic-renderworks.jpg",
  coverImageAlt: "Carnegie Library scenic model rendered with a custom Realistic Renderworks style.",
  publishedAt: "2026-03-16",
  updatedAt: "2026-04-29",
  categoryName: "Tools & Technology",
  seoTitle: "Lighting and Render Styles in Vectorworks",
  seoDescription:
    "Learn how to compare Vectorworks render styles, build a scenic lighting layer, and use Renderworks background, quality, lighting, Redshift, and Realistic settings.",
  tags: [
    ...vectorworksRenderingTags,
    { id: 101007, name: "Lighting", slug: "lighting" },
    { id: 101008, name: "Redshift", slug: "redshift" },
  ],
  featured: false,
  readTime: 7,
  linkedScenicProjectSlugs: [],
  series: { name: "Vectorworks Rendering", slug: "vectorworks-rendering", order: 4 },
  content: [],
};

const vectorworksPublishingRenderingsArticle: LocalArticle = {
  id: 100023,
  slug: "publishing-vectorworks-renderings-for-presentation",
  title: "Publishing Vectorworks Renderings for Presentation",
  excerpt:
    "A publishing workflow for turning finished Vectorworks renderings into presentation-ready images.",
  coverImageUrl: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/articles/vectorworks-rendering-series/convert-bitmap-poster.jpg",
  coverImageAlt: "Vectorworks rendering viewport prepared for publishing.",
  publishedAt: "2026-03-17",
  updatedAt: "2026-04-29",
  categoryName: "Tools & Technology",
  seoTitle: "Publishing Vectorworks Renderings for Presentation",
  seoDescription:
    "A practical Vectorworks publishing workflow for exporting scenic renderings from viewports, choosing image size and DPI, and preparing files for Photoshop or presentation.",
  tags: [
    ...vectorworksRenderingTags,
    { id: 101009, name: "Presentation", slug: "presentation" },
    { id: 101010, name: "Photoshop", slug: "photoshop" },
  ],
  featured: false,
  readTime: 4,
  linkedScenicProjectSlugs: [],
  series: { name: "Vectorworks Rendering", slug: "vectorworks-rendering", order: 5 },
  content: [],
};

const externalProfileArticleSlugs = new Set([VOYAGELA_ARTICLE_SLUG]);

const dbBackedArticles = (generatedLocalArticles as LocalArticle[])
  .map(mergeArticleSources)
  .filter((article) => !externalProfileArticleSlugs.has(article.slug));

const baseArticles = dbBackedArticles;

const manualArticles: LocalArticle[] = [
  visualLanguageArticle,
  ghibliImmersiveDiningArticle,
  workingOffstageArticle,
  conceptMusicalArticle,
  britishMegamusicalArticle,
  evolutionNarrativeCinemaArticle,
  musicalCinema1980sArticle,
  vectorworksRenderingWorkflowArticle,
  vectorworksCameraSetupArticle,
  vectorworksLightingRenderStylesArticle,
  vectorworksPublishingRenderingsArticle,
];

const articlesWithManualEntries = [
  ...baseArticles.filter((article) => !manualArticles.some((manual) => manual.slug === article.slug)),
  ...manualArticles,
];

export const localArticles = articlesWithManualEntries
  .map(mergeArticleSources)
  .map((article) => ({
    ...article,
    categoryName: normalizeArticleCategory(article.categoryName),
    excerpt: article.excerpt || "",
    coverImageAlt: article.coverImageAlt || article.title,
    readTime: article.readTime ?? estimateReadTime(article.content),
    createdAt: article.createdAt || article.publishedAt,
    updatedAt: article.updatedAt || article.publishedAt,
    status: "published" as const,
  }))
  .map((article) => applyBlobMediaManifest(article))
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export function getLocalArticles() {
  return localArticles;
}

export function getLocalArticleBySlug(slug?: string | null) {
  if (!slug) return undefined;
  return localArticles.find((article) => article.slug === slug);
}

export function isLocalArticleSlug(slug?: string | null): boolean {
  return Boolean(getLocalArticleBySlug(slug));
}

export function toLocalArticleRecord(article: LocalArticle) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImageUrl: article.coverImageUrl,
    coverImageAlt: article.coverImageAlt,
    readTime: article.readTime ?? estimateReadTime(article.content),
    status: "published" as const,
    featured: Boolean(article.featured),
    categoryId: null,
    authorId: null,
    category: {
      id: -1,
      name: article.categoryName,
      slug: slugify(article.categoryName),
    },
    categoryName: article.categoryName,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    seoKeywords: article.seoKeywords || null,
    createdAt: new Date(article.createdAt || article.publishedAt),
    updatedAt: new Date(article.updatedAt || article.publishedAt),
    publishedAt: new Date(article.publishedAt),
    likes: 0,
    views: 0,
    tags: article.tags || [],
    audio: article.audio,
    series: article.series,
    linkedScenicProjectSlugs: article.linkedScenicProjectSlugs || [],
    sourcePublication: article.sourcePublication || null,
    sourceUrl: article.sourceUrl || null,
  };
}

export function getLocalArticleRecordBySlug(slug?: string | null) {
  const article = getLocalArticleBySlug(slug);
  return article ? toLocalArticleRecord(article) : undefined;
}

export function mergeArticleListWithLocal<T extends { slug: string }>(articles: T[]) {
  const bySlug = new Map<string, any>();

  for (const article of articles) {
    bySlug.set(article.slug, article);
  }

  for (const localArticle of localArticles) {
    bySlug.set(localArticle.slug, {
      ...bySlug.get(localArticle.slug),
      ...toLocalArticleRecord(localArticle),
    });
  }

  return Array.from(bySlug.values()).sort(
    (a, b) =>
      new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  );
}
