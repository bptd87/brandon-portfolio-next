export const LEARNING_PORTAL_ARTICLE_SLUGS = [
  "the-visual-language-of-scenic-design",
  "becoming-a-scenic-designer-a-comprehensive-guide",
  "scenic-design-process",
  "online-portfolio-theatrical-design-2026",
  "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
  "video-game-environments-lessons-for-scenic-design",
  "what-makes-a-good-scenic-design-rendering",
  "the-art-of-presenting-theatre-design-a-guide-for-designers",
  "lighting-styles-in-ai-models",
  "sora-in-the-studio-testing-ais-potential-for-theatrical-design",
  "empowering-theatre-students-with-computer-literacy",
] as const;

export const LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG: Record<string, string> = {
  "the-visual-language-of-scenic-design": "Design Communication",
  "becoming-a-scenic-designer-a-comprehensive-guide": "Career & Practice",
  "scenic-design-process": "Design Process",
  "online-portfolio-theatrical-design-2026": "Portfolio",
  "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care": "Technology",
  "video-game-environments-lessons-for-scenic-design": "Design Thinking",
  "what-makes-a-good-scenic-design-rendering": "Rendering",
  "the-art-of-presenting-theatre-design-a-guide-for-designers": "Rendering",
  "lighting-styles-in-ai-models": "Rendering",
  "sora-in-the-studio-testing-ais-potential-for-theatrical-design": "Rendering",
  "empowering-theatre-students-with-computer-literacy": "Getting Started",
};

export const LEARNING_PORTAL_ARTICLE_SLUG_SET = new Set<string>(LEARNING_PORTAL_ARTICLE_SLUGS);

export const RETIRED_LEARNING_ARTICLE_REDIRECTS: Record<string, string> = {
  "how-to-create-trim-profiles-in-vectorworks-using-the-polyline-tool":
    "/studio/tutorials/creating-trim-profiles-polyline",
};

export const RETIRED_LEARNING_ARTICLE_SLUG_SET = new Set<string>(
  Object.keys(RETIRED_LEARNING_ARTICLE_REDIRECTS)
);

export type LearningPortalTag = {
  id: number;
  name: string;
  slug: string;
};

export type LearningTutorialMetadata = {
  published_at: string;
  tags: LearningPortalTag[];
};

const learningTags = {
  vectorworks: { id: 9101, name: "Vectorworks", slug: "vectorworks" },
  gettingStarted: { id: 9102, name: "Getting Started", slug: "getting-started" },
  scenicDrafting: { id: 9103, name: "Scenic Drafting", slug: "scenic-drafting" },
  scenicModeling: { id: 9104, name: "Scenic Modeling", slug: "scenic-modeling" },
  scenicRendering: { id: 9105, name: "Scenic Rendering", slug: "scenic-rendering" },
  documentation: { id: 9106, name: "Documentation", slug: "documentation" },
  fileOrganization: { id: 9107, name: "File Organization", slug: "file-organization" },
  interfaceWorkflow: { id: 9108, name: "Interface Workflow", slug: "interface-workflow" },
  classes: { id: 9109, name: "Classes", slug: "classes" },
  designLayers: { id: 9110, name: "Design Layers", slug: "design-layers" },
  sheetLayers: { id: 9111, name: "Sheet Layers", slug: "sheet-layers" },
  toolPalettes: { id: 9112, name: "Tool Palettes", slug: "tool-palettes" },
  resourceManager: { id: 9113, name: "Resource Manager", slug: "resource-manager" },
  symbols: { id: 9114, name: "Symbols", slug: "symbols" },
  draftingStandards: { id: 9115, name: "Drafting Standards", slug: "drafting-standards" },
  twoDDrafting: { id: 9116, name: "2D Drafting", slug: "2d-drafting" },
  modifyCommands: { id: 9117, name: "Modify Commands", slug: "modify-commands" },
  annotations: { id: 9118, name: "Annotations", slug: "annotations" },
  dimensioning: { id: 9119, name: "Dimensioning", slug: "dimensioning" },
  polylineTool: { id: 9120, name: "Polyline Tool", slug: "polyline-tool" },
  scenicDetails: { id: 9121, name: "Scenic Details", slug: "scenic-details" },
  threeDModeling: { id: 9122, name: "3D Modeling", slug: "3d-modeling" },
  modelingTools: { id: 9123, name: "Modeling Tools", slug: "modeling-tools" },
  textures: { id: 9124, name: "Textures", slug: "textures" },
  rendering: { id: 9125, name: "Rendering", slug: "rendering" },
  hybridSymbols: { id: 9126, name: "Hybrid Symbols", slug: "hybrid-symbols" },
  furniture: { id: 9127, name: "Furniture", slug: "furniture" },
  cameras: { id: 9128, name: "Cameras", slug: "cameras" },
  pdfs: { id: 9129, name: "PDFs", slug: "pdfs" },
  workspaceSetup: { id: 9130, name: "Workspace Setup", slug: "workspace-setup" },
} satisfies Record<string, LearningPortalTag>;

