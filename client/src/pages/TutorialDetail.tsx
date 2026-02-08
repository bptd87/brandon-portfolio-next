import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Calendar, TrendingUp, Lightbulb, AlertCircle, Keyboard, ArrowRight } from "lucide-react";
import { useParams, Link } from "wouter";

export default function TutorialDetail() {
  const params = useParams();
  const slug = params.slug;

  // This will be replaced with database query
  const tutorial = {
    id: 1,
    slug: "navigating-user-interface",
    title: "Vectorworks Tutorial: Navigating the User Interface for Scenic Designers",
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
      { time: "0:00", speaker: "Brandon PT Davis", text: "[Music]" },
      { time: "0:05", speaker: "Brandon PT Davis", text: "Hello, this is Brandon PT Davis. I'm a theatrical scenic designer, and today I'm going to share with you a Vectorworks tutorial about the user interface." },
      { time: "0:17", speaker: "Brandon PT Davis", text: "We're going to start off by opening the software. I have the software here on my desktop." },
      { time: "0:23", speaker: "Brandon PT Davis", text: "As you notice, the Vectorworks software takes time to open. This is normal because the software is very large." },
      { time: "0:32", speaker: "Brandon PT Davis", text: "As the software opens, you'll notice that the Vectorworks template user template here is set as a default that says 'Do not use the sheet.' It recommends to close the file, click the file, and select an existing file or open a template." },
      { time: "0:53", speaker: "Brandon PT Davis", text: "My students at UTEP have been provided with a specific template for them to learn the software, so now I'm going to close this file." },
      { time: "1:04", speaker: "Brandon PT Davis", text: "To open the file, I'm going to go to File > New, and under here I have the UTEP Basics template. I'm going to press OK." },
      { time: "1:18", speaker: "Brandon PT Davis", text: "Now that we have the proper Vectorworks template installed, I'm going to speak with you about the Vectorworks user interface." },
      { time: "1:25", speaker: "Brandon PT Davis", text: "Like many software programs, the Vectorworks user interface has a menu bar across the top—items such as File, Edit, Tools, Text, View, Window, Cloud, and Help." },
      { time: "1:39", speaker: "Brandon PT Davis", text: "You may have seen in other software programs Vectorworks will use these similar but also differently than other programs you may be used to. We will talk specifically about these tools, these menu items, as we move forward." },
      { time: "1:55", speaker: "Brandon PT Davis", text: "We also have the Modify, Model, Spotlight, and Event menu items. These items are more specific to Vectorworks." },
      { time: "2:09", speaker: "Brandon PT Davis", text: "On the left side here, we have the Basic Tool Palette. The Basic Tool Palette is a combination of tools that you use most frequently throughout the Vectorworks software. This would include things like the square tool, 2D line tool, measuring tools, and annotations. We'll speak more specifically about the basic tool set in the next video." },
      { time: "2:32", speaker: "Brandon PT Davis", text: "The Attributes Palette allows you to edit and modify specific attributes within the 2D objects that you are creating in Vectorworks." },
      { time: "2:44", speaker: "Brandon PT Davis", text: "The Tool Set Palette—this palette is very specific to the Vectorworks workspace that you're using. There is a variety of tools that you can use throughout the Vectorworks software, and we will speak specifically to how they apply to theatrical design during the course of these tutorials." },
      { time: "3:01", speaker: "Brandon PT Davis", text: "We also have a Snapping Palette. A Snapping Palette modifies the way that you interact with the object through Vectorworks. We can move the Snapping Palette right now into the top left corner. We can also change where we have all the palettes in Vectorworks so that we can work in our most effective manner. My preference is to have the workspace configured as shown here." },
      { time: "3:36", speaker: "Brandon PT Davis", text: "To the right side, we have the Object Info Palette. The Object Info Palette provides information about objects that you're working with in Vectorworks. I will draw a rectangle to show you some of the functionality of the Object Info Palette." },
      { time: "3:53", speaker: "Brandon PT Davis", text: "So here we can see class, layer, and plane information, as well as width and height. We can modify the rotation of the object as well. There's also data information, and if we're working with 3D objects, we can modify the textures that are applied to the object through the window render options in the Object Info Palette." },
      { time: "4:18", speaker: "Brandon PT Davis", text: "Below the Object Info Palette is the Navigation Palette. The Navigation Palette is a way to navigate through many aspects of the software. We have our classes here, layers, sheet layers, viewports, saved views, and file references." },
      { time: "4:50", speaker: "Brandon PT Davis", text: "On the top, we have the Resource Manager. The Resource Manager is a way to store lots of information throughout Vectorworks. Resource Manager items include gradients, hatches, images, line types, materials, record formats, Renderworks backgrounds, Renderworks styles, Renderworks textures, a resource folder, roof styles, script, sketch styles, slab styles, text style, tiles, wall style, and worksheet." },
      { time: "5:29", speaker: "Brandon PT Davis", text: "At the center, we have the Vectorworks workspace. This large square in the center—the Vectorworks workspace by default is in Top/Plan view. Top/Plan view is also the 2D view." },
      { time: "5:45", speaker: "Brandon PT Davis", text: "We also have a ruler on the X and Y axis, and at the center we have zero, zero. In order to explain the X, Y, and Z axis and our views, I will show you these arrow symbols that I've created." },
      { time: "6:04", speaker: "Brandon PT Davis", text: "Thinking of the green North and South as the Y-axis, and red East and West as the X-axis. At the center and the ruler, we have zero, zero. It is recommended that your models be as close and/or on zero, zero as possible when creating your model." },
      { time: "6:31", speaker: "Brandon PT Davis", text: "Straying too far away from zero, zero will affect Vectorworks' ability to render the view in perspective." },
      { time: "6:48", speaker: "Brandon PT Davis", text: "Now I will go to a Right Isometric view and show you the axis. We have the green axis—the North and South as our Y-axis. The red East and West as our X-axis. And the Z-axis is up and down." },
      { time: "7:08", speaker: "Brandon PT Davis", text: "If we look at the ruler again from this view, we have East as positive numbers—four inches, eight inches, further on it's infinite. If we look towards the West from zero, we go into negative numbers—negative four, et cetera. The same applies both to North and South and the Z-axis up and down—negative, positive numbers." },
      { time: "7:47", speaker: "Brandon PT Davis", text: "The View Bar across the top offers some of the same functionality as the Navigation Palette. Here we can toggle through the classes and change the active class that we're using. We can toggle through our design and sheet layers. We can also change our screen and layer plane views. Saved views will be stored here." },
      { time: "8:19", speaker: "Brandon PT Davis", text: "These items here affect how you zoom into Vectorworks, so I can zoom to page or I can zoom to the object. We can also zoom in with this functionality. This is a numeric way to view the zoom functions." },
      { time: "8:49", speaker: "Brandon PT Davis", text: "These are the working plane views, which we will talk more about when we get into 3D. But we can toggle through the views using this slider. So here is top, right, left. You can also use the number pad and change the views as well." },
      { time: "9:22", speaker: "Brandon PT Davis", text: "This icon here will change to your previous and next views that you are looking at within your Vectorworks file." },
      { time: "9:35", speaker: "Brandon PT Davis", text: "This icon is the Rotate Plan. This would be used if you were working in 3D and wanted to adjust the ground plan to a different view." },
      { time: "9:50", speaker: "Brandon PT Davis", text: "You can also modify the perspective with this dropdown, and the render settings can be modified with this dropdown." },
      { time: "10:02", speaker: "Brandon PT Davis", text: "The View Bar located here will be changed depending on the tools that you have accessed." },
      { time: "10:12", speaker: "Brandon PT Davis", text: "And this palette here will give you access to shortcuts from both document preferences and Vectorworks preferences." },
      { time: "10:22", speaker: "Brandon PT Davis", text: "This concludes the Vectorworks tutorial on user interface. If you have any questions, please let me know. Thank you." },
    ],

    relatedTutorials: [
      { title: "Vectorworks 2: Classes and Layers", slug: "classes-and-layers" },
      { title: "Vectorworks 3: Basic 2D Tools", slug: "basic-2d-tools" },
      { title: "Vectorworks 5: 2D Theater Ground Plan", slug: "2d-theater-ground-plan" },
    ],
  };

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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Tutorial Header */}
      <section className="py-12 border-b border-border">
        <div className="container max-w-5xl">
          <Link href="/studio/tutorials" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to Tutorials
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30 border">
              {tutorial.category}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {tutorial.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(tutorial.duration)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(tutorial.uploadDate)}
            </Badge>
          </div>

          <h1 className="mb-6">{tutorial.title}</h1>
        </div>
      </section>

      {/* Video Embed */}
      <section className="py-12 bg-black border-b border-border">
        <div className="container max-w-5xl">
          <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
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

      {/* What You'll Learn */}
      <section className="py-12 border-b border-border">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
          <ul className="space-y-3">
            {tutorial.learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 border-b border-border bg-muted/30">
        <div className="container max-w-5xl">
          <div className="prose prose-invert max-w-none">
            {tutorial.overview.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Key Concepts */}
      <section className="py-12 border-b border-border">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">Key Concepts</h2>
          <div className="space-y-6">
            {tutorial.keyConcepts.map((concept, index) => (
              <Card key={index} className="border-2 border-blue-500/30 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <h3 className="font-bold text-lg">{concept.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed ml-8">
                    {concept.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="py-12 border-b border-border bg-muted/30">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">Pro Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tutorial.proTips.map((tip, index) => (
              <Card key={index} className="border-orange-500/30 bg-orange-500/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold text-orange-500 block mb-2">PRO TIP</span>
                    {tip}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="py-12 border-b border-border">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">Quick Reference</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Shortcuts */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-purple-500" />
                Essential Shortcuts
              </h3>
              <div className="space-y-3">
                {tutorial.shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-start gap-4 p-3 bg-muted/50 rounded-lg">
                    <code className="text-sm font-mono text-purple-500 font-semibold">
                      {shortcut.keys}
                    </code>
                    <span className="text-sm text-muted-foreground text-right">
                      {shortcut.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Pitfalls */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Common Pitfalls
              </h3>
              <ul className="space-y-2">
                {tutorial.commonPitfalls.map((pitfall, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-red-500 flex-shrink-0">•</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transcript */}
      <section className="py-12 border-b border-border bg-muted/30">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">Transcript</h2>
          <div className="space-y-4">
            {tutorial.transcript.map((entry, index) => (
              <div key={index} className="flex gap-4">
                <span className="text-sm font-mono text-blue-500 flex-shrink-0 w-16">
                  {entry.time}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tutorials */}
      <section className="py-16">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold mb-6">Keep Learning</h2>
          <p className="text-muted-foreground mb-8">
            Build on what you've learned with related tutorials that expand these core concepts.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {tutorial.relatedTutorials.map((related, index) => (
              <Link key={index} href={`/studio/tutorials/${related.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/50 group">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2 group-hover:text-blue-500 transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-blue-500 group-hover:gap-3 transition-all">
                      Watch Tutorial <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
