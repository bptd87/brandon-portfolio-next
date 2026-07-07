"use client";

import { useMemo, useState } from "react";
import { 
  Database, Search, Copy, Check, ArrowLeft, SlidersHorizontal,
  Armchair, Table, Bed, Package, Layers,
  Monitor, Store, Users, Home, Ruler
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { copyTextToClipboard } from "@/lib/clipboard";
import { Link } from "wouter";
import { useStudioToolTheme } from "@/hooks/useStudioToolTheme";

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

type UnitMode = "imperial" | "metric";

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
  | 'Architecture - Counters'
  | 'Architecture - Doors & Openings'
  | 'Architecture - Stairs & Ramps'
  | 'Architecture - Restrooms'
  | 'Architecture - Kitchens'
  | 'Architecture - Workstations'
  | 'Architecture - Parking & Exterior';

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
  'Architecture - Doors & Openings': Layers,
  'Architecture - Stairs & Ramps': Layers,
  'Architecture - Restrooms': Users,
  'Architecture - Kitchens': Table,
  'Architecture - Workstations': Monitor,
  'Architecture - Parking & Exterior': Store,
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
  'Architecture - Doors & Openings',
  'Architecture - Stairs & Ramps',
  'Architecture - Restrooms',
  'Architecture - Kitchens',
  'Architecture - Workstations',
  'Architecture - Parking & Exterior',
];

const CATEGORY_FILTERS = CATEGORIES.filter(
  (category) => category !== "All Categories"
) as CategoryKey[];

