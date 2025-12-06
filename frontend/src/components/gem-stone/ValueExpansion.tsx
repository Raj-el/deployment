// src/pages/ValueExpansion.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Plus,
  TrendingUp,
  GitBranch,
  Percent,
  Timer,
  DollarSign,
  Zap,
  Gauge,
  Users2,
} from "lucide-react";

/** ----------------------------------------------------------------
 * Mock data (replace with backend data)
 * BACKEND:
 *  - GET /expansion/kpis?window=this_quarter
 *  - GET /expansion/csql?status=active&sort=score:desc
 *  - GET /expansion/opportunities?status=active&sort=confidence:desc
 *  - GET /expansion/signals?accountId=...
 *  - POST /expansion/action (schedule_demo, send_msg, schedule_meeting, update_stage)
 *  - POST /csql/assign  (owner = sales rep id)
 *  - POST /csql/convert (to opportunity)
 * ---------------------------------------------------------------- */
const kpis = [
  { label: "Active CSQLs", value: "24", icon: Users2 },
  { label: "Expansion Pipeline", value: "$485K", icon: GitBranch },
  { label: "Conversion Rate", value: "72%", icon: Percent },
  { label: "Avg. Sales Cycle", value: "35 days", icon: Timer },
  { label: "This Quarter", value: "$125K", icon: DollarSign },
];

type CSQL = {
  id: string;
  company: string;
  badge?: "Hot" | "Warm" | "Qualified";
  score: number;
  contact: string;
  contactRole: string;
  updatedAgo: string;
  csm: string;
  source: string; // Product Usage | Support Escalation | Feature Request
  signals: string[];
  nextBestAction: string;
  estValue: string;
};

const csqls: CSQL[] = [
  {
    id: "csql-1",
    company: "Analytics Pro Inc.",
    badge: "Hot",
    score: 92,
    contact: "Michael Rodriguez",
    contactRole: "VP of Engineering",
    updatedAgo: "2 hours ago",
    csm: "Sarah Wilson",
    source: "Product Usage",
    signals: [
      "ML Feature Usage Spike +85%",
      "Multiple Stakeholder Logins",
      "Advanced Analytics Adoption",
    ],
    nextBestAction: "Schedule Enterprise Analytics Demo",
    estValue: "$120,000",
  },
  {
    id: "csql-2",
    company: "DataVision Corp",
    badge: "Warm",
    score: 78,
    contact: "Lisa Chen",
    contactRole: "Chief Technology Officer",
    updatedAgo: "1 day ago",
    csm: "Mike Thompson",
    source: "Support Escalation",
    signals: [
      "Executive Engagement",
      "Real-time Dashboard Requirements",
      "Performance Optimization Requests",
    ],
    nextBestAction: "Technical Deep Dive on Performance",
    estValue: "$85,000",
  },
  {
    id: "csql-3",
    company: "SmallBiz Analytics",
    badge: "Qualified",
    score: 65,
    contact: "James Wilson",
    contactRole: "Director of Analytics",
    updatedAgo: "3 days ago",
    csm: "Emma Rodriguez",
    source: "Feature Request",
    signals: [
      "Custom Report Interest",
      "Data Export Requests",
      "ROI Questions",
    ],
    nextBestAction: "ROI Presentation & Renewal Discussion",
    estValue: "$45,000",
  },
];

type Opportunity = {
  id: string;
  company: string;
  stage: "Negotiation" | "Discovery" | "Evaluation";
  risk: "Low Risk" | "Medium Risk" | "High Risk";
  name: string; // e.g., Premium Analytics Upgrade
  csm: string;
  daysInStage: number;
  confidencePct: number;
  timeline: string; // Q1 2024
  champion: string;
  championRole: string;
  signals: string[];
  value: string; // $95,000
  currentArr?: string;
};

const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    company: "TechFlow Solutions",
    stage: "Negotiation",
    risk: "Low Risk",
    name: "Premium Analytics Upgrade",
    csm: "Sarah Wilson",
    daysInStage: 12,
    confidencePct: 85,
    timeline: "Q1 2024",
    champion: "David Miller",
    championRole: "IT Director",
    signals: ["Executive approval", "Budget allocated", "POC successful"],
    value: "$95,000",
    currentArr: "$280,000",
  },
  {
    id: "opp-2",
    company: "MidMarket Analytics Co.",
    stage: "Discovery",
    risk: "Medium Risk",
    name: "User License Expansion",
    csm: "Mike Thompson",
    daysInStage: 5,
    confidencePct: 70,
    timeline: "Q2 2024",
    champion: "Maria Garcia",
    championRole: "Head of Data Science",
    signals: [
      "Rapid team growth",
      "Budget allocation",
      "Advanced feature adoption",
    ],
    value: "$75,000",
    currentArr: "$145,000",
  },
  {
    id: "opp-3",
    company: "DataInsights Corp",
    stage: "Evaluation",
    risk: "High Risk",
    name: "Advanced AI Analytics Module",
    csm: "Emma Rodriguez",
    daysInStage: 18,
    confidencePct: 60,
    timeline: "Q1 2024",
    champion: "Robert Zhang",
    championRole: "Chief Data Officer",
    signals: [
      "Compliance requirements",
      "AI capability requests",
      "Executive interest",
    ],
    value: "$65,000",
    currentArr: "$155,000",
  },
];

