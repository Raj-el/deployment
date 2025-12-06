// src/components/analytics/CustomerAnalysis.tsx
import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Filter,
  Download,
  ChevronLeft,
} from "lucide-react";

/* ---- Charts (Recharts) ---- */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

/* ----------------------------------------------------------------
   MOCK DATA (replace with API integration)
   ---------------------------------------------------------------- */
// KPI tiles (multi-dimensional health aligns to US-ANA-006)
const kpis = [
  {
    key: "arr",
    label: "Annual Recurring Revenue (ARR)",
    value: 20.1,
    unit: "M",
    delta: "+28% vs last year",
    trend: "up" as const,
  },
  {
    key: "nrr",
    label: "Net Revenue Retention (NRR)",
    value: 124,
    unit: "%",
    delta: "+6% last quarter",
    trend: "up" as const,
  },
  {
    key: "grr",
    label: "Gross Revenue Retention (GRR)",
    value: 96.8,
    unit: "%",
    delta: "Focus on reducing churn",
    trend: "neutral" as const,
  },
  {
    key: "mau",
    label: "Active Users (MAU)",
    value: 12450,
    unit: "",
    delta: "+485 this month",
    trend: "up" as const,
  },
  {
    key: "customers",
    label: "Total Customers",
    value: 158,
    unit: "",
    delta: "+8 new this quarter",
    trend: "up" as const,
  },
  {
    key: "health",
    label: "Overall Customer Health",
    value: 75,
    unit: "%",
    delta: "Avg. score across all accounts",
    trend: "neutral" as const,
  },
  {
    key: "at_risk",
    label: "Accounts at Risk",
    value: 12,
    unit: "",
    delta: "Require immediate attention",
    trend: "down" as const,
  },
  {
    key: "avg_usage",
    label: "Avg. Product Usage",
    value: 73,
    unit: "%",
    delta: "Daily active feature engagement",
    trend: "neutral" as const,
  },
  {
    key: "tickets",
    label: "Open Support Tickets",
    value: 18,
    unit: "",
    delta: "3 critical, 8 high priority",
    trend: "down" as const,
  },
];

// Usage trend chart (US-ANA-001)
const usageTrend = [
  { month: "Jan", users: 90, usage: 12, tickets: 11 },
  { month: "Feb", users: 98, usage: 13, tickets: 10 },
  { month: "Mar", users: 115, usage: 13.5, tickets: 9 },
  { month: "Apr", users: 130, usage: 14.3, tickets: 8 },
  { month: "May", users: 145, usage: 15.2, tickets: 8 },
  { month: "Jun", users: 158, usage: 14.7, tickets: 7 },
  { month: "Jul", users: 170, usage: 15.8, tickets: 7 },
];

// Top active users table (DAU/WAU/MAU proxy + stickiness per US-ANA-002)
const topUsers = [
  {
    name: "Analytics Pro Inc.",
    queries: 42,
    rating: 4.2,
    category: "Customer Success",
  },
  {
    name: "MidMarket Analytics Co.",
    queries: 35,
    rating: 4.4,
    category: "Customer Success",
  },
  {
    name: "DataVision Corp",
    queries: 28,
    rating: 4.1,
    category: "Customer Success",
  },
  {
    name: "SmallBiz Analytics",
    queries: 19,
    rating: 4.3,
    category: "Customer Success",
  },
  {
    name: "Clara Oren @ DataAnalytics Corp",
    queries: 15,
    rating: 4.0,
    category: "Customer Success",
  },
];

// AI Alerts & Insights (predictive flags per US-ANA-006 / 007 / 008)
const aiAlerts = [
  {
    id: "risk-1",
    account: "DataVision Corp",
    type: "risk",
    message: "Usage dropped 60% after champion departure",
    cta: "Schedule retention call",
  },
  {
    id: "opp-1",
    account: "Analytics Pro Inc.",
    type: "opportunity",
    message: "ML analytics usage at 95% of plan limit – upgrade opportunity",
    cta: "Present enterprise plan",
  },
  {
    id: "milestone-1",
    account: "TechFlow Solutions",
    type: "milestone",
    message: "Reached 30-day milestone with high engagement",
    cta: "Schedule success review",
  },
  {
    id: "feedback-1",
    account: "MidMarket Analytics Co.",
    type: "feedback",
    message: "NPS score improved from 7 to 9",
    cta: "Request case study",
  },
];

