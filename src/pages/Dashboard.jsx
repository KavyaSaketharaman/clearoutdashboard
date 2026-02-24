import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Mail,
  List,
  Search,
  Code2,
  Linkedin,
  Chrome,
  Info,
  RefreshCw,
  Plug,
  Zap,
  Headphones,
} from "lucide-react";

// ── Chart config ───────────────────────────────────────────────────────────────
const creditChartConfig = {
  emailVerifier: { label: "Email Verifier", color: "#2dd4bf" },
  emailFinder:   { label: "Email Finder",   color: "#f59e0b" },
  prospect:      { label: "Prospect",       color: "#f87171" },
  formGuard:     { label: "Form Guard",     color: "#6366f1" },
};

const TIME_FILTERS = ["Today", "Y'day", "7 days", "30 days", "More..."];

// ── Icon maps ──────────────────────────────────────────────────────────────────
const FA_ICON_MAP = {
  "fa-envelope-o": <Mail     className="w-4 h-4 text-orange-500" />,
  "fa-list":       <List     className="w-4 h-4 text-orange-500" />,
  "fa-search":     <Search   className="w-4 h-4 text-orange-500" />,
  "fa-code":       <Code2    className="w-4 h-4 text-orange-500" />,
  "fa-retweet":    <Linkedin className="w-4 h-4 text-orange-500" />,
};

const REC_ICON_MAP = [
  { match: "Chrome",    icon: <Chrome     className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> },
  { match: "WordPress", icon: <Plug       className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> },
  { match: "Sheets",    icon: <Zap        className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> },
  { match: "Auto",      icon: <Zap        className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> },
  { match: "Help",      icon: <Headphones className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> },
];

// ── HTML helpers ───────────────────────────────────────────────────────────────
function parseLabel(html) {
  const m = html.match(/>([^<]+)</);
  return m ? m[1] : html.replace(/<[^>]+>/g, "");
}
function parseHref(html) {
  const m = html.match(/href=['"]([^'"]+)['"]/);
  return m ? m[1] : "#";
}
function recIcon(title) {
  const found = REC_ICON_MAP.find((r) => title.includes(r.match));
  return found?.icon ?? <Chrome className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />;
}

