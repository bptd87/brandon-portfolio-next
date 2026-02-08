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
      uploadDate: "2020-08-15",
      
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
    },
  };

  const tutorial = slug ? tutorials[slug] : null;

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tutorial Not Found</h1>
          <Link href="/studio/tutorials">
            <a className="text-[#2196F3] hover:underline">← Back to Tutorials</a>
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
                  {tutorial.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="w-1.5 h-1.5 bg-[#2196F3] mt-2 flex-shrink-0 group-hover:w-3 transition-all"></div>
                      <span className="text-foreground leading-relaxed">{objective}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#2196F3] pt-8">
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-foreground">Tutorial Overview</h3>
                  <div className="space-y-4">
                    {tutorial.overview.split('\n\n').map((paragraph, index) => (
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
                  {tutorial.keyConcepts.map((concept, index) => (
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
                    {tutorial.proTips.map((tip, index) => (
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
                      {tutorial.shortcuts.map((shortcut, index) => (
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
                      {tutorial.commonPitfalls.map((pitfall, index) => (
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
                  {tutorial.transcript.map((entry, index) => (
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
                  {tutorial.relatedResources.map((resource, index) => (
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
                    {tutorial.relatedTutorials.map((related, index) => (
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
