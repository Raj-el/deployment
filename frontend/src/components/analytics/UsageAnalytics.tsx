// src/components/analytics/UsageAnalytics.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* shell */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* shadcn/ui */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/* icons */
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Star,
  ShieldAlert,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

/* recharts */
import {
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
} from "recharts";

/* ----------------------------- Mock Data ----------------------------- */
/** BACKEND: replace all mock arrays with real API responses. Use query params:
 *  ?from=ISO&to=ISO&segment=enterprise|midmarket|smb&tier=basic|pro|enterprise
 *  Also support aggregation granularity: day|week|month for charts.
 */
const usageTrend = [
  { period: "Jan", users: 90, usage: 14, failed: 2 },
  { period: "Feb", users: 98, usage: 16, failed: 2 },
  { period: "Mar", users: 115, usage: 19, failed: 3 },
  { period: "Apr", users: 130, usage: 21, failed: 2 },
  { period: "May", users: 145, usage: 23, failed: 2 },
  { period: "Jun", users: 160, usage: 24, failed: 2 },
  { period: "Jul", users: 168, usage: 27, failed: 3 },
];

const usageTrend2 = [
  { wk: "Week 1", total: 110, success: 15, failed: 2 },
  { wk: "Week 2", total: 118, success: 16, failed: 2 },
  { wk: "Week 3", total: 112, success: 15, failed: 2 },
  { wk: "Week 4", total: 130, success: 18, failed: 3 },
];

const topUsers = [
  {
    id: "u1",
    name: "Maria Rodriguez",
    org: "DataAnalytics Corp",
    queries: 42,
    rating: 4.2,
    category: "Customer Success",
  },
  {
    id: "u2",
    name: "Tom Brown",
    org: "DataAnalytics Corp",
    queries: 35,
    rating: 4.4,
    category: "Customer Success",
  },
  {
    id: "u3",
    name: "David Chen",
    org: "DataAnalytics Corp",
    queries: 28,
    rating: 4.1,
    category: "Customer Success",
  },
  {
    id: "u4",
    name: "Samantha Clark",
    org: "DataAnalytics Corp",
    queries: 19,
    rating: 4.3,
    category: "Customer Success",
  },
  {
    id: "u5",
    name: "Clara Oren",
    org: "DataAnalytics Corp",
    queries: 15,
    rating: 4.0,
    category: "Customer Success",
  },
];

const categoryPie = [
  { name: "Customer Success", value: 32, color: "#3B82F6" },
  { name: "Product Features", value: 18, color: "#10B981" },
  { name: "Technical Support", value: 27, color: "#F59E0B" },
  { name: "Best Practices", value: 14, color: "#8B5CF6" },
  { name: "Competitive Analysis", value: 9, color: "#EF4444" },
];

const expertPerf = [
  {
    name: "Lisa Park",
    role: "Customer Success",
    responses: 45,
    rating: 4.8,
    art: "2.3h",
  },
  {
    name: "David Martinez",
    role: "Technical",
    responses: 38,
    rating: 4.6,
    art: "1.8h",
  },
  {
    name: "Sarah Johnson",
    role: "Product Strategy",
    responses: 32,
    rating: 4.7,
    art: "2.1h",
  },
  {
    name: "Mike Chen",
    role: "Competitive Analysis",
    responses: 29,
    rating: 4.4,
    art: "3.2h",
  },
  {
    name: "Emma Rodriguez",
    role: "Best Practices",
    responses: 25,
    rating: 4.5,
    art: "1.9h",
  },
];

const categoryTable = [
  {
    cat: "Customer Success",
    vol: 156,
    rating: 4.2,
    coverage: 0.65,
    art: "1.8h",
    trend: 15,
  },
  {
    cat: "Product Features",
    vol: 134,
    rating: 4.0,
    coverage: 0.63,
    art: "2.4h",
    trend: 19,
  },
  {
    cat: "Technical Support",
    vol: 89,
    rating: 3.8,
    coverage: 0.9,
    art: "1.1h",
    trend: 5,
  },
  {
    cat: "Best Practices",
    vol: 67,
    rating: 4.5,
    coverage: 0.86,
    art: "2.7h",
    trend: 5,
  },
  {
    cat: "Competitive Analysis",
    vol: 45,
    rating: 4.1,
    coverage: 0.71,
    art: "1.7h",
    trend: 6,
  },
];

