"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { 
  Database, Search, Copy, Check, ChevronLeft, ChevronRight, ArrowLeft,
  Armchair, Table, Bed, Package, Layers,
  Monitor, Store, Users, Home, Ruler
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { copyTextToClipboard } from "@/lib/clipboard";
import { Link } from "wouter";

interface DimensionItem {
  name: string;
  category: string;
  width?: string;
  depth?: string;
  height?: string;
  diameter?: string;
  notes?: string;
  jargon?: string;
  wireframe?: string;
}

type CategoryKey = 
  | 'All Categories'
  | 'Furniture - Seating'
  | 'Furniture - Tables'
  | 'Furniture - Storage'
  | 'Furniture - Beds'
  | 'Theatre - Flats'
  | 'Theatre - Platforms'
  | 'Theatre - Doors'
  | 'Theatre - Stairs'
  | 'Event - Tables'
  | 'Event - Staging'
  | 'Event - Seating'
  | 'Event - Linens'
  | 'Experiential - Exhibition'
  | 'Experiential - AV & Tech'
  | 'Experiential - Activation'
  | 'Architecture - Circulation'
  | 'Architecture - Heights'
  | 'Architecture - Counters';

const CATEGORY_ICONS: Record<string, any> = {
  'All Categories': Database,
  'Furniture - Seating': Armchair,
  'Furniture - Tables': Table,
  'Furniture - Storage': Package,
  'Furniture - Beds': Bed,
  'Theatre - Flats': Layers,
  'Theatre - Platforms': Package,
  'Theatre - Doors': Layers,
  'Theatre - Stairs': Layers,
  'Event - Tables': Table,
  'Event - Staging': Store,
  'Event - Seating': Armchair,
  'Event - Linens': Table,
  'Experiential - Exhibition': Store,
  'Experiential - AV & Tech': Monitor,
  'Experiential - Activation': Users,
  'Architecture - Circulation': Users,
  'Architecture - Heights': Home,
  'Architecture - Counters': Table,
};

const CATEGORIES: CategoryKey[] = [
  'All Categories',
  'Experiential - Exhibition',
  'Experiential - AV & Tech',
  'Experiential - Activation',
  'Furniture - Seating',
  'Furniture - Tables',
  'Furniture - Storage',
  'Furniture - Beds',
  'Theatre - Flats',
  'Theatre - Platforms',
  'Theatre - Doors',
  'Theatre - Stairs',
  'Event - Tables',
  'Event - Staging',
  'Event - Seating',
  'Event - Linens',
  'Architecture - Circulation',
  'Architecture - Heights',
  'Architecture - Counters',
];

