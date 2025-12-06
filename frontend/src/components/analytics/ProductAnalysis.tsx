// src/components/analytics/ProductAnalysis.tsx
import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Layers,
  Calendar,
} from "lucide-react";

/* recharts */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

/* --------------------------- Mock Data (replace) --------------------------- */
/** BACKEND: Replace all mock arrays with APIs.
 *  Endpoints to consider:
 *  - GET /analytics/product/feature-roadmap?segment=&tier=&from=&to=
 *  - GET /analytics/product/feature-adoption/heatmap
 *  - GET /analytics/product/performance
 *  - GET /analytics/product/roi
 */

const prioritizedThemes = [
  {
    theme: "Activity Reporting Enhancements",
    accounts: 15,
    arr: 485000,
    health: "High",
    status: "In Development",
  },
  {
    theme: "Automated Email Scheduling",
    accounts: 12,
    arr: 385000,
    health: "Medium",
    status: "In Development",
  },
  {
    theme: "Advanced AI Summarization for Notes",
    accounts: 5,
    arr: 350000,
    health: "High",
    status: "Backlog",
  },
  {
    theme: "Bulk User Management Import/Export",
    accounts: 8,
    arr: 425000,
    health: "Medium",
    status: "Planned",
  },
  {
    theme: "Dark Mode Theme",
    accounts: 23,
    arr: 200000,
    health: "Low",
    status: "Released",
  },
];

const detailHeader = {
  title: "CSM Activity Reporting Enhancements",
  requesting: 12,
  totalArr: 750000,
  avgRequesterHealth: 60,
};

const individualRequests = [
  {
    account: "Observa.ai",
    health: "Healthy",
    score: 90,
    arr: "100 ARR",
    request: "Custom report over date ranges for CSM activity.",
    source: "QBR Meeting",
    date: "2025-05-15",
  },
  {
    account: "Innovate Solutions",
    health: "Healthy",
    score: 80,
    arr: "100 ARR",
    request: "Filter activity reports by specific CSM.",
    source: "Support Ticket",
    date: "2025-05-10",
  },
  {
    account: "Global Tech",
    health: "At Risk",
    score: 45,
    arr: "100 ARR",
    request: "Reports too slow on large data sets for CSM activity.",
    source: "Slack",
    date: "2025-05-05",
  },
];

// Simple “heatmap” via colored cells (tailwind)
const segments = ["Enterprise", "Mid-Market", "SMB"];
const features = [
  "Reports",
  "Email Sched.",
  "AI Notes",
  "Bulk Import",
  "Dark Mode",
];
// values = adoption % (0-100)
const heatmap = [
  [82, 61, 35, 48, 92],
  [67, 54, 22, 31, 85],
  [45, 33, 12, 18, 73],
];

const timeToAdoption = [
  { month: "Jan", Reports: 18, Email: 26, AI: 39 },
  { month: "Feb", Reports: 16, Email: 24, AI: 35 },
  { month: "Mar", Reports: 14, Email: 21, AI: 32 },
  { month: "Apr", Reports: 13, Email: 19, AI: 30 },
  { month: "May", Reports: 12, Email: 18, AI: 28 },
  { month: "Jun", Reports: 11, Email: 16, AI: 26 },
];

const abandonment = [
  { month: "Jan", Reports: 3, Email: 4, AI: 7 },
  { month: "Feb", Reports: 3, Email: 3, AI: 6 },
  { month: "Mar", Reports: 4, Email: 3, AI: 6 },
  { month: "Apr", Reports: 4, Email: 2, AI: 5 },
  { month: "May", Reports: 3, Email: 2, AI: 5 },
  { month: "Jun", Reports: 3, Email: 2, AI: 4 },
];

const productHealth = [
  { product: "Core", score: 87, trend: "up" },
  { product: "Analytics", score: 78, trend: "up" },
  { product: "CSM Tools", score: 70, trend: "flat" },
  { product: "Integrations", score: 64, trend: "down" },
];

const crossProductUsage = [
  { cluster: "A", Core: 120, Analytics: 90, Tools: 60 },
  { cluster: "B", Core: 100, Analytics: 70, Tools: 40 },
  { cluster: "C", Core: 130, Analytics: 110, Tools: 65 },
  { cluster: "D", Core: 90, Analytics: 80, Tools: 35 },
];

const churnSignals = [
  {
    product: "Integrations",
    risk: "High",
    drivers: ["Setup failures", "Low DAU"],
  },
  { product: "CSM Tools", risk: "Medium", drivers: ["Abandonment ↑"] },
  { product: "Analytics", risk: "Low", drivers: ["Adoption steady"] },
];

const roiRows = [
  {
    area: "Reports Automation",
    timeSavedHrs: 420,
    seats: 120,
    estValue: 78000,
  },
  { area: "AI Note Summaries", timeSavedHrs: 290, seats: 85, estValue: 52000 },
  { area: "Bulk Import", timeSavedHrs: 160, seats: 40, estValue: 18000 },
];

/* -------------------------------- Component -------------------------------- */

