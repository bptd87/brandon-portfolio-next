"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { SEO } from "@/components/SEO";
import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      "The tutorial introduces design layers as an organizational system for the drawing, but the real teaching move is conceptual: layers work like stacked sheets of vellum. Architecture can sit at the bottom, scenic drafting can sit above it, and lighting can sit above that, with each layer carrying its own information while still contributing to the same file.",
      "That idea becomes clearer through the production example from UCI's The Pajama Game. The lesson uses the Navigation palette to show how design layers can be turned on and off, reordered in the stack, and viewed from different angles so the user can isolate architecture, scenery, or lighting without losing the larger context of the drawing.",
      "The second half of the tutorial shifts into file setup. New layers are created, renamed with scenic and lighting conventions, kept at matching scales, and reordered to demonstrate how stacking changes what appears in front. Layer options like Gray/Snap Others and Show/Snap Others then turn design layers from a filing system into an active drafting workflow.",
    ];
  }

  if (tutorial.slug === "understanding-symbols") {
    return [
      "The tutorial briefly situates 2D symbols alongside 3D and hybrid symbols, but the actual teaching stays focused on 2D symbol workflows. It uses a few clear examples to explain how standard symbols, grouped symbols, and page-based symbols behave once they are placed in the drawing.",
      "A large part of that explanation happens through visual coding in the Resource Manager. Standard symbols appear in black, grouped symbols appear in blue, and page-based symbols appear in green. Those cues matter because the lesson is really about behavior as much as creation. The question is not only how to make a symbol, but how to understand what kind of object you are placing before it ever enters the document.",
      "From there, the tutorial moves through scaling methods and editing workflows, including the difference between editing a symbol definition and scaling a symbol instance. Grouped symbols and page-based symbols extend that idea by showing how symbols can either break their link on placement or respond to page scale instead of world units.",
    ];
  }

  if (tutorial.slug === "2d-edit-modify-tricks") {
    return [
      "This tutorial moves through the core 2D editing and modification tools that make drafting faster once the basic geometry is already on the page. It begins with the Mirror Tool, showing the difference between moving an object across a mirror axis and creating a mirrored duplicate that keeps the original in place.",
      "From there, the tutorial shifts into direct shape editing with the Reshape Tool. Handles, edges, added vertices, radius points, and deleted points all become ways of adjusting an existing polygon without redrawing it from scratch. The Offset Tool then extends that logic by creating parallel geometry at a set distance or by visual placement, depending on whether the drawing needs precision or speed.",
      "The middle of the tutorial focuses on tools that break and reconnect geometry. Split divides shapes by line, point, or trim direction, while Connect/Combine extends or joins line segments depending on whether the result should remain separate or become a single polygon. These tools are especially useful when a drawing starts as simple geometry but needs to become more specific over time.",
      "The final portion moves into the Modify menu: Move, Align/Distribute, Rotate, Scale, surface operations, Convert to Lines, Compose, Decompose, and Duplicate Along Path. Together, these commands turn simple shapes into more flexible drafting systems, including repeated objects along paths, composed polygons, and Boolean shapes built from overlapping primitives.",
    ];
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return [
      "This tutorial begins with drafted information already built in the design layer: a plan view, a front elevation, and two wall sections. The first task is to move that information into a sheet layer through viewports, using crops, drawing numbers, titles, sheet references, and scale settings to establish a readable sheet.",
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
    alt: `Abstract tutorial cover for ${getCategoryLabel(tutorial.category)}`,
  };
};

const getYouTubeId = (url: string | undefined | null) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match ? match[1] : url;
};

const getWorkflowSteps = (tutorial: any) =>
  (tutorial.learning_objectives || []).map((objective: string, index: number) => ({
    title: objective,
    body: (tutorial.transcript || [])[index]?.text || null,
    time: (tutorial.transcript || [])[index]?.time || null,
  }));

