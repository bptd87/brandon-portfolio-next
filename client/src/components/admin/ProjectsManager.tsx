import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { MobileTableView } from "./MobileTableView";

export function ProjectsManager() {
  const [, navigate] = useLocation();
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');

  const { data: allProjects, isLoading, refetch } = trpc.projects.list.useQuery({});

  const projects = allProjects
    ?.filter(p => disciplineFilter === 'all' ? true : p.discipline === disciplineFilter)
    .sort((a, b) => {
      // Sort by year descending, then by month descending
      if ((a.year || 0) !== (b.year || 0)) {
        return (b.year || 0) - (a.year || 0);
      }
      return (b.month || 0) - (a.month || 0);
    }) || [];
  const deleteProject = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("Project deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProject.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl">Portfolio Projects ({allProjects?.length || 0})</CardTitle>
                <CardDescription>Manage your portfolio projects and case studies</CardDescription>
              </div>
              <Button onClick={() => navigate("/admin/projects/new")} size="sm" md:size="default">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'scenic_design', label: 'Scenic Design' },
                { value: 'experiential_design', label: 'Experiential' },
                { value: 'rendering', label: 'Rendering' },
                { value: 'scenic_models', label: 'Models' },
              ].map((d) => (
                <Button
                  key={d.value}
                  variant={disciplineFilter === d.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDisciplineFilter(d.value)}
                  className="text-xs md:text-sm"
                >
                  {d.label}
                  {d.value !== 'all' && allProjects && (
                    <span className="ml-1 text-xs opacity-70">
                      ({allProjects.filter(p => p.discipline === d.value).length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {projects && projects.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Cover</TableHead>
                      <TableHead>Title & Info</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow
                        key={project.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                      >
                        <TableCell className="py-2">
                          {project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="h-10 w-10 object-cover rounded border border-border"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground border border-dashed">
                              None
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                              {project.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                {project.discipline === 'scenic_design' ? 'Scenic' :
                                  project.discipline === 'experiential_design' ? 'Experiential' :
                                    project.discipline === 'rendering' ? 'Rendering' :
                                      project.discipline === 'scenic_models' ? 'Models' :
                                        project.discipline || 'Unknown'}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60">•</span>
                              <span className="text-[10px] text-muted-foreground">
                                {project.images?.length || 0} images
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={
                                project.status === "published"
                                  ? "default"
                                  : project.status === "draft"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-[10px] px-1.5 py-0 h-4"
                            >
                              {project.status}
                            </Badge>
                            {project.featured && (
                              <div title="Featured Project">
                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-500/50 text-amber-500 dark:text-amber-400 bg-amber-500/10">
                                  ★
                                </Badge>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-[11px] text-muted-foreground">
                          {project.year ? (
                            project.month ? (
                              `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][project.month - 1]} ${project.year}`
                            ) : (
                              project.year
                            )
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            {project.status === "published" && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                <a href={`/projects/${project.slug}`} target="_blank" aria-label="View live project">
                                  <Eye className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                              title="Edit Project"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(project.id, project.title)}
                              title="Delete Project"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                <MobileTableView
                  data={projects}
                  idKey="id"
                  columns={[
                    {
                      key: 'title',
                      label: 'Project',
                      render: (_, project) => (
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {project.discipline === 'scenic_design' ? 'Scenic' :
                              project.discipline === 'experiential_design' ? 'Experiential' :
                                project.discipline === 'rendering' ? 'Rendering' :
                                  project.discipline === 'scenic_models' ? 'Models' :
                                    project.discipline || 'Unknown'} • {project.images?.length || 0} images
                          </p>
                        </div>
                      )
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      badge: true,
                      render: (status, project) => (
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              status === "published"
                                ? "default"
                                : status === "draft"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {status}
                          </Badge>
                          {project.featured && (
                            <Badge variant="outline" className="border-amber-500/50 text-amber-500 dark:text-amber-400 bg-amber-500/10 text-xs">
                              ★ Featured
                            </Badge>
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'year',
                      label: 'Date',
                      render: (_, project) => project.year ? (
                        project.month ? (
                          `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][project.month - 1]} ${project.year}`
                        ) : (
                          project.year
                        )
                      ) : ("-")
                    }
                  ]}
                  onEdit={(project) => navigate(`/admin/projects/${project.id}/edit`)}
                  onDelete={(project) => handleDelete(project.id, project.title)}
                  onView={(project) => project.status === 'published' ? window.open(`/projects/${project.slug}`) : null}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No projects yet. Create your first project to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
