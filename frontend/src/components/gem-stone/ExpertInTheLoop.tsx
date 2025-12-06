// src/pages/ExpertInTheLoop.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock4,
  Edit3,
  ExternalLink,
  FileText,
  Headphones,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageSquare,
  MoreHorizontal, // ← add this
  Phone,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  User2,
  Users2,
  Video,
  Zap,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

/** ---------------------------------------------------------------------------------------
 * Expert in the Loop – Command Center
 * - Proactive Relationship (nudges / “take action”)
 * - De-escalation Center
 * - QBR Console
 * - Expert Request & Auto-Assignment
 * - Expert Recommendations & Knowledge capture
 * Shell: same as other pages (Sidebar + right rail)
 * ------------------------------------------------------------------------------------- */

type Expert = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  loadPct: number;
  available: boolean;
};

const experts: Expert[] = [
  {
    id: "e1",
    name: "Sarah Chen",
    role: "Senior Analytics Expert",
    skills: ["Advanced Analytics", "Perf Tuning", "Data Pipelines"],
    loadPct: 62,
    available: true,
  },
  {
    id: "e2",
    name: "Mike Rodriguez",
    role: "ML Ops Specialist",
    skills: ["MLOps", "Whisper", "K8s", "SageMaker"],
    loadPct: 47,
    available: true,
  },
  {
    id: "e3",
    name: "Alex Thompson",
    role: "Platform Reliability",
    skills: ["SRE", "Observability", "Incident Mgmt"],
    loadPct: 88,
    available: false,
  },
];

const proactiveNudges = [
  {
    id: "n1",
    company: "TechFlow Solutions",
    tag: "Appreciation",
    text: "Send congratulations on their 2nd anniversary as a DataAnalytics Pro customer.",
    suggestedBy: "System Trigger",
    cta: "Take Action",
  },
  {
    id: "n2",
    company: "MidMarket Analytics Co.",
    tag: "Value Add",
    text: "Share Gartner report on ‘Future of Data Analytics in Enterprise’ based on their recent inquiry.",
    suggestedBy: "CSM Initiative",
    cta: "Take Action",
  },
  {
    id: "n3",
    company: "Analytics Pro Inc.",
    tag: "Appreciation",
    text: "Congratulate Maria Rodriguez on her team’s successful ML model launch using our analytics platform.",
    suggestedBy: "AI Signal",
    cta: "Take Action",
  },
];

const activeEscalations = [
  {
    id: "esc-1",
    company: "DataVision Corp",
    severity: "High",
    issue:
      "Critical: Ongoing dashboard performance issues impacting real-time analytics workflows. Customer has threatened to churn if not resolved by EOW.",
    contact: "John Miller (CTO)",
    lastContact: "1 day ago",
    checklist: [
      "Acknowledge issue with customer",
      "Schedule urgent call with stakeholders",
      "Define internal action plan with David Miller",
      "Monitor resolution & provide updates",
    ],
  },
];

const qbrDraft = {
  title: "Gamma Inc. QBR – August 5th, 2025 (Scheduled)",
  attendees: ["SC", "SG", "MR"],
  notesPlaceholder:
    "Prepare materials for onboarding QBR. Focus on feature adoption and initial value creation. Review current usage metrics and identify growth opportunities.",
};

