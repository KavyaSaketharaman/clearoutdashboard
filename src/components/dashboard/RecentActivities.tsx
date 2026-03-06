import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/types";

interface RecentActivitiesProps {
  activities: Activity[];
}

function activityLabel(item: Activity): string {
  const typeMap: Record<string, string> = {
    email_verifier: `Bulk verification of "${item.name}"`,
    email_finder:   `Email finder job "${item.name}"`,
    reverse_lookup: `Reverse lookup of "${item.name}"`,
  };
  return `${typeMap[item.service_type] ?? `"${item.name}"`} is ${item.request_status}`;
}

function activityStats(item: Activity): string | null {
  if (!item.stats) return null;
  const { valid = 0, invalid = 0, catch_all = 0, unknown = 0 } = item.stats;
  return `Valid: ${valid}  ·  Invalid: ${invalid}  ·  Catch-all: ${catch_all}  ·  Unknown: ${unknown}`;
}

type ActivityFilter = "All" | "Email Verifier" | "More ▾";

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("All");

  const filtered = activities.filter((a) => {
    if (activityFilter === "All")            return true;
    if (activityFilter === "Email Verifier") return a.service_type === "email_verifier";
    return true;
  });

  return (
    <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
          <Badge className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 h-auto">
            {activities.length}
          </Badge>
          <div className="ml-auto flex gap-2 text-xs">
            {(["All", "Email Verifier", "More ▾"] as ActivityFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setActivityFilter(f)}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  activityFilter === f ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activities</p>
        ) : (
          filtered.map((a, i) => (
            <div key={i} className="text-sm space-y-1 border-b pb-3">
              <p className="text-muted-foreground">{activityLabel(a)}</p>
              {a.stats && <p className="text-xs text-muted-foreground">{activityStats(a)}</p>}
              <p className="text-xs text-gray-400">
                {new Date(a.created_on).toLocaleDateString("en-GB", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
                {" · "}{a.member_name}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
