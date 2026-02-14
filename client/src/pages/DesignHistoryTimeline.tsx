import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, Palette, Users, Landmark, X, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RelatedTools } from '@/components/studio/RelatedTools';

interface DesignPeriod {
  id: string;
  name: string;
  startYear: number;
  endYear: number | null;
  region: string;
  description: string;
  characteristics: string[];
  keyFigures?: string[];
  notableWorks?: string[];
  imageUrl: string;
  gallery?: string[]; // Array of interior/exterior images
  colors: string[];
}

const DESIGN_PERIODS: DesignPeriod[] = [
  // ANCIENT
  {
    id: 'ancient-egypt',
    name: 'Ancient Egyptian',
    startYear: -3000,
    endYear: -30,
    region: 'Egypt',
    description: 'Monumental architecture, hieroglyphics, symmetry, columns, massive stone construction',
    characteristics: ['Monumentality', 'Symmetry', 'Religious symbolism', 'Stone construction'],
    keyFigures: ['Imhotep'],
    notableWorks: ['Great Pyramids of Giza', 'Temple of Karnak', 'Abu Simbel'],
    imageUrl: '/assets/design-history/RbmPrTmOJuyxCrBB.jpg',
    gallery: ['/assets/design-history/RbmPrTmOJuyxCrBB.jpg', '/android-chrome-512x512.png'],
    colors: ['#D4AF37', '#8B4513', '#F4E4C1', '#2C1810', '#E8D4A8']
  },
  {
    id: 'ancient-greece',
    name: 'Ancient Greek',
    startYear: -800,
    endYear: -146,
    region: 'Greece',
    description: 'Classical orders (Doric, Ionic, Corinthian), proportion, harmony, democracy reflected in public spaces',
    characteristics: ['Classical orders', 'Proportion', 'Harmony', 'Democratic spaces'],
    keyFigures: ['Iktinos', 'Kallikrates', 'Phidias'],
    notableWorks: ['Parthenon', 'Temple of Athena Nike', 'Erechtheion'],
    imageUrl: '/assets/design-history/DbKsoYfWnwCnXBtw.png',
    gallery: ['/assets/design-history/DbKsoYfWnwCnXBtw.png', '/android-chrome-512x512.png'],
    colors: ['#FFFFFF', '#F5F5DC', '#4A90E2', '#8B0000', '#DAA520']
  },
  {
    id: 'ancient-rome',
    name: 'Ancient Roman',
    startYear: -500,
    endYear: 476,
    region: 'Roman Empire',
    description: 'Engineering innovations (arches, vaults, concrete), aqueducts, amphitheaters, urban planning',
    characteristics: ['Arches and vaults', 'Concrete', 'Engineering', 'Urban planning'],
    keyFigures: ['Vitruvius'],
    notableWorks: ['Colosseum', 'Pantheon', 'Roman aqueducts', 'Forum'],
    imageUrl: '/assets/design-history/lUGVcqGkgPAPTBTm.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#8B0000', '#DAA520', '#F5DEB3', '#8B4513', '#2F4F4F']
  },

  // MEDIEVAL
  {
    id: 'byzantine',
    name: 'Byzantine',
    startYear: 330,
    endYear: 1453,
    region: 'Byzantine Empire',
    description: 'Domes, mosaics, religious iconography, centralized plans, rich decoration',
    characteristics: ['Domes', 'Mosaics', 'Religious iconography', 'Rich decoration'],
    notableWorks: ['Hagia Sophia', 'San Vitale', 'St. Mark\'s Basilica'],
    imageUrl: '/assets/design-history/NNliXuwYhdKvklLt.webp',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FFD700', '#4B0082', '#8B0000', '#00008B', '#228B22']
  },
  {
    id: 'gothic',
    name: 'Gothic',
    startYear: 1150,
    endYear: 1500,
    region: 'Western Europe',
    description: 'Pointed arches, ribbed vaults, flying buttresses, large stained glass windows, verticality',
    characteristics: ['Pointed arches', 'Flying buttresses', 'Stained glass', 'Verticality'],
    notableWorks: ['Notre-Dame de Paris', 'Chartres Cathedral', 'Cologne Cathedral'],
    imageUrl: '/assets/design-history/VftWcDsYMgyyGqcn.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#4169E1', '#DC143C', '#FFD700', '#4B0082', '#2F4F4F']
  },

  // RENAISSANCE & BAROQUE
  {
    id: 'renaissance',
    name: 'Renaissance',
    startYear: 1400,
    endYear: 1600,
    region: 'Italy, Europe',
    description: 'Revival of classical principles, symmetry, proportion, perspective, humanism',
    characteristics: ['Classical revival', 'Symmetry', 'Proportion', 'Humanism'],
    keyFigures: ['Brunelleschi', 'Alberti', 'Michelangelo', 'Palladio'],
    notableWorks: ['Florence Cathedral dome', 'St. Peter\'s Basilica', 'Villa Rotonda'],
    imageUrl: '/assets/design-history/LvbmuucdrZuhcsEq.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#8B4513', '#D4AF37', '#F5DEB3', '#8B0000', '#2F4F4F']
  },
  {
    id: 'baroque',
    name: 'Baroque',
    startYear: 1600,
    endYear: 1750,
    region: 'Europe',
    description: 'Drama, grandeur, contrast, curved forms, ornate decoration, theatricality',
    characteristics: ['Drama', 'Grandeur', 'Curved forms', 'Ornate decoration'],
    keyFigures: ['Bernini', 'Borromini', 'Wren'],
    notableWorks: ['St. Peter\'s Square', 'Palace of Versailles', 'St. Paul\'s Cathedral'],
    imageUrl: '/assets/design-history/czlAbJQAwJbYKQsB.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FFD700', '#8B0000', '#4B0082', '#F5DEB3', '#2F4F4F']
  },
  {
    id: 'rococo',
    name: 'Rococo',
    startYear: 1700,
    endYear: 1780,
    region: 'France, Europe',
    description: 'Lightness, elegance, playfulness, ornate decoration, pastel colors, asymmetry',
    characteristics: ['Lightness', 'Elegance', 'Ornate', 'Asymmetry'],
    notableWorks: ['Hôtel de Soubise', 'Sanssouci Palace', 'Amalienburg'],
    imageUrl: '/assets/design-history/hGkKoYbTvBtkIBcZ.jpeg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FFB6C1', '#E6E6FA', '#FFFACD', '#F0E68C', '#DDA0DD']
  },

  // NEOCLASSICAL
  {
    id: 'neoclassical',
    name: 'Neoclassical',
    startYear: 1750,
    endYear: 1850,
    region: 'Europe, Americas',
    description: 'Return to classical Greek and Roman principles, simplicity, order, symmetry',
    characteristics: ['Classical revival', 'Simplicity', 'Order', 'Symmetry'],
    keyFigures: ['Robert Adam', 'Thomas Jefferson', 'Karl Friedrich Schinkel'],
    notableWorks: ['Panthéon Paris', 'Brandenburg Gate', 'US Capitol'],
    imageUrl: '/assets/design-history/GBVaYMkMjQCMvEMu.webp',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#F5F5F5', '#DAA520', '#8B4513', '#2F4F4F', '#696969']
  },
  {
    id: 'gothic-revival',
    name: 'Gothic Revival',
    startYear: 1830,
    endYear: 1900,
    region: 'Britain, US',
    description: 'Romantic revival of medieval Gothic, pointed arches, picturesque, nationalism',
    characteristics: ['Medieval revival', 'Pointed arches', 'Picturesque', 'Romantic'],
    keyFigures: ['Augustus Pugin', 'John Ruskin'],
    notableWorks: ['Palace of Westminster', 'St. Patrick\'s Cathedral NYC'],
    imageUrl: '/assets/design-history/PPdIZEpdIrPbrtfJ.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#8B4513', '#2F4F4F', '#FFD700', '#8B0000', '#4B0082']
  },

  // 19TH CENTURY
  {
    id: 'beaux-arts',
    name: 'Beaux-Arts',
    startYear: 1830,
    endYear: 1920,
    region: 'France, US',
    description: 'Academic classical design, grandeur, elaborate ornament, symmetry, hierarchy of spaces',
    characteristics: ['Academic classicism', 'Grandeur', 'Elaborate ornament', 'Symmetry'],
    notableWorks: ['Paris Opera', 'Grand Central Terminal', 'Boston Public Library'],
    imageUrl: '/assets/design-history/lnTAmiYAuwXmFuNI.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#F5F5DC', '#DAA520', '#8B4513', '#2F4F4F', '#FFD700']
  },
  {
    id: 'arts-crafts',
    name: 'Arts & Crafts',
    startYear: 1860,
    endYear: 1910,
    region: 'Britain, US',
    description: 'Reaction to industrialization, handcraft, natural materials, simplicity, medieval inspiration',
    characteristics: ['Handcraft', 'Natural materials', 'Simplicity', 'Anti-industrial'],
    keyFigures: ['William Morris', 'Charles Rennie Mackintosh'],
    notableWorks: ['Red House', 'Glasgow School of Art'],
    imageUrl: '/assets/design-history/BQcdOdbkTzdxYHox.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#8B4513', '#556B2F', '#D2691E', '#8B7355', '#A0522D']
  },
  {
    id: 'art-nouveau',
    name: 'Art Nouveau',
    startYear: 1890,
    endYear: 1910,
    region: 'Europe',
    description: 'Organic forms, flowing lines, nature motifs, craftsmanship, decorative arts integration',
    characteristics: ['Organic forms', 'Flowing lines', 'Nature motifs', 'Decorative arts'],
    keyFigures: ['Victor Horta', 'Antoni Gaudí', 'Hector Guimard'],
    notableWorks: ['Hôtel Tassel', 'Sagrada Família', 'Paris Métro entrances'],
    imageUrl: '/assets/design-history/aEVpyRsNZldTYJFQ.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#556B2F', '#DAA520', '#8B4513', '#9370DB', '#2F4F4F']
  },

  // EARLY MODERNISM
  {
    id: 'chicago-school',
    name: 'Chicago School',
    startYear: 1880,
    endYear: 1910,
    region: 'Chicago, US',
    description: 'Early skyscrapers, steel frame construction, large windows, commercial architecture',
    characteristics: ['Skyscrapers', 'Steel frame', 'Large windows', 'Commercial'],
    keyFigures: ['Louis Sullivan', 'Daniel Burnham', 'John Root'],
    notableWorks: ['Wainwright Building', 'Monadnock Building', 'Carson Pirie Scott'],
    imageUrl: '/assets/design-history/acGEcUWOIukdPmzh.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#8B4513', '#2F4F4F', '#696969', '#A9A9A9', '#BC8F8F']
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    startYear: 1920,
    endYear: 1940,
    region: 'Global',
    description: 'Geometric decoration, luxury, glamour, modern materials, streamlined forms',
    characteristics: ['Geometric ornament', 'Luxury', 'Streamlined', 'Modern materials'],
    keyFigures: ['William Van Alen', 'Raymond Hood'],
    notableWorks: ['Chrysler Building', 'Rockefeller Center', 'Radio City Music Hall'],
    imageUrl: '/assets/design-history/QeCJmseOsSWUfkJM.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FFD700', '#000000', '#C0C0C0', '#8B0000', '#4B0082']
  },

  // HIGH MODERNISM
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    startYear: 1919,
    endYear: 1933,
    region: 'Germany',
    description: 'Form follows function, integration of art and technology, simplicity, functionalism',
    characteristics: ['Functionalism', 'Geometric', 'Integration of arts', 'Modern materials'],
    keyFigures: ['Walter Gropius', 'Ludwig Mies van der Rohe', 'Marcel Breuer'],
    notableWorks: ['Bauhaus Dessau', 'Fagus Factory', 'Barcelona Pavilion'],
    imageUrl: '/assets/design-history/pvxoMjhiZWiJmLhB.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FF0000', '#FFFF00', '#0000FF', '#000000', '#FFFFFF']
  },
  {
    id: 'de-stijl',
    name: 'De Stijl',
    startYear: 1917,
    endYear: 1931,
    region: 'Netherlands',
    description: 'Abstraction, primary colors, horizontal and vertical lines, simplification',
    characteristics: ['Abstraction', 'Primary colors', 'Orthogonal', 'Simplification'],
    keyFigures: ['Gerrit Rietveld', 'Theo van Doesburg', 'Piet Mondrian'],
    notableWorks: ['Rietveld Schröder House', 'Café Aubette'],
    imageUrl: '/assets/design-history/bDdhpiAtpdkaawTj.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FF0000', '#FFFF00', '#0000FF', '#000000', '#FFFFFF']
  },
  {
    id: 'international-style',
    name: 'International Style',
    startYear: 1920,
    endYear: 1970,
    region: 'Global',
    description: 'Universal design language, flat roofs, ribbon windows, no ornamentation, open floor plans',
    characteristics: ['Universal', 'Flat roofs', 'Ribbon windows', 'No ornament'],
    keyFigures: ['Le Corbusier', 'Mies van der Rohe', 'Walter Gropius'],
    notableWorks: ['Villa Savoye', 'Seagram Building', 'Farnsworth House'],
    imageUrl: '/assets/design-history/IcMZkSYDKQaELpEn.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FFFFFF', '#000000', '#808080', '#A9A9A9', '#2F4F4F']
  },

  // MID-CENTURY & LATE MODERN
  {
    id: 'mid-century-modern',
    name: 'Mid-Century Modern',
    startYear: 1945,
    endYear: 1970,
    region: 'US, Global',
    description: 'Clean lines, organic forms, integration with nature, open plans, new materials',
    characteristics: ['Clean lines', 'Organic forms', 'Indoor-outdoor', 'New materials'],
    keyFigures: ['Eero Saarinen', 'Richard Neutra', 'Charles & Ray Eames'],
    notableWorks: ['Farnsworth House', 'Case Study Houses', 'TWA Terminal'],
    imageUrl: '/assets/design-history/IssWaEOXGirXkQMp.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#D2691E', '#8B4513', '#556B2F', '#F4A460', '#2F4F4F']
  },
  {
    id: 'brutalism',
    name: 'Brutalism',
    startYear: 1950,
    endYear: 1980,
    region: 'Global',
    description: 'Raw concrete (béton brut), massive forms, fortress-like, honesty of materials, social housing',
    characteristics: ['Raw concrete', 'Massive forms', 'Fortress-like', 'Honesty'],
    keyFigures: ['Le Corbusier', 'Paul Rudolph', 'Denys Lasdun'],
    notableWorks: ['Unité d\'Habitation', 'Yale Art & Architecture', 'National Theatre London'],
    imageUrl: '/assets/design-history/fRzNIDPKmYRapEBE.webp',
    gallery: ['/assets/design-history/fRzNIDPKmYRapEBE.webp', '/android-chrome-512x512.png'],
    colors: ['#696969', '#808080', '#A9A9A9', '#556B2F', '#2F4F4F']
  },
  {
    id: 'metabolism',
    name: 'Metabolism',
    startYear: 1960,
    endYear: 1975,
    region: 'Japan',
    description: 'Organic growth, flexibility, prefabrication, capsule architecture, megastructures',
    characteristics: ['Organic growth', 'Flexible', 'Prefab', 'Megastructures'],
    keyFigures: ['Kenzo Tange', 'Kisho Kurokawa', 'Fumihiko Maki'],
    notableWorks: ['Nakagin Capsule Tower', 'Osaka Expo \'70', 'Yamanashi Press Center'],
    imageUrl: '/assets/design-history/RJEMBMLKcHkLRVNI.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#FF6347', '#696969', '#F5F5F5', '#000000', '#FFD700']
  },
  {
    id: 'high-tech',
    name: 'High-Tech',
    startYear: 1970,
    endYear: 1990,
    region: 'Global',
    description: 'Exposed structure, industrial materials, technology celebration, flexibility, services visible',
    characteristics: ['Exposed structure', 'Industrial aesthetic', 'Technology', 'Flexibility'],
    keyFigures: ['Norman Foster', 'Richard Rogers', 'Renzo Piano'],
    notableWorks: ['Pompidou Centre', 'Lloyd\'s Building', 'HSBC Building Hong Kong'],
    imageUrl: '/assets/design-history/VSBJrsysMOKnOsBP.jpg',
    gallery: ['/android-chrome-512x512.png', '/android-chrome-512x512.png'],
    colors: ['#4169E1', '#C0C0C0', '#FF0000', '#FFFF00', '#000000']
  },

  // POSTMODERN & CONTEMPORARY
  {
    id: 'postmodernism',
    name: 'Postmodernism',
    startYear: 1970,
    endYear: 1995,
    region: 'Global',
    description: 'Reaction to modernism, historical references, ornamentation, irony, pluralism, color',
    characteristics: ['Historical references', 'Ornamentation', 'Irony', 'Pluralism'],
    keyFigures: ['Robert Venturi', 'Michael Graves', 'Philip Johnson'],
    notableWorks: ['Vanna Venturi House', 'Portland Building', 'AT&T Building'],
    imageUrl: '/assets/design-history/PqxEdKXDmTyKCSMp.jpg',
    gallery: ['/assets/design-history/PqxEdKXDmTyKCSMp.jpg', '/android-chrome-512x512.png'],
    colors: ['#FF69B4', '#00CED1', '#FFD700', '#9370DB', '#FF6347']
  },
  {
    id: 'deconstructivism',
    name: 'Deconstructivism',
    startYear: 1980,
    endYear: 2000,
    region: 'Global',
    description: 'Fragmented forms, non-rectilinear shapes, distortion, controlled chaos, challenging norms',
    characteristics: ['Fragmented', 'Non-rectilinear', 'Distorted', 'Chaotic'],
    keyFigures: ['Frank Gehry', 'Zaha Hadid', 'Daniel Libeskind'],
    notableWorks: ['Guggenheim Bilbao', 'Vitra Fire Station', 'Jewish Museum Berlin'],
    imageUrl: '/assets/design-history/vQYjuUJkeUFnrMms.jpg',
    gallery: ['/assets/design-history/vQYjuUJkeUFnrMms.jpg', '/android-chrome-512x512.png'],
    colors: ['#C0C0C0', '#696969', '#FF6347', '#4169E1', '#000000']
  },
  {
    id: 'minimalism',
    name: 'Minimalism',
    startYear: 1980,
    endYear: 2010,
    region: 'Global',
    description: 'Simplicity, essential elements only, clean lines, neutral colors, spatial clarity',
    characteristics: ['Simplicity', 'Essential', 'Clean lines', 'Spatial clarity'],
    keyFigures: ['Tadao Ando', 'John Pawson', 'Alberto Campo Baeza'],
    notableWorks: ['Church of the Light', 'Nový Dvůr Monastery', 'House of the Infinite'],
    imageUrl: '/assets/design-history/VvjMYiUCNlvMjBex.jpg',
    gallery: ['/assets/design-history/VvjMYiUCNlvMjBex.jpg', '/android-chrome-512x512.png'],
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#BEBEBE', '#808080']
  },
  {
    id: 'parametricism',
    name: 'Parametricism',
    startYear: 2000,
    endYear: null,
    region: 'Global',
    description: 'Digital design, algorithms, complex curved forms, variation, computational design',
    characteristics: ['Digital', 'Algorithmic', 'Complex curves', 'Computational'],
    keyFigures: ['Zaha Hadid', 'Patrik Schumacher', 'Greg Lynn'],
    notableWorks: ['Heydar Aliyev Center', 'Galaxy SOHO', 'Broad Museum'],
    imageUrl: '/assets/design-history/pRlmxVHihDSUETbk.jpg',
    gallery: ['/assets/design-history/pRlmxVHihDSUETbk.jpg', '/android-chrome-512x512.png'],
    colors: ['#FFFFFF', '#4169E1', '#C0C0C0', '#FF6347', '#000000']
  },
  {
    id: 'sustainable',
    name: 'Sustainable Architecture',
    startYear: 1990,
    endYear: null,
    region: 'Global',
    description: 'Environmental responsibility, energy efficiency, green building, renewable materials, LEED',
    characteristics: ['Environmental', 'Energy efficient', 'Green building', 'Renewable'],
    keyFigures: ['Norman Foster', 'Renzo Piano', 'Ken Yeang'],
    notableWorks: ['California Academy of Sciences', 'The Edge Amsterdam', 'ACROS Fukuoka'],
    imageUrl: '/assets/design-history/CqArXWEqrtDSspXH.jpg',
    gallery: ['/assets/design-history/CqArXWEqrtDSspXH.jpg', '/android-chrome-512x512.png'],
    colors: ['#228B22', '#8FBC8F', '#F5F5DC', '#6B8E23', '#2F4F4F']
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    startYear: 2010,
    endYear: null,
    region: 'Global',
    description: 'Diverse approaches, sustainability, technology integration, parametric design, biophilic design',
    characteristics: ['Diversity', 'Sustainability', 'Technology', 'Biophilic'],
    keyFigures: ['Bjarke Ingels', 'Shigeru Ban', 'Thomas Heatherwick'],
    notableWorks: ['The Shed NYC', 'VIA 57 West', 'Vessel Hudson Yards'],
    imageUrl: '/assets/design-history/pRLceAvYAVIDlvJR.jpg',
    gallery: ['/assets/design-history/pRLceAvYAVIDlvJR.jpg', '/android-chrome-512x512.png'],
    colors: ['#4169E1', '#32CD32', '#FFD700', '#FF6347', '#000000']
  },
];