// FUSE (Feature, Usage, Support, Experience) health overview rows
const fuseRows = [
  { acct: "Analytics Pro Inc.", feature: "good", support: "good", nps: "good" },
  {
    acct: "MidMarket Analytics Co.",
    feature: "good",
    support: "good",
    nps: "good",
  },
  { acct: "SmallBiz Analytics", feature: "poor", support: "poor", nps: "poor" },
  { acct: "DataVision Corp", feature: "poor", support: "poor", nps: "poor" },
  { acct: "TechFlow Solutions", feature: "warn", support: "warn", nps: "warn" },
];

const arrList = [
  { acct: "DataVision Corp", arr: 380000, hue: "green" },
  { acct: "Analytics Pro Inc.", arr: 310000, hue: "green" },
  { acct: "TechFlow Solutions", arr: 280000, hue: "blue" },
  { acct: "MidMarket Analytics Co.", arr: 165000, hue: "yellow" },
  { acct: "DataInsights Corp", arr: 155000, hue: "indigo" },
  { acct: "RegionalInsights Co", arr: 35000, hue: "orange" },
  { acct: "SmallBiz Analytics", arr: 45000, hue: "red" },
];

// Status distribution (journey stages per US-ANA-008)
const statusSummary = [
  { name: "Active", value: 134, color: "#10B981" },
  { name: "Needs Attention", value: 12, color: "#F59E0B" },
  { name: "At Risk", value: 8, color: "#EF4444" },
  { name: "Onboarding", value: 4, color: "#3B82F6" },
];

/* ----------------------------------------------------------------
   SMALL HELPERS
   ---------------------------------------------------------------- */
function TrendChip({
  trend,
  text,
}: {
  trend: "up" | "down" | "neutral";
  text?: string;
}) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <TrendingUp className="h-3 w-3" />
        {text ?? "Up"}
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-rose-600">
        <TrendingDown className="h-3 w-3" />
        {text ?? "Down"}
      </span>
    );
  return <span className="text-xs text-slate-500">{text ?? "—"}</span>;
}

function FusePill({ kind }: { kind: "good" | "warn" | "poor" }) {
  const map = {
    good: "bg-emerald-100 text-emerald-700",
    warn: "bg-amber-100 text-amber-700",
    poor: "bg-rose-100 text-rose-700",
  } as const;
  const label = { good: "Healthy", warn: "Watch", poor: "At Risk" }[kind];
  return (
    <span className={`px-2 py-1 rounded text-xs ${map[kind]}`}>{label}</span>
  );
}

/* ----------------------------------------------------------------
   MAIN COMPONENT
   ---------------------------------------------------------------- */
