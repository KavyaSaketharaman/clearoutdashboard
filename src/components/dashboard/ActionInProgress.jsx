import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function countInProgress(inprogress) {
  if (!inprogress) return 0;
  return Object.values(inprogress).reduce((acc, svc) => acc + (svc.data?.length ?? 0), 0);
}

export default function ActionInProgress({ inprogress }) {
  const count = countInProgress(inprogress);

  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">Action In Progress</CardTitle>
          <Badge className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 h-auto">
            {count}
          </Badge>
        </div>
        <div className="flex gap-2 mt-1">
          <button className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">All</button>
          <button className="text-xs px-3 py-1 rounded-full text-muted-foreground hover:bg-muted">Near Completion</button>
        </div>
      </CardHeader>
      <CardContent>
        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-orange-200 flex items-center justify-center">
              <Search className="w-6 h-6 text-orange-300" />
            </div>
            <p className="text-sm text-muted-foreground text-center">No actions in progress</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(inprogress).flatMap(([svcKey, svc]) =>
              (svc.data ?? []).map((item, i) => (
                <div key={`${svcKey}-${i}`} className="text-sm border-b pb-2">
                  <p className="font-medium capitalize">{svcKey.replace(/_/g, " ")}</p>
                  <p className="text-xs text-muted-foreground">{item.name ?? item.id ?? "—"}</p>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}