export default function DesignHistoryTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPeriods = DESIGN_PERIODS.filter(period =>
    searchQuery === '' ||
    period.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    period.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    period.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    period.characteristics.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatYear = (year: number | null) => {
    if (year === null) return 'Present';
    if (year < 0) return `${Math.abs(year)} BCE`;
    return year.toString();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Compact Hero with Header Image */}
      <section className="relative h-[30vh] md:h-[35vh] overflow-hidden border-b border-border">
        <img
          src="/assets/studio/design-history.webp"
          alt="Design History Timeline - Architectural design through history"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

        <div className="absolute bottom-0 left-0 right-0 container max-w-5xl pb-4 md:pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#9C27B0]" />
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              DESIGN HISTORY TIMELINE
            </span>
            <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-full">
              BETA
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2">
            Architectural Design Through History
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Explore 28 design periods from Ancient Egypt to Contemporary. Click any period to view reference images, characteristics, and key figures.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container max-w-5xl py-6 md:py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search periods, regions, or characteristics..."
              className="w-full h-10 pl-10 pr-4 bg-background border border-input rounded-md text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredPeriods.length} periods found
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-black/10 dark:bg-white/10 hidden md:block" />

          {/* Timeline Items */}
          <div className="space-y-6">
            {filteredPeriods.map((period, index) => {
              const isExpanded = expandedId === period.id;

              return (
                <motion.div
                  key={period.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-6 top-8 w-5 h-5 rounded-full border-2 transition-all z-10 hidden md:block ${isExpanded
                      ? 'border-black dark:border-white bg-black dark:bg-white scale-125'
                      : 'border-black/20 dark:border-white/20 bg-white dark:bg-black'
                      }`}
                  />

                  {/* Compact Card */}
                  <button
                    onClick={() => toggleExpand(period.id)}
                    className={`w-full text-left md:ml-16 bg-neutral-200/60 dark:bg-neutral-900/60 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all ${isExpanded
                      ? 'border-black dark:border-white shadow-lg'
                      : 'border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                      }`}
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      {/* Thumbnail */}
                      <div className="w-full md:w-[200px] flex-shrink-0 aspect-video md:aspect-square overflow-hidden rounded-2xl">
                        <img
                          src={period.imageUrl}
                          alt={period.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Summary Info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-pixel text-[10px] tracking-[0.2em] text-black/40 dark:text-white/40 mb-2">
                            {formatYear(period.startYear)} - {formatYear(period.endYear)}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-display italic mb-2">{period.name}</h3>
                          <div className="text-sm text-black/60 dark:text-white/60 mb-4 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" />
                            {period.region}
                          </div>

                          {/* Mini Color Palette */}
                          <div className="flex gap-1.5">
                            {period.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Expand Icon */}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-6 h-6 text-black/40 dark:text-white/40" />
                        </motion.div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="overflow-hidden md:ml-16"
                      >
                        <div className="bg-neutral-200/60 dark:bg-neutral-900/60 backdrop-blur-xl border-x border-b border-black/10 dark:border-white/10 rounded-b-3xl p-8 md:p-12 space-y-8">

                          {/* Image Gallery */}
                          {period.gallery && period.gallery.length > 0 ? (
                            <div>
                              <div className="font-pixel text-[10px] tracking-[0.3em] text-black/40 dark:text-white/40 mb-4">REFERENCE IMAGES</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {period.gallery.map((imageUrl, idx) => (
                                  <div key={idx} className="aspect-[16/9] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                                    <img
                                      src={imageUrl}
                                      alt={`${period.name} - Image ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-[21/9] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                              <img
                                src={period.imageUrl}
                                alt={period.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {/* Color Palette */}
                          <div>
                            <div className="font-pixel text-[10px] tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 flex items-center gap-2">
                              <Palette className="w-3.5 h-3.5" />
                              COLOR PALETTE
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                              {period.colors.map((color, index) => (
                                <div key={index} className="space-y-2">
                                  <div
                                    className="h-20 rounded-2xl border border-black/10 dark:border-white/10"
                                    style={{ backgroundColor: color }}
                                  />
                                  <div className="text-[10px] font-mono text-center text-black/60 dark:text-white/60">
                                    {color}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <div className="font-pixel text-[10px] tracking-[0.3em] text-black/40 dark:text-white/40 mb-3">OVERVIEW</div>
                            <p className="text-lg leading-relaxed">{period.description}</p>
                          </div>

                          {/* Two Column Layout for Details */}
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-8">
                              {/* Characteristics */}
                              <div>
                                <div className="font-pixel text-[10px] tracking-[0.3em] text-black/40 dark:text-white/40 mb-4">KEY CHARACTERISTICS</div>
                                <div className="flex flex-wrap gap-2">
                                  {period.characteristics.map(char => (
                                    <span
                                      key={char}
                                      className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-sm"
                                    >
                                      {char}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Key Figures */}
                              {period.keyFigures && period.keyFigures.length > 0 && (
                                <div>
                                  <div className="font-pixel text-[10px] tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5" />
                                    KEY FIGURES
                                  </div>
                                  <div className="space-y-2">
                                    {period.keyFigures.map(figure => (
                                      <div key={figure} className="text-black/70 dark:text-white/70">• {figure}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Column */}
                            <div>
                              {/* Notable Works */}
                              {period.notableWorks && period.notableWorks.length > 0 && (
                                <div>
                                  <div className="font-pixel text-[10px] tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 flex items-center gap-2">
                                    <Landmark className="w-3.5 h-3.5" />
                                    NOTABLE WORKS
                                  </div>
                                  <div className="space-y-2">
                                    {period.notableWorks.map(work => (
                                      <div key={work} className="text-black/70 dark:text-white/70">• {work}</div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Close Button */}
                          <button
                            onClick={() => setExpandedId(null)}
                            className="w-full py-4 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl transition-all flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            <span className="font-pixel text-[10px] tracking-[0.2em]">CLOSE</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {filteredPeriods.length === 0 && (
              <div className="text-center py-12 text-black/60 dark:text-white/60">
                No periods found matching your search
              </div>
            )}
          </div>
        </div>

        {/* More Apps Section */}
        <RelatedTools currentToolId="design-history-timeline" />
      </section>

      <Footer />
    </div>
  );
}
