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
import { Plus, Pencil, Trash2, Globe, Instagram, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ADMIN_PANEL_CLASS, getAdminAccentColor } from './adminTheme';
import { AdminStatStrip } from './AdminStatStrip';
import { AdminFilterBar } from './AdminFilterBar';
import { AdminEmptyState } from './AdminEmptyState';

export function CollaboratorsManager() {
    const [, setLocation] = useLocation();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { data: collaborators, isLoading, refetch } = trpc.collaborators.list.useQuery();
    const deleteMutation = trpc.collaborators.delete.useMutation({
        onSuccess: () => {
            toast.success('Collaborator deleted');
            refetch();
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to delete collaborator');
        }
    });

    const filtered = useMemo(() => {
        const rows = collaborators || [];
        return rows.filter((collab) => {
            const q = search.toLowerCase();
            const searchMatch = !search || [collab.name, collab.slug, collab.role]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q);
            const roleMatch = statusFilter === 'all' || (collab.role || 'Partner') === statusFilter;
            return searchMatch && roleMatch;
        });
    }, [collaborators, search, statusFilter]);

    const roles = useMemo(() => {
        const set = new Set((collaborators || []).map((c) => c.role || 'Partner').filter(Boolean));
        return Array.from(set).sort();
    }, [collaborators]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this collaborator?')) {
            deleteMutation.mutate({ id });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: getAdminAccentColor('news') }}>Collaborators ({collaborators?.length || 0})</h2>
                <Button onClick={() => setLocation('/admin/collaborators/new')} className="text-white" style={{ backgroundColor: getAdminAccentColor('news') }}>
                    <Plus className="mr-2 h-4 w-4" /> New Collaborator
                </Button>
            </div>

            <div className={`rounded-md ${ADMIN_PANEL_CLASS} p-4 space-y-4`}>
                <AdminStatStrip
                    items={[
                        { label: 'Total', value: collaborators?.length || 0, accent: 'news' },
                        { label: 'Roles', value: roles.length, accent: 'news' },
                    ]}
                />
                <AdminFilterBar
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search collaborator name, slug, role..."
                    statusValue={statusFilter}
                    onStatusChange={setStatusFilter}
                    statusOptions={[
                        { label: 'All Roles', value: 'all' },
                        ...roles.map((r) => ({ label: r, value: r }))
                    ]}
                />

                {collaborators && collaborators.length > 0 ? (
                    <div className="rounded-md border bg-card overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Social/Web</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((collab) => (
                                    <TableRow
                                        key={collab.id}
                                        className="cursor-pointer transition-colors hover:bg-muted/40"
                                        onClick={() => setLocation(`/admin/collaborators/${collab.id}/edit`)}
                                    >
                                        <TableCell className="font-medium p-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold" style={{ color: getAdminAccentColor('news') }}>{collab.name}</span>
                                                {collab.slug && (
                                                    <span className="text-[10px] text-muted-foreground opacity-70">
                                                        /{collab.slug}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <Badge variant="outline" className="text-[10px] px-1 h-4 leading-none truncate max-w-[120px]">
                                                {collab.role || 'Partner'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <div className="flex gap-2">
                                                {collab.website && (
                                                    <div title={collab.website}>
                                                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                {collab.instagramHandle && (
                                                    <div title={collab.instagramHandle}>
                                                        <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                {collab.portfolioUrl && (
                                                    <div title="Portfolio Link">
                                                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right p-2" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7"
                                                    onClick={() => setLocation(`/admin/collaborators/${collab.id}/edit`)}
                                                    title="Edit Collaborator"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(collab.id)}
                                                    title="Delete Collaborator"
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

                {collaborators?.length === 0 ? (
                    <AdminEmptyState
                        title="No collaborators yet"
                        description="Add collaborators to populate the about network section."
                        actionLabel="Create Collaborator"
                        onAction={() => setLocation('/admin/collaborators/new')}
                        accent="news"
                    />
                ) : filtered.length === 0 ? (
                    <AdminEmptyState
                        title="No matching collaborators"
                        description="Try another search query or role filter."
                        accent="news"
                    />
                ) : null}
            </div>
        </div>
    );
}