export function ProductAnalysis() {
  const [segment, setSegment] = useState("all");
  const [tier, setTier] = useState("all");
  const [rangeLabel, setRangeLabel] = useState("Quarter to Date");

  // BACKEND: sorting can be handled server-side; this is front-only demo
  const [sortKey, setSortKey] = useState<"arr" | "accounts" | "theme">("arr");
  const sortedThemes = useMemo(() => {
    const clone = [...prioritizedThemes];
    if (sortKey === "arr") clone.sort((a, b) => b.arr - a.arr);
    if (sortKey === "accounts") clone.sort((a, b) => b.accounts - a.accounts);
    if (sortKey === "theme")
      clone.sort((a, b) => a.theme.localeCompare(b.theme));
    return clone;
  }, [sortKey]);

  const exportToSheets = () => {
    /** BACKEND: produce CSV/Sheets export for current filters & date range
     * GET /analytics/product/export?segment=&tier=&from=&to=
     */
    console.log("Export requested", { segment, tier, rangeLabel });
  };

  const onPickRange = () => {
    // BACKEND: replace with real date-range picker and re-fetch
    alert("Hook up a real date-range picker and refetch analytics.");
  };

  const healthBadge = (h: string) =>
    h === "High" ? (
      <div className="flex items-center gap-1 text-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        High
      </div>
    ) : h === "Medium" ? (
      <div className="flex items-center gap-1 text-sm">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        Medium
      </div>
    ) : (
      <div className="flex items-center gap-1 text-sm">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        Low
      </div>
    );

  const statusPill = (s: string) => {
    const style =
      s === "In Development"
        ? "bg-sky-100 text-sky-800"
        : s === "Planned"
        ? "bg-amber-100 text-amber-800"
        : s === "Backlog"
        ? "bg-slate-100 text-slate-700"
        : "bg-emerald-100 text-emerald-800";
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs ${style}`}>{s}</span>
    );
  };

  const heatColor = (v: number) => {
    if (v >= 80) return "bg-emerald-600 text-white";
    if (v >= 60) return "bg-emerald-300 text-slate-900";
    if (v >= 40) return "bg-amber-300 text-slate-900";
    if (v >= 20) return "bg-rose-300 text-slate-900";
    return "bg-rose-600 text-white";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">
                Product Roadmap Analytics
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={onPickRange}>
                <Calendar className="w-4 h-4 mr-2" />
                {rangeLabel}
              </Button>
              <Button variant="outline" onClick={exportToSheets}>
                <Download className="w-4 h-4 mr-2" />
                Export to Sheets
              </Button>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* center */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                <p className="text-sm text-slate-600 mb-4">
                  Strategically align product roadmap priorities to customer
                  feedback and business impact.
                </p>

                {/* Filters */}
                <div className="mb-4 flex items-center gap-3">
                  <Select value={segment} onValueChange={setSegment}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All segments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All segments</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="mid">Mid-Market</SelectItem>
                      <SelectItem value="smb">SMB</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={tier} onValueChange={setTier}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All product tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All tiers</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Header split (screenshot) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left: Prioritized Feature Roadmap */}
                  <Card>
                    <CardHeader className="pb-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Prioritized Feature Roadmap
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">
                            Sortable list of feature themes by impact
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xs text-slate-500">Sort by:</span>
                        <Button
                          size="sm"
                          variant={sortKey === "arr" ? "default" : "outline"}
                          onClick={() => setSortKey("arr")}
                        >
                          Total ARR
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            sortKey === "accounts" ? "default" : "outline"
                          }
                          onClick={() => setSortKey("accounts")}
                        >
                          Accounts
                        </Button>
                        <Button
                          size="sm"
                          variant={sortKey === "theme" ? "default" : "outline"}
                          onClick={() => setSortKey("theme")}
                        >
                          Name
                        </Button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">Feature Theme</th>
                              <th className="py-2">Accounts</th>
                              <th className="py-2">Total ARR</th>
                              <th className="py-2">Requester Health</th>
                              <th className="py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedThemes.map((t) => (
                              <tr
                                key={t.theme}
                                className="border-t hover:bg-slate-50"
                              >
                                <td className="py-3">{t.theme}</td>
                                <td className="py-3">{t.accounts}</td>
                                <td className="py-3">
                                  {t.arr.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                  })}
                                </td>
                                <td className="py-3">
                                  {healthBadge(t.health)}
                                </td>
                                <td className="py-3">{statusPill(t.status)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* BACKEND: onRowClick => navigate to feature detail; enable drag reorder if needed */}
                    </CardContent>
                  </Card>

                  {/* Right: Detail for selected theme */}
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="text-base">
                        {detailHeader.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-sky-600 text-2xl font-semibold">
                            {detailHeader.requesting}
                          </div>
                          <div className="text-xs text-slate-500">
                            Requesting Accounts
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-emerald-600 text-2xl font-semibold">
                            {detailHeader.totalArr.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-xs text-slate-500">
                            Total Associated ARR
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-orange-600 text-2xl font-semibold">
                            {detailHeader.avgRequesterHealth}/100
                          </div>
                          <div className="text-xs text-slate-500">
                            Avg. Requester Health
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">Account</th>
                              <th className="py-2">Health & ARR</th>
                              <th className="py-2">Specific Request</th>
                              <th className="py-2">Source</th>
                              <th className="py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {individualRequests.map((r) => (
                              <tr key={r.account} className="border-t">
                                <td className="py-3">{r.account}</td>
                                <td className="py-3">
                                  <Badge
                                    variant={
                                      r.health === "Healthy"
                                        ? "secondary"
                                        : "destructive"
                                    }
                                  >
                                    {r.health}
                                  </Badge>
                                  <span className="ml-2 text-slate-500">
                                    {r.score}/100 ARR
                                  </span>
                                </td>
                                <td className="py-3">{r.request}</td>
                                <td className="py-3">
                                  <Badge variant="outline">{r.source}</Badge>
                                </td>
                                <td className="py-3">{r.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* BACKEND: clicking a row should open account sheet with linked feedback/threads */}
                    </CardContent>
                  </Card>
                </div>

                {/* ----------------- Extra analytics to satisfy requirements ----------------- */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Feature Adoption Heatmap */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Feature Adoption Heatmap (by Segment & ARR)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">Segment</th>
                              {features.map((f) => (
                                <th key={f} className="py-2">
                                  {f}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {segments.map((seg, i) => (
                              <tr key={seg} className="border-t">
                                <td className="py-3">{seg}</td>
                                {heatmap[i].map((v, ix) => (
                                  <td
                                    key={`${seg}-${features[ix]}`}
                                    className="py-2"
                                  >
                                    <div
                                      className={`w-16 text-center rounded ${heatColor(
                                        v
                                      )} text-xs py-1`}
                                    >
                                      {v}%
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* BACKEND: return adoption % weighted by ARR (e.g., normalized by customer ARR) */}
                    </CardContent>
                  </Card>

                  {/* Time to Adoption */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Time-to-Adoption (days from release)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={timeToAdoption}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Reports" stackId="a" fill="#3B82F6" />
                          <Bar dataKey="Email" stackId="a" fill="#10B981" />
                          <Bar dataKey="AI" stackId="a" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                      {/* BACKEND: compute per-feature median time-to-first-meaningful-use */}
                    </CardContent>
                  </Card>

                  {/* Abandonment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Feature Abandonment (30-day inactivity after first use)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={abandonment}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            dataKey="Reports"
                            type="monotone"
                            stroke="#3B82F6"
                            strokeWidth={3}
                          />
                          <Line
                            dataKey="Email"
                            type="monotone"
                            stroke="#10B981"
                            strokeWidth={3}
                          />
                          <Line
                            dataKey="AI"
                            type="monotone"
                            stroke="#F59E0B"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      {/* BACKEND: correlate abandonment with churn propensity per product */}
                    </CardContent>
                  </Card>

                  {/* Product Health + Cross-Product Usage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Product Health & Cross-Product Usage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          {productHealth.map((p) => (
                            <div
                              key={p.product}
                              className="flex items-center justify-between rounded border p-2"
                            >
                              <div className="font-medium">{p.product}</div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm">{p.score}/100</div>
                                {p.trend === "up" ? (
                                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                                ) : p.trend === "down" ? (
                                  <TrendingDown className="w-4 h-4 text-rose-600" />
                                ) : (
                                  <div className="text-xs text-slate-500">
                                    —
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={crossProductUsage}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="cluster" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="Core" stackId="x" fill="#334155" />
                              <Bar
                                dataKey="Analytics"
                                stackId="x"
                                fill="#3B82F6"
                              />
                              <Bar dataKey="Tools" stackId="x" fill="#10B981" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      {/* BACKEND: compute product health from weighted usage + NPS/CSAT + perf SLOs */}
                    </CardContent>
                  </Card>
                </div>

                {/* Churn Risk & ROI */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Product-Specific Churn Risk
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {churnSignals.map((c) => (
                        <div
                          key={c.product}
                          className="flex items-start justify-between rounded border p-3"
                        >
                          <div>
                            <div className="font-medium">{c.product}</div>
                            <div className="text-xs text-slate-500">
                              Drivers: {c.drivers.join(", ")}
                            </div>
                          </div>
                          <Badge
                            variant={
                              c.risk === "High"
                                ? "destructive"
                                : c.risk === "Medium"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {c.risk}
                          </Badge>
                        </div>
                      ))}
                      {/* BACKEND: compute from abandonment + DAU/WAU + support flags + SLA breaches */}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        ROI Analysis (Value Realization)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">Area</th>
                              <th className="py-2">Time Saved (hrs)</th>
                              <th className="py-2">Seats</th>
                              <th className="py-2">Est. Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roiRows.map((r) => (
                              <tr key={r.area} className="border-t">
                                <td className="py-3">{r.area}</td>
                                <td className="py-3">{r.timeSavedHrs}</td>
                                <td className="py-3">{r.seats}</td>
                                <td className="py-3">
                                  {r.estValue.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* BACKEND: calculate with customer-specific rates; allow export of ROI workbook */}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>

            {/* right rail */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ProductAnalysis;
