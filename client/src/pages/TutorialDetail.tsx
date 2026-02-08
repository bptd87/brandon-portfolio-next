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
        { time: "0:04", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. In this Vectorworks tutorial, we'll be using the polyline tool to show how you can quickly create trim profiles for your drawings." },
        { time: "0:21", text: "To start this tutorial, I'm going to go to uDecor.com to get a trim profile that has real-world information. In the website, I can see the trim profile here, and I also have the size information and material." },
        { time: "0:39", text: "What I'm going to do is right-click and save the image. The image is already named with the product code, so I'm going to simply add 'crown molding' for my workflow." },
        { time: "0:58", text: "Now in my Vectorworks file, I'm going to go to File > Import and select Image File. I have the image file on my desktop, so I will open it. The dialog will ask if I prefer a JPEG or PNG. A JPEG is smaller in size, but the PNG is going to have data for transparency. In this example, I'm not really concerned about transparency, so I'm going to go ahead and select the JPEG file." },
        { time: "1:35", text: "Typically, some Vectorworks users would then try to go to the Modify > Scale options to try to get the trim profile as close as possible, but I find that it's best to just trace the profile and scale it after." },
        { time: "1:51", text: "I'm going to use the Polyline Tool (hotkey 5) to trace the object. I'm starting out with the Corner Vertex mode. Now I can toggle to the Point Arc mode by pressing U. Alternatively, what you can do is just select the main points using the Line Tool." },
        { time: "3:06", text: "Now I'm going to double-click and use Add Vertex mode with the Radius Point on Arc selected. Then I'll use the Move Polygon Point to try to make the profile match the shape below as close as possible." },
        { time: "4:19", text: "Once I'm satisfied with the profile, I'm going to change the class from None to my Section Hatch. I will then delete the reference image." },
        { time: "4:39", text: "I have returned to the reference website to check for the dimension data. It says the breadth is five and a half inches, and the height and width are four inches. I'm going to use the height and width information to scale the object." },
        { time: "4:55", text: "I'm going to select the object and change the X dimension to 4 inches and the Y dimension to 4 inches." },
        { time: "5:08", text: "Now that I have the trim profile scaled, I'm going to create a 2D symbol. To create the 2D symbol, I'm going to hit Command or Control+K. I'm going to name this symbol 'Crown Molding.'" },
        { time: "5:28", text: "I'm going to select Next Mouse Click and keep it as a world-based unit. I'm going to uncheck 'Insert in Wall' since I will not be applying this to a three-dimensional wall. I'm going to select 'Convert to Group' so that I'm working in a 2D workflow and can easily modify the molding." },
        { time: "5:53", text: "Now when I return to my Resource Manager, I can find the 2D shape that was created. If I double-click on this object, I can then place an instance of it in the document." },
        { time: "6:07", text: "This completes the Vectorworks tutorial on the Polyline Tool. If you have any questions, feel free to ask. Thank you." },
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
        { time: "0:04", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. This Vectorworks tutorial is going to cover 2D Edit and Modify tricks and tools." },
        { time: "0:17", text: "The first tool I'm going to show you in this tutorial is the Mirror Tool. The Mirror Tool can be accessed in the Basics Tool Palette. In order to use the tool, you first need to select an object. I'm going to hit X for the Select tool, and now I'm going to select the Mirror Tool." },
        { time: "0:41", text: "There are two modes in the Mirror Tool: Standard mode and Duplicate mode. The Standard mode will mirror the item on the other side from which you have indicated the mirror. The Duplicate mode will mirror and duplicate the item." },
        { time: "1:01", text: "The next tool is the Reshape Tool. It can be found in the Tools Palette, and it can also be activated by double-clicking on a 2D shape. There are a few modes within the Reshape Tool." },
        { time: "1:17", text: "The Reshape Tool has the Move Polygon Handles mode, which allows you to select the polygon handle and move it individually. The Move Edges Parallel mode allows you to move the active edge. We can also further modify a shape by adding vertex points in Vertex mode." },
        { time: "1:41", text: "I can add a radius by clicking on one of the handles and pulling out. I can also add a corner point. The Delete Vertex mode allows you to delete the vertices." },
        { time: "2:09", text: "The Offset Tool allows you to offset an object. Before you can offset, you first have to select the object and then go into the Offset Tool. You can also access the Offset Tool by pressing the letter O." },
        { time: "2:29", text: "The Offset Tool is currently set at a distance of 6 inches, and the mode is Offset Distance Mode and Duplicate. Here I have duplicated the offset. I can now lower the offset to 1 inch, and I'm going to change from Duplicate and Offset mode to Offset Original mode. You can also offset by points—select the object and then you can move to where you want to offset the object." },
        { time: "3:10", text: "The Split Tool, with the icon located here, is a powerful tool that can be used in both 2D and 3D applications. Before you can use the Split Tool, you first must select the shape. Now that the shape is selected, I'm going to go to the Split Tool." },
        { time: "3:34", text: "There are three modes in the Split Tool. The first mode is the Line Split mode. I'm going to select a point and then a second point, creating a line. Now when I go to select, I have two separate objects." },
        { time: "3:54", text: "Going back to the Split Tool, I can change the mode to Point Split mode, in which case I will pick a point. Now I've split the object with the Split Point mode." },
        { time: "4:12", text: "The last mode in the Split Tool is the Trim mode. I will draw a line and then indicate the direction in which I want to keep the object. This polyline is now an open shape as it doesn't have a line on all sides. In Vectorworks, if you go to the Object Info Palette, you can select 'Close' to close the shape." },
        { time: "4:40", text: "The Connect/Combine Tool allows you to connect or combine line segments. The first mode is the Single Object Connect mode. I'm going to select the object that I want connected and then the point to which I want it to be connected to. Now the line has been extended to this line. The hotkey for the Connect/Combine Tool is the letter L." },
        { time: "5:11", text: "The next mode is the Dual Object Connect mode. In this mode, I will select two objects and they will connect with each other at a point, but they are two separate entities." },
        { time: "5:25", text: "If you want to combine these objects, you can choose the Dual Object Combine mode. In this mode, it creates a polygon." },
        { time: "5:43", text: "The last mode in the Connect/Combine Tool is the Multiple Object Connect mode. First, you must select the destination to which you want your objects to connect, then select the objects. Now all these line segments are connected to this line segment." },
        { time: "6:04", text: "The next portion of this tutorial, I'm going to talk to you about the Modify drop-down menu. The Modify menu has many commands that are useful in your 2D drafting." },
        { time: "6:15", text: "The Modify > Move command at the top of the menu will allow you to move an object. First select the object and go Modify > Move. You can also use hotkeys Control or Command+M. Doing so, the Move Selection dialog box will pop up. I have an X offset of 3 inches and the Y offset of minus 2. You can modify the dialog as needed and press OK. Now this rectangle has moved." },
        { time: "6:58", text: "If you ever have a series of objects that you need aligned, you can go to Modify > Align, and there's Align to Grid, Align/Distribute, and there's also some 3D commands. You can also right-click on the objects and go to Align/Distribute and make your decision from here. I'm going to align all these objects to the top." },
        { time: "7:28", text: "The Modify menu bar also allows you to rotate objects. We have hotkeys Command+R and Command+L as well. If you have a complex 2D object or model, you can select the item and go to Modify > Scale." },
        { time: "7:52", text: "You can scale by factor symmetrically, symmetric by distance, or asymmetrically. Choosing Symmetric in the Modify Scale will scale the object in X, Y, Z directions proportionally. You can also choose to scale the object by Symmetric by Distance. Here I will select the current distance and then input the new distance and press OK." },
        { time: "8:34", text: "Another important Modify command are the Add/Subtract commands. I'm going to take these two objects, select both, go to Modify and Add Surface. Now these two objects are a single polyline." },
        { time: "8:54", text: "I can also take two objects, right-click, and Clip the Surface. Now the square is cut out of the circle." },
        { time: "9:12", text: "The third Modify option is to go to Modify and Intersect the Surface. Now where the surface is intersecting is its own independent shape." },
        { time: "9:26", text: "From the Modify command, you can select an object and go to Convert to Lines. Now the shape is a series of lines. You can also take a series of lines and go to Modify > Compose. The 2D lines have now been converted to a polygon. You can also right-click and find the same functions: Compose, Decompose, or return the lines back to lines." },
        { time: "10:06", text: "The next feature I'm going to show you in the Vectorworks software is Duplicate. You can duplicate an object by holding the Option or Alt key and selecting the object. As you see now, there is a plus sign above the cursor. As I pull, I will then have a duplicate object. You can also click and duplicate in place. Now there are two objects." },
        { time: "10:34", text: "The last feature I'm going to share with you in this tutorial is the Edit > Duplicate Along Path function. In order to duplicate along a path, we need an object (which will be the circle) and a path. I'm going to use the Polyline Tool to draw a path." },
        { time: "11:02", text: "I'm going to select both the object and the path and go to Edit > Duplicate Along Path. The Duplicate Along Path dialog will pop up. The first item says 'Select a path object.' Currently the object is selected and the path is not. To select the path, press Next." },
        { time: "11:30", text: "Under the Duplicate Placement items, you have two options: either Duplicate by Number of Duplicates or Duplicate by Fixed Distance. When choosing the Fixed Distance, we can offset the start point by a number indicated." },
        { time: "11:49", text: "I'm going to choose to duplicate the path by 1 foot and will offset the path by 6 inches. By selecting 'Center Object to Path,' the circle will be duplicated from its center. If you have an object like a square, you can select 'Tangent to Path' to keep the objects tangent to the path. I'm going to press OK." },
        { time: "12:22", text: "I have three circles that are evenly spaced by 1 foot along the path. The first object is 6 inches offset from the start. This concludes the Vectorworks tutorial. If you have any questions, please feel free to ask. Thank you." },
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
    "resource-manager-basics": {
      id: 9,
      title: "Vectorworks Tutorial: Resource Manager Basics",
      slug: "resource-manager-basics",
      youtubeId: "Y7trPdHxRxM",
      duration: "5:48",
      publishDate: "Jan 30, 2021",
      category: "Getting Started",
      difficulty: "Beginner",
      description: "Learn how to create, apply, and manage resources in Vectorworks using the Resource Manager, including textures, symbols, and custom libraries.",
      overview: "This tutorial introduces the Resource Manager, Vectorworks' central hub for creating, applying, and managing resources such as textures, symbols, and custom libraries. You'll learn how to navigate the File Browser and Resource Viewer panes, access hundreds of built-in libraries, create custom resources, organize resources into folders, and search across all available libraries. The tutorial demonstrates how to create new Renderworks textures, manage resource folders, and import cloud-based resources from Vectorworks libraries. You'll also learn how to modify downloaded resources for your specific project needs while preserving the original library versions.",
      learningObjectives: [
        "Navigate the Resource Manager interface including File Browser and Resource Viewer panes",
        "Access and browse hundreds of built-in Vectorworks libraries and custom Favorites",
        "Create new resources including Renderworks textures with custom properties",
        "Organize resources into folders and manage resource hierarchies",
        "Search for resources across all libraries using filters and resource type dropdowns",
        "Import cloud-based resources and modify them for project-specific needs",
      ],
      keyConcepts: [
        {
          title: "Resource Manager",
          content: "Central interface for creating, applying, and managing all reusable resources in Vectorworks including textures, symbols, hatches, and custom libraries.",
        },
        {
          title: "File Browser Pane",
          content: "Left panel that provides access to hundreds of custom Vectorworks libraries, Workgroup libraries, Favorites, and the active file's resources.",
        },
        {
          title: "Resource Viewer Pane",
          content: "Center panel that displays resources from the selected location, showing thumbnails, names, types, and allowing organization into folders.",
        },
        {
          title: "Renderworks Texture",
          content: "Material resource that defines surface appearance including color, reflectivity, transparency, and bump mapping for realistic rendering.",
        },
        {
          title: "Resource Folders",
          content: "Organizational containers within the Resource Manager that group related resources by type (symbols, textures, etc.) for easier navigation.",
        },
        {
          title: "Cloud-Based Resources",
          content: "Vectorworks library resources stored online that are downloaded on-demand when accessed, providing access to extensive content libraries without local storage.",
        },
      ],
      proTips: [
        "Pin the Resource Manager open using the push pin icon to keep it accessible while working, or let it auto-hide by hovering when unpinned.",
        "Use the view mode icons to switch between Top/Plan, Right Isometric, Wireframe, and OpenGL views to quickly understand 3D resource geometry.",
        "Create a Favorites folder to store your most-used resources for quick access across all projects without searching through libraries.",
        "Use the resource type dropdown filter when searching to narrow results to specific types like Renderworks Textures, Symbols, or Hatches.",
        "Organize resources into folders immediately after creation to maintain a clean, navigable resource structure as your project grows.",
        "Modifications to downloaded library resources only affect your current file—the original library resource remains unchanged for future projects.",
        "Use the history arrows to navigate back and forward through recently viewed resource locations and folders.",
        "Double-click a resource to apply it directly, or drag and drop it into your drawing for more precise placement control.",
      ],
      shortcuts: [
        { keys: ["Hover"], action: "Open Resource Manager (when unpinned)" },
        { keys: ["Double-click"], action: "Apply resource to selection or create new instance" },
      ],
      commonPitfalls: [
        "Forgetting to pin the Resource Manager open, causing it to close when you move away—use the push pin for persistent access.",
        "Not organizing resources into folders as you create them, leading to cluttered resource lists that are difficult to navigate.",
        "Searching without using the resource type filter, resulting in overwhelming search results across all resource types.",
        "Assuming modifications to library resources affect the original library—changes only apply to the current file's copy.",
        "Not creating a Favorites folder for frequently-used resources, wasting time searching through libraries repeatedly.",
      ],
      transcript: [
        { time: "0:04", text: "Hello, this is Brandon PT Davis, theatrical scenic designer, and this Vectorworks tutorial is on the Resource Manager." },
        { time: "0:13", text: "The Resource Manager allows you to create, apply, and manage resources in the current file, as well as access resources from other files." },
        { time: "0:24", text: "In this Vectorworks workspace, the Resource Manager is located in the top corner. By clicking the push pin, I can keep the Resource Manager open. When the push pin is not enabled, I can access it by hovering." },
        { time: "0:43", text: "For the purpose of this tutorial, I'm going to pin the Resource Manager open on the left side. You'll notice a File Browser pane. In the File Browser pane, you have access to hundreds of custom libraries throughout the Vectorworks software. You can also create and modify your own resources and store them in Favorites." },
        { time: "0:59", text: "At the center, you'll see the Resource Viewer pane. Currently, the Resource Viewer pane is looking at resources in the active file: LOST – Set for Living on Love, Okoboji Summer Theatre." },
        { time: "1:32", text: "In this view, I have resource folders where I've grouped resources by type. I can click through the history arrows to go back and forward. I currently have three resources that are not in folders. The first two resources are symbols, and the third is a texture." },
        { time: "1:56", text: "I can select the texture and place it into its Set Texture folder. These two resources are symbols. You can modify the way you view an item by clicking the icons here. I can change from Top/Plan view to Right Isometric view, and change from Wireframe to OpenGL to quickly understand what the resource is." },
        { time: "2:33", text: "In the Resource Viewer, you can also see the name of the resource and the resource type. I'm now going to place these two resources into their proper folder." },
        { time: "2:52", text: "To create a new resource, go to the bottom and click New Resource. Here, you can select the resource type. I'm going to create a texture. To do this, click Renderworks Texture and press Create." },
        { time: "3:12", text: "You'll want to give your texture a name. I'm going to call this texture Wall Black. You can modify the color, reflectivity, transparency, and bump. I'll cover how to create textures in more detail in another video. For the sake of this tutorial, I'm just going to apply a color." },
        { time: "3:49", text: "Now that I've created the texture, I can place it into its proper folder. To create a folder, click New Folder. This process is similar to creating a resource: select the folder type, name the folder, and press OK." },
        { time: "4:20", text: "Using the search box, you can search for resources throughout the Vectorworks libraries, Workgroup libraries, your Favorites, or within the active file. I'm going to search for a glass texture by typing glass." },
        { time: "4:40", text: "As you can see, there are glass symbols, glass tiles, glass materials, and many different resource types. To narrow the search to Renderworks Textures, I'll select Renderworks Textures from the resource dropdown menu. This filters the search results to only glass textures." },
        { time: "5:09", text: "You can double-click a resource to apply it as a texture, or you can drag and drop the resource directly into your open file. Many of these resources are cloud-based and will be downloaded from the internet." },
        { time: "5:32", text: "Once the glass texture has been added, I can edit the attributes of the resource. Any modifications you make to a downloaded resource will only affect the resource within the current file and will not change the resource in its original library location." },
        { time: "5:48", text: "This concludes my introduction to the Resource Manager. If you have any questions, feel free to ask. Thank you." },
      ],
      relatedResources: [
        { title: "Vectorworks Resource Manager Documentation", url: "https://app-help.vectorworks.net/2024/eng/VW2024_Guide/ResourceManager/Resource_Manager.htm", description: "Official documentation on Resource Manager functionality" },
        { title: "Vectorworks University - Resource Manager", url: "https://university.vectorworks.net/", description: "Official training on resource creation and management" },
        { title: "Vectorworks Forum - Resources Discussion", url: "https://forum.vectorworks.net/", description: "Community discussions about resource libraries and best practices" },
      ],

      relatedTutorials: [
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
        { title: "Vectorworks Tutorial: Sheet Layers", slug: "sheet-layers" },
      ],
    },
    "understanding-symbols": {
      id: 10,
      title: "Vectorworks Tutorial: Understanding Symbols",
      slug: "understanding-symbols",
      youtubeId: "ib2-H14Cx5I",
      duration: "8:21",
      publishDate: "Jan 31, 2021",
      category: "Getting Started",
      difficulty: "Beginner",
      description: "Master the creation and management of 2D, 3D, and hybrid symbols in Vectorworks, including symbol types, scaling methods, and editing workflows.",
      overview: "This tutorial provides a comprehensive introduction to symbols in Vectorworks, covering the three main symbol types: 2D symbols, 3D symbols, and hybrid symbols. You'll learn how to create symbols from existing geometry, understand the difference between unit-based and page-based symbols, and master symbol editing workflows. The tutorial demonstrates how to scale symbol instances without affecting the original definition, work with grouped symbols that convert to groups upon placement, and create page-based symbols for documentation purposes. You'll also learn the critical distinction between scaling a symbol instance versus editing the symbol definition, ensuring you can maintain consistency across multiple instances while preserving the ability to make global changes when needed.",
      learningObjectives: [
        "Understand the three main symbol types: 2D symbols, 3D symbols, and hybrid symbols",
        "Create symbols from existing geometry using Modify > Create Symbol or Ctrl+K shortcut",
        "Differentiate between unit-based symbols and page-based symbols and their appropriate uses",
        "Scale symbol instances using the Object Info Palette without affecting the symbol definition",
        "Edit symbol definitions to make global changes across all instances",
        "Work with grouped symbols that automatically convert to groups upon placement",
      ],
      keyConcepts: [
        {
          title: "2D SYMBOL",
          content: "A symbol containing only 2D geometry, indicated by a '2' in the Resource Manager. Used for plan views, elevations, and 2D documentation elements.",
        },
        {
          title: "HYBRID SYMBOL",
          content: "A symbol containing both 2D and 3D components, allowing it to display appropriately in both plan views and 3D perspectives.",
        },
        {
          title: "UNIT-BASED SYMBOL",
          content: "A symbol that scales according to world units (inches, feet, meters). The default type for design layer work, maintaining consistent real-world dimensions.",
        },
        {
          title: "PAGE-BASED SYMBOL",
          content: "A symbol that scales according to page scale rather than world units. Indicated by green text in the Resource Manager. Used primarily for documentation elements on sheet layers.",
        },
        {
          title: "GROUPED SYMBOL",
          content: "A symbol that automatically converts from a symbol to a group when placed in the document. Indicated by blue text in the Resource Manager. Each instance is independent.",
        },
        {
          title: "SYMBOL INSTANCE",
          content: "A placed occurrence of a symbol in the document. Can be scaled independently without affecting the symbol definition or other instances.",
        },
      ],
      proTips: [
        "Use Ctrl+K (Control+K) as a quick shortcut to create symbols instead of navigating to Modify > Create Symbol",
        "Check the Resource Manager color coding: black for standard symbols, blue for grouped symbols, green for page-based symbols",
        "When scaling symbols, use the Object Info Palette's symmetric/asymmetric options rather than dragging handles to maintain precise control",
        "Duplicate a symbol instance before editing its definition to compare before/after changes and ensure the edit produces the desired result",
        "Use 'Next Mouse Click' insertion point option when creating symbols to specify custom insertion points for better placement control",
        "Create page-based symbols for title blocks, drawing labels, and other documentation elements that should maintain consistent print size",
        "Edit symbol definitions (double-click) when you want changes to affect all instances; edit individual instances only for grouped symbols",
        "Use the Resource Manager to organize symbols into folders by type, project, or discipline for easier navigation",
        "Leave the instance in place when creating a symbol to avoid having to re-place it immediately after creation",
        "Remember that scaling a symbol instance scales the entire symbol, not the geometry inside the definition",
      ],
      shortcuts: [
        { keys: "Ctrl+K", action: "Create symbol from selected objects" },
        { keys: "Double-click", action: "Edit symbol definition" },
        { keys: "Right-click", action: "Access symbol editing options" },
      ],
      commonPitfalls: [
        "Attempting to scale symbols by dragging handles instead of using the Object Info Palette, which triggers a warning dialog",
        "Confusing symbol instance scaling with symbol definition editing—scaling an instance doesn't change the original geometry",
        "Using unit-based symbols on sheet layers or page-based symbols on design layers, causing unexpected scaling behavior",
        "Forgetting that grouped symbols (blue text) create independent groups, so editing one doesn't affect others",
        "Placing page-based symbols on design layers where they appear oversized due to scale mismatch",
        "Not organizing symbols into folders in the Resource Manager, making them difficult to find in large projects",
      ],
      transcript: [
        { time: "0:04", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. In this Vectorworks tutorial, we're going to discuss symbols. A symbol gives the Vectorworks user the ability to save 2D and 3D objects." },
        { time: "0:22", text: "In the Resource Manager, you can also access a library of symbols that come standard with the Vectorworks software. In Vectorworks, there are three main types of symbols: 2D symbols, 3D symbols, and hybrid symbols. A hybrid symbol contains both a 2D and a 3D component. In this tutorial, we're going to talk specifically about 2D symbols." },
        { time: "0:53", text: "Currently in the Resource Manager, I have created three symbols. Each symbol is a two-by-two rectangle with a one-by-one rectangle in the center. Note that each of these symbols has a '2' in the bottom-right corner, indicating that it is a 2D symbol." },
        { time: "1:22", text: "I'm going to place the first symbol, 2D Square 1, into the document. By looking in the Object Info Palette, you can see that this is labeled as a 2D symbol. The class is currently set to None, on Layer 1, on the Layer Plane. The symbol's name is 2D Square 1, and its units are world-based." },
        { time: "1:56", text: "If I try to drag the handles, a pop-up will appear asking if I'm sure I want to scale the symbol instance. I'm going to press No. I'm doing this to illustrate that modifying a 2D symbol cannot be done from the outside. To adjust a 2D symbol, you can either right-click or double-click to edit the symbol." },
        { time: "2:24", text: "Before editing the symbol, I'm going to duplicate it. Now we have two identical 2D Square 1 symbols. If I double-click and edit the 2D component, I can modify the component by changing the color, shape, or line weight. I'm going to change the inner fill to a yellow square. When I exit, both symbols now have yellow squares." },
        { time: "3:02", text: "Looking at our two identical symbols named 2D Square 1, I'm going to demonstrate scaling from the Object Info Palette. Here, the scaling can be set to symmetric or asymmetric. In this case, I'm going to set it to symmetric and scale the symbol by a factor of two. You'll notice that the symbol is now twice as large." },
        { time: "3:46", text: "Using the tape measure, the scaled symbol measures four inches by four inches, while the unscaled symbol measures two inches by two inches. If we double-click and edit the symbol component, we'll see that the original component is still two inches by two inches. Scaling a symbol from the Object Info Palette scales the symbol instance itself, not the geometry inside the symbol definition." },
        { time: "4:23", text: "The next symbol we're going to talk about is 2D Square 2. Note that this symbol appears in blue. When a symbol name is blue, this indicates that it is a grouped symbol. When added to the document, it automatically converts from a symbol into a group. Here is the first 2D Square 1 symbol—in the Object Info Palette, it is labeled as a 2D symbol. Now, selecting 2D Square 2, the Object Info Palette shows that it is simply a group." },
        { time: "4:56", text: "If I place two of these next to each other, we now have two groups, and neither are symbols. If I go inside one group and modify the inner square to a red color, it does not affect the second group." },
        { time: "5:22", text: "The third symbol we're going to look at is 2D Square 3. Note that 2D Square 3 appears in green. A green symbol name indicates that it is a page-based symbol. The first two symbols we looked at—the 2D symbol and the grouped symbol—are unit-based. A page-based symbol means that the scale of the symbol responds to the page scale rather than world units." },
        { time: "6:00", text: "When dropping a page-based symbol into the design layer, it appears quite large. When accessing a page-based symbol on the sheet layer, the symbol appears at its intended size of two inches by two inches. Page-based symbols are generally created for documentation on the sheet layer." },
        { time: "6:33", text: "To create a symbol, first select the objects you want to turn into a symbol, then go to Modify > Create Symbol. You can also create a symbol using the shortcut Control + K. When the Create Symbol dialog appears, the first thing you need to do is name the symbol. I'm going to name this symbol Circle." },
        { time: "7:02", text: "Next, choose the insertion point: center, plan projection center, or next mouse click. Next mouse click allows you to specify a custom insertion point. Next, select the units: page-based or world-based. World-based units are typically used in the design workspace." },
        { time: "7:28", text: "Story-aware and insert-in-wall options are common in architectural practice and are not covered in this tutorial. Other options include leaving the instance in place after creating the symbol, changing the object from Layer Plane to Screen Plane, and converting to a group. We discussed converting to a group earlier in this video." },
        { time: "8:00", text: "I'm going to press OK. The destination folder will be the current document. I'll press OK again. Now I've created a symbol. If we look in the Resource Manager, we can see the new 2D symbol. This concludes our Vectorworks tutorial on symbols. If you have any questions, please ask. Thank you." },
      ],
      relatedResources: [
        {
          title: "Vectorworks Symbol Documentation",
          url: "https://www.vectorworks.net",
          description: "Official Vectorworks documentation on creating and managing symbols",
        },
        {
          title: "Vectorworks Resource Manager Guide",
          url: "https://www.vectorworks.net",
          description: "Comprehensive guide to organizing and accessing resources in Vectorworks",
        },
        {
          title: "Symbol Best Practices",
          url: "https://www.vectorworks.net",
          description: "Industry best practices for creating efficient and reusable symbols",
        },
      ],
      relatedTutorials: [
        { title: "Vectorworks Tutorial: Resource Manager Basics", slug: "resource-manager-basics" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
      ],
    },
    "2d-annotations-dimensioning": {
      id: 11,
      title: "Vectorworks Tutorial: 2D Annotations and Dimensioning",
      slug: "2d-annotations-dimensioning",
      youtubeId: "JOlFjmY_R7o",
      duration: "27:11",
      publishDate: "Feb 01, 2021",
      category: "2D Drafting",
      difficulty: "Intermediate",
      description: "Master the complete workflow for creating viewports, dimensioning drawings, adding drawing labels, section markers, callouts, detail viewports, and publishing to PDF.",
      overview: "This comprehensive tutorial covers the complete annotation and dimensioning workflow in Vectorworks, from creating viewports on sheet layers to publishing final PDF documents. You'll learn how to create viewports from design layer content, add drawing labels with custom styles, dimension drawings using constrained linear and chain dimensioning modes, add section elevation markers that reference other drawings, create callouts for material specifications, and generate detail viewports at larger scales for intricate elements like molding profiles. The tutorial demonstrates professional sheet layout techniques including grid snapping, viewport alignment, and maintaining clean dimension lines. You'll also learn how to publish your completed sheets to PDF with proper export settings, creating a complete documentation workflow from design layer to final deliverable.",
      learningObjectives: [
        "Create viewports from design layer content using the Create Viewport command with custom crops",
        "Add and customize drawing labels with sheet numbers, drawing numbers, titles, and scale information",
        "Dimension drawings using constrained linear and constrained chain dimensioning modes",
        "Add section elevation markers that reference other drawings on the sheet with proper numbering",
        "Create detail viewports at larger scales to show intricate elements like molding profiles",
        "Use callouts to label materials and specifications on drawings",
        "Lay out multiple viewports on a sheet using grid snap for professional alignment",
        "Publish completed sheets to PDF with proper export settings and folder organization",
      ],
      keyConcepts: [
        {
          title: "VIEWPORT",
          content: "A window into design layer content that displays on a sheet layer. Viewports can be cropped, scaled, and annotated independently without affecting the source geometry.",
        },
        {
          title: "DRAWING LABEL",
          content: "A standardized title block element that displays drawing number, sheet number, title, and scale. Can be customized with different styles and label length modes (Fixed or Control Point).",
        },
        {
          title: "CONSTRAINED LINEAR DIMENSION",
          content: "A dimension tool that constrains measurements to horizontal or vertical directions only. Essential for architectural and scenic design documentation.",
        },
        {
          title: "CONSTRAINED CHAIN MODE",
          content: "A dimensioning mode that allows continuous dimensioning after the first dimension is placed, enabling efficient string dimensioning without restarting the tool.",
        },
        {
          title: "SECTION ELEVATION MARKER",
          content: "A reference marker that indicates where a section or elevation is taken from and which drawing number it references. Includes sheet number and drawing number.",
        },
        {
          title: "DETAIL VIEWPORT",
          content: "A viewport created from a circular or rectangular crop at a larger scale than the parent drawing. Used to show intricate details like molding profiles, connections, or hardware.",
        },
        {
          title: "ANNOTATION VIEWPORT",
          content: "The editing mode for adding dimensions, callouts, and notes to a viewport. Annotations are scale-aware and display correctly at the viewport's scale.",
        },
        {
          title: "GRID SNAP",
          content: "A layout tool that snaps objects to a regular grid pattern (e.g., half-inch by half-inch) for precise alignment and professional sheet organization.",
        },
      ],
      proTips: [
        "Name viewports with sheet number + drawing number + brief description (e.g., '1.1 Wall Plan') for easy identification",
        "Turn on Grid Snap and set it to half-inch by half-inch for professional viewport alignment on sheet layers",
        "Use Control Point label length mode instead of Fixed to adjust drawing label width to emphasize important drawings",
        "Change dimensioning mode from Constrained Linear to Constrained Chain before starting to enable continuous dimensioning",
        "Press hotkey 'N' while using the Dimension tool to access keyboard shortcuts for faster dimensioning",
        "Lower drawing labels below the drawing by about 14 inches to avoid conflicts with bottom dimension strings",
        "Use hotkey 'D' to regenerate drawing labels if they're accidentally deleted or need to be recreated",
        "Create a white-filled rectangle (1 inch by 1 inch) to clean up crossing dimension lines by placing it behind dimensions",
        "Reduce section marker scale factor to about half size (0.5) for cleaner appearance on drawings",
        "Draw reference lines first when placing section markers to ensure correct direction and alignment",
        "Place section markers about 1 foot on either side of the section cut for proper visual indication",
        "Create detail viewports on the section line class so the crop circle displays with dashed lines",
        "Save publish sets with descriptive names (e.g., 'Elevations') for frequently updated documentation packages",
        "Use File Export Options to create folders for each file type when publishing multiple sheets",
      ],
      shortcuts: [
        { keys: "N", action: "Show Dimension tool keyboard shortcuts" },
        { keys: "D", action: "Regenerate drawing label" },
        { keys: "Ctrl+Shift+Click", action: "Click through viewport to access underlying geometry" },
        { keys: "Double-click viewport", action: "Access viewport edit options (annotations, crop, design layer, camera)" },
      ],
      commonPitfalls: [
        "Forgetting to change from Constrained Linear mode to Constrained Chain mode, causing dimensioning to stop after the first dimension",
        "Dimensioning in the wrong scale context—annotations must be added inside the viewport annotation mode to display at correct scale",
        "Placing drawing labels too close to dimension strings, causing visual conflicts and overlapping text",
        "Not using grid snap for viewport layout, resulting in misaligned drawings and unprofessional appearance",
        "Creating section markers in the wrong direction, requiring deletion and recreation instead of simple adjustment",
        "Forgetting to link section markers to the correct drawing number and sheet number, causing incorrect references",
        "Creating detail viewports at the same scale as the parent drawing, defeating the purpose of showing detail",
        "Not organizing detail viewports linearly on the sheet, making the drawing harder to read and navigate",
        "Publishing PDFs without checking File Export Options, resulting in disorganized output files",
        "Not saving publish sets for frequently updated documentation, requiring manual sheet selection every time",
      ],
      transcript: [
        { time: "0:05", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. In this Vectorworks tutorial video, we are going to cover the basics of 2D annotations and dimensioning." },
        { time: "0:20", text: "If you aren't familiar with working in sheet layers and viewports, please watch the previous tutorial below." },
        { time: "0:28", text: "Prior to this tutorial, I have drawn the plan view, front elevation, and two sections of a wall in the design layer." },
        { time: "0:35", text: "We need to take the information from the design layer and place it in the sheet layer. I've already named this Sheet Layer 1: Elevations." },
        { time: "0:46", text: "In order to work with the drawing that we created in the design layer in the sheet layer, we need to create viewports that reference the drawing." },
        { time: "0:54", text: "To do this, I'm going to use the Rectangle tool and create a crop. The crop is simply drawing a rectangle over the viewport area that you're trying to create." },
        { time: "1:07", text: "I will then go to View and select Create Viewport. The Create Viewport dialog pops up, and the first thing you want to do is name the viewport." },
        { time: "1:21", text: "I recommend naming the viewport with the sheet number, which is 1, and the drawing number, which in this case will be 1, plus a brief description." },
        { time: "1:38", text: "The next option asks if you want to create a drawing label. I have this checked, and then you can select a style. I have the UTEP drawing number and sheet number style that I created selected." },
        { time: "1:56", text: "It will ask for the drawing number, which will be 1, and then a title: Wall Plan." },
        { time: "2:07", text: "We can also modify the information that we are going to see in the viewport. Since this is a relatively simple file, the only design layer we have to select is Elevations, and we're going to use all the classes that are in the file." },
        { time: "2:28", text: "We can modify the scale here. We want our drawing to be at half-inch scale. In this particular case, I'm going to press OK." },
        { time: "2:37", text: "Now in the sheet layer, I have the first drawing: Wall Plan 1." },
        { time: "2:49", text: "I'm now going to create the other viewports on the sheet layer." },
        { time: "3:31", text: "Now that I have created all of the viewports for my sheet layer, I need to lay out each viewport. One thing you can do is turn on Grid Snap. Currently, I have the Grid Snap reference set to half-inch by half-inch. I think this is pretty good." },
        { time: "3:51", text: "I'm going to click Show the Grid and press OK. Grabbing the wall, I'm going to snap to the grid, making sure that the bottom of the walls are all aligned." },
        { time: "4:38", text: "Once the drawing is laid out roughly how you plan on having it, we can modify the first elevation. I'm going to double-click, and we have viewport edit options." },
        { time: "4:57", text: "Here we can edit annotations, change the crop of the viewport, use the design layer to go back and modify elements of the design layer from where the viewport was created, or change the camera." },
        { time: "5:10", text: "Changing the camera view is really only for 3D objects, so this isn't effective for our workflow. I'm going to press OK and go into annotations." },
        { time: "5:25", text: "What you should note is that when we're in the annotation viewport, the scale is half-inch scale. If I quickly take the Line tool and draw a parallel line, it says ten feet zero." },
        { time: "5:44", text: "If I go outside of the annotation and do the same line, it says five inches, because we're in half-inch scale." },
        { time: "5:54", text: "Now I'm going to go back to the annotation viewport. The first thing we need to do is move the drawing label, because it typically gets in the way of your bottom dimension. I'm going to lower it to about here." },
        { time: "6:26", text: "With the drawing label, if you don't have one, you can always go back to the tool set and regenerate the drawing label. You can also hit the hotkey D to generate the drawing label." },
        { time: "6:43", text: "The drawing label is already named, and we basically named it when we created the viewport. When we go to the Object Info Palette, we can change the drawing title and the drawing number here." },
        { time: "6:56", text: "We have Display Scale set to architectural, so half-inch equals one foot zero in the bottom corner. You can also change the label length mode. I have this set to Control Point. If it was set to Fixed, all the labels would look the exact same." },
        { time: "7:16", text: "I like Control Point because it gives me the ability to adjust the label so it can extend all the way across the drawing, emphasizing what the drawing is." },
        { time: "7:30", text: "Now we're going to start dimensioning this drawing. We have two basic dimension tools here: the constrained linear dimension, which you'll use the most, and the unconstrained linear dimension." },
        { time: "7:47", text: "If you're working with angular dimensions, arc length, or looking for the radius of a circle, we also have those dimensions, but with this wall we won't really use them." },
        { time: "8:12", text: "The unconstrained linear dimension means I could draw a dimension at a 45-degree angle and still get a measurement. With the constrained linear dimension, we can only dimension things vertically or horizontally." },
        { time: "8:33", text: "Before we start, I'm going to show you that your document will probably default to constrained linear mode. That means when I draw the first dimension, it will stop, but we want to keep going." },
        { time: "8:56", text: "So we'll go back to the constrained linear dimension tool and change it from constrained linear mode to constrained chain mode. This will allow us to continue after the first dimension." },
        { time: "9:11", text: "I'm going to draw from the edge of the wall—not the edge of the molding, but the edge of the wall. Then I can find the point for the edge of the other wall from the drawing." },
        { time: "9:24", text: "I'm going to drop this down so I can access the grid. I want this to go down about a foot. I'm going to type 1' 0\" and press Enter." },
        { time: "10:02", text: "So edge to edge, down a foot, and here we are. Now you can keep going. I'm going to dimension each mark, including the door opening, the edge of the flat, and then the edge of the full wall." },
        { time: "10:29", text: "Then we want to dimension the overall length so we can see the total length of the wall—22 feet." },
        { time: "10:47", text: "I'm going to continue dimensioning this drawing, and then we'll come back. Hotkey N will give you the hotkeys for the Dimension tool." },
        { time: "11:53", text: "Now that I have all of the viewports dimensioned, I'm going to go back to the front wall elevation and add a few features that we need. Double-clicking in, the first thing we need is a human figure in our drawing." },
        { time: "12:10", text: "I'm going to go to my Resource Manager. If I go into the Common folder, under 2D Figures, I have a set of 2D people. Vectorworks also has a set if you want to search for those, but I like the people that I have." },
        { time: "12:28", text: "I'm going to place this figure in the corner, holding Shift and pushing into the side, so this is referencing the drawing. I'll exit the viewport and adjust spacing as I go as I add different elements." },
        { time: "12:51", text: "We have these two sections here, but we can add a reference marker. So we're going to go back into the annotations of our wall front elevation. In the tool palette, here is the Section Elevation Line tool." },
        { time: "13:09", text: "I already have classes set up for these elements in the sheet layer, so I'm going to turn on my section line class and select the tool. The first tool is the Wall Section tool. I'm going to take a section from this wall." },
        { time: "13:33", text: "I'm going to double-click. It's going in the same direction as the drawing. I messed that up. What you probably want to do is draw a reference line first. Then what I usually do is, from the center, add about a foot on both sides so it's a little bit taller." },
        { time: "14:03", text: "That means we may need to move our dimension line, which is fine. So I'll go back to the Wall Section tool and draw it in the correct direction. Now we have our first label." },
        { time: "14:20", text: "This red broken chain indicates it's not linked. If you're working in 3D, you can link drawings together. We'll go over that in another tutorial. I'm going to delete that reference line quickly." },
        { time: "14:34", text: "Now I'm going to modify a few things. For the marker scale factor, I like to have it about half the size. Right now it's referencing a drawing number and a sheet number, which we don't want." },
        { time: "14:50", text: "We want it to reference drawing 3. So I'm going to change the drawing number to 3. We only have one sheet, which is 1, so it's referencing 3/1. That's good. Now I'm going to lower this." },
        { time: "15:12", text: "Right now it's about nine and a half. I'm going to take it to negative 14 inches so we can bring this down. We may need a little bit more adjustment, and I'll adjust the labels for the other drawings as well." },
        { time: "15:40", text: "Now I'm going to hold Control + Shift and click through the door. We need to tell it that it's referencing Sheet 4. We'll press OK. Aside from notes, which I'll show you how to do, we have everything we need." },
        { time: "16:08", text: "Here is where the Callout tool is located. What you want to do is select first where the callout starts, and then where it's going. I'm going to label it Painted Wall." },
        { time: "16:27", text: "We also want to change the class to our General Label class. Make sure it's listening to our classes in the Attributes Palette, which it is. Then we're going to press Exit Viewport. So now we have this first drawing done." },
        { time: "16:51", text: "I'm going to quickly edit these elements." },
        { time: "17:09", text: "The last tool I want to cover in this tutorial is that we have all of our molding, but it's very small right now. We can't really dimension this in half-inch scale, so what we can do is reference elements in the 2D drawing." },
        { time: "17:30", text: "I'm going to use the Circle tool and draw over the crown molding. I'm going to keep this in the section line class. With this selected around our crown molding, I'm going to go to View and create a Detail Viewport." },
        { time: "18:07", text: "This will be our fifth drawing, so 1/5 Crown. We're going to use the same drawing label. I'm going to call this Crown Detail. I'm going to change the scale to half-inch to three-inch scale. I'm going to press OK." },
        { time: "18:37", text: "Here is our detail viewport. It's much larger. I'm happy with this. I just want to make sure the labels are lined up so everything looks clean." },
        { time: "18:54", text: "My goal is to keep everything in a rectangle within the page, so I'm going to adjust everything a little bit to give us more room. Then I'm going to double-click and go into the annotations." },
        { time: "19:14", text: "I'm going to do general dimensions of our crown molding, taking the height and the width. Here's a trick: if you notice we have dimension lines crossing, which you never want." },
        { time: "19:39", text: "I'm going to create a square, make it one inch by one inch, and press Enter. I'm going to override it so it has a solid white fill and no pen. I'm going to place it in the center, then bring the dimension to the front." },
        { time: "20:01", text: "Now we have a gap to clean up the dimension. This looks good. All I need to do now is create the rest of the detail viewports." },
        { time: "20:20", text: "Before we do that, I'm going to show you one more thing. I'm going to go back and edit the annotations. I think the scale factor could be reduced by half to clean that up." },
        { time: "20:36", text: "Because I created this on the section line class, we have the dashed line, which I think looks really good. What I want to do is move this. I like to keep things pretty linear in my drawings." },
        { time: "21:02", text: "I think we'll need to space these out so that when we add the other viewports, everything lines up. Now I'm going to go through and create the other detail viewports." },
        { time: "25:26", text: "Now that I've completed the drawing, I need to publish this to a PDF. To publish to a PDF, go to File, then Publish. We're going to add our sheet layer. This one is already selected." },
        { time: "25:44", text: "Go back to the elevation sheet layer and add that. Make sure it's added as a PDF, and go to File Export Options. This will create a folder for each type. I'm happy with these settings." },
        { time: "26:16", text: "Double-check options. Make sure it's set to All Pages. If you want to omit pages, you can, but we're going to do All Pages. Press OK, and then press Publish." },
        { time: "26:33", text: "It asks if I want to save a set. We could say yes and call the set Elevations. This feature is really helpful if you're creating a large document and you have to update it frequently." },
        { time: "26:58", text: "I'm going to press OK, leave it with the document name, and press Save. Now on my second screen, I have my published PDF." },
        { time: "27:11", text: "That's it. This completes the Vectorworks tutorial. Thank you for watching, and if you have any questions, please feel free to ask. Thank you." },
      ],
      relatedResources: [
        {
          title: "Vectorworks Viewport Documentation",
          url: "https://www.vectorworks.net",
          description: "Official documentation on creating and managing viewports on sheet layers",
        },
        {
          title: "Vectorworks Dimensioning Guide",
          url: "https://www.vectorworks.net",
          description: "Comprehensive guide to dimensioning tools and best practices",
        },
        {
          title: "Publishing and PDF Export",
          url: "https://www.vectorworks.net",
          description: "Best practices for publishing sheets to PDF with proper settings",
        },
      ],
      relatedTutorials: [
        { title: "Vectorworks Tutorial: Sheet Layers", slug: "sheet-layers" },
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
        { title: "Vectorworks Tutorial: Understanding Classes", slug: "understanding-classes" },
      ],
    },
    "3d-modeling-basics": {
      id: 12,
      title: "Vectorworks Tutorial: 3D Modeling Basics",
      youtubeId: "Jjz1zXDXafs",
      category: "3D Modeling",
      difficulty: "Intermediate",
      duration: "21:14",
      publishDate: "Feb 03, 2021",
      overview: "This comprehensive tutorial introduces essential 3D modeling operations in Vectorworks, covering nine fundamental techniques that form the foundation of scenic design modeling. You'll learn how to create 3D geometry from 2D shapes using Extrude, combine multiple solids using Add/Subtract/Intersect operations, create complex forms with Section Solids, build stepped profiles with Multiple Extrude, generate tapered shapes, create rotational forms with Sweep, and apply profiles along custom paths with Extrude Along Path. The tutorial demonstrates practical applications for each technique, including creating walls, moldings, organic forms, and architectural details. You'll also learn essential concepts like working with the Z-plane, understanding object stacking order, managing profile centerlines, and using the Split tool on 3D objects. This tutorial provides the complete toolkit needed to begin creating professional 3D scenic elements in Vectorworks.",
      learningObjectives: [
        "Create 3D geometry from 2D shapes using Extrude command with custom heights and Z-plane positioning",
        "Combine multiple 3D objects using Add Solids, Subtract Solids, and Intersect Solids operations",
        "Create complex sectioned forms using Section Solids with custom sectioning surfaces",
        "Build stepped and tapered profiles using Multiple Extrude and Tapered Extrude commands",
        "Generate rotational forms using Sweep with custom angles, segments, and center points",
        "Apply trim profiles along custom paths using Extrude Along Path with proper centerline offset",
        "Work effectively with the Z-plane to position 3D objects in space",
        "Use the Split tool to divide 3D objects for detailed modeling work",
        "Understand object stacking order and its effect on Multiple Extrude operations",
      ],
      keyConcepts: [
        { title: "EXTRUDE", content: "Command that converts 2D shapes into 3D solids by extending them perpendicular to their plane. Can be controlled via height, direction, and Z-plane position. Accessible via Model menu or Ctrl/Cmd+E hotkey." },
        { title: "ADD SOLIDS", content: "Boolean operation that combines multiple 3D objects into a single unified solid. Useful for creating complex forms from simple primitives. Accessible via Model menu, right-click context menu, or Ctrl+Alt+A hotkey." },
        { title: "SUBTRACT SOLIDS", content: "Boolean operation that removes one solid from another, creating voids or cutouts. Direction of subtraction is controlled by object selection order shown in dark orange. Accessible via Ctrl+Alt+S hotkey." },
        { title: "INTERSECT SOLIDS", content: "Boolean operation that keeps only the overlapping volume where two solids meet, removing everything else. Useful for creating complex intersecting forms. Accessible via Ctrl+Alt+I hotkey." },
        { title: "SECTION SOLIDS", content: "Operation that cuts a 3D object using another object as a sectioning surface, removing material on one side. Direction can be reversed, and section face can inherit the sectioning object's color." },
        { title: "MULTIPLE EXTRUDE", content: "Command that creates a stepped extrusion between two or more 2D shapes. Top shape in stacking order becomes the top profile, bottom shape becomes the bottom profile. Can create pyramids using a locus point as top shape." },
        { title: "TAPERED EXTRUDE", content: "Command that creates a tapered 3D form from a 2D shape using angle and height parameters. Base shape is maintained while sides taper inward. Can create pyramids or flat-topped tapered forms depending on height-to-angle ratio." },
        { title: "SWEEP", content: "Command that rotates a 2D profile around a center point to create rotational forms like columns, bowls, or vases. Controlled by sweep angle (up to 360°), segment angle (affects smoothness), and center locus position." },
        { title: "EXTRUDE ALONG PATH", content: "Command that follows a polyline path with a 2D profile to create moldings, trim, or organic forms. Profile extrudes from its center, so path must be offset by half the profile width for accurate edge placement. Supports uniform scaling along path." },
      ],
      proTips: [
        "Always check the Z-plane position of extruded objects in the Object Info Palette - objects default to Z=0 but can be raised or lowered by modifying the bottom Z value",
        "When extruding in Front view, remember to change the plane from Layer Plane to Screen Plane so the extrusion goes in the correct direction (along Y-axis instead of Z-axis)",
        "Use Shift+C to quickly toggle through different 3D views (isometric, front, right, back) without navigating menus - essential for checking your model from all angles",
        "For Add/Subtract/Intersect Solids operations, the dark orange highlight in the dialog indicates which object is the primary operation target - pay attention to this to get the desired result",
        "All solid operations (Add, Subtract, Intersect, Section) can be edited after creation using Edit Solid command - you're not locked into your first iteration",
        "When using Multiple Extrude, object stacking order matters - use Send to Front/Send to Back to control which shape becomes the top profile and which becomes the bottom",
        "To create a pyramid with Multiple Extrude, use a 2D locus point as the top shape - this creates a point at the top instead of a flat profile",
        "For Sweep operations, place a 2D locus to define a custom center point - this allows you to create wider or more complex rotational forms than using the default center",
        "The Split tool works on 3D objects just like 2D objects - use it to divide complex 3D forms into separate pieces for detailed work or material assignments",
        "When using Extrude Along Path, always offset your path by half the profile width - the profile extrudes from its center, not its edge, so an unmodified traced path will be incorrectly positioned",
        "If your Extrude Along Path molding appears backwards, edit the path polyline and reverse its direction - this is a common issue that's easily fixed",
        "Use the Uniform Scale parameter in Extrude Along Path to create profiles that grow or shrink along the path - set to 1 for consistent size, or 2 to double the size at the end",
        "For Tapered Extrude, if the taper angle is too steep for the height, the object will come to a point - reduce height or angle to maintain a flat top if needed",
        "Adjust the segment angle in Sweep to control smoothness - smaller angles create smoother circles, larger angles (like 45°) create multi-sided polygonal forms",
      ],
      shortcuts: [
        { keys: "Ctrl/Cmd + E", action: "Extrude selected 2D shape into 3D solid" },
        { keys: "Ctrl + Alt + A", action: "Add Solids - combine multiple 3D objects into one" },
        { keys: "Ctrl + Alt + S", action: "Subtract Solids - remove one solid from another" },
        { keys: "Ctrl + Alt + I", action: "Intersect Solids - keep only overlapping volume" },
        { keys: "Ctrl + Alt + X", action: "Extrude Along Path - apply profile along polyline" },
        { keys: "Shift + C", action: "Toggle through 3D views (isometric, front, right, back)" },
      ],
      commonPitfalls: [
        "Forgetting to check Z-plane position after extruding - objects may be sitting at Z=0 when they should be elevated, causing alignment issues with other elements",
        "Extruding in the wrong direction because the plane wasn't changed from Layer Plane to Screen Plane when working in Front view - always verify plane setting before extruding",
        "Selecting objects in the wrong order for Subtract Solids - the dark orange object in the dialog is the one being subtracted, so if the result is backwards, run the command again and select differently",
        "Using Multiple Extrude with shapes in the wrong stacking order - the top shape in the layers panel becomes the top profile, so use Send to Front/Back to control the result",
        "Tracing a path directly on the edge of a wall for Extrude Along Path without offsetting - the profile extrudes from its center, so the molding will be half inside the wall and half outside",
        "Not reversing the path direction for Extrude Along Path when the molding profile appears backwards - this is a common issue that requires editing the path and using the Reverse Direction command",
        "Setting the Tapered Extrude angle too steep for the height, causing the object to come to a point when a flat top is desired - reduce angle or increase height to maintain the top face",
        "Using too large a segment angle in Sweep operations, creating a faceted polygonal form instead of a smooth circular one - reduce segment angle for smoother results",
        "Forgetting that you can use the Split tool on 3D objects - many users assume it only works on 2D shapes, but it's equally useful for dividing 3D solids",
        "Not using Edit Solid to refine boolean operations after creation - you can always go back and adjust Add/Subtract/Intersect/Section operations instead of starting over",
      ],
      transcript: [
        { time: "0:05", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. In this Vectorworks tutorial, I'm going to show you the basics of 3D modeling." },
        { time: "0:14", text: "To start the tutorial, I have drawn a 2-foot by 2-foot rectangle, centered at 0,0 on the X and Y axis. Many of the most commonly used 3D modeling tools can be found in the Model menu tab." },
        { time: "0:38", text: "I'm going to first select our rectangle in Top/Plan view, go to the Model menu, and select Extrude. You can also do this by pressing Control or Command + E. Now that I've pressed Control + E, you can see the X and Y are set to two feet by two feet, which can be modified in the menu. I'm going to set the extrusion to four feet and press OK." },
        { time: "1:12", text: "In Top/Plan view, it appears that nothing has happened, but if I toggle into a 3D view, you'll see that our rectangle has been extruded to be four feet tall. If you look in the Object Info Palette, you can see the X and Y are both equal to two feet, the extrude is four foot zero, and the bottom Z value is sitting at zero on the plane. We can modify this by adding two feet. Now our rectangle is above the Z plane by two feet." },
        { time: "2:06", text: "In the next example of a simple extrude, I have drawn a rectangle in Top/Plan view that is four feet by twelve feet. If I change the plane from Layer Plane to Screen Plane and change our view from Top/Plan to Front view, I can now extrude the object by three inches. The object is now sitting on the X and Y axis and extruded along the Y axis. If I go back to Top/Plan view, you can see it is a rectangle." },
        { time: "2:54", text: "In this example, I'm going to show you how to add a solid. I have taken the previous rectangle, duplicated it, and rotated it by 90 degrees. Currently, these are two separate objects. If I click both objects by holding Shift and go to Model > Add Solids, or use the hotkey Control + Alt + A, the object becomes one object. You can also access Add Solids by selecting both objects, right-clicking, and choosing Add Solids." },
        { time: "3:34", text: "The next basic 3D function I'm going to show you is Subtract Solids. We can do this by first drawing this rectangle at 24 by 24, then extruding it by one inch. Let's make that 24 inches. Selecting both objects, you can go to Model > Subtract Solids, or press Control + Alt + S." },
        { time: "4:31", text: "Notice this dialog has popped up. We select the dark orange object and press OK, and it will subtract the object from the bottom. Or I can run Subtract Solids again and choose a different subtraction direction, depending on which object is highlighted in dark orange." },
        { time: "4:59", text: "The next basic function I'm going to show you is Intersect Solids. I'm going to go to our 3D Modeling tool set, select the Sphere tool, start from the center, and draw it out. I'm going to go to Front view and make sure the sphere is sitting at zero on the Z plane. Then I'm going to select the two objects and go to Model > Intersect Solids, or press Control + Alt + I. You can also do this by right-clicking and choosing Intersect Solids. What you'll notice is that everything outside of the sphere has been removed, and what remains is the intersection." },
        { time: "6:01", text: "Keep in mind that with these solid operations, you can also go to Edit Solid and adjust your previous iteration." },
        { time: "6:24", text: "The next function I want to share with you is Section Solids. We'll start by creating a sphere. I'm going to make it a radius of about two inches, and I'm going to color it red. Next, I'm going to use the Polyline tool to draw an organic curve. I'll move it into position." },
        { time: "7:01", text: "One of the interesting things with Vectorworks is that you can extrude a line, so I'm going to press Control or Command + E and extrude this four inches. I'll go to Front view and adjust placement. I'm going to move the sphere up two inches so it sits properly relative to zero. Then I'm going to color the polyline extrude green." },
        { time: "7:33", text: "Now I'm back in 3D. If I press Shift + C, that's how I toggle through the 3D views. I'm going to select both objects, right-click, and go to Model > Section Solids. You can also find Section Solids in the Model menu. The dialog indicates which object is the sectioning surface. I want the extruded polyline to be the sectioning surface, and I want the sphere to be the object we're sectioning." },
        { time: "8:16", text: "If I click the arrows to confirm the selections and press OK, you'll see that everything on one side of the polyline has been subtracted. If I want to reverse the direction, I can go to the Object Info Palette and click Reverse Direction, which switches which side is kept. Another option is Use Section Color. If I select that, the section face will take the color of the sectioning object, so the green becomes the face color on the sphere." },
        { time: "9:08", text: "The next function I'm going to share with you is Multiple Extrude. To start this demonstration, I have multiple rectangles on the page. I have one rectangle with another rectangle centered inside it, another rectangle with a rectangle on the edge, and another example that we'll use to create a pyramid." },
        { time: "9:40", text: "I'm going to switch into a 3D view by pressing Shift + C. I'm going to select both rectangles and go to the Model tool set. Here we have Multiple Extrude. Extrude is for a single shape, and Multiple Extrude is for multiple shapes. You can also use the hotkey Control + E. The shape order matters. The shape that is on top in the stacking order becomes the top profile, and the shape on the bottom becomes the bottom profile. We can control the extrusion height. For example, I can change six inches to four inches and press OK." },
        { time: "10:25", text: "Now we have the bottom rectangle and the top rectangle forming a stepped extrude. If I double-click, I can change the stacking order using Send to Front, which changes how the multiple extrude behaves. I'll switch it back for this example. I'll go to Model and run Multiple Extrude again, keeping it at four inches, so you can see how the top and bottom shapes relate." },
        { time: "11:31", text: "To make a pyramid shape, I'm going to take this rectangle and use the 2D Locus tool to place a point in the center. I'm going to select both and go to Model > Multiple Extrude, keep it at four inches, and press OK. Now we have three examples of a multiple extrude." },
        { time: "12:05", text: "The next Model function I'm going to show you is Tapered Extrude, which is similar to Multiple Extrude but gives you more control. If I go to Model > Tapered Extrude, I can set the height and taper angle. Looking at the Object Info Palette helps illustrate how it works. If I change the height to one foot, you can see the base shape is maintained, and it tapers in based on the angle." },
        { time: "13:04", text: "If I change the angle to 25 degrees, it becomes more dramatic and forms a pyramid shape. Because the height exceeds the taper, it comes to a point, but if I reduce the height to four inches, we get a flat top." },
        { time: "13:36", text: "Next, I'm going to show you Sweep. I have drawn a polyline to illustrate how the Sweep function works. Right now I'm in Top/Plan view, but I want to be in Front view, so I need to remember to change the plane appropriately. If I go to Model > Sweep, I'm going to press OK so it sweeps around 360 degrees and creates this shape." },
        { time: "14:18", text: "In the Object Info Palette, you can see the sweep is 360 degrees. We can change that to 180 degrees for a half sweep, and then back to 360. We can also adjust the segments. If I change the segment angle to 45 degrees, it becomes a multi-sided object. If I reduce the segment angle back down, it looks smoother, like a circle. You can also adjust the height and radius in the Object Info Palette." },
        { time: "15:46", text: "If I go back to Front view, I can add a 2D locus to change the center of the sweep. Now the sweep is wider because we've changed where the center is." },
        { time: "16:25", text: "As a bonus, I want to show you that with this 3D object—and all 3D objects—you can still use the Split tool. I'm going to select the Split tool, come from the center holding Shift, and now I have two halves of the object. You can use the Split tool to divide 3D objects as needed." },
        { time: "16:59", text: "The last model function I'm going to show you is Extrude Along Path. Currently, I have a polyline that I've extruded to 12 feet tall, so imagine this is a wall. Now I'm going to take this trim profile and move it into position. I'm going to create another polyline and trace the wall. This will be our path." },
        { time: "17:40", text: "Best practice is to copy the wall line first, then use the Offset tool to offset by half the profile width, because Extrude Along Path extrudes from the center of the profile, not the edge. Now I'm going to demonstrate the correct method. Go to Model > Extrude Along Path. You can also use the hotkey Control + Alt + X." },
        { time: "18:33", text: "The dark orange selection is the path, and the light orange selection is the profile. I'm going to press OK. If I go to Front view, we may need to raise our path. One thing you may notice is that the path direction can be backwards. This is common. If that happens, edit the path and reverse its direction, then exit. Now the molding is going the correct way." },
        { time: "19:25", text: "In the first example, when we traced the outside, remember that the path is based on the center of the profile, not the edge. So you need to offset the path so it represents the centerline of the molding." },
        { time: "20:11", text: "A couple other options in Extrude Along Path: if I select both the profile and the path and run Extrude Along Path, there is a Uniform Scale option. By default it's set to 1. If I change it to 2 and press OK, the profile becomes twice as large at the end. You can modify these settings in the Object Info Palette. You can change the scaling mode from exponential to uniform and set it back to 1." },
        { time: "21:14", text: "This concludes the tutorial on basic modeling techniques. If you have any questions, please feel free to ask." },
      ],
      relatedResources: [
        { title: "Vectorworks University: 3D Modeling Fundamentals", url: "https://university.vectorworks.net" },
        { title: "Vectorworks Help: Solid Modeling Operations", url: "https://app-help.vectorworks.net" },
        { title: "Community Forum: 3D Modeling Tips & Tricks", url: "https://forum.vectorworks.net" },
      ],
      relatedTutorials: [
        { title: "Vectorworks Tutorial: Understanding Design Layers", slug: "understanding-design-layers" },
        { title: "Vectorworks Tutorial: Resource Manager Basics", slug: "resource-manager-basics" },
      ],
    },
    "hybrid-symbols": {
      id: 13,
      title: "Vectorworks Tutorial: Hybrid Symbols",
      slug: "hybrid-symbols",
      youtubeId: "XeBfq6Kv1LY",
      category: "3d-modeling",
      difficultyLevel: "intermediate",
      duration: "5:06",
      publishDate: "Feb 05, 2021",
      overview: "This tutorial demonstrates how to create hybrid symbols that combine 2D and 3D representations in a single symbol. You'll learn the complete workflow for converting a 3D symbol into a hybrid symbol, including creating custom 2D components for Top/Plan views through manual tracing or auto-generation. The tutorial covers practical techniques for creating clean 2D graphics, managing component edit modes, and understanding the trade-offs between manual tracing and automatic generation methods. This skill is essential for creating efficient symbols that display appropriately in both 2D documentation and 3D visualization contexts.",
      learningObjectives: [
        "Create a 3D symbol and convert it into a hybrid symbol with 2D components",
        "Access and navigate the 2D Component edit mode for hybrid symbols",
        "Manually trace 2D Top/Plan representations using the Polyline tool",
        "Apply appropriate class attributes to 2D components for proper lineweight display",
        "Generate automatic 2D components from 3D geometry using Hidden Line rendering",
        "Understand the performance implications of auto-generation vs manual tracing methods",
      ],
      keyConcepts: [
        { title: "HYBRID SYMBOL", content: "A symbol that contains both 2D and 3D components, allowing it to display differently in plan view versus 3D views. The 2D component shows in Top/Plan view while the 3D component displays in isometric and perspective views." },
        { title: "2D COMPONENT", content: "The screen plane or plan view representation of a hybrid symbol. This component is created separately from the 3D geometry and can be customized to show appropriate detail levels for documentation purposes." },
        { title: "COMPONENT EDIT MODE", content: "A special editing environment accessed by double-clicking a symbol and selecting '2D Component'. In this mode, you can create or modify the 2D representation while viewing the 3D geometry as a reference." },
        { title: "SCREEN PLANE", content: "A drawing plane that always faces the viewer regardless of view orientation. 2D components in hybrid symbols are created on the screen plane so they display correctly in Top/Plan view." },
        { title: "HIDDEN LINE RENDER", content: "An automatic generation method that creates 2D linework from 3D geometry by calculating which edges are visible from a specific viewpoint. Useful for complex geometry but can be processor-intensive." },
        { title: "MANUAL TRACING", content: "The recommended method of creating 2D components by using the Polyline tool to trace over the 3D geometry. Provides better control, cleaner linework, and avoids performance issues with complex models." },
      ],
      proTips: [
        "Always set the insertion point to '3D object center' when creating symbols that will become hybrid symbols - this ensures proper alignment between 2D and 3D components.",
        "Check 'Change 2D objects from Layer Plane to Screen Plane' when creating the initial symbol to ensure 2D components display correctly in all views.",
        "Use the 'Show 3D' option with 'Show all details' when manually tracing - this gives you the clearest reference for creating your 2D component.",
        "Class your 2D components appropriately (e.g., '2D Medium Lineweight') to ensure they print and display with the correct line weights in documentation.",
        "For simple geometry like tables and chairs, manual tracing is faster and more reliable than auto-generation - you have complete control over what lines appear.",
        "Avoid using 'Generate 2D component from 3D' for complex models - it can overwhelm your computer and cause crashes. Reserve this method for simple, low-polygon geometry.",
        "When manually tracing, work methodically around the perimeter of the object in Top/Plan view to create a clean, closed polyline that accurately represents the footprint.",
        "Test your hybrid symbol in both Top/Plan and 3D views immediately after creation to verify both components display correctly before using it in your project.",
        "Keep your 2D components simple and focused on essential information - overly detailed 2D representations can clutter plan drawings and slow down performance.",
        "If you need to edit a hybrid symbol later, you can always delete the existing 2D component and create a new one - the 3D component remains unchanged.",
      ],
      shortcuts: [
        { keys: "Ctrl+K (Win) / Cmd+K (Mac)", description: "Create Symbol from selected objects" },
        { keys: "Double-click symbol", description: "Open Edit Symbol options dialog" },
        { keys: "Exit Symbol button", description: "Leave symbol edit mode and return to drawing" },
      ],
      commonPitfalls: [
        "Forgetting to check 'Change 2D objects from Layer Plane to Screen Plane' when creating the initial symbol, resulting in 2D components that don't display correctly in Top/Plan view.",
        "Using auto-generation for complex models, which can cause software crashes or extremely long processing times - always prefer manual tracing for detailed geometry.",
        "Not classing the 2D component properly, resulting in linework that prints too heavy or too light in construction documents.",
        "Creating overly detailed 2D components that include every edge and detail from the 3D model, cluttering plan views and reducing drawing clarity.",
        "Failing to test the hybrid symbol in both 2D and 3D views before using it extensively in a project, discovering display issues only after placing multiple instances.",
        "Not setting the insertion point correctly, causing alignment issues between the 2D and 3D components when the symbol is placed and rotated.",
      ],
      transcript: [
        { time: "0:06", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. In this Vectorworks tutorial video, we're going to cover hybrid symbols." },
        { time: "0:14", text: "If you aren't familiar with symbols, I recommend watching my previous video on symbols. In that video, we covered how to create a symbol, including 2D, 3D, and grouped symbols. A hybrid symbol is when you combine the 2D and 3D elements into a single symbol." },
        { time: "0:44", text: "For this tutorial, I've created a table. Right now, the table is just a 3D object. I'm going to start off by selecting the components that I want in my symbol." },
        { time: "1:03", text: "Then I'm going to go to Modify > Create Symbol, or press Control + K. I'm going to name the symbol 'Table,' and I'm going to make sure the insertion point is set to the 3D object center." },
        { time: "1:22", text: "I'm going to keep the units world-based. I'm going to uncheck Story-Aware and Insert in Wall. I'm going to leave 'Leave instance in place' checked. I'm also going to check 'Change 2D objects from Layer Plane to Screen Plane.' I'm going to keep 'Convert to group' unchecked." },
        { time: "1:42", text: "Now I'm going to press OK. I'm going to store this in the Resource Manager. I won't put it in a folder for this tutorial. Press OK. Now we have a 3D symbol." },
        { time: "1:56", text: "If I go to Top/Plan view, we can see the wireframe, which is not ideal. To change the wireframe into a drafted 2D top/plan graphic, I'm going to double-click and open the Edit Symbol options." },
        { time: "2:13", text: "I'm going to select 2D Component and press OK. Now we're in the component edit mode. Up here, we can create a 2D representation for multiple views, but the most effective for our purposes will be Top/Plan view." },
        { time: "2:37", text: "We can show different sides of the object. I'm going to keep Show 3D selected and set this to show all details. What I'm going to do is use the Polyline tool and trace the top/plan view of the table." },
        { time: "3:20", text: "I'm going to class the 2D object in our 2D medium lineweight class. Now it looks like an appropriate 2D graphic." },
        { time: "3:32", text: "I'll exit the symbol, and it will ask if I want to continue because I've converted the 3D symbol into a hybrid symbol by adding a screen plane or hybrid object. I'm going to choose Yes." },
        { time: "3:46", text: "Now I have a 2D view of the table in Top/Plan view, but if I swivel into any of the 3D views, I still have the 3D table." },
        { time: "3:58", text: "Alternatively, you can double-click and go back into the 2D component, delete what you drew, then go back into 3D. Right-click, and you can generate a 2D component from the 3D component." },
        { time: "4:19", text: "You want to generate a Hidden Line render and press OK. The software will now generate what it believes is the correct 2D representation. In this case, it's accurate. I'm going to press Exit Symbol." },
        { time: "4:35", text: "So we still have a hybrid symbol with a 2D Top/Plan view and a 3D element. When it comes to allowing Vectorworks to generate the hybrid model, please note that more complex models can overwhelm your computer and cause it to crash." },
        { time: "5:01", text: "I recommend tracing the object yourself. This concludes the hybrid symbol tutorial. If you have any questions, let me know. Thank you." },
      ],
      relatedResources: [
        { title: "Vectorworks University: Hybrid Symbols", url: "https://university.vectorworks.net" },
        { title: "User Guide: Symbol Types and Workflows", url: "https://app-help.vectorworks.net" },
        { title: "Community Forum: Symbol Best Practices", url: "https://forum.vectorworks.net" },
      ],
      relatedTutorials: [
      { title: "Vectorworks Tutorial: Understanding Symbols", slug: "understanding-symbols" },
      { title: "Vectorworks Tutorial: 3D Modeling Basics", slug: "3d-modeling-basics" },
    ],
  },
  "basics-of-textures": {
    id: 14,
    title: "Vectorworks Tutorial: Basics of Textures",
    slug: "basics-of-textures",
    youtubeId: "9iApEa1XTug",
    category: "3d-modeling",
    difficulty: "Intermediate",
    duration: "13:21",
    publishDate: "Feb 08, 2021",
    description: "Learn how to apply, edit, and create custom Renderworks textures to bring life to your 3D models in Vectorworks.",
    overview: "This tutorial introduces Renderworks textures in Vectorworks, covering how to apply pre-made textures, adjust mapping types, edit texture parameters, and create custom textures from scratch. You'll learn the differences between OpenGL and Renderworks rendering modes, understand texture shaders (color, reflectivity, transparency, bump), and master the controls for scaling, rotating, and mapping textures onto 3D objects. The tutorial demonstrates practical workflows for wood, stone, glass, and marble textures, showing how to achieve realistic results through proper texture configuration and lighting.\n\n**Note:** In current versions of Vectorworks, OpenGL rendering mode has been renamed to \"Shaded.\" The concepts and workflows remain the same.",
    learningObjectives: [
      "Understand the differences between OpenGL (now called 'Shaded'), Fast Renderworks, and Final Quality Renderworks",
      "Apply pre-made Renderworks textures from the Resource Manager to 3D objects",
      "Adjust texture mapping types (Plane, Auto-Align Plane, Perimeter, Sphere, Cylinder)",
      "Edit texture parameters including scale, offset, rotation, and mapping mode",
      "Understand and modify texture shaders: color, reflectivity, transparency, and bump",
      "Apply textures by face to create multi-material objects",
      "Create custom Renderworks textures from imported images",
      "Configure lighting (spotlights) to enhance texture visualization",
      "Optimize texture scale settings within the texture definition vs. Object Info Palette",
    ],
    keyConcepts: [
      {
        title: "RENDERWORKS RENDERING MODES",
        content: "OpenGL (now called 'Shaded' in current Vectorworks versions) is the fastest, simplified render mode that doesn't calculate lighting. Fast Renderworks adds basic lighting calculations. Final Quality Renderworks produces photorealistic results with full lighting, shadows, and reflections—but requires more processing time. Use Shaded/OpenGL for modeling, Renderworks for presentation.",
      },
      {
        title: "TEXTURE MAPPING TYPES",
        content: "Plane projects texture from a single direction. Auto-Align Plane projects texture perpendicular to each face. Perimeter wraps texture around the object's perimeter. Sphere and Cylinder are optimized for spherical and cylindrical geometry. Choose the map type that best matches your object's shape.",
      },
      {
        title: "TEXTURE SHADERS",
        content: "Color shader defines the base image or color. Reflectivity controls how light bounces off the surface (mirror, glossy, matte). Transparency controls how see-through the material is (glass = high transparency). Bump creates simulated surface texture without changing geometry.",
      },
      {
        title: "TEXTURE SCALE SETTINGS",
        content: "Texture scale can be adjusted in two places: in the Object Info Palette (per-object override) or within the texture definition itself (affects all instances). Editing the texture definition is preferred for consistency across multiple objects using the same material.",
      },
      {
        title: "APPLY BY FACE",
        content: "Instead of applying one texture to an entire object, you can apply different textures to individual faces. This allows multi-material objects like a wooden box with a stone top. Select the face in the Object Info Palette and assign the texture.",
      },
      {
        title: "FRESNEL REFLECTIVITY",
        content: "Fresnel is a physically-accurate reflection model where surfaces reflect more light at glancing angles. This creates realistic reflections on materials like water, glass, and polished surfaces. Adjusting Fresnel values affects how reflections change based on viewing angle.",
      },
    ],
    proTips: [
      "Work in Shaded mode (formerly OpenGL) while modeling and adjusting textures—only switch to Renderworks when you need to check the final appearance",
      "Rename long texture names to shorter, descriptive names (e.g., 'Stonework') to keep your Resource Manager organized",
      "Edit texture scale in the texture definition (Resource Manager > Edit) rather than per-object for consistency across your model",
      "Start with Vectorworks' pre-made textures and modify them rather than building from scratch—they have well-tuned shader settings",
      "Use bump mapping at 20-50% for subtle surface texture; 100% bump can look unrealistic unless you're creating rough materials",
      "Set reflectivity to Mirror mode at 5-15% for realistic glossy surfaces like polished stone or finished wood",
      "Add a spotlight when testing reflective materials—reflections are more visible with directional lighting",
      "For glass materials, keep transparency at 80-95% and add slight reflectivity for realism",
      "When creating custom textures from images, ensure the image tiles seamlessly or use large enough scale to avoid visible repeats",
      "Use Auto-Align Plane mapping for architectural objects (boxes, walls) and Perimeter for cylindrical objects (columns, pipes)",
      "Adjust blurriness on mirror reflections to soften them—sharp mirror reflections (0% blur) rarely occur in real materials",
      "Save custom textures to your user library so you can reuse them across projects",
      "Test textures on simple geometry (cubes, cylinders) before applying to complex models",
      "Keep texture file sizes reasonable—high-resolution images (4K+) can slow down rendering without noticeable quality improvement",
    ],
    shortcuts: [
      { keys: "Cmd/Ctrl + Click", action: "Select individual faces for face-specific texture application" },
      { keys: "Resource Manager", action: "Access pre-made Renderworks textures and edit texture definitions" },
      { keys: "Object Info > Render", action: "View and modify textures applied to selected objects" },
    ],
    commonPitfalls: [
      "Using Final Quality Renderworks while modeling—it's too slow. Stick to OpenGL and only render for final checks",
      "Not adjusting texture scale, resulting in unrealistic material appearance (e.g., wood grain that's 10 feet wide)",
      "Applying textures without considering the mapping type—Plane mapping on a cylinder will look distorted",
      "Setting bump to 100% on every texture, creating overly rough, unrealistic surfaces",
      "Not renaming textures, leading to a cluttered Resource Manager with cryptic names",
      "Adjusting texture scale in Object Info Palette instead of the texture definition, causing inconsistency across objects",
      "Forgetting to add lighting when testing reflective materials—reflections won't be visible without light sources",
      "Using high-resolution texture images that slow down rendering without improving visual quality",
      "Not understanding the difference between bump (simulated texture) and actual 3D geometry—bump doesn't change the silhouette",
      "Applying glass textures without adjusting transparency, resulting in opaque 'glass' objects",
    ],
    transcript: [
      { time: "0:06", text: "Hello, this is Brandon PT Davis, theatrical scenic designer. In this Vectorworks tutorial, we're going to cover the basics of textures." },
      { time: "0:13", text: "Textures in Vectorworks are what give you the ability to bring life to your 3D objects." },
      { time: "0:20", text: "Currently, the object we're looking at in OpenGL is just a white cube with no textures on it." },
      { time: "0:34", text: "If you're not familiar with the render options, OpenGL is the most simplified render mode in Vectorworks." },
      { time: "0:45", text: "We can also change our render options to Fast Renderworks and Final Quality Renderworks." },
      { time: "0:53", text: "You can build your own library of render styles, and we'll go over how to modify those in another video." },
      { time: "1:01", text: "If I click Final Quality Renderworks, you'll see it generates an image that shows shadows and how light reflects on your model." },
      { time: "1:16", text: "Now I'm going to switch back to OpenGL, because when you use Renderworks, your computer has to process how light affects the object, and that takes time." },
      { time: "1:36", text: "So OpenGL is a simplified version of that." },
      { time: "1:40", text: "In the Resource Manager, Vectorworks has hundreds of pre-made Renderworks textures that you can select." },
      { time: "1:52", text: "I've selected three to start this tutorial: a glass, a stone, and a wood texture." },
      { time: "2:00", text: "The first one I'm going to show you is the wood texture. I'm going to select it and drop it onto our one-foot by one-foot cube." },
      { time: "2:19", text: "In the Object Info Palette, I can go to the Render settings. Here we have the texture that's been applied." },
      { time: "2:30", text: "From the dropdown, I can change the texture easily." },
      { time: "2:32", text: "We also have the map type, scale, offset, and rotation." },
      { time: "2:41", text: "These controls let you quickly adjust the texture, including flipping it if needed." },
      { time: "2:51", text: "The map type controls how the texture is projected onto the object." },
      { time: "2:59", text: "For mapping, we have Plane, Auto-Align Plane, Sphere, Cylinder, and Perimeter." },
      { time: "3:06", text: "My process is to choose the map type that seems best for the object, and then adjust if needed." },
      { time: "3:18", text: "Right now it's set to Perimeter." },
      { time: "3:22", text: "Before changing the map type, I can also adjust the scale to make the texture smaller, since we're dealing with a one-foot cube." },
      { time: "3:31", text: "I can also change the rotation." },
      { time: "3:37", text: "In Plane mode, it maps the texture based on a single plane across the object. That can look less accurate on some faces." },
      { time: "4:02", text: "Auto-Align Plane chooses each face and projects the texture onto that face." },
      { time: "4:15", text: "Perimeter maps around the perimeter of the object. With a cube, it can feel similar to Auto-Align, but it's handling the mapping differently." },
      { time: "4:34", text: "There are also Sphere and Cylinder modes, which make more sense when you're mapping spherical or cylindrical objects." },
      { time: "4:52", text: "Another thing we can do is apply textures by face. For example, I can map stone only to the top face, while the rest stays wood." },
      { time: "5:18", text: "Now I'm going to switch to Final Quality Renderworks so you can see how it looks with more realistic lighting and shadows." },
      { time: "5:34", text: "Now with our stone texture, I'm going to show you that we can edit the texture parameters." },
      { time: "5:41", text: "In the Resource Manager, I can right-click the stone texture and choose Edit." },
      { time: "5:49", text: "The name is long, so I can rename it to something simpler, like 'Stonework,' to keep the file organized." },
      { time: "6:05", text: "Then we can adjust the shaders. Textures aren't just images—you can also control reflectivity, transparency, and bump." },
      { time: "6:13", text: "If I look at the color shader, I can edit it and see the image the shader is based on." },
      { time: "6:28", text: "From the dropdown, I can also adjust the color and Fresnel, or build my own color shaders in Vectorworks." },
      { time: "6:42", text: "Reflectivity affects how light hits the object. For now, I'll keep it using the image's reflectivity." },
      { time: "6:54", text: "Transparency controls how transparent the object is. Stone isn't transparent, so we keep that low." },
      { time: "7:02", text: "Bump creates a simulated surface texture. Right now the bump is set to 20, so I'm going to increase it to 100% for the sake of the tutorial." },
      { time: "7:20", text: "I'll press OK." },
      { time: "7:25", text: "Now I'll go back to Final Quality Renderworks and re-render." },
      { time: "7:41", text: "Watch the stone—you'll see it gains a little more depth. It's subtle, but it looks more realistic." },
      { time: "7:56", text: "Now I'm going to copy these cubes, reset the mapping, and reapply textures." },
      { time: "8:19", text: "We want to revert to Overall mapping, then I'll apply the glass texture to one cube and the stonework texture to another." },
      { time: "8:36", text: "Glass has a lot of transparency. If I edit the glass texture, we can see the transparency is set to 90%." },
      { time: "8:54", text: "If I render in Final Quality Renderworks, the textures look more realistic than OpenGL, and we can continue to modify them as needed." },
      { time: "9:13", text: "If I wanted the stonework to be glossier, I could right-click and edit it." },
      { time: "9:20", text: "I'm going to change the reflectivity to Mirror." },
      { time: "9:26", text: "100% would be too intense, so I'll set it to about 15% and press OK. It will re-render, and now it's a bit shinier." },
      { time: "9:44", text: "You can see the glossiness better if we add a light." },
      { time: "9:48", text: "In the Visualization palette, I'm going to add a spotlight and press OK." },
      { time: "10:03", text: "Then I'll adjust the spotlight so it's pointing directly down." },
      { time: "10:46", text: "Now you can see the mirror glossiness more clearly—but it's too intense." },
      { time: "10:53", text: "So I'll go back, edit the mirror reflectivity, and reduce it to around 5% so it looks more realistic." },
      { time: "11:06", text: "This is a few of the things you can do with textures in Vectorworks." },
      { time: "11:13", text: "You can also create your own textures. If I go down to the bottom and create a new Renderworks texture, I can import an image." },
      { time: "11:31", text: "Here's a marble image." },
      { time: "11:36", text: "I'll change the reflectivity to Mirror, maybe set it to 10%." },
      { time: "11:44", text: "You can also adjust blurriness. The dialog explains that this controls how blurry the reflection is, so increasing it makes reflections softer." },
      { time: "11:59", text: "I can also modify the texture so it reflects a bit of green, keep transparency at none, and set bump to around 9." },
      { time: "12:10", text: "And we'll name it 'Marble.'" },
      { time: "12:16", text: "Press OK, go into our 3D view, and apply the marble texture." },
      { time: "12:22", text: "At first, the marble pattern may look too small." },
      { time: "12:29", text: "You can adjust the scale in the Object Info Palette, but it's better to edit the texture and set the scale there." },
      { time: "12:46", text: "I'll set it to one foot for now, and that works nicely." },
      { time: "12:52", text: "Now if I go to Final Quality Renderworks, it looks more realistic." },
      { time: "13:02", text: "That's how you can create a marble texture—or any texture—in Vectorworks." },
      { time: "13:09", text: "As you move forward in Vectorworks, you'll probably become more interested in studying how Renderworks textures affect your model." },
      { time: "13:21", text: "But as a basic introduction, I think this is a good start. If you have any questions, let me know." },
    ],
    relatedResources: [
      { type: "Documentation", title: "Vectorworks Renderworks Guide", url: "https://www.vectorworks.net/" },
      { type: "Video", title: "Advanced Renderworks Techniques", url: "https://www.youtube.com/vectorworks" },
      { type: "Community", title: "Vectorworks Forum - Rendering", url: "https://forum.vectorworks.net/" },
    ],
    relatedTutorials: [
      { title: "Vectorworks Tutorial: 3D Modeling Basics", slug: "3d-modeling-basics" },
      { title: "Vectorworks Tutorial: Hybrid Symbols", slug: "hybrid-symbols" },
      { title: "Vectorworks Tutorial: Resource Manager Basics", slug: "resource-manager-basics" },
    ],
  },
  "3d-modeling-tools": {
    id: 15,
    title: "Vectorworks Tutorial: 3D Modeling Tools",
    slug: "3d-modeling-tools",
    youtubeId: "8dm9ZMTXypE",
    category: "3d-modeling",
    difficulty: "Intermediate",
    duration: "18:19",
    publishDate: "Feb 08, 2021",
    description: "Master the essential 3D modeling tools in Vectorworks including primitive objects, push/pull, extract, fillet, chamfer, taper, deform, and shell solid.",
    overview: "This comprehensive tutorial covers the complete 3D modeling toolkit in Vectorworks. You'll learn how to create primitive objects (sphere, hemisphere, cone, pyramid, ellipsoidal), use the push/pull tool for quick extrusions, extract surfaces and curves from complex objects, add fillets and chamfers to edges, taper faces at specific angles, deform solids with twist/bend/bulge modes, and create hollow objects with the shell solid tool. Each tool is demonstrated with practical examples showing how to adjust parameters, select faces and edges, and combine tools for complex modeling workflows.",
    learningObjectives: [
      "Create primitive 3D objects: sphere, hemisphere, cone, pyramid, and ellipsoidal shapes",
      "Use push/pull tool to extrude and move faces in different modes",
      "Extract surfaces and curves from complex 3D objects for texture application",
      "Apply fillets and chamfers to edges and faces with precise radius control",
      "Taper faces using tangent and picked face modes",
      "Deform solids using twist, bend (finite/symmetric), and bulge modes",
      "Create hollow objects with shell solid tool by selecting faces and setting thickness",
      "Understand the difference between extrude face mode and move face mode",
      "Modify 3D objects using the Object Info Palette after creation",
    ],
    keyConcepts: [
      {
        title: "PRIMITIVE OBJECTS",
        content: "Vectorworks provides tools to create basic 3D shapes without manual modeling: Sphere (Shift+3), Hemisphere (half sphere), Cone (with radius/height or radius/tip modes), Pyramid (adjustable sides, regular or frustrum), and Ellipsoidal (adjustable height/width/length). These primitives use familiar circle-tool modes (radius, diameter, center-radius) and can be modified in the Object Info Palette after creation.",
      },
      {
        title: "PUSH/PULL TOOL",
        content: "Press P to access push/pull for quick face manipulation. Extrude Face Mode follows the angle of the selected face (useful for tapered objects). Move Face Mode moves the face perpendicular to the object regardless of face angle. Both modes work on closed faces and can be applied to multiple areas of the same object. This is the fastest way to add height variations to extruded shapes.",
      },
      {
        title: "EXTRACT TOOL",
        content: "Extract (Shift+E) pulls surfaces or curves from complex 3D objects. Extract Surface Mode isolates individual faces for separate texturing—extracted surfaces sit on top of the original. Extract Curve Mode pulls edge curves that can be combined with Connect/Combine tool and used for extrude-along-path operations. Use Shift+arrow keys to nudge extracted surfaces away from the original object.",
      },
      {
        title: "FILLET & CHAMFER EDGES",
        content: "Fillet Edge Tool (Ctrl+F) rounds edges with adjustable radius. Chamfer Tool creates angled cuts instead of curves. Both tools let you select individual edges (Shift+click), entire faces, or all faces at once. Fillets and chamfers remain editable in the Object Info Palette. Use Ctrl+U to ungroup and return to the original shape. Fillet is essential for realistic product modeling and architectural details.",
      },
      {
        title: "TAPER FACE TOOL",
        content: "Taper Face has two modes: Tangent Face Mode (select anchor face first, then the face to taper) and Picked Face Mode (pick two faces to taper between them). Press Tab to enter specific angles numerically. Tapering is useful for creating sloped walls, angled surfaces, and architectural features without manual vertex manipulation.",
      },
      {
        title: "DEFORM TOOL",
        content: "Deform Tool offers three modes: Twist Solid (rotate object around center point—keep angles moderate to avoid computation issues), Bend Solid (finite mode bends from one point, symmetric mode bends from both sides), and Bulge Mode (select point and bulge outward). Extreme deformations require more processing power. Deformed objects remain editable in Object Info Palette.",
      },
      {
        title: "SHELL SOLID TOOL",
        content: "Shell Solid (Shift+S) hollows out 3D objects by adding thickness to selected faces. Select a face, set thickness (e.g., 0.5\"), and check to create a hollow object like a vase or container. Works on both complex organic shapes and simple extrudes. Essential for creating objects that need interior volume, such as vessels, boxes, and architectural elements.",
      },
    ],
    proTips: [
      "Work in a rotated 3D view when using cone, pyramid, and deform tools—it's easier to visualize the results",
      "Use Shift+click to select multiple edges for fillet or chamfer operations, then adjust radius uniformly",
      "Extract surfaces to apply different textures to specific faces without affecting the entire object",
      "Press Tab while using taper, fillet, or deform tools to enter precise numeric values instead of dragging",
      "Keep twist deformations under 180 degrees to avoid excessive processing time and visual artifacts",
      "Use symmetric bend mode for creating arches and curved structures that need to be balanced",
      "Shell solid works on any face—select the top of an extrude to create a box, or the side of an organic shape for a vase",
      "Combine extract curve with extrude-along-path to create pipes, railings, and decorative elements that follow complex surfaces",
      "Use Ctrl+U to ungroup filleted or chamfered objects and return to the original shape if you need to start over",
      "Modify primitive objects in the Object Info Palette after creation—you can adjust radius, height, sides, and more",
      "Use push/pull's move face mode when you need to adjust depth without following the object's angle",
      "Create a library of primitive objects with common dimensions to speed up your modeling workflow",
    ],
    shortcuts: [
      { keys: "Shift + 3", action: "Activate Sphere tool" },
      { keys: "P", action: "Activate Push/Pull tool" },
      { keys: "Shift + E", action: "Activate Extract tool" },
      { keys: "Ctrl + F", action: "Activate Fillet Edge tool" },
      { keys: "Shift + S", action: "Activate Shell Solid tool" },
      { keys: "Tab", action: "Enter numeric value while using tools" },
      { keys: "Shift + Arrow", action: "Nudge extracted surfaces" },
      { keys: "Ctrl + U", action: "Ungroup object to return to original shape" },
    ],
    commonPitfalls: [
      "Forgetting to work in 3D view when using cone or pyramid tools—results are hard to visualize in top/plan view",
      "Selecting the wrong face when using shell solid—always verify which face is highlighted before confirming",
      "Using extreme twist angles (over 180°) that cause long processing times and potential crashes",
      "Not using Shift+click to select multiple edges for fillet/chamfer—results in inconsistent edge treatments",
      "Confusing extrude face mode with move face mode in push/pull—leads to unexpected angles on tapered objects",
      "Forgetting to press Tab to enter numeric values—dragging is less precise than typing exact measurements",
      "Not extracting surfaces before applying textures to specific faces—results in entire object being textured",
      "Attempting to fillet or chamfer edges on objects with complex geometry—simplify first or select edges carefully",
      "Not checking Object Info Palette after creating primitives—missing opportunities to adjust parameters precisely",
      "Using bend solid without understanding finite vs symmetric modes—creates unbalanced or unexpected curves",
    ],
    transcript: [
      { time: "0:06", text: "Hello, this is Brandon PT Davis, theatrical scenic designer, and in this Vectorworks tutorial video we're going to be going over the 3D modeling tools in the tool palette." },
      { time: "0:18", text: "The 3D modeling tools are located here in the tool palette. You'll see a variety of tools which you can use for 3D modeling." },
      { time: "0:29", text: "The first set of tools I'm going to show you are probably the more simple tools. These are ways to create primitive objects in Vectorworks without a lot of effort." },
      { time: "0:43", text: "As you've probably recognized from the last video, creating a cube is relatively easy with the extrude function." },
      { time: "0:50", text: "But creating a sphere may be more difficult, so here is the sphere tool." },
      { time: "0:56", text: "You can access the sphere tool by hitting Shift+3." },
      { time: "1:01", text: "It's like using the circle tool—you pick the radius, in this case a radius of 6 inches, and it will create a sphere." },
      { time: "1:15", text: "As we fly over, we'll see this is a sphere." },
      { time: "1:22", text: "You can also use radius mode, diameter mode, and center radius mode—all modes you're familiar with using the circle tool." },
      { time: "1:32", text: "Going back into the top plan, we'll next look at the hemisphere." },
      { time: "1:37", text: "A hemisphere is essentially a half circle. The hemisphere works exactly like the sphere tool, only when you look in 3D mode it will be the half sphere." },
      { time: "1:52", text: "The next primitive object you can find in the 3D modeling tools palette is the cone tool." },
      { time: "2:02", text: "The cone tool is best to have in a rotated view. Selecting the cone tool, I can use the radius and height mode." },
      { time: "2:10", text: "First I'll select the center point, then select the radius just as you would with the circle tool, then one click and we pick the height." },
      { time: "2:25", text: "In this case I'm going to make the height 12 inches, and now we have a cone." },
      { time: "2:34", text: "You can also create a cone using radius and tip mode. Here we select the radius and then adjust the angle of the tip for a more organic shape." },
      { time: "2:52", text: "Another primitive we can create is the pyramid object tool." },
      { time: "3:00", text: "To adjust the pyramid object, we can change the number of sides, decide if it's regular or frustrum, change the mode—inscribed or circumscribed—and adjust the base radius, top, and the height." },
      { time: "3:22", text: "I'm going to go with the defaults and place our pyramid. Now we have our three-sided pyramid." },
      { time: "3:34", text: "You can go to the Object Info Palette and adjust the settings there as well." },
      { time: "3:56", text: "The last primitive object tool I'm going to be showing you is the ellipsoidal object tool." },
      { time: "4:03", text: "After selecting this object, we can manage its attributes in the ellipsoidal object palette and place the object in the document." },
      { time: "4:17", text: "We can also go to the Object Info Palette and further change the height, width, and length of the object." },
      { time: "4:28", text: "The next tool I'm going to show you is the push/pull tool." },
      { time: "4:35", text: "You can access push/pull by pressing P. I'm going to start with a rectangle and press P for push/pull." },
      { time: "4:46", text: "We start in extrude face mode. This allows you to select a closed face, click once, and adjust the height of the face." },
      { time: "4:56", text: "You can do this in multiple areas." },
      { time: "5:02", text: "With this tapered object, I'll show you the difference between extrude face mode and move face mode." },
      { time: "5:11", text: "In extrude face mode, when we extrude the face it follows the angle of the object." },
      { time: "5:20", text: "But if I go back to the extruded object and select move face mode, you'll see we move the face perpendicular to the object." },
      { time: "5:36", text: "This is different than extrude face mode, where we extrude the face in the direction the face is oriented." },
      { time: "5:48", text: "Next I'm going to show you the extract tool. The extract tool is located here and can also be accessed by hitting Shift+E." },
      { time: "6:00", text: "To show you how it works, I have this odd shape with a wood grain texture. Imagine I want just one face—this face—and I want it to be blue." },
      { time: "6:17", text: "Because this is a complex object, Vectorworks doesn't always know what to define as the top or sides." },
      { time: "6:42", text: "So using the extract tool, I can choose different modes. There's extract by point, extract curve, extract iso parametric curve, and extract surface mode." },
      { time: "7:09", text: "I'm going to select extract surface mode, I click this surface, and hit the check mark." },
      { time: "7:16", text: "Now we've created another surface on top, so now I can go to my Resource Manager and apply a blue texture." },
      { time: "7:28", text: "We can't see it yet, so a trick is to go into a front, left, or right view, hold Shift and nudge it with the arrow key one time." },
      { time: "7:45", text: "Now it looks like we have our texture. If I go to a fast Renderworks mode, we can see the texture sitting on top." },
      { time: "8:04", text: "Another useful mode is extract curve mode. I can select any number of curves, then check this." },
      { time: "8:24", text: "Now I have these curves in a group. I can click into the group and modify them." },
      { time: "8:28", text: "Using the connect/combine tool, I can combine these in 3D. We'll use position matching and connect." },
      { time: "8:50", text: "Make sure you're in the right mode, then I could draw a circle on the bottom and extrude along path." },
      { time: "9:15", text: "Press OK. Now I have a cylinder that runs along the object." },
      { time: "9:25", text: "The next tool I'm going to show you is the fillet edge tool. This is a tool you'll use often." },
      { time: "9:30", text: "It's similar to the fillet tool in the basic tool palette, but for 3D objects." },
      { time: "9:43", text: "I have a 10 inch by 10 inch by 10 inch cube. I'm going to select the fillet tool—you can also access it with Ctrl+F." },
      { time: "9:52", text: "We can adjust the radius. I'll start with a half inch, then I can select edges by holding Shift and clicking the lines." },
      { time: "10:08", text: "When I hit the check box, the fillet is created." },
      { time: "10:16", text: "You can adjust the fillet in the Object Info Palette, and there we are." },
      { time: "10:31", text: "To remove the fillet, I can select remove and they're all gone, or I can modify which edges are selected and recheck the box." },
      { time: "10:51", text: "You can also unselect edges with Shift and then hit the check box again." },
      { time: "11:00", text: "In tool preferences you can also select faces instead of edges. Here's a face selected, and it selects the entire face." },
      { time: "11:16", text: "You can also choose all faces and hit the check box. Now the entire object has a half-inch fillet." },
      { time: "11:31", text: "You can also hit Ctrl+U to ungroup and return to the original shape." },
      { time: "11:38", text: "Next I'll show you the chamfer tool. This is similar to what you're used to in the basic tool palette." },
      { time: "11:47", text: "I have the chamfer set to 1. I select the edges and hit the check box." },
      { time: "11:57", text: "Now instead of a fillet, we have a chamfer. You'll see similar options as fillet, and you can modify chamfers in the Object Info Palette as well." },
      { time: "12:17", text: "The next tool is the taper face tool." },
      { time: "12:21", text: "In tangent face mode, first select the anchor face—the face you will not modify—then select the second face and taper it at an angle." },
      { time: "12:46", text: "By hitting Tab, I can type a specific angle. Here I'll set it to 15 degrees." },
      { time: "12:55", text: "With picked face mode, you pick one face, then the other face, and it tapers the face like that." },
      { time: "13:25", text: "The next tool I'm showing you is the deform tool. It's located here and it has several modes." },
      { time: "13:40", text: "I'm going to take this rectangle and show a few. First is twist solid mode." },
      { time: "13:48", text: "Select the mode, then select the object, choose a point—I'll pick the center—then I can rotate the object." },
      { time: "14:04", text: "Here it's at 90 degrees." },
      { time: "14:17", text: "Keep in mind the more extreme the twist, the harder it can be for your computer to compute, so I'll keep it at 90 degrees." },
      { time: "14:36", text: "Now we've twisted the rectangle to create this shape. I can still modify the height in the Object Info Palette." },
      { time: "14:57", text: "I'll set this to six feet, then I'll go to front view and adjust it closer to zero." },
      { time: "15:13", text: "Next, I'll show bend solid mode. With bend solid, we can use finite mode where you bend from a point, like this." },
      { time: "15:44", text: "Or symmetric mode, where it bends from both sides." },
      { time: "16:03", text: "The last mode I'll share is bulge mode. Select the object, pick a point, and bulge it out like that." },
      { time: "16:50", text: "The last 3D modeling tool I'm going to show you is the shell solid tool. You can access it by hitting Shift+S." },
      { time: "17:02", text: "With this organic shape we created, let's say we want to make it like a vase." },
      { time: "17:18", text: "I'll select the shell tool, choose this face, and set the thickness to a half inch." },
      { time: "17:29", text: "With the face selected, hit the check mark. Now it's added thickness and hollowed out the object." },
      { time: "17:48", text: "You can also do this with a simple extrude—select the face and shell it to add thickness." },
      { time: "18:14", text: "This concludes our Vectorworks tutorial. If you have any questions, please feel free to ask. Thank you." },
    ],
    relatedResources: [
      { type: "Documentation", title: "Vectorworks 3D Modeling Guide", url: "https://www.vectorworks.net/" },
      { type: "Video", title: "Advanced 3D Modeling Techniques", url: "https://www.youtube.com/vectorworks" },
      { type: "Community", title: "Vectorworks Forum - 3D Modeling", url: "https://forum.vectorworks.net/" },
    ],
    relatedTutorials: [
      { title: "Vectorworks Tutorial: 3D Modeling Basics", slug: "3d-modeling-basics" },
      { title: "Vectorworks Tutorial: Basics of Textures", slug: "basics-of-textures" },
      { title: "Vectorworks Tutorial: Hybrid Symbols", slug: "hybrid-symbols" },
    ],
  },
  "creating-24x36-pdfs": {
    id: 16,
    title: "Vectorworks Tutorial: Creating 24x36 PDFs Without a Plotter",
    slug: "creating-24x36-pdfs",
    youtubeId: "Gd9_hB5USkQ",
    category: "2d-drafting",
    difficulty: "Beginner",
    duration: "3:28",
    publishDate: "Feb 10, 2021",
    description: "Learn how to export large format sheets (24x36) to PDF when you don't have Adobe PDF or a plotter connected to your computer.",
    overview: "This quick tutorial demonstrates the essential workflow for exporting large format sheets to PDF without requiring Adobe PDF or a physical plotter connection. You'll learn how to configure page setup to recognize 24x36 dimensions, understand how Vectorworks handles page breaks for standard letter-size printers, and use the Publish command with the correct settings to export your entire sheet as a single PDF page. This technique is critical for students and professionals who need to submit or share large format drawings but don't have access to professional printing equipment.",
    learningObjectives: [
      "Create a new sheet layer and configure it for 24x36 output",
      "Access and configure Page Setup for large format sheets without a plotter",
      "Understand how Vectorworks displays page breaks for standard printers",
      "Use the 'Export the whole printable area to one page' option in Publish settings",
      "Successfully export a single 24x36 PDF from multiple letter-size pages",
      "Avoid common pitfalls that result in multi-page PDFs instead of single sheets",
    ],
    keyConcepts: [
      {
        title: "PAGE SETUP WITHOUT A PLOTTER",
        content: "When you don't have Adobe PDF or a plotter connected, Vectorworks defaults to letter-size (8.5x11) pages. Access Edit > Page Setup, select your default PDF writer (e.g., Microsoft Print to PDF), and uncheck 'Choose available print sizes.' Then select Arch D (24x36) from the Pages section. Vectorworks will show the sheet as 3.272 pages horizontally and 2.8235 pages vertically—this represents how many letter-size pages would tile to cover your 24x36 sheet.",
      },
      {
        title: "UNDERSTANDING PAGE BREAKS",
        content: "Enable 'Show page breaks' in Page Setup to visualize how Vectorworks divides your 24x36 sheet into letter-size pages. Gray dashed lines represent individual 8.5x11 pages arranged in a grid. This helps you understand what Vectorworks sees as the 'auto page' layout. Turn off page breaks before publishing to avoid confusion during layout work.",
      },
      {
        title: "PUBLISH TO PDF WORKFLOW",
        content: "Go to File > Publish, add your sheet layer, and ensure output format is set to PDF (not DWG or image). In Options, the critical setting is 'Export the whole printable area to one page'—this merges all letter-size tiles into a single 24x36 PDF. If you select 'Pages' or 'All pages' instead, Vectorworks will export individual letter-size pages, resulting in a multi-page PDF instead of one large sheet.",
      },
      {
        title: "LAYOUT WORKFLOW",
        content: "After configuring page setup, lay out your viewports, add your title block, and build your sheet content as normal. The page setup configuration only affects how Vectorworks exports the final PDF—it doesn't change how you work on the sheet. Think of it as a 'print driver workaround' that tells Vectorworks to treat multiple letter pages as one large sheet during export.",
      },
    ],
    proTips: [
      "Always uncheck 'Choose available print sizes' in Page Setup when working without a plotter—this unlocks larger format options",
      "Use 'Show page breaks' temporarily to verify your sheet is correctly divided, then turn it off to avoid visual clutter",
      "The 'Export the whole printable area to one page' option is the key setting—memorize this to avoid multi-page exports",
      "You can use this technique for any large format size (30x42, 36x48, etc.), not just 24x36—just select the appropriate Arch size",
      "Save your Publish settings as a named set if you export sheets regularly—this saves time on future exports",
      "If your PDF comes out as multiple pages, you likely forgot to select 'Export the whole printable area to one page'—go back and check Options",
      "This workflow works with any PDF writer (Microsoft Print to PDF, CutePDF, etc.)—you don't need Adobe Acrobat",
      "The page count display (3.272 x 2.8235) is normal—it's just Vectorworks calculating how many letter pages fit in 24x36",
    ],
    shortcuts: [
      { keys: "File > Publish", action: "Open Publish dialog to export sheets to PDF" },
      { keys: "Edit > Page Setup", action: "Configure page size and print settings" },
    ],
    commonPitfalls: [
      "Forgetting to uncheck 'Choose available print sizes'—results in only letter-size options being available",
      "Selecting 'Pages' or 'All pages' instead of 'Export the whole printable area to one page'—creates multi-page PDFs",
      "Not verifying the Arch D (24x36) selection in Page Setup—may result in incorrect sheet dimensions",
      "Leaving 'Show page breaks' enabled during layout work—creates visual confusion with dashed lines everywhere",
      "Assuming you need Adobe Acrobat or a plotter to export large format sheets—this workaround works with any PDF writer",
      "Not saving Publish settings as a named set—wastes time reconfiguring options for every export",
      "Confusing the page count display (3.272 x 2.8235) with an error—this is normal and represents letter-page tiling",
    ],
    transcript: [
      { time: "0:06", text: "Hello, this is Brandon PT Davis. I'm just going to quickly show you how to create a 24 by 36 page if you don't have Adobe PDF or if you are not connected to a plotter on your computer." },
      { time: "0:26", text: "So what I'm going to do is I'm going to start with the sheet layer. I'm going to create a new sheet layer. I'm just going to leave it as sheet layer one, sheet title for the example." },
      { time: "0:37", text: "So currently I have a 24 by 36 page because I do have Adobe, but a way around this if you don't is we're going to go to Edit and then Page Setup." },
      { time: "0:50", text: "If we're on Microsoft Print to PDF or whatever default PDF writer you have, and it's set to letter size, it doesn't really matter." },
      { time: "1:05", text: "Then we're going to uncheck 'Choose available print sizes.' Right now Vectorworks is showing the page as one sheet. You can select Arch D, which is 24 by 36." },
      { time: "1:23", text: "In the pages section, horizontally it's 3.272 and vertically it's 2.8235. To show you what that means, I'm going to turn on 'Show page breaks.'" },
      { time: "1:37", text: "I'll press OK and press OK again. Each gray dashed line represents the pages from what Vectorworks thinks your auto page is." },
      { time: "1:52", text: "So these are a series of 8.5 by 11 pages and how they're lined up on the grid." },
      { time: "1:59", text: "Now I'm going to go back to Edit, Page Setup, and uncheck 'Show page breaks' and press OK." },
      { time: "2:04", text: "Now I'm just going to draw an X through the center as an example, but normally you would lay out your viewports, add your title block, and build everything you want on the page." },
      { time: "2:20", text: "Then we go to File and Publish. I'm going to add the new page that we just created." },
      { time: "2:31", text: "And right now it's publishing to PDF. You can change it to DWG or an image, but we want PDF." },
      { time: "2:40", text: "Select Options. Make sure 'Export the whole printable area to one page' is selected." },
      { time: "2:49", text: "If you select 'Pages' or 'All pages,' it may export individual pages instead." },
      { time: "2:57", text: "So select 'Export the whole printable area,' press OK, and then press Publish." },
      { time: "3:04", text: "I'm not going to save the set for this example. I'll leave it as untitled two." },
      { time: "3:11", text: "And what you'll see is one singular 24 by 36 page." },
      { time: "3:18", text: "So if you're having issues with printing your RD plates, that's basically the Vectorworks solution. If you have any other questions, let me know. Thank you." },
    ],
    relatedResources: [
      { type: "Documentation", title: "Vectorworks Publishing Guide", url: "https://www.vectorworks.net/" },
      { type: "Video", title: "Advanced PDF Export Techniques", url: "https://www.youtube.com/vectorworks" },
      { type: "Community", title: "Vectorworks Forum - Printing & Publishing", url: "https://forum.vectorworks.net/" },
    ],
    relatedTutorials: [
      { title: "Vectorworks Tutorial: Sheet Layers", slug: "sheet-layers" },
      { title: "Vectorworks Tutorial: 2D Annotations and Dimensioning", slug: "2d-annotations-dimensioning" },
      { title: "Vectorworks Tutorial: Navigating the User Interface", slug: "navigating-user-interface" },
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

  const formatDuration = (duration: string | number) => {
    // If already a string like "21:14", return as-is
    if (typeof duration === 'string') return duration;
    // Otherwise convert seconds to MM:SS format
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
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
              {formatDate(tutorial.publishDate)}
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
