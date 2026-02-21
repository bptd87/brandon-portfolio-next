import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '../../lib/trpc';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, ExternalLink, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ADMIN_PANEL_CLASS, getAdminAccentColor } from './adminTheme';
import { AdminStatStrip } from './AdminStatStrip';
import { AdminFilterBar } from './AdminFilterBar';
import { AdminEmptyState } from './AdminEmptyState';

export function TutorialsManager() {
    const [, setLocation] = useLocation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { data: tutorials, isLoading, refetch } = trpc.tutorials.list.useQuery();
    const deleteMutation = trpc.tutorials.delete.useMutation({
        onSuccess: () => {
            toast.success('Tutorial deleted');
            refetch();
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to delete tutorial');
        }
    });

    const filteredTutorials = useMemo(() => {
        const rows = tutorials || [];
        return rows.filter((tutorial) => {
            const q = search.toLowerCase();
            const searchMatch = !search || [tutorial.title, tutorial.slug, tutorial.category, tutorial.difficulty]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q);
            const statusMatch = statusFilter === 'all' || tutorial.status === statusFilter;
            return searchMatch && statusMatch;
        });
    }, [search, statusFilter, tutorials]);

    const stats = useMemo(() => {
        const rows = tutorials || [];
        return {
            published: rows.filter((t) => t.status === 'published').length,
            drafts: rows.filter((t) => t.status === 'draft').length,
            total: rows.length,
            video: rows.filter((t) => t.video_url).length,
        };
    }, [tutorials]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tutorial?')) {
            deleteMutation.mutate({ id });
        }
    };

    return (
        <div className="space-y-4">
            <CardHeaderBlock total={stats.total} onCreate={() => setLocation('/admin/tutorials/new')} />

            <div className={`rounded-md ${ADMIN_PANEL_CLASS} p-4 space-y-4`}>
                <AdminStatStrip
                    items={[
                        { label: 'Total', value: stats.total, accent: 'articles' },
                        { label: 'Published', value: stats.published, accent: 'articles' },
                        { label: 'Drafts', value: stats.drafts, accent: 'articles' },
                        { label: 'With Video', value: stats.video, accent: 'articles' },
                    ]}
                />
                <AdminFilterBar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search tutorial title, slug, category..."
                    statusValue={statusFilter}
                    onStatusChange={setStatusFilter}
                    statusOptions={[
                        { label: 'All Statuses', value: 'all' },
                        { label: 'Published', value: 'published' },
                        { label: 'Draft', value: 'draft' },
                        { label: 'Archived', value: 'archived' },
                    ]}
                />

                {tutorials && tutorials.length > 0 ? (
                    <div className="rounded-md border bg-card overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[80px]">Cover</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Meta</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTutorials.map((tutorial) => (
                                    <TableRow
                                        key={tutorial.id}
                                        className="cursor-pointer transition-colors hover:bg-muted/40"
                                        onClick={() => setLocation(`/admin/tutorials/${tutorial.id}/edit`)}
                                    >
                                        <TableCell>
                                            {tutorial.cover_image ? (
                                                <img
                                                    src={tutorial.cover_image}
                                                    alt={tutorial.title}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                                    No img
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium p-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold" style={{ color: getAdminAccentColor('articles') }}>{tutorial.title}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-muted-foreground opacity-70">
                                                        /{tutorial.slug}
                                                    </span>
                                                    {tutorial.category && (
                                                        <span className="text-[10px] bg-secondary px-1 rounded text-secondary-foreground">
                                                            {tutorial.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex gap-1">
                                                    {tutorial.difficulty && (
                                                        <Badge variant="outline" className="text-[10px] px-1 h-4 leading-none lowercase">
                                                            {tutorial.difficulty}
                                                        </Badge>
                                                    )}
                                                    <Badge variant={tutorial.status === 'published' ? 'default' : 'secondary'} className="text-[10px] px-1 h-4 leading-none">
                                                        {tutorial.status || 'draft'}
                                                    </Badge>
                                                </div>
                                                {tutorial.duration && (
                                                    <div className="flex items-center text-[10px] text-muted-foreground">
                                                        <Clock className="w-2.5 h-2.5 mr-0.5" />
                                                        {tutorial.duration}m
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground p-2">
                                            {format(new Date(tutorial.created_at), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-right p-2" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => window.open(`/tutorials/${tutorial.slug}`, '_blank')}
                                                    title="View Tutorial"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => setLocation(`/admin/tutorials/${tutorial.id}/edit`)}
                                                    title="Edit Tutorial"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(tutorial.id)}
                                                    title="Delete Tutorial"
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
                ) : null}

                {tutorials?.length === 0 ? (
                    <AdminEmptyState
                        title="No tutorials yet"
                        description="Add your first tutorial to build the studio education section."
                        actionLabel="Create Tutorial"
                        onAction={() => setLocation('/admin/tutorials/new')}
                        accent="articles"
                    />
                ) : filteredTutorials.length === 0 ? (
                    <AdminEmptyState
                        title="No matching tutorials"
                        description="Try another search or status filter."
                        accent="articles"
                    />
                ) : null}
            </div>
        </div>
    );
}

function CardHeaderBlock({ total, onCreate }: { total: number; onCreate: () => void }) {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: getAdminAccentColor('articles') }}>Tutorials ({total})</h2>
            <Button onClick={onCreate} className="text-white" style={{ backgroundColor: getAdminAccentColor('articles') }}>
                <Plus className="mr-2 h-4 w-4" /> New Tutorial
            </Button>
        </div>
    );
}
