import { useState } from "react";
import { Link } from "wouter";
import { X, ChevronDown } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [workOpen, setWorkOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-background border-l border-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-black tracking-tight">
            <span className="text-[#FF5722]">BRANDON</span> PT DAVIS
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
          {/* Work Dropdown */}
          <div>
            <button
              onClick={() => setWorkOpen(!workOpen)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-foreground/5 transition-colors text-left font-bold"
            >
              <span>WORK</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  workOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {workOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/projects?discipline=scenic_design"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors"
                >
                  Scenic Design
                </Link>
                <Link
                  href="/projects?discipline=experiential_design"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] transition-colors"
                >
                  Experiential Design
                </Link>
                <Link
                  href="/projects?discipline=rendering"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#FF1744]/10 hover:text-[#FF1744] transition-colors"
                >
                  Rendering
                </Link>
                <Link
                  href="/projects?discipline=scenic_models"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors"
                >
                  Scenic Models
                </Link>
              </div>
            )}
          </div>

          {/* News */}
          <Link
            href="/news"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg hover:bg-foreground/5 transition-colors font-bold"
          >
            NEWS
          </Link>

          {/* About Dropdown */}
          <div>
            <button
              onClick={() => setAboutOpen(!aboutOpen)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-foreground/5 transition-colors text-left font-bold"
            >
              <span>ABOUT</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  aboutOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {aboutOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/about"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] transition-colors"
                >
                  About Brandon
                </Link>
                <Link
                  href="/resume"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#FF1744]/10 hover:text-[#FF1744] transition-colors"
                >
                  Resume
                </Link>
                <Link
                  href="/teaching-philosophy"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors"
                >
                  Teaching Philosophy
                </Link>
                <Link
                  href="/creative-statement"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#00E5FF]/10 hover:text-[#00E5FF] transition-colors"
                >
                  Creative Statement
                </Link>
              </div>
            )}
          </div>

          {/* Articles */}
          <Link
            href="/articles"
            onClick={onClose}
            className="block py-3 px-4 rounded-lg hover:bg-foreground/5 transition-colors font-bold"
          >
            ARTICLES
          </Link>

          {/* Studio Dropdown */}
          <div>
            <button
              onClick={() => setStudioOpen(!studioOpen)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-foreground/5 transition-colors text-left font-bold"
            >
              <span>STUDIO</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  studioOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {studioOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/studio/tutorials"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#9C27B0]/10 hover:text-[#9C27B0] transition-colors"
                >
                  Tutorials
                </Link>
                <Link
                  href="/studio"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#9C27B0]/10 hover:text-[#9C27B0] transition-colors"
                >
                  App Studio
                </Link>
                <Link
                  href="/vault"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#9C27B0]/10 hover:text-[#9C27B0] transition-colors"
                >
                  Vault
                </Link>
                <Link
                  href="/studio/directory"
                  onClick={onClose}
                  className="block py-2 px-4 rounded-lg hover:bg-[#9C27B0]/10 hover:text-[#9C27B0] transition-colors"
                >
                  Scenic Directory
                </Link>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <Link
            href="/contact"
            onClick={onClose}
            className="block mt-6 py-4 px-6 rounded-full bg-[#FF5722] text-white text-center font-black hover:bg-[#FF5722]/90 hover:scale-105 transition-all"
          >
            CONTACT
          </Link>
        </nav>
      </div>
    </>
  );
}
