import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { BarChart2 } from "lucide-react";

const creditChartConfig = {
  emailVerifier: { label: "Email Verifier", color: "#2dd4bf" },
  emailFinder:   { label: "Email Finder",   color: "#f59e0b" },
  prospect:      { label: "Prospect",       color: "#f87171" },
  formGuard:     { label: "Form Guard",     color: "#6366f1" },
};

const TIME_FILTERS = ["Today", "Y'day", "7 days", "30 days", "More..."];

// Handles "DD M YYYY" (e.g. "12 2 2026") as well as ISO strings
function toMidnight(dateVal) {
  if (typeof dateVal === "string" && /^\d{1,2} \d{1,2} \d{4}$/.test(dateVal.trim())) {
    const [day, month, year] = dateVal.trim().split(" ").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed
  }
  const d = new Date(dateVal);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function filterByRange(stats, filter) {
  if (!stats?.length) return [];

  // Sort ascending by date
  const sorted = [...stats].sort((a, b) => toMidnight(a.date) - toMidnight(b.date));

  // Always anchor to real today
  const todayMid = toMidnight(new Date());

  const mapItem = (d) => ({
    date:          toMidnight(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    emailVerifier: d.ev_billable        ?? 0,
    emailFinder:   d.ef_billable        ?? 0,
    prospect:      d.prospect_billable  ?? 0,
    formGuard:     d.js_widget_billable ?? 0,
  });

  if (filter === "Today") {
    return sorted
      .filter((d) => toMidnight(d.date).getTime() === todayMid.getTime())
      .map(mapItem);
  }

  if (filter === "Y'day") {
    const yesterday = new Date(todayMid);
    yesterday.setDate(yesterday.getDate() - 1);
    return sorted
      .filter((d) => toMidnight(d.date).getTime() === yesterday.getTime())
      .map(mapItem);
  }

  // "7 days" = last 7 days including today, "30 days" = last 30 including today
  const daysBack = filter === "7 days" ? 6 : filter === "30 days" ? 29 : null;

  if (daysBack !== null) {
    const cutoff = new Date(todayMid);
    cutoff.setDate(cutoff.getDate() - daysBack);
    return sorted
      .filter((d) => toMidnight(d.date) >= cutoff)
      .map(mapItem);
  }

  // "More..." — show all data
  return sorted.map(mapItem);
}

function sumCredits(filtered) {
  return filtered.reduce(
    (acc, d) => ({
      total:         acc.total         + d.emailVerifier + d.emailFinder + d.prospect + d.formGuard,
      emailVerifier: acc.emailVerifier + d.emailVerifier,
      emailFinder:   acc.emailFinder   + d.emailFinder,
      prospect:      acc.prospect      + d.prospect,
    }),
    { total: 0, emailVerifier: 0, emailFinder: 0, prospect: 0 }
  );
}

export default function CreditUsageChart({ stats }) {
  const [activeFilter, setActiveFilter] = useState("30 days");

  const allStats =
    stats?.user_stats?.[0]?.stats ??
    (Array.isArray(stats) ? stats : []);

  const filteredStats = filterByRange(allStats, activeFilter);
  const creditTotals  = sumCredits(filteredStats);
  const hasData       = filteredStats.length > 0;

  return (
    <Card className="col-span-12 lg:col-span-6 border-0 shadow-sm bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-semibold">Credit Usage Overview</CardTitle>
          <div className="flex items-center gap-1 text-sm">
            {TIME_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  activeFilter === f
                    ? "text-orange-500 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 px-2">
          {[
            { label: "Total Credits",  value: creditTotals.total },
            { label: "Email Verifier", value: creditTotals.emailVerifier },
            { label: "Email Finder",   value: creditTotals.emailFinder },
            { label: "Prospect",       value: creditTotals.prospect },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-bold text-orange-500">{item.value}</p>
            </div>
          ))}
        </div>

        {hasData ? (
          <ChartContainer config={creditChartConfig} className="h-[220px] w-full">
            <LineChart data={filteredStats} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="emailVerifier" stroke="var(--color-emailVerifier)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="emailFinder"   stroke="var(--color-emailFinder)"   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="prospect"      stroke="var(--color-prospect)"      strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="formGuard"     stroke="var(--color-formGuard)"     strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="h-[220px] flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <BarChart2 className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">No usage data yet</p>
              <p className="text-xs text-gray-300 mt-0.5">Credit activity will appear here once you start verifying</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
          {Object.entries(creditChartConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-3 h-0.5 inline-block rounded" style={{ background: cfg.color }} />
              {cfg.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}