const getFeatureMoments = (tutorial: any) => {
  if (tutorial.slug === "understanding-design-layers") {
    return [
      {
        value: "stack",
        label: "Stack",
        title: "Think in layered drawing planes",
        body: "The lesson explains design layers through a drafting metaphor first. They are not abstract settings. They are stacked planes of information that let architecture, scenery, and lighting stay separate while still working together.",
        detail:
          tutorial.key_concepts?.[0]?.content ||
          "Design layers organize drawing information like stacked sheets of paper or vellum.",
        visual: "layer-stack",
      },
      {
        value: "navigate",
        label: "Navigate",
        title: "Use the palette to control visibility and order",
        body: "The Navigation palette becomes the main teaching tool. It shows which layers are visible, which one is active, and how the stacking order changes what reads in front when layers overlap.",
        detail:
          tutorial.key_concepts?.[1]?.content ||
          "Higher layers in the stack appear in front of lower layers when objects overlap.",
        visual: "navigation-palette",
      },
      {
        value: "draft",
        label: "Draft",
        title: "Pick layer options that support the way you work",
        body: "The tutorial ends by showing how layer options change the drafting experience. Seeing other layers in gray, snapping to them, or showing them in full color affects accuracy, hierarchy, and the chance of editing the wrong thing.",
        detail:
          tutorial.key_concepts?.[2]?.content ||
          "Gray/Snap Others is often the most useful default because it preserves snap access without flattening the visual hierarchy.",
        visual: "layer-options",
      },
    ];
  }

  if (tutorial.slug === "understanding-symbols") {
    return [
      {
        value: "types",
        label: "2D symbols",
        title: "Read the symbol before you place it",
        body: "The lesson names other symbol categories briefly, but the teaching work here stays with 2D symbols: how they appear in the Resource Manager, how they are placed, and how their behavior changes depending on the symbol type you choose.",
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
        body: "Grouped symbols, unit-based symbols, and page-based symbols each belong to a different kind of workflow. The tutorial treats that choice as practical, not theoretical.",
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
        body: "The tutorial starts by moving existing design-layer information onto the sheet through viewports, treating the sheet as a composed drawing rather than a place to redraw content.",
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
    return "Symbols become useful the moment a drawing needs repetition, consistency, or controlled change. Although the tutorial briefly names 2D, 3D, and hybrid symbols, the lesson itself is really about 2D symbol behavior: how symbols are identified, placed, scaled, edited, and interpreted inside the drafting workflow.";
  }

  if (tutorial.slug === "understanding-design-layers") {
    return "Design layers are presented here less as software settings and more as a way of thinking about a drawing. The tutorial frames them like stacked sheets of drafting paper: architecture on one layer, scenery on another, lighting on top, each one visible or hidden as needed while still belonging to the same file.";
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
          "The tutorial starts with the most useful comparison in the lesson: design layers behave like stacked sheets of vellum. That analogy matters because it keeps the concept grounded in drawing practice rather than software vocabulary. Architecture can live on one layer, scenic information on another, and lighting on another, each one visible when needed and absent when it gets in the way.",
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
          "The Pajama Game example gives the lesson its practical center. By toggling layer visibility and shifting into an isometric view, the tutorial shows how a file can reveal or hide architecture so the scenic information becomes easier to read. That is a simple action, but it changes the user’s relationship to the drawing: layers become a way to ask better visual questions.",
          "Stacking order matters for the same reason. When two layers overlap, the one higher in the stack reads in front. The circle demonstration in the blank file makes that easy to see. It turns stacking from an abstract list in the palette into a visible rule that shapes what appears dominant in the drawing.",
        ],
        support: {
          eyebrow: "Key move",
          title: "Use order to control clarity",
          body: "A visibility toggle hides distraction. A stacking change changes emphasis. Both are part of reading the file, not just managing it.",
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
          "A scenic workflow improves when common details stop being redrawn from scratch. A trim profile that lives in the Resource Manager can come back across projects, stay consistent inside documentation, and remain editable when the drawing package changes. The tutorial is brief, but the larger argument underneath it is about building a library of dependable parts rather than a file full of isolated solutions.",
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
          body: "The tutorial argues for building the sheet as a composition first, then layering annotation onto something already organized.",
        },
      },
      {
        number: "02",
        title: "Dimensions only make sense inside the correct scale",
        paragraphs: [
          "The strongest teaching moment in the video is the comparison between annotating inside and outside the viewport. The same line can read as ten feet in one context and five inches in another. That is not a minor software quirk. It is the core reason annotation belongs inside the viewport’s own scale environment.",
          "From there, the lesson becomes less about clicking tools and more about drawing discipline. Drawing labels need room to breathe. Dimension strings need to be offset clearly. Constrained chain mode matters because it supports the rhythm of documentation, not just efficiency for its own sake. The page should support that larger point: annotations are useful when they clarify the drawing, not when they simply accumulate on top of it.",
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
          "That is where many beginners get turned around. If the goal is to change every occurrence, the definition must be edited. If the goal is to change only one placed occurrence, then the instance is the place to work. The tutorial demonstrates that difference clearly by duplicating a symbol, editing the definition, and showing how both placed symbols update together.",
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
          body: "The tutorial is less about cataloging every symbol family and more about understanding how 2D symbols change behavior across drawing contexts.",
        },
      },
    ];
  }

  return [];
};