const MM_PER_INCH = 25.4;

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
  { name: 'Accessible Route Width', category: 'Architecture - Circulation', width: '36" min clear', notes: 'Common accessible route minimum; verify local code' },
  { name: 'Accessible Clear Floor Space', category: 'Architecture - Circulation', width: '30"', depth: '48"', notes: 'Forward or parallel wheelchair approach' },
  { name: 'Passing Space', category: 'Architecture - Circulation', width: '60"', depth: '60"', notes: 'Typical wheelchair passing interval on narrow routes' },
  { name: 'Residential Hallway', category: 'Architecture - Circulation', width: '36" - 42"', notes: 'Common residential corridor planning range' },
  { name: 'Two-Person Corridor', category: 'Architecture - Circulation', width: '60" - 72"', notes: 'Comfortable two-way interior circulation' },
  { name: 'Retail Aisle (Comfortable)', category: 'Architecture - Circulation', width: '48" - 60"', notes: 'Allows browsing and passing' },
  { name: 'Queue Lane', category: 'Architecture - Circulation', width: '36" - 42"', notes: 'Single-file queuing or stanchion lane' },
  { name: 'Furniture Passage', category: 'Architecture - Circulation', width: '30" - 36"', notes: 'Clear path between furniture pieces' },

  // ARCHITECTURE - HEIGHTS
  { name: 'Ceiling Height (Standard)', category: 'Architecture - Heights', height: '8\'-0" - 9\'-0"', notes: 'Residential' },
  { name: 'Ceiling Height (Commercial)', category: 'Architecture - Heights', height: '9\'-0" - 12\'-0"', notes: 'Office/retail' },
  { name: 'Door Height (Standard)', category: 'Architecture - Heights', height: '6\'-8"', notes: 'Standard interior' },
  { name: 'Window Sill Height', category: 'Architecture - Heights', height: '30" - 36"', notes: 'Standard residential' },
  { name: 'Light Switch Height', category: 'Architecture - Heights', height: '48"', notes: 'ADA compliant' },
  { name: 'Outlet Height', category: 'Architecture - Heights', height: '12" - 18"', notes: 'Standard residential' },
  { name: 'Thermostat Height', category: 'Architecture - Heights', height: '48" max reach', notes: 'Accessible forward reach reference' },
  { name: 'Door Viewer / Peephole', category: 'Architecture - Heights', height: '43" - 60"', notes: 'Use lower height for accessible viewing' },
  { name: 'Handrail Height', category: 'Architecture - Heights', height: '34" - 38"', notes: 'Measured above stair nosings or ramp surface' },
  { name: 'Guardrail Height (Residential)', category: 'Architecture - Heights', height: '36" min', notes: 'Common residential guard height; verify jurisdiction' },
  { name: 'Guardrail Height (Commercial)', category: 'Architecture - Heights', height: '42" min', notes: 'Common commercial guard height; verify jurisdiction' },
  { name: 'Toilet Paper Dispenser', category: 'Architecture - Heights', height: '19" min', notes: 'Typical accessible dispenser height zone varies by condition' },
  { name: 'Mirror Bottom Edge', category: 'Architecture - Heights', height: '40" max', notes: 'Accessible lavatory mirror reference' },
  { name: 'Drinking Fountain Spout', category: 'Architecture - Heights', height: '36" max', notes: 'Accessible spout height reference' },

  // ARCHITECTURE - COUNTERS
  { name: 'Kitchen Counter Height', category: 'Architecture - Counters', height: '36"', depth: '24" - 25"', notes: 'Standard' },
  { name: 'Kitchen Island Height', category: 'Architecture - Counters', height: '36"', depth: '36" - 48"' },
  { name: 'Bar Counter Height', category: 'Architecture - Counters', height: '42"', depth: '16" - 20"' },
  { name: 'Bathroom Vanity Height', category: 'Architecture - Counters', height: '32" - 36"', depth: '21" - 24"' },
  { name: 'Reception Desk Height', category: 'Architecture - Counters', height: '42" - 48"', depth: '24" - 30"', notes: 'Standing transaction' },
  { name: 'Accessible Counter Segment', category: 'Architecture - Counters', height: '34" max', depth: '17" - 25"', notes: 'Accessible sales/service counter reference' },
  { name: 'Desk / Work Surface', category: 'Architecture - Counters', height: '28" - 30"', depth: '24" - 30"', notes: 'Typical seated work height' },
  { name: 'Standing Workbench', category: 'Architecture - Counters', height: '36" - 42"', depth: '24" - 36"', notes: 'Shop and production workbench range' },
  { name: 'Transaction Counter Depth', category: 'Architecture - Counters', depth: '18" - 24"', height: '34" - 42"', notes: 'Use lower portion for accessible transactions' },
  { name: 'Reception Counter Width', category: 'Architecture - Counters', width: '60" - 96"', depth: '24" - 30"', height: '42" - 48"', notes: 'Common small lobby desk' },

  // ARCHITECTURE - DOORS & OPENINGS
  { name: 'Interior Door Leaf', category: 'Architecture - Doors & Openings', width: '30" - 36"', height: '80"', depth: '1-3/8"', notes: 'Common interior swing door' },
  { name: 'Accessible Door Clear Width', category: 'Architecture - Doors & Openings', width: '32" min clear', notes: 'Clear opening with door open 90 degrees' },
  { name: 'Exterior Door Leaf', category: 'Architecture - Doors & Openings', width: '36"', height: '80" - 84"', depth: '1-3/4"', notes: 'Common exterior swing door' },
  { name: 'Double Door Pair', category: 'Architecture - Doors & Openings', width: '60" - 72"', height: '80" - 96"', notes: 'Pair of 30" to 36" leaves' },
  { name: 'Pocket Door', category: 'Architecture - Doors & Openings', width: '30" - 36"', height: '80"', notes: 'Pocket cavity usually about twice door width' },
  { name: 'Sliding Glass Door', category: 'Architecture - Doors & Openings', width: '60" - 96"', height: '80"', notes: 'Common residential patio opening' },
  { name: 'Storefront Entry Door', category: 'Architecture - Doors & Openings', width: '36"', height: '84" - 96"', notes: 'Commercial aluminum entrance range' },
  { name: 'Door Pull Side Clearance', category: 'Architecture - Doors & Openings', width: '18" min latch side', notes: 'Common accessible maneuvering clearance reference' },
  { name: 'Cased Opening', category: 'Architecture - Doors & Openings', width: '36" - 72"', height: '80" - 96"', notes: 'Open passage without leaf' },
  { name: 'Garage Door (Single)', category: 'Architecture - Doors & Openings', width: '8\'-0" - 9\'-0"', height: '7\'-0" - 8\'-0"', notes: 'Common residential single bay' },
  { name: 'Garage Door (Double)', category: 'Architecture - Doors & Openings', width: '16\'-0"', height: '7\'-0" - 8\'-0"', notes: 'Common residential double bay' },

  // ARCHITECTURE - STAIRS & RAMPS
  { name: 'Residential Stair Riser', category: 'Architecture - Stairs & Ramps', height: '7-3/4" max', notes: 'IRC residential maximum riser reference' },
  { name: 'Residential Stair Tread', category: 'Architecture - Stairs & Ramps', depth: '10" min', notes: 'IRC residential minimum tread reference' },
  { name: 'Comfort Stair Riser', category: 'Architecture - Stairs & Ramps', height: '6-1/2" - 7"', notes: 'Comfortable theatrical/architectural planning range' },
  { name: 'Comfort Stair Tread', category: 'Architecture - Stairs & Ramps', depth: '11" - 12"', notes: 'Comfortable planning range' },
  { name: 'Stair Width (Residential)', category: 'Architecture - Stairs & Ramps', width: '36" min', notes: 'Common residential minimum clear width' },
  { name: 'Stair Width (Public)', category: 'Architecture - Stairs & Ramps', width: '44" min typical', notes: 'Common egress stair reference; verify local code' },
  { name: 'Stair Landing Depth', category: 'Architecture - Stairs & Ramps', depth: '36" min', notes: 'Common residential landing depth reference' },
  { name: 'Ramp Running Slope', category: 'Architecture - Stairs & Ramps', depth: '1:12 max', notes: 'Accessible ramp slope reference' },
  { name: 'Ramp Clear Width', category: 'Architecture - Stairs & Ramps', width: '36" min clear', notes: 'Accessible ramp run clear width reference' },
  { name: 'Ramp Landing', category: 'Architecture - Stairs & Ramps', width: '36" min', depth: '60" min', notes: 'Accessible ramp landing reference' },
  { name: 'Curb Ramp Width', category: 'Architecture - Stairs & Ramps', width: '36" min clear', notes: 'Accessible curb ramp reference' },
  { name: 'Handrail Extension', category: 'Architecture - Stairs & Ramps', depth: '12" min', notes: 'Extension beyond top riser or ramp run reference' },
  { name: 'Guard Opening', category: 'Architecture - Stairs & Ramps', width: '4" sphere max', notes: 'Common guard infill opening reference' },

  // ARCHITECTURE - RESTROOMS
  { name: 'Toilet Room (Single User)', category: 'Architecture - Restrooms', width: '5\'-0" min', depth: '7\'-0" min', notes: 'Common accessible single-user planning module' },
  { name: 'Accessible Toilet Clearance', category: 'Architecture - Restrooms', width: '60" min', depth: '56" - 59" min', notes: 'Depth varies by wall-hung or floor-mounted fixture' },
  { name: 'Water Closet Centerline', category: 'Architecture - Restrooms', width: '16" - 18"', notes: 'From side wall to fixture centerline' },
  { name: 'Toilet Seat Height', category: 'Architecture - Restrooms', height: '17" - 19"', notes: 'Accessible water closet seat height reference' },
  { name: 'Lavatory Height', category: 'Architecture - Restrooms', height: '34" max', depth: '17" - 25"', notes: 'Accessible lavatory rim/counter reference' },
  { name: 'Lavatory Knee Clearance', category: 'Architecture - Restrooms', height: '27" min', depth: '8" min', notes: 'Accessible knee clearance reference' },
  { name: 'Grab Bar Side Wall', category: 'Architecture - Restrooms', width: '42" min', height: '33" - 36"', notes: 'Accessible side grab bar reference' },
  { name: 'Grab Bar Rear Wall', category: 'Architecture - Restrooms', width: '36" min', height: '33" - 36"', notes: 'Accessible rear grab bar reference' },
  { name: 'Ambulatory Stall', category: 'Architecture - Restrooms', width: '35" - 37"', depth: '60" min', notes: 'Ambulatory accessible compartment range' },
  { name: 'Standard Toilet Stall', category: 'Architecture - Restrooms', width: '36"', depth: '60"', notes: 'Common non-accessible compartment' },
  { name: 'Accessible Toilet Stall', category: 'Architecture - Restrooms', width: '60" min', depth: '56" - 59" min', notes: 'Compartment depth varies by fixture type' },
  { name: 'Urinal Rim Height', category: 'Architecture - Restrooms', height: '17" max', notes: 'Accessible urinal rim height reference' },
  { name: 'Shower Transfer Seat', category: 'Architecture - Restrooms', width: '15" - 16"', depth: '15" - 16"', height: '17" - 19"', notes: 'Accessible shower seat reference' },

  // ARCHITECTURE - KITCHENS
  { name: 'Base Cabinet Depth', category: 'Architecture - Kitchens', depth: '24"', height: '34-1/2"', notes: 'Cabinet height before countertop' },
  { name: 'Wall Cabinet Depth', category: 'Architecture - Kitchens', depth: '12" - 15"', height: '30" - 42"', notes: 'Common upper cabinet range' },
  { name: 'Countertop Overhang', category: 'Architecture - Kitchens', depth: '1" - 1-1/2"', notes: 'Typical front overhang' },
  { name: 'Island Seating Overhang', category: 'Architecture - Kitchens', depth: '12" - 15"', notes: 'Knee space for stools' },
  { name: 'Kitchen Work Aisle', category: 'Architecture - Kitchens', width: '42" - 48"', notes: 'One-cook to two-cook planning range' },
  { name: 'Walkway Behind Island Seating', category: 'Architecture - Kitchens', width: '44" - 60"', notes: 'Depends on traffic and stool use' },
  { name: 'Dishwasher Opening', category: 'Architecture - Kitchens', width: '24"', depth: '24"', height: '34" - 35"', notes: 'Standard dishwasher bay' },
  { name: 'Range / Cooktop Width', category: 'Architecture - Kitchens', width: '30" - 36"', depth: '24" - 28"', notes: 'Common residential appliance range' },
  { name: 'Refrigerator Bay', category: 'Architecture - Kitchens', width: '36" - 42"', depth: '30" - 36"', height: '70" - 84"', notes: 'Varies by appliance type' },
  { name: 'Toe Kick', category: 'Architecture - Kitchens', height: '4"', depth: '3"', notes: 'Typical cabinet toe recess' },

  // ARCHITECTURE - WORKSTATIONS
  { name: 'Office Desk', category: 'Architecture - Workstations', width: '48" - 72"', depth: '24" - 30"', height: '29" - 30"', notes: 'Typical task desk' },
  { name: 'Executive Desk', category: 'Architecture - Workstations', width: '72" - 84"', depth: '30" - 36"', height: '29" - 30"', notes: 'Larger private office desk' },
  { name: 'Open Office Workstation', category: 'Architecture - Workstations', width: '60" - 72"', depth: '60" - 72"', notes: 'Common systems furniture footprint' },
  { name: 'Conference Table Seat', category: 'Architecture - Workstations', width: '30" min per person', depth: '36" - 48"', notes: 'Table planning module per seated person' },
  { name: 'Conference Room Clearance', category: 'Architecture - Workstations', width: '36" - 48"', notes: 'Clearance around table edge' },
  { name: 'Task Chair Footprint', category: 'Architecture - Workstations', width: '26" - 30"', depth: '26" - 30"', notes: 'Rolling office chair planning footprint' },
  { name: 'File Cabinet (Lateral)', category: 'Architecture - Workstations', width: '30" - 42"', depth: '18" - 20"', height: '28" - 67"', notes: 'Two to five drawer range' },
  { name: 'File Cabinet (Vertical)', category: 'Architecture - Workstations', width: '15" - 18"', depth: '25" - 28"', height: '28" - 52"', notes: 'Letter/legal vertical cabinet' },

  // ARCHITECTURE - PARKING & EXTERIOR
  { name: 'Parking Stall (Standard)', category: 'Architecture - Parking & Exterior', width: '8\'-6" - 9\'-0"', depth: '18\'-0" - 20\'-0"', notes: 'Common surface parking range' },
  { name: 'Accessible Parking Stall', category: 'Architecture - Parking & Exterior', width: '96" min', depth: '18\'-0" typical', notes: 'Access aisle required; verify local code' },
  { name: 'Accessible Parking Access Aisle', category: 'Architecture - Parking & Exterior', width: '60" min', notes: 'Van aisles may require more width by condition' },
  { name: 'Van Accessible Parking Stall', category: 'Architecture - Parking & Exterior', width: '132" min', depth: '18\'-0" typical', notes: 'Alternative layouts may combine stall and aisle differently' },
  { name: 'Sidewalk Width', category: 'Architecture - Parking & Exterior', width: '48" - 60"', notes: 'Comfortable pedestrian path range' },
  { name: 'Accessible Exterior Route', category: 'Architecture - Parking & Exterior', width: '36" min clear', notes: 'Accessible route clear width reference' },
  { name: 'Curb Height', category: 'Architecture - Parking & Exterior', height: '6" typical', notes: 'Common parking/site curb height' },
  { name: 'Bike Parking Space', category: 'Architecture - Parking & Exterior', width: '24"', depth: '72"', notes: 'Single bicycle footprint reference' },
];

