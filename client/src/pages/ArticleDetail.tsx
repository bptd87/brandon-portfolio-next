import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, Heart, Share2, Linkedin, Instagram, Mail } from "lucide-react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = trpc.articles.getBySlug.useQuery({ slug: slug! });
  const { data: relatedArticles } = trpc.articles.list.useQuery({});
  const { data: category } = trpc.categories.getById.useQuery(
    { id: article?.categoryId || 0 },
    { enabled: !!article?.categoryId }
  );
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"><Footer />
    </div>
      <Footer />
    </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/articles">
            <Button>Back to Articles</Button>
          </Link>
        <Footer />
    </div>
      <Footer />
    </div>
    );
  }

  // Parse content sections - handle both JSON and plain text
  let contentSections: any[] = [];
  try {
    contentSections = typeof article.content === 'string' 
      ? JSON.parse(article.content) 
      : article.content || [];
  } catch (e) {
    // If content is plain text, wrap it in a paragraph object
    contentSections = [{ type: 'paragraph', content: article.content }];
  }

  // Get related articles (exclude current)
  const related = relatedArticles?.filter(a => a.id !== article.id).slice(0, 3) || [];

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = JSON.stringify(contentSections).split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Light Background */}
      <section className="py-16 bg-background">
        <div className="container max-w-5xl">
          {article.coverImageUrl && (
            <div className="mb-12 rounded-lg overflow-hidden">
              <img 
                src={article.coverImageUrl} 
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            <Footer />
    </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground uppercase tracking-wider">
              {category && (
                <>
                  <Badge variant="secondary" className="font-bold">
                    {category.name}
                  </Badge>
                  <span>|</span>
                </>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <Footer />
    </div>
              <span>|</span>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{readTime} MIN READ</span>
              <Footer />
    </div>
            <Footer />
    </div>

            <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] italic font-normal mb-6 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-muted-foreground mb-8">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between py-6 border-y">
              <div>
                <p className="font-semibold text-sm uppercase tracking-wider">By Brandon PT Davis</p>
                <p className="text-sm text-muted-foreground">Scenic + Experiential Designer</p>
              <Footer />
    </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleLike}
                  size="icon"
                  variant="outline"
                  className={liked ? "bg-primary text-primary-foreground" : ""}
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                </Button>
                <Button 
                  onClick={handleShare}
                  size="icon"
                  variant="outline"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              <Footer />
    </div>
            <Footer />
    </div>
          <Footer />
    </div>
        <Footer />
    </div>
      </section>

      {/* Article Content */}
      <section className="py-16 bg-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-[250px_1fr] gap-12">
            {/* Table of Contents - Sidebar */}
            {Array.isArray(contentSections) && contentSections.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24 border-2 border-yellow-400 p-6 rounded-lg">
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Contents</h3>
                  <nav className="space-y-2">
                    {contentSections.map((section: any, index: number) => {
                      if (section.type === 'heading') {
                        return (
                          <a 
                            key={index}
                            href={`#section-${index}`}
                            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {section.content}
                          </a>
                        );
                      }
                      return null;
                    })}
                  </nav>
                <Footer />
    </div>
              </aside>
            )}

            {/* Main Content */}
            <article className="prose prose-lg max-w-none">
              {Array.isArray(contentSections) && contentSections.map((section: any, index: number) => {
                switch (section.type) {
                  case 'heading':
                    return (
                      <h2 key={index} id={`section-${index}`} className="text-3xl font-semibold mt-12 mb-6 scroll-mt-24">
                        {section.content}
                      </h2>
                    );
                  
                  case 'paragraph':
                    return (
                      <p key={index} className="mb-6 leading-relaxed text-foreground/90">
                        {section.content}
                      </p>
                    );
                  
                  case 'quote':
                    return (
                      <blockquote key={index} className="border-l-4 border-primary pl-6 my-8 italic text-xl">
                        "{section.content}"
                        {section.author && (
                          <footer className="text-sm text-muted-foreground mt-2 not-italic">
                            — {section.author}
                          </footer>
                        )}
                      </blockquote>
                    );
                  
                  case 'image':
                    return (
                      <figure key={index} className="my-8">
                        <img 
                          src={section.url} 
                          alt={section.caption || ''}
                          className="w-full rounded-lg"
                        />
                        {section.caption && (
                          <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                            {section.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  
                  case 'list':
                    return (
                      <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                        {section.items?.map((item: string, itemIndex: number) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    );
                  
                  default:
                    return null;
                }
              })}

              {/* FAQ Section - TODO: Add FAQ data structure if needed */}
            </article>
          <Footer />
    </div>

          {/* Author Bio */}
          <Card className="mt-16 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">Brandon PT Davis</h3>
                  <p className="text-sm text-muted-foreground mb-4">Scenic & Experiential Designer</p>
                  <p className="text-muted-foreground mb-6">
                    Brandon PT Davis is a Scenic and Experiential Designer based in Los Angeles. 
                    His work explores the intersection of physical space, digital technology, and narrative storytelling.
                  </p>
                  <div className="flex items-center gap-3">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="outline">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="outline">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="mailto:info@brandonptdavis.com">
                      <Button size="icon" variant="outline">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                  <Footer />
    </div>
                <Footer />
    </div>
              <Footer />
    </div>
            </CardContent>
          </Card>
        <Footer />
    </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container max-w-5xl">
            <h2 className="text-3xl font-semibold mb-8">Continue Reading</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <Link href={`/articles/${item.slug}`} className="block">
                    {item.coverImageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.coverImageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      <Footer />
    </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground uppercase tracking-wider">
                        <Badge variant="secondary">
                          {item.categoryId}
                        </Badge>
                        <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <Footer />
    </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            <Footer />
    </div>
          <Footer />
    </div>
        </section>
      )}
    <Footer />
    </div>
  );
}