const getToolMoves = (tutorial: any) => {
  if (tutorial.slug !== "2d-edit-modify-tricks") {
    return [];
  }

  return [
    {
      value: "mirror",
      label: "Mirror",
      title: "Reflect form without rebuilding it",
      shortcut: "X then Mirror Tool",
      body: "Mirror is useful because it turns symmetry into a decision rather than a redraw. The key distinction in the tutorial is between standard mode, which flips the object across the axis, and duplicate mode, which keeps the original while producing its counterpart.",
      detail: "Use it when the drawing logic is bilateral and you want the second half to be as exact as the first.",
      demo: {
        beforeLabel: "Original",
        beforeShape: "left-block",
        afterLabel: "Mirrored duplicate",
        afterShape: "mirror-pair",
      },
    },
    {
      value: "reshape",
      label: "Reshape",
      title: "Edit geometry directly at the point level",
      shortcut: "Double-click shape",
      body: "The reshape tool is less about correction and more about control. Once the object exists, handles, edge shifts, added vertices, and deleted points let the geometry evolve without starting over.",
      detail: "This is where a rough shape becomes a precise one, especially when corners and arcs need to trade places cleanly.",
      demo: {
        beforeLabel: "Base polygon",
        beforeShape: "soft-rect",
        afterLabel: "Adjusted vertices",
        afterShape: "reshaped-poly",
      },
    },
    {
      value: "offset",
      label: "Offset",
      title: "Build parallel geometry with intention",
      shortcut: "O",
      body: "Offset is one of the fastest ways to move from a single line to a drawing system. In the tutorial, the important distinction is whether the original is preserved or replaced, and whether the offset is driven by a numerical distance or placed more visually.",
      detail: "It is especially strong when wall thickness, borders, and repeated parallel edges need to stay consistent.",
      demo: {
        beforeLabel: "Single line",
        beforeShape: "single-line",
        afterLabel: "Parallel result",
        afterShape: "offset-lines",
      },
    },
    {
      value: "split",
      label: "Split",
      title: "Break complex shapes into workable parts",
      shortcut: "Split Tool",
      body: "Split matters when the object you have is no longer the object you need. Line split, point split, and trim mode each separate geometry differently, but the deeper lesson is about controlling where continuity stops.",
      detail: "After trim mode, the object may need to be closed again, which is why the Object Info Palette becomes part of the same editing conversation.",
      demo: {
        beforeLabel: "Continuous form",
        beforeShape: "closed-poly",
        afterLabel: "Separated pieces",
        afterShape: "split-poly",
      },
    },
    {
      value: "combine",
      label: "Combine",
      title: "Connect lines into a more useful whole",
      shortcut: "L",
      body: "Connect and combine tools are less flashy than Boolean commands, but they are often more practical in drafting. The tutorial distinguishes between extending, connecting, and truly combining, which is what makes the tool useful rather than confusing.",
      detail: "The point is not simply to join lines. It is to decide whether the result should remain separate geometry or become a single polygon.",
      demo: {
        beforeLabel: "Separate segments",
        beforeShape: "angled-lines",
        afterLabel: "Combined form",
        afterShape: "joined-shape",
      },
    },
  ];
};