export function CustomerAnalysis() {
  const [segment, setSegment] = useState<string>("all");
  const [range, setRange] = useState<string>("6m");

  // NOTE: Back end should recalc KPIs and trend series for chosen segment/time range.
  // TODO(API): GET /analytics/customer?segment={segment}&range={range}
  const filteredTrend = useMemo(() => usageTrend, [segment, range]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* LEFT NAV */}
        <AppSidebar />

        {/* RIGHT (content) */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR */}
          <header className="h-14 border-b bg-white flex items-center px-4 gap-3">
            <SidebarTrigger />

            <div className="ml-1">
              <h1 className="text-lg font-semibold">Customer Analytics</h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="midmarket">Mid-Market</SelectItem>
                  <SelectItem value="smb">SMB</SelectItem>
                </SelectContent>
              </Select>

              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 months</SelectItem>
                  <SelectItem value="6m">Last 6 months</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                {/* PAGE TITLE */}
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">
                    Customer Analytics –{" "}
                    <span className="text-slate-600">DataAnalytics Corp</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    Analyze key metrics, customer health trends, engagement
                    patterns, and financial performance. Click on a metric to
                    see details.
                  </p>
                </div>

                {/* KPI GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {kpis.map((k) => (
                    <Card key={k.key} className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-600">
                          {k.label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-semibold">
                            {k.key === "arr" ? "$" : ""}
                            {k.value}
                            {k.unit && (
                              <span className="ml-0.5 text-base font-medium">
                                {k.unit}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">
                            {k.delta}
                          </div>
                        </div>
                        <TrendChip
                          trend={k.trend}
                          text={
                            k.trend === "up"
                              ? "Improving"
                              : k.trend === "down"
                              ? "Declining"
                              : "Stable"
                          }
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* TRENDS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={filteredTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Usage Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={filteredTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="usage"
                            name="Avg. Weekly Sessions"
                            fill="#6366f1"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* TOP ACTIVE USERS LIST */}
                <Card className="rounded-2xl mb-8">
                  <CardHeader>
                    <CardTitle>Top Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="text-slate-500">
                          <tr className="text-left">
                            <th className="py-2 font-medium">User</th>
                            <th className="py-2 font-medium">Queries</th>
                            <th className="py-2 font-medium">
                              Avg Rating Given
                            </th>
                            <th className="py-2 font-medium">
                              Most Asked Category
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {topUsers.map((u) => (
                            <tr key={u.name} className="border-t">
                              <td className="py-3">{u.name}</td>
                              <td className="py-3">{u.queries}</td>
                              <td className="py-3">{u.rating}★</td>
                              <td className="py-3">
                                <Badge variant="secondary">{u.category}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* AI ALERTS & INSIGHTS */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold">
                      AI-Powered Alerts & Insights
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {aiAlerts.map((a) => (
                      <div
                        key={a.id}
                        className={`rounded-xl border px-4 py-3 flex items-center justify-between ${
                          a.type === "risk"
                            ? "bg-rose-50 border-rose-200"
                            : a.type === "opportunity"
                            ? "bg-emerald-50 border-emerald-200"
                            : a.type === "milestone"
                            ? "bg-sky-50 border-sky-200"
                            : "bg-violet-50 border-violet-200"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">{a.account}</div>
                          <div className="text-xs text-slate-600">
                            {a.message}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white"
                        >
                          {a.cta}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HEALTH OVERVIEW + ACCOUNTS BY ARR */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Accounts Health Overview (FUSE)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-slate-500">
                            <tr className="text-left">
                              <th className="py-2 font-medium">Account</th>
                              <th className="py-2 font-medium">
                                Feature Usage
                              </th>
                              <th className="py-2 font-medium">
                                Support Experience
                              </th>
                              <th className="py-2 font-medium">Net Promoter</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fuseRows.map((r) => (
                              <tr key={r.acct} className="border-t">
                                <td className="py-3">{r.acct}</td>
                                <td className="py-3">
                                  <FusePill kind={r.feature as any} />
                                </td>
                                <td className="py-3">
                                  <FusePill kind={r.support as any} />
                                </td>
                                <td className="py-3">
                                  <FusePill kind={r.nps as any} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Accounts by ARR</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {arrList.map((row) => (
                        <div
                          key={row.acct}
                          className="flex items-center justify-between rounded-lg border px-3 py-2 bg-white"
                        >
                          <div className="text-sm">{row.acct}</div>
                          <div className="text-sm font-medium">
                            ${row.arr.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* STATUS DISTRIBUTION */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {statusSummary.map((s) => (
                    <Card key={s.name} className="rounded-2xl">
                      <CardContent className="py-5">
                        <div
                          className="text-3xl font-semibold"
                          style={{ color: s.color }}
                        >
                          {s.value}
                        </div>
                        <div className="text-sm text-slate-600">{s.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </main>

            {/* RIGHT RAIL */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ====================== BACKEND INTEGRATION NOTES =======================

1) KPIs, trend series, tables:
   - GET /analytics/customer/overview?segment={segment}&range={range}
     -> { kpis: {...}, trend: [...], statusSummary: [...], ... }

2) Top Active Users:
   - GET /analytics/customer/top-users?segment={segment}&range={range}
     -> [{ userId, name, queries, rating, topCategory }]

3) AI Alerts:
   - GET /analytics/customer/insights?segment={segment}
     -> [{ id, account, type: "risk|opportunity|milestone|feedback", message, cta }]

4) FUSE Health:
   - GET /analytics/customer/fuse?segment={segment}
     -> rows with feature/support/nps per account
   - Compute predictive churn/expansion flags server-side.

5) Accounts by ARR:
   - GET /analytics/customer/arr-list?segment={segment}

6) Export:
   - Implement CSV/XLSX export of current view (server-prepared URL) or client CSV.

========================================================================= */
