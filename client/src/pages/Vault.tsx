import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Lock, Archive, Clock } from "lucide-react";
import { SEO } from "@/components/SEO";

export default function Vault() {
  return (
    <>
      <SEO 
        title="Vault - Coming Soon"
        description="The Vault is currently under construction. Check back soon for exclusive content and resources."
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722] to-[#00E5FF] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-card border-2 border-border rounded-full p-8">
                  <Archive className="w-16 h-16 text-foreground" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
              The Vault
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light">
              Exclusive content and resources
            </p>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF5722]/10 to-[#00E5FF]/10 border border-border rounded-full mb-12">
              <Clock className="w-5 h-5 text-[#FF5722]" />
              <span className="font-bold text-sm tracking-wide">COMING SOON</span>
            </div>

            {/* Description */}
            <div className="space-y-4 text-muted-foreground max-w-xl mx-auto">
              <p className="text-lg">
                The Vault is currently under construction. This exclusive space will house premium resources, behind-the-scenes content, and curated materials for scenic designers and theatre professionals.
              </p>
              <p className="text-base">
                Check back soon for access to:
              </p>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                  <span>Exclusive design templates and resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                  <span>Behind-the-scenes project documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                  <span>Premium tutorials and masterclasses</span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#00E5FF] mt-0.5 flex-shrink-0" />
                  <span>Curated industry insights and tools</span>
                </li>
              </ul>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
