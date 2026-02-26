import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const creditChartConfig = {
  emailVerifier: { label: "Email Verifier", color: "#2dd4bf" },
  emailFinder:   { label: "Email Finder",   color: "#f59e0b" },
  prospect:      { label: "Prospect",       color: "#f87171" },
  formGuard:     { label: "Form Guard",     color: "#6366f1" },
};

const TIME_FILTERS = ["Today", "Y'day", "7 days", "30 days", "More..."];

function filterByRange(stats, filter) {
  if (!stats?.length) return [];
  const sorted  = [...stats].sort((a, b) => new Date(a.date) - new Date(b.date));
  const last    = new Date(sorted[sorted.length - 1].date);
  const daysMap = { "Today": 1, "Y'day": 2, "7 days": 7, "30 days": 30 };
  const days    = daysMap[filter] ?? sorted.length;
  const cutoff  = new Date(last);
  cutoff.setDate(cutoff.getDate() - days + 1);
  return sorted
    .filter((d) => new Date(d.date) >= cutoff)
    .map((d) => ({
      date:          new Date(d.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      emailVerifier: d.ev_billable,
      emailFinder:   d.ef_billable,
      prospect:      d.prospect_billable,
      formGuard:     d.js_widget_billable,
    }));
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

  const allStats      = stats?.user_stats?.[0]?.stats ?? [];
  const filteredStats = filterByRange(allStats, activeFilter);
  const creditTotals  = sumCredits(filteredStats);

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

        {filteredStats.length > 0 ? (
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
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
            No data for this range
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