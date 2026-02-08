import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, Lightbulb, AlertCircle, Keyboard, ArrowRight, ExternalLink } from "lucide-react";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TutorialDetail() {
  const params = useParams();
  const slug = params.slug;

  // This will be replaced with database query
  const tutorials: Record<string, any> = {
    "navigating-user-interface": {
    id: 1,
    slug: "navigating-user-interface",
    title: "Vectorworks Tutorial: Navigating the User Interface for Scenic Designers",
    description: "Master the Vectorworks workspace, palettes, and coordinate system to build an efficient scenic design workflow.",
    youtubeId: "jRI33g1oSt0",
    category: "Getting Started",
    difficulty: "Beginner",
    duration: 634, // 10:34 in seconds
    uploadDate: "2020-08-15",
    
    learningObjectives: [
      "Understand the Vectorworks menu bar and its theatrical design applications",
      "Navigate the Basic Tool Palette and Attributes Palette",
      "Master the Object Info Palette for precise object control",
      "Use the Navigation Palette to manage classes, layers, and viewports",
      "Understand the X, Y, and Z axis system and coordinate origin",
      "Toggle between 2D and 3D views using keyboard shortcuts",
      "Configure workspace palettes for optimal workflow",
    ],

    overview: `This tutorial introduces the Vectorworks user interface specifically for scenic designers. You'll learn how to navigate the workspace, understand the coordinate system, and configure palettes for theatrical drafting and 3D modeling.

The walkthrough covers the menu bar, tool palettes, and the critical Object Info and Navigation palettes that control your drawing organization. You'll also learn the X/Y/Z axis system and why keeping your model near the origin (0,0) is essential for rendering.

Finally, the tutorial explores view controls, zoom functions, and workspace customization—showing how to set up an efficient environment for scenic design work.`,

    keyConcepts: [
      {
        title: "THE COORDINATE ORIGIN (0,0)",
        content: "All Vectorworks models should be created as close to the origin (0,0) as possible. Straying too far from zero will affect Vectorworks' ability to render perspectives correctly. The origin is where the X and Y axes intersect.",
      },
      {
        title: "X, Y, AND Z AXES",
        content: "Green axis = North/South (Y-axis), Red axis = East/West (X-axis), Blue axis = Up/Down (Z-axis). Positive numbers extend East, North, and Up from origin. Negative numbers extend West, South, and Down.",
      },
      {
        title: "TOP/PLAN VIEW VS 3D VIEWS",
        content: "Top/Plan view is the default 2D drafting view. Use Right Isometric, Front, Left, and other 3D views to visualize and model scenic elements in three dimensions. Toggle views using the View Bar or number pad shortcuts.",
      },
    ],

    proTips: [
      "Customize your workspace layout early and save it as a workspace preset for consistency across projects.",
      "Use the number pad to quickly switch between views: 1=Front, 3=Right, 7=Top, 0=Isometric.",
      "Keep the Object Info Palette visible at all times—it's your primary tool for precise object control.",
      "If palettes disappear, go to Window > Palettes to restore them.",
    ],

    shortcuts: [
      { keys: "0-9 (Number Pad)", action: "Switch between standard views" },
      { keys: "Cmd/Ctrl + Scroll", action: "Zoom in and out" },
      { keys: "Spacebar + Drag", action: "Pan around the workspace" },
    ],

    commonPitfalls: [
      "Placing models too far from the origin (0,0), which breaks perspective rendering",
      "Not understanding the difference between Design Layers and Sheet Layers",
      "Closing critical palettes (Object Info, Navigation) and not knowing how to restore them",
      "Confusing the View Bar with the Navigation Palette—they offer similar but different controls",
      "Not customizing the workspace layout, leading to inefficient palette placement",
    ],

    transcript: [
      { time: "0:00", text: "[Music]" },
      { time: "0:05", text: "Hello, this is Brandon PT Davis. I'm a theatrical scenic designer, and today I'm going to share with you a Vectorworks tutorial about the user interface." },
      { time: "0:17", text: "We're going to start off by opening the software. I have the software here on my desktop." },
      { time: "0:23", text: "As you notice, the Vectorworks software takes time to open. This is normal because the software is very large." },
      { time: "0:32", text: "As the software opens, you'll notice that the Vectorworks template user template here is set as a default that says 'Do not use the sheet.' It recommends to close the file, click the file, and select an existing file or open a template." },
      { time: "0:53", text: "My students at UTEP have been provided with a specific template for them to learn the software, so now I'm going to close this file." },
      { time: "1:04", text: "To open the file, I'm going to go to File > New, and under here I have the UTEP Basics template. I'm going to press OK." },
      { time: "1:18", text: "Now that we have the proper Vectorworks template installed, I'm going to speak with you about the Vectorworks user interface." },
      { time: "1:25", text: "Like many software programs, the Vectorworks user interface has a menu bar across the top—items such as File, Edit, Tools, Text, View, Window, Cloud, and Help." },
      { time: "1:39", text: "You may have seen in other software programs Vectorworks will use these similar but also differently than other programs you may be used to. We will talk specifically about these tools, these menu items, as we move forward." },
      { time: "1:55", text: "We also have the Modify, Model, Spotlight, and Event menu items. These items are more specific to Vectorworks." },
      { time: "2:09", text: "On the left side here, we have the Basic Tool Palette. The Basic Tool Palette is a combination of tools that you use most frequently throughout the Vectorworks software. This would include things like the square tool, 2D line tool, measuring tools, and annotations. We'll speak more specifically about the basic tool set in the next video." },
      { time: "2:32", text: "The Attributes Palette allows you to edit and modify specific attributes within the 2D objects that you are creating in Vectorworks." },
      { time: "2:44", text: "The Tool Set Palette—this palette is very specific to the Vectorworks workspace that you're using. There is a variety of tools that you can use throughout the Vectorworks software, and we will speak specifically to how they apply to theatrical design during the course of these tutorials." },
      { time: "3:01", text: "We also have a Snapping Palette. A Snapping Palette modifies the way that you interact with the object through Vectorworks. We can move the Snapping Palette right now into the top left corner. We can also change where we have all the palettes in Vectorworks so that we can work in our most effective manner. My preference is to have the workspace configured as shown here." },
      { time: "3:36", text: "To the right side, we have the Object Info Palette. The Object Info Palette provides information about objects that you're working with in Vectorworks. I will draw a rectangle to show you some of the functionality of the Object Info Palette." },
      { time: "3:53", text: "So here we can see class, layer, and plane information, as well as width and height. We can modify the rotation of the object as well. There's also data information, and if we're working with 3D objects, we can modify the textures that are applied to the object through the window render options in the Object Info Palette." },
      { time: "4:18", text: "Below the Object Info Palette is the Navigation Palette. The Navigation Palette is a way to navigate through many aspects of the software. We have our classes here, layers, sheet layers, viewports, saved views, and file references." },
      { time: "4:50", text: "On the top, we have the Resource Manager. The Resource Manager is a way to store lots of information throughout Vectorworks. Resource Manager items include gradients, hatches, images, line types, materials, record formats, Renderworks backgrounds, Renderworks styles, Renderworks textures, a resource folder, roof styles, script, sketch styles, slab styles, text style, tiles, wall style, and worksheet." },
      { time: "5:29", text: "At the center, we have the Vectorworks workspace. This large square in the center—the Vectorworks workspace by default is in Top/Plan view. Top/Plan view is also the 2D view." },
      { time: "5:45", text: "We also have a ruler on the X and Y axis, and at the center we have zero, zero. In order to explain the X, Y, and Z axis and our views, I will show you these arrow symbols that I've created." },
      { time: "6:04", text: "Thinking of the green North and South as the Y-axis, and red East and West as the X-axis. At the center and the ruler, we have zero, zero. It is recommended that your models be as close and/or on zero, zero as possible when creating your model." },
      { time: "6:31", text: "Straying too far away from zero, zero will affect Vectorworks' ability to render the view in perspective." },
      { time: "6:48", text: "Now I will go to a Right Isometric view and show you the axis. We have the green axis—the North and South as our Y-axis. The red East and West as our X-axis. And the Z-axis is up and down." },
      { time: "7:08", text: "If we look at the ruler again from this view, we have East as positive numbers—four inches, eight inches, further on it's infinite. If we look towards the West from zero, we go into negative numbers—negative four, et cetera. The same applies both to North and South and the Z-axis up and down—negative, positive numbers." },
      { time: "7:47", text: "The View Bar across the top offers some of the same functionality as the Navigation Palette. Here we can toggle through the classes and change the active class that we're using. We can toggle through our design and sheet layers. We can also change our screen and layer plane views. Saved views will be stored here." },
      { time: "8:19", text: "These items here affect how you zoom into Vectorworks, so I can zoom to page or I can zoom to the object. We can also zoom in with this functionality. This is a numeric way to view the zoom functions." },
      { time: "8:49", text: "These are the working plane views, which we will talk more about when we get into 3D. But we can toggle through the views using this slider. So here is top, right, left. You can also use the number pad and change the views as well." },
      { time: "9:22", text: "This icon here will change to your previous and next views that you are looking at within your Vectorworks file." },
      { time: "9:35", text: "This icon is the Rotate Plan. This would be used if you were working in 3D and wanted to adjust the ground plan to a different view." },
      { time: "9:50", text: "You can also modify the perspective with this dropdown, and the render settings can be modified with this dropdown." },
      { time: "10:02", text: "The View Bar located here will be changed depending on the tools that you have accessed." },
      { time: "10:12", text: "And this palette here will give you access to shortcuts from both document preferences and Vectorworks preferences." },
      { time: "10:22", text: "This concludes the Vectorworks tutorial on user interface. If you have any questions, please let me know. Thank you." },
    ],

    relatedResources: [
      {
        title: "Vectorworks Quick Start Tutorials",
        url: "https://app-help.vectorworks.net/2025/eng/VW2025_Guide/QuickStart/Quick_Start_tutorials.htm",
        type: "Official Documentation",
      },
      {
        title: "Customizing Workspaces Guide",
        url: "https://app-help.vectorworks.net/2026/eng/VW2026_Guide/Start/Customizing_workspaces.htm",
        type: "Official Documentation",
      },
      {
        title: "Vectorworks 101's: User Interface Playlist",
        url: "https://www.youtube.com/playlist?list=PLiLCoe7DU1HYNYeFLC3R1C-C7JshE_a0G",
        type: "Video Series",
      },
      {
        title: "Scenic and Set Design with Vectorworks Course",
        url: "https://university.vectorworks.net/course/view.php?id=331",
        type: "Online Course",
      },
      {
        title: "Vectorworks Community Board",
        url: "https://forum.vectorworks.net/",
        type: "Community",
      },
    ],

    relatedTutorials: [
      { title: "Vectorworks 2: Classes and Layers", slug: "classes-and-layers" },
      { title: "Vectorworks 3: Basic 2D Tools", slug: "basic-2d-tools" },
      { title: "Vectorworks 5: 2D Theater Ground Plan", slug: "2d-theater-ground-plan" },
    ],
    },
    "understanding-classes": {
      id: 2,
      slug: "understanding-classes",
      title: "Vectorworks Tutorial: Understanding Classes",
      description: "Master the organization system that controls graphic attributes, textures, and visibility in Vectorworks using classes and hierarchies.",
      youtubeId: "tXQcTdGiwT4",
      category: "Getting Started",
      difficulty: "Beginner",
      duration: 587, // 9:47 in seconds
      uploadDate: "2021-01-24",
      
      learningObjectives: [
        "Understand what classes are and how they differ from design layers",
        "Navigate and manage classes using the Navigation palette",
        "Use class hierarchies to organize scenic drawings",
        "Apply and override graphic attributes using classes",
        "Reset overridden attributes back to class control",
        "Use groups strategically while preserving class visibility",
      ],

      overview: `This tutorial introduces classes as one of the most important organizational tools in Vectorworks. You'll learn how classes control graphic attributes, textures, and visibility—allowing you to show or hide specific elements of a drawing as needed for drafting and documentation.

The walkthrough covers how classes are structured, how class hierarchies work, and why standard classes like None and Dimension are critical to a clean workflow. You'll also see the difference between manually overriding attributes and allowing classes to control appearance using Use at Creation settings.

Finally, the tutorial explores how grouping objects interacts with class visibility—showing how multiple classed objects can live inside a group while still responding independently to class-based control. This approach becomes especially useful in complex scenic drawings.`,

      keyConcepts: [
        {
          title: "CLASSES",
          content: "Classes control how things look and when they appear. They manage line weights, fills, textures, and visibility. Think of classes as graphic and visibility filters layered on top of your drawing—not containers for geometry.",
        },
        {
          title: "NONE CLASS",
          content: "The base class where all 3D modeling should occur. Equivalent to Layer 0 in AutoCAD or the default layer in SketchUp. Model geometry here, then let classes control appearance.",
        },
        {
          title: "CLASS HIERARCHIES",
          content: "Use hyphens between text elements (e.g., 2D-Overhead-Dash) to create organized, nested class structures in the Navigation palette.",
        },
      ],

      proTips: [
        "Model geometry in the None class whenever possible, and let classes control appearance instead of manually overriding attributes.",
        "If something looks 'wrong,' check whether its attributes are overridden before assuming the class is incorrect.",
        "Use groups to manage visibility of multiple classed objects together while preserving their individual class assignments.",
      ],

      shortcuts: [
        { keys: "Cmd / Ctrl + G", action: "Combine multiple objects while preserving their individual class assignments" },
      ],

      commonPitfalls: [
        "Overriding attributes instead of using class-based control",
        "Putting modeled geometry into arbitrary classes instead of None",
        "Confusing class visibility with design layer visibility",
        "Forgetting that grouped objects can retain independent class attributes",
        "Breaking class hierarchies by inconsistent naming",
      ],

      transcript: [
        { time: "0:01", text: "Hello, this is Brandon PT Davis, theatrical scenic designer, and in this Vectorworks tutorial I'm going to talk to you about classes and design layers. To start the video off, we will talk about classes." },
        { time: "0:20", text: "Classes are one of the many powerful functions built into Vectorworks to allow the user to organize their drawing. Classes can be affected by graphic attributes, textures, and textiles. Classes can also be used in the visibility to be turned on and off, allowing the user to show a particular element when needed." },
        { time: "0:49", text: "Classes can be found in the Navigation palette. Under Navigation palette, you can also access classes in this top bar and scroll down and view them here. To look at the hierarchy list of the navigation and classes, you can double click on the icon here." },
        { time: "1:11", text: "As you can see, this template has some classes pre-installed. We have the 2D classes, sheet layer classes, and S for scenic or set classes. Note that the Dimension class and None class are also here. These two classes come standard with all Vectorworks templates." },
        { time: "1:43", text: "The None class is the base class in which all the 3D elements should be modeled. If you're a previous AutoCAD user, it's equivalent to Layer Zero, also similar in SketchUp. The Dimension class is where dimension attributes are stored." },
        { time: "2:13", text: "If I were to go and look at, say, this overhead dash, I can press Edit. Notice that the hyphens between the two text elements are what create the hierarchy and allow for better organization within the classes palette." },
        { time: "2:37", text: "In this palette, we are able to modify the graphic attributes. As you see, we have checked 'Use at Creation,' and we have the fill style set to None, the pen type set to Line Type Dash. You can also change the pen type to None, Solid, Pattern, and Line Type." },
        { time: "3:04", text: "I'm going to show you how you can modify the attributes using classes with these five squares that I have drafted. To start off, I will show you the traditional way of modifying the attributes of a graphic." },
        { time: "7:40", text: "Now that I've shown you how I can change the visibility of class, I'm going to show you how a group can add to the effectiveness of the visibility with classes." },
        { time: "9:38", text: "This concludes the portion of the tutorial covering classes. The next section of this tutorial will be on the design layer aspect of Vectorworks." },
      ],

      relatedResources: [
        { title: "Vectorworks University: Classes", url: "https://university.vectorworks.net/course/index.php?mycourses=0&tagfilter%5Bcategory%5D=0&tagfilter%5Btype%5D=0&tagfilter%5Bdifficulty%5D=0&categorysort=default&mycourses=&search=classes", description: "Official Vectorworks training on class organization" },
        { title: "Vectorworks Forum: Classes Discussion", url: "https://forum.vectorworks.net/index.php?/forum/22-classes-layers-views/", description: "Community discussions about classes and layers" },
        { title: "Vectorworks Help: Classes", url: "https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Attributes/Classes.htm", description: "Official documentation on class functionality" },
      ],

      relatedTutorials: [
        { title: "Vectorworks Tutorial: Navigating the User Interface", slug: "navigating-user-interface" },
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
        { title: "Vectorworks 4: Basic 2D Tools", slug: "basic-2d-tools" },
      ],
    },
    "understanding-design-layers": {
      id: 3,
      slug: "understanding-design-layers",
      title: "Vectorworks Tutorial: Understanding Design Layers",
      description: "Master the layer organization system that allows you to separate and manage different elements of your scenic design across multiple drawing planes.",
      youtubeId: "CwCxmhQAFwI",
      category: "Getting Started",
      difficulty: "Beginner",
      duration: 474, // 7:54 in seconds
      uploadDate: "2021-01-25",
      
      learningObjectives: [
        "Understand what design layers are and how they organize drawing information",
        "Navigate and manage design layers using the Navigation palette",
        "Create, duplicate, and edit design layers with proper naming conventions",
        "Control layer stacking order and visibility",
        "Use layer viewing options (Gray/Snap Others, Show Others, Show/Snap Others)",
        "Apply design layer concepts to real scenic design workflows",
      ],

      overview: `This tutorial introduces design layers as a fundamental organizational tool in Vectorworks. Design layers function like stacked sheets of vellum in traditional drafting\u2014allowing you to separate architectural plans, scenic ground plans, and lighting plots onto different layers that can be viewed together or independently.

The walkthrough covers how to access design layers through the Navigation palette, create and name new layers with proper conventions, and control stacking order to determine which elements appear on top. You'll see a real production example from UCI's \"The Pajama Game\" showing how layers organize 3D hybrid symbols.

Finally, the tutorial explores layer viewing options that control whether you can see and snap to objects on inactive layers\u2014critical for maintaining clean workflows when drafting complex scenic designs with multiple overlapping elements.`,

      keyConcepts: [
        {
          title: "DESIGN LAYERS",
          content: "Design layers organize drawing information conceptually similar to stacked sheets of paper or vellum. Each layer can contain different elements (architecture, scenery, lighting) that can be shown or hidden independently.",
        },
        {
          title: "STACKING ORDER",
          content: "The vertical arrangement of design layers determines which elements appear on top when layers overlap. Higher layers in the stack appear in front of lower layers\u2014critical for controlling visibility in both 2D and 3D views.",
        },
        {
          title: "LAYER VIEWING OPTIONS",
          content: "Gray/Snap Others: See inactive layers in gray, can snap to them. Show Others: See inactive layers in full color, cannot snap. Show/Snap Others: See and snap to inactive layers. Show/Snap/Modify Others: Full access (not recommended).",
        },
      ],

      proTips: [
        "Keep all design layers at the same scale (typically 1/4\" = 1'-0\" for theatrical work) to ensure files work in unison.",
        "Use consistent naming conventions: S-Ground Plan (scenic), L-Ground Plan (lighting), Arch-Ground Plan (architecture).",
        "Place architectural elements on the bottom layer, scenic elements in the middle, and lighting on top for logical stacking.",
        "Use 'Gray/Snap Others' as your default viewing mode\u2014it provides visual hierarchy while maintaining snap functionality.",
      ],

      shortcuts: [
        { keys: "Right-click layer name", action: "Quick access to Edit menu" },
        { keys: "Double-click layer name", action: "Open Design Layer Organization dialog" },
      ],

      commonPitfalls: [
        "Creating layers at different scales, causing dimensional conflicts",
        "Not understanding stacking order, leading to elements appearing behind others unexpectedly",
        "Using 'Show/Snap/Modify Others' and accidentally editing the wrong layer",
        "Forgetting to check which layer is active before drawing new objects",
        "Not using consistent naming conventions across projects",
      ],

      transcript: [
        { time: "0:01", text: "Hello, this is Brandon PT Davis, theatrical scenic designer, and in this Vectorworks tutorial I'm going to talk to you about classes and design layers." },
        { time: "0:12", text: "Design layers are another method in which Vectorworks users can organize the information in their drawing." },
        { time: "0:20", text: "Conceptually, the design layer is similar to traditional drafting standards. A designer could use sheets of paper or vellum to draw elements of their design on specific pages\u2014such as the base layer being the architectural drafting, and on top have the scenic ground plan, and stacked on top of that there could be the lighting plot." },
        { time: "0:47", text: "In order to illustrate the function of the design layers, I'm going to show you the production file from University of California Irvine's production of The Pajama Game." },
        { time: "1:05", text: "Within the file you will find the drafted out ground plan. This ground plan is a 3D hybrid symbol, meaning it has 2D and 3D elements tied to it." },
        { time: "1:20", text: "To find the layers, you will go to the Navigation palette. The second tab with the three pieces of paper stacked is the navigation tablet." },
        { time: "1:31", text: "In the navigation tablet you will find the design layer names in the center, and to the right you will find the stacking order." },
        { time: "1:42", text: "To the left, similar to classes, you can adjust the visibility." },
        { time: "1:50", text: "In this file we have Set Ground Plan, Architectural Stage Ground Plan, Architectural House Ground Plan. There are a few other layers, but in this example these are the ones that really matter." },
        { time: "2:05", text: "I'm going to now adjust this into a Right Isometric view." },
        { time: "2:08", text: "As you can see, we have the set in three dimensions." },
        { time: "2:13", text: "We can now alter the visibility of the House Ground Plan from visible to off. We can now easily see the inside of the proscenium arch." },
        { time: "2:28", text: "If you wanted to work on the ground plan without having the hindrance of the architecture, we can also turn this element off as well." },
        { time: "2:41", text: "These elements here are the scenic design elements that were used within the production." },
        { time: "2:50", text: "To further explain how visibilities can continue to work, I will now go and show you the class system within the file. We can toggle through the different scenes by clicking on the visibility, and we will be able to see the different scenes within the production." },
        { time: "3:10", text: "I have now opened a blank file to show you how the design layers work when opening a new project." },
        { time: "3:18", text: "The design layers, as mentioned before, are in the Navigation Design Layers tab." },
        { time: "3:24", text: "Typically when you start a new file, the standard for Vectorworks is to name the design layer 'Design Layer-1.'" },
        { time: "3:35", text: "If I were to duplicate this Design Layer-1, it will auto-name itself Design Layer-2." },
        { time: "3:48", text: "In order to edit or modify the current Design Layer 1, there's a number of ways we can accomplish this. First, we can right-click to edit. We can also double-click on the design layer organization and view the design layers within the file from there." },
        { time: "4:12", text: "Similar to the palette, the Organization palette has visibility, design layer name, stacking order, and scale. Again, these elements beyond are more tied towards architecture and not going to be covered in this video." },
        { time: "4:31", text: "In order to edit the design layer, we simply have to click Edit." },
        { time: "4:40", text: "Design layer\u2014we can name Scenic Ground Plan: S for scenic and GP as an abbreviation for ground plane." },
        { time: "4:50", text: "You can also modify the scale of the design layer. In order for your files to work in unison, it is important that all design layers are the same scale." },
        { time: "5:02", text: "Typically we work in quarter-inch or 1:48 scale. Stacking order can then be modified manually in the Edit Design Layers palette." },
        { time: "5:15", text: "Below are the architectural elements which we will not be covering." },
        { time: "5:24", text: "Now the Set Ground Plane layer has been created." },
        { time: "5:27", text: "I'm now going to create a new design layer. I'm going to call this one L-Ground Plan, or the Lighting Ground Plan." },
        { time: "5:39", text: "I'm going to press OK. As we can see, without going to edit, the attributes of the design layers are similar, and they are both the same scale. The name and visibility are the same. The stacking order has the Ground Plan layer on top and the Scenic Ground Plane layer on bottom." },
        { time: "5:59", text: "We can shuffle this by sliding the Ground Plan order, so now the Scenic Ground Plane is on top and the Lighting Ground Plane is on the bottom." },
        { time: "6:14", text: "In order to show you how these ground plan layers work within stacking, I'm going to draw a couple of circles." },
        { time: "6:21", text: "The first circle I'm drawing on the Lighting Ground Plan layer. We know this because the Lighting Ground Plan layer is currently checked." },
        { time: "6:29", text: "Now I'm going to draw a smaller circle on the Scenic Ground Plan layer." },
        { time: "6:40", text: "If we change the stacking order of the ground plane layers, we now see that the Lighting Ground Plan is now on top with the larger circle." },
        { time: "7:02", text: "We can modify how we view the design layers through the Layer Options. Currently, 'Gray/Snap Others' is turned on. This function can be changed to 'Show Others,' so now we can see both, but we cannot snap to the layers below." },
        { time: "7:23", text: "If you want to show and snap onto the layers, simply change the layer options to 'Show/Snap Others.'" },
        { time: "7:35", text: "We can also adjust this with 'Show/Snap/Modify Others,' though I do not recommend this as it can make your file confusing." },
        { time: "7:43", text: "This concludes the Vectorworks tutorial session on classes and design layers. If you have any questions, please feel free to ask. Thank you." },
      ],

      relatedResources: [
        { title: "Vectorworks University: Design Layers", url: "https://university.vectorworks.net/course/index.php?mycourses=0&search=design+layers", description: "Official Vectorworks training on layer organization and management" },
        { title: "Vectorworks Forum: Layers Discussion", url: "https://forum.vectorworks.net/index.php?/forum/22-classes-layers-views/", description: "Community discussions about design layers and best practices" },
        { title: "Vectorworks Help: Design Layers", url: "https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Layers/Design_layers.htm", description: "Official documentation on design layer functionality" },
      ],

      relatedTutorials: [
        { title: "Vectorworks Tutorial: Navigating the User Interface", slug: "navigating-user-interface" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
      ],
    },
    "installing-workspace-template": {
      id: 4,
      slug: "installing-workspace-template",
      title: "Vectorworks Tutorial: Installing a Workspace and Template",
      description: "Learn how to properly install and configure a Vectorworks workspace and template provided by your organization or company to ensure standardized communication and workflow.",
      youtubeId: "CXBfG2L3ZmI",
      category: "Getting Started",
      difficulty: "Beginner",
      duration: 340, // 5:40 in seconds
      uploadDate: "2021-01-25",
      
      learningObjectives: [
        "Understand the purpose of workspaces and templates in Vectorworks",
        "Locate and install a Vectorworks User Folder",
        "Configure Vectorworks preferences to use custom workspaces",
        "Remove default workspaces to streamline your workflow",
        "Set up organizational templates for consistent project standards",
      ],

      overview: `This tutorial walks you through the complete process of installing a custom Vectorworks workspace and template provided by an organization. Workspaces and templates are essential tools for standardizing communication when working as part of a company or design team.

The tutorial covers copying the Vectorworks User Folder to your documents, accessing and modifying Vectorworks preferences, removing default workspaces from the application folder, and opening organizational templates. This setup process ensures that all team members work with consistent tools, palettes, and document standards.`,

      keyConcepts: [
        {
          title: "VECTORWORKS USER FOLDER",
          content: "The Vectorworks User Folder contains custom workspaces, templates, libraries, and preferences specific to an organization. Installing this folder ensures you have access to standardized tools and settings used by your team.",
        },
        {
          title: "WORKSPACES",
          content: "Workspaces control the arrangement of tool palettes, menus, and interface elements in Vectorworks. Custom workspaces streamline workflows by providing only the tools relevant to your discipline (scenic design, lighting, architecture, etc.).",
        },
        {
          title: "TEMPLATES",
          content: "Templates are pre-configured Vectorworks files that include standard layers, classes, sheet borders, title blocks, and other document settings. Using organizational templates ensures all team drawings follow the same standards.",
        },
      ],

      proTips: [
        "Copy the Vectorworks User Folder to your Documents directory before installing it. This keeps the original folder intact in case you need to reinstall or share it with colleagues.",
        "Deleting default workspaces from the application folder prevents confusion and ensures you only see the workspace provided by your organization. This is especially helpful for students or new team members.",
        "After installing a new workspace, always open the organizational template to verify everything installed correctly. Check that tool palettes appear in the expected locations and that templates load properly.",
      ],

      shortcuts: [],

      commonPitfalls: [
        "Installing the User Folder to the wrong location (must go in Documents, not inside Vectorworks application)",
        "Selecting a subfolder instead of the top-level User Folder when changing preferences",
        "Forgetting to restart Vectorworks after changing the User Folder location",
        "Not having administrator privileges to delete default workspaces from Program Files (Windows)",
        "Choosing 'Yes' when asked to copy existing preferences (should choose 'No' for clean install)",
      ],

      transcript: [
        { time: "0:00", text: "Hello, I'm Brandon PT Davis, theatrical scenic designer. Today I'm going to share with you a Vectorworks tutorial on the installation of a workspace and template." },
        { time: "0:16", text: "Workspaces and templates are used to standardize communication when working in Vectorworks as a company or organization. If you obtain a Vectorworks User Folder from an organization—in this case, this is the Vectorworks 2021 User Folder for the University of Texas in El Paso—I recommend that you copy the folder and place it in your Documents." },
        { time: "1:00", text: "After installing Vectorworks 2021, open the software. You need to access the Vectorworks Preferences. The quickest way to access Vectorworks Preferences is to click the arrow icon here. Vectorworks Preferences is on the bottom. Now click this icon saying 'Changing the user data and preference folder may require restart of Vectorworks. You will be given the opportunity to save unsaved documents. Are you sure you want to continue?' Click Yes." },
        { time: "1:56", text: "Next you need to access the Vectorworks User Folder that you placed in your Documents. So I'm going to go to Documents, scroll until I find the Vectorworks folder. Do not go into the folder—make sure that you are on the topmost where it says 'Folder Vectorworks 2021 User Folder.' Select the folder." },
        { time: "2:29", text: "The first question: 'Would you like to copy the contents of the existing user data and preference folder to a new location in order to retain all your preferences and content?' Click No. It says now, 'Do you want to save the changes you made in the document Untitled 2?' Click No. Vectorworks will shut down. Press OK." },
        { time: "2:59", text: "Now that Vectorworks has closed, we are going to go back into the File Explorer. We're going to go to the C drive, Program Files, Vectorworks 2021, and Workspaces." },
        { time: "3:26", text: "If you're using a Mac, you will do a similar process, but instead you will find the Vectorworks 2021 application folder, still going to the Workspace folder within the application folder." },
        { time: "3:41", text: "We are going to delete all of the Vectorworks workspaces that are default to the software. Deleting the Vectorworks default workspaces will streamline your workflow when only having the workspace that is provided by your company or organization." },
        { time: "4:18", text: "Now I'm going to close and reopen Vectorworks 2021. Now that we have opened the Vectorworks software, we see that all of the tools and palettes are in the proper place." },
        { time: "4:39", text: "The next order of business is to go to File, New, scroll down and open the UTEP Basic—or whichever basic template your company has provided. Press OK." },
        { time: "4:59", text: "That completes the tutorial. If you have any questions, feel free to ask. Thank you." },
      ],

      relatedResources: [
        { title: "Vectorworks University - Workspaces", url: "https://university.vectorworks.net/", description: "Official training on workspace customization" },
        { title: "Vectorworks Help - User Folder", url: "https://app-help.vectorworks.net/", description: "Documentation on User Folder structure" },
        { title: "Vectorworks Forum - Workspace Setup", url: "https://forum.vectorworks.net/", description: "Community discussions on workspace configuration" },
      ],

      relatedTutorials: [
        { title: "Vectorworks Tutorial: Navigating the User Interface", slug: "navigating-user-interface" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
      ],
    },
    "basics-tool-palette": {
      id: 5,
      slug: "basics-tool-palette",
      title: "Vectorworks Tutorial: Basics Tool Palette",
      description: "Master the essential 2D drawing tools in the Basics Tool Palette, including selection, drawing, and modification tools that form the foundation of scenic design drafting in Vectorworks.",
      youtubeId: "orjqcNYveOg",
      category: "Getting Started",
      difficulty: "Beginner",
      duration: 897, // 14:57 in seconds
      uploadDate: "2021-01-27",
      
      learningObjectives: [
        "Navigate and use the Selection tool to modify objects",
        "Use Pan and Zoom tools to navigate your workspace",
        "Create text annotations with the Text tool",
        "Place reference points with the 2D Locus tool",
        "Draw lines, rectangles, circles, and polygons",
        "Create organic shapes with Polyline and Freehand tools",
        "Apply Fillet and Chamfer modifications to corners",
      ],

      overview: `This comprehensive tutorial introduces the Basics Tool Palette, located in the top left corner of the Vectorworks workspace. You'll learn how to access each tool using both icon clicks and keyboard shortcuts, understand the different modes available for each tool, and apply these tools to 2D drafting workflows.

The tutorial covers 15+ essential tools organized into categories: navigation tools (Selection, Pan, Zoom), annotation tools (Text, 2D Locus), basic shape tools (Line, Rectangle, Circle), advanced shape tools (Polyline, Polygon), and modification tools (Fillet, Chamfer). Each tool section explains multiple drawing modes and practical applications for scenic design.`,

      keyConcepts: [
        {
          title: "SELECTION TOOL (X)",
          content: "The Selection tool is your primary interface for interacting with drawn objects. It allows you to move, modify, and access snapping points on shapes. Without the Selection tool active, you cannot manipulate existing geometry.",
        },
        {
          title: "DRAWING MODES",
          content: "Most drawing tools in Vectorworks offer multiple modes that change how the tool behaves. For example, the Rectangle tool can draw corner-to-corner, corner-to-middle, midpoint-to-midpoint, or using three points. Learning to switch between modes (hotkey: U) dramatically increases efficiency.",
        },
        {
          title: "POLYLINE VS POLYGON",
          content: "Polylines create open or closed paths with editable vertices, ideal for organic shapes that may need modification. Polygons create closed shapes and offer special modes like 'Intersecting' and 'Outer Boundary' that can combine or trace around multiple objects.",
        },
        {
          title: "2D LOCUS",
          content: "A 2D Locus is a reference point that appears on screen but doesn't print. Scenic designers commonly place a red locus at 0,0 (centerline) as a visual reference point for the entire drawing.",
        },
      ],

      proTips: [
        "Learn the keyboard shortcuts for your most-used tools. Hitting 'X' for Selection, '2' for Line, '4' for Rectangle, and '5' for Polyline will dramatically speed up your workflow compared to clicking icons.",
        "When drawing with the Polyline tool, you can change modes mid-drawing by hitting 'U'. This lets you combine straight lines, curves, and arcs in a single continuous shape without switching tools.",
        "The Double Line Polygon tool (Alt+8) is perfect for quickly drafting walls in floor plans. Set the separation to your wall thickness and draw the entire floor plan outline in one continuous operation.",
        "Use the 'I' hotkey to quickly cycle through drawing modes for any tool. This is faster than clicking the mode dropdown in the Object Info Palette.",
      ],

      shortcuts: [
        { keys: "X", action: "Selection Tool" },
        { keys: "H", action: "Pan Tool (think 'Hand')" },
        { keys: "C", action: "Zoom Tool" },
        { keys: "Z", action: "Zoom to fit all objects" },
        { keys: "1", action: "Text Tool" },
        { keys: "0", action: "2D Locus Tool" },
        { keys: "2", action: "Line Tool" },
        { keys: "Alt+2", action: "Double Line Tool" },
        { keys: "4", action: "Rectangle Tool (think '4 sides')" },
        { keys: "6", action: "Circle Tool" },
        { keys: "Alt+6", action: "Oval Tool" },
        { keys: "5", action: "Polyline Tool" },
        { keys: "8", action: "2D Polygon Tool" },
        { keys: "Alt+8", action: "Double Line Polygon Tool" },
        { keys: "7", action: "Fillet Tool" },
        { keys: "U", action: "Cycle through tool modes" },
        { keys: "I", action: "Cycle through drawing modes" },
      ],

      commonPitfalls: [
        "Forgetting to switch back to Selection tool (X) after drawing—you can't modify objects while a drawing tool is active",
        "Not understanding that snapping points only appear when Selection tool is active and an object is selected",
        "Drawing with the wrong mode active (e.g., Rectangle corner-to-corner when you meant three-point mode)",
        "Confusing Polyline (open/closed editable paths) with Polygon (closed shapes with special combining modes)",
        "Not setting the Double Line separation before drawing walls, resulting in incorrect wall thickness",
        "Trying to print 2D Locus points—they're reference-only and won't appear on printed sheets",
      ],

      transcript: [
        { time: "0:00", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. This Vectorworks tutorial is going to cover the Basics Tool Palette and how it's applied to two-dimensional drawing." },
        { time: "0:20", text: "The Basics Tool Palette is located in the top left corner of my Vectorworks workspace. If you aren't familiar with the Vectorworks icon, you can hover over each icon and a text button will pop up. You can also click the down arrow and change from icons to icons and text. In this tutorial, I'm going to use Vectorworks view tools as icons." },
        { time: "0:50", text: "The first tool we will talk about is the Selection tool. The Selection tool is what allows users to move or modify objects on the screen. You can access this by clicking on the icon or hitting the letter X. Now that I have the Selection icon, I can hover over this object and note that it will highlight around the perimeter. By clicking once, I now have access to the snapping points. Because I have the snapping highlight point turned on, with the snapping points I can modify the shape." },
        { time: "1:43", text: "The next tool we will cover is the Pan tool. By clicking on the Pan tool, you are able to pan throughout your work area. Note the hotkey for the Pan tool is the letter H—think letter H for hand. In the icon of the Pan tool, you will notice a black arrow in the corner. If you click and hold on any of the icons with the black arrow, you can have additional features. This additional feature in this example is Move Page. In our workspace we do not have an active page, so we will not worry about this feature." },
        { time: "2:25", text: "The Zoom tool is the magnifying glass icon. When clicking on this, you can zoom with or with the Zoom Marquee mode by making a selection and click once. You can also access the Zoom tool with a three-button mouse. A hotkey for the Zoom tool is the letter C." },
        { time: "2:51", text: "When adding text to your document, you can access the Text tool by hitting the number 1 or clicking on the icon. You can apply the text just by clicking and starting and typing your text. To change the text style, font, or size, you can access these items in the Object Info Palette. You can also change the text in the Text dropdown menu." },
        { time: "3:32", text: "A 2D Locus tool, which is the icon that looks like the letter X, is located here. A 2D Locus is simply a reference point that can be used in Vectorworks when drawing. This document contains a red 2D Locus at 0,0, as this reference is very common when working in theatrical practice. The benefit of a 2D Locus is it allows you to have a point that's viewable on the screen but not printable on the page. The hotkey for the 2D Locus is the letter zero." },
        { time: "4:11", text: "One of the most common tools you will use in Vectorworks is the Line tool. The Line tool simply draws a 2D line. You can access the Line tool by clicking the icon or pressing the number 2 on the keyboard." },
        { time: "4:26", text: "In addition to the 2D Line tool, you also have the Double Line tool. You can access the Double Line tool by clicking on the icon or hitting Alt+2. A Double Line tool allows the user to draw two lines with a separation. This separation is currently set to one inch. I can click and change the separation to four inches. You also have the ability to click on the Preferences and change the options from creating polygons (which is a four-sided shape) to creating simply just lines. You can also change the mode of the 2D Line tool. Currently it's on the top control line mode. Additionally, you can change this tool from top to accessing through the center. A hotkey to quickly adjust which mode you're working in is by hitting the letter I." },
        { time: "5:49", text: "The next tool is the Rectangle tool. The Rectangle tool will draw a four-sided shape with 90-degree angles. The hotkey for the Rectangle tool is the number 4—think four sides. The Rectangle tool also has a series of modes. The primary mode is corner to corner. You can also change it to corner to middle, midpoint to midpoint mode, and my second favorite, the three-point rectangle mode." },
        { time: "6:38", text: "The next tool that's related to the Rectangle tool is the Rounded Rectangle tool. This is the icon of the rectangle with the rounded edges. This mode allows you to draw a four-sided shape with an eased edge. By clicking on the Preferences, you can change the proportional corners to symmetrical corners, as well as adjust the diameter of the quarter corners in which you are drawing." },
        { time: "7:14", text: "A Circle tool, which is the icon of the circle, allows you to draw a circle. The current mode for the circle is the radius mode, which is center point to the outer edge. You can also adjust to diameter mode, three-point mode, circle from three lines mode (requires that you have drawn three lines—once you select the circle with hotkey 6, you can select your three points and a circle will be drawn to fit within those three points), point to center mode, and tangent and center mode. Please note you can adjust the modes by hitting the letter U." },
        { time: "8:21", text: "Next to the Circle tool icon, you will find the Oval tool. The Oval tool allows the user to draw an oval. Box mode is the first mode—the box mode is similar to drawing a rectangle with an oval inside. Following the box mode is the height and width mode—I can draw the width and then the height to create the oval. And the third mode is from the center mode. The hotkey for the Oval tool is Alt+6." },
        { time: "9:06", text: "Next to the Oval tool is the Arc tool. Arc tool allows you to draw an arc. The most common arc tool mode that I use is the arc radius mode. This mode allows you to draw two points and then create the arc from the first point as the center. I use this tool when drawing the graphic for a door swing. Other modes in the Arc tool are three-point mode, tangent to line mode, sensor mode, as well as specified radius mode where you can manually enter the radius." },
        { time: "10:13", text: "The Freehand tool, hotkey Alt+5, allows the user to draw an organic shape. With one click, the shape will be smoothed." },
        { time: "10:25", text: "A tool that's more common for drawing organic shapes is the Polyline tool. The Polyline tool has many different modes when it comes to drawing a polyline. The first mode is the corner vertex mode—this mode will keep all the lines within the shape you're creating at 3. You can also draw in the Bezier vertex mode, the cubic vertex mode, the tangent arc mode, point on arc mode. The last mode in Polyline tools is the arc vertex fillet mode. You can adjust the arc by clicking on the fillet settings and changing the radius. Now when I draw, each corner will be a six-inch radius fillet. You can access the Polyline tool by hitting hotkey 5. Please note that when drawing a polyline, you can actually change the modes while you're drawing by hitting the hotkey letter U. This is how you can create a more organic shape but with having control within the software." },
        { time: "12:14", text: "Next to the Polyline tool, you will find the 2D Polygon tool. The 2D Polygon tool has a similar mode as the Polyline tool, where you can draw a shape using straight lines. A Polygon tool can be accessed by hitting the hotkey 8. The 2D Polygon mode has some interesting features. In order to show you how they function, I have drawn two identical clusters of rectangles. If I click where these two rectangles intersect, it will create another shape. By holding Shift, I can continue to create upon that shape. And the outer boundary mode, I can make the selection around this cluster of squares, and you'll see that it's in a way grouped them together. But if I have to move them, you will see that the original shapes are behind the new shape." },
        { time: "13:24", text: "The Double Line Polygon tool is very similar in function to the Double Line tool. The difference is that we have a separation between the two lines. This tool is great if you are trying to create walls in a 2D application. The hotkey for the 2D Double Line Polygon tool is Alt+8. We can modify the separation as well as go into the Preferences and change the options to create lines, create polygons, and create lines and polygons." },
        { time: "14:07", text: "The Fillet tool, which is located here, allows you to take a right angle and soften the edges with a fillet. You can adjust the fillet with the fillet radius here. There's a number of modes of the fillet—there's standard mode, split mode, and trim mode. The hotkey for the fillet mode is 7." },
        { time: "14:37", text: "Similar to the Fillet mode is Chamfer mode. Chamfer mode allows you to take two right angles and create a chamfer." },
      ],

      relatedResources: [
        { title: "Vectorworks University - Basic Tools", url: "https://university.vectorworks.net/", description: "Official training on tool usage" },
        { title: "Vectorworks Help - 2D Tools", url: "https://app-help.vectorworks.net/", description: "Complete documentation on all 2D drawing tools" },
        { title: "Vectorworks Forum - Tool Tips", url: "https://forum.vectorworks.net/", description: "Community discussions on efficient tool usage" },
      ],

      relatedTutorials: [
        { title: "Vectorworks Tutorial: Navigating the User Interface", slug: "navigating-user-interface" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
        { title: "Vectorworks Tutorial: Installing a Workspace and Template", slug: "installing-workspace-template" },
      ],
    },
    "sheet-layers": {
      id: 6,
      slug: "sheet-layers",
      title: "Vectorworks Tutorial: Sheet Layers",
      description: "Learn how to use sheet layers for laying out pages for printing, including creating viewports, adding title blocks, and managing drawing scales for professional documentation.",
      youtubeId: "D4AXwNQgdBI",
      category: "2D Drafting",
      difficulty: "Beginner",
      duration: 476, // 7:56 in seconds
      uploadDate: "2021-01-27",
      
      overview: "This tutorial covers the essential workflow for creating professional print documentation in Vectorworks using sheet layers. You'll learn how to set up sheet layers as virtual pages, create viewports that reference your design layer content, add title blocks and borders, and manage drawing scales. By the end of this tutorial, you'll understand how to organize multiple drawings on a single sheet and create a complete drawing package ready for printing or PDF export.\n\nSheet layers are fundamental to professional documentation workflow, allowing you to present your design work in a standardized format with proper title blocks, drawing numbers, and scales. This tutorial demonstrates the complete process from creating a blank sheet to populating it with multiple viewports at different scales.",
      
      learningObjectives: [
        "Understand the difference between design layers and sheet layers",
        "Create and manage sheet layers for print documentation",
        "Add and configure title blocks and borders",
        "Create viewports from design layer content",
        "Control viewport scales and drawing labels",
        "Organize multiple viewports on a single sheet",
      ],
      
      keyConcepts: [
        { title: "SHEET LAYER", content: "A layer within Vectorworks used to lay out pages for printing, similar to a physical sheet of paper where you arrange your drawings. Sheet layers are the final output format for documentation." },
        { title: "VIEWPORT", content: "A window into a design layer that displays specific content on a sheet layer, allowing you to show the same drawing at different scales or views. Viewports link design content to print layouts." },
        { title: "TITLE BLOCK", content: "A standardized border and information area on a sheet that contains project details, sheet numbers, drawing titles, and other documentation metadata. Title blocks provide consistent documentation formatting." },
        { title: "CROP", content: "A rectangle that defines which portion of a design layer will be visible in a viewport, allowing you to isolate specific drawings or details. Crops control what content appears in each viewport." },
        { title: "DRAWING LABEL", content: "Text that identifies a viewport with a drawing number and title, automatically linked to the viewport properties for easy updates. Drawing labels maintain consistency across documentation." },
        { title: "SCALE", content: "The ratio between the size of the drawing on the sheet and the actual size of the object, such as 1/2\" = 1'-0\" for architectural drawings. Proper scale control ensures accurate documentation." },
      ],
      
      proTips: [
        "Name your viewports descriptively (e.g., 'Wall Front', 'Plan View') in the Object Info palette to easily identify them in complex drawing packages.",
        "Use the keyboard shortcut Ctrl/Cmd + ' (apostrophe) to quickly create a viewport from a selected crop rectangle.",
        "Sheet layer numbers and titles automatically populate in title blocks through the Title Block Manager - no manual text editing needed.",
        "Keep your design layers organized and clean since viewports directly reference that content - changes in design layers instantly update on sheets.",
        "Create a standard template with pre-configured sheet layers and title blocks to maintain consistency across all your projects.",
        "Use the Navigation palette to quickly switch between sheet layers and see all viewports associated with each sheet.",
        "Set viewport scales in the Object Info palette for precise control over how your drawings appear at different sizes on the same sheet.",
      ],
      
      shortcuts: [
        { keys: "Ctrl/Cmd + '", action: "Create Viewport", description: "Quickly create a viewport from a selected crop rectangle" },
        { keys: "Fit to Page", action: "Zoom to Sheet", description: "View the entire sheet layer in the viewport (use zoom icons)" },
      ],
      
      commonPitfalls: [
        "Forgetting to create a crop rectangle before making a viewport - the crop defines what content will be visible.",
        "Not naming viewports descriptively, making it difficult to identify them later in complex drawing sets.",
        "Manually editing title block text instead of using the sheet layer properties, which breaks automatic updates.",
        "Creating viewports at incorrect scales and not checking the Object Info palette scale settings.",
        "Placing too many viewports on a single sheet, making the documentation cluttered and hard to read.",
      ],
      
      transcript: [
        { time: "0:00", text: "[Music]" },
        { time: "0:06", text: "Hello, this is Brandon PT Davis and in this Vectorworks tutorial we will discuss sheet layers." },
        { time: "0:14", text: "A sheet layer is a layer within Vectorworks that the user will use to lay out a page for printing." },
        { time: "0:22", text: "We had discussed in a previous video design layers and how they are like pages, and sheet layers are pages." },
        { time: "0:33", text: "In order to access the sheet layer from the navigation palette, we will click on the icon that looks like a piece of paper with a folded corner." },
        { time: "0:44", text: "Currently in the document we have one sheet layer. That sheet layer is numbered 1 and titled Sheet Layer 1." },
        { time: "0:56", text: "To access the sheet layer, I'm going to click next to the sheet number to toggle to the sheet layer." },
        { time: "1:03", text: "Currently we are zoomed into the sheet layer. To see the full page I will click 'Fit to Page' area in the top zoom icons." },
        { time: "1:14", text: "In the template you will notice that the sheet layer has a border and title block pre-loaded." },
        { time: "1:21", text: "I can modify the sheet layer by right-clicking and going to Edit." },
        { time: "1:31", text: "In the sheet layer dialog you'll see you can modify the sheet number, the sheet title, the stacking order, and the raster rendering DPI." },
        { time: "1:48", text: "I'm going to call this sheet layer 'Wall Elevation'. I will retain the sheet number as 1 and press OK." },
        { time: "2:00", text: "Please note that within the title block, the sheet number and the sheet title are auto-generated through the Title Block Manager." },
        { time: "2:12", text: "We'll go into more specifics on the Title Block Manager in another tutorial video." },
        { time: "2:17", text: "To add another sheet layer I can right-click and select New." },
        { time: "2:29", text: "This sheet layer I'm going to number 2 and type in 'Details' and press OK." },
        { time: "2:45", text: "What you'll notice is that I just have the outline of the page without the border or title block." },
        { time: "2:52", text: "To insert a border and title block you can go to the Dimension and Notes tools and scroll to the Title Block Border tool." },
        { time: "3:04", text: "In the title block border style, I can click 'UTEP Basic Title Block' to load the title block and click on the center." },
        { time: "3:22", text: "Now I have the title block installed. Now that the title block is installed you will notice the sheet title corresponds with the title we entered in the navigation palette." },
        { time: "3:37", text: "In order to add our 2D drafting to the sheet layer, we'll first go back to the design layer." },
        { time: "3:44", text: "In the design layer I have this drawing of a wall with a top view, a section, and a front elevation." },
        { time: "3:52", text: "To transfer the information from the design layer to the sheet layer, you first want to create a rectangle crop around the item that you want to be displayed." },
        { time: "4:05", text: "I'm going to start with the front elevation. With the rectangle still highlighted I will now go to View > Create Viewport." },
        { time: "4:21", text: "The dialog says 'The selected object may be used as a viewport's crop. Do you want to use this as a crop?' Click Yes." },
        { time: "4:34", text: "Now a Create Viewport dialog will appear. There is a number of settings that we can modify: the first is name, viewport, drawing number, sheet number." },
        { time: "4:52", text: "I will go ahead and leave this icon clicked. We are going to create layers on Sheet 1 Wall Elevation, create a drawing label." },
        { time: "5:04", text: "We're going to use the style that is built into our file, and in the drawing number dialog I'm going to write 2, and in the drawing title I will write 'Wall Front' and press OK." },
        { time: "5:25", text: "In the navigation palette with the viewport selected, you will note the scale is currently set to a quarter inch." },
        { time: "5:36", text: "We can modify the scale by clicking the scale drop down. I'm going to change this to half inch scale." },
        { time: "5:45", text: "Now that I've shown you how to modify the scale of a viewport, I want to show that you can also update the drawing title and number in the Object Info palette." },
        { time: "5:58", text: "At the bottom of the Object Info palette you see this name - this is the name of the viewport." },
        { time: "6:05", text: "If we look in the navigation next to the sheet layers is the viewport. Here is the viewport 2-1 which is the same viewport that I have selected." },
        { time: "6:17", text: "I recommend putting a small name by the viewport like 'Wall Front'. As your drawing package gets more complex, having this information will help you identify a viewport from the viewport navigation." },
        { time: "6:38", text: "Now I'm going to add the plan view to the drawing. I'm going to go back to the drawing layer." },
        { time: "6:48", text: "I'm first going to redraw the crop and have the crop selected, and press Ctrl or Command apostrophe to create the viewport." },
        { time: "7:05", text: "This time I'm going to go ahead and name the viewport manually: 1-1 Wall Plan." },
        { time: "7:19", text: "I will update the drawing title to 'Wall Plan' and I can also change the scale to half inch scale and press OK." },
        { time: "7:34", text: "Directly above our viewport we have the wall plan viewport." },
        { time: "7:42", text: "This concludes the Vectorworks tutorial on sheet layers. If you have any questions, feel free to ask." },
      ],
      
      relatedResources: [
        { type: "Documentation", title: "Vectorworks Sheet Layers Guide", url: "https://app-help.vectorworks.net/" },
        { type: "Video", title: "Title Block Manager Tutorial", url: "https://www.youtube.com/vectorworks" },
        { type: "Template", title: "Professional Title Block Templates", url: "https://www.vectorworks.net/" },
      ],
      
      relatedTutorials: [
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
        { title: "Vectorworks Tutorial: Basics Tool Palette", slug: "basics-tool-palette" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
      ],
    },
    "creating-trim-profiles-polyline": {
      id: 7,
      title: "Vectorworks Quick Tip: Creating Trim Profiles with the Polyline Tool",
      slug: "creating-trim-profiles-polyline",
      youtubeId: "EZB5O-Wmsk4",
      description: "Learn how to quickly create accurate trim and molding profiles by tracing reference images using the polyline tool and converting them to reusable 2D symbols.",
      category: "2D Drafting",
      difficultyLevel: "Intermediate",
      duration: 374,
      uploadDate: "2021-01-28",
      
      overview: `This quick-tip tutorial demonstrates a practical workflow for creating accurate architectural trim and molding profiles in Vectorworks. The tutorial walks through the complete process: sourcing reference images with real-world dimensions from manufacturer websites, importing images into Vectorworks, tracing profiles using the polyline tool with multiple vertex modes, scaling traced geometry to match actual dimensions, and converting finished profiles into reusable 2D symbols.

The workflow emphasizes efficiency by showing how to trace profiles directly without pre-scaling the reference image, then applying accurate dimensions after tracing is complete. This approach saves time and reduces complexity compared to traditional scaling methods. The tutorial covers essential polyline techniques including corner vertex mode, radius point arc mode, and polygon point editing for achieving smooth curves that match the reference profile.

Finally, the tutorial demonstrates how to convert the finished profile into a 2D symbol stored in the Resource Manager, making it instantly available for reuse across multiple drawings. This symbol workflow ensures consistency across documentation and eliminates the need to redraw common trim profiles repeatedly.`,
      
      learningObjectives: [
        "Source trim profile reference images with dimensional data from manufacturer websites",
        "Import and configure reference images in Vectorworks (JPEG vs PNG considerations)",
        "Trace complex profiles using polyline tool with multiple vertex modes",
        "Apply accurate real-world dimensions to traced geometry using Object Info palette",
        "Convert traced profiles to reusable 2D symbols with proper class assignments",
        "Organize trim profile symbols in Resource Manager for efficient reuse",
      ],
      
      keyConcepts: [
        { title: "POLYLINE TOOL", content: "A versatile drawing tool that creates connected line segments and curves in a single object. The polyline tool supports multiple vertex modes (corner, radius arc, bezier) that can be toggled during drawing, making it ideal for tracing complex shapes like trim profiles." },
        { title: "VERTEX MODES", content: "Different point types available in the polyline tool: Corner Vertex creates sharp angles, Radius Point Arc creates smooth curves with adjustable radius, and Bezier creates flowing curves with control handles. Toggle between modes using the 'U' hotkey while drawing." },
        { title: "REFERENCE IMAGE IMPORT", content: "The process of bringing external images into Vectorworks as tracing guides. JPEG format offers smaller file sizes, while PNG format preserves transparency data. Reference images should include dimensional information for accurate scaling after tracing." },
        { title: "OBJECT INFO PALETTE", content: "The palette that displays and allows editing of selected object properties including dimensions, position, class assignment, and other attributes. Use this palette to apply accurate real-world dimensions to traced geometry by entering X and Y dimension values." },
        { title: "2D SYMBOLS", content: "Reusable graphic elements stored in the Resource Manager that can be placed multiple times in drawings. Converting trim profiles to symbols ensures consistency, saves time, and allows instant updates across all instances when the symbol definition is edited." },
        { title: "CLASS ASSIGNMENT", content: "The process of assigning drawn geometry to specific classes that control graphic appearance and visibility. Trim profiles should be assigned to appropriate classes (e.g., 'Section Hatch') before converting to symbols to ensure proper display in different drawing contexts." },
      ],
      
      proTips: [
        "Source trim profiles from manufacturer websites like uDecor.com that provide both profile images and accurate dimensional data in a single location.",
        "Save reference images with descriptive filenames that include product codes or profile names to maintain organization and traceability.",
        "Choose JPEG format for reference images when transparency isn't needed—smaller file sizes improve Vectorworks performance.",
        "Trace profiles directly without pre-scaling the reference image; it's faster to apply accurate dimensions after tracing using the Object Info palette.",
        "Use the 'U' hotkey to toggle between polyline vertex modes (corner, arc, bezier) while actively drawing—no need to stop and restart.",
        "Assign traced profiles to appropriate classes (like 'Section Hatch') before converting to symbols to ensure proper graphic display in documentation.",
        "Convert trim profiles to 2D symbols using Cmd/Ctrl+K, then enable 'Convert to Group' option for easier editing in 2D workflows.",
        "Name symbols descriptively (e.g., 'Crown Molding - Product Code') in the Resource Manager to quickly identify profiles in complex drawing packages.",
        "Use 'Next Mouse Click' insertion mode when creating symbols to control exactly where the symbol's origin point will be located.",
        "Store completed trim profile symbols in a dedicated library file that can be shared across projects and team members for consistency.",
      ],
      
      shortcuts: [
        { keys: ["5"], action: "Activate Polyline Tool", description: "Quickly switch to the polyline tool for tracing profiles" },
        { keys: ["U"], action: "Toggle Vertex Mode", description: "Cycle between corner, arc, and bezier vertex modes while drawing" },
        { keys: ["Cmd/Ctrl", "K"], action: "Create Symbol", description: "Convert selected geometry to a reusable 2D or 3D symbol" },
        { keys: ["Double Click"], action: "Complete Polyline", description: "Finish drawing the current polyline and exit the tool" },
      ],
      
      commonPitfalls: [
        "Attempting to scale reference images before tracing instead of tracing first and scaling geometry afterward—this adds unnecessary complexity and steps.",
        "Not sourcing dimensional data along with profile images, forcing guesswork when scaling traced geometry to real-world sizes.",
        "Forgetting to assign traced geometry to appropriate classes before converting to symbols, resulting in symbols that don't display correctly in section views.",
        "Not using 'Convert to Group' option when creating 2D symbols, making it harder to edit symbol geometry later in 2D workflows.",
        "Creating symbols without descriptive names, leading to confusion when selecting from dozens of similar trim profiles in the Resource Manager.",
      ],
      
      transcript: [
        { timestamp: "0:04", speaker: "Brandon PT Davis", text: "[Music]" },
        { timestamp: "0:06", speaker: "Brandon PT Davis", text: "hello this is brandon pt davis" },
        { timestamp: "0:08", speaker: "Brandon PT Davis", text: "theatrical scenic designer in this" },
        { timestamp: "0:10", speaker: "Brandon PT Davis", text: "vectorworks tutorial" },
        { timestamp: "0:12", speaker: "Brandon PT Davis", text: "we'll be using the polyline tool to show" },
        { timestamp: "0:15", speaker: "Brandon PT Davis", text: "how you can quickly" },
        { timestamp: "0:16", speaker: "Brandon PT Davis", text: "create trim profiles for your drawings" },
        { timestamp: "0:21", speaker: "Brandon PT Davis", text: "to start this tutorial i'm going to go" },
        { timestamp: "0:23", speaker: "Brandon PT Davis", text: "to udecore.com" },
        { timestamp: "0:25", speaker: "Brandon PT Davis", text: "to get a trim profile that has real" },
        { timestamp: "0:29", speaker: "Brandon PT Davis", text: "world information" },
        { timestamp: "0:31", speaker: "Brandon PT Davis", text: "in the website i can see the term" },
        { timestamp: "0:33", speaker: "Brandon PT Davis", text: "profile here" },
        { timestamp: "0:35", speaker: "Brandon PT Davis", text: "and i also have the size information and" },
        { timestamp: "0:38", speaker: "Brandon PT Davis", text: "material" },
        { timestamp: "0:39", speaker: "Brandon PT Davis", text: "so what i'm going to do is i'm going to" },
        { timestamp: "0:41", speaker: "Brandon PT Davis", text: "right click and save the image as" },
        { timestamp: "0:44", speaker: "Brandon PT Davis", text: "the image is already named with the" },
        { timestamp: "0:47", speaker: "Brandon PT Davis", text: "product" },
        { timestamp: "0:47", speaker: "Brandon PT Davis", text: "code i'm going to simply add" },
        { timestamp: "0:51", speaker: "Brandon PT Davis", text: "crown molding" },
        { timestamp: "0:55", speaker: "Brandon PT Davis", text: "for my workflow" },
        { timestamp: "0:58", speaker: "Brandon PT Davis", text: "now in my vectorworks file i'm going to" },
        { timestamp: "1:01", speaker: "Brandon PT Davis", text: "go to" },
        { timestamp: "1:02", speaker: "Brandon PT Davis", text: "file import" },
        { timestamp: "1:05", speaker: "Brandon PT Davis", text: "and select image file" },
        { timestamp: "1:10", speaker: "Brandon PT Davis", text: "i have the image file on my desktop so i" },
        { timestamp: "1:13", speaker: "Brandon PT Davis", text: "will open" },
        { timestamp: "1:15", speaker: "Brandon PT Davis", text: "and the dialog will ask if i prefer a" },
        { timestamp: "1:18", speaker: "Brandon PT Davis", text: "jpeg or" },
        { timestamp: "1:19", speaker: "Brandon PT Davis", text: "png a jpeg" },
        { timestamp: "1:22", speaker: "Brandon PT Davis", text: "is smaller in size but the png is going" },
        { timestamp: "1:25", speaker: "Brandon PT Davis", text: "to have data" },
        { timestamp: "1:26", speaker: "Brandon PT Davis", text: "for transparency in this example i'm not" },
        { timestamp: "1:29", speaker: "Brandon PT Davis", text: "really concerned about transparency" },
        { timestamp: "1:32", speaker: "Brandon PT Davis", text: "so i'm going to go ahead and select the" },
        { timestamp: "1:33", speaker: "Brandon PT Davis", text: "jpeg file" },
        { timestamp: "1:35", speaker: "Brandon PT Davis", text: "press ok typically some vex works users" },
        { timestamp: "1:39", speaker: "Brandon PT Davis", text: "would then try to go to the modify scale" },
        { timestamp: "1:41", speaker: "Brandon PT Davis", text: "options" },
        { timestamp: "1:42", speaker: "Brandon PT Davis", text: "to try to get the term profile as close" },
        { timestamp: "1:44", speaker: "Brandon PT Davis", text: "as possible but i find that it's best" },
        { timestamp: "1:47", speaker: "Brandon PT Davis", text: "to just trace the profile and scale it" },
        { timestamp: "1:50", speaker: "Brandon PT Davis", text: "after" },
        { timestamp: "1:51", speaker: "Brandon PT Davis", text: "i'm going to use the polyline tool or" },
        { timestamp: "1:54", speaker: "Brandon PT Davis", text: "hotkey 5 to trace the object" },
        { timestamp: "1:59", speaker: "Brandon PT Davis", text: "i'm starting out with the corner vertex" },
        { timestamp: "2:06", speaker: "Brandon PT Davis", text: "mode" },
        { timestamp: "2:19", speaker: "Brandon PT Davis", text: "now i can toggle to" },
        { timestamp: "2:23", speaker: "Brandon PT Davis", text: "the point arc mode by pressing u" },
        { timestamp: "2:42", speaker: "Brandon PT Davis", text: "alternatively what you can do is just" },
        { timestamp: "2:45", speaker: "Brandon PT Davis", text: "select the main points" },
        { timestamp: "2:47", speaker: "Brandon PT Davis", text: "using the line tool" },
        { timestamp: "3:06", speaker: "Brandon PT Davis", text: "now i'm going to double click and use" },
        { timestamp: "3:10", speaker: "Brandon PT Davis", text: "add vertex mode with the" },
        { timestamp: "3:13", speaker: "Brandon PT Davis", text: "radius point on arc selected" },
        { timestamp: "3:42", speaker: "Brandon PT Davis", text: "then i'll use the move polygon point" },
        { timestamp: "3:48", speaker: "Brandon PT Davis", text: "to try to make the profile" },
        { timestamp: "3:52", speaker: "Brandon PT Davis", text: "match the shape below fast as possible" },
        { timestamp: "4:19", speaker: "Brandon PT Davis", text: "once i'm satisfied with the profile" },
        { timestamp: "4:22", speaker: "Brandon PT Davis", text: "i'm going to change the class from none" },
        { timestamp: "4:26", speaker: "Brandon PT Davis", text: "to my section hatch" },
        { timestamp: "4:35", speaker: "Brandon PT Davis", text: "i will then delete the reference image" },
        { timestamp: "4:39", speaker: "Brandon PT Davis", text: "i have returned to the reference website" },
        { timestamp: "4:42", speaker: "Brandon PT Davis", text: "to check for" },
        { timestamp: "4:43", speaker: "Brandon PT Davis", text: "the dimension data it says the breadth" },
        { timestamp: "4:47", speaker: "Brandon PT Davis", text: "is" },
        { timestamp: "4:47", speaker: "Brandon PT Davis", text: "five and a half inches and the height" },
        { timestamp: "4:49", speaker: "Brandon PT Davis", text: "and width are four inches" },
        { timestamp: "4:52", speaker: "Brandon PT Davis", text: "i'm going to use the height and width" },
        { timestamp: "4:53", speaker: "Brandon PT Davis", text: "information" },
        { timestamp: "4:55", speaker: "Brandon PT Davis", text: "to scale the object i'm going to select" },
        { timestamp: "4:58", speaker: "Brandon PT Davis", text: "the object" },
        { timestamp: "5:00", speaker: "Brandon PT Davis", text: "and i'm going to change the x dimension" },
        { timestamp: "5:04", speaker: "Brandon PT Davis", text: "to 4 and the y dimension to 4." },
        { timestamp: "5:08", speaker: "Brandon PT Davis", text: "now that i have the term profile scaled" },
        { timestamp: "5:11", speaker: "Brandon PT Davis", text: "i'm going to create" },
        { timestamp: "5:12", speaker: "Brandon PT Davis", text: "a 2d symbol to create the 2d symbol" },
        { timestamp: "5:15", speaker: "Brandon PT Davis", text: "i'm going to hit command or control k" },
        { timestamp: "5:21", speaker: "Brandon PT Davis", text: "i'm going to name this symbol crown" },
        { timestamp: "5:25", speaker: "Brandon PT Davis", text: "molding" },
        { timestamp: "5:28", speaker: "Brandon PT Davis", text: "i'm going to select next mouse click" },
        { timestamp: "5:32", speaker: "Brandon PT Davis", text: "and keep it as a world-based unit" },
        { timestamp: "5:37", speaker: "Brandon PT Davis", text: "i'm going to uncheck the insert in wall" },
        { timestamp: "5:39", speaker: "Brandon PT Davis", text: "since i will not" },
        { timestamp: "5:40", speaker: "Brandon PT Davis", text: "be applying this to a three-dimensional" },
        { timestamp: "5:42", speaker: "Brandon PT Davis", text: "wall" },
        { timestamp: "5:44", speaker: "Brandon PT Davis", text: "i'm going to select convert to group so" },
        { timestamp: "5:47", speaker: "Brandon PT Davis", text: "that i'm working in a 2d workflow" },
        { timestamp: "5:49", speaker: "Brandon PT Davis", text: "i can easily modify the molding" },
        { timestamp: "5:53", speaker: "Brandon PT Davis", text: "now when i return to my resource manager" },
        { timestamp: "5:56", speaker: "Brandon PT Davis", text: "i can find the 2d shape that was created" },
        { timestamp: "6:00", speaker: "Brandon PT Davis", text: "if i double click on this object i can" },
        { timestamp: "6:03", speaker: "Brandon PT Davis", text: "then place" },
        { timestamp: "6:04", speaker: "Brandon PT Davis", text: "an instance of it in the document" },
        { timestamp: "6:07", speaker: "Brandon PT Davis", text: "this completes the vex works tutorial on" },
        { timestamp: "6:09", speaker: "Brandon PT Davis", text: "the polyline tool" },
        { timestamp: "6:11", speaker: "Brandon PT Davis", text: "if you have any questions feel free to" },
        { timestamp: "6:12", speaker: "Brandon PT Davis", text: "ask thank you" },
      ],
      
      relatedResources: [
        { title: "Vectorworks Polyline Tool Documentation", url: "https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Shapes2/Polyline_Tool.htm" },
        { title: "uDecor Architectural Trim Catalog", url: "https://www.udecor.com" },
        { title: "Vectorworks Symbol Creation Guide", url: "https://university.vectorworks.net" },
      ],
      
      relatedTutorials: [
        { title: "Vectorworks Tutorial: Basics Tool Palette", slug: "basics-tool-palette" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
        { title: "Vectorworks Tutorial: Sheet Layers", slug: "sheet-layers" },
      ],
    },
    "2d-edit-modify-tricks": {
      id: 8,
      title: "Vectorworks Tutorial: 2D Edit and Modify Tricks",
      slug: "2d-edit-modify-tricks",
      youtubeId: "8lTla9cvIPk",
      description: "Master essential 2D editing and modification tools including Mirror, Reshape, Offset, Split, Connect/Combine, and advanced Modify menu commands for efficient drafting workflows.",
      category: "2D Drafting",
      difficultyLevel: "Intermediate",
      duration: 767,
      uploadDate: "2021-01-29",
      
      overview: `This comprehensive tutorial covers the essential 2D editing and modification tools that form the foundation of efficient drafting workflows in Vectorworks. The tutorial systematically demonstrates ten powerful tools and commands: Mirror Tool (standard and duplicate modes), Reshape Tool (move polygon handles, move edges parallel, add/delete vertex), Offset Tool (distance and point modes), Split Tool (line, point, and trim modes), Connect/Combine Tool (single, dual, and multiple object modes), and key Modify menu commands including Move, Align/Distribute, Rotate, Scale, Add/Subtract surfaces, Convert to Lines, and Compose/Decompose.

The tutorial emphasizes practical workflows for each tool, showing how to access them via tool palettes, hotkeys, and right-click context menus. Each tool section demonstrates multiple modes and options, helping users understand when to use standard versus duplicate modes, symmetric versus asymmetric scaling, and single versus multiple object operations. The tutorial also covers essential shape manipulation techniques like closing open polylines, converting between lines and polygons, and using Boolean operations (add, subtract, intersect) to create complex shapes from simple primitives.

The final section introduces the powerful Duplicate Along Path feature, which allows users to distribute objects evenly along curved or straight paths with precise control over spacing, offset, and tangency. This advanced technique is essential for creating repeating elements like fence posts, lighting fixtures, or decorative patterns in scenic design documentation.`,
      
      learningObjectives: [
        "Master Mirror Tool in both standard and duplicate modes for creating symmetrical designs",
        "Use Reshape Tool to modify polygon geometry including moving handles, edges, and adding/deleting vertices",
        "Apply Offset Tool with distance and point modes to create parallel geometry at precise distances",
        "Utilize Split Tool in line, point, and trim modes to divide and separate 2D shapes",
        "Connect and combine multiple line segments using single, dual, and multiple object modes",
        "Apply Modify menu commands including Move, Align, Rotate, and Scale with precise numerical control",
        "Create complex shapes using Boolean operations: Add Surface, Clip Surface, and Intersect Surface",
        "Convert between lines and polygons using Compose and Decompose commands",
        "Duplicate objects along paths with control over spacing, offset, and tangency options",
      ],
      
      keyConcepts: [
        { title: "MIRROR TOOL", content: "A transformation tool that creates mirrored copies of objects across a user-defined axis. Standard mode moves the object to the mirrored position, while Duplicate mode creates a copy and leaves the original in place. Essential for creating symmetrical scenic elements." },
        { title: "RESHAPE TOOL", content: "An editing tool that allows direct manipulation of polygon geometry through multiple modes: Move Polygon Handles adjusts individual vertices, Move Edges Parallel shifts entire edges, Add Vertex creates new points (with corner or radius options), and Delete Vertex removes points. Activated by double-clicking 2D shapes." },
        { title: "OFFSET TOOL", content: "Creates parallel copies of objects at specified distances. Offset Distance Mode duplicates or moves geometry by a numerical value, while Offset by Points Mode allows visual placement. Hotkey 'O' provides quick access. Essential for creating wall thicknesses, borders, and parallel elements." },
        { title: "SPLIT TOOL", content: "Divides 2D and 3D objects into separate pieces using three modes: Line Split cuts along a drawn line, Point Split divides at a single location, and Trim Mode removes portions of geometry based on directional indication. Critical for breaking complex shapes into manageable components." },
        { title: "CONNECT/COMBINE TOOL", content: "Joins line segments and shapes using multiple modes: Single Object Connect extends one line to another, Dual Object Connect joins two lines at a point (keeping them separate), Dual Object Combine merges two lines into a single polygon, and Multiple Object Connect joins many lines to a destination point. Hotkey 'L'." },
        { title: "BOOLEAN OPERATIONS", content: "Geometric operations that combine or subtract shapes: Add Surface merges multiple shapes into one polygon, Clip Surface subtracts one shape from another, and Intersect Surface creates a new shape from overlapping areas. Found in Modify menu and right-click context menu." },
        { title: "DUPLICATE ALONG PATH", content: "An advanced feature (Edit > Duplicate Along Path) that distributes copies of an object along a curved or straight path. Options include duplicate by number or fixed distance, start offset, and tangency control. Center Object to Path places object centers on the path, while Tangent to Path rotates objects to follow path direction." },
      ],
      
      proTips: [
        "Access Mirror Tool from Basics Tool Palette; always select the object first, then activate the tool to see mode options.",
        "Double-click any 2D shape to instantly enter Reshape Tool mode without navigating through menus.",
        "Use hotkey 'O' for Offset Tool and hotkey 'L' for Connect/Combine Tool to speed up repetitive drafting tasks.",
        "In Reshape Tool, press 'U' to toggle between corner vertex and radius arc modes while adding vertices for smooth curves.",
        "Close open polylines by selecting the shape and checking 'Closed' in the Object Info Palette—essential after using Split Tool in Trim mode.",
        "Right-click on selected objects to access Align/Distribute, Compose/Decompose, and Boolean operations without opening the Modify menu.",
        "Use Modify > Move (Cmd/Ctrl+M) with numerical X/Y offsets for precise object positioning instead of dragging by eye.",
        "Hold Ctrl (Windows) or Option (Mac) while dragging objects to duplicate them in place—watch for the plus sign cursor indicator.",
        "In Duplicate Along Path, use 'Center Object to Path' for circular objects and 'Tangent to Path' for directional objects like arrows or posts.",
        "Combine Boolean operations (Add, Clip, Intersect) with Reshape Tool to create complex architectural trim profiles and scenic details efficiently.",
      ],
      
      shortcuts: [
        { keys: ["X"], action: "Selection Tool", description: "Activate selection tool to select objects before applying modifications" },
        { keys: ["O"], action: "Offset Tool", description: "Quick access to offset tool for creating parallel geometry" },
        { keys: ["L"], action: "Connect/Combine Tool", description: "Quick access to connect and combine line segments" },
        { keys: ["Cmd/Ctrl", "M"], action: "Move Selection", description: "Open Move dialog for precise numerical positioning" },
        { keys: ["Cmd/Ctrl", "R"], action: "Rotate Right", description: "Rotate selected objects clockwise" },
        { keys: ["Cmd/Ctrl", "L"], action: "Rotate Left", description: "Rotate selected objects counterclockwise" },
        { keys: ["Ctrl/Option", "Drag"], action: "Duplicate Object", description: "Hold modifier key while dragging to create duplicate" },
        { keys: ["Double Click"], action: "Enter Reshape Mode", description: "Double-click any 2D shape to enter Reshape Tool" },
        { keys: ["U"], action: "Toggle Vertex Mode", description: "Switch between corner and radius arc modes in Reshape Tool" },
      ],
      
      commonPitfalls: [
        "Forgetting to select objects before activating Mirror, Offset, or Split tools—tools require active selection to function.",
        "Using Offset Tool in 'Offset Original' mode when you meant to keep the original—always check the mode before clicking.",
        "Not closing polylines after using Split Tool in Trim mode, leaving open shapes that won't fill with hatches or textures.",
        "Attempting to use Connect/Combine Tool on shapes instead of line segments—tool works on lines, not closed polygons.",
        "Forgetting to select the path object in Duplicate Along Path dialog—must click 'Next' to designate which object is the path.",
        "Using 'Duplicate by Number' in Duplicate Along Path without considering path length, resulting in overlapping or sparse distributions.",
        "Not understanding the difference between Dual Object Connect (keeps separate lines) and Dual Object Combine (creates single polygon).",
        "Applying Boolean operations (Add/Clip/Intersect) to objects on different layers or classes, which can produce unexpected results.",
      ],
      
      transcript: [
        { timestamp: "0:04", speaker: "Brandon PT Davis", text: "[Music]" },
        { timestamp: "0:06", speaker: "Brandon PT Davis", text: "hello" },
        { timestamp: "0:06", speaker: "Brandon PT Davis", text: "this is brandon pc davis theatrical" },
        { timestamp: "0:09", speaker: "Brandon PT Davis", text: "scenic designer" },
        { timestamp: "0:10", speaker: "Brandon PT Davis", text: "this effective works tutorial is going" },
        { timestamp: "0:12", speaker: "Brandon PT Davis", text: "to be 2d" },
        { timestamp: "0:14", speaker: "Brandon PT Davis", text: "edit modify tricks and tools" },
        { timestamp: "0:17", speaker: "Brandon PT Davis", text: "the first tool i'm going to show you in" },
        { timestamp: "0:18", speaker: "Brandon PT Davis", text: "this tutorial is the" },
        { timestamp: "0:20", speaker: "Brandon PT Davis", text: "mirror tool the mirror tool" },
        { timestamp: "0:24", speaker: "Brandon PT Davis", text: "can be accessed in the basics tool" },
        { timestamp: "0:28", speaker: "Brandon PT Davis", text: "palette" },
        { timestamp: "0:31", speaker: "Brandon PT Davis", text: "in order to use the tool you first need" },
        { timestamp: "0:33", speaker: "Brandon PT Davis", text: "to select an object" },
        { timestamp: "0:34", speaker: "Brandon PT Davis", text: "i'm going to hit x for the select" },
        { timestamp: "0:38", speaker: "Brandon PT Davis", text: "and now i'm going to select the mirror" },
        { timestamp: "0:39", speaker: "Brandon PT Davis", text: "tool there are two" },
        { timestamp: "0:41", speaker: "Brandon PT Davis", text: "modes in the mirror tool there is the" },
        { timestamp: "0:43", speaker: "Brandon PT Davis", text: "standard mode" },
        { timestamp: "0:44", speaker: "Brandon PT Davis", text: "and the duplicate mode the standard mode" },
        { timestamp: "0:48", speaker: "Brandon PT Davis", text: "will mirror the item on the other side" },
        { timestamp: "0:51", speaker: "Brandon PT Davis", text: "from which you have indicated the mirror" },
        { timestamp: "0:55", speaker: "Brandon PT Davis", text: "duplicate tool" },
        { timestamp: "0:56", speaker: "Brandon PT Davis", text: "will mirror and duplicate the item" },
        { timestamp: "1:01", speaker: "Brandon PT Davis", text: "the next tool is the reshape tool it can" },
        { timestamp: "1:03", speaker: "Brandon PT Davis", text: "be found" },
        { timestamp: "1:05", speaker: "Brandon PT Davis", text: "in the tools palette it can also" },
        { timestamp: "1:08", speaker: "Brandon PT Davis", text: "be activated by double clicking on a 2d" },
        { timestamp: "1:11", speaker: "Brandon PT Davis", text: "shape" },
        { timestamp: "1:12", speaker: "Brandon PT Davis", text: "there are a few modes within the reshape" },
        { timestamp: "1:14", speaker: "Brandon PT Davis", text: "tool the reset tool has the move polygon" },
        { timestamp: "1:17", speaker: "Brandon PT Davis", text: "handles mode" },
        { timestamp: "1:18", speaker: "Brandon PT Davis", text: "which allows you to select the polygon" },
        { timestamp: "1:21", speaker: "Brandon PT Davis", text: "handle" },
        { timestamp: "1:21", speaker: "Brandon PT Davis", text: "and move it individually" },
        { timestamp: "1:26", speaker: "Brandon PT Davis", text: "the move edges parallel mode allows you" },
        { timestamp: "1:29", speaker: "Brandon PT Davis", text: "to move" },
        { timestamp: "1:30", speaker: "Brandon PT Davis", text: "the active edge" },
        { timestamp: "1:33", speaker: "Brandon PT Davis", text: "we can also further modify a shape" },
        { timestamp: "1:36", speaker: "Brandon PT Davis", text: "by adding vertex points in vertex mode" },
        { timestamp: "1:41", speaker: "Brandon PT Davis", text: "i can add a radius" },
        { timestamp: "1:44", speaker: "Brandon PT Davis", text: "by clicking on one of the handles and" },
        { timestamp: "1:47", speaker: "Brandon PT Davis", text: "pulling out" },
        { timestamp: "1:49", speaker: "Brandon PT Davis", text: "can also add a corner point" },
        { timestamp: "1:59", speaker: "Brandon PT Davis", text: "the delete vertex mode allows you to" },
        { timestamp: "2:02", speaker: "Brandon PT Davis", text: "delete the vertexes" },
        { timestamp: "2:09", speaker: "Brandon PT Davis", text: "offset tool allows you to offset" },
        { timestamp: "2:14", speaker: "Brandon PT Davis", text: "an object before you can offset you" },
        { timestamp: "2:17", speaker: "Brandon PT Davis", text: "first have to" },
        { timestamp: "2:18", speaker: "Brandon PT Davis", text: "select the object and then go into" },
        { timestamp: "2:21", speaker: "Brandon PT Davis", text: "the offset tool you can also access the" },
        { timestamp: "2:25", speaker: "Brandon PT Davis", text: "offset tool" },
        { timestamp: "2:26", speaker: "Brandon PT Davis", text: "by pressing the letter o" },
        { timestamp: "2:29", speaker: "Brandon PT Davis", text: "the offset tool is currently set at a" },
        { timestamp: "2:32", speaker: "Brandon PT Davis", text: "distance of 6 inches" },
        { timestamp: "2:34", speaker: "Brandon PT Davis", text: "and the mode is offset distance mode" },
        { timestamp: "2:37", speaker: "Brandon PT Davis", text: "and duplicate the offset" },
        { timestamp: "2:40", speaker: "Brandon PT Davis", text: "here i have duplicated the offset" },
        { timestamp: "2:44", speaker: "Brandon PT Davis", text: "i can now lower the offset to one" },
        { timestamp: "2:47", speaker: "Brandon PT Davis", text: "inch and i'm going to change from" },
        { timestamp: "2:50", speaker: "Brandon PT Davis", text: "duplicate and offset mode to" },
        { timestamp: "2:53", speaker: "Brandon PT Davis", text: "offset original mode" },
        { timestamp: "2:58", speaker: "Brandon PT Davis", text: "you can also offset by points" },
        { timestamp: "3:02", speaker: "Brandon PT Davis", text: "select the object and then you can move" },
        { timestamp: "3:06", speaker: "Brandon PT Davis", text: "to where you want to offset the object" },
        { timestamp: "3:10", speaker: "Brandon PT Davis", text: "the split tool with the icon located" },
        { timestamp: "3:13", speaker: "Brandon PT Davis", text: "here" },
        { timestamp: "3:14", speaker: "Brandon PT Davis", text: "is a powerful tool that can be used in" },
        { timestamp: "3:16", speaker: "Brandon PT Davis", text: "both 2d" },
        { timestamp: "3:17", speaker: "Brandon PT Davis", text: "and 3d applications before you can use" },
        { timestamp: "3:20", speaker: "Brandon PT Davis", text: "the split tool" },
        { timestamp: "3:21", speaker: "Brandon PT Davis", text: "you first must select the shape" },
        { timestamp: "3:27", speaker: "Brandon PT Davis", text: "now the shape is selected i'm going to" },
        { timestamp: "3:29", speaker: "Brandon PT Davis", text: "go to the split tool" },
        { timestamp: "3:31", speaker: "Brandon PT Davis", text: "there are three modes in the split tool" },
        { timestamp: "3:34", speaker: "Brandon PT Davis", text: "the first mode is the line split mode" },
        { timestamp: "3:39", speaker: "Brandon PT Davis", text: "i'm going to select the point and then a" },
        { timestamp: "3:41", speaker: "Brandon PT Davis", text: "second point" },
        { timestamp: "3:42", speaker: "Brandon PT Davis", text: "creating a line now when i go to select" },
        { timestamp: "3:46", speaker: "Brandon PT Davis", text: "i have two separate objects" },
        { timestamp: "3:52", speaker: "Brandon PT Davis", text: "going back to the split tool i can" },
        { timestamp: "3:54", speaker: "Brandon PT Davis", text: "change the mode to" },
        { timestamp: "3:56", speaker: "Brandon PT Davis", text: "point split mode in which case i will" },
        { timestamp: "3:59", speaker: "Brandon PT Davis", text: "pick" },
        { timestamp: "4:00", speaker: "Brandon PT Davis", text: "a point" },
        { timestamp: "4:04", speaker: "Brandon PT Davis", text: "and now i've split the object with the" },
        { timestamp: "4:07", speaker: "Brandon PT Davis", text: "split point mode" },
        { timestamp: "4:09", speaker: "Brandon PT Davis", text: "the last mode in the split tool is the" },
        { timestamp: "4:12", speaker: "Brandon PT Davis", text: "trim" },
        { timestamp: "4:12", speaker: "Brandon PT Davis", text: "mode and this i will draw a line" },
        { timestamp: "4:17", speaker: "Brandon PT Davis", text: "and then indicate the direction in which" },
        { timestamp: "4:21", speaker: "Brandon PT Davis", text: "i want to keep the object this polyline" },
        { timestamp: "4:25", speaker: "Brandon PT Davis", text: "is now an open shape as it doesn't have" },
        { timestamp: "4:28", speaker: "Brandon PT Davis", text: "a line" },
        { timestamp: "4:29", speaker: "Brandon PT Davis", text: "on all sides in vectorworks" },
        { timestamp: "4:32", speaker: "Brandon PT Davis", text: "if you go to the object info palette you" },
        { timestamp: "4:35", speaker: "Brandon PT Davis", text: "can select" },
        { timestamp: "4:36", speaker: "Brandon PT Davis", text: "closed close the shape" },
        { timestamp: "4:40", speaker: "Brandon PT Davis", text: "to connect combine tool allows you" },
        { timestamp: "4:43", speaker: "Brandon PT Davis", text: "to connect or combine line segments" },
        { timestamp: "4:47", speaker: "Brandon PT Davis", text: "the first mode is the single object" },
        { timestamp: "4:49", speaker: "Brandon PT Davis", text: "connect mode" },
        { timestamp: "4:50", speaker: "Brandon PT Davis", text: "i'm going to select the object that i" },
        { timestamp: "4:53", speaker: "Brandon PT Davis", text: "want connected" },
        { timestamp: "4:54", speaker: "Brandon PT Davis", text: "and then the point to which i want it to" },
        { timestamp: "4:56", speaker: "Brandon PT Davis", text: "be connected to" },
        { timestamp: "4:59", speaker: "Brandon PT Davis", text: "now the line has been extended to this" },
        { timestamp: "5:02", speaker: "Brandon PT Davis", text: "line" },
        { timestamp: "5:04", speaker: "Brandon PT Davis", text: "the hotkey for the connect combine tool" },
        { timestamp: "5:07", speaker: "Brandon PT Davis", text: "is the letter" },
        { timestamp: "5:07", speaker: "Brandon PT Davis", text: "l the next mode is the dual object" },
        { timestamp: "5:11", speaker: "Brandon PT Davis", text: "connect mode" },
        { timestamp: "5:12", speaker: "Brandon PT Davis", text: "in this mode i will select two objects" },
        { timestamp: "5:15", speaker: "Brandon PT Davis", text: "and they will connect" },
        { timestamp: "5:16", speaker: "Brandon PT Davis", text: "with each other at a point" },
        { timestamp: "5:19", speaker: "Brandon PT Davis", text: "but they are two separate entities" },
        { timestamp: "5:22", speaker: "Brandon PT Davis", text: "if you want to combine these objects you" },
        { timestamp: "5:25", speaker: "Brandon PT Davis", text: "can choose the" },
        { timestamp: "5:26", speaker: "Brandon PT Davis", text: "dual object combine mode in this mode" },
        { timestamp: "5:30", speaker: "Brandon PT Davis", text: "it creates a polygon" },
        { timestamp: "5:39", speaker: "Brandon PT Davis", text: "the last mode in the connect combine" },
        { timestamp: "5:41", speaker: "Brandon PT Davis", text: "tool is the" },
        { timestamp: "5:43", speaker: "Brandon PT Davis", text: "multiple object connect mode first" },
        { timestamp: "5:46", speaker: "Brandon PT Davis", text: "you must select the destination in which" },
        { timestamp: "5:49", speaker: "Brandon PT Davis", text: "to which you want your objects to" },
        { timestamp: "5:50", speaker: "Brandon PT Davis", text: "connect then select the objects" },
        { timestamp: "5:55", speaker: "Brandon PT Davis", text: "now all these line segments are" },
        { timestamp: "5:58", speaker: "Brandon PT Davis", text: "connected" },
        { timestamp: "6:00", speaker: "Brandon PT Davis", text: "to this line segment" },
        { timestamp: "6:04", speaker: "Brandon PT Davis", text: "the next portion of this tutorial i'm" },
        { timestamp: "6:07", speaker: "Brandon PT Davis", text: "going to talk to you" },
        { timestamp: "6:08", speaker: "Brandon PT Davis", text: "about the modified drop down menu the" },
        { timestamp: "6:10", speaker: "Brandon PT Davis", text: "modify" },
        { timestamp: "6:11", speaker: "Brandon PT Davis", text: "drop menu has many commands that are" },
        { timestamp: "6:13", speaker: "Brandon PT Davis", text: "useful in your 2d drafting" },
        { timestamp: "6:15", speaker: "Brandon PT Davis", text: "the modify move command at the top of" },
        { timestamp: "6:18", speaker: "Brandon PT Davis", text: "the menu" },
        { timestamp: "6:19", speaker: "Brandon PT Davis", text: "will allow you to move an object" },
        { timestamp: "6:22", speaker: "Brandon PT Davis", text: "first select the object and go modify" },
        { timestamp: "6:25", speaker: "Brandon PT Davis", text: "move" },
        { timestamp: "6:26", speaker: "Brandon PT Davis", text: "you can also use hotkeys control" },
        { timestamp: "6:29", speaker: "Brandon PT Davis", text: "or command m" },
        { timestamp: "6:34", speaker: "Brandon PT Davis", text: "doing so the move selection dialog box" },
        { timestamp: "6:37", speaker: "Brandon PT Davis", text: "will" },
        { timestamp: "6:37", speaker: "Brandon PT Davis", text: "will pop up i have x" },
        { timestamp: "6:40", speaker: "Brandon PT Davis", text: "offset of three inches and the y" },
        { timestamp: "6:44", speaker: "Brandon PT Davis", text: "offset of minus two you can modify the" },
        { timestamp: "6:48", speaker: "Brandon PT Davis", text: "dialog" },
        { timestamp: "6:49", speaker: "Brandon PT Davis", text: "as needed and press ok now" },
        { timestamp: "6:52", speaker: "Brandon PT Davis", text: "the this rectangle has moved" },
        { timestamp: "6:58", speaker: "Brandon PT Davis", text: "if you ever have a series of objects" },
        { timestamp: "7:00", speaker: "Brandon PT Davis", text: "that you need aligned you can go to" },
        { timestamp: "7:03", speaker: "Brandon PT Davis", text: "the modify align and align to" },
        { timestamp: "7:06", speaker: "Brandon PT Davis", text: "grid align distribute and there's also" },
        { timestamp: "7:09", speaker: "Brandon PT Davis", text: "some 3d commands" },
        { timestamp: "7:13", speaker: "Brandon PT Davis", text: "you can also right-click on an object on" },
        { timestamp: "7:16", speaker: "Brandon PT Davis", text: "the objects" },
        { timestamp: "7:18", speaker: "Brandon PT Davis", text: "and go to align distribute" },
        { timestamp: "7:22", speaker: "Brandon PT Davis", text: "and make your decision from here i'm" },
        { timestamp: "7:24", speaker: "Brandon PT Davis", text: "going to align all these objects to the" },
        { timestamp: "7:26", speaker: "Brandon PT Davis", text: "top" },
        { timestamp: "7:28", speaker: "Brandon PT Davis", text: "the modify menu bar also allows you to" },
        { timestamp: "7:31", speaker: "Brandon PT Davis", text: "rotate" },
        { timestamp: "7:32", speaker: "Brandon PT Davis", text: "objects we have hotkeys" },
        { timestamp: "7:35", speaker: "Brandon PT Davis", text: "command r and command l" },
        { timestamp: "7:39", speaker: "Brandon PT Davis", text: "as well if you have a complex" },
        { timestamp: "7:43", speaker: "Brandon PT Davis", text: "2d object or model" },
        { timestamp: "7:46", speaker: "Brandon PT Davis", text: "you can select the item and go to" },
        { timestamp: "7:49", speaker: "Brandon PT Davis", text: "modify scale" },
        { timestamp: "7:52", speaker: "Brandon PT Davis", text: "you can scale a factor symmetrically" },
        { timestamp: "7:57", speaker: "Brandon PT Davis", text: "symmetric by distance or asymmetrically" },
        { timestamp: "8:03", speaker: "Brandon PT Davis", text: "choosing symmetric in the modify scale" },
        { timestamp: "8:05", speaker: "Brandon PT Davis", text: "will" },
        { timestamp: "8:06", speaker: "Brandon PT Davis", text: "scale the object in x y z" },
        { timestamp: "8:10", speaker: "Brandon PT Davis", text: "directions proportionally" },
        { timestamp: "8:18", speaker: "Brandon PT Davis", text: "you can also choose the scale object" },
        { timestamp: "8:21", speaker: "Brandon PT Davis", text: "by some symmetric by distance" },
        { timestamp: "8:26", speaker: "Brandon PT Davis", text: "here i will select the current distance" },
        { timestamp: "8:30", speaker: "Brandon PT Davis", text: "and then input the new distance and" },
        { timestamp: "8:33", speaker: "Brandon PT Davis", text: "press" },
        { timestamp: "8:34", speaker: "Brandon PT Davis", text: "ok another important modify command" },
        { timestamp: "8:37", speaker: "Brandon PT Davis", text: "are the add subtract commands i'm going" },
        { timestamp: "8:40", speaker: "Brandon PT Davis", text: "to take these two" },
        { timestamp: "8:41", speaker: "Brandon PT Davis", text: "objects select both" },
        { timestamp: "8:44", speaker: "Brandon PT Davis", text: "go to modify and add surface" },
        { timestamp: "8:48", speaker: "Brandon PT Davis", text: "now these two objects are a single" },
        { timestamp: "8:52", speaker: "Brandon PT Davis", text: "polyline" },
        { timestamp: "8:54", speaker: "Brandon PT Davis", text: "i can also take two objects" },
        { timestamp: "9:00", speaker: "Brandon PT Davis", text: "right click and" },
        { timestamp: "9:04", speaker: "Brandon PT Davis", text: "clip the surface" },
        { timestamp: "9:07", speaker: "Brandon PT Davis", text: "now the square is cut out of the circle" },
        { timestamp: "9:12", speaker: "Brandon PT Davis", text: "the third modify option is to go to" },
        { timestamp: "9:15", speaker: "Brandon PT Davis", text: "modify" },
        { timestamp: "9:16", speaker: "Brandon PT Davis", text: "and intersect the surface now" },
        { timestamp: "9:19", speaker: "Brandon PT Davis", text: "where the surface is intersecting is its" },
        { timestamp: "9:22", speaker: "Brandon PT Davis", text: "own" },
        { timestamp: "9:22", speaker: "Brandon PT Davis", text: "independent shape from the modify" },
        { timestamp: "9:26", speaker: "Brandon PT Davis", text: "command" },
        { timestamp: "9:26", speaker: "Brandon PT Davis", text: "you can select an object and go to" },
        { timestamp: "9:33", speaker: "Brandon PT Davis", text: "convert to lines" },
        { timestamp: "9:36", speaker: "Brandon PT Davis", text: "now the shape is a series of lines" },
        { timestamp: "9:40", speaker: "Brandon PT Davis", text: "you can also take a series of lines and" },
        { timestamp: "9:43", speaker: "Brandon PT Davis", text: "go to" },
        { timestamp: "9:44", speaker: "Brandon PT Davis", text: "modify compose" },
        { timestamp: "9:48", speaker: "Brandon PT Davis", text: "the 2d lines have now been converted to" },
        { timestamp: "9:51", speaker: "Brandon PT Davis", text: "a polygon" },
        { timestamp: "9:53", speaker: "Brandon PT Davis", text: "you can also right-click and find the" },
        { timestamp: "9:55", speaker: "Brandon PT Davis", text: "same functions" },
        { timestamp: "9:58", speaker: "Brandon PT Davis", text: "compose decompose or return" },
        { timestamp: "10:02", speaker: "Brandon PT Davis", text: "the lines back to lines" },
        { timestamp: "10:06", speaker: "Brandon PT Davis", text: "the next feature i'm going to show you" },
        { timestamp: "10:08", speaker: "Brandon PT Davis", text: "in the vectorworks software" },
        { timestamp: "10:09", speaker: "Brandon PT Davis", text: "is duplicate you can duplicate an object" },
        { timestamp: "10:12", speaker: "Brandon PT Davis", text: "by holding the ctrl key" },
        { timestamp: "10:14", speaker: "Brandon PT Davis", text: "and selecting the object as you see now" },
        { timestamp: "10:17", speaker: "Brandon PT Davis", text: "there is a plus sign" },
        { timestamp: "10:18", speaker: "Brandon PT Davis", text: "above the cursor as i pull i will then" },
        { timestamp: "10:22", speaker: "Brandon PT Davis", text: "have a duplicate object" },
        { timestamp: "10:24", speaker: "Brandon PT Davis", text: "you can also click and duplicate in" },
        { timestamp: "10:27", speaker: "Brandon PT Davis", text: "place" },
        { timestamp: "10:30", speaker: "Brandon PT Davis", text: "now there are two objects" },
        { timestamp: "10:34", speaker: "Brandon PT Davis", text: "the last feature i'm going to share with" },
        { timestamp: "10:36", speaker: "Brandon PT Davis", text: "you in this tutorial" },
        { timestamp: "10:37", speaker: "Brandon PT Davis", text: "is the edit duplicate along path" },
        { timestamp: "10:40", speaker: "Brandon PT Davis", text: "function" },
        { timestamp: "10:41", speaker: "Brandon PT Davis", text: "in order to duplicate a long path we" },
        { timestamp: "10:44", speaker: "Brandon PT Davis", text: "need an object which will be the circle" },
        { timestamp: "10:46", speaker: "Brandon PT Davis", text: "and a path i'm going to use the polyline" },
        { timestamp: "10:50", speaker: "Brandon PT Davis", text: "tool" },
        { timestamp: "10:51", speaker: "Brandon PT Davis", text: "to draw a path" },
        { timestamp: "11:02", speaker: "Brandon PT Davis", text: "i'm going to select both the object and" },
        { timestamp: "11:04", speaker: "Brandon PT Davis", text: "the path and go to" },
        { timestamp: "11:05", speaker: "Brandon PT Davis", text: "edit duplicate" },
        { timestamp: "11:08", speaker: "Brandon PT Davis", text: "along path the duplicate along path" },
        { timestamp: "11:12", speaker: "Brandon PT Davis", text: "dialog will pop up" },
        { timestamp: "11:14", speaker: "Brandon PT Davis", text: "the first item says select" },
        { timestamp: "11:17", speaker: "Brandon PT Davis", text: "a path object currently the object is" },
        { timestamp: "11:21", speaker: "Brandon PT Davis", text: "selected" },
        { timestamp: "11:22", speaker: "Brandon PT Davis", text: "and the path is not to select the path" },
        { timestamp: "11:26", speaker: "Brandon PT Davis", text: "press next under the duplicate placement" },
        { timestamp: "11:30", speaker: "Brandon PT Davis", text: "items you have two options either" },
        { timestamp: "11:33", speaker: "Brandon PT Davis", text: "duplicate by number of duplicates or" },
        { timestamp: "11:36", speaker: "Brandon PT Davis", text: "duplicate" },
        { timestamp: "11:37", speaker: "Brandon PT Davis", text: "fixed distance when choosing the fixed" },
        { timestamp: "11:41", speaker: "Brandon PT Davis", text: "distance" },
        { timestamp: "11:42", speaker: "Brandon PT Davis", text: "we can offset the start point by a" },
        { timestamp: "11:45", speaker: "Brandon PT Davis", text: "number" },
        { timestamp: "11:46", speaker: "Brandon PT Davis", text: "indicated" },
        { timestamp: "11:49", speaker: "Brandon PT Davis", text: "i'm going to choose to duplicate the" },
        { timestamp: "11:52", speaker: "Brandon PT Davis", text: "path" },
        { timestamp: "11:52", speaker: "Brandon PT Davis", text: "by one foot and will offset the path" },
        { timestamp: "11:56", speaker: "Brandon PT Davis", text: "by 6 inches by selecting" },
        { timestamp: "12:00", speaker: "Brandon PT Davis", text: "center object to path the circle will be" },
        { timestamp: "12:03", speaker: "Brandon PT Davis", text: "duplicated from this its center" },
        { timestamp: "12:07", speaker: "Brandon PT Davis", text: "if you have an object like a square that" },
        { timestamp: "12:10", speaker: "Brandon PT Davis", text: "you can select tangent to path to keep" },
        { timestamp: "12:14", speaker: "Brandon PT Davis", text: "the objects" },
        { timestamp: "12:15", speaker: "Brandon PT Davis", text: "tangent to the path i'm going to press" },
        { timestamp: "12:18", speaker: "Brandon PT Davis", text: "ok" },
        { timestamp: "12:22", speaker: "Brandon PT Davis", text: "i have three circles that are evenly" },
        { timestamp: "12:24", speaker: "Brandon PT Davis", text: "spaced by one foot" },
        { timestamp: "12:26", speaker: "Brandon PT Davis", text: "along the path the first" },
        { timestamp: "12:29", speaker: "Brandon PT Davis", text: "object is six inches" },
        { timestamp: "12:33", speaker: "Brandon PT Davis", text: "this concludes the vectorworks tutorial" },
        { timestamp: "12:36", speaker: "Brandon PT Davis", text: "if you have any questions" },
        { timestamp: "12:37", speaker: "Brandon PT Davis", text: "please feel free to ask thank you" },
      ],
      
      relatedResources: [
        { title: "Vectorworks 2D Editing Tools Documentation", url: "https://app-help.vectorworks.net/2024/eng/VW2024_Guide/Shapes2/2D_editing_tools.htm" },
        { title: "Vectorworks Modify Menu Commands Guide", url: "https://university.vectorworks.net" },
        { title: "Duplicate Along Path Tutorial Video", url: "https://www.youtube.com/vectorworks" },
      ],
      
      relatedTutorials: [
        { title: "Vectorworks Tutorial: Basics Tool Palette", slug: "basics-tool-palette" },
        { title: "Vectorworks Quick Tip: Creating Trim Profiles with the Polyline Tool", slug: "creating-trim-profiles-polyline" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
      ],
    },
  };

  const tutorial = slug ? tutorials[slug] : null;

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tutorial Not Found</h1>
          <Link href="/studio/tutorials" className="text-[#2196F3] hover:underline">
            ← Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Tutorial Header */}
      <section className="py-12 border-b border-[#2196F3]">
        <div className="container max-w-6xl">
          <Link href="/studio/tutorials" className="text-sm text-muted-foreground hover:text-[#2196F3] mb-6 inline-flex items-center gap-2 transition-colors">
            ← Back to Tutorials
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-[#2196F3] text-white border border-[#2196F3] uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              {tutorial.category}
            </Badge>
            <Badge className="bg-transparent text-foreground border border-border flex items-center gap-1.5 uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
              {tutorial.difficulty}
            </Badge>
            <Badge className="bg-transparent text-foreground border border-border flex items-center gap-1.5 uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(tutorial.duration)}
            </Badge>
            <Badge className="bg-transparent text-foreground border border-border flex items-center gap-1.5 uppercase tracking-wider font-bold px-4 py-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(tutorial.uploadDate)}
            </Badge>
          </div>

          <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-tight text-foreground">{tutorial.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">{tutorial.description}</p>
        </div>
      </section>

      {/* Video Embed */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container max-w-6xl">
          <div className="aspect-video overflow-hidden rounded-lg shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
              title={tutorial.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section className="py-16">
        <div className="container max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1 rounded-lg mb-8 h-auto gap-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-[#2196F3] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="concepts" 
                className="data-[state=active]:bg-[#FF5722] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Concepts
              </TabsTrigger>
              <TabsTrigger 
                value="reference" 
                className="data-[state=active]:bg-[#9C27B0] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Quick Ref
              </TabsTrigger>
              <TabsTrigger 
                value="transcript" 
                className="data-[state=active]:bg-[#F44336] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Transcript
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-[#00BCD4] data-[state=active]:text-white data-[state=active]:shadow-lg text-foreground uppercase tracking-wider font-bold py-3 px-4 rounded-md transition-all text-xs md:text-sm"
              >
                Resources
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-6 text-[#2196F3] uppercase tracking-wider">What You'll Learn</h2>
                <div className="space-y-3 mb-12">
                  {tutorial.learningObjectives.map((objective: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="w-1.5 h-1.5 bg-[#2196F3] mt-2 flex-shrink-0 group-hover:w-3 transition-all"></div>
                      <span className="text-foreground leading-relaxed">{objective}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#2196F3] pt-8">
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-foreground">Tutorial Overview</h3>
                  <div className="space-y-4">
                    {tutorial.overview.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Key Concepts Tab */}
            <TabsContent value="concepts" className="mt-0">
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-8 text-[#FF5722] uppercase tracking-wider">Key Concepts</h2>
                <div className="space-y-8">
                  {tutorial.keyConcepts.map((concept: any, index: number) => (
                    <div key={index} className="border-l-4 border-[#FF5722] pl-6 py-4 bg-[#FF5722]/10 rounded-r">
                      <div className="flex items-start gap-3 mb-3">
                        <Lightbulb className="w-6 h-6 text-[#FF5722] flex-shrink-0 mt-1" />
                        <h3 className="font-bold text-lg uppercase tracking-wider text-foreground">{concept.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {concept.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#FF5722] mt-12 pt-8">
                  <h3 className="text-xl font-bold mb-6 text-[#FF5722] uppercase tracking-wider">Pro Tips</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {tutorial.proTips.map((tip: string, index: number) => (
                      <div key={index} className="border border-[#FF5722] rounded-lg p-4 bg-[#FF5722]/10">
                        <p className="text-sm text-foreground leading-relaxed">
                          <span className="font-bold text-[#FF5722] block mb-2 uppercase tracking-wider">PRO TIP</span>
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Quick Reference Tab */}
            <TabsContent value="reference" className="mt-0">
              <div className="border border-border rounded-lg p-8 bg-card">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Shortcuts */}
                  <div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-[#9C27B0] uppercase tracking-wider">
                      <Keyboard className="w-6 h-6" />
                      Essential Shortcuts
                    </h3>
                    <div className="space-y-4">
                      {tutorial.shortcuts.map((shortcut: any, index: number) => (
                        <div key={index} className="border border-[#9C27B0] rounded-lg p-4 bg-[#9C27B0]/10">
                          <code className="text-sm font-mono text-[#9C27B0] font-bold block mb-2">
                            {shortcut.keys}
                          </code>
                          <span className="text-sm text-muted-foreground">
                            {shortcut.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Pitfalls */}
                  <div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-[#9C27B0] uppercase tracking-wider">
                      <AlertCircle className="w-6 h-6" />
                      Common Pitfalls
                    </h3>
                    <div className="space-y-3">
                      {tutorial.commonPitfalls.map((pitfall: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 border-l-4 border-[#9C27B0] pl-4 py-2 bg-[#9C27B0]/5 rounded-r">
                          <span className="text-[#9C27B0] flex-shrink-0 font-bold">×</span>
                          <span className="text-sm text-foreground">{pitfall}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Transcript Tab */}
            <TabsContent value="transcript" className="mt-0">
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-8 text-[#F44336] uppercase tracking-wider">Full Transcript</h2>
                <div className="space-y-4 font-mono text-sm">
                  {tutorial.transcript.map((entry: any, index: number) => (
                    <div key={index} className="flex gap-6 hover:bg-[#F44336]/10 p-3 rounded transition-colors border-l-2 border-transparent hover:border-[#F44336]">
                      <span className="text-[#F44336] flex-shrink-0 w-16 font-bold">
                        {entry.time}
                      </span>
                      <p className="text-foreground leading-relaxed">
                        {entry.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="mt-0">
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-8 text-[#00BCD4] uppercase tracking-wider">Related Resources</h2>
                
                <div className="space-y-4 mb-12">
                  {tutorial.relatedResources.map((resource: any, index: number) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-border hover:border-[#00BCD4] rounded-lg p-6 transition-all group bg-card hover:bg-[#00BCD4]/10"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-[#00BCD4] text-white border-0 uppercase tracking-wider font-bold text-xs px-3 py-1">
                              {resource.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-[#00BCD4] transition-colors text-foreground">
                            {resource.title}
                          </h3>
                        </div>
                        <ExternalLink className="w-5 h-5 text-[#00BCD4] flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="border-t border-[#00BCD4] pt-8">
                  <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-foreground">Continue Learning</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {tutorial.relatedTutorials.map((related: any, index: number) => (
                      <Link key={index} href={`/studio/tutorials/${related.slug}`}>
                        <div className="border border-border hover:border-[#00BCD4] rounded-lg p-6 transition-all group bg-card hover:bg-[#00BCD4]/10 h-full">
                          <h4 className="font-semibold mb-3 group-hover:text-[#00BCD4] transition-colors text-foreground">
                            {related.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-[#00BCD4] group-hover:gap-3 transition-all uppercase tracking-wider font-bold">
                            Watch Tutorial <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}
