"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Header from "@/components/Header";
import SearchOverlay from "@/components/SearchOverlay";
import { SEO } from "@/components/SEO";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);
  const initialQuery = searchParams.get("q") || "";

  useEffect(() => {
    setOpen(true);
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title="Search the Site | Brandon PT Davis"
        description="Search projects, articles, collaborators, tutorials, and design credits across the Brandon PT Davis site."
        url="https://www.brandonptdavis.com/search"
        keywords="site search, scenic design projects, collaborators, articles, tutorials, Brandon PT Davis"
      />

      <Header />

      <main>
        <SearchOverlay
          open={open}
          initialQuery={initialQuery}
          variant="page"
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/");
              }
            }
          }}
        />
      </main>
    </div>
  );
}
