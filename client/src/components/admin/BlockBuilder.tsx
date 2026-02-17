import { useState, CSSProperties } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  X,
  Type,
  Image as ImageIcon,
  Video,
  List,
  Loader2,
  Code,
  MessageSquareQuote,
  HelpCircle,
  Images,
  Sparkles,
  FileText,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { processImageForUpload } from "@/utils/imageUtils";
import { uploadImage as uploadToStorage } from "@/utils/storageUtils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type BlockType = 
  | "text" | "paragraph" 
  | "header" | "heading" 
  | "image" | "gallery" | "video" 
  | "quote" | "list" | "faq" | "accordion" 
  | "html" | "update_note" | "ai_prompt" | "creative_team";

interface Block {
  type: BlockType;
  [key: string]: any;
}

interface BlockBuilderProps {
  blocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  type: 'news' | 'articles';
  uploadPath?: 'news' | 'articles' | 'news_gallery' | 'articles_gallery';
}

export function BlockBuilder({ 
  blocks, 
  onBlocksChange, 
  type,
  uploadPath = type === 'news' ? 'news' : 'articles'
}: BlockBuilderProps) {
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addBlock = (blockType: BlockType, defaults: any = {}) => {
    const newBlock = { type: blockType, ...defaults };
    onBlocksChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: any) => {
    const updated = blocks.map((block, i) => 
      i === index ? { ...block, ...updates } : block
    );
    onBlocksChange(updated);
  };

  const removeBlock = (index: number) => {
    onBlocksChange(blocks.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((_, i) => i === active.id);
      const newIndex = blocks.findIndex((_, i) => i === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        onBlocksChange(newBlocks);
      }
    }
  };

  const handleImageUpload = async (
    file: File,
    blockIndex: number,
    imageIndex?: number
  ) => {
    const uploadId = imageIndex !== undefined 
      ? `block-${blockIndex}-gallery-${imageIndex}`
      : `block-${blockIndex}`;
    
    setUploadingBlockId(uploadId);
    try {
      const optimizedFile = await processImageForUpload(file);
      const publicUrl = await uploadToStorage(optimizedFile, 'portfolio', uploadPath);

      if (imageIndex !== undefined) {
        // Gallery image
        const block = blocks[blockIndex];
        const newImages = [...(block.images || [])];
        newImages[imageIndex] = { ...(newImages[imageIndex] || {}), url: publicUrl };
        updateBlock(blockIndex, { images: newImages });
      } else {
        // Single image
        updateBlock(blockIndex, { url: publicUrl });
      }
      toast.success("Image uploaded!");
    } catch (error: any) {
      console.error(error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploadingBlockId(null);
    }
  };

  const blockTypeButtons = [
    { type: 'paragraph' as BlockType, label: type === 'news' ? 'Text' : 'Paragraph', icon: Type },
    { type: 'heading' as BlockType, label: type === 'news' ? 'Header' : 'Heading', icon: Type },
    { type: 'image' as BlockType, label: 'Image', icon: ImageIcon },
    { type: 'gallery' as BlockType, label: 'Gallery', icon: Images },
    { type: 'video' as BlockType, label: 'Video', icon: Video },
    { type: 'list' as BlockType, label: 'List', icon: List },
    { type: 'quote' as BlockType, label: 'Quote', icon: MessageSquareQuote },
    { type: 'faq' as BlockType, label: 'FAQ', icon: HelpCircle },
    { type: 'creative_team' as BlockType, label: 'Creative Team', icon: FileText },
    { type: 'accordion' as BlockType, label: 'Accordion', icon: ChevronDown },
    { type: 'html' as BlockType, label: 'HTML', icon: Code },
    { type: 'ai_prompt' as BlockType, label: 'AI Prompt', icon: Sparkles },
  ];

  return (
    <div className="space-y-4">
      {/* Blocks List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((_, i) => i)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {blocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No blocks yet. Add one to get started.
              </div>
            ) : (
              blocks.map((block, index) => (
                <SortableBlockCard
                  key={index}
                  block={block}
                  index={index}
                  type={type}
                  onUpdate={(updates) => updateBlock(index, updates)}
                  onRemove={() => removeBlock(index)}
                  onImageUpload={(file, imageIndex) => handleImageUpload(file, index, imageIndex)}
                  uploadingBlockId={uploadingBlockId}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Block Type Menu */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        {blockTypeButtons.map(({ type: blockType, label, icon: Icon }) => (
          <Button
            key={blockType}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const defaults = getDefaultBlockContent(blockType);
              addBlock(blockType, defaults);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

interface SortableBlockCardProps extends BlockCardProps {
  block: Block;
  index: number;
  type: 'news' | 'articles';
  onUpdate: (updates: any) => void;
  onRemove: () => void;
  onImageUpload: (file: File, imageIndex?: number) => void;
  uploadingBlockId: string | null;
}

function SortableBlockCard(props: SortableBlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.index });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div ref={setNodeRef} style={style}>
      <div className="flex gap-2 items-start">
        <div
          {...attributes}
          {...listeners}
          className="mt-3 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <BlockCard {...props} />
        </div>
      </div>
    </div>
  );
}

interface BlockCardProps {
  block: Block;
  index: number;
  type: 'news' | 'articles';
  onUpdate: (updates: any) => void;
  onRemove: () => void;
  onImageUpload: (file: File, imageIndex?: number) => void;
  uploadingBlockId: string | null;
}

function BlockCard({
  block,
  index,
  type,
  onUpdate,
  onRemove,
  onImageUpload,
  uploadingBlockId,
}: BlockCardProps) {
  const getBlockTitle = (block: Block) => {
    switch (block.type) {
      case 'paragraph':
      case 'text':
        return 'Text Block';
      case 'heading':
      case 'header':
        return `Heading (H${block.level || 2})`;
      case 'image':
        return 'Image';
      case 'gallery':
        return 'Image Gallery';
      case 'video':
        return 'Video';
      case 'list':
        return block.ordered ? 'Ordered List' : 'Unordered List';
      case 'quote':
        return 'Quote';
      case 'faq':
        return 'FAQ';
      case 'accordion':
        return 'Accordion';
      case 'creative_team':
        return 'Creative Team';
      case 'html':
        return 'HTML';
      case 'ai_prompt':
        return 'AI Prompt';
      case 'update_note':
        return 'Update Note';
      default:
        return block.type;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{getBlockTitle(block)}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <BlockContentEditor
          block={block}
          index={index}
          onUpdate={onUpdate}
          onImageUpload={onImageUpload}
          uploadingBlockId={uploadingBlockId}
        />
      </CardContent>
    </Card>
  );
}

interface BlockContentEditorProps {
  block: Block;
  index: number;
  onUpdate: (updates: any) => void;
  onImageUpload: (file: File, imageIndex?: number) => void;
  uploadingBlockId: string | null;
}

function BlockContentEditor({
  block,
  index,
  onUpdate,
  onImageUpload,
  uploadingBlockId,
}: BlockContentEditorProps) {
  switch (block.type) {
    case 'paragraph':
    case 'text':
      return (
        <Textarea
          value={block.text || block.content || ''}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={4}
          placeholder="Enter text content..."
        />
      );

    case 'heading':
    case 'header':
      return (
        <div className="space-y-2">
          <Input
            value={block.text || block.content || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Heading text..."
          />
          <Select
            value={(block.level || 2).toString()}
            onValueChange={(value) => onUpdate({ level: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
              <SelectItem value="4">H4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Input
              value={block.url || ''}
              onChange={(e) => onUpdate({ url: e.target.value })}
              placeholder="Image URL"
            />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageUpload(file);
                }}
                disabled={uploadingBlockId === `block-${index}`}
              />
              <Button 
                variant="outline" 
                size="icon" 
                disabled={uploadingBlockId === `block-${index}`}
              >
                {uploadingBlockId === `block-${index}` ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Input
            value={block.caption || ''}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Caption (optional)"
          />
          <Input
            value={block.alt || ''}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            placeholder="Alt text (optional)"
          />
        </div>
      );

    case 'gallery':
      return (
        <div className="space-y-2">
          {(block.images || []).map((img: any, imgIndex: number) => (
            <div key={imgIndex} className="flex gap-2 items-start border-b pb-2">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2 items-center">
                  <Input
                    value={img.url || ''}
                    onChange={(e) => {
                      const newImages = [...(block.images || [])];
                      newImages[imgIndex] = { ...img, url: e.target.value };
                      onUpdate({ images: newImages });
                    }}
                    placeholder="Image URL"
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onImageUpload(file, imgIndex);
                      }}
                      disabled={uploadingBlockId === `block-${index}-gallery-${imgIndex}`}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={uploadingBlockId === `block-${index}-gallery-${imgIndex}`}
                    >
                      {uploadingBlockId === `block-${index}-gallery-${imgIndex}` ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Input
                  value={img.caption || ''}
                  onChange={(e) => {
                    const newImages = [...(block.images || [])];
                    newImages[imgIndex] = { ...img, caption: e.target.value };
                    onUpdate({ images: newImages });
                  }}
                  placeholder="Caption (optional)"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newImages = (block.images || []).filter((_: any, i: number) => i !== imgIndex);
                  onUpdate({ images: newImages });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newImages = [...(block.images || []), { url: '', caption: '' }];
              onUpdate({ images: newImages });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      );

    case 'video':
      return (
        <div className="space-y-2">
          <Input
            value={block.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="Video URL (YouTube, Vimeo, etc.)"
          />
          <Input
            value={block.caption || ''}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="Caption (optional)"
          />
        </div>
      );

    case 'list':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              id={`list-ordered-${index}`}
              type="checkbox"
              title="Toggle ordered/unordered list"
              checked={block.ordered || false}
              onChange={(e) => onUpdate({ ordered: e.target.checked })}
            />
            <Label htmlFor={`list-ordered-${index}`}>Ordered List</Label>
          </div>
          {(block.items || []).map((item: string, itemIndex: number) => (
            <div key={itemIndex} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...(block.items || [])];
                  newItems[itemIndex] = e.target.value;
                  onUpdate({ items: newItems });
                }}
                placeholder={`Item ${itemIndex + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newItems = (block.items || []).filter((_: string, i: number) => i !== itemIndex);
                  onUpdate({ items: newItems });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newItems = [...(block.items || []), ''];
              onUpdate({ items: newItems });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      );

    case 'quote':
      return (
        <div className="space-y-2">
          <Textarea
            value={block.text || ''}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Quote text..."
            rows={3}
          />
          <Input
            value={block.author || ''}
            onChange={(e) => onUpdate({ author: e.target.value })}
            placeholder="Author (optional)"
          />
        </div>
      );

    case 'faq':
    case 'accordion':
      return (
        <div className="space-y-2">
          {(block.items || []).map((item: any, itemIndex: number) => (
            <div key={itemIndex} className="border rounded p-2 space-y-2">
              <Input
                value={item.question || ''}
                onChange={(e) => {
                  const newItems = [...(block.items || [])];
                  newItems[itemIndex] = { ...item, question: e.target.value };
                  onUpdate({ items: newItems });
                }}
                placeholder="Question..."
              />
              <Textarea
                value={item.answer || ''}
                onChange={(e) => {
                  const newItems = [...(block.items || [])];
                  newItems[itemIndex] = { ...item, answer: e.target.value };
                  onUpdate({ items: newItems });
                }}
                placeholder="Answer..."
                rows={2}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newItems = (block.items || []).filter((_: any, i: number) => i !== itemIndex);
                  onUpdate({ items: newItems });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newItems = [...(block.items || []), { question: '', answer: '' }];
              onUpdate({ items: newItems });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      );

    case 'creative_team':
      return (
        <div className="space-y-2">
          {(block.members || []).map((member: any, memberIndex: number) => (
            <div key={memberIndex} className="border rounded p-2 space-y-2">
              <Input
                value={member.name || ''}
                onChange={(e) => {
                  const newMembers = [...(block.members || [])];
                  newMembers[memberIndex] = { ...member, name: e.target.value };
                  onUpdate({ members: newMembers });
                }}
                placeholder="Name..."
              />
              <Input
                value={member.role || ''}
                onChange={(e) => {
                  const newMembers = [...(block.members || [])];
                  newMembers[memberIndex] = { ...member, role: e.target.value };
                  onUpdate({ members: newMembers });
                }}
                placeholder="Role..."
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newMembers = (block.members || []).filter((_: any, i: number) => i !== memberIndex);
                  onUpdate({ members: newMembers });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const newMembers = [...(block.members || []), { name: '', role: '' }];
              onUpdate({ members: newMembers });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      );

    case 'html':
      return (
        <Textarea
          value={block.html || ''}
          onChange={(e) => onUpdate({ html: e.target.value })}
          placeholder="Enter HTML code..."
          rows={6}
          className="font-mono text-sm"
        />
      );

    case 'ai_prompt':
      return (
        <Textarea
          value={block.prompt || ''}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          placeholder="Enter AI prompt..."
          rows={3}
        />
      );

    case 'update_note':
      return (
        <div className="space-y-2">
          <Input
            value={block.date || ''}
            onChange={(e) => onUpdate({ date: e.target.value })}
            type="date"
            placeholder="Update date"
          />
          <Textarea
            value={block.note || ''}
            onChange={(e) => onUpdate({ note: e.target.value })}
            placeholder="Update note..."
            rows={3}
          />
        </div>
      );

    default:
      return <div className="text-muted-foreground">Unknown block type: {block.type}</div>;
  }
}

function getDefaultBlockContent(type: BlockType): any {
  switch (type) {
    case 'paragraph':
    case 'text':
      return { text: '' };
    case 'heading':
    case 'header':
      return { text: '', level: 2 };
    case 'image':
      return { url: '', caption: '', alt: '' };
    case 'gallery':
      return { images: [] };
    case 'video':
      return { url: '', caption: '' };
    case 'list':
      return { items: [''], ordered: false };
    case 'quote':
      return { text: '', author: '' };
    case 'faq':
    case 'accordion':
      return { items: [{ question: '', answer: '' }] };
    case 'creative_team':
      return { members: [{ name: '', role: '' }] };
    case 'html':
      return { html: '' };
    case 'ai_prompt':
      return { prompt: '' };
    case 'update_note':
      return { date: new Date().toISOString().split('T')[0], note: '' };
    default:
      return {};
  }
}

// Missing icon import
import { ChevronDown } from "lucide-react";
