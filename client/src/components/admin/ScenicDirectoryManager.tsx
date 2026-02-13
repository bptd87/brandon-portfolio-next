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
import { Plus, Pencil, Trash2, ExternalLink, MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner';

export function ScenicDirectoryManager() {
    const [, setLocation] = useLocation();
    const { data: entries, isLoading, refetch } = trpc.scenicDirectory.list.useQuery();
    const deleteMutation = trpc.scenicDirectory.delete.useMutation({
        onSuccess: () => {
            toast.success('Entry deleted');
            refetch();
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to delete entry');
        }
    });

    if (isLoading) return <div>Loading...</div>;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this directory entry?')) {
            deleteMutation.mutate({ id });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Scenic Directory</h2>
                <Button onClick={() => setLocation('/admin/scenic-directory/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Entry
                </Button>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries?.map((entry) => (
                            <TableRow
                                key={entry.id}
                                className="cursor-pointer transition-colors hover:bg-muted/50"
                                onClick={() => setLocation(`/admin/scenic-directory/${entry.id}/edit`)}
                            >
                                <TableCell className="font-medium p-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold">{entry.title}</span>
                                        {entry.url && (
                                            <span className="text-[10px] text-muted-foreground opacity-70 flex items-center gap-1">
                                                <Globe className="w-2 h-2" />
                                                {new URL(entry.url).hostname}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="p-2">
                                    <Badge variant="secondary" className="text-[10px] px-1 h-4 leading-none">
                                        {entry.categorySlug}
                                    </Badge>
                                </TableCell>
                                <TableCell className="p-2">
                                    <div className="flex flex-col gap-0.5">
                                        {entry.location && (
                                            <div className="flex items-center text-[10px] text-muted-foreground">
                                                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                                                {entry.location}
                                            </div>
                                        )}
                                        {entry.description && (
                                            <div className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">
                                                {entry.description}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right p-2" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex justify-end gap-1">
                                        {entry.url && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => window.open(entry.url, '_blank')}
                                                title="Visit Website"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setLocation(`/admin/scenic-directory/${entry.id}/edit`)}
                                            title="Edit Entry"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(entry.id)}
                                            title="Delete Entry"
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
