export type TutorialArticleModule = {
  label: string;
  title: string;
  body: string;
  visual:
    | "layer-stack"
    | "scale-check"
    | "class-attributes"
    | "symbol-instance"
    | "resource-filter"
    | "install-checklist"
    | "interface-map"
    | "tool-palette"
    | "page-breaks"
    | "sheet-viewport"
    | "annotation-scale"
    | "geometry-ops"
    | "trim-profile"
    | "model-to-drawing"
    | "reference-scale"
    | "solid-operations"
    | "primitive-tools"
    | "texture-shader"
    | "camera-pipeline"
    | "hybrid-components";
  points: string[];
};

export type TutorialArticleBlueprint = {
  summary: string;
  lead: string;
  overview: string[];
  readingPath: Array<{
    value: string;
    label: string;
    title: string;
    body: string;
    detail: string;
  }>;
  sections: Array<{
    number: string;
    title: string;
    paragraphs: string[];
  }>;
  modules: TutorialArticleModule[];
  quote: string;
  examQuestions: Array<{
    prompt: string;
    choices: string[];
  }>;
  accuracyNotes: string[];
};

const buildQuestion = (prompt: string, choices: string[]) => ({ prompt, choices });

export const tutorialArticleBlueprints: Record<string, TutorialArticleBlueprint> = {
  "understanding-design-layers": {
    summary:
      "Learn how design layers separate architecture, scenery, and lighting into readable drawing planes with visibility, scale, and stacking-order control.",
    lead:
      "Design layers are the file’s drawing planes. They let architecture, scenery, and lighting occupy the same Vectorworks document while still being read, hidden, grayed, reordered, or drafted one system at a time.",
    overview: [
      "Design layers behave like stacked sheets of paper or vellum. The architecture can sit below, the scenic ground plan can sit above it, and the lighting plot can sit above that without collapsing every discipline into one visual field.",
      "The Pajama Game file makes the idea concrete. In the Navigation palette, layer names sit beside stacking order and visibility controls, so the drafter can reveal or quiet Set Ground Plan, Architectural Stage Ground Plan, and Architectural House Ground Plan as needed.",
      "The working habits are practical: use visibility to decide what should read, use stacking order to decide what appears in front, and use layer options such as Gray/Snap Others or Show/Snap Others to keep reference information available without making the active layer feel ambiguous.",
    ],
    readingPath: [
      {
        value: "separate",
        label: "Separate",
        title: "Separate systems without splitting the file",
        body: "Architecture, scenic drafting, and lighting each need room to be read. Design layers give each system a plane while keeping the project coordinated in one document.",
        detail: "Think of each layer as a drafting sheet in the same stack.",
      },
      {
        value: "read",
        label: "Read",
        title: "Use the Navigation palette to manage attention",
        body: "Layer visibility changes what the drawing is asking you to notice. Showing, hiding, or graying other layers keeps the active work clear without losing context.",
        detail: "Use the visibility and stacking-order columns as the main controls.",
      },
      {
        value: "draft",
        label: "Draft",
        title: "Choose layer options for the task",
        body: "Gray/Snap Others, Show Others, Show/Snap Others, and Show/Snap/Modify Others each change how much access the active layer has to the surrounding drawing.",
        detail: "Show/Snap/Modify Others is powerful, but risky when a file is dense.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Design layers are stacked drafting planes",
        paragraphs: [
          "Design layers are easiest to understand through traditional drafting practice: different sheets of paper or vellum can carry different parts of the same design. In Vectorworks, those sheets become drawing planes inside one file.",
          "That is why a scenic ground plan, architectural reference, and lighting plot can share the same project without becoming one tangled drawing. They stay coordinated because they occupy the same space, but they stay readable because each layer can be shown, hidden, grayed, or reordered.",
        ],
      },
      {
        number: "02",
        title: "Stacking order changes what reads first",
        paragraphs: [
          "In the Navigation palette, stacking order sits beside the layer names. A simple overlap makes the rule visible: when layers occupy the same area, the higher layer in the stack appears in front.",
          "That matters because scenic drafting is full of overlap. Architecture, masking, furniture, platforms, lighting positions, and notes all compete for attention. Stacking order becomes a reading tool, not just a list order.",
        ],
      },
      {
        number: "03",
        title: "Layer options decide what can be seen, snapped, or modified",
        paragraphs: [
          "Layer options behave like drafting permissions. Gray/Snap Others keeps other layers visible in gray and available for snapping. Show Others makes other layers visible but not snappable. Show/Snap Others allows reference and snapping.",
          "Show/Snap/Modify Others gives the broadest access, which is why it needs care. The safer habit is to keep surrounding information visible enough to guide the work while keeping authorship clear.",
        ],
      },
    ],
    modules: [
      {
        label: "Navigation palette",
        title: "Layer stack visibility",
        body: "Show, gray, or hide architecture, scenery, and lighting as separate drawing planes to understand why visibility is a reading tool.",
        visual: "layer-stack",
        points: ["Architecture can become reference.", "Scenery can become the active read.", "Lighting can stay coordinated without crowding the scenic layer."],
      },
      {
        label: "Layer scale",
        title: "Scale consistency check",
        body: "A layer system only works cleanly when related layers share the right scale and naming logic.",
        visual: "scale-check",
        points: ["Match layer scales before drafting.", "Name layers by discipline and purpose.", "Use stacking order to control emphasis."],
      },
    ],
    quote:
      "Design layers are not storage bins. They are a way to decide what the drawing is allowed to say at any moment.",
    examQuestions: [
      buildQuestion("What is the main conceptual comparison used to explain design layers?", [
        "A set of folders in the Resource Manager",
        "A stack of drafting sheets or vellum",
        "A series of viewports on a sheet layer",
        "A collection of classes assigned to one object",
      ]),
      buildQuestion("What does changing the stacking order of design layers affect?", [
        "Which layers export to PDF",
        "Which layer names appear in bold",
        "Which overlapping elements appear in front",
        "Whether classes can be edited",
      ]),
      buildQuestion("Why is Show/Snap/Modify Others a mode that should be used carefully?", [
        "It can allow edits to visible layers beyond the active working layer",
        "It removes all class attributes from the drawing",
        "It prevents viewports from updating",
        "It changes every layer to sheet-layer scale",
      ]),
    ],
    accuracyNotes: [
      "Transcript language around Navigation palette/tab should be cleaned in article copy.",
      "Ground Plane appears where Ground Plan is likely intended.",
      "Layer option advice is workflow guidance, not a universal software rule.",
    ],
  },
  "understanding-classes": {
    summary:
      "Learn how classes control object appearance, attributes, hierarchy, and visibility across a scenic drafting file.",
    lead:
      "Classes are the graphic control system of a Vectorworks file. They do not hold the drawing the way design layers do; they define how objects look, organize, and show, gray, or hide across saved views, viewports, and drawing contexts.",
    overview: [
      "A strong class system lets a file stay visually legible even as the drawing becomes dense. Line weights, fills, textures, and visibility can be managed consistently instead of adjusted object by object.",
      "Scenic drafting depends on that control because drawings mix architecture, dimensions, scenic objects, masking, notes, and 3D elements. Classes let those categories behave predictably across views.",
    ],
    readingPath: [
      {
        value: "name",
        label: "Name",
        title: "Use class names as structure",
        body: "Hyphenated class names create hierarchy, so related drawing categories can stay grouped and searchable.",
        detail: "Class names should describe graphic purpose, not only object type.",
      },
      {
        value: "style",
        label: "Style",
        title: "Let classes carry attributes",
        body: "Class attributes are powerful because they standardize linework, fills, and textures across objects.",
        detail: "Use at Creation turns the class into a style rule instead of a label.",
      },
      {
        value: "visible",
        label: "Visible",
        title: "Control what the drawing shows",
        body: "Class visibility can clarify a drawing without moving objects to a new layer or deleting information.",
        detail: "Visibility is one of the main ways classes support documentation views.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Classes describe graphic behavior",
        paragraphs: [
          "A class is not a place where an object lives. It is a set of graphic and visibility instructions that can travel with that object across the file.",
          "That difference is what separates classes from design layers. Layers organize drawing planes. Classes organize how objects appear and whether they are visible in a given view.",
        ],
      },
      {
        number: "02",
        title: "Use at Creation keeps standards intact",
        paragraphs: [
          "When class attributes are used at creation, an object can inherit the correct line weight, fill, color, texture, or visibility behavior automatically.",
          "That makes the drawing more consistent and easier to revise. Instead of selecting dozens of objects to fix a graphic standard, the class can carry the standard for the whole category.",
        ],
      },
    ],
    modules: [
      {
        label: "Class hierarchy",
        title: "Class naming hierarchy",
        body: "See how hyphenated names group related classes and make a file easier to scan.",
        visual: "class-attributes",
        points: ["S-Ground Plan", "S-Walls", "S-Trim", "Dimension"],
      },
      {
        label: "Class attributes",
        title: "Class-controlled or manually overridden",
        body: "Check the difference between an object that follows class attributes and one that has been manually styled.",
        visual: "class-attributes",
        points: ["Class-controlled objects revise globally.", "Manual overrides can hide drafting standards.", "Visibility can be managed without moving geometry."],
      },
    ],
    quote:
      "Classes make a drawing easier to trust because graphic standards stop depending on memory.",
    examQuestions: [
      buildQuestion("What is the primary role of a class in Vectorworks?", [
        "To control object appearance and visibility",
        "To create a sheet layer",
        "To change the project origin",
        "To publish a PDF",
      ]),
      buildQuestion("What does Use at Creation support?", [
        "Class-based attributes applied automatically to new objects",
        "Automatic viewport cropping",
        "Layer stacking order",
        "Sheet title block numbering",
      ]),
      buildQuestion("Why use hyphenated class names?", [
        "To create readable class hierarchy",
        "To force all objects onto the None class",
        "To convert classes into symbols",
        "To prevent class visibility changes",
      ]),
    ],
    accuracyNotes: [
      "The five-square demonstration transcript is brief, so avoid inventing missing steps.",
      "Modeling in None is a Brandon workflow standard and should be framed as such.",
    ],
  },
  "understanding-symbols": {
    summary:
      "Learn how 2D symbols behave in the Resource Manager and drawing, including grouped and page-based behavior, instance scaling, and definition editing.",
    lead:
      "2D symbol behavior comes down to what the placed object becomes: a linked symbol instance, an independent group, or a page-based object that responds to sheet scale.",
    overview: [
      "The Resource Manager is the starting point. Simple 2D square symbols, each marked with a small 2, show how a reusable drawing object behaves before and after placement.",
      "Color coding matters because it predicts behavior. A standard symbol name appears in black. A grouped symbol appears in blue and converts to a group when placed. A page-based symbol appears in green and responds to page scale.",
      "The strongest distinction is between the stored symbol definition and the placed symbol instance. Scaling an instance from the Object Info palette changes that placement. Editing the definition changes linked instances together.",
    ],
    readingPath: [
      {
        value: "read",
        label: "Read",
        title: "Read the Resource Manager before placing",
        body: "The symbol name color and 2D marker tell the drafter what kind of object is about to enter the drawing.",
        detail: "Black, blue, and green symbol names behave differently after placement.",
      },
      {
        value: "place",
        label: "Place",
        title: "Check what the placed object becomes",
        body: "A standard symbol stays linked. A grouped symbol converts into an independent group. A page-based symbol responds to page scale.",
        detail: "The Object Info palette confirms whether the placed object is still a 2D symbol or now a group.",
      },
      {
        value: "edit",
        label: "Edit",
        title: "Choose instance scale or definition edit",
        body: "Local scaling belongs to the placed instance. Global visual change belongs to the symbol definition.",
        detail: "One placed symbol can be scaled locally while a definition edit updates linked copies.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "A 2D symbol is a reusable drawing object",
        paragraphs: [
          "A 2D symbol stores reusable drawing geometry so it can be placed, scaled, edited, or converted into different object behavior without starting from raw linework every time.",
          "That matters for scenic drafting because repeated 2D elements should not always be copied as raw geometry. A repeated object becomes easier to place, find, update, and standardize when it lives in the Resource Manager.",
        ],
      },
      {
        number: "02",
        title: "Scaling an instance does not rewrite the definition",
        paragraphs: [
          "The Object Info palette can scale a placed symbol instance symmetrically or asymmetrically. A two-inch symbol scaled by a factor of two measures four inches in the drawing.",
          "When the symbol component is opened for editing, the original geometry is still two inches by two inches. That is the key: instance scale changes the placement, not the stored symbol definition.",
        ],
      },
      {
        number: "03",
        title: "Grouped and page-based symbols change the placement rules",
        paragraphs: [
          "A blue symbol name indicates a grouped symbol. When placed, it becomes a group, and editing one group does not change another. That behavior is useful when the symbol is a starting point rather than a linked standard.",
          "A green symbol name indicates a page-based symbol. Page-based symbols respond to page scale, making them useful for documentation graphics rather than real-world model geometry.",
        ],
      },
    ],
    modules: [
      {
        label: "Legend",
        title: "Resource Manager color coding",
        body: "Use the symbol color as a behavior clue before placing the object.",
        visual: "symbol-instance",
        points: ["Black: standard linked symbol.", "Blue: grouped symbol.", "Green: page-based symbol."],
      },
      {
        label: "Editor",
        title: "Instance versus definition",
        body: "Separate a local scale change from a definition edit that updates every linked placement.",
        visual: "symbol-instance",
        points: ["Scale one placed instance.", "Edit the definition for global changes.", "Convert only when independence is needed."],
      },
    ],
    quote:
      "The safest symbol workflow starts by asking what should stay linked and what should become independent.",
    examQuestions: [
      buildQuestion("Which statement best describes a symbol instance?", [
        "A placed occurrence of a symbol in the drawing",
        "A sheet layer title block",
        "A class visibility setting",
        "A render mode",
      ]),
      buildQuestion("Why edit a symbol definition?", [
        "To update all linked symbol instances",
        "To change only one placed symbol scale",
        "To publish a PDF",
        "To delete a class hierarchy",
      ]),
      buildQuestion("What does a page-based symbol respond to?", [
        "Page scale",
        "Layer stacking order only",
        "Renderworks texture scale",
        "The project origin",
      ]),
    ],
    accuracyNotes: [
      "The tutorial demonstrates mainly 2D symbol behavior.",
      "Shortcut mappings may vary by platform or custom workspace.",
      "Page-based behavior should be checked against the installed Vectorworks version.",
    ],
  },
  "resource-manager-basics": {
    summary:
      "Learn how the Resource Manager organizes, previews, imports, filters, and applies reusable Vectorworks resources.",
    lead:
      "A strong Vectorworks file depends on resource discipline. Symbols, textures, folders, previews, and library content all become easier to use when the Resource Manager is treated as a working library rather than a storage drawer.",
    overview: [
      "The Resource Manager is where reusable content becomes visible and manageable. It separates file browsing from resource browsing so a drafter can understand where a resource comes from and what kind of object it is.",
      "Organizing resources, creating folders, searching, filtering, and pulling library content into the active file makes the Resource Manager part of everyday drafting rather than something opened only when a symbol is missing.",
    ],
    readingPath: [
      {
        value: "find",
        label: "Find",
        title: "Know where resources live",
        body: "The file browser and resource viewer answer different questions: which file are you looking at, and which resources are inside it?",
        detail: "Location matters before import, edit, or placement.",
      },
      {
        value: "filter",
        label: "Filter",
        title: "Search by resource type",
        body: "Filtering keeps a broad library from becoming noise. A texture search should not behave like a symbol search.",
        detail: "Good filters reduce false results.",
      },
      {
        value: "organize",
        label: "Organize",
        title: "Folder structure is part of the workflow",
        body: "A resource is easier to reuse when it is named and stored where another drafter can find it.",
        detail: "Resource discipline becomes collaboration discipline.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "A resource library needs geography",
        paragraphs: [
          "The Resource Manager gives the file a kind of map. Without that map, reusable content becomes invisible, duplicated, or inconsistently named.",
          "The panes matter because they tell the drafter whether they are browsing the active file, a library file, or a filtered set of resources.",
        ],
      },
      {
        number: "02",
        title: "Search is only useful when the resource type is clear",
        paragraphs: [
          "Searching for glass across every resource can return too much. Searching for glass as a Renderworks texture is much more useful when the goal is material assignment.",
          "Filtering is therefore a drafting skill. It helps a user move from browsing to selecting the correct reusable object.",
        ],
      },
    ],
    modules: [
      {
        label: "Map",
        title: "Resource Manager anatomy",
        body: "Separate file navigation from resource selection before importing or applying anything.",
        visual: "resource-filter",
        points: ["File Browser", "Resource Viewer", "Preview", "Search and filters"],
      },
      {
        label: "Search",
        title: "Filter before choosing",
        body: "A filtered search helps students understand why resource type matters.",
        visual: "resource-filter",
        points: ["Search a term.", "Limit by resource type.", "Import or apply deliberately."],
      },
    ],
    quote:
      "A resource is only reusable if someone can find it, understand it, and trust where it came from.",
    examQuestions: [
      buildQuestion("What is the Resource Manager primarily used for?", [
        "Finding, organizing, importing, and applying reusable resources",
        "Changing layer stacking order",
        "Editing only sheet layer titles",
        "Publishing files to PDF",
      ]),
      buildQuestion("Why filter resource searches?", [
        "To narrow results by resource type",
        "To delete unused layers",
        "To change the drawing origin",
        "To force all textures to become symbols",
      ]),
      buildQuestion("Why are resource folders useful?", [
        "They make reusable content easier to find and manage",
        "They replace classes",
        "They control viewport scale",
        "They prevent symbols from being edited",
      ]),
    ],
    accuracyNotes: [
      "OpenGL may now appear as Shaded in current Vectorworks versions.",
      "Cloud library access depends on account and internet availability.",
    ],
  },
  "installing-workspace-template": {
    summary:
      "Learn how a shared Vectorworks user folder, workspace, and template standardize tools and document settings for a class or team.",
    lead:
      "Consistent drafting begins before the first line is drawn. A shared user folder, workspace, and template make sure everyone starts with the same tools, palettes, and document standards.",
    overview: [
      "This workflow is about setup discipline. The correct folder has to be installed in the correct location, Vectorworks has to restart, and the user has to confirm that the intended workspace and template are active.",
      "For students, the value is not just convenience. It reduces technical mismatch in class, keeps instruction aligned, and makes troubleshooting possible when everyone is using the same starting point.",
    ],
    readingPath: [
      {
        value: "place",
        label: "Place",
        title: "Install the right folder in the right location",
        body: "The shared user folder only works if Vectorworks can find it.",
        detail: "Choose the top-level user folder, not a nested partial folder.",
      },
      {
        value: "restart",
        label: "Restart",
        title: "Let Vectorworks reload the workspace",
        body: "A restart confirms that the installed resources are recognized by the application.",
        detail: "Skipping restart can make a correct install look broken.",
      },
      {
        value: "verify",
        label: "Verify",
        title: "Check workspace and template before drafting",
        body: "A template or workspace is only useful if the student is actually using it.",
        detail: "Verification prevents a whole assignment from starting in the wrong file setup.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Templates are curriculum infrastructure",
        paragraphs: [
          "A teaching template carries more than preferences. It carries assumptions about layers, classes, palettes, resources, title blocks, and drafting standards.",
          "When every student begins from the same template, the class can focus on design and workflow instead of diagnosing mismatched setup.",
        ],
      },
      {
        number: "02",
        title: "Installation needs confirmation",
        paragraphs: [
          "The installation workflow should end with visible proof: the right workspace appears, palettes are arranged correctly, and the intended template can be opened.",
          "That final check is what turns file copying into setup. Without it, the user may not know whether Vectorworks has actually loaded the shared environment.",
        ],
      },
    ],
    modules: [
      {
        label: "Install path",
        title: "Where does the user folder go?",
        body: "A clear path helps students avoid copying the right files into the wrong location.",
        visual: "install-checklist",
        points: ["Find the Vectorworks user folder.", "Replace or add the shared folder as instructed.", "Restart before testing."],
      },
      {
        label: "Checklist",
        title: "Post-install verification",
        body: "The install is not complete until the workspace and template are visibly active.",
        visual: "install-checklist",
        points: ["Workspace selected.", "Palettes loaded.", "Template opens correctly."],
      },
    ],
    quote:
      "A shared template is a teaching agreement: everyone starts from the same drafting language.",
    examQuestions: [
      buildQuestion("What is the purpose of a shared user folder?", [
        "To standardize workspace resources and settings",
        "To publish the final PDF",
        "To scale viewports",
        "To render textures faster",
      ]),
      buildQuestion("Why restart Vectorworks after installation?", [
        "So Vectorworks reloads the installed workspace resources",
        "So all classes are deleted",
        "So sheet layers become design layers",
        "So symbols convert to groups",
      ]),
      buildQuestion("What should be verified before drafting begins?", [
        "That the intended workspace and template are active",
        "That every object is selected",
        "That all resources are cloud-based",
        "That the PDF is already published",
      ]),
    ],
    accuracyNotes: [
      "Transcript is Vectorworks 2021 and UTEP-specific.",
      "Deleting default workspaces should be framed carefully as admin or course-specific guidance.",
      "Paths should be updated for current Mac and Windows versions before public instructions become final.",
    ],
  },
  "navigating-user-interface": {
    summary:
      "Learn the Vectorworks interface through menus, palettes, view controls, coordinate axes, and the tools scenic designers use most often.",
    lead:
      "Learning Vectorworks begins with orientation. Before a student can draft confidently, they need to know where tools live, what each palette controls, and how the X, Y, and Z world organizes the scenic model.",
    overview: [
      "The interface is not a random collection of panels. The Object Info palette, Navigation palette, Resource Manager, tool palettes, and View Bar each answer a different kind of question.",
      "The interface also grounds the user spatially. Staying near the origin, reading the axis directions, and switching views are not abstract tasks. They are the foundation for keeping a scenic model understandable.",
    ],
    readingPath: [
      {
        value: "locate",
        label: "Locate",
        title: "Know where the main controls live",
        body: "Menus, palettes, and the View Bar each control different parts of the workflow.",
        detail: "A student who knows where to look can solve problems faster.",
      },
      {
        value: "orient",
        label: "Orient",
        title: "Read the X, Y, Z world",
        body: "The origin and axes define where scenery lives in the file.",
        detail: "Spatial orientation prevents modeling drift and view confusion.",
      },
      {
        value: "navigate",
        label: "Navigate",
        title: "Switch views with intention",
        body: "Top/Plan, isometric, and orthographic views each reveal different information.",
        detail: "View switching is part of thinking, not just moving the camera.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "The interface is a control map",
        paragraphs: [
          "Every palette has a job. Object Info edits the selected object. Navigation helps manage file structure. Resource Manager handles reusable content. Tool palettes create and modify geometry.",
          "Students become faster when they stop hunting and start matching the question to the right interface area.",
        ],
      },
      {
        number: "02",
        title: "Orientation is part of modeling",
        paragraphs: [
          "The X, Y, and Z axes determine how a scenic model sits in space. If the user loses track of direction or origin, the drawing becomes harder to navigate and harder to troubleshoot.",
          "The interface lesson therefore connects screen literacy with spatial literacy. Knowing the palettes matters, but so does knowing where the model is in the world.",
        ],
      },
    ],
    modules: [
      {
        label: "Map",
        title: "Interface hotspot map",
        body: "Group controls by what they help the drafter decide.",
        visual: "interface-map",
        points: ["Object Info", "Navigation", "Resource Manager", "View Bar"],
      },
      {
        label: "Axes",
        title: "Origin and view orientation",
        body: "A simple axis model helps connect interface navigation to scenic space.",
        visual: "interface-map",
        points: ["X axis", "Y axis", "Z height", "Top/Plan versus isometric"],
      },
    ],
    quote:
      "The interface gets easier when each palette becomes an answer to a specific drafting question.",
    examQuestions: [
      buildQuestion("Which palette is commonly used to inspect and edit a selected object?", [
        "Object Info palette",
        "Resource Manager only",
        "Publish dialog",
        "Sheet border",
      ]),
      buildQuestion("Why does the origin matter?", [
        "It anchors the drawing in the Vectorworks coordinate world",
        "It changes every symbol into a group",
        "It controls title block text",
        "It replaces the Navigation palette",
      ]),
      buildQuestion("What does view switching help with?", [
        "Seeing the model from different drafting and modeling orientations",
        "Deleting unused resources",
        "Changing every class attribute",
        "Publishing all pages",
      ]),
    ],
    accuracyNotes: [
      "Shortcut mappings vary by keyboard and workspace.",
      "Rotate Plan should be clarified carefully for current usage.",
      "UI layout can be template-specific.",
    ],
  },
  "basics-tool-palette": {
    summary:
      "Learn the foundational 2D drafting tools in the Vectorworks Basics palette, including selection, navigation, annotation, shapes, and tool modes.",
    lead:
      "The Basics palette is where 2D drafting starts to become fluent. Students learn not just which tool draws which shape, but how modes, shortcuts, and editable geometry change the way a drawing is built.",
    overview: [
      "The workflow moves from selection and navigation into annotation and drawing tools. That sequence matters because drafting begins with controlling the interface before creating geometry.",
      "Tool modes are small drafting decisions. A rectangle, circle, polyline, or double-line polygon changes behavior depending on the active mode, and those mode choices shape the resulting drawing.",
    ],
    readingPath: [
      {
        value: "select",
        label: "Select",
        title: "Control what is active",
        body: "Selection and navigation tools keep the user oriented before drawing begins.",
        detail: "A confident drafter knows how to get back to the object they intend to edit.",
      },
      {
        value: "draw",
        label: "Draw",
        title: "Choose the right shape tool",
        body: "Primitive and organic tools solve different drafting problems.",
        detail: "A rectangle, polygon, polyline, and double-line tool each imply a different kind of control.",
      },
      {
        value: "mode",
        label: "Mode",
        title: "Use modes as small decisions",
        body: "Tool modes change how geometry is created without changing tools.",
        detail: "The U and I keys can make mode switching feel like part of drawing.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "The first skill is control",
        paragraphs: [
          "Before a student can draw quickly, they need to select, pan, zoom, and return to tools without getting lost. That is why the basic interface tools belong in the same lesson as drawing tools.",
          "Control over the view and selection state reduces accidental edits and makes the rest of the palette easier to learn.",
        ],
      },
      {
        number: "02",
        title: "Tool modes are drafting choices",
        paragraphs: [
          "A tool mode is a small design decision. It changes whether a shape is drawn from a corner, center, radius, or path, and it changes how precise or flexible the geometry feels.",
          "Students who learn modes early stop treating tools as fixed buttons and start treating them as adjustable drafting behaviors.",
        ],
      },
    ],
    modules: [
      {
        label: "Tool reference",
        title: "Basics palette map",
        body: "Organize the palette by task so students know why a tool exists.",
        visual: "tool-palette",
        points: ["Select and navigate", "Annotate", "Draw primitives", "Draw editable organic shapes"],
      },
      {
        label: "Mode bar",
        title: "Tool mode practice",
        body: "A focused Tool bar practice pass helps students see how one tool can behave several ways.",
        visual: "tool-palette",
        points: ["Rectangle modes", "Circle modes", "Polyline vertices", "Double-line spacing"],
      },
    ],
    quote:
      "The Basics palette becomes powerful when students learn the modes, not just the icons.",
    examQuestions: [
      buildQuestion("What is the purpose of tool modes?", [
        "To change how the active tool creates geometry",
        "To publish a PDF",
        "To delete a design layer",
        "To rename every class",
      ]),
      buildQuestion("Which tool type is useful for editable organic outlines?", [
        "Polyline",
        "Title block",
        "Resource folder",
        "Render style",
      ]),
      buildQuestion("Why practice selection and navigation first?", [
        "They prevent confusion before geometry is created or edited",
        "They replace the need for classes",
        "They change all symbols into page-based symbols",
        "They automatically dimension a sheet",
      ]),
    ],
    accuracyNotes: [
      "Shortcut mappings may be workspace-specific.",
      "Transcript text around corner vertex mode appears mistranscribed.",
    ],
  },
  "creating-24x36-pdfs": {
    summary:
      "Learn how to create a single 24x36 PDF without a plotter by setting the sheet size and publishing the full printable area to one page.",
    lead:
      "Large-format PDF output is not a hardware problem. It is a page setup and publish settings problem: the sheet must be the correct size, and the export must treat the whole printable area as one page.",
    overview: [
      "The core problem is tiling. A 24x36 sheet can appear as a grid of smaller pages if Vectorworks is still thinking in desktop-printer paper sizes.",
      "The fix is to set the sheet layer to the intended Arch D size, then publish with the setting that exports the whole printable area to one page.",
    ],
    readingPath: [
      {
        value: "size",
        label: "Size",
        title: "Set the sheet before publishing",
        body: "The PDF cannot become one large page if the drawing is still configured around smaller printer tiles.",
        detail: "Page Setup is part of the drawing, not just the print dialog.",
      },
      {
        value: "publish",
        label: "Publish",
        title: "Choose one full printable area",
        body: "Publishing should export the full sheet as a single page rather than each tile as a separate page.",
        detail: "This is the key setting that prevents multi-page tiling.",
      },
      {
        value: "check",
        label: "Check",
        title: "Open the PDF and confirm the result",
        body: "The final PDF should read as one 24x36 page, not a bundle of letter-sized fragments.",
        detail: "Verification catches the mistake before sending the file to someone else.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Page breaks reveal a setup mismatch",
        paragraphs: [
          "When a large sheet is divided into many small printable regions, the file is telling you that the output setup still belongs to a smaller page size.",
          "The visible page breaks are useful because they show the problem before export. They are not the drawing failing; they are the page setup asking to be corrected.",
        ],
      },
      {
        number: "02",
        title: "The publish setting decides the final PDF behavior",
        paragraphs: [
          "A correctly sized sheet can still publish incorrectly if the export treats every printable tile as a separate page.",
          "For this workflow, the goal is the whole printable area on one page. That setting is what turns the sheet into a single large-format PDF.",
        ],
      },
    ],
    modules: [
      {
        label: "Page setup",
        title: "Page break grid",
        body: "See why a large sheet can become many small pages when the print area is not configured correctly.",
        visual: "page-breaks",
        points: ["Small printer tiles", "24x36 sheet boundary", "One-page output target"],
      },
      {
        label: "Decision",
        title: "Publish setup check",
        body: "Check tiled page export against whole-printable-area export.",
        visual: "page-breaks",
        points: ["Avoid exporting every tile.", "Use the full printable area.", "Confirm page size after export."],
      },
    ],
    quote:
      "The plotter is not the issue. The file has to understand the sheet before the PDF can.",
    examQuestions: [
      buildQuestion("What causes a 24x36 sheet to export as many smaller pages?", [
        "The printable area is still divided into smaller paper tiles",
        "The drawing contains too many symbols",
        "The Resource Manager is closed",
        "The layer scale is set to 1:1",
      ]),
      buildQuestion("What should the final PDF represent?", [
        "One full 24x36 printable area",
        "A set of separate letter-size pages",
        "Only the active design layer",
        "Only visible classes",
      ]),
      buildQuestion("Why open the exported PDF before sharing it?", [
        "To confirm the sheet exported as one correct page",
        "To convert it into a symbol",
        "To change Vectorworks class attributes",
        "To import cloud resources",
      ]),
    ],
    accuracyNotes: [
      "Transcript is Windows and PDF-writer flavored.",
      "Mac print drivers and dialog names can differ.",
      "Do not generalize the All Pages publish setting across every workflow.",
    ],
  },
  "sheet-layers": {
    summary:
      "Learn how sheet layers turn design-layer drawings into printable documentation through viewports, crops, title blocks, labels, and scale controls.",
    lead:
      "Professional drafting depends on separating drawing space from presentation space. Sheet layers do not replace the model or plan. They frame, scale, label, and publish it for someone else to read.",
    overview: [
      "A sheet layer is where drafted information becomes a document. Viewports bring design-layer geometry onto the sheet without moving the source drawing itself.",
      "Crops, drawing labels, title blocks, and scale controls make the sheet legible while the presentation layer stays connected to the underlying drawing.",
    ],
    readingPath: [
      {
        value: "source",
        label: "Source",
        title: "Keep drawing space separate",
        body: "Design layers hold the drawing information. Sheet layers compose that information for output.",
        detail: "The source stays editable even after the sheet is arranged.",
      },
      {
        value: "frame",
        label: "Frame",
        title: "Use viewports to crop and scale",
        body: "A viewport frames part of the design layer and presents it at the scale the sheet needs.",
        detail: "Cropping and scaling are presentation decisions.",
      },
      {
        value: "publish",
        label: "Publish",
        title: "Use title blocks and labels for document clarity",
        body: "Sheet metadata, drawing labels, and title blocks help the page behave like a coordinated drawing.",
        detail: "A good sheet tells the reader what they are looking at.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "The sheet is a presentation layer",
        paragraphs: [
          "Sheet layers let the drawing be composed for output without redrawing the source geometry. That separation is one of the main reasons Vectorworks documentation stays flexible.",
          "A design layer can continue to hold the live drawing, while the sheet layer controls how that drawing appears to the reader.",
        ],
      },
      {
        number: "02",
        title: "Viewports translate the drawing",
        paragraphs: [
          "A viewport is the bridge between model space and sheet space. It can crop a drawing, set its scale, and carry annotations without changing the original geometry.",
          "That makes the viewport one of the most important documentation tools in scenic drafting.",
        ],
      },
    ],
    modules: [
      {
        label: "Viewport flow",
        title: "Design layer versus sheet layer",
        body: "Separate the source drawing from the presentation sheet.",
        visual: "sheet-viewport",
        points: ["Design layer: source geometry", "Viewport: framed translation", "Sheet layer: output composition"],
      },
      {
        label: "Viewport crop",
        title: "Viewport crop sequence",
        body: "Show how a crop decides what part of the design layer appears on the sheet.",
        visual: "sheet-viewport",
        points: ["Draw crop.", "Create viewport.", "Set scale and label."],
      },
    ],
    quote:
      "A sheet layer is where a drawing becomes a document.",
    examQuestions: [
      buildQuestion("What is the role of a viewport on a sheet layer?", [
        "To present design-layer information at a chosen crop and scale",
        "To replace the Resource Manager",
        "To rename all classes",
        "To convert all objects into symbols",
      ]),
      buildQuestion("Why keep design-layer geometry separate from sheet-layer presentation?", [
        "So the source drawing can remain editable while the sheet controls output",
        "So the drawing cannot be dimensioned",
        "So classes stop working",
        "So every viewport exports as a separate file",
      ]),
      buildQuestion("What does a title block support?", [
        "Sheet identification and document metadata",
        "Texture mapping",
        "Layer snapping",
        "Add/Subtract/Intersect Solids",
      ]),
    ],
    accuracyNotes: [
      "Palette names should stay precise between Navigation and Object Info.",
      "Shortcuts may vary by platform or custom workspace.",
    ],
  },
  "2d-annotations-dimensioning": {
    summary:
      "Learn how viewport annotations, labels, dimensions, markers, detail viewports, and publishing settings turn drafted views into readable documentation.",
    lead:
      "Dimensions are only trustworthy when they live in the scale context of the drawing they describe. Annotation is not decoration; it is how a sheet becomes readable, measurable, and navigable.",
    overview: [
      "A strong annotation workflow starts with drafted information already built in the design layer: a plan view, a front elevation, and wall sections. Viewports move that information into a sheet context.",
      "Once the viewports are created, annotation mode becomes the correct place for dimensions, drawing labels, section markers, callouts, and detail references.",
    ],
    readingPath: [
      {
        value: "viewport",
        label: "Viewport",
        title: "Enter the correct scale context",
        body: "Dimensions should be placed where the viewport scale can interpret them correctly.",
        detail: "Sheet space and viewport annotation space do not behave the same.",
      },
      {
        value: "dimension",
        label: "Dimension",
        title: "Use dimension modes intentionally",
        body: "Constrained linear and constrained chain dimensions solve different documentation needs.",
        detail: "Continuous strings support readable overall and opening dimensions.",
      },
      {
        value: "reference",
        label: "Reference",
        title: "Connect views with markers and details",
        body: "Section markers, callouts, and detail viewports help readers move through the sheet.",
        detail: "A finished drawing is a network of references.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Annotation belongs inside the viewport",
        paragraphs: [
          "The same graphic line can mean different things depending on where it is dimensioned. Inside viewport annotation mode, the dimension understands the viewport scale.",
          "That is why annotation context matters. It is the difference between a measurement that communicates and a measurement that simply appears on the page.",
        ],
      },
      {
        number: "02",
        title: "Dimension strings create reading rhythm",
        paragraphs: [
          "Constrained linear dimensions are useful for single measurements. Constrained chain dimensions let a drafter continue across related distances without rebuilding the workflow each time.",
          "That continuity makes wall lengths, openings, and overall dimensions easier to read as a system.",
        ],
      },
      {
        number: "03",
        title: "Details and markers make the sheet navigable",
        paragraphs: [
          "A section marker or detail callout does more than label a view. It tells the reader where to go next.",
          "Good documentation is navigable. It reduces guessing by making relationships between drawings visible.",
        ],
      },
    ],
    modules: [
      {
        label: "Scale",
        title: "Viewport annotation scale",
        body: "Read the same line in sheet space and viewport annotation space.",
        visual: "annotation-scale",
        points: ["Sheet-space dimensions can misread scale.", "Viewport annotations match the presented drawing.", "Labels and markers belong with the view they describe."],
      },
      {
        label: "Modes",
        title: "Linear versus chain dimensions",
        body: "Switch between dimension modes to understand when each one supports cleaner documentation.",
        visual: "annotation-scale",
        points: ["Single measurement", "Continuous string", "Overall dimension"],
      },
    ],
    quote:
      "A dimension is only useful when the drawing context can tell it what it means.",
    examQuestions: [
      buildQuestion("Why add dimensions inside viewport annotation mode?", [
        "Because the dimensions use the viewport scale context",
        "Because classes do not work on sheet layers",
        "Because symbols cannot be placed on sheets",
        "Because title blocks require it",
      ]),
      buildQuestion("What is the benefit of constrained chain dimensioning?", [
        "It supports continuous dimension strings",
        "It creates a new design layer",
        "It converts lines into solids",
        "It deletes the viewport crop",
      ]),
      buildQuestion("What do section markers and detail viewports help create?", [
        "Navigation between related drawings",
        "Texture mapping",
        "Resource folders",
        "Layer stacking order",
      ]),
    ],
    accuracyNotes: [
      "Publish settings differ from the 24x36 one-page PDF workflow.",
      "Some class and style names are file-specific.",
    ],
  },
  "2d-edit-modify-tricks": {
    summary:
      "Learn how core 2D edit and modify commands reshape, mirror, offset, split, connect, transform, combine, and duplicate geometry efficiently.",
    lead:
      "The 2D edit tools are not decorative shortcuts. They are the commands that keep a scenic drawing editable after the first line is already on the page: mirror it, reshape it, offset it, split it, connect it, compose it, or repeat it along a path.",
    overview: [
      "The Mirror Tool introduces the editing pattern. Standard mode mirrors the selected object to the other side of the axis, while Duplicate mode leaves the original in place and creates the reflected copy.",
      "The next group of tools changes existing geometry. Reshape moves handles and edges or adds and deletes vertices. Offset creates parallel geometry by distance or by points. Split cuts selected objects by line, point, or trim direction. Connect/Combine extends or joins linework depending on the selected mode.",
      "The Modify menu then becomes the drafting command center: Move, Align/Distribute, Rotate, Scale Objects, Add Surface, Clip Surface, Intersect Surface, Convert to Lines, Compose, Decompose, and Duplicate Along Path.",
    ],
    readingPath: [
      {
        value: "transform",
        label: "Transform",
        title: "Use transform commands with intent",
        body: "Mirror, Move, Rotate, and Scale Objects change existing geometry without redrawing it.",
        detail: "The Mirror Tool mode decides whether the original moves or a duplicate is created.",
      },
      {
        value: "reshape",
        label: "Reshape",
        title: "Edit points, edges, offsets, and cuts",
        body: "Reshape, Offset, Split, and Connect/Combine keep the work inside the object instead of forcing a redraw.",
        detail: "The Tool bar mode is the decision point: handles, edges, vertices, distance, points, line split, point split, trim, connect, or combine.",
      },
      {
        value: "system",
        label: "System",
        title: "Use Modify commands for controlled drafting systems",
        body: "Add Surface, Clip Surface, Intersect Surface, Compose, Decompose, and Duplicate Along Path turn simple geometry into controlled 2D drafting.",
        detail: "Duplicate Along Path adds settings for number, distance, offset, centering, and tangency.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "The mode bar is part of the tool",
        paragraphs: [
          "A reliable drafting sequence repeats: select the object, choose the tool, then choose the mode. Mirror has Standard and Duplicate. Reshape has handle, edge, vertex, and delete modes. Offset can duplicate by distance or move by points.",
          "That sequence matters because the icon alone does not define the command. The Tool bar decides whether the drawing moves, duplicates, trims, adds a point, deletes a point, or keeps the original geometry intact.",
        ],
      },
      {
        number: "02",
        title: "Surface commands use overlapping 2D polygons",
        paragraphs: [
          "Surface commands live in the Modify menu. Add Surface merges selected 2D shapes. Clip Surface removes one selected shape from another. Intersect Surface creates a new shape from the overlapping area.",
          "That workflow belongs to 2D drafting: complex scenic outlines are often easier to make from simple rectangles, circles, arcs, and polygons than from one perfect first drawing.",
        ],
      },
      {
        number: "03",
        title: "Duplicate Along Path turns repetition into settings",
        paragraphs: [
          "Duplicate Along Path is not just copy and paste. The command can duplicate by number or fixed distance, apply a start offset, center the objects on the path, and control whether the repeated object follows path tangency.",
          "That makes it useful for repeated scenic elements such as posts, bulbs, decorative units, or any object that needs to follow a straight or curved guide.",
        ],
      },
    ],
    modules: [
      {
        label: "Mirror/Offset modes",
        title: "Mirror and offset mode choices",
        body: "Choose standard or duplicate mode based on whether the original geometry should remain in place.",
        visual: "geometry-ops",
        points: ["Move the original.", "Preserve a duplicate.", "Choose the Tool bar mode before drawing the mirror or offset line."],
      },
      {
        label: "Add/Clip/Intersect",
        title: "Add, Clip, and Intersect Surface workflow",
        body: "Use overlapping 2D polygons to understand Modify > Add Surface, Clip Surface, and Intersect Surface.",
        visual: "geometry-ops",
        points: ["Add surfaces", "Clip surfaces", "Intersect surfaces"],
      },
    ],
    quote:
      "Drafting gets faster when the tool is chosen by the geometry problem, not by habit.",
    examQuestions: [
      buildQuestion("Which Mirror Tool mode keeps the original while creating a reflected copy?", [
        "Duplicate mode",
        "Standard mode",
        "Trim mode",
        "Page-based mode",
      ]),
      buildQuestion("Why use Reshape instead of redrawing a polygon?", [
        "To adjust vertices and edges on existing geometry",
        "To create a sheet layer",
        "To publish all pages",
        "To import a texture library",
      ]),
      buildQuestion("What does Duplicate Along Path control?", [
        "Repeated object placement along a path",
        "Class hierarchy",
        "Viewport title block data",
        "Renderworks background color",
      ]),
    ],
    accuracyNotes: [
      "Modifier keys differ by OS and workspace.",
      "Connect/Combine should be framed as line and geometry focused, not a universal join-all tool.",
    ],
  },
  "creating-trim-profiles-polyline": {
    summary:
      "Trace, scale, and save a crown molding profile as a reusable 2D drafting symbol in Vectorworks.",
    lead:
      "In Vectorworks, mastering the Polyline Tool adds depth to the detail in both modeling and drafting. Crown molding, trim profiles, and small scenic details become stronger when the linework is intentional, dimensioned, and ready to return across future sheets.",
    overview: [
      "The source image gives the profile enough visual information to trace, while the dimensions keep the drawing honest. The goal is not to copy a picture; it is to translate a real product profile into clean scenic drafting geometry.",
      "The useful move is to avoid fighting image scale too early. The Polyline Tool can resolve corners, arcs, and transitions at a comfortable size, then the Object Info palette can bring the finished trace to the correct width and height.",
      "Once the shape reads correctly, the workflow becomes part of a library practice. Class assignment and symbol creation make the trim profile available as a repeatable 2D resource instead of a one-time drawing.",
    ],
    readingPath: [
      {
        value: "source",
        label: "Source",
        title: "Use the reference to set limits",
        body: "The product image supplies the silhouette; the dimensions supply the check against drift.",
        detail: "A useful source provides enough information to draft from, not just a decorative outline to copy.",
      },
      {
        value: "trace",
        label: "Trace",
        title: "Let vertex modes do the work",
        body: "Corner, arc, and point-editing decisions let the trace follow the profile instead of approximating it with one generic curve.",
        detail: "The Polyline Tool becomes useful when the curve is broken into deliberate decisions.",
      },
      {
        value: "reuse",
        label: "Reuse",
        title: "Save the solved detail",
        body: "A classed 2D symbol turns the finished profile into a piece of the drafting library.",
        detail: "The payoff is consistency across future drawings, not just a cleaner line on this one page.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Let the source set the boundary conditions",
        paragraphs: [
          "The opening move is research, not drawing. A molding profile is only useful if the silhouette and the measurements can be held together, so the source needs to show more than a decorative outline.",
          "That does not mean the image has to be perfect. It means the drafter needs enough information to understand what is being traced and what dimension will later anchor the result. The reference establishes the problem before Vectorworks starts solving it.",
        ],
      },
      {
        number: "02",
        title: "Use the Polyline Tool as a drafting instrument",
        paragraphs: [
          "The trace is not a freehand copy. It is a series of choices about where the profile turns sharply, where it rolls into an arc, and where an edited point can make the curve cleaner.",
          "That is why scale waits until later. At this stage, the important question is whether the profile reads correctly. Once the geometry is resolved, Object Info can apply the real dimensions without making the trace itself harder to control.",
        ],
      },
      {
        number: "03",
        title: "Store the result where future sheets can use it",
        paragraphs: [
          "After scaling, the profile becomes more than a traced line. Assigning the correct class and creating a 2D symbol moves the detail into the Resource Manager, where it can return when another sheet needs the same molding.",
          "That is the larger scenic drafting habit underneath the quick tip: solve the detail once, then preserve it in a form that keeps future drawings consistent and editable.",
        ],
      },
    ],
    modules: [
      {
        label: "Trace",
        title: "Polyline vertex modes",
        body: "Break a profile into decisions about corners, arcs, and editable curve points.",
        visual: "trim-profile",
        points: ["Corner vertex", "Arc or radius transition", "Point editing for refinement"],
      },
      {
        label: "Scale",
        title: "Scale after tracing",
        body: "Apply manufacturer dimensions to resolved geometry instead of distorting the reference too early.",
        visual: "trim-profile",
        points: ["Trace at a comfortable size.", "Apply width and height deliberately.", "Match the manufacturer labels."],
      },
    ],
    quote:
      "First make the profile legible. Then make it accurate. Then make it reusable.",
    examQuestions: [
      buildQuestion("Why use a manufacturer reference image?", [
        "It provides visual form and dimensional information",
        "It automatically creates a symbol",
        "It replaces the need for classes",
        "It publishes the sheet",
      ]),
      buildQuestion("Why trace before final scaling?", [
        "It lets the drafter focus on clean geometry first",
        "It prevents symbols from being created",
        "It changes the layer scale",
        "It deletes the reference image automatically",
      ]),
      buildQuestion("Why convert the finished profile into a symbol?", [
        "To reuse the profile across future drawings",
        "To turn it into a title block",
        "To hide every class",
        "To export a texture",
      ]),
    ],
    accuracyNotes: [
      "uDecor is an example reference source, not a guaranteed authority.",
      "Match the manufacturer height and width labels carefully before scaling.",
    ],
  },
  "creating-2d-drafting-from-3d": {
    summary:
      "Learn how 3D and hybrid models become readable 2D construction documents through viewports, render modes, sections, details, annotations, and publishing.",
    lead:
      "A 3D model becomes documentation only when viewports translate it into readable hierarchy: plan, elevation, section, detail, dimension, and line weight.",
    overview: [
      "The workflow begins with a model, but the page is really about translation. Hidden line, Renderworks styles, viewports, section cuts, and detail enlargements determine how the model becomes readable as drafting.",
      "The workflow is especially useful because it shows several levels of representation: a plan or elevation view, a section cut, and a scaled detail.",
    ],
    readingPath: [
      {
        value: "translate",
        label: "Translate",
        title: "Use viewports to convert model information",
        body: "The model stays live while the viewport controls how it reads as 2D drafting.",
        detail: "A viewport is a translation layer between model and documentation.",
      },
      {
        value: "render",
        label: "Render",
        title: "Choose a render mode for line clarity",
        body: "Wireframe, Hidden Line, and Renderworks styles each reveal different information.",
        detail: "Drafting output needs line hierarchy, not just a rendered viewport.",
      },
      {
        value: "detail",
        label: "Detail",
        title: "Use sections and details to control scale",
        body: "Section and detail viewports let the drawing zoom into construction moments without redrawing the model.",
        detail: "Scale becomes part of the explanation.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "The model is source material",
        paragraphs: [
          "A 3D model can contain a lot of information, but documentation requires selection and hierarchy. The model has to be translated into views that a fabricator, director, or collaborator can read.",
          "Viewports make that possible because they keep the model connected while allowing the sheet to control crop, scale, render mode, and annotation.",
        ],
      },
      {
        number: "02",
        title: "Render style affects drafting clarity",
        paragraphs: [
          "A viewport render mode decides whether the drawing emphasizes edges, surfaces, texture, or linework.",
          "For construction documentation, the goal is not simply realism. The goal is a readable hierarchy of lines and forms.",
        ],
      },
      {
        number: "03",
        title: "Sections and details create hierarchy",
        paragraphs: [
          "Sections reveal construction relationships that a plan or elevation cannot show clearly. Details enlarge specific conditions so they can be understood at a larger scale.",
          "Together, they turn the model into a set of coordinated drawings rather than a single static view.",
        ],
      },
    ],
    modules: [
      {
        label: "Modes",
        title: "Viewport render choices",
        body: "Choose Wireframe, Hidden Line, or Renderworks-based output based on what the drawing needs to communicate.",
        visual: "model-to-drawing",
        points: ["Wireframe shows too much.", "Hidden Line clarifies edges.", "Renderworks can add tone and surface hierarchy."],
      },
      {
        label: "Section",
        title: "Cut line and detail scale",
        body: "Use section and detail viewports to explain construction instead of redrawing it.",
        visual: "model-to-drawing",
        points: ["Place cut line.", "Set view direction.", "Enlarge detail where needed."],
      },
    ],
    quote:
      "A model is not documentation until a viewport decides how it should be read.",
    examQuestions: [
      buildQuestion("What role does a viewport play when drafting from 3D?", [
        "It translates model information into a sheet view",
        "It deletes the model",
        "It replaces all classes",
        "It creates a user folder",
      ]),
      buildQuestion("Why use Hidden Line for drafting output?", [
        "It clarifies visible edges and linework",
        "It creates texture bump maps",
        "It changes sheet size",
        "It converts symbols to groups",
      ]),
      buildQuestion("What does a detail viewport help show?", [
        "A smaller construction area at a larger scale",
        "Only Resource Manager folders",
        "Only the file origin",
        "All published pages",
      ]),
    ],
    accuracyNotes: [
      "Custom Renderworks style settings are file-specific.",
      "None class usage for detail circles is workflow-specific.",
    ],
  },
  "modeling-a-table": {
    summary:
      "Learn how a real reference becomes a disciplined 3D table model through scaling, traced profiles, sweeps, extrudes, textures, and hybrid symbol creation.",
    lead:
      "A believable Vectorworks table is not modeled from memory. It is built by translating reference proportions into clean 2D geometry before adding volume, material, and documentation-ready symbol behavior.",
    overview: [
      "The workflow starts with a real table reference and a dimension correction. That matters because the model needs to inherit proportions from something credible before it becomes geometry.",
      "From there, the workflow moves between 2D profile work and 3D operations: sweeps for curved legs, extrudes for mass, solid operations for refinement, textures for material, and hybrid symbols for reuse.",
    ],
    readingPath: [
      {
        value: "scale",
        label: "Scale",
        title: "Translate reference into real size",
        body: "A reference image is useful only when its proportions are corrected against real dimensions.",
        detail: "The 12-foot table correction anchors the modeling process.",
      },
      {
        value: "build",
        label: "Build",
        title: "Move from profiles to solids",
        body: "Curves, sweeps, extrudes, and solid operations each solve a different part of the object.",
        detail: "The table becomes complex through layered simple operations.",
      },
      {
        value: "finish",
        label: "Finish",
        title: "Use texture and hybrid symbols for documentation",
        body: "Material mapping and hybrid symbol behavior make the model more useful in renderings and drawings.",
        detail: "A finished asset needs to work in more than one view.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Reference protects proportion",
        paragraphs: [
          "Furniture modeling can go wrong quickly when proportions are guessed. A scaled reference gives the model a disciplined starting point.",
          "The correction to the table length is not a minor setup detail. It keeps every later profile, leg, and support tied to a believable object.",
        ],
      },
      {
        number: "02",
        title: "2D profiles drive 3D form",
        paragraphs: [
          "The curved leg is not solved by sculpting randomly in 3D. It begins as a profile that can be swept, edited, and combined with other geometry.",
          "That is a central Vectorworks habit: use accurate 2D drawing to produce controlled 3D objects.",
        ],
      },
      {
        number: "03",
        title: "Material and symbol behavior complete the asset",
        paragraphs: [
          "Texture direction, mapping, and rotation affect whether the table reads as wood rather than an unmapped brown Renderworks texture.",
          "Turning the result into a hybrid symbol makes the object reusable in both model views and documentation contexts.",
        ],
      },
    ],
    modules: [
      {
        label: "Scale",
        title: "Reference image scaler",
        body: "Use one known dimension to correct the whole modeling reference.",
        visual: "reference-scale",
        points: ["Start with a known length.", "Scale the reference proportionally.", "Model from corrected guides."],
      },
      {
        label: "Material",
        title: "Texture grain direction",
        body: "Rotate and map texture direction so wood reads correctly across the table.",
        visual: "texture-shader",
        points: ["Auto Plane mapping", "90-degree rotation", "Consistent grain across parts"],
      },
    ],
    quote:
      "The model becomes believable when reference, geometry, material, and symbol behavior all agree.",
    examQuestions: [
      buildQuestion("Why scale a reference image before modeling?", [
        "To anchor the model to real-world proportions",
        "To publish a PDF",
        "To delete the design layer",
        "To change every class color",
      ]),
      buildQuestion("Why use sweeps or extrudes?", [
        "To turn 2D profiles into 3D form",
        "To create sheet titles",
        "To import cloud resources",
        "To change shortcut keys",
      ]),
      buildQuestion("Why convert the table into a hybrid symbol?", [
        "So it can work in 3D views and documentation contexts",
        "So it cannot be reused",
        "So all textures are removed",
        "So viewports stop updating",
      ]),
    ],
    accuracyNotes: [
      "Sweep menu wording should be verified against the current Vectorworks UI.",
      "Texture mapping labels may vary by version.",
    ],
  },
  "3d-modeling-basics": {
    summary:
      "Learn the foundational 3D modeling operations in Vectorworks: Extrude, Add Solids, Subtract Solids, Intersect Solids, Section Solids, Multiple Extrude, Sweep, Split, and Extrude Along Path.",
    lead:
      "3D modeling starts as a command vocabulary. A 2-foot by 2-foot rectangle at the origin becomes a way to see how the Model menu and 3D tool set turn flat geometry into editable volume.",
    overview: [
      "Extrude is the first move: a 2D rectangle becomes a four-foot-tall object, and the Object Info palette shows the X, Y, Extrude, and bottom Z values that control its position in space.",
      "The solid operations come next. Add Solids combines selected volumes. Subtract Solids removes one volume from another based on the selected direction. Intersect Solids keeps only the overlapping volume. Edit Solid keeps earlier operations available for adjustment.",
      "Section Solids, Multiple Extrude, Tapered Extrude, Sweep, Split, and Extrude Along Path expand that vocabulary. The recurring idea is that the starting 2D shape, object order, Z-plane position, and path/profile relationship determine the final form.",
    ],
    readingPath: [
      {
        value: "profile",
        label: "Profile",
        title: "Start with a measured 2D object",
        body: "Extrude begins with a 2D shape whose X, Y, height, and bottom Z can be checked in Object Info.",
        detail: "Starting at 0,0 with a two-foot square makes the first volume easy to read.",
      },
      {
        value: "solid",
        label: "Solid",
        title: "Use Model menu commands to create volume",
        body: "Extrude, Multiple Extrude, Tapered Extrude, Sweep, and Extrude Along Path each turn 2D geometry into a different kind of 3D form.",
        detail: "The command determines how the profile becomes volume.",
      },
      {
        value: "refine",
        label: "Refine",
        title: "Use solid operations to edit volume",
        body: "Add Solids, Subtract Solids, Intersect Solids, Section Solids, and Split refine solids after they exist.",
        detail: "Selection order and highlighted direction matter, especially in Subtract Solids and sectioning.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Extrude makes the Z plane visible",
        paragraphs: [
          "In Top/Plan, the first extrude can look like nothing happened. The object becomes clear only when the view changes into 3D and the Object Info palette shows a four-foot extrusion sitting on the Z plane.",
          "That moment matters because it connects 2D drafting to 3D space. The rectangle still has X and Y dimensions, but it now has height and a bottom Z value that can lift it above the plane.",
        ],
      },
      {
        number: "02",
        title: "Add, Subtract, and Intersect Solids each answer a different volume problem",
        paragraphs: [
          "Add Solids combines two selected solids into one object. Subtract Solids removes one selected volume from another and depends on which object is highlighted as the subtracting direction. Intersect Solids removes everything except the shared overlap.",
          "Edit Solid can reopen the previous iteration. That is an important modeling habit: solid operations are not just final shapes, they can preserve a history that remains adjustable.",
        ],
      },
      {
        number: "03",
        title: "Profile, order, and path control the advanced forms",
        paragraphs: [
          "Multiple Extrude depends on stacking order. The top object in the stack becomes the top profile and the bottom object becomes the bottom profile. A locus point can even become the top profile for a pyramid-like form.",
          "Sweep depends on a profile rotating around a center. Extrude Along Path depends on the relationship between the profile and the path, including the centerline offset needed when a trim profile should land on an edge instead of its own center.",
        ],
      },
    ],
    modules: [
      {
        label: "Add/Subtract/Intersect",
        title: "Solid operation sequence",
        body: "Use Model > Add Solids, Subtract Solids, and Intersect Solids as different ways Vectorworks combines overlapping solid volumes.",
        visual: "solid-operations",
        points: ["Add Solids creates one combined solid.", "Subtract Solids removes volume.", "Intersect Solids keeps overlapping volume."],
      },
      {
        label: "Profile/path",
        title: "Extrude Along Path centerline logic",
        body: "Extrude Along Path depends on the relationship between the profile and the path centerline.",
        visual: "solid-operations",
        points: ["Draw the profile.", "Draw the path.", "Offset the path when the profile must align to an edge."],
      },
      {
        label: "Stack/order",
        title: "Multiple Extrude and Sweep setup",
        body: "Multiple Extrude, Tapered Extrude, and Sweep all depend on setup choices before the command runs.",
        visual: "solid-operations",
        points: ["Check stacking order.", "Place the locus or center correctly.", "Use segment angle to control sweep smoothness."],
      },
    ],
    quote:
      "Most complex 3D forms are a few simple operations used in the right order.",
    examQuestions: [
      buildQuestion("What does an extrude do?", [
        "Gives depth to a 2D shape",
        "Creates a sheet title",
        "Changes layer visibility",
        "Publishes all pages",
      ]),
      buildQuestion("What does Subtract Solids do?", [
        "Removes one solid volume from another",
        "Adds a title block",
        "Creates a class hierarchy",
        "Imports a resource library",
      ]),
      buildQuestion("What is important for Extrude Along Path?", [
        "The relationship between profile and path",
        "Only the sheet layer name",
        "Only the PDF driver",
        "The page-based symbol color",
      ]),
    ],
    accuracyNotes: [
      "Shortcuts should be checked across Mac, Windows, and custom workspaces.",
      "Render/view labels may vary by Vectorworks version.",
    ],
  },
  "3d-modeling-tools": {
    summary:
      "Learn how the 3D tool palette creates and edits primitives, faces, edges, extracted surfaces, fillets, chamfers, tapers, deforms, and shell solids.",
    lead:
      "Fast 3D modeling comes from knowing when to stop constructing manually and let specialized tools reshape, hollow, extract, or refine the object.",
    overview: [
      "The workflow moves through primitives and then into tools that edit existing geometry. That shift is important: not every form should be rebuilt from scratch.",
      "Push/Pull, Extract, Fillet, Chamfer, Taper, Deform, and Shell Solid each describe a specific way a solid can change after it exists.",
    ],
    readingPath: [
      {
        value: "primitive",
        label: "Primitive",
        title: "Start with editable base solids",
        body: "Vectorworks 3D primitives are useful because their Object Info palette dimensions can be adjusted before they are converted or refined.",
        detail: "The Object Info palette keeps simple solids flexible.",
      },
      {
        value: "face",
        label: "Face",
        title: "Edit surfaces directly",
        body: "Push/Pull and face selection change the mass without rebuilding the object.",
        detail: "The model becomes editable at the face level.",
      },
      {
        value: "edge",
        label: "Edge",
        title: "Refine edges and volumes",
        body: "Fillet, chamfer, taper, deform, and shell tools add detail and construction logic.",
        detail: "Edge treatment can make a simple primitive feel designed.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Primitives are not throwaway objects",
        paragraphs: [
          "A primitive can be a fast starting point because it carries editable parameters. The drafter can adjust size and position before committing to more detailed operations.",
          "That makes primitives useful for blocking scenic forms, building references, and creating simple solids that can be refined later.",
        ],
      },
      {
        number: "02",
        title: "Face and edge tools accelerate refinement",
        paragraphs: [
          "Once a solid exists, the fastest path is often to edit faces or edges directly. Push/Pull can extend or move faces, while fillet and chamfer operations refine edges.",
          "This is where modeling starts to feel less like construction from scratch and more like shaping an existing mass.",
        ],
      },
    ],
    modules: [
      {
        label: "3D primitives",
        title: "Primitive object parameters",
        body: "Read primitives by the Object Info parameters that make them editable.",
        visual: "primitive-tools",
        points: ["Box", "Cylinder", "Sphere", "Frustum"],
      },
      {
        label: "Edge tools",
        title: "Edge treatment choices",
        body: "Fillet, chamfer, taper, deform, and shell change the same base object in different ways.",
        visual: "primitive-tools",
        points: ["Round edge", "Beveled edge", "Hollow shell"],
      },
    ],
    quote:
      "A modeling tool is most useful when it edits the part of the object you actually need to change.",
    examQuestions: [
      buildQuestion("What makes primitive objects useful?", [
        "They provide fast editable base geometry",
        "They publish PDFs automatically",
        "They replace all viewports",
        "They only work on sheet layers",
      ]),
      buildQuestion("What does Push/Pull commonly edit?", [
        "Faces of existing geometry",
        "Title block metadata",
        "Class names only",
        "PDF page size",
      ]),
      buildQuestion("What is a shell operation useful for?", [
        "Hollowing or giving thickness to a solid",
        "Renaming layers",
        "Changing a symbol color code",
        "Adding a page break grid",
      ]),
    ],
    accuracyNotes: [
      "Use frustum spelling in public copy.",
      "Some deform operations can be version or hardware sensitive.",
    ],
  },
  "basics-of-textures": {
    summary:
      "Learn how render modes, mapping types, scale, shader settings, face assignment, and lighting shape believable Vectorworks textures.",
    lead:
      "A texture is not just an image on a surface. It is a coordinated material system made from projection, scale, reflectivity, transparency, bump, and light.",
    overview: [
      "Material appearance depends on rendering context. A texture may exist in the file, but it only reads well when the render mode, mapping, lighting, and scale support it.",
      "Texture work is also selective. A material can be assigned to an object, a face, or a class, and each choice affects how easily the model can be managed later.",
    ],
    readingPath: [
      {
        value: "render",
        label: "Render",
        title: "Choose a mode that shows material",
        body: "Textures need the right rendering context before their qualities become visible.",
        detail: "OpenGL may appear as Shaded in newer versions.",
      },
      {
        value: "map",
        label: "Map",
        title: "Projection and scale decide believability",
        body: "A texture that is the wrong size or direction can make good geometry look wrong.",
        detail: "Mapping is where material meets form.",
      },
      {
        value: "shader",
        label: "Shader",
        title: "Surface properties create material behavior",
        body: "Color, reflection, transparency, and bump work together to create material character.",
        detail: "Texture realism comes from several small settings, not one image.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Texture is a system",
        paragraphs: [
          "A material has color, scale, projection, reflectivity, transparency, bump, and lighting context. If any one of those is out of alignment, the texture can read incorrectly.",
          "That is why texture lessons need to move beyond assigning an image. The real skill is adjusting how the material behaves on the object.",
        ],
      },
      {
        number: "02",
        title: "Mapping connects material to form",
        paragraphs: [
          "A cube, cylinder, and sphere do not receive texture the same way. Projection type and scale decide whether the material feels attached to the object or pasted on top of it.",
          "Face assignment adds another level of control when different parts of the same object need different material behavior.",
        ],
      },
    ],
    modules: [
      {
        label: "Mapping",
        title: "Texture mapping choices",
        body: "Check how texture projection behaves across different object forms.",
        visual: "texture-shader",
        points: ["Plane", "Cylinder", "Sphere", "Auto-align"],
      },
      {
        label: "Shader",
        title: "Shader property mixer",
        body: "See how color, reflection, transparency, and bump combine into a material.",
        visual: "texture-shader",
        points: ["Color", "Reflectivity", "Transparency", "Bump"],
      },
    ],
    quote:
      "Texture realism happens when image, scale, projection, and light agree.",
    examQuestions: [
      buildQuestion("Why does texture scale matter?", [
        "It affects whether the material reads at believable size",
        "It changes the sheet layer count",
        "It deletes the resource folder",
        "It controls layer stacking order",
      ]),
      buildQuestion("What does texture mapping control?", [
        "How the material is projected onto the object",
        "How a PDF is published",
        "How class names are hyphenated",
        "How a viewport is cropped",
      ]),
      buildQuestion("What can bump contribute to a texture?", [
        "Surface relief or perceived texture depth",
        "Sheet numbering",
        "Symbol grouping",
        "Layer scale conversion",
      ]),
    ],
    accuracyNotes: [
      "Clarify OpenGL versus Shaded terminology for current Vectorworks versions.",
    ],
  },
  "creating-camera-rendering": {
    summary:
      "Learn how staged lighting, camera framing, viewport linking, Renderworks styles, and export settings create a finished presentation rendering.",
    lead:
      "Rendering in Vectorworks is a production pipeline: light the model, frame it with intent, isolate it in a viewport, render iteratively, and export the sheet as a finished image.",
    overview: [
      "The rendering sequence begins with lighting because a camera cannot solve an unlit scene. Spotlights and point lights shape the model before framing begins.",
      "The camera then becomes a composition tool. A 16:9 frame, walkthrough navigation, linked viewport, render style, and export settings turn the model into a presentation image.",
    ],
    readingPath: [
      {
        value: "light",
        label: "Light",
        title: "Build the scene before framing it",
        body: "Lighting defines what the camera will be able to reveal.",
        detail: "Spot and point lights have different jobs.",
      },
      {
        value: "frame",
        label: "Frame",
        title: "Use the camera as composition",
        body: "Aspect ratio, view angle, and walkthrough movement shape the final read.",
        detail: "A camera is not only a viewport source. It is a design decision.",
      },
      {
        value: "export",
        label: "Export",
        title: "Render through a controlled viewport",
        body: "A linked viewport lets render style and export settings be managed as part of a sheet workflow.",
        detail: "The final image is produced through a pipeline, not a screenshot.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Lighting establishes the image",
        paragraphs: [
          "The rendering process starts by giving the model a readable lighting condition. Spotlight and point light behavior shape focus, depth, and atmosphere before the camera is placed.",
          "Without that stage, camera framing becomes guesswork. The model needs illumination before composition can make meaningful decisions.",
        ],
      },
      {
        number: "02",
        title: "The camera defines the viewer",
        paragraphs: [
          "A 16:9 camera frame gives the rendering a presentation format. Walkthrough movement and view adjustment then determine how the viewer enters the scenic space.",
          "The camera is therefore part of the design language, not just a technical output tool.",
        ],
      },
    ],
    modules: [
      {
        label: "Lighting",
        title: "Rendering light rig",
        body: "Use spotlight and point light choices to shape focus, fill, and depth in the scene.",
        visual: "camera-pipeline",
        points: ["Spotlight focus", "Point light fill", "Classed lighting objects"],
      },
      {
        label: "Pipeline",
        title: "Camera to viewport to export",
        body: "Follow the rendering from camera composition into a sheet viewport and final image export.",
        visual: "camera-pipeline",
        points: ["Set camera aspect", "Create linked viewport", "Choose render style", "Export image"],
      },
    ],
    quote:
      "A rendering is finished through a pipeline, not a single render button.",
    examQuestions: [
      buildQuestion("Why set up lighting before final camera framing?", [
        "Lighting determines what the camera can reveal",
        "Lighting creates sheet layers automatically",
        "Lighting deletes hidden lines",
        "Lighting controls PDF page breaks",
      ]),
      buildQuestion("What does a linked viewport support?", [
        "Controlled rendering and export from the camera view",
        "Class hierarchy creation",
        "Resource folder deletion",
        "Symbol color coding",
      ]),
      buildQuestion("Why use a 16:9 camera frame?", [
        "To frame the rendering for presentation output",
        "To convert geometry into 2D polygons",
        "To change all layer scales",
        "To create a texture bump map",
      ]),
    ],
    accuracyNotes: [
      "Clarify whether export settings refer to DPI or pixels in the current UI.",
      "Template-specific rendering sheet layers and backgrounds should be labeled as such.",
    ],
  },
  "hybrid-symbols": {
    summary:
      "Learn how hybrid symbols pair detailed 3D geometry with simplified 2D Top/Plan graphics for reusable drawing and modeling assets.",
    lead:
      "Good Vectorworks symbols are view-aware assets. A hybrid symbol shows enough detail in 3D while presenting the right simplified information in Top/Plan documentation.",
    overview: [
      "A 3D-only object is not always enough for drafting. In plan, the object may need a cleaner 2D graphic that reads better than the raw model.",
      "The hybrid symbol solves that by combining a 3D component with a 2D component. The student learns to decide what each view needs to communicate.",
    ],
    readingPath: [
      {
        value: "model",
        label: "Model",
        title: "Start with the 3D object",
        body: "The 3D component carries the volumetric and rendering information.",
        detail: "The model should be detailed enough for the views that need it.",
      },
      {
        value: "plan",
        label: "Plan",
        title: "Create a readable 2D component",
        body: "Top/Plan needs a clear drafting symbol, not always the full complexity of the model.",
        detail: "Simplification can make documentation stronger.",
      },
      {
        value: "reuse",
        label: "Reuse",
        title: "Set insertion and class behavior carefully",
        body: "The symbol should place predictably and read correctly across views.",
        detail: "A reusable asset needs both geometry and placement logic.",
      },
    ],
    sections: [
      {
        number: "01",
        title: "Hybrid symbols solve a view problem",
        paragraphs: [
          "The same object can need different levels of information in different views. A detailed 3D model may be perfect for renderings but too busy for a plan drawing.",
          "A hybrid symbol lets the object behave appropriately in both contexts.",
        ],
      },
      {
        number: "02",
        title: "The 2D component is a drafting decision",
        paragraphs: [
          "The plan graphic should be designed for readability. Manual tracing can sometimes produce a cleaner result than an automatically generated hidden-line component.",
          "That choice should be based on what the documentation needs, not on what is fastest in the moment.",
        ],
      },
    ],
    modules: [
      {
        label: "2D/3D components",
        title: "3D object versus hybrid symbol",
        body: "Switch between a 3D-only object and a hybrid symbol to see why Top/Plan needs its own graphic.",
        visual: "hybrid-components",
        points: ["3D detail", "2D Top/Plan clarity", "Reusable symbol behavior"],
      },
      {
        label: "Choose",
        title: "Manual trace versus generated component",
        body: "Choose between automatic hidden-line generation and deliberate manual drawing based on clarity, speed, and file stability.",
        visual: "hybrid-components",
        points: ["Generated component can be fast.", "Complex models can slow or crash.", "Manual drawing can read cleaner."],
      },
    ],
    quote:
      "A hybrid symbol is successful when each view gets exactly the information it needs.",
    examQuestions: [
      buildQuestion("What does a hybrid symbol combine?", [
        "3D geometry and a 2D Top/Plan component",
        "Only sheet layers and PDFs",
        "Only classes and page breaks",
        "Only textures and lights",
      ]),
      buildQuestion("Why create a simplified 2D component?", [
        "To make Top/Plan documentation clearer",
        "To delete the 3D model",
        "To change the PDF driver",
        "To remove all resources",
      ]),
      buildQuestion("Why can auto-generated 2D components be risky?", [
        "Complex models can generate slow or messy results",
        "They always change layer scale",
        "They prevent symbols from being placed",
        "They disable class visibility",
      ]),
    ],
    accuracyNotes: [
      "Auto-generating 2D from 3D can be slow or unstable on complex models.",
      "Screen plane behavior should be checked against current Vectorworks component workflows.",
    ],
  },
};

export const getTutorialArticleBlueprint = (slug?: string | null) =>
  slug ? tutorialArticleBlueprints[String(slug).trim().toLowerCase()] || null : null;
