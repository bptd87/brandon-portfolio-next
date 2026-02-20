import { useState } from 'react';
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
import { Plus, Pencil, Trash2, Globe, Instagram, User } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function CollaboratorsManager() {
    const [, setLocation] = useLocation();
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

    if (isLoading) return <div>Loading...</div>;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this collaborator?')) {
            deleteMutation.mutate({ id });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Collaborators</h2>
                <Button onClick={() => setLocation('/admin/collaborators/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Collaborator
                </Button>
            </div>

            <div className="rounded-md border bg-card">
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
                        {collaborators?.map((collab) => (
                            <TableRow
                                key={collab.id}
                                className="cursor-pointer transition-colors hover:bg-muted/50"
                                onClick={() => setLocation(`/admin/collaborators/${collab.id}/edit`)}
                            >
                                <TableCell className="font-medium p-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{collab.name}</span>
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
        </div>
    );
}