export function ExpertInTheLoop() {
  const [log, setLog] = useState("");
  const [req, setReq] = useState({
    account: "DataAnalytics Corp",
    urgency: "High",
    need: "Performance degradation on premium analytics dashboards",
    expertise: ["SRE", "Advanced Analytics"],
    allowAutoAssign: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const bestExpert = useMemo(
    () =>
      experts
        .filter((e) => e.available)
        .sort((a, b) => a.loadPct - b.loadPct)[0],
    []
  );

  const submitRequest = async () => {
    setSubmitting(true);
    // BACKEND:
    // POST /experts/requests
    // body: { account, urgency, need, expertise[], includeContext: true, allowAutoAssign }
    // server:
    //  - enriches with customer360 context (usage, sentiment, risk, open tickets)
    //  - runs auto-assign: skills match + workload + availability + escalation rules
    //  - persists request + emits websocket notification to assigned expert
    //  - returns { requestId, assignedExpert, fallback: boolean }
    setTimeout(() => setSubmitting(false), 900);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center gap-2">
              <h1 className="text-lg font-semibold">Expert in the Loop</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/experts/requests">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Requests
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/experts/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Expert Request
                </Link>
              </Button>
            </div>
          </header>

          {/* Main content + right rail */}
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* ----- Section: Proactive relationship building ----- */}
                <Card className="rounded-xl mb-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Proactive Relationship Building
                      <span className="text-xs text-slate-500 font-normal">
                        Enhance trust via targeted, human touch actions
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {proactiveNudges.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-lg border p-4 bg-emerald-50/40"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{n.company}</div>
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                              {n.tag}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700 mt-2">
                            {n.text}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Suggested by: {n.suggestedBy}
                          </p>
                          <Button className="w-full mt-3">
                            {n.cta}
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Free-form outreach log */}
                    <div className="mt-1">
                      <div className="text-sm font-medium mb-2">
                        Log Other Proactive Outreach
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Had a great informal chat with Maria @ Analytics Pro Inc. about team expansion plans..."
                          value={log}
                          onChange={(e) => setLog(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => setLog("")}>
                          Log Activity
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* ----- De-escalation center ----- */}
                  <Card className="lg:col-span-2 rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        Account De-escalation Center
                        <Badge variant="secondary" className="ml-2">
                          {activeEscalations.length} Active
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeEscalations.map((e) => (
                        <div
                          key={e.id}
                          className="rounded-lg border bg-rose-50/60 p-4 mb-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {e.company} –{" "}
                              <span className="text-rose-700">
                                Risk: {e.severity}
                              </span>
                            </div>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-rose-800 mt-1">
                            {e.issue}
                          </p>
                          <p className="text-[12px] text-rose-700 mt-1">
                            Key Contact: {e.contact} | Last Contact:{" "}
                            {e.lastContact}
                          </p>

                          <Separator className="my-3" />
                          <div className="text-xs font-medium mb-2">
                            De-escalation Checklist:
                          </div>
                          <ul className="space-y-1">
                            {e.checklist.map((c, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-rose-600"
                                />
                                <span className="text-sm">{c}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-3 flex gap-2">
                            <Input
                              placeholder={`Log de-escalation strategy and notes for ${e.company}...`}
                            />
                            <Button className="whitespace-nowrap">
                              Update De-escalation Plan
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* ----- QBR console ----- */}
                  <Card className="rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Quarterly Business Review (QBR) Console
                        <Button variant="outline" size="sm" className="ml-auto">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          View Calendar
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-medium">
                        {qbrDraft.title}
                      </div>
                      <div className="my-3 h-[196px] rounded-lg border bg-gray-50 grid place-items-center text-gray-400 text-sm">
                        Connect Cam | Waiting for participants…
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">
                          Participants:
                        </span>
                        {qbrDraft.attendees.map((a) => (
                          <div
                            key={a}
                            className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-800 grid place-items-center text-[11px] font-medium"
                          >
                            {a}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-xs font-medium">
                        QBR Notes & Key Discussion Points
                      </div>
                      <Textarea
                        className="mt-1"
                        rows={4}
                        placeholder={qbrDraft.notesPlaceholder}
                      />
                      <Button className="w-full mt-3">Save QBR Summary</Button>
                    </CardContent>
                  </Card>
                </div>

                {/* ----- Expert request & auto-assignment ----- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <Card className="rounded-xl lg:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        Request Expert Assistance
                        <Badge variant="outline" className="ml-2">
                          Auto-assignment enabled
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-slate-600 mb-1">
                            Account
                          </div>
                          <Input
                            value={req.account}
                            onChange={(e) =>
                              setReq({ ...req, account: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">
                            Urgency
                          </div>
                          <div className="flex items-center gap-2">
                            {["Low", "Medium", "High", "Critical"].map((u) => (
                              <Button
                                key={u}
                                size="sm"
                                variant={
                                  req.urgency === u ? "default" : "outline"
                                }
                                onClick={() => setReq({ ...req, urgency: u })}
                              >
                                {u}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 mb-1">
                          Describe the situation
                        </div>
                        <Textarea
                          rows={3}
                          value={req.need}
                          onChange={(e) =>
                            setReq({ ...req, need: e.target.value })
                          }
                          placeholder="What’s happening, impact, and what you need help with…"
                        />
                      </div>

                      <div>
                        <div className="text-xs text-slate-600 mb-1">
                          Expertise Needed
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "SRE",
                            "Advanced Analytics",
                            "MLOps",
                            "Security",
                            "Cost Optimization",
                          ].map((t) => {
                            const selected = req.expertise.includes(t);
                            return (
                              <Badge
                                key={t}
                                onClick={() =>
                                  setReq((prev) => ({
                                    ...prev,
                                    expertise: selected
                                      ? prev.expertise.filter((x) => x !== t)
                                      : [...prev.expertise, t],
                                  }))
                                }
                                className={`cursor-pointer ${
                                  selected
                                    ? "bg-blue-600 hover:bg-blue-600"
                                    : ""
                                }`}
                              >
                                {t}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={req.allowAutoAssign}
                            onCheckedChange={(v) =>
                              setReq({ ...req, allowAutoAssign: v })
                            }
                          />
                          <div>
                            <div className="text-sm font-medium">
                              Auto-assign to best available expert
                            </div>
                            <div className="text-xs text-slate-600">
                              Matches on expertise, availability & workload.
                              Escalates priority to seniors.
                            </div>
                          </div>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs">
                          <span className="text-slate-500">Suggested:</span>
                          <strong className="text-slate-900">
                            {bestExpert?.name}
                          </strong>
                          <span className="text-slate-500">
                            ({bestExpert?.role})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button variant="outline" asChild>
                          <Link to="/experts/pool">
                            <Users2 className="w-4 h-4 mr-2" />
                            Choose Expert
                          </Link>
                        </Button>
                        <Button onClick={submitRequest} disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                              Submitting…
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" /> Send Request
                            </>
                          )}
                        </Button>
                      </div>

                      {/* BACKEND:
                          - GET /experts?suggest=true&skills=[...] -> ranked list
                          - POST /experts/requests (payload above)
                          - Webhook/WebSocket to notify assigned expert + requester
                          - SLA timers; escalation to senior if breached
                          - Link to /experts/{id}/case for timeline + context
                      */}
                    </CardContent>
                  </Card>

                  {/* ----- Expert availability & performance glance ----- */}
                  <Card className="rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <User2 className="w-4 h-4 text-teal-600" />
                        Expert Availability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[260px]">
                        <div className="space-y-3 pr-2">
                          {experts.map((e) => (
                            <div
                              key={e.id}
                              className="rounded-lg border p-3 flex items-start gap-3"
                            >
                              <div
                                className={`h-9 w-9 rounded-full grid place-items-center text-[11px] font-medium
                                ${
                                  e.available
                                    ? "bg-teal-100 text-teal-800"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {e.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium">
                                  {e.name}
                                </div>
                                <div className="text-xs text-slate-600">
                                  {e.role}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {e.skills.map((s) => (
                                    <Badge
                                      key={s}
                                      variant="secondary"
                                      className="text-[10px]"
                                    >
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="mt-2 text-[11px] text-slate-600">
                                  Load:{" "}
                                  <span className="font-medium">
                                    {e.loadPct}%
                                  </span>{" "}
                                  •{" "}
                                  {e.available ? (
                                    <span className="text-teal-700">
                                      Available
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">
                                      Busy/OOO
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button variant="ghost" size="icon">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      <Separator className="my-3" />
                      <div className="text-xs text-slate-600 mb-2">
                        Quick Actions
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" /> Chat
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="w-4 h-4 mr-1" /> Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <CalendarDays className="w-4 h-4 mr-1" /> Schedule
                        </Button>
                      </div>

                      {/* BACKEND:
                          - GET /experts/availability
                          - PATCH /experts/{id}/availability
                          - Metrics for response time / satisfaction on expert profile
                      */}
                    </CardContent>
                  </Card>
                </div>

                {/* ----- Recommendations & Knowledge capture ----- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <Card className="lg:col-span-2 rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        Expert Recommendations & Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">
                          Step-by-Step Plan
                        </div>
                        <ol className="mt-2 list-decimal pl-5 space-y-1 text-sm">
                          <li>
                            Enable query sampling + capture slow queries (15
                            min).
                          </li>
                          <li>
                            Roll out optimized caching policy to affected
                            dashboards.
                          </li>
                          <li>
                            Schedule follow-up with customer to validate
                            improvements.
                          </li>
                        </ol>
                        <div className="mt-3 flex items-center gap-2">
                          <Button size="sm">Convert to Tasks</Button>
                          <Button size="sm" variant="outline">
                            Flag Follow-up
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">
                          Recommendation Template
                        </div>
                        <Textarea
                          rows={4}
                          placeholder="Write a structured recommendation the CSM can paste to the customer…"
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-[11px] text-slate-500">
                            Use @variables: {`{impact}`} {`{next_steps}`}{" "}
                            {`{links}`}
                          </div>
                          <Button size="sm" variant="outline">
                            Save as Template
                          </Button>
                        </div>
                      </div>

                      {/* BACKEND:
                          - POST /experts/recommendations -> returns recommendationId
                          - POST /tasks/bulk from recommendations
                          - PUT /cases/{id}/followups
                          - Templating: GET/PUT /recommendation-templates
                      */}
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-600" />
                        Knowledge Capture
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">
                          Document Solution
                        </div>
                        <Textarea
                          rows={4}
                          placeholder="Root cause, resolution, metrics, links…"
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-[11px] text-slate-500">
                            Will publish to Knowledge Base with tags
                          </div>
                          <Button size="sm" variant="outline">
                            Publish
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-lg border p-3">
                        <div className="text-sm font-medium">
                          Train AI on Expert Input
                        </div>
                        <p className="text-xs text-slate-600">
                          Validated responses improve future recommendations;
                          tracked for accuracy.
                        </p>
                        <Button size="sm" className="mt-2">
                          Submit as Training Data
                        </Button>
                      </div>

                      {/* BACKEND:
                          - POST /kb/articles
                          - POST /ai/training-samples (source=expert, labels=tags)
                          - Telemetry: track solution effectiveness over time
                      */}
                    </CardContent>
                  </Card>
                </div>

                {/* Route helpers */}
                <div className="mt-8 text-xs text-slate-500">
                  Routes to create later: /experts/requests, /experts/new,
                  /experts/pool, /experts/:id/case
                </div>
              </div>
            </main>

            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
