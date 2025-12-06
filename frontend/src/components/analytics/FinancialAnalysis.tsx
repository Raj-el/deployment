// src/components/analytics/FinancialAnalysis.tsx
import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  LineChart as LineIcon,
  BarChart3,
  PiggyBank,
  Percent,
  Download,
  Sparkles,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";

/* ----------------------------------------------------------------------------
  MOCK DATA (replace with backend data)
  BACKEND NOTES:
  - Wire these to analytics service(s) or your data warehouse.
  - All currency values should be returned as numbers (USD cents preferred).
  - Time-series must be returned in ascending date order with ISO dates.
----------------------------------------------------------------------------- */

const kpis = {
  totalARR: 20100000, // $20.1M
  nrrPct: 124, // Net Revenue Retention %
  logoChurnPct: 4.2,
  ltvToCac: 3.8, // ratio
  // deltas for “vs last/target”
  totalARRDeltaPct: 8.2,
  nrrDeltaPct: 6.0,
  churnDeltaPct: 0.6, // increased by 0.6 (bad)
};

const rpoSeries = [
  // Remaining Performance Obligation and Deferred Revenue example
  { m: "Jan", rpo: 21500000, def: 350000 },
  { m: "Feb", rpo: 21800000, def: 360000 },
  { m: "Mar", rpo: 22100000, def: 370000 },
  { m: "Apr", rpo: 22400000, def: 365000 },
  { m: "May", rpo: 22650000, def: 380000 },
  { m: "Jun", rpo: 22900000, def: 395000 },
];

const forecastSeriesBase = [
  // actuals + baseline forecast
  { m: "Jan", actual: 1580000, forecast: 1580000, low: 1550000, high: 1605000 },
  { m: "Feb", actual: 1620000, forecast: 1615000, low: 1580000, high: 1645000 },
  { m: "Mar", actual: 1665000, forecast: 1655000, low: 1620000, high: 1688000 },
  { m: "Apr", actual: 1690000, forecast: 1680000, low: 1640000, high: 1710000 },
  { m: "May", actual: 1710000, forecast: 1705000, low: 1670000, high: 1735000 },
  { m: "Jun", actual: 1750000, forecast: 1745000, low: 1700000, high: 1780000 },
];

const nrrQuarterly = [
  { q: "Q1 2024", contraction: 2.5, churn: 4.8, expansion: 24.0 },
  { q: "Q2 2024", contraction: 2.1, churn: 3.8, expansion: 19.0 },
  { q: "Q3 2024", contraction: 3.0, churn: 4.5, expansion: 27.0 },
  { q: "Q4 2024", contraction: 3.2, churn: 5.9, expansion: 32.0 },
];

const revenueBridge = [
  // Components of growth for the last quarter
  { label: "Starting ARR", value: 19800000 },
  { label: "New Biz", value: 620000 },
  { label: "Expansion", value: 480000 },
  { label: "Contraction", value: -220000 },
  { label: "Churn", value: -320000 },
  { label: "Ending ARR", value: 20100000 },
];

const topAccounts = [
  { name: "DataVision Corp", arr: 380000, growth: 18.5, badge: "excellent" },
  { name: "Analytics Pro Inc", arr: 310000, growth: 28.2, badge: "excellent" },
  {
    name: "Enterprise Analytics Ltd",
    arr: 285000,
    growth: 12.8,
    badge: "good",
  },
  { name: "TechFlow Solutions", arr: 270000, growth: 22.4, badge: "excellent" },
  { name: "InnovateTech Systems", arr: 245000, growth: 15.7, badge: "good" },
];

const bottomAccounts = [
  { name: "SmallBiz Analytics", arr: 45000, decline: -22.5, badge: "critical" },
  { name: "StartupData Inc", arr: 38000, decline: -18.3, badge: "at-risk" },
  { name: "RegionalInsights Co", arr: 35000, decline: -15.7, badge: "at-risk" },
  { name: "LocalMetrics LLC", arr: 32000, decline: -28.1, badge: "critical" },
  { name: "BasicAnalytics Pro", arr: 28000, decline: -12.6, badge: "poor" },
];

