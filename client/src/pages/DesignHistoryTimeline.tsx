"use client";

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, Palette, Users, Landmark, ChevronDown, Shuffle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<EraFilter>('all');

  const activeEra = ERA_OPTIONS.find((option) => option.id === selectedEra) || ERA_OPTIONS[0];

  const filteredPeriods = useMemo(() => {
    return DESIGN_PERIODS.filter((period) => {
      const matchesSearch =
        searchQuery === '' ||
        period.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        period.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        period.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        period.characteristics.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch && activeEra.matches(period);
    });
  }, [activeEra, searchQuery]);

  const formatYear = (year: number | null) => {
    if (year === null) return 'Present';
    if (year < 0) return `${Math.abs(year)} BCE`;
    return year.toString();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openRandomPeriod = () => {
    if (filteredPeriods.length === 0) return;
    const randomPeriod = filteredPeriods[Math.floor(Math.random() * filteredPeriods.length)];
    setExpandedId(randomPeriod.id);
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        document.getElementById(`design-period-${randomPeriod.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="border-b border-border/35 pb-10 pt-24 md:pb-12 md:pt-28">
          <div className="container max-w-5xl">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] text-foreground/45">
                <Calendar className="h-3.5 w-3.5" />
                Design History Timeline
              </div>
              <h1 className="font-sans text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.94] tracking-[-0.06em] text-foreground">
                Design periods, references, and historical context for interiors and architecture.
              </h1>
              <p className="mt-6 max-w-2xl text-[1rem] leading-7 text-foreground/60 md:text-[1.05rem]">
                A working reference library for architectural and interior design history. Search by
                movement, region, or characteristic, then open any period for palette, figures, notable works, and visual reference.
              </p>
            </div>

            <div className="mt-10 border-t border-border/35 pt-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search periods, regions, or characteristics"
                  className="h-12 w-full rounded-full border border-border/45 bg-[#111111] pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/25"
                />
                </label>

                <div className="flex items-center justify-between gap-4 md:justify-end">
                  <p className="text-sm text-foreground/45">{filteredPeriods.length} periods</p>
                  <div className="flex items-center gap-4">
                    {searchQuery || selectedEra !== 'all' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedEra('all');
                        }}
                        className="text-sm text-foreground/55 transition-colors hover:text-foreground"
                      >
                        Reset
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={openRandomPeriod}
                      className="inline-flex h-10 items-center gap-2 rounded-full border border-border/45 bg-[#111111] px-4 text-sm text-foreground/78 transition-colors hover:border-foreground/18 hover:text-foreground"
                    >
                      <Shuffle className="h-4 w-4" />
                      Surprise me
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {ERA_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedEra(option.id)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-[0.86rem] transition-colors ${
                      selectedEra === option.id
                        ? 'border-foreground/20 bg-foreground text-background'
                        : 'border-border/45 bg-[#111111] text-foreground/58 hover:border-foreground/18 hover:text-foreground'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 pt-8 md:pb-28 md:pt-10">
          <div className="container max-w-5xl">
            <div className="space-y-4">
              {filteredPeriods.map((period, index) => {
                const isExpanded = expandedId === period.id;

                return (
                  <motion.div
                    key={period.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.015 }}
                    className="relative"
                    id={`design-period-${period.id}`}
                  >
                    <button
                      onClick={() => toggleExpand(period.id)}
                      className={`w-full overflow-hidden rounded-[1.6rem] border bg-[#1f1f1f] text-left transition-colors ${
                        isExpanded
                          ? 'border-foreground/22'
                          : 'border-border/45 hover:border-foreground/18'
                      }`}
                    >
                      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[8.5rem_minmax(0,1fr)_auto] md:items-center md:gap-6">
                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-black/20 md:w-[8.5rem]">
                          <img
                            src={period.imageUrl}
                            alt={period.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/42">
                            {formatYear(period.startYear)} - {formatYear(period.endYear)}
                          </div>
                          <h2 className="font-sans text-[1.4rem] font-medium tracking-[-0.04em] text-foreground md:text-[1.7rem]">
                            {period.name}
                          </h2>
                          <div className="mt-2 flex items-center gap-2 text-sm text-foreground/54">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{period.region}</span>
                          </div>
                          <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/58 md:text-[0.98rem]">
                            {period.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {period.colors.slice(0, 5).map((color, i) => (
                              <div
                                key={i}
                                className="h-7 w-7 rounded-full border border-white/10"
                                style={{ backgroundColor: color }}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 md:block">
                          <div className="flex flex-wrap gap-2 md:justify-end">
                            {period.characteristics.slice(0, 2).map((characteristic) => (
                              <span
                                key={characteristic}
                                className="rounded-full border border-white/8 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-foreground/52"
                              >
                                {characteristic}
                              </span>
                            ))}
                          </div>

                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="md:mt-8"
                          >
                            <ChevronDown className="h-5 w-5 text-foreground/40" />
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 rounded-[1.6rem] border border-border/45 bg-[#1f1f1f] p-4 sm:p-5 md:p-6">
                            <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                              <div className="space-y-6">
                                <div>
                                  <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/42">
                                    <Palette className="h-3.5 w-3.5" />
                                    Palette
                                  </div>
                                  <div className="grid grid-cols-5 gap-2">
                                    {period.colors.map((color, colorIndex) => (
                                      <div key={colorIndex} className="space-y-2">
                                        <div
                                          className="aspect-square rounded-xl border border-white/10"
                                          style={{ backgroundColor: color }}
                                        />
                                        <p className="text-center text-[10px] uppercase tracking-[0.12em] text-foreground/42">
                                          {color}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/42">
                                    Characteristics
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {period.characteristics.map((char) => (
                                      <span
                                        key={char}
                                        className="rounded-full border border-white/8 bg-black/20 px-3 py-1.5 text-sm text-foreground/70"
                                      >
                                        {char}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                {period.gallery && period.gallery.length > 0 ? (
                                  <div>
                                    <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/42">
                                      Reference images
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                      {period.gallery.slice(0, 2).map((imageUrl, idx) => (
                                        <div
                                          key={idx}
                                          className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                                        >
                                          <img
                                            src={imageUrl}
                                            alt={`${period.name} reference ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                              </div>

                              <div className="space-y-6">
                                {period.keyFigures && period.keyFigures.length > 0 ? (
                                  <div>
                                    <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/42">
                                      <Users className="h-3.5 w-3.5" />
                                      Key figures
                                    </div>
                                    <div className="space-y-2 border-t border-border/35 pt-3">
                                      {period.keyFigures.map((figure) => (
                                        <p key={figure} className="text-sm leading-6 text-foreground/68">
                                          {figure}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}

                                {period.notableWorks && period.notableWorks.length > 0 ? (
                                  <div>
                                    <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/42">
                                      <Landmark className="h-3.5 w-3.5" />
                                      Notable works
                                    </div>
                                    <div className="space-y-2 border-t border-border/35 pt-3">
                                      {period.notableWorks.map((work) => (
                                        <p key={work} className="text-sm leading-6 text-foreground/68">
                                          {work}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}

                                <div>
                                  <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/42">
                                    Overview
                                  </div>
                                  <p className="text-sm leading-7 text-foreground/62 md:text-[0.98rem]">
                                    {period.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {filteredPeriods.length === 0 && (
                <div className="py-16 text-center text-foreground/55">
                  No periods found matching your search
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
