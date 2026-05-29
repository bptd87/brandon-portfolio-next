"use client";

import { useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, MapPin, Palette, Search, Shuffle } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { copyTextToClipboard } from '@/lib/clipboard';
import { Link } from 'wouter';

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

type EraFilter = 'all' | 'ancient-medieval' | 'renaissance-19th' | 'modernism' | 'contemporary';

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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/rbmprtmojuyxcrbb-992ebc8c.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/rbmprtmojuyxcrbb-992ebc8c.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/dbksoyfwnwcnxbtw-46caea6c.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/dbksoyfwnwcnxbtw-46caea6c.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/lugvcqgkgpaptbtm-6073f34e.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/nnlixuwyhdkvkllt-3cb44291.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/vftwcdsymgyygqcn-43418943.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/lvbmuucdrzuhcseq-609e3d7a.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/czlabjqawjbykqsb-5c02977c.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/hgkkoybtvbtkibcz-74a2fed2.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/gbvaymkmjqcmvemu-a03fb964.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/ppdizepdirpbrtfj-f4552b60.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/lntamiyauwxmfuni-7451273e.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/bqcdodbktzdxyhox-7e3e639a.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/aevpyrsnzldtyjfq-3d6507ea.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/acgecuwoiukdpmzh-f65bedb0.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/qecjmseosswufkjm-6cab652e.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/pvxomjhizwijmlhb-9dc33504.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/bddhpiatpdkaawtj-467bdab3.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/icmzksydkqaelpen-2fe83857.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/isswaeoxgirxkqmp-b5497136.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/frznidpkmyrapebe-408ec951.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/frznidpkmyrapebe-408ec951.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/rjembmlkchklrvni-6903e637.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/vsbjrsysmoknosbp-9e221c7a.webp',
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/pqxedkxdmtykcsmp-0972bcc1.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/pqxedkxdmtykcsmp-0972bcc1.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/vqyjuujkeufnrmms-4c9e50c9.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/vqyjuujkeufnrmms-4c9e50c9.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/vvjmyiucnlvmjbex-14aeb0f5.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/vvjmyiucnlvmjbex-14aeb0f5.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/prlmxvhihdsuetbk-a92ba45f.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/prlmxvhihdsuetbk-a92ba45f.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/cqarxweqrtdsspxh-f64acd28.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/cqarxweqrtdsspxh-f64acd28.webp', '/android-chrome-512x512.png'],
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
    imageUrl: 'https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/prlceavyavidlvjr-23ec3634.webp',
    gallery: ['https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/apps/design-history-timeline/prlceavyavidlvjr-23ec3634.webp', '/android-chrome-512x512.png'],
    colors: ['#4169E1', '#32CD32', '#FFD700', '#FF6347', '#000000']
  },
];

const ERA_OPTIONS: Array<{ id: EraFilter; label: string; matches: (period: DesignPeriod) => boolean }> = [
  {
    id: 'all',
    label: 'All periods',
    matches: () => true,
  },
  {
    id: 'ancient-medieval',
    label: 'Ancient to Medieval',
    matches: (period) => period.startYear < 1400,
  },
  {
    id: 'renaissance-19th',
    label: 'Renaissance to 19th C.',
    matches: (period) => period.startYear >= 1400 && period.startYear < 1900,
  },
  {
    id: 'modernism',
    label: 'Modernism',
    matches: (period) => period.startYear >= 1900 && period.startYear < 1970,
  },
  {
    id: 'contemporary',
    label: 'Late 20th to now',
    matches: (period) => period.startYear >= 1970,
  },
];



