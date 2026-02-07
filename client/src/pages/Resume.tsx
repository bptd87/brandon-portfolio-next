import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Resume() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Resume / CV</h1>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-foreground/90">[Your resume/CV content will go here]</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
