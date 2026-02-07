import Header from "@/components/Header";
import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, Briefcase, GraduationCap, Mail, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Profile Photo
              </div>
            </div>

            <div>
              <h1 className="mb-6">Brandon PT Davis</h1>
              <p className="text-xl text-muted-foreground mb-4">
                Scenic Designer | ART × TECHNOLOGY × DESIGN
              </p>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Based in [Location]</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@brandonptdavis.com</span>
                </div>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-semibold">Education</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Master of Fine Arts in Scenic Design</h3>
                  <p className="text-muted-foreground mb-1">[University Name]</p>
                  <p className="text-sm text-muted-foreground">[Year]</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Bachelor of Arts in Theatre Design</h3>
                  <p className="text-muted-foreground mb-1">[University Name]</p>
                  <p className="text-sm text-muted-foreground">[Year]</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
