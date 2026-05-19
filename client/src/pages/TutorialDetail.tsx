"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import StructuredData from "@/components/StructuredData";
import { SEO } from "@/components/SEO";
import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTutorialArticleBlueprint } from "@/data/tutorialArticleBlueprints";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatUtcDate } from "@/lib/date-format";
import { getYouTubeThumbnail } from "@/lib/videoUtils";
import { getLocalTutorialBySlug, getLocalTutorials } from "@shared/localStudio";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, Link2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

const categories = [
  { slug: "getting-started", name: "Getting Started" },
  { slug: "2d-drafting", name: "2D Drafting" },
  { slug: "3d-modeling", name: "3D Modeling" },
  { slug: "rendering", name: "Rendering" },
];

const difficulties = [
  { slug: "beginner", name: "Beginner" },
  { slug: "intermediate", name: "Intermediate" },
  { slug: "advanced", name: "Advanced" },
];

const articlePillTabsListClass =
  "mx-auto inline-flex h-auto w-fit max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-white/14 bg-transparent p-1";

const articlePillTabsTriggerClass =
  "h-auto flex-none rounded-full border-0 bg-transparent px-5 py-2.5 text-[0.95rem] font-normal tracking-[-0.018em] text-white/62 shadow-none transition-colors hover:text-white data-[state=active]:bg-white/[0.12] data-[state=active]:text-white data-[state=active]:shadow-none dark:data-[state=active]:bg-white/[0.12] dark:data-[state=active]:text-white";

const TUTORIAL_COVER_VARIANTS = {
  "getting-started": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-3.png",
  ],
  "2d-drafting": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-3.png",
  ],
  "3d-modeling": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-3.png",
  ],
  rendering: [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-3.png",
  ],
} as const;

const normalizeToken = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getStableVariantIndex = (value: string, total: number) => {
  const hash = value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % total;
};

const getCategoryLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return categories.find((category) => category.slug === normalized)?.name || value || "Tutorial";
};

const getDifficultyLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return (
    difficulties.find((difficulty) => difficulty.slug === normalized)?.name ||
    value ||
    "General"
  );
};

const getTutorialSummary = (tutorial: any) => {
  if (tutorial.slug === "understanding-symbols") {
    return "Learn how 2D symbols behave in the Resource Manager and drawing, including grouped and page-based behavior, instance scaling, and definition editing.";
  }

  if (tutorial.description && String(tutorial.description).trim()) {
    return tutorial.description;
  }

  const category = getCategoryLabel(tutorial.category);
  const difficulty = getDifficultyLabel(tutorial.difficulty);
  return `${category} tutorial covering ${tutorial.title
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/^Vectorworks Quick Tip:\s*/i, "")
    .trim()} with a ${difficulty.toLowerCase()} workflow focus.`;
};

const getOverviewParagraphs = (value: string | null | undefined) =>
  String(value || "")
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const getArticleOverviewParagraphs = (tutorial: any) => {
  if (tutorial.slug === "understanding-design-layers") {
    return [
      "Design layers make the file easier to read because they let different systems occupy the same drawing without collapsing into one another. Architecture can sit underneath, scenic drafting can sit above it, and lighting can stay separate again, all while remaining available as context.",
      "The production example from UCI's The Pajama Game shows why that matters. Turning architecture off, viewing the file in isometric, or isolating the scenic ground plan is not just housekeeping. Each change helps the drafter ask a clearer question of the file: what do I need to see right now, and what should move into the background?",
      "The setup moves are intentionally simple: name layers clearly, keep related layers at the same scale, place them in the right stacking order, and choose layer options that support safe drafting. Those habits turn design layers from a list in the Navigation palette into a practical way of controlling focus, hierarchy, and coordination.",
    ];
  }

  if (tutorial.slug === "understanding-symbols") {
    return [
      "This lesson stays focused on 2D symbol workflows. It uses a few clear examples to explain how standard symbols, grouped symbols, and page-based symbols behave once they are placed in the drawing.",
      "A large part of that explanation happens through visual coding in the Resource Manager. Standard symbols appear in black, grouped symbols appear in blue, and page-based symbols appear in green. Those cues matter because the lesson is really about behavior as much as creation. The question is not only how to make a symbol, but how to understand what kind of object you are placing before it ever enters the document.",
      "From there, the tutorial moves through scaling methods and editing workflows, including the difference between editing a symbol definition and scaling a symbol instance. Grouped symbols and page-based symbols extend that idea by showing how symbols can either break their link on placement or respond to page scale instead of world units.",
    ];
  }

  if (tutorial.slug === "2d-edit-modify-tricks") {
    return [
      "Efficient 2D drafting depends on knowing how to change geometry once the basic shape is already on the page. The Mirror Tool shows that immediately: sometimes the drawing needs to move across an axis, and sometimes it needs a mirrored duplicate that keeps the original in place.",
      "From there, the tutorial shifts into direct shape editing with the Reshape Tool. Handles, edges, added vertices, radius points, and deleted points all become ways of adjusting an existing polygon without redrawing it from scratch. The Offset Tool then extends that logic by creating parallel geometry at a set distance or by visual placement, depending on whether the drawing needs precision or speed.",
      "The middle of the tutorial focuses on tools that break and reconnect geometry. Split divides shapes by line, point, or trim direction, while Connect/Combine extends or joins line segments depending on whether the result should remain separate or become a single polygon. These tools are especially useful when a drawing starts as simple geometry but needs to become more specific over time.",
      "The final portion moves into the Modify menu: Move, Align/Distribute, Rotate, Scale, Add Surface, Clip Surface, Intersect Surface, Convert to Lines, Compose, Decompose, and Duplicate Along Path. Together, these commands turn simple shapes into more flexible drafting systems.",
    ];
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return [
      "A strong annotation workflow starts with drafted information already built in the design layer: a plan view, a front elevation, and two wall sections. The first task is to move that information into a sheet layer through viewports, using crops, drawing numbers, titles, sheet references, and scale settings to establish a readable sheet.",
      "Once the viewports are created, the tutorial focuses on sheet organization. Grid snap helps align drawings, drawing labels are adjusted so they do not conflict with dimensions, and viewport annotation mode becomes the place where labels, dimensions, and markers are added at the correct scale.",
      "The dimensioning portion demonstrates constrained linear and constrained chain modes, showing why continuous dimension strings are useful for wall lengths, openings, and overall dimensions. Later, section elevation markers, detail viewports, callouts, and publishing settings turn the sheet into a more complete documentation package.",
    ];
  }

  const overviewParagraphs = getOverviewParagraphs(tutorial.overview);
  return overviewParagraphs.length > 0 ? overviewParagraphs : [];
};

const formatDuration = (duration: string | number | null | undefined) => {
  if (!duration) return "10 min";
  if (typeof duration === "string") {
    if (duration.includes(":")) {
      const [mins] = duration.split(":");
      return `${mins || duration} min`;
    }
    return duration;
  }
  return `${Math.max(1, Math.floor(duration / 60))} min`;
};

const formatDate = (dateString: string | Date | undefined) => {
  return formatUtcDate(dateString, "long") || "";
};

const getTutorialCoverImage = (tutorial: any) => {
  const category = normalizeToken(tutorial.category);
  const variants =
    TUTORIAL_COVER_VARIANTS[category as keyof typeof TUTORIAL_COVER_VARIANTS] ||
    TUTORIAL_COVER_VARIANTS["getting-started"];
  const variantIndex = getStableVariantIndex(String(tutorial.slug || tutorial.id), variants.length);

  return {
    src: variants[variantIndex],
    alt: `Vectorworks ${getCategoryLabel(tutorial.category)} tutorial cover`,
  };
};

const getYouTubeId = (url: string | undefined | null) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : url;
};

const getFeatureMoments = (tutorial: any) => {
  if (tutorial.slug === "understanding-design-layers") {
    return [
      {
        value: "stack",
        label: "Layer",
        title: "Think in drawing planes, not folders",
        body: "A design layer is easiest to understand as a plane of drawing information. The point is not to bury work in a list, but to let architecture, scenery, and lighting stay separate while still sharing one coordinated file.",
        detail:
          tutorial.key_concepts?.[0]?.content ||
          "Design layers organize drawing information like stacked sheets of paper or vellum.",
      },
      {
        value: "navigate",
        label: "Read",
        title: "Use visibility to manage attention",
        body: "Layer visibility changes what the drawing is asking you to notice. Showing, hiding, or graying other layers lets the active work stay clear without removing the surrounding context that keeps the file coordinated.",
        detail:
          tutorial.key_concepts?.[1]?.content ||
          "Higher layers in the stack appear in front of lower layers when objects overlap.",
      },
      {
        value: "draft",
        label: "Draft",
        title: "Keep access open, but authorship clear",
        body: "Layer options affect how safely you can draft. Gray/Snap Others and Show/Snap Others keep reference information available, while avoiding the confusion that comes from modifying every visible layer at once.",
        detail:
          tutorial.key_concepts?.[2]?.content ||
          "Gray/Snap Others is often the most useful default because it preserves snap access without flattening the visual hierarchy.",
      },
    ];
  }

  if (tutorial.slug === "understanding-symbols") {
    return [
      {
        value: "types",
        label: "2D symbols",
        title: "Read the symbol before you place it",
        body: "The teaching work here stays with 2D symbols: how they appear in the Resource Manager, how they are placed, and how their behavior changes depending on the symbol type you choose.",
        detail:
          tutorial.key_concepts?.[0]?.content ||
          "A 2D symbol is a reusable drawing object used for plans, elevations, and other documentation views.",
      },
      {
        value: "instances",
        label: "Instances",
        title: "An instance is not the definition",
        body: "One of the clearest lessons on the page is the difference between changing a placed symbol instance and editing the symbol definition that every instance refers back to.",
        detail:
          tutorial.key_concepts?.[5]?.content ||
          "Placed symbols can scale independently, while edits to the definition affect every linked instance.",
      },
      {
        value: "placement",
        label: "Placement",
        title: "Choose the symbol type for the layer it serves",
        body: "Grouped symbols, unit-based symbols, and page-based symbols each belong to a different kind of workflow. The choice is practical, not theoretical.",
        detail:
          tutorial.key_concepts?.[3]?.content ||
          "Page-based symbols respond to page scale and are most useful for sheet-layer documentation elements.",
      },
    ];
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return [
      {
        value: "structure",
        label: "Structure",
        title: "Build the sheet through viewports",
        body: "Existing design-layer information moves onto the sheet through viewports, treating the sheet as a composed drawing rather than a place to redraw content.",
        detail:
          tutorial.key_concepts?.[0]?.content ||
          "Viewports let the drawing be cropped, scaled, and annotated without changing the source geometry.",
      },
      {
        value: "annotate",
        label: "Annotate",
        title: "Dimension inside the right scale context",
        body: "Once the sheet is laid out, the important shift is into viewport annotations, where dimensions, labels, and markers behave at the scale the drawing is meant to communicate.",
        detail:
          tutorial.key_concepts?.[6]?.content ||
          "Annotations live inside the viewport context so notes and dimensions match the scale of the drawing being presented.",
      },
      {
        value: "publish",
        label: "Publish",
        title: "Finish as a readable document set",
        body: "The lesson ends with the drawing behaving like documentation: aligned viewports, clear labels, reference markers, detail enlargements, and a publishing workflow that keeps output organized.",
        detail:
          tutorial.key_concepts?.[5]?.content ||
          "Detail viewports and sheet organization turn isolated drawings into a navigable document.",
      },
    ];
  }

  const categoryLabel = getCategoryLabel(tutorial.category);
  const conceptA = tutorial.key_concepts?.[2];
  const conceptB = tutorial.key_concepts?.[0];
  const conceptC = tutorial.key_concepts?.[4];

  return [
    {
      value: "source",
      label: "Source",
      title: "Reference and dimensions",
      body: `The process starts before any drafting happens, with a reference image that carries enough visual clarity and dimensional information to guide the work accurately.`,
      detail:
        conceptA?.content ||
        "Bring in a clear reference image that includes enough visual information and dimensions to support accurate tracing later.",
    },
    {
      value: "draw",
      label: "Draw",
      title: "Polyline construction",
      body: `From there, the tutorial treats the polyline tool as a precise construction method, moving between vertex types to build the profile with intention rather than approximation.`,
      detail:
        conceptB?.content ||
        "Move through the profile with deliberate vertex choices instead of treating the trace like a single undifferentiated line.",
    },
    {
      value: "reuse",
      label: "Reuse",
      title: `${categoryLabel} asset building`,
      body: `The payoff is not just a finished detail but a reusable drafting asset: scaled correctly, classed properly, and ready to return across future drawing sets.`,
      detail:
        conceptC?.content ||
        "Turn the finished profile into something repeatable so it becomes part of the drawing system rather than a one-off sketch.",
    },
  ];
};