const getWhatToNotice = (tutorial: any) => {
  if (tutorial.slug === "understanding-design-layers") {
    return "Watch how often the tutorial pairs a layer action with a change in what becomes readable. Turning layers off, shifting stacking order, and changing layer options are all really lessons in how to manage attention inside a dense drawing.";
  }

  if (tutorial.slug === "understanding-symbols") {
    return "Notice how often the tutorial separates what a symbol is from how a placed symbol behaves. The crucial lesson is not just how to create symbols, but how Vectorworks distinguishes between symbol definitions, symbol instances, grouped symbols, and page-based objects.";
  }

  if (tutorial.slug === "2d-edit-modify-tricks") {
    return "Watch for the difference between tools that transform geometry, tools that edit geometry, and commands that reorganize geometry. The important lesson is not just what each tool does, but when one move is more efficient than another.";
  }

  if (tutorial.slug === "2d-annotations-dimensioning") {
    return "Pay attention to when the tutorial moves into viewport annotations. The key teaching moment is that the same graphic information behaves differently depending on the scale context in which it is being edited.";
  }

  return "Notice how the tutorial moves from a single action toward a broader drafting habit. The value is usually in the sequencing, not just the command itself.";
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
        "That is why annotation belongs in the same conversation as composition. The tutorial is not just about tools. It is about building drawings that other people can navigate quickly and trust.",
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

  const overviewParagraphs = tutorial ? getArticleOverviewParagraphs(tutorial) : [];
  const workflowSteps = useMemo(() => (tutorial ? getWorkflowSteps(tutorial) : []), [tutorial]);
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
  const tutorialSummary = getTutorialSummary(tutorial);
  const structuredUploadDate =
    tutorial.created_at || tutorial.updated_at || "1970-01-01T00:00:00.000Z";
  const pageUrl = `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug}`;
  const articleLead = getArticleLead(tutorial);
  const articleBodySections = getArticleBodySections(tutorial);
  const featureMoments = getFeatureMoments(tutorial);
  const toolMoves = getToolMoves(tutorial);
  const whatToNotice = getWhatToNotice(tutorial);
  const whyItMatters = getWhyItMatters(tutorial);
  const examQuestions = getExamQuestions(tutorial);
  const comparisonRows = getComparisonRows(tutorial);
  const decisionGuide = getDecisionGuide(tutorial);
  const instanceDefinitionExample = getInstanceDefinitionExample(tutorial);
  const scenicUseParagraphs = getScenicUseParagraphs(tutorial);
  const primaryQuote =
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
    try {
      await navigator.clipboard.writeText(pageUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
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
        publishedTime={tutorial.created_at ? new Date(tutorial.created_at).toISOString() : undefined}
        modifiedTime={tutorial.updated_at ? new Date(tutorial.updated_at).toISOString() : undefined}
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

      <article className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-[62rem] text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-[0.92rem] tracking-[-0.015em] text-white/54">
              {tutorial.created_at ? (
                <time dateTime={new Date(tutorial.created_at).toISOString()}>
                  {formatDate(tutorial.created_at)}
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

          <div className="mx-auto mt-12 max-w-[88rem] overflow-hidden rounded-xl bg-white/[0.02]">
            {videoId ? (
              <DeferredYouTubeEmbed videoId={videoId} title={tutorial.title} eagerPoster />
            ) : (
              <div className="aspect-[16/9] bg-black/30" />
            )}
          </div>

          <div className="mx-auto mt-8 flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 pt-4 text-white/72">
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-[0.96rem] tracking-[-0.018em]">
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
          </div>

          <div className="mx-auto mt-8 max-w-[50rem] rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-5 py-4 md:px-6">
            <p className="text-[0.78rem] uppercase tracking-[0.18em] text-white/38">What to notice</p>
            <p className="mt-2 text-[0.97rem] leading-7 tracking-[-0.01em] text-white/68">
              {whatToNotice}
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-[50rem]">
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

            <section className="mt-16 border-y border-white/12 py-10">
              <Tabs defaultValue={featureMoments[1]?.value || featureMoments[0]?.value} className="mx-auto max-w-[56rem]">
                <TabsList className="mx-auto flex h-auto w-fit flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-transparent p-1">
                  {featureMoments.map((moment) => (
                    <TabsTrigger
                      key={moment.value}
                      value={moment.value}
                      className="rounded-full border border-transparent bg-transparent px-5 py-2.5 text-[0.98rem] tracking-[-0.015em] text-white/52 data-[state=active]:border-white/8 data-[state=active]:bg-white/[0.07] data-[state=active]:text-white"
                    >
                      {moment.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {featureMoments.map((moment) => (
                  <TabsContent key={moment.value} value={moment.value} className="mt-8">
                    {(() => {
                      const visual = "visual" in moment ? moment.visual : undefined;
                      if (visual) {
                        return (
                          <div className="mx-auto max-w-[44rem] border-t border-white/10 pt-8 text-center">
                            <p className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white/38">
                              {moment.label}
                            </p>
                            <h2 className="mt-3 font-sans text-[clamp(1.55rem,2vw,2.05rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
                              {moment.title}
                            </h2>
                            <p className="mx-auto mt-4 max-w-[38rem] text-[1rem] leading-8 tracking-[-0.01em] text-white/66">
                              {moment.body}
                            </p>
                            <div className="mx-auto mt-8 max-w-[34rem]">
                              <DesignLayerGraphic variant={visual} />
                            </div>
                            <p className="mx-auto mt-6 max-w-[36rem] text-[0.98rem] leading-8 tracking-[-0.01em] text-white/56">
                              {moment.detail}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="grid gap-8 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:p-8">
                          <div>
                            <p className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white/38">
                              {moment.label}
                            </p>
                            <h2 className="mt-3 font-sans text-[clamp(1.55rem,2vw,2.05rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
                              {moment.title}
                            </h2>
                            <p className="mt-4 max-w-[34rem] text-[1rem] leading-8 tracking-[-0.01em] text-white/66">
                              {moment.body}
                            </p>
                          </div>

                          <div className="border-t border-white/10 pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                            <p className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-white/38">
                              Read the move
                            </p>
                            <p className="mt-4 text-[0.98rem] leading-8 tracking-[-0.01em] text-white/62">
                              {moment.detail}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            {toolMoves.length > 0 ? (
              <section className="mt-16">
                <Tabs defaultValue={toolMoves[0]?.value} className="mx-auto max-w-[56rem]">
                  <div className="mx-auto max-w-[40rem] text-center">
                    <h2 className="font-sans text-[clamp(1.9rem,2.5vw,2.6rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
                      Tool moves
                    </h2>
                    <p className="mt-4 text-[0.98rem] leading-8 tracking-[-0.01em] text-white/62">
                      This page works best when the editing tools are treated as distinct geometric moves. Switch between them to see what each one changes.
                    </p>
                  </div>

                  <TabsList className="mx-auto mt-8 flex h-auto w-fit flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-transparent p-1">
                    {toolMoves.map((move) => (
                      <TabsTrigger
                        key={move.value}
                        value={move.value}
                        className="rounded-full border border-transparent bg-transparent px-5 py-2.5 text-[0.98rem] tracking-[-0.015em] text-white/52 data-[state=active]:border-white/8 data-[state=active]:bg-white/[0.07] data-[state=active]:text-white"
                      >
                        {move.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {toolMoves.map((move) => (
                    <TabsContent key={move.value} value={move.value} className="mt-8">
                      <div className="grid gap-8 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:p-8">
                        <div className="rounded-[1.2rem] border border-white/10 bg-black/30 p-5">
                          <p className="text-[0.76rem] uppercase tracking-[0.18em] text-white/36">
                            Visual state
                          </p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[1rem] border border-white/8 bg-white/[0.02] p-4">
                              <p className="text-[0.75rem] uppercase tracking-[0.18em] text-white/34">
                                {move.demo.beforeLabel}
                              </p>
                              <div className="mt-4 flex aspect-square items-center justify-center rounded-[0.9rem] bg-black/20">
                                <ToolMoveGraphic shape={move.demo.beforeShape} />
                              </div>
                            </div>
                            <div className="rounded-[1rem] border border-white/8 bg-white/[0.02] p-4">
                              <p className="text-[0.75rem] uppercase tracking-[0.18em] text-white/34">
                                {move.demo.afterLabel}
                              </p>
                              <div className="mt-4 flex aspect-square items-center justify-center rounded-[0.9rem] bg-black/20">
                                <ToolMoveGraphic shape={move.demo.afterShape} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[0.76rem] uppercase tracking-[0.18em] text-white/36">
                            {move.shortcut}
                          </p>
                          <h3 className="mt-3 font-sans text-[clamp(1.5rem,2vw,2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
                            {move.title}
                          </h3>
                          <p className="mt-4 max-w-[34rem] text-[1rem] leading-8 tracking-[-0.01em] text-white/66">
                            {move.body}
                          </p>
                          <p className="mt-4 max-w-[34rem] text-[0.95rem] leading-7 tracking-[-0.01em] text-white/54">
                            {move.detail}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </section>
            ) : null}

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
                      className="border-t border-white/10 pt-8 first:border-t-0 first:pt-0"
                    >
                      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-start gap-4 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-6">
                        <span className="pt-1 text-right font-sans text-[clamp(1.55rem,2vw,1.9rem)] font-medium leading-none tracking-[-0.05em] text-white/28">
                          {section.number}
                        </span>
                        <h2 className="max-w-[14ch] font-sans text-[clamp(1.95rem,2.55vw,2.55rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white">
                          {section.title}
                        </h2>
                      </div>
                      <div className="mt-6 space-y-6 pl-[3.25rem] md:pl-[4rem]">
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
                    Symbol comparison
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

            <section className="mt-20 border-t border-white/12 pt-10">
              <Tabs defaultValue="resources" className="mx-auto max-w-[50rem] text-center">
                <div className="mx-auto max-w-[38rem]">
                  <h2 className="font-sans text-[clamp(1.85rem,2.3vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">
                    Supporting material
                  </h2>
                  <p className="mt-4 text-[0.98rem] leading-8 tracking-[-0.01em] text-white/62">
                    These notes stay secondary to the main page, but they keep the practical details close when you need them.
                  </p>
                </div>

                <TabsList className="mx-auto mt-8 flex h-auto w-fit flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-transparent p-1">
                  <TabsTrigger
                    value="resources"
                    className="rounded-full border border-transparent bg-transparent px-5 py-2.5 text-[0.98rem] tracking-[-0.015em] text-white/52 data-[state=active]:border-white/8 data-[state=active]:bg-white/[0.07] data-[state=active]:text-white"
                  >
                    Related resources
                  </TabsTrigger>
                  <TabsTrigger
                    value="quick-reference"
                    className="rounded-full border border-transparent bg-transparent px-5 py-2.5 text-[0.98rem] tracking-[-0.015em] text-white/52 data-[state=active]:border-white/8 data-[state=active]:bg-white/[0.07] data-[state=active]:text-white"
                  >
                    Quick reference
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="resources" className="mt-8">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 text-left md:p-8">
                    <p className="max-w-[35rem] text-[0.98rem] leading-8 tracking-[-0.01em] text-white/60">
                      The reference links below extend the logic of the tutorial without interrupting the pace of the page: software documentation, manufacturer material, and adjacent guidance worth opening when the process needs more context.
                    </p>
                    {(tutorial.related_resources || []).map((resource: any, index: number) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-4 border-t border-white/10 py-4 first:border-t-0 first:pt-0 transition-colors hover:text-white"
                      >
                        <div>
                          <p className="text-[0.8rem] uppercase tracking-[0.18em] text-white/38">
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
                </TabsContent>

                <TabsContent value="quick-reference" className="mt-8">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6 text-left md:p-8">
                    <p className="max-w-[35rem] text-[0.98rem] leading-8 tracking-[-0.01em] text-white/60">
                      Quick reference is where the page becomes useful at the desk: not a full breakdown, just the few commands and small reminders that are easy to forget in the middle of drawing.
                    </p>
                    <div className="mt-6 space-y-4">
                      {quickReferenceItems.map((shortcut: any, index: number) => (
                        <div key={index} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
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
                  This page should open outward into the rest of the library, so adjacent lessons are easy to keep reading without splitting that navigation into multiple sections.
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
                      <div className="relative aspect-[1/1] overflow-hidden rounded-xl bg-background/50">
                        <Image
                          src={card.cover.src}
                          alt={card.cover.alt}
                          fill
                          quality={90}
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
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}

function ToolMoveGraphic({ shape }: { shape: string }) {
  if (shape === "left-block") {
    return (
      <div className="relative h-28 w-28">
        <div className="absolute left-2 top-4 h-20 w-12 rounded-sm border border-white/35 bg-white/8" />
      </div>
    );
  }

  if (shape === "mirror-pair") {
    return (
      <div className="relative h-28 w-28">
        <div className="absolute left-1 top-4 h-20 w-10 rounded-sm border border-cyan-300/45 bg-cyan-300/10" />
        <div className="absolute left-10 top-2 h-24 w-px bg-white/20" />
        <div className="absolute right-1 top-4 h-20 w-10 rounded-sm border border-pink-300/45 bg-pink-300/10" />
      </div>
    );
  }

  if (shape === "soft-rect") {
    return (
      <div className="h-28 w-28 rounded-[1.2rem] border border-white/35 bg-white/8" />
    );
  }

  if (shape === "reshaped-poly") {
    return (
      <svg viewBox="0 0 120 120" className="h-28 w-28">
        <path
          d="M18 20 L88 18 Q102 22 100 36 L92 82 Q88 98 72 100 L24 92 Q16 90 16 78 L18 20 Z"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="2"
        />
        <circle cx="18" cy="20" r="3" fill="rgba(255,255,255,0.8)" />
        <circle cx="88" cy="18" r="3" fill="rgba(255,255,255,0.8)" />
        <circle cx="100" cy="36" r="3" fill="rgba(255,255,255,0.8)" />
        <circle cx="92" cy="82" r="3" fill="rgba(255,255,255,0.8)" />
      </svg>
    );
  }

  if (shape === "single-line") {
    return <div className="h-px w-24 bg-white/55" />;
  }

  if (shape === "offset-lines") {
    return (
      <div className="space-y-4">
        <div className="h-px w-24 bg-white/55" />
        <div className="h-px w-24 bg-cyan-300/70" />
      </div>
    );
  }

  if (shape === "closed-poly") {
    return <div className="h-24 w-24 rounded-[0.8rem] border border-white/35 bg-white/8" />;
  }

  if (shape === "split-poly") {
    return (
      <div className="relative h-28 w-28">
        <div className="absolute left-2 top-6 h-16 w-10 rounded-[0.7rem] border border-white/35 bg-white/8" />
        <div className="absolute right-2 top-6 h-16 w-10 rounded-[0.7rem] border border-cyan-300/45 bg-cyan-300/10" />
      </div>
    );
  }

  if (shape === "angled-lines") {
    return (
      <svg viewBox="0 0 120 120" className="h-28 w-28">
        <path d="M20 88 L54 40" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
        <path d="M66 32 L98 80" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (shape === "joined-shape") {
    return (
      <svg viewBox="0 0 120 120" className="h-28 w-28">
        <path
          d="M20 88 L60 32 L100 80 L20 88 Z"
          fill="rgba(34,211,238,0.1)"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return <div className="h-24 w-24 rounded-lg border border-white/20 bg-white/5" />;
}

function DesignLayerGraphic({ variant }: { variant: string }) {
  if (variant === "layer-stack") {
    return (
      <div className="relative h-44 overflow-hidden rounded-[1rem] bg-black/25">
        <div className="absolute left-8 top-6 h-24 w-40 rounded-[1rem] border border-white/10 bg-white/[0.03]" />
        <div className="absolute left-12 top-12 h-24 w-40 rounded-[1rem] border border-cyan-300/20 bg-cyan-300/[0.06]" />
        <div className="absolute left-16 top-[4.5rem] h-24 w-40 rounded-[1rem] border border-pink-300/20 bg-pink-300/[0.06]" />
        <div className="absolute right-4 top-6 space-y-3 text-right text-[0.74rem] uppercase tracking-[0.18em] text-white/42">
          <div>Lighting</div>
          <div>Scenery</div>
          <div>Architecture</div>
        </div>
      </div>
    );
  }

  if (variant === "navigation-palette") {
    return (
      <div className="rounded-[1rem] border border-white/8 bg-black/25 p-3">
        <div className="grid grid-cols-[1.2fr_0.55fr_0.55fr] gap-2 border-b border-white/8 pb-2 text-[0.66rem] uppercase tracking-[0.18em] text-white/34">
          <span>Layer</span>
          <span>Vis.</span>
          <span>Order</span>
        </div>
        <div className="mt-2 space-y-2 text-[0.9rem] tracking-[-0.015em] text-white/72">
          <div className="grid grid-cols-[1.2fr_0.55fr_0.55fr] gap-2 rounded-[0.8rem] bg-white/[0.06] px-3 py-2">
            <span>L-Ground Plan</span>
            <span>On</span>
            <span>3</span>
          </div>
          <div className="grid grid-cols-[1.2fr_0.55fr_0.55fr] gap-2 rounded-[0.8rem] bg-white/[0.03] px-3 py-2">
            <span>S-Ground Plan</span>
            <span>On</span>
            <span>2</span>
          </div>
          <div className="grid grid-cols-[1.2fr_0.55fr_0.55fr] gap-2 rounded-[0.8rem] bg-white/[0.03] px-3 py-2 text-white/52">
            <span>Arch-Ground Plan</span>
            <span>Gray</span>
            <span>1</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "layer-options") {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-3">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/34">Gray/Snap</p>
          <div className="mt-3 h-20 rounded-[0.8rem] bg-gradient-to-br from-white/10 to-white/[0.03]" />
          <p className="mt-3 text-[0.85rem] leading-6 text-white/58">See context, keep snap access.</p>
        </div>
        <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-3">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/34">Show Others</p>
          <div className="mt-3 h-20 rounded-[0.8rem] bg-gradient-to-br from-cyan-300/10 to-pink-300/10" />
          <p className="mt-3 text-[0.85rem] leading-6 text-white/58">See everything, no snapping below.</p>
        </div>
        <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-3">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-white/34">Show/Snap</p>
          <div className="mt-3 h-20 rounded-[0.8rem] bg-gradient-to-br from-cyan-300/12 to-white/[0.05]" />
          <p className="mt-3 text-[0.85rem] leading-6 text-white/58">Full context with snap support.</p>
        </div>
      </div>
    );
  }

  return <div className="h-24 rounded-lg border border-white/20 bg-white/5" />;
}
