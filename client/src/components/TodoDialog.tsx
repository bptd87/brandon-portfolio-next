import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

import { useAuth } from "@/_core/hooks/useAuth";

export function TodoDialog({ open, onOpenChange }: TodoDialogProps) {
    const { user, loading } = useAuth();
    const [newTodo, setNewTodo] = useState("");
    const utils = trpc.useContext();

    const { data: todos, isLoading } = trpc.todos.list.useQuery(undefined, {
        enabled: open && !!user,
    });

    const createMutation = trpc.todos.create.useMutation({
        onSuccess: () => {
            setNewTodo("");
            utils.todos.list.invalidate();
        },
    });

    const toggleMutation = trpc.todos.toggle.useMutation({
        onSuccess: () => {
            utils.todos.list.invalidate();
        },
    });

    const deleteMutation = trpc.todos.delete.useMutation({
        onSuccess: () => {
            utils.todos.list.invalidate();
        },
    });

    const handleCreate = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newTodo.trim()) return;
        createMutation.mutate({ text: newTodo });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tasks</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : !user ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <p className="text-muted-foreground text-center">
                            You must be logged in to manage tasks.
                        </p>
                        <Button onClick={() => window.location.href = '/login'}>
                            Log In
                        </Button>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleCreate} className="flex items-center space-x-2 mt-2">
                            <Input
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a new task..."
                            />
                            <Button type="submit" size="icon" disabled={createMutation.isPending || !newTodo.trim()}>
                                {createMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                            </Button>
                        </form>

                        <div className="mt-4">
                            {isLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <ScrollArea className="h-[300px] pr-4">
                                    <div className="space-y-2">
                                        {todos?.length === 0 && (
                                            <p className="text-center text-sm text-muted-foreground py-8">
                                                No tasks yet. Add one above!
                                            </p>
                                        )}
                                        {todos?.map((todo) => (
                                            <div
                                                key={todo.id}
                                                className={cn(
                                                    "flex items-center justify-between p-2 rounded-lg border",
                                                    todo.completed ? "bg-muted/50" : "bg-card"
                                                )}
                                            >
                                                <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                    <Checkbox
                                                        checked={todo.completed}
                                                        onCheckedChange={() => toggleMutation.mutate({ id: todo.id })}
                                                    />
                                                    <span
                                                        className={cn(
                                                            "text-sm truncate cursor-pointer select-none",
                                                            todo.completed && "line-through text-muted-foreground"
                                                        )}
                                                        onClick={() => toggleMutation.mutate({ id: todo.id })}
                                                    >
                                                        {todo.text}
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => deleteMutation.mutate({ id: todo.id })}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );

}