const getArticleLead = (tutorial: any) => {
  if (tutorial.slug === "understanding-symbols") {
    return "Symbols become useful the moment a drawing needs repetition, consistency, or controlled change. This lesson stays with 2D symbol behavior: how symbols are identified, placed, scaled, edited, and interpreted inside the drafting workflow.";
  }

  if (tutorial.slug === "understanding-design-layers") {
    return "Design layers are less about software settings than drawing clarity. They let one file hold several kinds of information at once without forcing every discipline, view, and reference into the same visual plane.";
  }

  if (tutorial.slug === "2d-edit-modify-tricks") {
    return "Efficient 2D drafting often comes down to knowing how to change geometry that already exists. Mirror, reshape, offset, split, connect, combine, and the Modify commands all support the same larger habit: edit the drawing with intention instead of redrawing every shape from the beginning.";
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return "This lesson is really about what makes a drawing legible once it leaves the design layer. Viewports, labels, dimensions, markers, and detail callouts are not separate tricks here. They are the pieces that turn modeled or drafted information into a sheet someone else can actually read.";
  }

  const cleanedTitle = tutorial.title
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/^Vectorworks Quick Tip:\s*/i, "")
    .trim()
    .toLowerCase();

  return `What makes this lesson useful is that it frames ${cleanedTitle} as a repeatable scenic drafting habit rather than a one-off software trick. The video is brief, but the method behind it is larger: gather better references, trace with more intention, and turn the result into something your future drawings can reuse.`;
};

const getArticleBodySections = (tutorial: any) => {
  if (tutorial.slug === "understanding-design-layers") {
    return [
      {
        number: "01",
        title: "A design layer is a way to separate information without breaking the drawing apart",
        paragraphs: [
          "The most useful comparison in the lesson is also the simplest: design layers behave like stacked sheets of vellum. That analogy keeps the concept grounded in drawing practice rather than software vocabulary. Architecture can live on one layer, scenic information on another, and lighting on another, each one visible when needed and absent when it gets in the way.",
          "What makes that useful in scenic drafting is not just cleanliness. It is the ability to work on one part of the drawing while keeping the rest of the project available as reference. A layered file does not scatter information across separate documents. It organizes complexity inside a single coordinated environment.",
        ],
        support: {
          eyebrow: "Section note",
          title: "Separate the systems, keep the context",
          body: "Design layers are valuable because they let the drawing stay whole while different disciplines remain legible and manageable.",
        },
      },
      {
        number: "02",
        title: "Visibility and stacking order change what the drawing can tell you",
        paragraphs: [
          "The Pajama Game example gives the lesson its practical center. By changing design layer visibility in the Navigation palette and shifting into an isometric view, the tutorial shows how a file can reveal or hide architecture so the scenic information becomes easier to read. That is a simple action, but it changes the user’s relationship to the drawing: layers become a way to ask better visual questions.",
          "Stacking order matters for the same reason. When two layers overlap, the one higher in the stack reads in front. The circle demonstration in the blank file makes that easy to see. It turns stacking from an abstract list in the palette into a visible rule that shapes what appears dominant in the drawing.",
        ],
        support: {
          eyebrow: "Key move",
          title: "Use order to control clarity",
          body: "A visibility change hides distraction. A stacking change changes emphasis. Both are part of reading the file, not just managing it.",
        },
      },
      {
        number: "03",
        title: "Good layer habits make the file easier to trust later",
        paragraphs: [
          "The final portion of the tutorial is quieter, but it is where the long-term workflow lives. Layers are renamed with consistent conventions, created at matching scales, and arranged so related information behaves predictably. Those moves do not feel dramatic in the moment, yet they are what keep a file coherent after revisions and collaboration begin.",
          "The lesson also makes a practical recommendation through the layer options. Gray/Snap Others and Show/Snap Others are not cosmetic preferences. They shape how safely the user can draft while still referencing surrounding information. The warning about Show/Snap/Modify Others points to the larger rule underneath the page: keep access open, but keep authorship clear.",
        ],
        support: {
          eyebrow: "Larger takeaway",
          title: "Build the layer system early",
          body: "A well-named, consistently scaled layer structure is easier to navigate, easier to revise, and much less likely to create confusion later in production.",
        },
      },
    ];
  }

  if (tutorial.slug === "creating-trim-profiles-polyline") {
    return [
      {
        number: "01",
        title: "Begin with material that can tell the truth",
        paragraphs: [
          "The strongest move in this lesson happens before Vectorworks does anything at all. Rather than sketching a molding profile from memory or tracing an image with no dimensional anchor, the tutorial begins with a manufacturer listing that contains both the profile image and the actual measurements. That small choice changes the entire quality of the drawing.",
          "In scenic drafting, reference is not just inspiration. It is evidence. When the source image already carries product information, size, and a clean silhouette, the trace becomes more than a visual approximation. It becomes the beginning of a dependable drafting asset.",
        ],
        support: {
          eyebrow: "Section note",
          title: "Why the source matters",
          body: "A reference image with dimensions collapses two separate problems into one usable starting point: form and scale arrive together, so the drawing can move forward with less guesswork.",
        },
      },
      {
        number: "02",
        title: "Trace for shape first, not scale",
        paragraphs: [
          "The central idea of the tutorial is simple and worth emphasizing: draw the profile cleanly first, then scale it afterward. Many users try to resize the reference image before they begin tracing, but that adds friction at the wrong stage of the process. It asks for precision before the form itself has been resolved.",
          "By tracing the profile at a comfortable size, the work can stay focused on line quality, curve behavior, and the transition between sharp and soft points. The polyline tool becomes useful here not because it is flashy, but because it allows the geometry to be built deliberately. Corner vertices, arc behavior, and later point adjustments all support the real task, which is to make the profile read accurately before worrying about exact dimension.",
        ],
        support: {
          eyebrow: "Key move",
          title: "Resolve geometry before scale",
          body: "The video’s smartest lesson is a sequencing lesson: first make the profile believable, then make it accurate. Reversing that order usually creates more work.",
        },
      },
      {
        number: "03",
        title: "Turn the drawing into a reusable library part",
        paragraphs: [
          "Once the trace is resolved, the tutorial shifts from drafting to system-building. The profile is assigned to the correct class, scaled through the Object Info palette using the manufacturer dimensions, and then converted into a 2D symbol. That final step is what makes the process valuable beyond a single sheet.",
          "A scenic workflow improves when common details stop being redrawn from scratch. A trim profile that lives in the Resource Manager can come back across projects, stay consistent inside documentation, and remain editable when the drawing package changes. The larger habit is building a library of dependable parts rather than a file full of isolated solutions.",
        ],
        support: {
          eyebrow: "Larger takeaway",
          title: "Build the library, not just the sheet",
          body: "This is where the page moves past a quick tip. The trim profile matters, but the more important habit is turning solved details into reusable drawing components.",
        },
      },
    ];
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return [
      {
        number: "01",
        title: "The sheet layer is where the drawing becomes readable",
        paragraphs: [
          "What this tutorial clarifies immediately is that annotation is not an afterthought. Before any dimensions are added, the drawing has to be placed in the right context. That begins with viewports. Instead of moving geometry onto the sheet manually, the lesson builds a set of viewports from existing design-layer content and lets the sheet become the place where representation is organized.",
          "That distinction matters. A sheet is not just a container for drawings. It is the first place where hierarchy becomes visible. Which view gets the most space, how the drawings align, and how the labels read across the page all shape whether the document feels coherent or improvised.",
        ],
        support: {
          eyebrow: "Section note",
          title: "Compose before annotating",
          body: "Build the sheet as a composition first, then layer annotation onto something already organized.",
        },
      },
      {
        number: "02",
        title: "Dimensions only make sense inside the correct scale",
        paragraphs: [
          "The strongest teaching moment in the video is the comparison between annotating inside and outside the viewport. The same line can read as ten feet in one context and five inches in another. That is not a minor software quirk. It is the core reason annotation belongs inside the viewport’s own scale environment.",
          "From there, the lesson becomes less about clicking tools and more about drawing discipline. Drawing labels need room to breathe. Dimension strings need to be offset clearly. Constrained chain mode matters because it supports the rhythm of documentation, not just efficiency for its own sake. Annotations are useful when they clarify the drawing, not when they simply accumulate on top of it.",
        ],
        support: {
          eyebrow: "Key move",
          title: "Annotate at the presented scale",
          body: "The viewport annotation mode is where measurements, labels, and notes stop being abstract data and start becoming communication.",
        },
      },
      {
        number: "03",
        title: "A finished sheet is a network of references",
        paragraphs: [
          "By the end of the tutorial, the sheet is doing several jobs at once. It shows viewports aligned on a grid, dimensions that read cleanly, drawing labels that identify each view, section markers that point to related drawings, and details that enlarge the moments that need more attention. What emerges is not a collection of separate commands but a linked document.",
          "That is the larger takeaway worth expanding in the article. Good annotation is not only about adding more information. It is about making information easier to navigate. Section markers, detail viewports, and publish sets all reinforce the same idea: a drawing package should help someone move through the work without guessing where to look next.",
        ],
        support: {
          eyebrow: "Larger takeaway",
          title: "Build navigation into the drawing",
          body: "The sheet becomes more professional when every label, marker, and detail helps the reader move confidently from one drawing to the next.",
        },
      },
    ];
  }

  if (tutorial.slug === "understanding-symbols") {
    return [
      {
        number: "01",
        title: "A 2D symbol is useful because it separates repetition from redrawing",
        paragraphs: [
          "The lesson stays with 2D symbols and makes clear how they behave when they are stored, placed, and reused in a drafting context. Instead of treating symbols as a vague library concept, the tutorial shows them as working drawing objects that carry repeatable information from one placement to the next.",
          "Once a drawing starts to repeat scenic units, graphic elements, or common details, a 2D symbol becomes less like a convenience and more like infrastructure. It preserves the logic of the original object while making placement faster and revisions more predictable.",
        ],
        support: {
          eyebrow: "Section note",
          title: "The lesson is about 2D symbol behavior",
          body: "The core idea is simple: understand what the symbol is, how it is coded in the Resource Manager, and what kind of object it becomes when it is placed.",
        },
      },
      {
        number: "02",
        title: "The instance and the definition are not the same thing",
        paragraphs: [
          "The strongest distinction in the lesson is between a placed instance and the symbol definition itself. A symbol can be scaled from the Object Info Palette and that scaling changes the instance in the drawing, not the geometry inside the symbol definition. The original stays intact.",
          "That is where many beginners get turned around. If the goal is to change every occurrence, the definition must be edited. If the goal is to change only one placed occurrence, then the instance is the place to work. Duplicating a symbol, editing the definition, and watching both placed symbols update makes the difference visible.",
        ],
        support: {
          eyebrow: "Key move",
          title: "Edit the right level",
          body: "Scaling, editing, and duplicating all mean different things depending on whether you are working on the instance or the definition.",
        },
      },
      {
        number: "03",
        title: "Symbol behavior depends on the kind of symbol you place",
        paragraphs: [
          "Grouped symbols, unit-based symbols, and page-based symbols all behave differently because they are meant for different environments. A grouped symbol becomes an independent group when it is placed. A unit-based symbol behaves in world units. A page-based symbol responds to page scale and is therefore much better suited to sheet-layer documentation.",
          "What makes this section useful is that it prevents 2D symbols from being treated as one universal object type. The real question is where the symbol belongs and how it is expected to behave once it gets there. That is why a page-based symbol can feel oversized on a design layer but correct on a sheet layer. The symbol is not wrong. The context is.",
        ],
        support: {
          eyebrow: "Larger takeaway",
          title: "Match behavior to context",
          body: "The useful distinction is not a catalog of symbol families. It is understanding how 2D symbols change behavior across drawing contexts.",
        },
      },
    ];
  }

  return [];
};