/** Small utilities */
const chip = (
  label: string,
  tone: "green" | "blue" | "amber" | "gray" = "blue"
) =>
  `inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] ring-1 ${
    {
      green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      blue: "bg-sky-50 text-sky-700 ring-sky-100",
      amber: "bg-amber-50 text-amber-700 ring-amber-100",
      gray: "bg-gray-100 text-gray-700 ring-gray-200",
    }[tone]
  }`;

/** ----------------------------------------------------------------
 * Page
 * ---------------------------------------------------------------- */
export function ValueExpansion() {
  const [tab, setTab] = useState<"csql" | "opps">("csql");
  const [q, setQ] = useState("");

  const filteredCSQLs = useMemo(
    () =>
      csqls.filter(
        (c) =>
          c.company.toLowerCase().includes(q.toLowerCase()) ||
          c.contact.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  const filteredOpps = useMemo(
    () =>
      opportunities.filter((o) =>
        o.company.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center justify-between w-full">
              <h1 className="text-lg font-semibold">Value Expansion</h1>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search accounts or contacts..."
                    className="pl-9 h-9 w-[260px]"
                  />
                </div>
                <Button variant="outline" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button className="h-9">
                  <Plus className="h-4 w-4 mr-2" />
                  New Opportunity
                </Button>
              </div>
            </div>
          </header>

          {/* Main area */}
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* KPI header */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {kpis.map((k) => (
                    <Card key={k.label} className="rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-600">
                            {k.label}
                          </div>
                          <k.icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="mt-1 text-2xl font-semibold text-slate-900">
                          {k.value}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Tabs */}
                <Tabs
                  value={tab}
                  onValueChange={(v) => setTab(v as any)}
                  className="mt-2"
                >
                  <div className="flex items-center justify-between mb-2">
                    <TabsList className="rounded-xl">
                      <TabsTrigger value="csql" className="gap-2">
                        <Zap className="w-4 h-4" /> CS Qualified Leads
                      </TabsTrigger>
                      <TabsTrigger value="opps" className="gap-2">
                        <TrendingUp className="w-4 h-4" /> Expansion
                        Opportunities
                      </TabsTrigger>
                    </TabsList>
                    {tab === "opps" && (
                      <span className="text-xs text-slate-500">
                        {/* BACKEND: count active opportunities */} 3 Active
                        Opportunities
                      </span>
                    )}
                    {tab === "csql" && (
                      <span className="text-xs text-slate-500">
                        {/* BACKEND: count active CSQLs */} 3 Active Leads
                      </span>
                    )}
                  </div>

                  {/* CSQL LIST */}
                  <TabsContent value="csql" className="space-y-4">
                    {filteredCSQLs.map((csql) => (
                      <Card
                        key={csql.id}
                        className="rounded-xl overflow-hidden border"
                      >
                        <div className="p-5 grid grid-cols-12 gap-4 items-start">
                          {/* Left meta */}
                          <div className="col-span-12 lg:col-span-8">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[16px] font-semibold">
                                {csql.company}
                              </h3>
                              {csql.badge && (
                                <span
                                  className={chip(
                                    csql.badge,
                                    csql.badge === "Hot"
                                      ? "amber"
                                      : csql.badge === "Warm"
                                      ? "blue"
                                      : "green"
                                  )}
                                >
                                  {csql.badge}
                                </span>
                              )}
                              <span className={chip(`Score:`, "gray")}>
                                <span className="ml-1 font-medium">
                                  {csql.score}/100
                                </span>
                              </span>
                              <span className="text-xs text-slate-500 ml-1">
                                • {csql.updatedAgo}
                              </span>
                              <span className="text-xs text-slate-500">
                                • CSM: {csql.csm}
                              </span>
                            </div>

                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <div className="text-[12px] text-slate-500 mb-1">
                                  Qualification Source
                                </div>
                                <span className={chip(csql.source, "gray")}>
                                  {csql.source}
                                </span>
                                <div className="text-[12px] text-slate-500 mt-3 mb-1">
                                  AI-Detected Signals
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {csql.signals.map((s) => (
                                    <span
                                      key={s}
                                      className={chip(s, "green")}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div>
                                <div className="text-[12px] text-slate-500 mb-1">
                                  Next Best Action
                                </div>
                                <Link
                                  to="#"
                                  className="text-sky-700 hover:underline"
                                >
                                  {csql.nextBestAction}
                                </Link>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                              <Button variant="default" className="h-9">
                                <Gauge className="w-4 h-4 mr-2" />
                                {csql.nextBestAction.includes("Demo")
                                  ? "Schedule Enterprise Analytics Demo"
                                  : csql.nextBestAction.includes("Deep Dive")
                                  ? "Technical Deep Dive on Performance"
                                  : "ROI Presentation & Renewal Discussion"}
                              </Button>
                              <Button variant="outline" className="h-9">
                                View Profile
                              </Button>
                              <Button variant="outline" className="h-9">
                                Send Message
                              </Button>
                              <Button variant="outline" className="h-9">
                                Schedule Meeting
                              </Button>
                            </div>
                          </div>

                          {/* Right value */}
                          <div className="col-span-12 lg:col-span-4 lg:text-right">
                            <div className="text-emerald-600 text-2xl font-semibold">
                              {csql.estValue}
                            </div>
                            <div className="text-[12px] text-slate-500">
                              Estimated Value
                            </div>
                          </div>
                        </div>

                        {/* BACKEND:
                            - scoring: GET /csql/{id}/score
                            - signals: GET /signals?accountId=<id>&types=usage,feature,engagement
                            - actions:
                                POST /actions/schedule-demo { accountId, slot }
                                POST /actions/send-message { accountId, templateId }
                                POST /actions/schedule-meeting { accountId, slot }
                                POST /csql/assign { accountId, ownerId }
                                POST /csql/convert { accountId }
                         */}
                      </Card>
                    ))}
                  </TabsContent>

                  {/* OPPORTUNITIES LIST */}
                  <TabsContent value="opps" className="space-y-4">
                    {filteredOpps.map((opp) => (
                      <Card
                        key={opp.id}
                        className="rounded-xl overflow-hidden border"
                      >
                        <div className="p-5 space-y-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[16px] font-semibold">
                              {opp.company}
                            </h3>
                            <span className={chip(opp.stage, "amber")}>
                              {opp.stage}
                            </span>
                            <span
                              className={chip(
                                opp.risk,
                                opp.risk === "High Risk"
                                  ? "amber"
                                  : opp.risk === "Medium Risk"
                                  ? "blue"
                                  : "green"
                              )}
                            >
                              {opp.risk}
                            </span>
                          </div>

                          <div className="text-[14px] text-slate-700">
                            {opp.name} • CSM: {opp.csm} • {opp.daysInStage} days
                            in stage
                          </div>

                          {/* Confidence / timeline / champion */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-[12px] text-slate-500 mb-1">
                                Confidence Level
                              </div>
                              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-2 bg-slate-900 rounded-full"
                                  style={{ width: `${opp.confidencePct}%` }}
                                />
                              </div>
                              <div className="text-[12px] text-slate-600 mt-1">
                                {opp.confidencePct}%
                              </div>
                            </div>
                            <div>
                              <div className="text-[12px] text-slate-500 mb-1">
                                Timeline
                              </div>
                              <div className="text-[14px]">{opp.timeline}</div>
                            </div>
                            <div>
                              <div className="text-[12px] text-slate-500 mb-1">
                                Champion
                              </div>
                              <div className="text-[14px]">
                                {opp.champion} – {opp.championRole}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-[12px] text-slate-500 mb-1">
                              Expansion Signals
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {opp.signals.map((s) => (
                                <span key={s} className={chip(s, "green")} />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex flex-wrap gap-2">
                              <Button className="h-9">
                                <GitBranch className="w-4 h-4 mr-2" />
                                Update Opportunity
                              </Button>
                              <Button variant="outline" className="h-9">
                                Schedule Call
                              </Button>
                              <Button variant="outline" className="h-9">
                                Send Proposal
                              </Button>
                              <Button variant="outline" className="h-9">
                                View Account Details
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-600 text-2xl font-semibold">
                                {opp.value}
                              </div>
                              <div className="text-[12px] text-slate-500">
                                Expansion Value{" "}
                                {opp.currentArr &&
                                  `• Current ARR: ${opp.currentArr}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BACKEND:
                            - GET /opportunities/{id}
                            - PATCH /opportunities/{id} (stage, confidence, timeline)
                            - POST /meetings/schedule { accountId, type }
                            - POST /proposals { accountId, templateId }
                            - Signals fed by: product-usage, feature flags, support analytics
                         */}
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </main>

            {/* RIGHT RAIL: keep it to align with other pages — remove if you want full-width */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