const DIMENSIONS: DimensionItem[] = [
  // EXPERIENTIAL - EXHIBITION
  { name: 'Standard Booth (10\'x10\')', category: 'Experiential - Exhibition', width: '10\'-0"', depth: '10\'-0"', height: '8\'-0"', notes: 'Standard inline booth space', wireframe: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/dimension-reference/myh0xvxdytmwuiq5kj2ymf-img-1_1770588401000_na1fn_d2lyzwzyyw1llwjvb3roltewedewlte2edk-6248c677a9-dc9d0e62.png' },
  { name: 'Standard Booth (10\'x20\')', category: 'Experiential - Exhibition', width: '20\'-0"', depth: '10\'-0"', height: '8\'-0"', notes: 'Double inline booth', wireframe: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/dimension-reference/myh0xvxdytmwuiq5kj2ymf-img-2_1770588384000_na1fn_d2lyzwzyyw1llwjvb3roltewediwlte2edk-d2f8bfc4f5-f2d6a9d2.png' },
  { name: 'Standard Booth (20\'x20\')', category: 'Experiential - Exhibition', width: '20\'-0"', depth: '20\'-0"', notes: 'Island booth, height often restricted to 16\'-20\'' },
  { name: 'BeMatrix Frame (1x2.5m)', category: 'Experiential - Exhibition', width: '992mm (39.06")', height: '2480mm (97.64")', depth: '62mm', notes: 'Industry standard modular frame system' },
  { name: 'BeMatrix Frame (1x1m)', category: 'Experiential - Exhibition', width: '992mm (39.06")', height: '992mm (39.06")', depth: '62mm' },
  { name: 'Banner Stand (Retractable)', category: 'Experiential - Exhibition', width: '33.5"', height: '78" - 80"', depth: '10"', notes: 'Typical pull-up banner visual area' },
  { name: 'Meter Board (Signage)', category: 'Experiential - Exhibition', width: '38" - 39"', height: '84" - 96"', notes: 'Freestanding lobby signage' },
  { name: 'Hanging Sign (Ring 10\')', category: 'Experiential - Exhibition', diameter: '10\'-0"', height: '36" - 48"', notes: 'Overhead rigging required' },
  { name: 'Registration Counter', category: 'Experiential - Exhibition', width: '40" - 60"', depth: '24" - 30"', height: '40" - 42"', notes: 'Standing height transaction surface' },

  // EXPERIENTIAL - AV & TECH
  { name: 'LED Tile (500x500)', category: 'Experiential - AV & Tech', width: '500mm (19.68")', height: '500mm (19.68")', depth: '75-100mm', notes: 'Standard cabinet size' },
  { name: 'LED Tile (500x1000)', category: 'Experiential - AV & Tech', width: '500mm (19.68")', height: '1000mm (39.37")', depth: '75-100mm', notes: 'Double height cabinet' },
  { name: 'Monitor 55" (Display)', category: 'Experiential - AV & Tech', width: '~48.5"', height: '~28"', depth: '2" - 3"', notes: 'Diagonal 54.6"' },
  { name: 'Monitor 65" (Display)', category: 'Experiential - AV & Tech', width: '~57"', height: '~33"', depth: '2" - 3"', notes: 'Diagonal 64.5"' },
  { name: 'Monitor 75" (Display)', category: 'Experiential - AV & Tech', width: '~66"', height: '~38"', depth: '2.5" - 3.5"', notes: 'Diagonal 74.5"' },
  { name: 'Monitor 85" (Display)', category: 'Experiential - AV & Tech', width: '~75"', height: '~43"', depth: '3" - 4"', notes: 'Diagonal 85.6"' },
  { name: 'Monitor 98" (Display)', category: 'Experiential - AV & Tech', width: '~86"', height: '~49"', depth: '3.5" - 4.5"', notes: 'Diagonal 98"' },
  { name: 'iPad (10.9" Air)', category: 'Experiential - AV & Tech', width: '7.02"', height: '9.74"', depth: '0.24"', notes: 'Kiosk standard' },
  { name: 'Server Rack (Standard)', category: 'Experiential - AV & Tech', width: '24"', depth: '36" - 42"', height: '79" (42U) - 84"', notes: 'Standard IT/AV rack footprint' },
  { name: 'Projector (Large Venue)', category: 'Experiential - AV & Tech', width: '24"', depth: '26" - 30"', height: '10" - 14"', notes: 'Approx. 20k lumen class' },

  // EXPERIENTIAL - ACTIVATION
  { name: 'Step & Repeat (8x8)', category: 'Experiential - Activation', width: '8\'-0"', height: '8\'-0"', depth: '18"', notes: 'Standard photo backdrop' },
  { name: 'Step & Repeat (10x8)', category: 'Experiential - Activation', width: '10\'-0"', height: '8\'-0"', depth: '18"', notes: 'Wider group photos' },
  { name: 'Photo Booth (Open Air)', category: 'Experiential - Activation', width: '6\'-0"', depth: '8\'-0" - 10\'-0"', height: '8\'-0"', notes: 'Optimal footprint for camera + backdrop + guests' },
  { name: 'Sampling Counter', category: 'Experiential - Activation', width: '30" - 36"', depth: '18" - 24"', height: '36" - 40"', notes: 'Portable demo station' },
  { name: 'Stanchion (Retractable)', category: 'Experiential - Activation', width: '14"', height: '40"', notes: 'Belt length approx 7\' usable' },
  { name: 'Red Carpet Runner', category: 'Experiential - Activation', width: '3\'-0" - 4\'-0"', notes: 'Standard rental widths' },
  { name: 'Charging Station (Kiosk)', category: 'Experiential - Activation', width: '24"', depth: '24"', height: '60" - 72"', notes: 'Freestanding unit' },

  // FURNITURE - SEATING
  { name: 'Standard Sofa (3-Seat)', category: 'Furniture - Seating', width: '84" - 96"', depth: '36" - 40"', height: '30" - 36"', notes: 'Common residential', wireframe: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/dimension-reference/myh0xvxdytmwuiq5kj2ymf-img-3_1770588393000_na1fn_d2lyzwzyyw1llxnvzmetm3nlyxqtmtz4oq-9f23d8d583-fb4bee2b.png' },
  { name: 'Loveseat (2-Seat)', category: 'Furniture - Seating', width: '58" - 64"', depth: '36" - 40"', height: '30" - 36"' },
  { name: 'Armchair', category: 'Furniture - Seating', width: '30" - 36"', depth: '32" - 38"', height: '30" - 36"' },
  { name: 'Club Chair', category: 'Furniture - Seating', width: '32" - 36"', depth: '34" - 38"', height: '28" - 32"' },
  { name: 'Accent Chair', category: 'Furniture - Seating', width: '26" - 30"', depth: '28" - 32"', height: '32" - 36"' },
  { name: 'Dining Chair (Standard)', category: 'Furniture - Seating', width: '18" - 20"', depth: '20" - 24"', height: '36" - 40"', wireframe: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/dimension-reference/dkbniswpwjvzirnt-a72ced12.png' },
  { name: 'Counter Stool', category: 'Furniture - Seating', width: '16" - 18"', depth: '16" - 18"', height: '24" - 26"' },
  { name: 'Bar Stool (Standard)', category: 'Furniture - Seating', width: '16" - 18"', depth: '16" - 18"', height: '30"', wireframe: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/dimension-reference/myh0xvxdytmwuiq5kj2ymf-img-5_1770588386000_na1fn_d2lyzwzyyw1llwjhci1zdg9vbc0xnng5-8c885c518e-67ec979e.png' },

  // FURNITURE - TABLES
  { name: 'Coffee Table (Rectangle)', category: 'Furniture - Tables', width: '48" - 60"', depth: '24" - 30"', height: '16" - 18"' },
  { name: 'Coffee Table (Round)', category: 'Furniture - Tables', diameter: '36" - 48"', height: '16" - 18"' },
  { name: 'End Table / Side Table', category: 'Furniture - Tables', width: '18" - 24"', depth: '18" - 24"', height: '22" - 26"' },
  { name: 'Dining Table (4-Person)', category: 'Furniture - Tables', width: '48"', depth: '30" - 36"', height: '28" - 30"' },
  { name: 'Dining Table (6-Person)', category: 'Furniture - Tables', width: '60" - 72"', depth: '36" - 42"', height: '28" - 30"' },
  { name: 'Dining Table (8-Person)', category: 'Furniture - Tables', width: '84" - 96"', depth: '36" - 42"', height: '28" - 30"' },
  { name: 'Console Table', category: 'Furniture - Tables', width: '48" - 72"', depth: '12" - 18"', height: '30" - 36"' },

  // FURNITURE - STORAGE
  { name: 'Bookcase (Standard)', category: 'Furniture - Storage', width: '30" - 36"', depth: '12" - 14"', height: '72" - 84"' },
  { name: 'Dresser (6-Drawer)', category: 'Furniture - Storage', width: '54" - 60"', depth: '18" - 20"', height: '30" - 34"' },
  { name: 'Chest of Drawers (5-Drawer)', category: 'Furniture - Storage', width: '30" - 36"', depth: '18" - 20"', height: '48" - 54"' },
  { name: 'Nightstand', category: 'Furniture - Storage', width: '20" - 28"', depth: '16" - 20"', height: '24" - 28"' },
  { name: 'Armoire / Wardrobe', category: 'Furniture - Storage', width: '36" - 48"', depth: '20" - 24"', height: '72" - 84"' },
  { name: 'Media Console / TV Stand', category: 'Furniture - Storage', width: '48" - 72"', depth: '16" - 20"', height: '20" - 30"' },

  // FURNITURE - BEDS
  { name: 'Twin Bed', category: 'Furniture - Beds', width: '39"', depth: '75"', height: '25" (mattress)' },
  { name: 'Full Bed', category: 'Furniture - Beds', width: '54"', depth: '75"', height: '25"' },
  { name: 'Queen Bed', category: 'Furniture - Beds', width: '60"', depth: '80"', height: '25"' },
  { name: 'King Bed', category: 'Furniture - Beds', width: '76"', depth: '80"', height: '25"' },
  { name: 'California King Bed', category: 'Furniture - Beds', width: '72"', depth: '84"', height: '25"' },

  // THEATRE - FLATS
  { name: 'Standard Flat (4\'x8\')', category: 'Theatre - Flats', width: '4\'-0"', height: '8\'-0"', depth: '3/4" (thickness)', notes: 'Most common scenic flat' },
  { name: 'Standard Flat (4\'x10\')', category: 'Theatre - Flats', width: '4\'-0"', height: '10\'-0"', depth: '3/4"' },
  { name: 'Standard Flat (4\'x12\')', category: 'Theatre - Flats', width: '4\'-0"', height: '12\'-0"', depth: '3/4"' },
  { name: 'Standard Flat (4\'x14\')', category: 'Theatre - Flats', width: '4\'-0"', height: '14\'-0"', depth: '3/4"', notes: 'Tall flat for proscenium' },
  { name: 'Standard Flat (4\'x16\')', category: 'Theatre - Flats', width: '4\'-0"', height: '16\'-0"', depth: '3/4"', notes: 'Very tall flat' },

  // THEATRE - PLATFORMS
  { name: 'Standard Platform (4\'x8\')', category: 'Theatre - Platforms', width: '4\'-0"', depth: '8\'-0"', height: '6" - 12" (typical)', notes: 'Common deck size' },
  { name: 'Standard Platform (4\'x4\')', category: 'Theatre - Platforms', width: '4\'-0"', depth: '4\'-0"', height: '6" - 12"' },
  { name: 'Standard Platform (2\'x8\')', category: 'Theatre - Platforms', width: '2\'-0"', depth: '8\'-0"', height: '6" - 12"' },

  // THEATRE - DOORS
  { name: 'Interior Door (Standard)', category: 'Theatre - Doors', width: '2\'-8" - 3\'-0"', height: '6\'-8"', depth: '1-3/8" (thickness)' },
  { name: 'Exterior Door (Standard)', category: 'Theatre - Doors', width: '3\'-0"', height: '6\'-8" - 7\'-0"', depth: '1-3/4"' },
  { name: 'French Door (Single)', category: 'Theatre - Doors', width: '2\'-6" - 3\'-0"', height: '6\'-8" - 8\'-0"', depth: '1-3/4"' },
  { name: 'Double Door (Pair)', category: 'Theatre - Doors', width: '5\'-0" - 6\'-0"', height: '6\'-8" - 8\'-0"', depth: '1-3/4"' },

  // THEATRE - STAIRS
  { name: 'Standard Riser Height', category: 'Theatre - Stairs', height: '7" - 7.5"', notes: 'Code compliant' },
  { name: 'Standard Tread Depth', category: 'Theatre - Stairs', depth: '10" - 11"', notes: 'Code compliant' },
  { name: 'Stair Width (Minimum)', category: 'Theatre - Stairs', width: '36"', notes: 'Code minimum for egress' },

  // EVENT - TABLES
  { name: 'Round Table (60")', category: 'Event - Tables', diameter: '60"', height: '30"', notes: 'Seats 8-10' },
  { name: 'Round Table (72")', category: 'Event - Tables', diameter: '72"', height: '30"', notes: 'Seats 10-12' },
  { name: 'Banquet Table (6\')', category: 'Event - Tables', width: '30"', depth: '72"', height: '30"', notes: 'Seats 6' },
  { name: 'Banquet Table (8\')', category: 'Event - Tables', width: '30"', depth: '96"', height: '30"', notes: 'Seats 8-10' },
  { name: 'Cocktail Table (30")', category: 'Event - Tables', diameter: '30"', height: '42"', notes: 'Standing height' },
  { name: 'Cocktail Table (36")', category: 'Event - Tables', diameter: '36"', height: '42"' },

  // EVENT - STAGING
  { name: 'Stage Deck (4\'x8\')', category: 'Event - Staging', width: '4\'-0"', depth: '8\'-0"', height: '8" - 32" (adjustable)', notes: 'Modular staging' },
  { name: 'Stage Deck (4\'x4\')', category: 'Event - Staging', width: '4\'-0"', depth: '4\'-0"', height: '8" - 32"' },
  { name: 'Riser (Choral)', category: 'Event - Staging', width: '6\'-0" - 8\'-0"', depth: '18" - 24"', height: '8" - 12" per level' },

  // EVENT - SEATING
  { name: 'Chiavari Chair', category: 'Event - Seating', width: '15.5"', depth: '17"', height: '36"', notes: 'Popular event chair' },
  { name: 'Folding Chair (Standard)', category: 'Event - Seating', width: '18"', depth: '20"', height: '32"' },
  { name: 'Ghost Chair', category: 'Event - Seating', width: '15"', depth: '18"', height: '36"', notes: 'Clear acrylic' },

  // EVENT - LINENS
  { name: 'Tablecloth (60" Round)', category: 'Event - Linens', diameter: '120"', notes: 'Floor length for 60" table' },
  { name: 'Tablecloth (72" Round)', category: 'Event - Linens', diameter: '132"', notes: 'Floor length for 72" table' },
  { name: 'Tablecloth (6\' Banquet)', category: 'Event - Linens', width: '90"', depth: '132"', notes: 'Floor length' },
  { name: 'Tablecloth (8\' Banquet)', category: 'Event - Linens', width: '90"', depth: '156"', notes: 'Floor length' },

  // ARCHITECTURE - CIRCULATION
  { name: 'Corridor Width (Minimum)', category: 'Architecture - Circulation', width: '36"', notes: 'ADA minimum' },
  { name: 'Corridor Width (Preferred)', category: 'Architecture - Circulation', width: '48" - 60"', notes: 'Comfortable two-way traffic' },
  { name: 'Doorway (ADA)', category: 'Architecture - Circulation', width: '36" (clear)', notes: 'Minimum clear opening' },
  { name: 'Wheelchair Turning Circle', category: 'Architecture - Circulation', diameter: '60"', notes: 'ADA requirement' },

  // ARCHITECTURE - HEIGHTS
  { name: 'Ceiling Height (Standard)', category: 'Architecture - Heights', height: '8\'-0" - 9\'-0"', notes: 'Residential' },
  { name: 'Ceiling Height (Commercial)', category: 'Architecture - Heights', height: '9\'-0" - 12\'-0"', notes: 'Office/retail' },
  { name: 'Door Height (Standard)', category: 'Architecture - Heights', height: '6\'-8"', notes: 'Standard interior' },
  { name: 'Window Sill Height', category: 'Architecture - Heights', height: '30" - 36"', notes: 'Standard residential' },
  { name: 'Light Switch Height', category: 'Architecture - Heights', height: '48"', notes: 'ADA compliant' },
  { name: 'Outlet Height', category: 'Architecture - Heights', height: '12" - 18"', notes: 'Standard residential' },

  // ARCHITECTURE - COUNTERS
  { name: 'Kitchen Counter Height', category: 'Architecture - Counters', height: '36"', depth: '24" - 25"', notes: 'Standard' },
  { name: 'Kitchen Island Height', category: 'Architecture - Counters', height: '36"', depth: '36" - 48"' },
  { name: 'Bar Counter Height', category: 'Architecture - Counters', height: '42"', depth: '16" - 20"' },
  { name: 'Bathroom Vanity Height', category: 'Architecture - Counters', height: '32" - 36"', depth: '21" - 24"' },
  { name: 'Reception Desk Height', category: 'Architecture - Counters', height: '42" - 48"', depth: '24" - 30"', notes: 'Standing transaction' },
];

export default function DimensionReference() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('All Categories');
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const filteredDimensions = useMemo(() => {
    let filtered = DIMENSIONS;
    
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query) ||
        item.jargon?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  const copyDimensions = async (item: DimensionItem) => {
    const dims = [
      item.width ? `W: ${item.width}` : '',
      item.depth ? `D: ${item.depth}` : '',
      item.height ? `H: ${item.height}` : '',
      item.diameter ? `Dia: ${item.diameter}` : '',
    ].filter(Boolean).join(' × ');
    
    const copied = await copyTextToClipboard(`${item.name}\n${dims}`);
    if (copied) {
      setCopiedItem(item.name);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll');
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Dimension Reference | Scenic Design Standards"
        description="Reference dimensions for furniture, theatre, experiential design, events, and architecture in a cleaner mobile-friendly lookup tool."
      />
      <Header />

      <main className="px-4 pb-24 pt-22 sm:px-6 md:pt-28">
      <section className="mx-auto max-w-6xl border-b border-border/18 pb-10 md:pb-12">
        <Link
          href="/studio/apps"
          className="inline-flex items-center gap-2 text-[0.92rem] font-medium text-foreground/56 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Studio Apps
        </Link>

        <div className="mx-auto mt-6 max-w-4xl text-center md:mt-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
            Dimension Reference
          </p>
          <h1 className="mt-4 font-sans text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[0.95] tracking-[-0.065em] text-foreground">
            Standard dimensions for scenic, event, exhibit, and architectural work.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-[0.98rem] leading-7 text-foreground/60 md:text-[1.08rem] md:leading-8">
            A quick mobile-friendly lookup tool for common furniture, theatre, exhibit, event, and
            architectural dimensions.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl md:mt-10">
        <div className="px-1 py-1 sm:px-0 md:py-0">
        <div className="mb-5 md:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search dimensions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border-transparent bg-black/18 pl-10 shadow-none"
            />
          </div>
        </div>

        <div className="mb-6 relative md:mb-8">
          <button
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground/54 backdrop-blur-sm transition-colors hover:text-foreground"
            onClick={() => scrollCategories('left')}
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div 
            id="category-scroll"
            className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide px-10"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category];
              const isActive = selectedCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[0.8rem] font-medium whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'border border-white/8 bg-black/14 text-foreground/54 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category}
                </button>
              );
            })}
          </div>

          <button
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground/54 backdrop-blur-sm transition-colors hover:text-foreground"
            onClick={() => scrollCategories('right')}
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-5 text-sm text-foreground/44">
          {filteredDimensions.length} {filteredDimensions.length === 1 ? 'item' : 'items'} found
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {filteredDimensions.map((item, index) => (
            <div
              key={index}
              className="rounded-[1.15rem] bg-[#242424] p-4 transition-colors md:p-5"
            >
                <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/36">{item.category}</p>
                  <h3 className="mt-2 font-sans text-[1.15rem] font-medium leading-[1.15] tracking-[-0.03em] text-foreground">{item.name}</h3>
                </div>
                <button
                  onClick={() => copyDimensions(item)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/6 text-foreground/60 transition-colors hover:bg-white/12 hover:text-foreground"
                  title="Copy Dimensions"
                >
                  {copiedItem === item.name ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 pt-4 border-t border-white/8">
                {item.width && (
                  <div>
                    <span className="text-[10px] text-foreground/38 block mb-1 uppercase tracking-[0.16em]">Width</span>
                    <span className="font-medium text-sm text-foreground/78">{item.width}</span>
                  </div>
                )}
                {item.depth && (
                  <div>
                    <span className="text-[10px] text-foreground/38 block mb-1 uppercase tracking-[0.16em]">Depth</span>
                    <span className="font-medium text-sm text-foreground/78">{item.depth}</span>
                  </div>
                )}
                {item.height && (
                  <div>
                    <span className="text-[10px] text-foreground/38 block mb-1 uppercase tracking-[0.16em]">Height</span>
                    <span className="font-medium text-sm text-foreground/78">{item.height}</span>
                  </div>
                )}
                {item.diameter && (
                  <div>
                    <span className="text-[10px] text-foreground/38 block mb-1 uppercase tracking-[0.16em]">Diameter</span>
                    <span className="font-medium text-sm text-foreground/78">{item.diameter}</span>
                  </div>
                )}
              </div>

                {(item.notes || item.jargon) && (
                  <div className="border-t border-white/8 pt-3 text-xs space-y-2">
                    {item.notes && (
                      <p className="text-foreground/54 leading-6">
                        <span className="font-semibold text-foreground/72 mr-1 uppercase tracking-[0.14em]">Note</span>
                        {item.notes}
                      </p>
                    )}
                    {item.jargon && (
                      <p className="text-foreground/50 italic leading-6">
                        <span className="font-semibold text-foreground/68 mr-1 uppercase tracking-[0.14em]">AKA</span>
                        {item.jargon}
                      </p>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>

        {filteredDimensions.length === 0 && (
          <div className="text-center py-20">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-foreground/52">No dimensions found matching "{searchQuery}"</p>
          </div>
        )}
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
