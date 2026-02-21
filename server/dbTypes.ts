export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date | null;
}

export interface RenderingGalleryItem {
  id: number;
  projectId: number;
  project?: Project;
  sortOrder: number;
  altText: string | null;
  displayTitle: string | null;
  description: string | null;
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: "project" | "news" | "article";
  description: string | null;
  color: string | null;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  designNotes: string | null;
  coverImageUrl: string | null;
  coverImageKey: string | null;
  client: string | null;
  location: string | null;
  year: number | null;
  month: number | null;
  venue?: string | null;
  discipline: "scenic_design" | "experiential_design" | "rendering" | null;
  subcategory: string | null;
  status: "draft" | "published" | "archived" | "gallery_only";
  featured: boolean;
  categoryId: number | null;
  creativeTeam: any;
  metadata: any;
  externalArticles?: Array<{
    title: string;
    url: string;
    type?: "review" | "listing" | null;
    source?: string | null;
    publishedAt?: string | null;
    excerpt?: string | null;
  }> | null;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  images: ProjectImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectImage {
  id: number;
  projectId: number;
  imageUrl: string | null;
  videoUrl: string | null;
  caption: string | null;
  altText: string | null;
  imageType?: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface News {
  id: number;
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt: string | null;
  content: string | null;
  categoryId: number | null;
  coverImageUrl: string | null;
  coverImageKey?: string | null;
  coverImageAltText?: string | null;
  coverImageFocalPoint?: { x: number; y: number } | null;
  layoutVariant?: "feature" | "journal" | "bulletin" | null;
  location: string | null;
  date: Date | null;
  blocks: any;
  status: "draft" | "published" | "archived";
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  externalLink: string | null;
  relatedLinks?: Array<{
    id?: number;
    label: string;
    url: string;
    linkType?: "source" | "review" | "tickets" | "press" | "related";
    sortOrder?: number;
  }> | null;
  tags: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  categoryId: number | null;
  coverImageUrl: string | null;
  authorId: number | null;
  readTime: number | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  likes: number;
  views: number;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  user_id: string;
  created_at: Date;
}
