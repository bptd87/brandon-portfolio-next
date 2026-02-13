import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface CollaboratorFormProps {
    collaboratorId?: number;
}

export function CollaboratorForm({ collaboratorId }: CollaboratorFormProps) {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        role: "",
        bio: "",
        website: "",
        portfolioUrl: "",
        instagramUrl: "",
        instagramHandle: "",
        coverImage: "",
        status: "published" as "published" | "draft" | "archived",
        featured: false,
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
    });

    const { data: collaborator, isLoading } = trpc.collaborators.getById.useQuery(
        { id: collaboratorId! },
        { enabled: !!collaboratorId }
    );

    const createMutation = trpc.collaborators.create.useMutation({
        onSuccess: () => {
            toast.success("Collaborator created");
            setLocation("/admin/collaborators");
        },
        onError: (err) => toast.error(err.message),
    });

    const updateMutation = trpc.collaborators.update.useMutation({
        onSuccess: () => {
            toast.success("Collaborator updated");
            setLocation("/admin/collaborators");
        },
        onError: (err) => toast.error(err.message),
    });

    useEffect(() => {
        if (collaborator) {
            setFormData({
                name: collaborator.name || "",
                slug: collaborator.slug || "",
                role: collaborator.role || "",
                bio: collaborator.bio || "",
                website: collaborator.website || "",
                portfolioUrl: collaborator.portfolioUrl || "",
                instagramUrl: collaborator.instagramUrl || "",
                instagramHandle: collaborator.instagramHandle || "",
                coverImage: (collaborator as any).coverImage || "",
                status: (collaborator as any).status || "published",
                featured: (collaborator as any).featured || false,
                seoTitle: (collaborator as any).seoTitle || "",
                seoDescription: (collaborator as any).seoDescription || "",
                seoKeywords: (collaborator as any).seoKeywords || "",
            });
        }
    }, [collaborator]);

    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (collaboratorId) {
            updateMutation.mutate({ id: collaboratorId, ...formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    if (collaboratorId && isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setLocation("/admin/collaborators")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex gap-2">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {(createMutation.isPending || updateMutation.isPending) ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {collaboratorId ? "Save Changes" : "Create Collaborator"}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Status</TabsTrigger>
                </TabsList>

                {/* DETAILS TAB */}
                <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="col-span-2 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Identity</CardTitle>
                                <CardDescription>Basic information about the collaborator.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.slug}
                                            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            required
                                        />
                                        <Button type="button" variant="outline" onClick={generateSlug}>Auto</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Input
                                        value={formData.role}
                                        onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                        placeholder="e.g. Scenic Design, Technical Direction"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Socials & Links</CardTitle>
                                <CardDescription>Where to find them online.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input
                                        value={formData.website}
                                        onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Portfolio URL</Label>
                                    <Input
                                        value={formData.portfolioUrl}
                                        onChange={e => setFormData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Instagram Handle</Label>
                                        <Input
                                            value={formData.instagramHandle}
                                            onChange={e => setFormData(prev => ({ ...prev, instagramHandle: e.target.value }))}
                                            placeholder="@username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Instagram URL</Label>
                                        <Input
                                            value={formData.instagramUrl}
                                            onChange={e => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* CONTENT TAB */}
                <TabsContent value="content" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Biography</CardTitle>
                            <CardDescription>Tell the story of this collaborator.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={formData.bio}
                                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                rows={12}
                                className="min-h-[300px]"
                                placeholder="Enter full biography..."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MEDIA TAB */}
                <TabsContent value="media" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>Visual representation of the collaborator.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label>Cover Image URL (Portrait/Headshot)</Label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={formData.coverImage}
                                            onChange={e => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                                            placeholder="Paste image URL here"
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">
                                            Tip: Used for cards and profile headers.
                                        </p>
                                    </div>
                                    {formData.coverImage && (
                                        <div className="h-32 w-24 border rounded overflow-hidden flex-shrink-0 bg-muted">
                                            <img src={formData.coverImage} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO TAB */}
                <TabsContent value="seo" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing & SEO</CardTitle>
                            <CardDescription>Control visibility and search appearance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label>Featured Collaborator</Label>
                                            <p className="text-xs text-muted-foreground">Show prominently in lists.</p>
                                        </div>
                                        <Switch
                                            checked={formData.featured}
                                            onCheckedChange={checked => setFormData(prev => ({ ...prev, featured: checked }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(v: any) => setFormData(prev => ({ ...prev, status: v }))}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="archived">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>SEO Title</Label>
                                        <Input
                                            value={formData.seoTitle}
                                            onChange={e => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                                            placeholder="Page title for search engines"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SEO Keywords</Label>
                                        <Input
                                            value={formData.seoKeywords}
                                            onChange={e => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                                            placeholder="keywords, separated, by, commas"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label>SEO Description</Label>
                                    <Textarea
                                        value={formData.seoDescription}
                                        onChange={e => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                                        rows={3}
                                        placeholder="Meta description for search results."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}
