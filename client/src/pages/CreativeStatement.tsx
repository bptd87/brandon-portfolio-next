import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function CreativeStatement() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8">Creative Statement</h1>
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed">[Your creative statement will go here]</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
