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

export function ProjectsManager() {
  const [, navigate] = useLocation();
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all');

  const { data: allProjects, isLoading, refetch } = trpc.projects.list.useQuery({});
  
  const projects = allProjects
    ?.filter(p => disciplineFilter === 'all' ? true : p.discipline === disciplineFilter)
    ?.sort((a, b) => {
      // Sort by year descending, then by month descending
      if ((a.year || 0) !== (b.year || 0)) {
        return (b.year || 0) - (a.year || 0);
      }
      return (b.month || 0) - (a.month || 0);
    });
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Projects ({allProjects?.length || 0})</CardTitle>
                <CardDescription>Manage your portfolio projects and case studies</CardDescription>
              </div>
              <Button onClick={() => navigate("/admin/projects/new")}>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      {project.coverImageUrl ? (
                        <img 
                          src={project.coverImageUrl} 
                          alt={project.title}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {project.discipline === 'scenic_design' ? 'Scenic' :
                         project.discipline === 'experiential_design' ? 'Experiential' :
                         project.discipline === 'rendering' ? 'Rendering' :
                         project.discipline === 'scenic_models' ? 'Models' :
                         project.discipline || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {project.images?.length || 0} images
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "published"
                            ? "default"
                            : project.status === "draft"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.featured && <Badge variant="outline">Featured</Badge>}
                    </TableCell>
                    <TableCell>
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
                    <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {project.status === "published" && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/projects/${project.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id, project.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
