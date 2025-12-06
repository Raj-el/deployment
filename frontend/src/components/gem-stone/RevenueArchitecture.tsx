import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Download,
  LineChart,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
} from "lucide-react";

/** ------------------------------------------------------------------
 * RevenueArchitecture
 * Executive bowtie model for revenue planning & board reporting
 * ------------------------------------------------------------------ */
export function RevenueArchitecture() {
  // Top KPI tiles
  const kpis = [
    {
      key: "arr",
      title: "Annual Recurring Revenue",
      value: "$20.1M",
      delta: "+28% YoY",
      icon: DollarSign,
    },
    {
      key: "cltv",
      title: "Customer Lifetime Value",
      value: "$642K",
      delta: "+24% vs LY",
      icon: TrendingUp,
    },
    {
      key: "rpc",
      title: "Revenue per Customer",
      value: "$127K",
      delta: "+12% QoQ",
      icon: Users,
    },
    {
      key: "grr",
      title: "Gross Revenue Retention",
      value: "96.8%",
      delta: "+0.8% vs LQ",
      icon: Target,
    },
  ];

  // Bowtie stage cards (lead → sales → onboard → value → expansion)
  const bowtie = [
    {
      key: "lead",
      title: "Lead Generation",
      dot: "bg-emerald-500",
      metrics: [
        { label: "MQLs This Quarter", value: "892", delta: "+22%" },
        { label: "SQL Conversion Rate", value: "28.5%", delta: "+3.2%" },
        { label: "Pipeline Created", value: "$4.8M", delta: "+18%" },
      ],
    },
    {
      key: "sales",
      title: "Sales Process",
      dot: "bg-blue-500",
      metrics: [
        { label: "Win Rate", value: "34%", delta: "+4%" },
        { label: "Average Deal Size", value: "$186K", delta: "+8%" },
        { label: "Sales Cycle", value: "52 days", delta: "-5 days" },
      ],
    },
    {
      key: "onboarding",
      title: "Customer Onboarding",
      dot: "bg-purple-500",
      metrics: [
        { label: "Time to Value", value: "32 days", delta: "-4 days" },
        { label: "Onboarding Success", value: "91%", delta: "+2%" },
        { label: "Early Adoption Score", value: "82", delta: "+6 pts" },
      ],
    },
    {
      key: "value",
      title: "Value Realization",
      dot: "bg-orange-500",
      metrics: [
        { label: "Feature Adoption", value: "73%", delta: "+9%" },
        { label: "User Engagement", value: "7.8/10", delta: "+0.3" },
        { label: "Business Impact", value: "245%", delta: "+32%" },
      ],
    },
    {
      key: "expansion",
      title: "Expansion & Renewal",
      dot: "bg-teal-500",
      metrics: [
        { label: "Net Revenue Retention", value: "124%", delta: "+6%" },
        { label: "Expansion Rate", value: "42%", delta: "+8%" },
        { label: "Renewal Rate", value: "94%", delta: "+1%" },
      ],
    },
  ];

  // Quarterly forecast vs actuals
  const quarters = [
    {
      q: "Q1 2024",
      target: "$4.8M",
      actual: "$5.1M",
      state: "beat",
      tone: "text-emerald-600",
    },
    {
      q: "Q2 2024",
      target: "$5.2M",
      actual: "$4.9M",
      state: "miss",
      tone: "text-rose-600",
    },
    {
      q: "Q3 2024",
      target: "$5.6M",
      actual: "$5.8M",
      state: "beat",
      tone: "text-emerald-600",
    },
    {
      q: "Q4 2024",
      target: "$6.1M",
      actual: "$5.7M",
      state: "forecast",
      tone: "text-amber-600",
    },
  ];

  // Revenue risks
  const risks = [
    {
      key: "pipeline",
      title: "Pipeline Risk",
      impact: "High Impact",
      points: [
        "Q4 pipeline gap of $1.2M",
        "2 enterprise deals ($650K) slipped to Q1",
        "Mid-market pipeline below target",
      ],
      cta: "Accelerate enterprise analytics deals",
      tone: "text-rose-600",
    },
    {
      key: "churn",
      title: "Churn Risk",
      impact: "High Impact",
      points: [
        "3 enterprise accounts at risk ($950K ARR)",
        "Long-tail segment showing 15% usage decline",
        "Support ticket volume +38%",
      ],
      cta: "Deploy dedicated success managers",
      tone: "text-rose-600",
    },
    {
      key: "market",
      title: "Market Risk",
      impact: "Medium Impact",
      points: [
        "New AI analytics competitor launched",
        "Economic headwinds affecting mid-market budgets",
        "Data privacy regulations increasing compliance costs",
      ],
      cta: "Strengthen AI/ML value proposition",
      tone: "text-amber-600",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex-1">
              <h1 className="text-lg font-semibold">Revenue Architecture</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button className="gap-2">
                <LineChart className="h-4 w-4" />
                Generate Board Report
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                <p className="text-slate-600">
                  Executive bowtie model for revenue planning and board
                  reporting
                </p>

                {/* KPI tiles */}
                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                  {kpis.map(({ key, title, value, delta, icon: Icon }) => (
                    <Card key={key} className="rounded-xl">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm text-slate-600">
                              {title}
                            </div>
                            <div className="mt-1 text-3xl font-semibold text-slate-900">
                              {value}
                            </div>
                            <div className="mt-1 text-xs text-emerald-600">
                              {delta}
                            </div>
                          </div>
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Bowtie model */}
                <section className="mt-8">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-[20px]">
                          Revenue Bowtie Model - Customer Journey Stages
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                        {bowtie.map((stage, idx) => (
                          <div
                            key={stage.key}
                            className="rounded-xl border bg-white p-4"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${stage.dot}`}
                              />
                              <div className="font-semibold">{stage.title}</div>
                            </div>

                            <div className="mt-4 space-y-3">
                              {stage.metrics.map((m, i) => (
                                <div
                                  key={i}
                                  className="rounded-lg border p-3 hover:bg-slate-50 transition"
                                >
                                  <div className="text-[12px] text-slate-600">
                                    {m.label}
                                  </div>
                                  <div className="mt-0.5 flex items-center justify-between">
                                    <div className="text-xl font-semibold">
                                      {m.value}
                                    </div>
                                    <span className="text-xs text-emerald-600">
                                      {m.delta}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* arrow to the next column on large screens */}
                            {idx < bowtie.length - 1 && (
                              <div className="hidden lg:flex justify-end mt-3">
                                <ChevronRight className="h-4 w-4 text-slate-400" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Quarterly forecast vs actuals */}
                <section className="mt-8">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <CircleDot className="h-5 w-5" />
                        Quarterly Revenue Forecast vs Actuals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      {quarters.map((q) => (
                        <div
                          key={q.q}
                          className="flex items-center justify-between rounded-lg border p-3 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            {q.state === "beat" && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            )}
                            {q.state === "miss" && (
                              <AlertTriangle className="h-4 w-4 text-rose-600" />
                            )}
                            {q.state === "forecast" && (
                              <CircleDot className="h-4 w-4 text-amber-600" />
                            )}
                            <div className="font-medium">{q.q}</div>
                            <div className="text-sm text-slate-600">
                              Target: {q.target}
                            </div>
                          </div>
                          <div className={`text-sm font-semibold ${q.tone}`}>
                            {q.actual}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </section>

                {/* Revenue Risk Assessment */}
                <section className="mt-8">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-rose-600" />
                        Revenue Risk Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      {risks.map((r) => (
                        <div
                          key={r.key}
                          className="rounded-xl border p-4 bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className={`h-4 w-4 ${r.tone}`} />
                              <div className="font-semibold">{r.title}</div>
                            </div>
                            <Badge variant="secondary">{r.impact}</Badge>
                          </div>
                          <ul className="mt-3 space-y-1 pl-5 list-disc text-sm text-slate-700">
                            {r.points.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                          <div className="mt-3 flex items-center gap-2">
                            <Button size="sm" className="h-8">
                              {r.cta}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8">
                              Create Action Plan
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </section>

                {/* Strategic Action Items */}
                <section className="mt-8">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle>Strategic Action Items</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="rounded-xl p-5 bg-indigo-50 border">
                        <div className="font-semibold mb-2">
                          Short Term (Next 30 Days)
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-800 text-sm">
                          <li>Close Q4 pipeline gap</li>
                          <li>Address at-risk accounts</li>
                          <li>Optimize onboarding process</li>
                        </ul>
                      </div>
                      <div className="rounded-xl p-5 bg-emerald-50 border">
                        <div className="font-semibold mb-2">
                          Medium Term (Next 90 Days)
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-800 text-sm">
                          <li>Launch enterprise features</li>
                          <li>Expand customer success team</li>
                          <li>Improve product adoption</li>
                        </ul>
                      </div>
                      <div className="rounded-xl p-5 bg-violet-50 border">
                        <div className="font-semibold mb-2">
                          Long Term (Next 6 Months)
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-slate-800 text-sm">
                          <li>Enter new market segments</li>
                          <li>Build predictive analytics</li>
                          <li>Scale revenue operations</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </section>
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

export default RevenueArchitecture;

/* -------------------------- BACKEND NOTES ---------------------------
1) KPI Tiles
   - GET /rev/metrics?range=this_quarter
     -> { arr, cltv, rpc, grr, deltas: { arr_yoy, cltv_ly, rpc_qoq, grr_lq } }

2) Bowtie Model (per stage)
   - GET /rev/bowtie?range=this_quarter
     -> { lead:{mqls, sqlRate, pipeline}, sales:{winRate, avgDeal, cycleDays}, ... }

3) Quarterly Forecast vs Actuals
   - GET /rev/forecast?years=2024
     -> [{ quarter, target, actual, status }]

4) Revenue Risks
   - GET /rev/risks?severity>=medium
     -> [{ key, title, impact, bullets[], recommendedAction }]
   - POST /rev/actions (create action plan / assign owner)

5) Strategic Action Items
   - GET /rev/strategy
   - PATCH /rev/strategy (mark item done / update)
--------------------------------------------------------------------- */