export default function DesignHistoryTimeline() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<EraFilter>('all');
  const [selectedPeriodId, setSelectedPeriodId] = useState(DESIGN_PERIODS[0]?.id ?? '');
  const [copied, setCopied] = useState(false);

  const activeEra = ERA_OPTIONS.find((option) => option.id === selectedEra) || ERA_OPTIONS[0];

  const filteredPeriods = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return DESIGN_PERIODS.filter((period) => {
      const matchesSearch =
        normalizedQuery === '' ||
        period.name.toLowerCase().includes(normalizedQuery) ||
        period.region.toLowerCase().includes(normalizedQuery) ||
        period.description.toLowerCase().includes(normalizedQuery) ||
        period.characteristics.some((c) => c.toLowerCase().includes(normalizedQuery)) ||
        period.keyFigures?.some((figure) => figure.toLowerCase().includes(normalizedQuery)) ||
        period.notableWorks?.some((work) => work.toLowerCase().includes(normalizedQuery));

      return matchesSearch && activeEra.matches(period);
    });
  }, [activeEra, searchQuery]);

  const selectedPeriod =
    filteredPeriods.find((period) => period.id === selectedPeriodId) ??
    filteredPeriods[0] ??
    null;

  const formatYear = (year: number | null) => {
    if (year === null) return 'Present';
    if (year < 0) return `${Math.abs(year)} BCE`;
    return year.toString();
  };

  const yearRange = selectedPeriod
    ? `${formatYear(selectedPeriod.startYear)} - ${formatYear(selectedPeriod.endYear)}`
    : 'No period';

  const copySelectedPeriod = async () => {
    if (!selectedPeriod) return;

    const copiedText = await copyTextToClipboard(
      `${selectedPeriod.name} (${yearRange}) - ${selectedPeriod.region}. ${selectedPeriod.description}`
    );

    if (copiedText) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  };

  const openRandomPeriod = () => {
    if (filteredPeriods.length === 0) return;
    const randomPeriod = filteredPeriods[Math.floor(Math.random() * filteredPeriods.length)];
    setSelectedPeriodId(randomPeriod.id);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        document.getElementById(`design-period-${randomPeriod.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      });
    }
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f3eee4] text-black">
      <SEO
        title="Design History Timeline"
        description="A mobile studio reference for design periods, palettes, regions, figures, and historical context."
      />

      <main className="studio-app-main box-border h-full overflow-hidden px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.55rem)] sm:px-4 md:px-5">
        <section className="relative mx-auto flex h-full max-w-[29rem] flex-col overflow-hidden">
          <header className="studio-app-mobile-topbar grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center">
            <Link
              href="/studio/apps"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff5f57] text-[#65110f] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18),0_10px_24px_rgba(255,95,87,0.18)]"
              aria-label="Back to Studio Apps"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black/50">
              History
            </p>
            <button
              type="button"
              onClick={copySelectedPeriod}
              className="ml-auto flex h-8 w-8 items-center justify-center bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-opacity hover:opacity-88"
              aria-label="Copy selected period"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pt-1">
            <section className="shrink-0 overflow-hidden border border-black/10 bg-[#fbf7ef] shadow-[0_24px_70px_rgba(58,45,31,0.16),inset_0_1px_rgba(255,255,255,0.75)]">
              {selectedPeriod ? (
                <>
                  <div className="grid grid-cols-[8.1rem_minmax(0,1fr)] gap-3 p-3">
                    <div className="aspect-[4/5] overflow-hidden border border-black/10 bg-[#ebe5d8]">
                      <img
                        src={selectedPeriod.imageUrl}
                        alt={selectedPeriod.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#f26a1b]">
                        {yearRange}
                      </div>
                      <h1 className="mt-2 font-sans text-[clamp(1.8rem,7vw,3.15rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-black">
                        {selectedPeriod.name}
                      </h1>
                      <div className="mt-2 flex items-center gap-1.5 text-[0.72rem] font-semibold tracking-[-0.02em] text-black/46">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{selectedPeriod.region}</span>
                      </div>
                      <p className="mt-3 max-h-[4.25rem] overflow-hidden text-[0.78rem] font-medium leading-snug tracking-[-0.02em] text-black/58">
                        {selectedPeriod.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-black/10 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Palette className="h-3.5 w-3.5 text-black/35" />
                      <div className="flex min-w-0 flex-1 gap-1.5">
                        {selectedPeriod.colors.slice(0, 5).map((color) => (
                          <span
                            key={color}
                            className="h-5 flex-1 border border-black/10"
                            style={{ backgroundColor: color }}
                            aria-label={color}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
                      {selectedPeriod.characteristics.map((characteristic) => (
                        <span
                          key={characteristic}
                          className="shrink-0 bg-[#ebe5d8] px-2 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-black/48"
                        >
                          {characteristic}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid min-h-[13rem] place-items-center p-6 text-center text-black/45">
                  No period selected
                </div>
              )}
            </section>

            <section className="shrink-0 border border-black/10 bg-[#fbf7ef] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <label className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border border-black/10 bg-[#f3eee4] px-3">
                  <Search className="h-4 w-4 text-black/46" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search period, region, figure"
                    className="h-11 min-w-0 bg-transparent text-[0.92rem] font-medium tracking-[-0.02em] text-black outline-none placeholder:text-black/34"
                    aria-label="Search design history"
                  />
                </label>
                <button
                  type="button"
                  onClick={openRandomPeriod}
                  className="flex h-11 items-center gap-2 bg-[#f26a1b] px-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-88"
                >
                  <Shuffle className="h-4 w-4" />
                  Pick
                </button>
              </div>

              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {ERA_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedEra(option.id);
                      setSelectedPeriodId('');
                    }}
                    className={`h-8 shrink-0 border px-3 text-[0.58rem] font-semibold uppercase tracking-[0.13em] transition-colors ${
                      selectedEra === option.id
                        ? 'border-black bg-black text-white'
                        : 'border-black/10 bg-[#ebe5d8] text-black/48 hover:bg-[#f3eee4]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex min-h-0 flex-1 flex-col border border-black/10 bg-[#fbf7ef] shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              <div className="grid shrink-0 grid-cols-[1fr_auto] items-center gap-3 border-b border-black/10 px-3 py-2">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/44">
                  {filteredPeriods.length} periods
                </p>
                {(searchQuery || selectedEra !== 'all') ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedEra('all');
                      setSelectedPeriodId(DESIGN_PERIODS[0]?.id ?? '');
                    }}
                    className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/42 transition-colors hover:text-black"
                  >
                    Reset
                  </button>
                ) : (
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-black/38">
                    Tap to view
                  </p>
                )}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {filteredPeriods.map((period) => {
                  const isSelected = selectedPeriod?.id === period.id;
                  const range = `${formatYear(period.startYear)} - ${formatYear(period.endYear)}`;

                  return (
                    <button
                      key={period.id}
                      id={`design-period-${period.id}`}
                      type="button"
                      onClick={() => setSelectedPeriodId(period.id)}
                      className={`grid w-full grid-cols-[4.75rem_minmax(0,1fr)] gap-3 border-b border-black/10 px-3 py-3 text-left transition-colors ${
                        isSelected ? 'bg-[#f3eee4]' : 'hover:bg-[#f3eee4]'
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden border border-black/10 bg-[#ebe5d8]">
                        <img
                          src={period.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="min-w-0">
                        <span className="block truncate text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[#f26a1b]">
                          {range}
                        </span>
                        <span className="mt-1 block truncate text-[1.02rem] font-semibold leading-none tracking-[-0.04em] text-black">
                          {period.name}
                        </span>
                        <span className="mt-1.5 block truncate text-[0.74rem] font-medium tracking-[-0.02em] text-black/48">
                          {period.region}
                        </span>
                        <span className="mt-2 flex gap-1">
                          {period.colors.slice(0, 5).map((color) => (
                            <span
                              key={color}
                              className="h-2.5 flex-1 border border-black/10"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </span>
                      </span>
                    </button>
                  );
                })}

                {filteredPeriods.length === 0 ? (
                  <div className="grid min-h-[14rem] place-items-center px-6 text-center">
                    <p className="text-[0.95rem] font-medium tracking-[-0.02em] text-black/46">
                      No periods found for "{searchQuery}"
                    </p>
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