// ── Chart helpers ──────────────────────────────────────────────────────────────
function filterByRange(stats, filter) {
  if (!stats?.length) return [];
  const sorted = [...stats].sort((a, b) => new Date(a.date) - new Date(b.date));
  const last   = new Date(sorted[sorted.length - 1].date);
  const daysMap = { "Today": 1, "Y'day": 2, "7 days": 7, "30 days": 30 };
  const days   = daysMap[filter] ?? sorted.length;
  const cutoff = new Date(last);
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

// ── Activity helpers ───────────────────────────────────────────────────────────
function activityLabel(item) {
  const typeMap = {
    email_verifier: `Bulk verification of "${item.name}"`,
    email_finder:   `Email finder job "${item.name}"`,
    reverse_lookup: `Reverse lookup of "${item.name}"`,
  };
  return `${typeMap[item.service_type] ?? `"${item.name}"`} is ${item.request_status}`;
}

function activityStats(item) {
  if (!item.stats) return null;
  const { valid = 0, invalid = 0, catch_all = 0, unknown = 0 } = item.stats;
  return `Valid: ${valid}  ·  Invalid: ${invalid}  ·  Catch-all: ${catch_all}  ·  Unknown: ${unknown}`;
}

function countInProgress(inprogress) {
  if (!inprogress) return 0;
  return Object.values(inprogress).reduce((acc, svc) => acc + (svc.data?.length ?? 0), 0);
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dashboard,      setDashboard]      = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeFilter,   setActiveFilter]   = useState("30 days");
  const [activityFilter, setActivityFilter] = useState("All");

  // ── Single axios call to public JSON ──────────────────────────────────────
  useEffect(() => {
    axios.get("/dashboard_data.json")
      .then(({ data }) => setDashboard(data))
      .catch((err)     => setError(err.message))
      .finally(()      => setLoading(false));
  }, []);

  // ── Destructure all sections from the single response ─────────────────────
  const welcome         = dashboard?.welcome;
  const stats           = dashboard?.overall;
  const quicklinks      = dashboard?.quicklinks       ?? [];
  const recommendations = dashboard?.recommendation   ?? [];
  const inprogress      = dashboard?.inprogress       ?? {};
  const activities      = dashboard?.recentactivities ?? [];
  const didYouKnow      = dashboard?.didyouknow       ?? [];

  // ── Derived chart values ───────────────────────────────────────────────────
  const allStats        = stats?.user_stats?.[0]?.stats ?? [];
  const filteredStats   = filterByRange(allStats, activeFilter);
  const creditTotals    = sumCredits(filteredStats);
  const inprogressCount = countInProgress(inprogress);

  const filteredActivities = activities.filter((a) => {
    if (activityFilter === "All")            return true;
    if (activityFilter === "Email Verifier") return a.service_type === "email_verifier";
    return true;
  });

  // ── Full page loading ──────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  // ── Full page error ────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-red-500 font-semibold">Failed to load dashboard</p>
        <p className="text-sm text-gray-400">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true);
            axios.get("/dashboard_data.json")
              .then(({ data }) => setDashboard(data))
              .catch((err)     => setError(err.message))
              .finally(()      => setLoading(false));
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-4">

        {/* ══ TOP ROW ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-12 gap-4">

          {/* ── User Info ── */}
          <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Welcome !</p>
                <p className="text-lg font-bold">{welcome?.name ?? "—"}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="font-semibold">{welcome?.subscription?.[0]?.product_name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining Credits</p>
                  <p className="font-bold text-base">
                    {welcome?.org_details?.credits?.available != null
                      ? welcome.org_details.credits.available.toLocaleString()
                      : "—"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Organization</p>
                    <p className="font-semibold">{welcome?.org_details?.name ?? "—"}</p>
                  </div>
                  <Button variant="link" className="text-orange-500 p-0 h-auto text-xs">Switch</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Team Members</p>
                    <p className="font-semibold">
                      {welcome?.org_details?.usedMemberSeat ?? "—"} / {welcome?.org_details?.totalMemberSeat ?? "—"}
                    </p>
                  </div>
                  <Button variant="link" className="text-orange-500 p-0 h-auto text-xs">Manage</Button>
                </div>
                <Button variant="link" className="text-orange-500 p-0 h-auto text-xs">
                  Looking for more seats?
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Credit Usage Chart ── */}
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
              {/* Totals row */}
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

              {/* Line chart */}
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

              {/* Legend */}
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

          {/* ── Getting Started ── */}
          <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quicklinks.map((item) => {
                const icon  = FA_ICON_MAP[item.font_awesome?.trim()] ?? <Mail className="w-4 h-4 text-orange-500" />;
                const label = parseLabel(item.title);
                const href  = parseHref(item.title);
                return (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div>
                      <a href={href} className="text-sm font-semibold text-orange-500 leading-tight hover:underline cursor-pointer">
                        {label}
                      </a>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

        </div>

        {/* ══ BOTTOM ROW ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-12 gap-4">

          {/* ── Recommended For You ── */}
          <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recommended For You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((item) => {
                const label = parseLabel(item.title);
                const href  = parseHref(item.title);
                return (
                  <div key={label} className="flex items-start gap-2.5">
                    {recIcon(label)}
                    <div>
                      <a href={href} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-semibold hover:underline cursor-pointer">
                        {label}
                      </a>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ── Action In Progress ── */}
          <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Action In Progress</CardTitle>
                <Badge className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 h-auto">
                  {inprogressCount}
                </Badge>
              </div>
              <div className="flex gap-2 mt-1">
                <button className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">All</button>
                <button className="text-xs px-3 py-1 rounded-full text-muted-foreground hover:bg-muted">Near Completion</button>
              </div>
            </CardHeader>
            <CardContent>
              {inprogressCount === 0 ? (
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

          {/* ── Recent Activities ── */}
          <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
                <Badge className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 h-auto">
                  {activities.length}
                </Badge>
                <div className="ml-auto flex gap-2 text-xs">
                  {["All", "Email Verifier", "More ▾"].map((f) => (
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
              {filteredActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activities</p>
              ) : (
                filteredActivities.map((a, i) => (
                  <div key={i} className="text-sm space-y-1 border-b pb-3">
                    <p className="text-muted-foreground">{activityLabel(a)}</p>
                    {a.stats && (
                      <p className="text-xs text-muted-foreground">{activityStats(a)}</p>
                    )}
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

          {/* ── Did You Know ── */}
          <Card className="col-span-12 lg:col-span-3 border-0 shadow-sm bg-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Did You Know?</CardTitle>
            </CardHeader>
            <CardContent>
              {didYouKnow[0] ? (
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-snug mb-1">
                      {didYouKnow[0].title}
                    </p>
                    <a
                      href={didYouKnow[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-500 hover:underline font-medium"
                    >
                      Learn More →
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nothing to show</p>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
} 