const moderationQueue = [
  {
    id: "MOD001",
    text: "How to handle enterprise customer churn prevention?",
    expert: "Lisa Park",
    category: "Customer Success",
    submitted: "2025-07-03 14:30",
    status: "Pending Review",
  },
  {
    id: "MOD002",
    text: "DataAnalytics Corp vs competitor feature comparison",
    expert: "Mike Chen",
    category: "Competitive Analysis",
    submitted: "2025-07-03 13:45",
    status: "Needs Edit",
    flagged: true,
  },
  {
    id: "MOD003",
    text: "API integration best practices for enterprise clients",
    expert: "David Martinez",
    category: "Technical Support",
    submitted: "2025-07-03 12:15",
    status: "Approved",
  },
];

const recentActivity = [
  {
    id: "Q001",
    text: "How to handle a customer escalation for API integration issues?",
    user: "Sarah Chen @ DataAnalytics Corp",
    type: "AI, Expert",
    rating: 4.5,
    status: "Resolved",
  },
  {
    id: "Q002",
    text: "What are best practices for QBR preparation with enterprise clients?",
    user: "Michael Richard @ DataAnalytics Corp",
    type: "AI, Expert",
    rating: 4.8,
    status: "Resolved",
  },
  {
    id: "Q003",
    text: "Customer asking about DataAnalytics Corp's roadmap for AI features",
    user: "Sarah Chen @ DataAnalytics Corp",
    type: "AI",
    rating: 3.9,
    status: "Resolved",
  },
];

/* ----------------------------- Component ----------------------------- */

type TabKey = "usage" | "patterns" | "moderation";