function getItemKey(item: DimensionItem) {
  return `${item.category}:${item.name}`;
}

function formatMetricNumber(totalMillimeters: number) {
  if (totalMillimeters >= 1000) {
    return `${(totalMillimeters / 1000)
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1")}m`;
  }

  return `${Math.round(totalMillimeters)}mm`;
}

function parseInches(rawValue = "0") {
  const trimmedValue = rawValue.trim();
  if (!trimmedValue) return 0;

  if (trimmedValue.includes("/")) {
    const [wholeValue, fractionValue] = trimmedValue.split(" ");
    const [numerator, denominator] = (fractionValue ?? wholeValue)
      .split("/")
      .map(Number);
    const whole = fractionValue ? Number(wholeValue) : 0;
    return whole + numerator / denominator;
  }

  return Number(trimmedValue);
}

function formatDimensionValue(value: string, unitMode: UnitMode) {
  if (unitMode === "imperial" || /(?:mm|cm|meter|metre)/i.test(value)) {
    return value;
  }

  return value
    .replace(/(\d+(?:\.\d+)?)'\s*-?\s*((?:\d+\s+)?\d*(?:\.\d+)?(?:\/\d+)?)?"/g, (
      _match,
      feetValue: string,
      inchesValue: string
    ) => {
      const totalInches = Number(feetValue) * 12 + parseInches(inchesValue);
      return formatMetricNumber(totalInches * MM_PER_INCH);
    })
    .replace(/((?:\d+\s+)?\d+(?:\.\d+)?(?:\/\d+)?)"/g, (_match, inchesValue: string) =>
      formatMetricNumber(parseInches(inchesValue) * MM_PER_INCH)
    )
    .replace(/(\d+(?:\.\d+)?)'\b/g, (_match, feetValue: string) =>
      formatMetricNumber(Number(feetValue) * 12 * MM_PER_INCH)
    );
}

