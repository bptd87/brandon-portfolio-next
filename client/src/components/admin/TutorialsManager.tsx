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
import { Plus, Pencil, Trash2, ExternalLink, Clock, Play } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function TutorialsManager() {
    const [, setLocation] = useLocation();
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

    if (isLoading) return <div>Loading...</div>;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tutorial?')) {
            deleteMutation.mutate({ id });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Tutorials</h2>
                <Button onClick={() => setLocation('/admin/tutorials/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Tutorial
                </Button>
            </div>

            <div className="rounded-md border bg-card">
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
                        {tutorials?.map((tutorial) => (
                            <TableRow
                                key={tutorial.id}
                                className="cursor-pointer transition-colors hover:bg-muted/50"
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
                                        <span className="text-sm font-semibold">{tutorial.title}</span>
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
        </div>
    );
}
