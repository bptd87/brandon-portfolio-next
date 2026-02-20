import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Pencil, Search } from "lucide-react";
import { toast } from "sonner";

export function TagsManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<number>>(new Set());
  const [editingTag, setEditingTag] = useState<{ id: number; name: string; slug: string } | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: tags, isLoading, refetch } = trpc.tags.list.useQuery();
  
  const deleteTag = trpc.tags.delete.useMutation({
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete tag: ${error.message}`);
    },
  });

  const createTag = trpc.tags.create.useMutation({
    onSuccess: () => {
      toast.success("Tag created successfully");
      setNewTagName("");
      setIsCreateDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create tag: ${error.message}`);
    },
  });

  const updateTag = trpc.tags.update.useMutation({
    onSuccess: () => {
      toast.success("Tag updated successfully");
      setEditingTag(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update tag: ${error.message}`);
    },
  });

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!tags) return [];
    if (!searchQuery) return tags;
    
    const query = searchQuery.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(query) || 
      tag.slug.toLowerCase().includes(query)
    );
  }, [tags, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTags(new Set(filteredTags.map(t => t.id)));
    } else {
      setSelectedTags(new Set());
    }
  };

  const handleSelectTag = (tagId: number, checked: boolean) => {
    const newSelected = new Set(selectedTags);
    if (checked) {
      newSelected.add(tagId);
    } else {
      newSelected.delete(tagId);
    }
    setSelectedTags(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedTags.size === 0) {
      toast.error("No tags selected");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedTags.size} tag(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedTags).map(id => deleteTag.mutateAsync({ id }))
      );
      setSelectedTags(new Set());
      toast.success(`Deleted ${selectedTags.size} tags`);
    } catch (error) {
      toast.error("Failed to delete some tags");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteTag.mutate({ id });
    }
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }

    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    createTag.mutate({ name: newTagName.trim(), slug });
  };

  const handleUpdateTag = () => {
    if (!editingTag) return;
    
    if (!editingTag.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    const slug = editingTag.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    updateTag.mutate({ 
      id: editingTag.id, 
      name: editingTag.name.trim(),
      slug 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const allSelected = filteredTags.length > 0 && selectedTags.size === filteredTags.length;
  const someSelected = selectedTags.size > 0 && selectedTags.size < filteredTags.length;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Article & News Tags</CardTitle>
              <CardDescription>
                Manage taxonomy for news and articles only. Total: {tags?.length || 0} tags
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedTags.size > 0 && (
                <Button variant="destructive" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete {selectedTags.size} Selected
                </Button>
              )}
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Tag
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredTags.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTags.has(tag.id)}
                        onCheckedChange={(checked) => handleSelectTag(tag.id, checked as boolean)}
                        aria-label={`Select ${tag.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="secondary">{tag.name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(tag.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingTag({ id: tag.id, name: tag.name, slug: tag.slug })}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(tag.id, tag.name)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {searchQuery ? (
                <p>No tags found matching "{searchQuery}"</p>
              ) : (
                <p>No tags yet. Create your first tag to get started.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Tag Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>
              Add a new tag to organize your content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g., Broadway, Musical Theatre, Scenic Design"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={createTag.isPending}>
              {createTag.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the tag name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTagName">Tag Name</Label>
              <Input
                id="editTagName"
                value={editingTag?.name || ""}
                onChange={(e) => setEditingTag(editingTag ? { ...editingTag, name: e.target.value } : null)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateTag()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTag(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTag} disabled={updateTag.isPending}>
              {updateTag.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
