import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Briefcase, FileText, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getProjectPath } from "@/lib/projectRoutes";
import { SEO } from "@/components/SEO";

const INDEXABLE_TAG_MIN_ITEMS = 3;

export default function TagDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = trpc.tags.getBySlug.useQuery({ slug: slug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!data || !data.tag) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tag Not Found</h1>
          <Link href="/" className="text-accent hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const { tag, projects, articles, news } = data;
  const totalItems = projects.length + articles.length + news.length;
  const shouldNoindex = totalItems < INDEXABLE_TAG_MIN_ITEMS;
  const canonicalTagSlug = (tag.slug || slug || "").toLowerCase();
  const canonicalTagUrl = `https://www.brandonptdavis.com/tags/${canonicalTagSlug}`;

  return (
    <>
      <SEO
        title={`${tag.name} | Brandon PT Davis`}
        description={`Browse all content tagged with ${tag.name} - ${totalItems} items including projects, articles, and archived news.`}
        url={canonicalTagUrl}
        noindex={shouldNoindex}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border">
          <div className="container py-12 md:py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <Badge 
                variant="outline" 
                className="text-lg font-normal px-6 py-3 rounded-full"
                style={{
                  borderColor: `hsl(var(--accent))`,
                  color: `hsl(var(--accent-foreground))`,
                  backgroundColor: `hsl(var(--accent) / 0.1)`
                }}
              >
                {tag.name}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Content Tagged: {tag.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} • {projects.length} {projects.length === 1 ? 'project' : 'projects'}, {articles.length} {articles.length === 1 ? 'article' : 'articles'}, {news.length} {news.length === 1 ? 'archived news item' : 'archived news items'}
            </p>
          </div>
        </section>

        <div className="container py-12 md:py-16">
          {/* Projects Section */}
          {projects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-6 h-6 text-accent" />
                <h2 className="text-2xl md:text-3xl font-bold">Projects ({projects.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Link key={project.id} href={getProjectPath(project)}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      {project.coverImageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={project.coverImageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                        {project.excerpt && (
                          <p className="text-muted-foreground line-clamp-2 mb-3">
                            {project.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {project.year && <span>{project.year}</span>}
                          {project.location && (
                            <>
                              <span>•</span>
                              <span>{project.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Articles Section */}
          {articles.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="w-6 h-6 text-accent" />
                <h2 className="text-2xl md:text-3xl font-bold">Articles ({articles.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 mb-3">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* News Archive Section */}
          {news.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Newspaper className="w-6 h-6 text-accent" />
                <h2 className="text-2xl md:text-3xl font-bold">News Archive ({news.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      {item.coverImageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={item.coverImageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-muted-foreground line-clamp-2 mb-3">
                            {item.excerpt}
                          </p>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {totalItems === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No content found with this tag yet.
              </p>
              <Link href="/" className="text-accent hover:underline">
                Browse all content
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