function getDimensionParts(item: DimensionItem, unitMode: UnitMode = "imperial") {
  return [
    item.width ? { label: "Width", value: formatDimensionValue(item.width, unitMode) } : null,
    item.depth ? { label: "Depth", value: formatDimensionValue(item.depth, unitMode) } : null,
    item.height ? { label: "Height", value: formatDimensionValue(item.height, unitMode) } : null,
    item.diameter
      ? { label: "Diameter", value: formatDimensionValue(item.diameter, unitMode) }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}

function formatDimensionLine(item: DimensionItem, unitMode: UnitMode = "imperial") {
  return getDimensionParts(item, unitMode)
    .map((part) => `${part.label[0]}: ${part.value}`)
    .join(" / ");
}

function getReferenceTag(item: DimensionItem | null) {
  if (!item) return "Reference";

  const referenceText = `${item.name} ${item.category} ${item.notes ?? ""}`.toLowerCase();
  if (referenceText.includes("ada") || referenceText.includes("accessible")) {
    return "ADA check";
  }
  if (referenceText.includes("irc") || referenceText.includes("code")) {
    return "Code check";
  }
  if (item.category.startsWith("Architecture")) return "Planning ref";
  if (item.category.startsWith("Theatre")) return "Scenic ref";
  if (item.category.startsWith("Event")) return "Event ref";
  if (item.category.startsWith("Experiential")) return "Expo ref";
  return "Typical ref";
}

function getCopyText(item: DimensionItem, unitMode: UnitMode) {
  const dimensionLine = formatDimensionLine(item, unitMode);
  return `${item.name} - ${dimensionLine}`;
}

function getCategoryLabel(category: CategoryKey) {
  if (category === "All Categories") return "All";
  return category.split(" - ")[1] ?? category;
}

function getCategoryButtonLabel(category: CategoryKey) {
  if (category === "All Categories") return "All";

  const [group, label] = category.split(" - ");
  if (group === "Furniture") return `Furn ${label}`;
  if (group === "Theatre") return `Stage ${label}`;
  if (group === "Event") return `Event ${label}`;
  if (group === "Architecture") return `Arch ${label}`;
  return label ?? category;
}

function formatCategoryFilterLabel(selectedCategories: CategoryKey[]) {
  if (selectedCategories.length === CATEGORY_FILTERS.length) {
    return "All categories";
  }

  if (selectedCategories.length === 0) return "No categories";
  if (selectedCategories.length === 1) {
    return getCategoryLabel(selectedCategories[0]);
  }

  return `${selectedCategories.length} categories`;
}

export default function DimensionReference() {
  const { studioToolStyle } = useStudioToolTheme({
    accent: "#052f8b",
    accentInk: "#a8f4ff",
  });
  const [selectedCategories, setSelectedCategories] =
    useState<CategoryKey[]>(CATEGORY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [unitMode, setUnitMode] = useState<UnitMode>("imperial");

  const filteredDimensions = useMemo(() => {
    let filtered = DIMENSIONS;

    if (selectedCategories.length !== CATEGORY_FILTERS.length) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category as CategoryKey)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.notes?.toLowerCase().includes(query) ||
          item.jargon?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategories, searchQuery]);

  const selectedDimension =
    filteredDimensions.find((item) => getItemKey(item) === selectedItemKey) ??
    filteredDimensions[0] ??
    null;

  const copyDimensions = async (item: DimensionItem | null) => {
    if (!item) return;

    const copied = await copyTextToClipboard(getCopyText(item, unitMode));

    if (copied) {
      setSelectedItemKey(getItemKey(item));
      setCopiedItem(getItemKey(item));
      window.setTimeout(() => setCopiedItem(null), 1200);
    }
  };

  function toggleCategory(category: CategoryKey) {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((currentCategory) => currentCategory !== category)
        : [...currentCategories, category]
    );
    setSelectedItemKey(null);
  }

  function selectAllCategories() {
    setSelectedCategories(CATEGORY_FILTERS);
    setSelectedItemKey(null);
  }

  function deselectAllCategories() {
    setSelectedCategories([]);
    setSelectedItemKey(null);
  }

  return (
    <div
      className="studio-tool-page h-[100dvh] overflow-hidden bg-[#f3eee4] text-black"
      style={studioToolStyle}
    >
      <SEO
        title="Dimension Reference | Scenic Design Standards"
        description="Reference dimensions for furniture, theatre, experiential design, events, and architecture in a mobile studio lookup tool."
      />

      <main className="studio-app-main box-border h-full overflow-hidden px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.55rem)] sm:px-4 md:px-5">
        <section className="relative mx-auto flex h-full max-w-[29rem] flex-col overflow-hidden">
          <header className="studio-app-mobile-topbar grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center">
            <Link
              href="/studio/apps"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--studio-tool-control-bg)] text-[var(--studio-tool-control-ink)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_10px_24px_rgba(0,0,0,0.18)]"
              aria-label="Back to Studio Apps"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/50">
              Dims
            </p>
            <button
              type="button"
              onClick={() => copyDimensions(selectedDimension)}
              className="ml-auto flex h-8 w-8 items-center justify-center bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-opacity hover:opacity-88"
              aria-label="Copy selected dimension"
            >
              {selectedDimension &&
              copiedItem === getItemKey(selectedDimension) ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pt-1">
            <section className="relative flex min-h-[13.25rem] shrink-0 flex-col justify-between overflow-hidden rounded-[0.45rem] border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_24px_70px_rgba(58,45,31,0.16),inset_0_1px_rgba(255,255,255,0.75)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-black/42">
                    Dimension Reference
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--studio-tool-accent)]">
                      {selectedDimension
                        ? getCategoryLabel(selectedDimension.category as CategoryKey)
                        : "No result"}
                    </p>
                    <span className="bg-[#ebe5d8] px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-black/46">
                      {getReferenceTag(selectedDimension)}
                    </span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--studio-tool-control-bg)] text-[var(--studio-tool-control-ink)] shadow-[0_12px_28px_rgba(0,0,0,0.14)]">
                  <Ruler className="h-5 w-5" />
                </div>
              </div>

              <div>
                <h1 className="studio-fluid-title max-w-[15ch] font-sans text-[clamp(1.7rem,6.4vw,2.8rem)] font-semibold leading-[0.96] text-black">
                  {selectedDimension?.name ?? "No dimensions"}
                </h1>
                {selectedDimension ? (
                  <>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {getDimensionParts(selectedDimension, unitMode).map((part) => (
                        <div
                          key={part.label}
                          className="border border-black/10 bg-[#ebe5d8] px-3 py-1.5"
                        >
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-black/42">
                            {part.label}
                          </p>
                          <p className="mt-1 text-[1rem] font-semibold leading-none tracking-[-0.035em] text-black">
                            {part.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    {selectedDimension.notes ? (
                      <p className="mt-2 max-h-9 overflow-hidden text-[0.72rem] font-medium leading-snug tracking-[-0.02em] text-black/52">
                        {selectedDimension.notes}
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>
            </section>

            <section className="shrink-0 border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border border-black/10 bg-[#f3eee4] px-3">
                  <Search className="h-4 w-4 text-black/46" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search dimensions"
                    className="h-11 min-w-0 bg-transparent text-[0.95rem] font-medium tracking-[-0.02em] text-black outline-none placeholder:text-black/34"
                    aria-label="Search dimensions"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen((isOpen) => !isOpen)}
                  className="flex h-11 items-center gap-2 bg-[var(--studio-tool-accent)] px-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--studio-tool-accent-ink)] transition-opacity hover:opacity-88"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </button>
              </div>

              <div className="mt-2 grid grid-cols-2 border border-black/10 bg-[#ebe5d8] p-1">
                <p className="flex h-8 items-center px-2 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-black/38">
                  Units
                </p>
                <div className="grid grid-cols-2 border border-black/10 bg-[#ebe5d8] p-1">
                  {(["imperial", "metric"] as UnitMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setUnitMode(mode)}
                      className={`h-8 text-[0.6rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                        unitMode === mode
                          ? "bg-black text-white"
                          : "text-black/48 hover:bg-[#f3eee4]"
                      }`}
                      aria-pressed={unitMode === mode}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {filtersOpen ? (
                <div className="mt-3 border-t border-black/10 pt-3">
                  <div className="mb-2 grid grid-cols-[1fr_auto_auto] items-center gap-2">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-black/42">
                      {selectedCategories.length} active
                    </p>
                    <button
                      type="button"
                      onClick={selectAllCategories}
                      className="h-8 border border-black/10 px-3 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-black/52 transition-colors hover:bg-[#ebe5d8]"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={deselectAllCategories}
                      className="h-8 bg-black px-3 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-85"
                    >
                      Deselect all
                    </button>
                  </div>
                  <div className="grid max-h-[10.5rem] gap-2 overflow-y-auto pr-1">
                    {CATEGORY_FILTERS.map((category) => {
                      const Icon = CATEGORY_ICONS[category];
                      const checked = selectedCategories.includes(category);
                      const count = DIMENSIONS.filter(
                        (item) => item.category === category
                      ).length;

                      return (
                        <label
                          key={category}
                          className="grid cursor-pointer grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 border border-black/10 bg-[#f3eee4] px-3 py-3 text-black"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(category)}
                            className="sr-only"
                          />
                          <span
                            className={`flex h-5 w-5 items-center justify-center border ${
                              checked
                                ? "border-[var(--studio-tool-accent)] bg-[var(--studio-tool-accent)]"
                                : "border-black/24 bg-transparent"
                            }`}
                            aria-hidden="true"
                          >
                            {checked ? <Check className="h-3.5 w-3.5 text-black" /> : null}
                          </span>
                          <Icon className="h-4 w-4 text-black/48" />
                          <span className="truncate text-[0.8rem] font-semibold uppercase tracking-[0.13em] text-black/70">
                            {getCategoryButtonLabel(category)}
                          </span>
                          <span className="text-[0.78rem] font-semibold tracking-[-0.02em] text-black/38">
                            {count}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/42">
                  {formatCategoryFilterLabel(selectedCategories)} / tap filter to choose reference groups
                </p>
              )}
            </section>

            <section className="flex min-h-0 flex-1 flex-col border border-black/10 bg-[#fbf7ef] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-3 border-b border-black/10 px-3 py-2">
                <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/44">
                  <Database className="h-4 w-4" />
                  {filteredDimensions.length}{" "}
                  {filteredDimensions.length === 1 ? "item" : "items"}
                </div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/38">
                  Tap to view
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {filteredDimensions.map((item) => {
                  const itemKey = getItemKey(item);
                  const isSelected = selectedDimension
                    ? getItemKey(selectedDimension) === itemKey
                    : false;

                  return (
                    <div
                      key={itemKey}
                      className={`grid grid-cols-[minmax(0,1fr)_4.2rem] border-b border-black/10 ${
                        isSelected ? "bg-[#f3eee4]" : "hover:bg-[#f3eee4]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedItemKey(itemKey)}
                        className="min-w-0 px-3 py-3 text-left"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 h-3 w-3 shrink-0 ${
                              isSelected ? "bg-[var(--studio-tool-accent)]" : "bg-black"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-[1rem] font-semibold leading-none tracking-[-0.04em] text-black">
                              {item.name}
                            </span>
                            <span className="mt-2 block truncate text-[0.74rem] font-medium tracking-[-0.02em] text-black/48">
                              {item.category}
                            </span>
                            <span className="mt-2 block truncate font-mono text-[0.76rem] font-semibold tracking-[-0.03em] text-black/62">
                              {formatDimensionLine(item, unitMode)}
                            </span>
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => copyDimensions(item)}
                        className="flex items-center justify-center border-l border-black/10 text-black transition-colors hover:bg-[#ede6d8]"
                        aria-label={`Copy ${item.name} dimensions`}
                      >
                        {copiedItem === itemKey ? (
                          <Check className="h-4 w-4 text-[var(--studio-tool-accent)]" />
                        ) : (
                          <Copy className="h-4 w-4 text-black/44" />
                        )}
                      </button>
                    </div>
                  );
                })}

                {filteredDimensions.length === 0 ? (
                  <div className="grid min-h-[14rem] place-items-center px-6 text-center">
                    <div>
                      <Database className="mx-auto h-10 w-10 text-black/18" />
                      <p className="mt-4 text-[0.95rem] font-medium tracking-[-0.02em] text-black/46">
                        {selectedCategories.length === 0
                          ? "No reference groups selected"
                          : `No dimensions found for "${searchQuery}"`}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
