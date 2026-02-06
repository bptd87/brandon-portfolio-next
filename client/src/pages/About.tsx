import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, Briefcase, GraduationCap, Mail, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
            {/* Profile Image Placeholder */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Profile Photo
              <Footer />
    </div>
            <Footer />
    </div>

            {/* Bio */}
            <div>
              <h1 className="mb-6">Brandon PT Davis</h1>
              <p className="text-xl text-muted-foreground mb-4">
                Scenic Designer | ART × TECHNOLOGY × DESIGN
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Based in [Location]</span>
                <Footer />
    </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@brandonptdavis.com</span>
                <Footer />
    </div>
              <Footer />
    </div>
              
              <Separator className="my-6" />
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed mb-4">
                  Brandon PT Davis is a scenic designer whose work bridges the intersection of art, technology, and design. 
                  With a passion for creating immersive theatrical environments, Brandon brings stories to life through 
                  innovative spatial design and technical excellence.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  His design philosophy centers on the belief that every space tells a story. By combining traditional 
                  scenic design principles with cutting-edge technology and digital tools, Brandon crafts environments 
                  that enhance narrative and deepen audience engagement.
                </p>
              <Footer />
    </div>
            <Footer />
    </div>
          <Footer />
    </div>
        <Footer />
    </div>
      </section>

      {/* Education */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-semibold">Education</h2>
          <Footer />
    </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Master of Fine Arts in Scenic Design</h3>
                  <p className="text-muted-foreground mb-1">[University Name]</p>
                  <p className="text-sm text-muted-foreground">[Year]</p>
                <Footer />
    </div>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Bachelor of Arts in Theatre Design</h3>
                  <p className="text-muted-foreground mb-1">[University Name]</p>
                  <p className="text-sm text-muted-foreground">[Year]</p>
                <Footer />
    </div>
              <Footer />
    </div>
            </CardContent>
          </Card>
        <Footer />
    </div>
      </section>

      {/* Experience */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-semibold">Professional Experience</h2>
          <Footer />
    </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Freelance Scenic Designer</h3>
                <p className="text-muted-foreground mb-4">2020 - Present</p>
                <p className="text-foreground/90 leading-relaxed">
                  Designing for regional theatres, opera companies, and educational institutions. 
                  Specializing in innovative scenic solutions that blend traditional craftsmanship 
                  with modern technology.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Resident Designer</h3>
                <p className="text-muted-foreground mb-4">[Theatre Company] | [Years]</p>
                <p className="text-foreground/90 leading-relaxed">
                  Led scenic design for multiple productions per season, collaborating with directors, 
                  lighting designers, and technical staff to create cohesive visual storytelling.
                </p>
              </CardContent>
            </Card>
          <Footer />
    </div>
        <Footer />
    </div>
      </section>

      {/* Awards & Recognition */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-semibold">Awards & Recognition</h2>
          <Footer />
    </div>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Excellence in Scenic Design Award</p>
                    <p className="text-sm text-muted-foreground">[Organization] | [Year]</p>
                  <Footer />
    </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Best Production Design</p>
                    <p className="text-sm text-muted-foreground">[Festival/Competition] | [Year]</p>
                  <Footer />
    </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">Emerging Designer Fellowship</p>
                    <p className="text-sm text-muted-foreground">[Organization] | [Year]</p>
                  <Footer />
    </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        <Footer />
    </div>
      </section>

      {/* Skills */}
      <section className="container py-16 pb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-8">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Design Software</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Vectorworks Spotlight</li>
                  <li>• SketchUp Pro</li>
                  <li>• Adobe Creative Suite</li>
                  <li>• AutoCAD</li>
                  <li>• Rhino 3D</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Technical Drafting</li>
                  <li>• 3D Modeling & Rendering</li>
                  <li>• Model Building</li>
                  <li>• Projection Design</li>
                  <li>• Scenic Painting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Design Specialties</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Theatrical Scenic Design</li>
                  <li>• Opera & Musical Theatre</li>
                  <li>• Immersive Environments</li>
                  <li>• Site-Specific Design</li>
                  <li>• Digital Scenography</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Collaboration</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Director Collaboration</li>
                  <li>• Production Management</li>
                  <li>• Budget Planning</li>
                  <li>• Technical Direction</li>
                  <li>• Cross-Disciplinary Teams</li>
                </ul>
              </CardContent>
            </Card>
          <Footer />
    </div>
        <Footer />
    </div>
      </section>
    <Footer />
    </div>
  );
}