const tutorialNoticeMap: Record<string, string> = {
  "creating-2d-drafting-from-3d":
    "Notice how the model becomes a drawing only after view, render mode, section cut, detail scale, and annotations decide what the reader should see.",
  "creating-camera-rendering":
    "Notice how lighting, camera framing, viewport rendering, sheet setup, and export resolution stack into one image-making pipeline.",
  "modeling-a-table":
    "Notice how reference scale, traced leg profiles, solid edits, texture direction, and symbol behavior all have to agree before the table reads as scenery.",
  "creating-24x36-pdfs":
    "Notice how the export problem starts with page definition. The goal is to move from tiled letter-size output to one clean Arch D drawing sheet.",
  "3d-modeling-tools":
    "Notice whether each command edits the primitive, a face, an edge, an extracted surface, or the whole solid. Tool choice starts with the part of the object that needs to change.",
  "basics-of-textures":
    "Notice how texture scale, mapping type, shader settings, face assignment, and lighting all decide whether a material reads as attached to the model.",
  "hybrid-symbols":
    "Notice the difference between a 3D object that looks right in perspective and a Top/Plan graphic that reads clearly in drafting.",
  "3d-modeling-basics":
    "Notice how flat profiles become volume through command order, selection order, Z height, stacking order, and path direction.",
  "2d-annotations-dimensioning":
    "Pay attention to when the workflow moves into viewport annotations. The same graphic information behaves differently depending on the scale context in which it is edited.",
  "understanding-symbols":
    "Notice how symbol identity separates from placed-symbol behavior. Vectorworks treats definitions, instances, grouped symbols, and page-based objects differently.",
  "resource-manager-basics":
    "Notice whether you are browsing a file, a resource type, or an imported copy. Resource management starts with knowing where the object actually lives.",
  "2d-edit-modify-tricks":
    "Watch for the difference between tools that transform geometry, tools that edit geometry, and commands that reorganize geometry.",
  "sheet-layers":
    "Notice how the source drawing stays in the design layer while crop, viewport, scale, label, and title block decisions happen on the sheet.",
  "basics-tool-palette":
    "Notice how tool modes change the same tool into different drafting behaviors. The mode bar is part of the command, not decoration.",
  "installing-workspace-template":
    "Notice the path discipline: user folder, workspace folder, application restart, and template verification each prevent a different setup failure.",
  "understanding-design-layers":
    "Watch how often a layer action changes what becomes readable. Visibility, stacking order, and layer options all manage attention inside a dense drawing.",
  "understanding-classes":
    "Notice how classes control appearance and visibility without moving geometry. Layers organize where drawing systems live; classes control how objects read.",
  "navigating-user-interface":
    "Notice how each interface area answers a practical drafting question: where to draw, what is selected, where resources live, and how the model is oriented.",
  "creating-trim-profiles-polyline":
    "Notice the order of operations: source the profile, trace the shape cleanly, scale the finished geometry, then save it as a reusable 2D symbol.",
};

const getWhatToNotice = (tutorial: any) => {
  return tutorialNoticeMap[tutorial.slug] || "Notice how a single action becomes a broader drafting habit. The value is usually in the sequencing, not just the command itself.";
};

const getWhyItMatters = (tutorial: any) => {
  if (tutorial.slug === "understanding-design-layers") {
    return {
      title: "Why design layers matter",
      paragraphs: [
        "Design layers make a file more useful because they separate systems without forcing the project to fragment into disconnected drawings. Architecture, scenery, and lighting can each stay readable while still informing one another.",
        "That becomes especially important in scenic work, where files often need to support multiple views, multiple collaborators, and multiple rounds of revision. A clear layer structure reduces mistakes, improves navigation, and makes it easier to focus on the part of the drawing that actually needs attention.",
      ],
    };
  }

  if (tutorial.slug === "understanding-symbols") {
    return {
      title: "Why symbols matter",
      paragraphs: [
        "Symbols make a drawing more manageable because they turn repeated geometry into something that can be edited, placed, and organized with intention. Instead of duplicating raw objects everywhere, the drawing begins to rely on reusable definitions.",
        "That becomes especially important when revisions arrive. A symbol-based workflow makes it easier to preserve consistency, compare placed instances, and decide whether a change belongs to one occurrence or to the whole set of objects that share the same definition.",
      ],
    };
  }

  if (tutorial.slug === "2d-edit-modify-tricks") {
    return {
      title: "Why these tools matter",
      paragraphs: [
        "A good 2D drafting workflow depends less on drawing everything from scratch and more on knowing how to transform, edit, and reorganize geometry cleanly. Mirror, Reshape, Offset, Split, Connect, and the Modify commands all reduce friction in different ways, but they are most useful when understood as decisions about form rather than as isolated tricks.",
        "That is what makes this tutorial stronger than a simple tool tour. It frames editing as part of design thinking. Instead of redrawing a shape every time the drawing changes, the page can support a more flexible approach: alter what exists, preserve what is useful, and choose the command that gets the geometry closer to the actual drafting problem.",
      ],
    };
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return {
      title: "Why this matters in practice",
      paragraphs: [
        "Sheets are judged less by how much information they contain than by how clearly that information can be read. A viewport, label, marker, and dimension string only become useful when they work together to direct attention and reduce confusion.",
        "That is why annotation belongs in the same conversation as composition. The goal is not just adding tools to a sheet. It is building drawings that other people can navigate quickly and trust.",
      ],
    };
  }

  return null;
};

