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

interface ScenicDirectoryFormProps {
    entryId?: number;
}

export function ScenicDirectoryForm({ entryId }: ScenicDirectoryFormProps) {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_name: "",
        category_slug: "",
        url: "",
        location: "",
        coverImage: "",
        status: "published" as "published" | "draft" | "archived",
        featured: false,
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
    });

    const { data: entry, isLoading } = trpc.scenicDirectory.getById.useQuery(
        { id: entryId! },
        { enabled: !!entryId }
    );

    const createMutation = trpc.scenicDirectory.create.useMutation({
        onSuccess: () => {
            toast.success("Entry created");
            setLocation("/admin/scenic-directory");
        },
        onError: (err) => toast.error(err.message),
    });

    const updateMutation = trpc.scenicDirectory.update.useMutation({
        onSuccess: () => {
            toast.success("Entry updated");
            setLocation("/admin/scenic-directory");
        },
        onError: (err) => toast.error(err.message),
    });

    useEffect(() => {
        if (entry) {
            setFormData({
                name: entry.name || "",
                description: entry.description || "",
                category_name: entry.category_name || "",
                category_slug: entry.category_slug || "",
                url: entry.url || "",
                location: entry.location || "",
                coverImage: (entry as any).coverImage || "",
                status: (entry as any).status || "published",
                featured: (entry as any).featured || false,
                seoTitle: (entry as any).seoTitle || "",
                seoDescription: (entry as any).seoDescription || "",
                seoKeywords: (entry as any).seoKeywords || "",
            });
        }
    }, [entry]);

    const generateSlug = () => {
        const slug = formData.category_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData(prev => ({ ...prev, category_slug: slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            description: formData.description,
            categoryName: formData.category_name,
            categorySlug: formData.category_slug,
            url: formData.url,
            location: formData.location,
            coverImage: formData.coverImage,
            status: formData.status,
            featured: formData.featured,
            seoTitle: formData.seoTitle,
            seoDescription: formData.seoDescription,
            seoKeywords: formData.seoKeywords,
        };

        if (entryId) {
            updateMutation.mutate({ id: entryId, ...payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    if (entryId && isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setLocation("/admin/scenic-directory")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex gap-2">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {(createMutation.isPending || updateMutation.isPending) ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {entryId ? "Save Changes" : "Create Entry"}
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
                                <CardTitle>Directory Item Details</CardTitle>
                                <CardDescription>Basic information about the entry.</CardDescription>
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
                                    <Label>Website URL</Label>
                                    <Input
                                        value={formData.url}
                                        onChange={e => setFormData(prev => ({ ...prev, url: e.target.value }))}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                        placeholder="e.g. New York, NY"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2 md:col-span-1">
                            <CardHeader>
                                <CardTitle>Classification</CardTitle>
                                <CardDescription>Categorize this entry.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Category Name</Label>
                                    <Input
                                        value={formData.category_name}
                                        onChange={e => setFormData(prev => ({ ...prev, category_name: e.target.value }))}
                                        required
                                        placeholder="e.g. Prop Shops"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category Slug</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.category_slug}
                                            onChange={e => setFormData(prev => ({ ...prev, category_slug: e.target.value }))}
                                            required
                                            placeholder="prop-shops"
                                        />
                                        <Button type="button" variant="outline" onClick={generateSlug}>Auto</Button>
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
                            <CardTitle>Description</CardTitle>
                            <CardDescription>Detailed information about services offered.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={10}
                                className="min-h-[200px]"
                                placeholder="Describe services, specialities, etc."
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MEDIA TAB */}
                <TabsContent value="media" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>Visuals for the directory entry.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label>Cover Image URL (Logo/Storefront)</Label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={formData.coverImage}
                                            onChange={e => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                                            placeholder="Paste image URL here"
                                        />
                                        <p className="text-[10px] text-muted-foreground italic">
                                            Tip: Logos or storefront photos work best.
                                        </p>
                                    </div>
                                    {formData.coverImage && (
                                        <div className="h-24 w-40 border rounded overflow-hidden flex-shrink-0 bg-muted">
                                            <img src={formData.coverImage} alt="Preview" className="h-full w-full object-contain p-2" />
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
                                            <Label>Featured Entry</Label>
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
