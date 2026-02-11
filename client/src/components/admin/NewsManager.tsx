import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NewsManager() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>News & Updates</CardTitle>
            <CardDescription>Manage news items and career updates</CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New News Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <p>News management coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