const getExamQuestions = (tutorial: any) => {
  if (tutorial.slug === "understanding-design-layers") {
    return [
      {
        prompt: "What is the main conceptual comparison used in the tutorial to explain design layers?",
        choices: [
          "A set of folders in the Resource Manager",
          "A stack of drafting sheets or vellum",
          "A series of viewports on a sheet layer",
          "A collection of classes assigned to one object",
        ],
      },
      {
        prompt: "Where does the tutorial direct the user to manage design layers in Vectorworks?",
        choices: [
          "The Object Info Palette",
          "The Attributes Palette",
          "The Navigation palette",
          "The Resource Manager only",
        ],
      },
      {
        prompt: "What does changing the stacking order of design layers affect?",
        choices: [
          "Which layers export to PDF",
          "Which layer names appear in bold",
          "Which overlapping elements appear in front",
          "Whether classes can be edited",
        ],
      },
      {
        prompt: "Why does the tutorial emphasize keeping all design layers at the same scale?",
        choices: [
          "So the file can work in unison",
          "So every layer defaults to sheet-layer size",
          "So symbols automatically become page-based",
          "So the Navigation palette can sort layers alphabetically",
        ],
      },
      {
        prompt: "Which layer option does the tutorial recommend as the most reliable default working mode?",
        choices: [
          "Show Others",
          "Gray/Snap Others",
          "Show/Snap/Modify Others",
          "Active Only",
        ],
      },
    ];
  }

  if (tutorial.slug === "understanding-symbols") {
    return [
      {
        prompt: "Which statement best describes the difference between a symbol instance and a symbol definition?",
        choices: [
          "A symbol instance exists only in the Resource Manager, while a symbol definition exists only on sheet layers",
          "A symbol instance is a placed occurrence, while the definition is the original reusable object data behind it",
          "A symbol instance can only be edited after it has been converted into a group",
          "A symbol instance can be edited globally, while a definition affects only one placement",
        ],
      },
      {
        prompt: "Why does scaling a symbol from the Object Info Palette not change the original symbol geometry?",
        choices: [
          "Because scaling affects the placed instance rather than the definition",
          "Because Vectorworks locks all symbol definitions by default",
          "Because only grouped symbols can be scaled",
          "Because 2D symbols cannot be edited after placement",
        ],
      },
      {
        prompt: "What does blue text for a symbol name in the Resource Manager indicate?",
        choices: [
          "The symbol is grouped and converts to a group on placement",
          "The symbol is page-based",
          "The symbol is a standard symbol that updates all instances automatically",
          "The symbol is locked from further editing after placement",
        ],
      },
      {
        prompt: "When is a page-based symbol typically most appropriate?",
        choices: [
          "When drafting scaled scenery on a design layer",
          "When creating documentation elements intended for sheet layers",
          "When converting a symbol into a group automatically",
          "When using asymmetric scaling on 2D geometry",
        ],
      },
      {
        prompt: "What is the main reason to edit the symbol definition instead of editing one placed symbol directly?",
        choices: [
          "To avoid using the Resource Manager",
          "To ensure the selected instance becomes a grouped symbol",
          "To push a change across all linked instances of that symbol",
          "To make the placed instance ignore page scale",
        ],
      },
    ];
  }

  if (tutorial.slug === "2d-edit-modify-tricks") {
    return [
      {
        prompt: "Which tool is most appropriate when you need to create a reflected copy while keeping the original object in place?",
        choices: [
          "Mirror Tool in Standard mode",
          "Mirror Tool in Duplicate mode",
          "Offset Tool in Offset Original mode",
          "Dual Object Combine mode",
        ],
      },
      {
        prompt: "What is the main advantage of using the Reshape Tool instead of redrawing a polygon from scratch?",
        choices: [
          "It automatically assigns classes to the object",
          "It allows direct adjustment of vertices and edges on existing geometry",
          "It converts open polylines into symbols",
          "It distributes duplicates along a path",
        ],
      },
      {
        prompt: "Which statement best distinguishes Offset Distance Mode from Offset by Points Mode?",
        choices: [
          "Distance Mode works only on polygons, while Points Mode works only on lines",
          "Distance Mode uses a numerical offset value, while Points Mode allows more visual placement",
          "Distance Mode deletes the original object, while Points Mode always duplicates it",
          "Distance Mode is part of the Modify menu, while Points Mode is part of the Reshape Tool",
        ],
      },
      {
        prompt: "After using Split Tool in Trim mode, which follow-up action may be necessary for the resulting shape?",
        choices: [
          "Convert it to a viewport",
          "Add a drawing label",
          "Close the polyline in the Object Info Palette",
          "Use Duplicate Along Path",
        ],
      },
      {
        prompt: "Why might a drafter choose Dual Object Combine instead of Dual Object Connect?",
        choices: [
          "To keep both lines as separate entities",
          "To merge the lines into a single polygonal result",
          "To offset both lines by the same distance",
          "To place the object on a sheet layer automatically",
        ],
      },
    ];
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return [
      {
        prompt: "Why should dimensions typically be added inside viewport annotation mode rather than outside the viewport?",
        choices: [
          "Because dimensions can only be printed from annotation mode",
          "Because annotation mode reflects the viewport scale correctly",
          "Because sheet layers do not support labels outside viewports",
          "Because grid snap is disabled outside viewports",
        ],
      },
      {
        prompt: "What is the main purpose of using Grid Snap while laying out viewports on a sheet layer?",
        choices: [
          "To constrain dimensions to horizontal and vertical axes",
          "To align viewports more precisely and consistently",
          "To force all viewports to use the same crop size",
          "To regenerate drawing labels automatically",
        ],
      },
      {
        prompt: "Which label length mode is described as useful when a drawing label needs to extend more deliberately across the drawing?",
        choices: [
          "Fixed",
          "Constrained",
          "Control Point",
          "Viewport Crop",
        ],
      },
      {
        prompt: "What is the key benefit of switching from Constrained Linear mode to Constrained Chain mode before dimensioning?",
        choices: [
          "It enables continuous dimensioning after the first dimension",
          "It creates angular dimensions automatically",
          "It changes the viewport scale to full size",
          "It regenerates section markers as you draw",
        ],
      },
    ];
  }

  return [];
};

const getComparisonRows = (tutorial: any) => {
  if (tutorial.slug !== "understanding-symbols") return [];

  return [
    {
      term: "2D symbol",
      meaning: "A symbol containing 2D geometry, marked with a '2' in the Resource Manager.",
      use: "Use this for plan views, elevations, and other 2D documentation elements.",
      accent: "Standard behavior",
    },
    {
      term: "Symbol definition",
      meaning: "The original reusable object stored in the Resource Manager.",
      use: "Edit this when every linked occurrence should update.",
      accent: "Global change",
    },
    {
      term: "Symbol instance",
      meaning: "A placed occurrence of the symbol inside the drawing.",
      use: "Adjust this when you only need a local placement or scale change.",
      accent: "Local change",
    },
    {
      term: "Grouped or page-based symbol",
      meaning: "A 2D symbol whose behavior changes on placement or by page scale.",
      use: "Use these when independence or sheet-layer sizing matters more than standard linked behavior.",
      accent: "Blue or green in the Resource Manager",
    },
  ];
};

const getDecisionGuide = (tutorial: any) => {
  if (tutorial.slug !== "understanding-symbols") return [];

  return [
    {
      title: "Use a standard symbol",
      body: "When the object will repeat and should stay linked across the drawing.",
    },
    {
      title: "Use a grouped symbol",
      body: "When placement should start from a reusable object but each copy should become independent after it lands.",
    },
    {
      title: "Use a page-based symbol",
      body: "When the object belongs to documentation and should size itself by sheet scale rather than real-world units.",
    },
  ];
};

const getInstanceDefinitionExample = (tutorial: any) => {
  if (tutorial.slug !== "understanding-symbols") return null;

  return {
    title: "How symbol edits and instance edits differ",
    steps: [
      "Place the same symbol twice in the drawing.",
      "Edit the symbol definition and change one visible attribute, such as the inner fill color.",
      "Both placed symbols update because they are linked to the same definition.",
      "Then scale only one placed symbol from the Object Info Palette.",
      "That single instance changes size, but the original definition remains the same.",
    ],
  };
};

const getScenicUseParagraphs = (tutorial: any) => {
  if (tutorial.slug !== "understanding-symbols") return [];

  return [
    "In scenic drafting, symbols matter because so many elements repeat: trim conditions, graphic labels, stock units, platforms, masking pieces, and standard scenic details. Once those elements become symbols, the drawing gains consistency without losing flexibility.",
    "That consistency becomes especially valuable when revisions arrive. A change made to the definition can ripple across the drawing where appropriate, while scaled or repositioned instances can still respond to local needs. The result is not just cleaner drafting, but a system that is easier to revise under production pressure.",
  ];
};

type LessonEnhancementContent = {
  eyebrow: string;
  title: string;
  body: string;
  items: Array<{
    label: string;
    title: string;
    body: string;
  }>;
};

