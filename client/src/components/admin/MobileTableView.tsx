import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileTableColumn<T> {
    key: keyof T;
    label: string;
    render?: (value: any, item: T, index: number) => React.ReactNode;
    badge?: boolean;
    className?: string;
}

interface MobileTableViewProps<T> {
    data: T[];
    columns: MobileTableColumn<T>[];
    idKey: keyof T;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    isLoading?: boolean;
}

export function MobileTableView<T extends Record<string, any>>({
    data,
    columns,
    idKey,
    onEdit,
    onDelete,
    onView,
    isLoading
}: MobileTableViewProps<T>) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-muted/20 animate-pulse">
                        <CardContent className="pt-6 h-32" />
                    </Card>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="bg-muted/20">
                <CardContent className="pt-6 text-center text-muted-foreground">
                    No items found
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <Card key={String(item[idKey])} className="overflow-hidden">
                    <CardContent className="pt-4 pb-3">
                        <div className="space-y-3">
                            {/* Main info rows */}
                            {columns.map((col) => {
                                const value = item[col.key];
                                const displayValue = col.render ? col.render(value, item, index) : value;

                                return (
                                    <div key={String(col.key)} className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            {col.label}
                                        </p>
                                        <div className={cn("text-sm", col.className)}>
                                            {col.badge ? (
                                                <Badge variant="secondary" className="text-xs">
                                                    {displayValue}
                                                </Badge>
                                            ) : (
                                                <p className="text-foreground break-words">{displayValue || "-"}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Action buttons */}
                            {(onEdit || onDelete || onView) && (
                                <div className="flex gap-2 pt-2 border-t">
                                    {onView && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs h-8"
                                            onClick={() => onView(item)}
                                        >
                                            View
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs h-8"
                                            onClick={() => onEdit(item)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDelete(item)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