type ScenarioKey = "baseline" | "optimistic" | "pessimistic";

export function FinancialAnalysis() {
  const [scenario, setScenario] = useState<ScenarioKey>("baseline");

  // Scenario modeling: simple uplift/downshift to forecast & bands
  const scenarioSeries = useMemo(() => {
    const factor =
      scenario === "optimistic" ? 1.035 : scenario === "pessimistic" ? 0.97 : 1;
    return forecastSeriesBase.map((p) => ({
      m: p.m,
      actual: p.actual,
      forecast: Math.round(p.forecast * factor),
      low: Math.round(
        p.low * factor * (scenario === "optimistic" ? 1.01 : 0.99)
      ),
      high: Math.round(
        p.high * factor * (scenario === "pessimistic" ? 0.99 : 1.01)
      ),
    }));
  }, [scenario]);

  const bridgeColors = (label: string) =>
    label === "Contraction" || label === "Churn"
      ? "#ef4444"
      : label.includes("ARR")
      ? "#94a3b8"
      : "#22c55e";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Financial Analytics</h1>
              <p className="text-xs text-slate-500">CFO/CEO dashboard</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Select
                value={scenario}
                onValueChange={(v: ScenarioKey) => setScenario(v)}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="optimistic">Optimistic</SelectItem>
                  <SelectItem value="pessimistic">Pessimistic</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Run Scenario
              </Button>
            </div>
          </header>

          {/* Middle area */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                {/* KPI ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Total ARR
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">
                        ${(kpis.totalARR / 1_000_000).toFixed(1)}M
                      </div>
                      <div className="text-xs text-emerald-600 mt-1">
                        +{kpis.totalARRDeltaPct}% from last quarter
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Net Revenue Retention
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">
                        {kpis.nrrPct}%
                      </div>
                      <div className="text-xs text-emerald-600 mt-1">
                        +{kpis.nrrDeltaPct}% last quarter
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" /> Logo Churn Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">
                        {kpis.logoChurnPct}%
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        +{kpis.churnDeltaPct}% from last quarter
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <PiggyBank className="w-4 h-4" /> Customer LTV:CAC
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">
                        {kpis.ltvToCac}:1
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Above industry benchmark
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* TOP CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {/* RPO */}
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Remaining Performance Obligations (RPO)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={rpoSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="m" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="rpo" name="RPO" fill="#60a5fa" />
                          <Bar
                            dataKey="def"
                            name="Deferred Revenue"
                            fill="#10b981"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Forecast with CI band */}
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineIcon className="w-5 h-5" />
                        Revenue Forecast vs Actual ({scenario})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={scenarioSeries}>
                          <defs>
                            <linearGradient
                              id="band"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#60a5fa"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="100%"
                                stopColor="#60a5fa"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="m" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="high"
                            stroke="none"
                            fill="url(#band)"
                            activeDot={false}
                          />
                          <Area
                            type="monotone"
                            dataKey="low"
                            stroke="none"
                            fill="#fff"
                          />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            name="Actual"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                          />
                          <Line
                            type="monotone"
                            dataKey="forecast"
                            name="Forecast"
                            stroke="#22c55e"
                            strokeDasharray="6 4"
                            strokeWidth={3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* NRR (stacked) + Revenue Bridge */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Net Revenue Retention Components</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={nrrQuarterly} stackOffset="sign">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="q" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="expansion"
                            name="Expansion %"
                            stackId="nrr"
                            fill="#22c55e"
                          />
                          <Bar
                            dataKey="contraction"
                            name="Contraction %"
                            stackId="nrr"
                            fill="#f59e0b"
                          />
                          <Bar
                            dataKey="churn"
                            name="Churn %"
                            stackId="nrr"
                            fill="#ef4444"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Revenue Bridge (Quarter)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={revenueBridge}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="value"
                            name="Value"
                            isAnimationActive={false}
                            fill="#94a3b8"
                          >
                            {revenueBridge.map((d, i) => (
                              <Cell
                                key={`bridge-${i}`}
                                fill={bridgeColors(d.label)}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Leaderboards & Churn targets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Top 5 Performing Accounts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {topAccounts.map((a) => (
                        <div
                          key={a.name}
                          className="flex items-center justify-between rounded-xl border p-3 bg-white"
                        >
                          <div>
                            <div className="font-medium">{a.name}</div>
                            <div className="text-xs text-slate-500">
                              ARR: ${a.arr.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600 text-sm font-semibold">
                              +{a.growth}%
                            </span>
                            <Badge variant="secondary" className="capitalize">
                              {a.badge}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Bottom 5 Accounts by Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {bottomAccounts.map((a) => (
                        <div
                          key={a.name}
                          className="flex items-center justify-between rounded-xl border p-3 bg-white"
                        >
                          <div>
                            <div className="font-medium">{a.name}</div>
                            <div className="text-xs text-slate-500">
                              ARR: ${a.arr.toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 text-sm font-semibold">
                              {a.decline}%
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {a.badge}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Churn metrics & Unit economics tiles */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                        <Percent className="w-4 h-4" />
                        Logo Churn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">4.2%</div>
                      <div className="text-xs text-slate-500">Target: 5%</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600">
                        Revenue Churn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">3.8%</div>
                      <div className="text-xs text-slate-500">Target: 4%</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600">
                        Gross Churn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">4.8%</div>
                      <div className="text-xs text-slate-500">Target: 6%</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-600">
                        Net Churn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">2.4%</div>
                      <div className="text-xs text-slate-500">Target: 2%</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Avg Revenue Per Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">$127,000</div>
                      <div className="text-xs text-emerald-600">+5.8% MoM</div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Customer Lifetime Value (CLV)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">$642,000</div>
                      <div className="text-xs text-emerald-600">+12.1% QoQ</div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Time to First Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold">32 days</div>
                      <div className="text-xs text-emerald-600">
                        -4 days from target
                      </div>
                    </CardContent>
                  </Card>
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

export default FinancialAnalysis;

/* ============================================================================
   BACKEND HAND-OFF CHECKLIST
   ---------------------------------------------------------------------------
   Endpoints / Queries you’ll want to provide:

   1) /analytics/arr/summary?orgId=...&range=...
      -> { totalARR:number, deltaPct:number, nrrPct:number, logoChurnPct:number,
           ltvToCac:number, nrrDeltaPct:number, churnDeltaPct:number }

   2) /analytics/rpo?orgId=...&granularity=month
      -> [{ date:string(YYYY-MM), rpo:number, deferredRevenue:number }]

   3) /analytics/revenue-forecast?orgId=...&scenario=baseline|optimistic|pessimistic
      -> [{ date:ISO, actual:number|null, forecast:number, ciLow:number, ciHigh:number }]
      - Confidence interval should come from your model (e.g., Prophet/ARIMA/LLM + guardrails)

   4) /analytics/nrr-components?orgId=...&granularity=quarter
      -> [{ period:"Q1 2024", expansionPct:number, contractionPct:number, churnPct:number }]

   5) /analytics/revenue-bridge?orgId=...&period=lastQuarter
      -> [{ label:string, value:number }] in sequence (Starting ARR, New, Expansion, Contraction, Churn, Ending)

   6) /analytics/accounts/top-bottom?orgId=...&limit=5
      -> { top:[{name, arr, growthPct, badge}], bottom:[{name, arr, declinePct, badge}] }

   7) /analytics/unit-economics?orgId=...&range=...
      -> { logoChurn:number, revenueChurn:number, grossChurn:number, netChurn:number,
           arpa:number, clv:number, ttfvDays:number }

   NOTES:
   - Currency: return in cents and format on FE, or return normalized USD numbers consistently.
   - Time zone normalization for month/quarter boundaries (UTC recommend).
   - Scenario generation should be server-side to keep a single source of truth.
   - Add “export” endpoint for CSV/XLSX if needed. Current button can call it.

   ACCEPTANCE CRITERIA MAPPING (US-ANA-012/013/014)
   - ARR forecasting with confidence bands & scenario selector ✔
   - Revenue bridge components ✔
   - Early warning via churn cards and bottom accounts list ✔
   - Unit economics (LTV:CAC, ARPA, CLV) tiles ✔
   - Board-ready layout & export action ✔
============================================================================ */