const lessonEnhancements: Record<string, LessonEnhancementContent> = {
  "creating-2d-drafting-from-3d": {
    eyebrow: "Model to drawing",
    title: "The 3D model becomes useful when the viewport authors the view.",
    body: "Construction drafting is not a screenshot of the model. View, render mode, section cut, line weight, detail scale, and annotation all decide how the model communicates.",
    items: [
      {
        label: "VIEWPORT",
        title: "Frame the model without moving it",
        body: "A sheet-layer viewport controls view, scale, crop, and drawing title while the model stays in the design layer.",
      },
      {
        label: "SECTION",
        title: "Cut only where the drawing needs evidence",
        body: "Section viewports expose wall thickness, trim relationships, and construction logic that a plan view cannot explain alone.",
      },
      {
        label: "DETAIL",
        title: "Increase scale where the reader needs precision",
        body: "A detail viewport lets the same model support a larger trim or construction moment without redrawing the source geometry.",
      },
    ],
  },
  "creating-camera-rendering": {
    eyebrow: "Render pipeline",
    title: "A rendering is staged before it is exported.",
    body: "A theatrical rendering is built in sequence: light the object, frame it through a camera, render it through a viewport, then export the sheet at the right resolution.",
    items: [
      {
        label: "LIGHT",
        title: "Start with a readable lighting condition",
        body: "Spotlights and colored point lights shape the object before the camera ever becomes useful.",
      },
      {
        label: "CAMERA",
        title: "Compose through the camera, not around it",
        body: "A 16:9 camera and walkthrough framing turn the model into an intentional image.",
      },
      {
        label: "EXPORT",
        title: "Check the sheet before saving the image",
        body: "The viewport, Renderworks style, page area, and export resolution all affect the final file students hand off.",
      },
    ],
  },
  "modeling-a-table": {
    eyebrow: "Furniture modeling",
    title: "Reference, 2D drafting, solid modeling, and texture mapping have to agree.",
    body: "The table is not just a polished product render. It is a scenic modeling workflow where proportions, leg curves, solid history, and wood grain all affect whether the object reads correctly.",
    items: [
      {
        label: "REFERENCE",
        title: "Correct the scale before the model inherits the mistake",
        body: "The oversized reference image becomes useful only after the table is brought back to a plausible real-world dimension.",
      },
      {
        label: "LEG",
        title: "Build the curved leg as a sequence",
        body: "Trace, sweep, mirror, add solid, and fillet each solve a different part of the furniture form.",
      },
      {
        label: "GRAIN",
        title: "Map texture direction like a material decision",
        body: "Wood grain on posts, supports, and the tabletop should follow the object, not simply cover it.",
      },
    ],
  },
  "creating-24x36-pdfs": {
    eyebrow: "PDF output",
    title: "Large-format export is a setup problem, not a plotter problem.",
    body: "The useful move is to stop Vectorworks from thinking in letter-size tiles and publish the Arch D sheet as one complete printable page.",
    items: [
      {
        label: "PAGE",
        title: "Unlock the 24 x 36 sheet size",
        body: "Page Setup has to stop choosing only available printer sizes before Arch D can behave like the drawing size.",
      },
      {
        label: "TILES",
        title: "Read page breaks as a warning, not a goal",
        body: "The tiled letter-size preview explains the problem the export settings need to solve.",
      },
      {
        label: "PUBLISH",
        title: "Export the whole printable area",
        body: "The final PDF should be one sheet, not a patchwork of small pages.",
      },
    ],
  },
  "3d-modeling-tools": {
    eyebrow: "Tool choice",
    title: "Choose the tool by the part of the object you need to edit.",
    body: "The important question is not which 3D tool looks impressive. It is whether the next move changes a primitive, a face, an edge, a surface, or the volume of the solid.",
    items: [
      {
        label: "PRIMITIVE",
        title: "Start with the closest base object",
        body: "Box, cylinder, sphere, pyramid, cone, and frustum primitives create editable starting points rather than finished designs.",
      },
      {
        label: "FACE",
        title: "Edit the surface when the volume is close",
        body: "Push/Pull, taper, deform, and shell operations make more sense when the object already has a useful face to work from.",
      },
      {
        label: "EDGE",
        title: "Use edge tools to tune the condition",
        body: "Fillet and chamfer are not decoration. They decide how a modeled corner catches light and reads in drawing views.",
      },
    ],
  },
  "basics-of-textures": {
    eyebrow: "Texture lab",
    title: "A texture reads well only when mapping, scale, shader, and light agree.",
    body: "Wood, glass, stone, marble, reflectivity, transparency, bump, and mapping only become readable when they are tested on actual geometry under light.",
    items: [
      {
        label: "MAP",
        title: "Choose mapping for the object shape",
        body: "Plane, auto-align, perimeter, sphere, and cylinder mapping change how the same material wraps the model.",
      },
      {
        label: "SHADER",
        title: "Edit the material, not just the image",
        body: "Color, reflectivity, transparency, and bump settings control how the surface reacts in Renderworks.",
      },
      {
        label: "LIGHT",
        title: "Use light to reveal material behavior",
        body: "Gloss, glass, and bump need lighting before students can judge whether the texture is working.",
      },
    ],
  },
  "hybrid-symbols": {
    eyebrow: "Hybrid symbol",
    title: "A hybrid symbol is a view-aware scenic asset.",
    body: "The drafting payoff comes from separating the 3D object, the raw Top/Plan wireframe, and the clean 2D component that actually belongs on a sheet.",
    items: [
      {
        label: "3D",
        title: "Keep the model useful for perspective and sections",
        body: "The table remains a 3D object where the model view needs depth and form.",
      },
      {
        label: "2D",
        title: "Author the Top/Plan drawing intentionally",
        body: "Manual tracing can create cleaner plan graphics than automatic hidden-line generation for complex models.",
      },
      {
        label: "CLASS",
        title: "Use lineweight and classing as part of the symbol",
        body: "The 2D component should read like drafting, not like a flattened accident from the model.",
      },
    ],
  },
  "3d-modeling-basics": {
    eyebrow: "Modeling grammar",
    title: "2D profiles become volume through command order.",
    body: "Plane, Z height, selection order, stacking order, path direction, and profile location all change the model the command produces.",
    items: [
      {
        label: "PROFILE",
        title: "Start with the 2D shape that defines the volume",
        body: "Extrude, sweep, multiple extrude, and tapered extrude all begin with readable 2D geometry.",
      },
      {
        label: "ORDER",
        title: "Selection order changes solid operations",
        body: "Add, subtract, intersect, and section solids depend on which object is selected and how the cut is directed.",
      },
      {
        label: "PATH",
        title: "Centerline and path direction matter",
        body: "Extrude Along Path behaves best when the profile and path are positioned with intent.",
      },
    ],
  },
  "2d-annotations-dimensioning": {
    eyebrow: "Sheet navigation",
    title: "Annotation is the navigation system of the sheet.",
    body: "Dimensions, labels, section markers, callouts, and detail viewports only work when they live in the correct scale context and help the reader move through the drawing.",
    items: [
      {
        label: "SCALE",
        title: "Dimension inside the viewport",
        body: "The same graphic can measure differently outside the viewport, so annotation mode is part of accuracy.",
      },
      {
        label: "STRING",
        title: "Build dimension strings that read as structure",
        body: "Chain dimensions clarify openings, wall lengths, and overall spans when they are offset with care.",
      },
      {
        label: "MARKERS",
        title: "Use markers to connect drawings",
        body: "Section markers and detail viewports turn one sheet into a readable drawing network.",
      },
    ],
  },
  "understanding-symbols": {
    eyebrow: "Symbol behavior",
    title: "A symbol is a behavior choice, not just a reusable object.",
    body: "2D symbols become easier to control when their Resource Manager color, placed-instance behavior, definition edits, grouped behavior, and page-based scale are read as separate decisions.",
    items: [
      {
        label: "BLACK",
        title: "Standard symbol",
        body: "A linked symbol instance can update when the definition changes.",
      },
      {
        label: "BLUE",
        title: "Grouped symbol",
        body: "The symbol is reusable as a starting point, then becomes an independent group when placed.",
      },
      {
        label: "GREEN",
        title: "Page-based symbol",
        body: "The symbol belongs to documentation scale rather than model-world size.",
      },
    ],
  },
  "resource-manager-basics": {
    eyebrow: "Resource library",
    title: "The Resource Manager is the shop library for the file.",
    body: "A useful resource workflow starts by knowing where the item comes from, what type it is, how to filter it, and which edits affect only the current file.",
    items: [
      {
        label: "SOURCE",
        title: "Know which file or library you are browsing",
        body: "The File Browser and Resource Viewer answer different questions about where a resource lives.",
      },
      {
        label: "FILTER",
        title: "Search by type, not just by name",
        body: "Filtering for Renderworks textures keeps a broad search like glass from becoming noise.",
      },
      {
        label: "EDIT",
        title: "Edit the copy in the current file",
        body: "Imported resources can be adjusted locally without pretending the whole library has changed.",
      },
    ],
  },
  "2d-edit-modify-tricks": {
    eyebrow: "Command choice",
    title: "Choose the edit command by the geometry problem.",
    body: "The tools make more sense when they are organized around drafting needs: symmetry, offsets, cuts, joins, overlaps, transforms, composition, and repetition along a path.",
    items: [
      {
        label: "SYMMETRY",
        title: "Mirror when the drawing has an axis",
        body: "Standard and Duplicate modes answer whether the original should move or remain.",
      },
      {
        label: "CONTINUITY",
        title: "Split, connect, or combine based on the line problem",
        body: "The follow-up after a trim or split may be closing, composing, or combining geometry.",
      },
      {
        label: "REPEAT",
        title: "Use Duplicate Along Path when spacing matters",
        body: "Number, distance, offset, centering, and tangency turn repetition into settings.",
      },
    ],
  },
  "sheet-layers": {
    eyebrow: "Sheet space",
    title: "Sheet layers frame drawings without moving the source geometry.",
    body: "Sheet layers separate design-layer content from presentation: crops, viewports, scale, drawing labels, title blocks, and sheet metadata all belong to that shift.",
    items: [
      {
        label: "CROP",
        title: "Choose what the sheet should see",
        body: "A crop rectangle frames the design-layer information before it becomes a viewport.",
      },
      {
        label: "VIEWPORT",
        title: "Set scale and drawing identity",
        body: "The viewport carries drawing number, title, scale, and view relationship on the sheet.",
      },
      {
        label: "TITLE BLOCK",
        title: "Let metadata populate the border",
        body: "Title Block Manager makes the sheet title and number part of the document system.",
      },
    ],
  },
  "basics-tool-palette": {
    eyebrow: "Tool grammar",
    title: "The Basics palette is a drafting vocabulary, not a shortcut list.",
    body: "The Basics palette makes more sense when tools are grouped by drafting action: navigate, place reference points, draw geometry, create walls, and refine corners.",
    items: [
      {
        label: "LOCATE",
        title: "Use loci and axes to orient the drawing",
        body: "A point at 0,0 gives the file a clear reference before geometry accumulates.",
      },
      {
        label: "DRAW",
        title: "Choose the shape tool by the geometry needed",
        body: "Lines, rectangles, circles, arcs, polygons, and polylines each create a different kind of control.",
      },
      {
        label: "REFINE",
        title: "Fillet and chamfer finish the condition",
        body: "Corner treatment is part of drafting clarity, not decoration.",
      },
    ],
  },
  "installing-workspace-template": {
    eyebrow: "Standard setup",
    title: "A workspace install is production standardization.",
    body: "A reliable install depends on careful details: user folder location, Vectorworks preferences, restart behavior, workspace verification, and template opening all matter.",
    items: [
      {
        label: "FOLDER",
        title: "Select the top-level user folder",
        body: "The most common install mistake is pointing Vectorworks to the wrong nested folder.",
      },
      {
        label: "RESTART",
        title: "Restart before judging the install",
        body: "Workspace and template changes often need a clean application restart before they appear.",
      },
      {
        label: "VERIFY",
        title: "Run a small smoke test",
        body: "Confirm the workspace appears, palettes are placed, and the UTEP Basic template opens.",
      },
    ],
  },
  "understanding-design-layers": {
    eyebrow: "Layer logic",
    title: "Design layers let the file change focus without losing coordination.",
    body: "The Pajama Game example, vellum analogy, layer visibility, stacking order, and layer options all support the same skill: controlling what the drawing is allowed to say.",
    items: [
      {
        label: "VELLUM",
        title: "Separate systems as stacked planes",
        body: "Architecture, scenery, and lighting can share a project while staying visually independent.",
      },
      {
        label: "VISIBILITY",
        title: "Use visibility to ask better questions",
        body: "Showing, hiding, or graying layers changes what the drafter can focus on.",
      },
      {
        label: "OPTIONS",
        title: "Protect authorship while keeping context",
        body: "Gray/Snap Others and Show/Snap Others keep reference available without turning every layer into the active drawing.",
      },
    ],
  },
  "understanding-classes": {
    eyebrow: "Graphic standards",
    title: "Classes are visibility and attribute rules, not geometry containers.",
    body: "Layers hold drawing context. Classes control how objects look and whether they can be seen across views.",
    items: [
      {
        label: "HIERARCHY",
        title: "Use names to keep categories readable",
        body: "Hyphenated class names create a structure that can be scanned, filtered, and taught.",
      },
      {
        label: "ATTRIBUTES",
        title: "Let Use at Creation carry the standard",
        body: "Line weight, fill, texture, and line type become class behavior instead of memory work.",
      },
      {
        label: "GROUPS",
        title: "Grouped objects still keep class behavior",
        body: "A group can contain objects that respond differently when class visibility changes.",
      },
    ],
  },
  "navigating-user-interface": {
    eyebrow: "Workspace map",
    title: "The interface is spatial orientation for scenic drafting.",
    body: "The interface becomes useful when each area answers a drafting question: where to draw, what is selected, how to inspect it, and how to stay oriented in the file.",
    items: [
      {
        label: "CREATE",
        title: "Tool palettes answer what you can draw",
        body: "The Basic palette and Tool Sets are the entry points for creating or modifying geometry.",
      },
      {
        label: "INSPECT",
        title: "Object Info tells you what is selected",
        body: "Size, position, class, and object-specific settings make the drawing measurable.",
      },
      {
        label: "ORIENT",
        title: "Origin and axes keep the model trustworthy",
        body: "Working near 0,0 and understanding X, Y, and Z keeps rendering and navigation from drifting.",
      },
    ],
  },
};