export function UsageAnalytics() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("usage");
  const [segment, setSegment] = useState("all");
  const [tier, setTier] = useState("all");
  const [rangeLabel, setRangeLabel] = useState("07.01.2025 - 07.31.2025");

  const totalQueries = 456;
  const expertResponses = 178;
  const avgRespTime = "2.1h";
  const avgRating = 4.3;
  const deltaQueries = +12; // %
  const expertRespPct = 39; // of all queries

  const filteredUsage = useMemo(() => usageTrend, [segment, tier]);

  /* BACKEND: Export current view with filters. Return CSV/Excel or PDF. */
  const onExport = () => {
    // fetch(`/api/analytics/export?tab=${tab}&segment=${segment}&tier=${tier}&range=${rangeLabel}`)
    //   .then(...)
    console.log("Export requested for:", { tab, segment, tier, rangeLabel });
  };

  /* BACKEND: Range picker — plug in your date-range component, then query. */
  const onPickRange = () => {
    // open date picker; onConfirm -> setRangeLabel(...); refetch analytics
    alert("Replace with real date range picker.\n(Current is a mock button.)");
  };

  /* BACKEND: Drill-downs */
  const drillToUser = (id: string) => {
    // navigate(`/analytics/users/${id}`)   // wire when route exists
    console.log("Drill to user", id);
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
              <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={onPickRange}>
                <Calendar className="w-4 h-4 mr-2" />
                {rangeLabel}
              </Button>
              <Button variant="outline" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* center */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                {/* Tab strip (segmented) */}
                <div className="grid grid-cols-3 rounded-md overflow-hidden border text-sm">
                  <button
                    className={`py-2 ${
                      tab === "usage" ? "bg-slate-900 text-white" : "bg-white"
                    }`}
                    onClick={() => setTab("usage")}
                  >
                    Usage Overview
                  </button>
                  <button
                    className={`py-2 border-l ${
                      tab === "patterns"
                        ? "bg-slate-900 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setTab("patterns")}
                  >
                    Query Patterns
                  </button>
                  <button
                    className={`py-2 border-l ${
                      tab === "moderation"
                        ? "bg-slate-900 text-white"
                        : "bg-white"
                    }`}
                    onClick={() => setTab("moderation")}
                  >
                    Content Moderation
                  </button>
                </div>

                {/* Filters row */}
                <div className="mt-4 flex items-center gap-3">
                  <Select value={segment} onValueChange={setSegment}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All segments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All segments</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="midmarket">Mid-market</SelectItem>
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        More filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* BACKEND: add feature filters, account lists, owner, region, etc. */}
                      <DropdownMenuItem disabled>Feature: Any</DropdownMenuItem>
                      <DropdownMenuItem disabled>Region: Any</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* ---------------------- TAB: Usage Overview ---------------------- */}
                {tab === "usage" && (
                  <>
                    {/* Key metrics (matches first mock) */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-600">
                            Total Queries
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-3xl font-semibold">
                            {totalQueries}
                          </div>
                          <div className="mt-1 flex items-center text-xs text-emerald-600">
                            <TrendingUp className="w-3 h-3 mr-1" />+
                            {deltaQueries}% vs last month
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-600">
                            Expert Responses
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-3xl font-semibold">
                            {expertResponses}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {expertRespPct}% of all queries
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-600">
                            Avg Response Time
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-3xl font-semibold">
                            {avgRespTime}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            Expert responses
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-600">
                            Average Rating
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2">
                            <div className="text-3xl font-semibold">
                              {avgRating}
                            </div>
                            <Star className="w-5 h-5 text-amber-400" />
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            All responses
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* User Trend & Usage Trend (two wide charts) */}
                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-slate-700">
                            User Trend
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={260}>
                            <RLineChart data={filteredUsage}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="period" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="users"
                                name="Monthly Users"
                                stroke="#2563EB"
                                strokeWidth={3}
                                dot={false}
                              />
                            </RLineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-slate-700">
                            Usage Trend
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={260}>
                            <RLineChart data={usageTrend2}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="wk" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="total"
                                name="Total"
                                stroke="#2563EB"
                                strokeWidth={3}
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="success"
                                name="Successful"
                                stroke="#16A34A"
                                strokeWidth={3}
                                dot={false}
                              />
                              <Line
                                type="monotone"
                                dataKey="failed"
                                name="Failed"
                                stroke="#EF4444"
                                strokeWidth={3}
                                dot={false}
                              />
                            </RLineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Top Active Users table */}
                    <Card className="mt-5">
                      <CardHeader>
                        <CardTitle className="text-sm text-slate-700">
                          Top Active Users
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">User</th>
                              <th className="py-2">Queries</th>
                              <th className="py-2">Avg Rating Given</th>
                              <th className="py-2">Most Asked Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topUsers.map((u) => (
                              <tr
                                key={u.id}
                                className="border-t hover:bg-slate-50 cursor-pointer"
                                onClick={() => drillToUser(u.id)}
                                title="Drill down"
                              >
                                <td className="py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                                      {u.name
                                        .split(" ")
                                        .map((x) => x[0])
                                        .slice(0, 2)
                                        .join("")}
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {u.name}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        @ {u.org}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3">{u.queries}</td>
                                <td className="py-3">
                                  {u.rating}{" "}
                                  <Star className="inline-block w-4 h-4 text-amber-400 -mt-1" />
                                </td>
                                <td className="py-3">
                                  <Badge variant="secondary">
                                    {u.category}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* ---------------------- TAB: Query Patterns ---------------------- */}
                {tab === "patterns" && (
                  <>
                    <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Question Categories Pie */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-slate-700">
                            Question Categories
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-8">
                          <ResponsiveContainer width="95%" height={260}>
                            <RPieChart>
                              <Tooltip />
                              <Pie
                                data={categoryPie}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                              >
                                {categoryPie.map((e, i) => (
                                  <Cell key={i} fill={e.color} />
                                ))}
                              </Pie>
                            </RPieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Expert Performance list */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm text-slate-700">
                            Expert Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {expertPerf.map((e) => (
                            <div
                              key={e.name}
                              className="flex items-center justify-between rounded-md border p-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[11px] font-medium text-slate-700">
                                  {e.name
                                    .split(" ")
                                    .map((x) => x[0])
                                    .slice(0, 2)
                                    .join("")}
                                </div>
                                <div>
                                  <div className="font-medium">{e.name}</div>
                                  <div className="text-xs text-slate-500">
                                    {e.role}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <div className="font-medium">
                                  {e.responses} responses
                                </div>
                                <div className="text-slate-500">
                                  {e.rating}{" "}
                                  <Star className="inline w-4 h-4 text-amber-400 -mt-1" />{" "}
                                  • {e.art}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Category Performance table */}
                    <Card className="mt-5">
                      <CardHeader>
                        <CardTitle className="text-sm text-slate-700">
                          Category Performance Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">Category</th>
                              <th className="py-2">Query Volume</th>
                              <th className="py-2">Avg Rating</th>
                              <th className="py-2">Expert Coverage</th>
                              <th className="py-2">Avg Response Time</th>
                              <th className="py-2">Trending</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categoryTable.map((row) => (
                              <tr key={row.cat} className="border-t">
                                <td className="py-3">{row.cat}</td>
                                <td className="py-3">{row.vol}</td>
                                <td className="py-3">
                                  {row.rating}{" "}
                                  <Star className="inline w-4 h-4 text-amber-400 -mt-1" />
                                </td>
                                <td className="py-3">
                                  {Math.round(row.coverage * 100)}%
                                </td>
                                <td className="py-3">{row.art}</td>
                                <td className="py-3">
                                  <span className="inline-flex items-center text-emerald-600">
                                    <TrendingUp className="w-4 h-4 mr-1" /> +
                                    {row.trend}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* ---------------------- TAB: Content Moderation ---------------------- */}
                {tab === "moderation" && (
                  <>
                    {/* Counters row */}
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-600">
                            Pending Review
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-3xl font-semibold">8</div>
                          <div className="text-xs text-slate-500">
                            Expert responses awaiting approval
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-600">
                            Flagged Content
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2">
                            <div className="text-3xl font-semibold">3</div>
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="text-xs text-slate-500">
                            Responses requiring attention
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-600">
                            Published Today
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2">
                            <div className="text-3xl font-semibold">12</div>
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="text-xs text-slate-500">
                            Approved and live
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Moderation Queue */}
                    <Card className="mt-5">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm text-slate-700">
                            Moderation Queue
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Search content..."
                              className="h-8 w-[220px]"
                            />
                            <Button variant="outline" className="h-8">
                              <Filter className="w-4 h-4 mr-1" />
                              Filter
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">Content ID</th>
                              <th className="py-2">Question</th>
                              <th className="py-2">Expert</th>
                              <th className="py-2">Category</th>
                              <th className="py-2">Submitted</th>
                              <th className="py-2">Status</th>
                              <th className="py-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {moderationQueue.map((row) => (
                              <tr key={row.id} className="border-t">
                                <td className="py-3">{row.id}</td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2">
                                    {row.flagged && (
                                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                                    )}
                                    <span>{row.text}</span>
                                  </div>
                                </td>
                                <td className="py-3">{row.expert}</td>
                                <td className="py-3">
                                  <Badge variant="secondary">
                                    {row.category}
                                  </Badge>
                                </td>
                                <td className="py-3">{row.submitted}</td>
                                <td className="py-3">
                                  {row.status === "Approved" ? (
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                      Approved
                                    </Badge>
                                  ) : row.status === "Needs Edit" ? (
                                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                                      Needs Edit
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
                                      Pending Review
                                    </Badge>
                                  )}
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2 text-slate-600">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      title="View"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      title="Edit"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8"
                                      title="Approve"
                                    >
                                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="mt-5">
                      <CardHeader>
                        <CardTitle className="text-sm text-slate-700">
                          Recent Query Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2">Query ID</th>
                              <th className="py-2">Query</th>
                              <th className="py-2">User</th>
                              <th className="py-2">Response Type</th>
                              <th className="py-2">Rating</th>
                              <th className="py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentActivity.map((r) => (
                              <tr key={r.id} className="border-t">
                                <td className="py-3">{r.id}</td>
                                <td className="py-3">{r.text}</td>
                                <td className="py-3">{r.user}</td>
                                <td className="py-3">{r.type}</td>
                                <td className="py-3">
                                  {r.rating}{" "}
                                  <Star className="inline w-4 h-4 text-amber-400 -mt-1" />
                                </td>
                                <td className="py-3">
                                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                    {r.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  </>
                )}
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

export default UsageAnalytics;
