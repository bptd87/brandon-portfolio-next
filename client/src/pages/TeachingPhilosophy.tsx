import Header from "@/components/Header";
import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TeachingPhilosophy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Teaching Philosophy</h1>
          
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed mb-6">
                  [Your teaching philosophy content will go here. This is a placeholder for your actual teaching philosophy statement.]
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Core Principles</h2>
                <p className="text-foreground/90 leading-relaxed mb-6">
                  [Describe your core teaching principles and methodologies.]
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Student-Centered Learning</h2>
                <p className="text-foreground/90 leading-relaxed mb-6">
                  [Explain your approach to student-centered learning and mentorship.]
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Integration of Technology</h2>
                <p className="text-foreground/90 leading-relaxed">
                  [Discuss how you integrate technology into your teaching practice.]
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