type TutorialDetailProps = {
  slug?: string;
  params?: {
    slug?: string;
  };
};

export default function TutorialDetail({ slug: slugProp, params }: TutorialDetailProps = {}) {
  const slug =
    slugProp ||
    params?.slug ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").filter(Boolean).pop() || ""
      : "");
  const tutorial = getLocalTutorialBySlug(slug);
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeExamQuestion, setActiveExamQuestion] = useState(0);

  const articleBlueprint = tutorial ? getTutorialArticleBlueprint(tutorial.slug) : null;
  const overviewParagraphs = tutorial
    ? articleBlueprint?.overview || getArticleOverviewParagraphs(tutorial)
    : [];
  const error = !tutorial && !!slug;

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <h1 className="font-sans text-[2.5rem] font-medium tracking-[-0.05em] text-foreground">
              Tutorial not found
            </h1>
            <Link
              href="/studio/tutorials"
              className="mt-6 inline-flex items-center gap-2 text-[0.98rem] font-medium text-foreground/68 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tutorials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeId(tutorial.video_url);
  const tutorialThumbnail =
    getYouTubeThumbnail(tutorial.video_url || "") ||
    `https://img.youtube.com/vi/${videoId || ""}/hqdefault.jpg`;
  const tutorialSummary = articleBlueprint?.summary || getTutorialSummary(tutorial);
  const tutorialPublishedAt = tutorial.published_at || tutorial.created_at || tutorial.updated_at;
  const structuredUploadDate =
    tutorialPublishedAt || "1970-01-01T00:00:00.000Z";
  const pageUrl = `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug}`;
  const tutorialTagNames = (tutorial.tags || []).map((tag: any) => tag.name).filter(Boolean);
  const tutorialKeywords = [
    tutorial.title,
    getCategoryLabel(tutorial.category),
    getDifficultyLabel(tutorial.difficulty),
    "Vectorworks tutorial",
    "scenic design tutorial",
    ...tutorialTagNames,
  ]
    .filter(Boolean)
    .join(", ");
  const articleLead = articleBlueprint?.lead || getArticleLead(tutorial);
  const articleBodySections = articleBlueprint?.sections || getArticleBodySections(tutorial);
  const featureMoments = articleBlueprint?.readingPath || getFeatureMoments(tutorial);
  const whatToNotice = getWhatToNotice(tutorial);
  const whyItMatters = getWhyItMatters(tutorial);
  const examQuestions = articleBlueprint?.examQuestions || getExamQuestions(tutorial);
  const comparisonRows = getComparisonRows(tutorial);
  const decisionGuide = getDecisionGuide(tutorial);
  const instanceDefinitionExample = getInstanceDefinitionExample(tutorial);
  const scenicUseParagraphs = getScenicUseParagraphs(tutorial);
  const primaryQuote =
    articleBlueprint?.quote ||
    tutorial.pro_tips?.[3] ||
    tutorial.pro_tips?.[0] ||
    "Trace first, then scale the geometry after the shape is resolved.";
  const relatedTutorialCards = useMemo(() => {
    const allTutorials = getLocalTutorials();

    return (tutorial.related_tutorials || [])
      .map((related: any) => {
        const match = allTutorials.find((item: any) => item.slug === related.slug);
        const tutorialCard = match || related;
        return {
          href: `/studio/tutorials/${related.slug}`,
          title: tutorialCard.title,
          category: tutorialCard.category,
          difficulty: tutorialCard.difficulty,
          duration: tutorialCard.duration,
          cover: getTutorialCoverImage(tutorialCard),
        };
      })
      .slice(0, 4);
  }, [tutorial]);
  const quickReferenceItems = (tutorial.shortcuts || []).slice(0, 3);

  const handleShare = async () => {
    const copied = await copyTextToClipboard(pageUrl);
    if (copied) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } else {
      setLinkCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${tutorial.title} | Brandon PT Davis`}
        description={tutorialSummary}
        image={tutorialThumbnail}
        type="article"
        publishedTime={tutorialPublishedAt ? new Date(tutorialPublishedAt).toISOString() : undefined}
        modifiedTime={tutorialPublishedAt ? new Date(tutorialPublishedAt).toISOString() : undefined}
        keywords={tutorialKeywords}
        url={pageUrl}
      />
      <StructuredData
        type="VideoObject"
        videoObject={{
          name: tutorial.title,
          description: tutorialSummary || undefined,
          thumbnailUrl: tutorialThumbnail,
          uploadDate: new Date(structuredUploadDate).toISOString(),
          embedUrl: `https://www.youtube.com/embed/${videoId || ""}`,
          contentUrl: `https://www.youtube.com/watch?v=${videoId || ""}`,
          publisher: {
            name: "Brandon PT Davis Design",
            logo: "https://www.brandonptdavis.com/favicon-32x32.png",
          },
        }}
      />
      <StructuredData
        type="HowTo"
        howTo={{
          name: tutorial.title,
          description: tutorialSummary || undefined,
          image: tutorialThumbnail,
          totalTime: tutorial.duration
            ? `PT${Math.max(1, Math.floor(Number(tutorial.duration) / 60))}M`
            : undefined,
          step: (tutorial.learning_objectives || []).map((objective: string, index: number) => ({
            name: objective,
            url: `${pageUrl}#step-${index + 1}`,
          })),
          tool: (tutorial.related_resources || []).map((resource: any) => ({
            name: resource.title,
            url: resource.url,
          })),
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Tutorials", url: "https://www.brandonptdavis.com/studio/tutorials" },
          { name: tutorial.title, url: pageUrl },
        ]}
      />

      <Header />

      <article className="overflow-hidden py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <header className="mx-auto max-w-[62rem] text-center">
              <div className="flex flex-wrap items-center justify-center gap-4 text-[0.92rem] tracking-[-0.015em] text-white/54">
                {tutorialPublishedAt ? (
                  <time dateTime={new Date(tutorialPublishedAt).toISOString()}>
                    {formatDate(tutorialPublishedAt)}
                  </time>
                ) : null}
                <span>{getCategoryLabel(tutorial.category)}</span>
                <span>{formatDuration(tutorial.duration)}</span>
                <span>{getDifficultyLabel(tutorial.difficulty)}</span>
              </div>

              <h1 className="mx-auto mt-5 max-w-[14ch] font-sans text-[clamp(2.7rem,5.8vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.072em] text-white">
                {tutorial.title}
              </h1>

              <p className="mx-auto mt-5 max-w-[42rem] text-[clamp(1rem,1.45vw,1.32rem)] leading-[1.62] tracking-[-0.018em] text-white/68">
                {tutorialSummary}
              </p>
            </header>
          </AnimatedSection>

          <AnimatedSection
            delay={140}
            className="mx-auto mt-12 max-w-[88rem] overflow-hidden bg-white/[0.02]"
          >
            {videoId ? (
              <DeferredYouTubeEmbed videoId={videoId} title={tutorial.title} eagerPoster />
            ) : (
              <div className="aspect-[16/9] bg-black/30" />
            )}
          </AnimatedSection>

          <AnimatedSection
            delay={260}
            className="mx-auto mt-8 flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 pt-4 text-white/72"
          >
            <div className="flex flex-wrap items-center gap-4 text-[0.96rem] tracking-[-0.018em] sm:gap-5">
              <span>Video tutorial</span>
              <span className="text-white/42">/</span>
              <span>Vectorworks workflow reference</span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href={tutorial.video_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                <span>YouTube</span>
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-white"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                <span>{linkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection
            delay={320}
            className="mx-auto mt-8 max-w-[50rem] rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-5 py-4 md:px-6"
          >
            <p className="text-[0.78rem] uppercase tracking-[0.18em] text-white/38">What to notice</p>
            <p className="mt-2 text-[0.97rem] leading-7 tracking-[-0.01em] text-white/68">
              {whatToNotice}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={360} className="mx-auto mt-14 max-w-[50rem]">
            <section className="text-white/80">
              <p className="mb-8 text-[1.04rem] leading-[1.9] tracking-[-0.01em] md:text-[1.08rem]">
                {articleLead}
              </p>
              {overviewParagraphs.length > 0 ? (
                overviewParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-8 text-[1.04rem] leading-[1.9] tracking-[-0.01em] last:mb-0 md:text-[1.08rem]"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-[1.04rem] leading-[1.9] tracking-[-0.01em] text-white/62">
                  No extended overview was added for this tutorial yet.
                </p>
              )}
            </section>

            <section className="mt-16 border-t border-white/12 pt-12">
              <Tabs defaultValue={featureMoments[1]?.value || featureMoments[0]?.value} className="mx-auto max-w-[50rem]">
                <TabsList className={articlePillTabsListClass}>
                  {featureMoments.map((moment) => (
                    <TabsTrigger
                      key={moment.value}
                      value={moment.value}
                      className={articlePillTabsTriggerClass}
                    >
                      {moment.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {featureMoments.map((moment) => (
                  <TabsContent key={moment.value} value={moment.value} className="mt-8">
                    <div className="mx-auto max-w-[42rem] text-center">
                      <h2 className="font-sans text-[clamp(1.8rem,2.35vw,2.45rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                        {moment.title}
                      </h2>
                      <p className="mx-auto mt-5 max-w-[39rem] text-[1.02rem] leading-8 tracking-[-0.01em] text-white/68">
                        {moment.body}
                      </p>
                      <p className="mx-auto mt-5 max-w-[35rem] text-[0.98rem] leading-8 tracking-[-0.01em] text-white/52">
                        {moment.detail}
                      </p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            <CustomLessonEnhancement tutorial={tutorial} />

            {tutorial.slug === "2d-edit-modify-tricks" ? <TwoDEditCommandMap /> : null}

            {whyItMatters ? (
              <section className="mt-20 border-t border-white/12 pt-10">
                <div className="max-w-[42rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    {whyItMatters.title}
                  </h2>
                  <div className="mt-6 space-y-6">
                    {whyItMatters.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-[42rem] text-[1.03rem] leading-[1.88] tracking-[-0.01em] text-white/72 md:text-[1.07rem]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            <section className="mt-20">
              <div className="mx-auto max-w-[46rem] text-center">
                <p className="text-[0.82rem] font-medium uppercase tracking-[0.18em] text-white/38">
                  One guiding idea
                </p>
                <blockquote className="mt-6 font-sans text-[clamp(2rem,3.6vw,3.4rem)] font-medium leading-[1.08] tracking-[-0.055em] text-white">
                  “{primaryQuote}”
                </blockquote>
              </div>
            </section>

            {articleBodySections.length > 0 ? (
              <section className="mt-20">
                <div className="space-y-16">
                  {articleBodySections.map((section, index) => (
                    <section
                      key={section.title}
                      id={`step-${index + 1}`}
                      className="mx-auto max-w-[50rem] border-t border-white/10 pt-12 first:border-t-0 first:pt-0"
                    >
                      <p className="font-sans text-[clamp(1.45rem,1.9vw,1.85rem)] font-medium leading-none tracking-[-0.055em] text-white/26">
                        {section.number}
                      </p>
                      <h2 className="mt-4 max-w-[17ch] font-sans text-[clamp(2.1rem,3vw,3.35rem)] font-medium leading-[0.94] tracking-[-0.065em] text-white">
                        {section.title}
                      </h2>
                      <div className="mt-7 space-y-7">
                        {section.paragraphs.map((paragraph) => (
                          <p
                            key={paragraph}
                            className="max-w-[42rem] text-[1.03rem] leading-[1.88] tracking-[-0.01em] text-white/72 md:text-[1.07rem]"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            ) : null}

            {comparisonRows.length > 0 ? (
              <section className="mt-20 border-t border-white/12 pt-10">
                <div className="max-w-[42rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    Symbol behavior
                  </h2>
                  <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-8 tracking-[-0.01em] text-white/62">
                    These terms are close enough to blur together, so it helps to separate what each one is actually doing in the drawing.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {comparisonRows.map((row) => (
                    <div
                      key={row.term}
                      className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-5"
                    >
                      <p className="text-[0.76rem] uppercase tracking-[0.18em] text-white/38">
                        {row.accent}
                      </p>
                      <h3 className="mt-3 font-sans text-[1.05rem] font-medium tracking-[-0.02em] text-white">
                        {row.term}
                      </h3>
                      <p className="mt-3 text-[0.95rem] leading-7 text-white/64">
                        {row.meaning}
                      </p>
                      <p className="mt-3 text-[0.92rem] leading-7 text-white/52">
                        {row.use}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {decisionGuide.length > 0 ? (
              <section className="mt-20 border-t border-white/12 pt-10">
                <div className="max-w-[42rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    Decision guide
                  </h2>
                </div>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  {decisionGuide.map((item) => (
                    <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-5">
                      <h3 className="font-sans text-[1.05rem] font-medium tracking-[-0.02em] text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[0.95rem] leading-7 text-white/60">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {instanceDefinitionExample ? (
              <section className="mt-20 border-t border-white/12 pt-10">
                <div className="max-w-[42rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    {instanceDefinitionExample.title}
                  </h2>
                </div>

                <div className="mt-8 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <div className="space-y-4">
                    {instanceDefinitionExample.steps.map((step, index) => (
                      <div key={step} className="grid gap-3 border-t border-white/10 pt-4 first:border-t-0 first:pt-0 md:grid-cols-[2.5rem_minmax(0,1fr)]">
                        <span className="font-sans text-[1.1rem] font-medium tracking-[-0.04em] text-white/32">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[0.97rem] leading-7 text-white/64">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {scenicUseParagraphs.length > 0 ? (
              <section className="mt-20 border-t border-white/12 pt-10">
                <div className="max-w-[42rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    Why scenic designers rely on symbols
                  </h2>
                  <div className="mt-6 space-y-6">
                    {scenicUseParagraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-[42rem] text-[1.03rem] leading-[1.88] tracking-[-0.01em] text-white/72 md:text-[1.07rem]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            <section className="mt-20 border-t border-white/12 pt-12">
              <Tabs defaultValue="resources" className="mx-auto max-w-[50rem] text-center">
                <div className="mx-auto max-w-[38rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    Supporting material
                  </h2>
                  <p className="mt-4 text-[0.98rem] leading-8 tracking-[-0.01em] text-white/62">
                    Related resources and quick references stay close to the article so the writing can keep moving without hiding the practical details.
                  </p>
                </div>

                <TabsList className={`${articlePillTabsListClass} mt-8`}>
                  <TabsTrigger
                    value="resources"
                    className={articlePillTabsTriggerClass}
                  >
                    Related resources
                  </TabsTrigger>
                  <TabsTrigger
                    value="quick-reference"
                    className={articlePillTabsTriggerClass}
                  >
                    Quick reference
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="mt-8">
                  <div className="text-left">
                    <p className="mx-auto max-w-[35rem] text-center text-[0.98rem] leading-8 tracking-[-0.01em] text-white/60">
                      Open these when the topic needs more context: software documentation, adjacent lessons, or reference material that supports the workflow.
                    </p>
                    <div className="mt-8 space-y-3">
                      {(tutorial.related_resources || []).map((resource: any, index: number) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-4 rounded-[1rem] px-1 py-3 transition-colors hover:text-white"
                        >
                          <div>
                            <p className="text-[0.78rem] uppercase tracking-[0.18em] text-white/38">
                              {resource.type || "Resource"}
                            </p>
                            <p className="mt-2 font-sans text-[1rem] font-medium tracking-[-0.02em] text-white">
                              {resource.title}
                            </p>
                          </div>
                          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-white/42" />
                        </a>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quick-reference" className="mt-8">
                  <div className="text-left">
                    <p className="mx-auto max-w-[35rem] text-center text-[0.98rem] leading-8 tracking-[-0.01em] text-white/60">
                      A short desk reference for the commands and reminders that are easiest to forget while drafting.
                    </p>
                    <div className="mt-8 space-y-3">
                      {quickReferenceItems.map((shortcut: any, index: number) => (
                        <div key={index} className="rounded-[1rem] px-1 py-3">
                          <p className="font-sans text-[1rem] font-medium tracking-[-0.02em] text-white">
                            {shortcut.action}
                          </p>
                          <p className="mt-2 text-[0.9rem] leading-7 text-white/64">
                            {Array.isArray(shortcut.keys) ? shortcut.keys.join(" + ") : shortcut.keys}
                          </p>
                          {shortcut.description ? (
                            <p className="mt-1 text-[0.9rem] leading-7 text-white/52">
                              {shortcut.description}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            {examQuestions.length > 0 ? (
              <section className="mt-20 border-t border-white/12 pt-10">
                <div className="max-w-[42rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    Potential exam questions
                  </h2>
                  <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-8 tracking-[-0.01em] text-white/62">
                    These prompts are written for study or LMS use. They are intentionally presented without answers so they can support learning, review, or Canvas integration without giving the result away on the page.
                  </p>
                </div>

                <div className="mt-8 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[0.78rem] uppercase tracking-[0.18em] text-white/38">
                      Question {String(activeExamQuestion + 1).padStart(2, "0")} of {String(examQuestions.length).padStart(2, "0")}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveExamQuestion((current) =>
                            current === 0 ? examQuestions.length - 1 : current - 1
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-transparent text-white/56 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
                        aria-label="Previous question"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveExamQuestion((current) =>
                            current === examQuestions.length - 1 ? 0 : current + 1
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-transparent text-white/56 transition-colors hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
                        aria-label="Next question"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <section className="mt-5">
                    <p className="max-w-[42rem] text-[1rem] leading-7 tracking-[-0.01em] text-white/84">
                      {examQuestions[activeExamQuestion]?.prompt}
                    </p>
                    <div className="mt-4 space-y-2">
                      {examQuestions[activeExamQuestion]?.choices.map((choice: string, choiceIndex: number) => (
                        <div
                          key={choice}
                          className="rounded-[0.95rem] border border-white/8 bg-black/20 px-4 py-3 text-[0.95rem] leading-7 text-white/62"
                        >
                          <span className="mr-3 text-white/34">
                            {String.fromCharCode(65 + choiceIndex)}.
                          </span>
                          {choice}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </section>
            ) : null}

            <section className="mt-20 border-t border-white/12 pt-10">
              <div className="max-w-[38rem]">
                <h2 className="font-sans text-[clamp(1.75rem,2.2vw,2.2rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                  Related content
                </h2>
                <p className="mt-3 text-[0.98rem] leading-7 text-white/62">
                  Keep moving through the library with adjacent lessons that build on the same drafting habits.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTutorialCards.map((card) => {
                  const metadata = [
                    getCategoryLabel(card.category),
                    getDifficultyLabel(card.difficulty),
                    formatDuration(card.duration),
                  ]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <Link key={card.href} href={card.href} className="group block">
                      <div className="relative aspect-[1/1] overflow-hidden bg-background/50">
                        <Image
                          src={card.cover.src}
                          alt={card.cover.alt}
                          fill
                          quality={84}
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 94vw"
                        />
                      </div>

                      <div className="pt-4">
                        <p className="text-[1.02rem] font-normal tracking-[-0.02em] text-white/88">
                          {card.title}
                        </p>
                        <p className="mt-2 text-sm text-white/45">{metadata}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </AnimatedSection>
        </div>
      </article>

      <Footer />
    </div>
  );
}

function CustomLessonEnhancement({ tutorial }: { tutorial: any }) {
  if (tutorial.slug === "creating-trim-profiles-polyline") {
    return <TrimProfileEnhancement />;
  }

  const enhancement = lessonEnhancements[tutorial.slug];

  return enhancement ? <LessonEnhancementSection enhancement={enhancement} /> : null;
}

function LessonEnhancementSection({ enhancement }: { enhancement: LessonEnhancementContent }) {
  return (
    <section className="mt-20 border-t border-white/12 pt-12">
      <div className="mx-auto max-w-[44rem] text-center">
        <p className="text-[0.82rem] font-medium uppercase tracking-[0.18em] text-white/38">
          {enhancement.eyebrow}
        </p>
        <h2 className="mt-4 font-sans text-[clamp(2rem,3.15vw,3.25rem)] font-medium leading-[0.96] tracking-[-0.064em] text-white">
          {enhancement.title}
        </h2>
        <p className="mx-auto mt-5 max-w-[38rem] text-[1rem] leading-8 tracking-[-0.01em] text-white/66">
          {enhancement.body}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-[52rem] gap-6 md:grid-cols-3">
        {enhancement.items.map((item) => (
          <article key={item.label} className="border-t border-white/14 pt-5">
            <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-white/42">
              {item.label}
            </p>
            <h3 className="mt-5 font-sans text-[1.1rem] font-medium leading-[1.08] tracking-[-0.035em] text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-[0.92rem] leading-7 tracking-[-0.01em] text-white/58">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrimProfileEnhancement() {
  const steps = [
    {
      marker: "[1]",
      label: "SOURCE",
      title: "Start with a measured profile",
      body: "Use a manufacturer image that includes the molding silhouette and dimensions, so the drawing begins from evidence rather than a guess.",
    },
    {
      marker: "[2]",
      label: "TRACE",
      title: "Build the curve before the scale",
      body: "Trace the crown profile with the Polyline tool, using vertex modes to separate corners, arcs, and adjusted points.",
    },
    {
      marker: "[3]",
      label: "SCALE",
      title: "Apply real dimensions after the shape reads",
      body: "Once the profile is clean, scale the traced geometry in X and Y from the Object Info palette to match the product dimensions.",
    },
    {
      marker: "[4]",
      label: "REUSE",
      title: "Save it as a 2D symbol",
      body: "Convert the final profile into a reusable Resource Manager asset, with Convert to Group enabled when placement should become editable drafting geometry.",
    },
  ];

  return (
    <section className="mt-20 border-t border-white/12 pt-12">
      <div className="mx-auto max-w-[44rem] text-center">
        <p className="text-[0.82rem] font-medium uppercase tracking-[0.18em] text-white/38">
          Source to symbol
        </p>
        <h2 className="mt-4 font-sans text-[clamp(2rem,3.15vw,3.25rem)] font-medium leading-[0.96] tracking-[-0.064em] text-white">
          From reference image to reusable detail.
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-[46rem] gap-3 sm:grid-cols-2 lg:max-w-[58rem] lg:grid-cols-4">
        {steps.map((step) => (
          <article
            key={step.label}
            className="min-h-[13.5rem] rounded-[0.55rem] border border-white/62 px-5 py-5 text-center"
          >
            <p className="font-mono text-[0.72rem] leading-none tracking-[0.08em] text-white/70">
              {step.marker}
            </p>
            <p className="mx-auto mt-2 max-w-[8.5rem] font-mono text-[0.68rem] font-medium uppercase leading-[1.15] tracking-[0.12em] text-white">
              {step.label}
            </p>
            <h3 className="mx-auto mt-5 max-w-[11rem] font-sans text-[1.02rem] font-medium leading-[1.06] tracking-[-0.032em] text-white">
              {step.title}
            </h3>
            <p className="mx-auto mt-4 max-w-[12rem] text-[0.78rem] leading-5 tracking-[-0.005em] text-white/62">
              {step.body}
            </p>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-[38rem] text-center text-[1rem] leading-8 tracking-[-0.01em] text-white/68">
        The strongest version of the workflow is quiet: source the profile, trace the curve deliberately, scale the finished linework, and save the detail where the next drawing can find it.
      </p>
    </section>
  );
}

function TwoDEditCommandMap() {
  const moves = [
    {
      number: "01",
      label: "Transform",
      title: "Use the axis before redrawing the shape.",
      body: "Mirror, Move, Rotate, and Scale Objects are for geometry that already has the right idea but needs a new position, orientation, or proportion. The key Mirror decision is whether the original should move or whether Duplicate mode should preserve it.",
      cue: "Mirror / Move / Rotate / Scale",
      visual: "transform",
    },
    {
      number: "02",
      label: "Rework",
      title: "Edit the object at the point level.",
      body: "Reshape and Offset keep the work inside existing geometry. Handles, edges, vertices, distance offsets, and point-based offsets let a rough outline become more precise without throwing away useful linework.",
      cue: "Reshape / Offset",
      visual: "rework",
    },
    {
      number: "03",
      label: "Cut + join",
      title: "Control where continuity stops and starts.",
      body: "Split, Connect/Combine, Add Surface, Clip Surface, Intersect Surface, Compose, and Decompose are all ways of deciding whether separate 2D shapes should remain separate, trim each other, or become one controlled outline.",
      cue: "Split / Connect / Surface edits",
      visual: "join",
    },
    {
      number: "04",
      label: "Repeat",
      title: "Turn spacing into a setting.",
      body: "Duplicate Along Path changes repetition from manual copy-paste into a controlled operation. Number, distance, offset, centering, and tangency decide how the object travels along the guide.",
      cue: "Duplicate Along Path",
      visual: "repeat",
    },
  ];

  return (
    <section className="mt-20 border-t border-white/12 pt-12">
      <div className="mx-auto max-w-[44rem] text-center">
        <p className="text-[0.82rem] font-medium uppercase tracking-[0.18em] text-white/38">
          Command map
        </p>
        <h2 className="mt-4 font-sans text-[clamp(2rem,3.1vw,3.2rem)] font-medium leading-[0.96] tracking-[-0.064em] text-white">
          Choose the edit by what the geometry needs next.
        </h2>
        <p className="mx-auto mt-5 max-w-[38rem] text-[1rem] leading-8 tracking-[-0.01em] text-white/66">
          This is the practical center of the page: the same drawing may need to be transformed, reworked, cut apart, joined back together, or repeated with spacing. The tool is chosen by that need.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-[54rem]">
        {moves.map((move) => (
          <article
            key={move.number}
            className="grid gap-6 border-t border-white/10 py-8 first:border-t-0 first:pt-0 md:grid-cols-[5rem_minmax(0,1fr)_13rem]"
          >
            <div>
              <p className="font-sans text-[1.35rem] font-medium leading-none tracking-[-0.05em] text-white/28">
                {move.number}
              </p>
              <p className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-white/38">
                {move.label}
              </p>
            </div>
            <div>
              <h3 className="max-w-[18rem] font-sans text-[clamp(1.45rem,2vw,2rem)] font-medium leading-[1] tracking-[-0.05em] text-white">
                {move.title}
              </h3>
              <p className="mt-4 max-w-[38rem] text-[0.98rem] leading-8 tracking-[-0.01em] text-white/64">
                {move.body}
              </p>
              <p className="mt-4 text-[0.76rem] font-medium uppercase tracking-[0.16em] text-cyan-200/62">
                {move.cue}
              </p>
            </div>
            <DraftingMoveSketch kind={move.visual} />
          </article>
        ))}
      </div>
    </section>
  );
}

function DraftingMoveSketch({ kind }: { kind: string }) {
  if (kind === "transform") {
    return (
      <div className="relative min-h-[8rem] overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/[0.025]">
        <div className="absolute left-1/2 top-5 h-24 w-px -translate-x-1/2 bg-white/18" />
        <div className="absolute left-8 top-9 h-14 w-9 rounded-sm border border-white/42 bg-white/8" />
        <div className="absolute right-8 top-9 h-14 w-9 rounded-sm border border-cyan-200/70 bg-cyan-200/10" />
        <div className="absolute bottom-4 left-1/2 h-px w-20 -translate-x-1/2 bg-white/16" />
      </div>
    );
  }

  if (kind === "rework") {
    return (
      <div className="relative min-h-[8rem] overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/[0.025]">
        <div className="absolute left-8 top-7 h-16 w-24 rounded-[1.2rem] border border-white/36 bg-white/7" />
        <div className="absolute left-8 top-7 h-2 w-2 rounded-full bg-cyan-200" />
        <div className="absolute left-[6.9rem] top-5 h-2 w-2 rounded-full bg-cyan-200" />
        <div className="absolute left-[8.4rem] top-[4.2rem] h-2 w-2 rounded-full bg-cyan-200" />
        <div className="absolute left-[4.6rem] top-[5.9rem] h-2 w-2 rounded-full bg-cyan-200" />
      </div>
    );
  }

  if (kind === "join") {
    return (
      <div className="relative min-h-[8rem] overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/[0.025]">
        <div className="absolute left-7 top-8 h-16 w-16 rounded-[0.8rem] border border-white/34 bg-white/7" />
        <div className="absolute right-7 top-8 h-16 w-16 rounded-full border border-cyan-200/60 bg-cyan-200/10" />
        <div className="absolute left-[5.35rem] top-4 h-24 w-px rotate-[24deg] bg-white/22" />
        <div className="absolute bottom-5 left-1/2 h-px w-24 -translate-x-1/2 bg-white/18" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[8rem] overflow-hidden rounded-[1.1rem] border border-white/10 bg-white/[0.025]">
      <div className="absolute left-7 top-[4.1rem] h-px w-32 rotate-[-12deg] bg-white/22" />
      {[
        ["1.9rem", "4.25rem"],
        ["3.75rem", "3.45rem"],
        ["5.6rem", "3.1rem"],
        ["7.45rem", "3.25rem"],
        ["9.3rem", "3.9rem"],
      ].map(([left, top]) => (
        <span
          key={`${left}-${top}`}
          className="absolute h-4 w-4 rounded-full border border-cyan-200/70 bg-cyan-200/12"
          style={{ left, top }}
        />
      ))}
    </div>
  );
}