export const LEARNING_TUTORIAL_METADATA_BY_SLUG: Record<string, LearningTutorialMetadata> = {
  "navigating-user-interface": {
    published_at: "2021-01-24T22:08:42-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.gettingStarted,
      learningTags.interfaceWorkflow,
      learningTags.scenicDrafting,
    ],
  },
  "understanding-classes": {
    published_at: "2021-01-24T22:08:46-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.classes,
      learningTags.fileOrganization,
      learningTags.scenicDrafting,
    ],
  },
  "understanding-design-layers": {
    published_at: "2021-01-25T01:47:48-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.designLayers,
      learningTags.fileOrganization,
      learningTags.scenicDrafting,
    ],
  },
  "installing-workspace-template": {
    published_at: "2021-01-25T01:51:04-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.gettingStarted,
      learningTags.workspaceSetup,
      learningTags.fileOrganization,
    ],
  },
  "basics-tool-palette": {
    published_at: "2021-01-27T05:21:15-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.gettingStarted,
      learningTags.toolPalettes,
      learningTags.scenicDrafting,
    ],
  },
  "sheet-layers": {
    published_at: "2021-01-31T22:07:47-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.sheetLayers,
      learningTags.documentation,
      learningTags.draftingStandards,
    ],
  },
  "creating-trim-profiles-polyline": {
    published_at: "2021-01-31T23:06:47-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.polylineTool,
      learningTags.scenicDetails,
      learningTags.twoDDrafting,
    ],
  },
  "2d-edit-modify-tricks": {
    published_at: "2021-02-01T00:44:10-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.twoDDrafting,
      learningTags.modifyCommands,
      learningTags.scenicDrafting,
    ],
  },
  "resource-manager-basics": {
    published_at: "2021-02-01T02:04:45-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.resourceManager,
      learningTags.fileOrganization,
      learningTags.documentation,
    ],
  },
  "understanding-symbols": {
    published_at: "2021-02-03T07:28:31-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.symbols,
      learningTags.resourceManager,
      learningTags.draftingStandards,
    ],
  },
  "2d-annotations-dimensioning": {
    published_at: "2021-02-10T07:21:06-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.annotations,
      learningTags.dimensioning,
      learningTags.documentation,
    ],
  },
  "3d-modeling-basics": {
    published_at: "2021-02-21T23:34:51-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.threeDModeling,
      learningTags.scenicModeling,
      learningTags.gettingStarted,
    ],
  },
  "hybrid-symbols": {
    published_at: "2021-02-22T00:01:58-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.hybridSymbols,
      learningTags.symbols,
      learningTags.resourceManager,
    ],
  },
  "basics-of-textures": {
    published_at: "2021-02-22T00:50:23-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.textures,
      learningTags.rendering,
      learningTags.scenicModeling,
    ],
  },
  "3d-modeling-tools": {
    published_at: "2021-02-22T23:52:13-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.threeDModeling,
      learningTags.modelingTools,
      learningTags.scenicModeling,
    ],
  },
  "creating-24x36-pdfs": {
    published_at: "2021-02-23T11:57:23-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.pdfs,
      learningTags.documentation,
      learningTags.sheetLayers,
    ],
  },
  "modeling-a-table": {
    published_at: "2021-02-27T13:13:47-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.threeDModeling,
      learningTags.furniture,
      learningTags.scenicModeling,
    ],
  },
  "creating-camera-rendering": {
    published_at: "2021-03-01T06:55:07-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.rendering,
      learningTags.cameras,
      learningTags.scenicRendering,
    ],
  },
  "creating-2d-drafting-from-3d": {
    published_at: "2021-03-08T02:00:20-08:00",
    tags: [
      learningTags.vectorworks,
      learningTags.twoDDrafting,
      learningTags.threeDModeling,
      learningTags.documentation,
    ],
  },
};
