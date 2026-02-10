import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CV() {
  return (
    <>
      <Header />
      
      <section className="min-h-screen bg-background pt-20 pb-20">
        <div className="container max-w-6xl">
          {/* About Navigation */}
          <AboutNav />

          {/* Hero */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">CURRICULUM VITAE</p>
            <div className="flex items-end justify-between gap-8 flex-wrap">
              <div>
                <h1 className="text-5xl md:text-7xl font-serif mb-4 leading-tight">Curriculum Vitae</h1>
                <p className="text-xl text-foreground/70 max-w-3xl leading-relaxed">
                  Complete academic and professional history including education, teaching experience, publications, and comprehensive production credits.
                </p>
              </div>
              <Button size="lg" className="gap-2" asChild>
                <a href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/mSMkRDmbSOQtUykO.pdf" download="BrandonPTDavis-CV-2025.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="w-5 h-5" />
                  Download CV
                </a>
              </Button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-2xl overflow-hidden p-8">
            <div className="aspect-[8.5/11] w-full bg-background/50 rounded-lg overflow-hidden">
              <iframe
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/mSMkRDmbSOQtUykO.pdf"
                className="w-full h-full"
                title="Brandon PT Davis - Curriculum Vitae"
              />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-foreground/60 mb-4">
                If the PDF doesn't display above, you can download it directly or view it in a new tab.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button variant="outline" asChild>
                  <a href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/mSMkRDmbSOQtUykO.pdf" download="BrandonPTDavis-CV-2025.pdf">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/mSMkRDmbSOQtUykO.pdf" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
