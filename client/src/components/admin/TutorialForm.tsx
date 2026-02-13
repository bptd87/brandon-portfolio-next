import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Loader2,
    Plus,
    X,
    GripVertical,
    Type,
    Image as ImageIcon,
    Video,
    List,
    Save,
    ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TutorialFormProps {
    tutorialId?: number;
}

interface Block {
    id: string;
    type: "paragraph" | "heading" | "image" | "video" | "list";
    content: any;
}

/* ===== Sortable Block Item ===== */
function SortableBlock({
    block,
    onUpdate,
    onRemove,
}: {
    block: Block;
    onUpdate: (id: string, content: any) => void;
    onRemove: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative border rounded-lg p-4 bg-card shadow-sm transition-all ${isDragging ? "ring-2 ring-primary opacity-50" : "hover:border-primary/50"
                }`}
        >
            <div className="absolute -left-3 top-4 flex flex-col gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    className="cursor-grab active:cursor-grabbing p-1.5 rounded bg-background border shadow-sm hover:bg-accent"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </button>
            </div>

            <div className="absolute -right-2 -top-2 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-muted px-2 py-0.5 rounded border shadow-sm">
                    {block.type}
                </span>
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 rounded-full shadow-sm"
                    onClick={() => onRemove(block.id)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Paragraph / Rich Text Block */}
            {block.type === "paragraph" && (
                <div className="space-y-2 prose prose-sm max-w-none dark:prose-invert">
                    <ReactQuill
                        theme="snow"
                        value={block.content.text || ""}
                        onChange={(content) => onUpdate(block.id, { ...block.content, text: content })}
                        modules={{
                            toolbar: [
                                ["bold", "italic", "underline", "strike"],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["link", "clean"],
                            ],
                        }}
                    />
                </div>
            )}

            {/* Heading Block */}
            {block.type === "heading" && (
                <div className="flex gap-2 items-center">
                    <Select
                        value={String(block.content.level || 2)}
                        onValueChange={(v) => onUpdate(block.id, { ...block.content, level: parseInt(v) })}
                    >
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">H2</SelectItem>
                            <SelectItem value="3">H3</SelectItem>
                            <SelectItem value="4">H4</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        value={block.content.text || ""}
                        onChange={(e) => onUpdate(block.id, { ...block.content, text: e.target.value })}
                        placeholder="Heading text..."
                        className={`font-bold border-none focus-visible:ring-0 ${block.content.level === 2 ? "text-2xl" : block.content.level === 3 ? "text-xl" : "text-lg"
                            }`}
                    />
                </div>
            )}

            {/* Image Block */}
            {block.type === "image" && (
                <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Image URL</Label>
                            <Input
                                value={block.content.url || ""}
                                onChange={(e) => onUpdate(block.id, { ...block.content, url: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Alt Text</Label>
                            <Input
                                value={block.content.alt || ""}
                                onChange={(e) => onUpdate(block.id, { ...block.content, alt: e.target.value })}
                                placeholder="Description for screen readers"
                            />
                        </div>
                    </div>
                    {block.content.url && (
                        <div className="relative aspect-video rounded-md overflow-hidden bg-muted border">
                            <img src={block.content.url} alt={block.content.alt || ""} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-xs">Caption</Label>
                        <Input
                            value={block.content.caption || ""}
                            onChange={(e) => onUpdate(block.id, { ...block.content, caption: e.target.value })}
                            placeholder="Image caption"
                        />
                    </div>
                </div>
            )}

            {/* Video Block */}
            {block.type === "video" && (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label className="text-xs">Video URL (YouTube/Vimeo)</Label>
                        <Input
                            value={block.content.url || ""}
                            onChange={(e) => onUpdate(block.id, { ...block.content, url: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                        />
                    </div>
                    {block.content.url && (
                        <div className="aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center border text-white text-xs">
                            Video Preview Placeholder
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-xs">Caption</Label>
                        <Input
                            value={block.content.caption || ""}
                            onChange={(e) => onUpdate(block.id, { ...block.content, caption: e.target.value })}
                            placeholder="Video description"
                        />
                    </div>
                </div>
            )}

            {/* List Block */}
            {block.type === "list" && (
                <div className="space-y-3">
                    <Select
                        value={block.content.listType || "bullet"}
                        onValueChange={(v) => onUpdate(block.id, { ...block.content, listType: v })}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bullet">Bulleted</SelectItem>
                            <SelectItem value="numbered">Numbered</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="space-y-2">
                        {(block.content.items || []).map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                                <Input
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...(block.content.items || [])];
                                        newItems[idx] = e.target.value;
                                        onUpdate(block.id, { ...block.content, items: newItems });
                                    }}
                                    placeholder={`Item ${idx + 1}`}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        const newItems = block.content.items.filter((_: any, i: number) => i !== idx);
                                        onUpdate(block.id, { ...block.content, items: newItems });
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdate(block.id, { ...block.content, items: [...(block.content.items || []), ""] })}
                    >
                        <Plus className="h-3 w-3 mr-1" /> Add Item
                    </Button>
                </div>
            )}
        </div>
    );
}

export function TutorialForm({ tutorialId }: TutorialFormProps) {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("details");
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        overview: "",
        videoUrl: "",
        coverImageUrl: "",
        difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
        duration: 0,
        category: "",
        status: "draft" as "draft" | "published" | "archived",
        featured: false,
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        learningObjectives: [] as string[],
        keyConcepts: [] as any[], // { title, content }
        proTips: [] as string[],
        shortcuts: [] as any[], // { keys, action }
        commonPitfalls: [] as string[],
        transcript: [] as any[], // { time, text }
        relatedResources: [] as any[], // { type, title, url }
        relatedTutorials: [] as any[], // { title, slug }
    });
    const [blocks, setBlocks] = useState<Block[]>([]);

    const { data: tutorial, isLoading } = trpc.tutorials.getById.useQuery(
        { id: tutorialId! },
        { enabled: !!tutorialId }
    );

    const createMutation = trpc.tutorials.create.useMutation({
        onSuccess: () => {
            toast.success("Tutorial created");
            setLocation("/admin/tutorials");
        },
        onError: (err) => toast.error(err.message),
    });

    const updateMutation = trpc.tutorials.update.useMutation({
        onSuccess: () => {
            toast.success("Tutorial updated");
            setLocation("/admin/tutorials");
        },
        onError: (err) => toast.error(err.message),
    });

    useEffect(() => {
        if (tutorial) {
            setFormData({
                title: tutorial.title || "",
                slug: tutorial.slug || "",
                description: tutorial.description || "",
                overview: tutorial.overview || "",
                videoUrl: tutorial.video_url || "",
                coverImageUrl: tutorial.cover_image || "",
                difficulty: (tutorial.difficulty as any) || "beginner",
                duration: tutorial.duration || 0,
                category: tutorial.category || "",
                status: (tutorial.status as any) || "draft",
                featured: tutorial.featured || false,
                seoTitle: tutorial.seo_title || "",
                seoDescription: tutorial.seo_description || "",
                seoKeywords: tutorial.seo_keywords || "",
                learningObjectives: (tutorial.learning_objectives as string[]) || [],
                keyConcepts: (tutorial.key_concepts as any[]) || [],
                proTips: (tutorial.pro_tips as string[]) || [],
                shortcuts: (tutorial.shortcuts as any[]) || [],
                commonPitfalls: (tutorial.common_pitfalls as string[]) || [],
                transcript: (tutorial.transcript as any[]) || [],
                relatedResources: (tutorial.related_resources as any[]) || [],
                relatedTutorials: (tutorial.related_tutorials as any[]) || [],
            });
            setBlocks((tutorial.blocks as any[]) || []);
        }
    }, [tutorial]);

    const generateSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleUpdateBlock = (id: string, newContent: any) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: newContent } : b));
    };

    const handleRemoveBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const addBlock = (type: Block["type"]) => {
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type,
            content: getDefaultContent(type),
        };
        setBlocks(prev => [...prev, newBlock]);
    };

    const getDefaultContent = (type: Block["type"]) => {
        switch (type) {
            case "paragraph": return { text: "" };
            case "heading": return { text: "", level: 2 };
            case "image": return { url: "", alt: "", caption: "" };
            case "video": return { url: "", caption: "" };
            case "list": return { listType: "bullet", items: [""] };
            default: return {};
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData, blocks };
        if (tutorialId) {
            updateMutation.mutate({ id: tutorialId, ...payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    // Helper to update array fields
    const updateArrayField = (field: keyof typeof formData, index: number, value: any) => {
        setFormData(prev => {
            const arr = [...(prev[field] as any[])];
            arr[index] = value;
            return { ...prev, [field]: arr };
        });
    };

    const addArrayItem = (field: keyof typeof formData, item: any) => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), item] }));
    };

    const removeArrayItem = (field: keyof typeof formData, index: number) => {
        setFormData(prev => {
            const arr = [...(prev[field] as any[])];
            arr.splice(index, 1);
            return { ...prev, [field]: arr };
        });
    };

    if (tutorialId && isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setLocation("/admin/tutorials")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex gap-2">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {(createMutation.isPending || updateMutation.isPending) ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {tutorialId ? "Save Changes" : "Create Tutorial"}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-8 h-auto flex-wrap">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="metadata">Metadata</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="seo">SEO & Status</TabsTrigger>
                </TabsList>

                {/* DETAILS TAB */}
                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tutorial Details</CardTitle>
                            <CardDescription>Basic identification and classification.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter tutorial title"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Slug</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.slug}
                                            onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            placeholder="tutorial-slug-here"
                                            required
                                        />
                                        <Button type="button" variant="outline" onClick={generateSlug}>Auto</Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <Select
                                        value={formData.difficulty}
                                        onValueChange={v => setFormData(prev => ({ ...prev, difficulty: v as any }))}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="beginner">Beginner</SelectItem>
                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                            <SelectItem value="advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration (seconds)</Label>
                                    <Input
                                        type="number"
                                        value={formData.duration}
                                        onChange={e => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                                        placeholder="e.g. 634 for 10:34"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Total seconds (e.g. 10m 34s = 634)</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input
                                        value={formData.category}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        placeholder="e.g. Scenic Design, AI Tools"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Main Video URL</Label>
                                    <Input
                                        value={formData.videoUrl}
                                        onChange={e => {
                                            const url = e.target.value;
                                            setFormData(prev => ({ ...prev, videoUrl: url }));
                                            const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                            // Auto-set cover image if not set
                                            if (ytMatch && ytMatch[1] && !formData.coverImageUrl) {
                                                setFormData(prev => ({ ...prev, coverImageUrl: `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg` }));
                                                toast.success("Cover image scraped from YouTube!");
                                            }
                                        }}
                                        placeholder="YouTube ID or URL"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cover Image URL</Label>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <Input
                                                value={formData.coverImageUrl}
                                                onChange={e => setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))}
                                                placeholder="Paste image URL here"
                                            />
                                        </div>
                                        {formData.coverImageUrl && (
                                            <div className="h-10 w-16 border rounded overflow-hidden flex-shrink-0 bg-muted">
                                                <img src={formData.coverImageUrl} alt="Preview" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Short Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={2}
                                        placeholder="One or two sentences about this tutorial."
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Overview (Full Introduction)</Label>
                                    <Textarea
                                        value={formData.overview}
                                        onChange={e => setFormData(prev => ({ ...prev, overview: e.target.value }))}
                                        rows={5}
                                        placeholder="Detailed introduction and what to expect..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* METADATA TAB */}
                <TabsContent value="metadata" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Learning Objectives */}
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Learning Objectives</CardTitle>
                                <CardDescription>What will the user learn?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.learningObjectives.map((obj, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input
                                            value={obj}
                                            onChange={e => updateArrayField("learningObjectives", idx, e.target.value)}
                                            placeholder={`Objective ${idx + 1}`}
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("learningObjectives", idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("learningObjectives", "")}>
                                    <Plus className="mr-2 h-3 w-3" /> Add Objective
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pro Tips */}
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Pro Tips</CardTitle>
                                <CardDescription>Expert advice.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.proTips.map((tip, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Textarea
                                            value={tip}
                                            onChange={e => updateArrayField("proTips", idx, e.target.value)}
                                            placeholder={`Tip ${idx + 1}`}
                                            rows={2}
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("proTips", idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("proTips", "")}>
                                    <Plus className="mr-2 h-3 w-3" /> Add Pro Tip
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Common Pitfalls */}
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Common Pitfalls</CardTitle>
                                <CardDescription>Mistakes to avoid.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.commonPitfalls.map((pitfall, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <Input
                                            value={pitfall}
                                            onChange={e => updateArrayField("commonPitfalls", idx, e.target.value)}
                                            placeholder={`Pitfall ${idx + 1}`}
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("commonPitfalls", idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("commonPitfalls", "")}>
                                    <Plus className="mr-2 h-3 w-3" /> Add Pitfall
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Key Concepts */}
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Key Concepts</CardTitle>
                                <CardDescription>Core theoretical concepts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.keyConcepts.map((concept, idx) => (
                                    <div key={idx} className="border p-4 rounded-lg space-y-2 bg-muted/20 relative group">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeArrayItem("keyConcepts", idx)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Input
                                            value={concept.title}
                                            onChange={e => updateArrayField("keyConcepts", idx, { ...concept, title: e.target.value })}
                                            placeholder="Concept Title"
                                            className="font-bold"
                                        />
                                        <Textarea
                                            value={concept.content}
                                            onChange={e => updateArrayField("keyConcepts", idx, { ...concept, content: e.target.value })}
                                            placeholder="Concept Description"
                                            rows={3}
                                        />
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("keyConcepts", { title: "", content: "" })}>
                                    <Plus className="mr-2 h-3 w-3" /> Add Concept
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Shortcuts */}
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Shortcuts</CardTitle>
                                <CardDescription>Keyboard shortcuts mentioned.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {formData.shortcuts.map((shortcut, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <Input
                                            value={shortcut.keys}
                                            onChange={e => updateArrayField("shortcuts", idx, { ...shortcut, keys: e.target.value })}
                                            placeholder="Keys (e.g. Ctrl+C)"
                                            className="w-1/3 font-mono"
                                        />
                                        <Input
                                            value={shortcut.action}
                                            onChange={e => updateArrayField("shortcuts", idx, { ...shortcut, action: e.target.value })}
                                            placeholder="Action Description"
                                            className="flex-1"
                                        />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("shortcuts", idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("shortcuts", { keys: "", action: "" })}>
                                    <Plus className="mr-2 h-3 w-3" /> Add Shortcut
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* CONTENT TAB */}
                <TabsContent value="content" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Content Blocks</CardTitle>
                                <CardDescription>Additional page content (below video).</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => addBlock("paragraph")}>
                                    <Type className="mr-2 h-4 w-4" /> Text
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => addBlock("heading")}>
                                    <Plus className="mr-2 h-4 w-4" /> Heading
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-4">
                                        {blocks.map((block) => (
                                            <SortableBlock
                                                key={block.id}
                                                block={block}
                                                onUpdate={handleUpdateBlock}
                                                onRemove={handleRemoveBlock}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>

                            {blocks.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
                                    <p className="text-muted-foreground mb-4">No content blocks yet. Add your first one below.</p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <Button type="button" variant="ghost" size="sm" onClick={() => addBlock("paragraph")}>
                                    <Type className="mr-2 h-4 w-4" /> Paragraph
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => addBlock("heading")}>
                                    <Plus className="mr-2 h-4 w-4" /> Heading
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => addBlock("image")}>
                                    <ImageIcon className="mr-2 h-4 w-4" /> Image
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => addBlock("video")}>
                                    <Video className="mr-2 h-4 w-4" /> Video
                                </Button>
                                <Button type="button" variant="ghost" size="sm" onClick={() => addBlock("list")}>
                                    <List className="mr-2 h-4 w-4" /> List
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TRANSCRIPT TAB */}
                <TabsContent value="transcript" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Transcript</CardTitle>
                            <CardDescription>Timed transcript entries.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.transcript.map((entry, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <Input
                                        value={entry.time}
                                        onChange={e => updateArrayField("transcript", idx, { ...entry, time: e.target.value })}
                                        placeholder="Time (e.g. 05:22)"
                                        className="w-32 font-mono"
                                    />
                                    <Textarea
                                        value={entry.text}
                                        onChange={e => updateArrayField("transcript", idx, { ...entry, text: e.target.value })}
                                        placeholder="Spoken text..."
                                        rows={2}
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("transcript", idx)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("transcript", { time: "", text: "" })}>
                                <Plus className="mr-2 h-3 w-3" /> Add Transcript Line
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* RESOURCES TAB */}
                <TabsContent value="resources" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Related Resources</CardTitle>
                            <CardDescription>Links to documentation and files.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.relatedResources.map((res, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <Select
                                        value={res.type}
                                        onValueChange={v => updateArrayField("relatedResources", idx, { ...res, type: v })}
                                    >
                                        <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Documentation">Documentation</SelectItem>
                                            <SelectItem value="File">File / Download</SelectItem>
                                            <SelectItem value="Video">Video</SelectItem>
                                            <SelectItem value="Community">Community</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={res.title}
                                            onChange={e => updateArrayField("relatedResources", idx, { ...res, title: e.target.value })}
                                            placeholder="Resource Title"
                                        />
                                        <Input
                                            value={res.url}
                                            onChange={e => updateArrayField("relatedResources", idx, { ...res, url: e.target.value })}
                                            placeholder="URL"
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("relatedResources", idx)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("relatedResources", { type: "Documentation", title: "", url: "" })}>
                                <Plus className="mr-2 h-3 w-3" /> Add Resource
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Related Tutorials</CardTitle>
                            <CardDescription>Links to other tutorials on this site.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.relatedTutorials.map((tut, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <Input
                                        value={tut.title}
                                        onChange={e => updateArrayField("relatedTutorials", idx, { ...tut, title: e.target.value })}
                                        placeholder="Tutorial Title"
                                        className="flex-1"
                                    />
                                    <Input
                                        value={tut.slug}
                                        onChange={e => updateArrayField("relatedTutorials", idx, { ...tut, slug: e.target.value })}
                                        placeholder="Slug"
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("relatedTutorials", idx)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem("relatedTutorials", { title: "", slug: "" })}>
                                <Plus className="mr-2 h-3 w-3" /> Add Related Tutorial
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO TAB */}
                <TabsContent value="seo" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Publishing & SEO</CardTitle>
                            <CardDescription>Control how this appears online.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="space-y-0.5">
                                            <Label>Featured Tutorial</Label>
                                            <p className="text-xs text-muted-foreground">Show prominently on tutorials home.</p>
                                        </div>
                                        <Switch
                                            checked={formData.featured}
                                            onCheckedChange={checked => setFormData(prev => ({ ...prev, featured: checked }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Post Status</Label>
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
                                            placeholder="Custom page title for google"
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
