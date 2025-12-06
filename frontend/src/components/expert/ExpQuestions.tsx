// src/components/expert/ExpQuestions.tsx
import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paperclip, ChevronLeft, Tag, CircleDot } from "lucide-react";

/* =========================================================
   MOCK DATA  (replace with live fetches)
   ========================================================= */
// BACKEND: GET /experts/questions?status=pending|claimed|completed
type Question = {
  id: string;
  priority: "low" | "medium" | "high";
  category: string;
  title: string;
  askedBy: string;
  org: string;
  askedAgo: string; // "2 hours ago"
  effort: "Low" | "Medium" | "High";
  complexityDots: 1 | 2 | 3 | 4 | 5; // just visual
  tags: string[];
  additionalContext?: string;
  originalQuestion: string;
  aiReference?: string;
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    priority: "high",
    category: "Customer Success",
    title: "Best practice for re-engaging customer after champion leaves?",
    askedBy: "Sarah Chen",
    org: "DataAnalytics Corp",
    askedAgo: "2 hours ago",
    effort: "Medium",
    complexityDots: 3,
    tags: ["#champion-transition", "#account-recovery", "#stakeholder-mapping"],
    additionalContext:
      "This is a high priority request for SmallBiz Analytics. Their VP Engineering (Jane Doe) just departed and we're seeing significant usage drops. Need actionable steps ASAP.",
    originalQuestion:
      "What is DataAnalytics Corp's best practice for re-engaging a customer after their primary champion leaves the company? We need a systematic approach that includes stakeholder identification and relationship rebuilding strategies.",
    aiReference:
      "Based on industry best practices: 1) Immediate stakeholder mapping, 2) Schedule intro calls with decision makers, 3) Provide value-first interactions, 4) Offer training sessions, 5) Regular check-ins to monitor engagement.",
  },
  {
    id: "q2",
    priority: "medium",
    category: "Technical Support",
    title:
      "API rate limits for Enterprise plan – customer asking for specifics",
    askedBy: "Mike Johnson",
    org: "DataAnalytics Corp",
    askedAgo: "4 hours ago",
    effort: "Low",
    complexityDots: 2,
    tags: ["#api", "#enterprise", "#technical"],
    originalQuestion:
      "What are the precise API rate limits for the Enterprise plan and recommended client-side retry patterns?",
  },
  {
    id: "q3",
    priority: "low",
    category: "Sales Support",
    title: "Digital agency case study needed for client presentation",
    askedBy: "Emma Rodriguez",
    org: "DataAnalytics Corp",
    askedAgo: "6 hours ago",
    effort: "Medium",
    complexityDots: 2,
    tags: ["#case-study", "#deck", "#sales-support"],
    originalQuestion:
      "Looking for a polished case study deck for a digital agency using our platform across three regions.",
  },
  {
    id: "q4",
    priority: "high",
    category: "Feature Change",
    title: "Competitive analysis – TaskMaster Pro’s new AI features vs ours",
    askedBy: "Alex Thompson",
    org: "DataAnalytics Corp",
    askedAgo: "1 day ago",
    effort: "Medium",
    complexityDots: 3,
    tags: ["#competitive", "#ai", "#roadmap"],
    originalQuestion:
      "Customer asked how our new AI roadmap compares to TaskMaster Pro's announced features.",
  },
];

/* =========================================================
   SMALL UI HELPERS
   ========================================================= */

function PriorityPill({ p }: { p: Question["priority"] }) {
  if (p === "high")
    return (
      <Badge className="bg-rose-500/15 text-rose-700 border border-rose-200 h-6 px-2">
        high
      </Badge>
    );
  if (p === "medium")
    return (
      <Badge className="bg-amber-500/15 text-amber-700 border border-amber-200 h-6 px-2">
        medium
      </Badge>
    );
  return (
    <Badge className="bg-emerald-500/15 text-emerald-700 border border-emerald-200 h-6 px-2">
      low
    </Badge>
  );
}

const TagChip = ({ t }: { t: string }) => (
  <span className="text-[12px] px-2 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
    {t}
  </span>
);

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export function ExpQuestions() {
  const [tab, setTab] = useState<"pending" | "claimed" | "completed">(
    "pending"
  );
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<
    | "all"
    | "Customer Success"
    | "Technical Support"
    | "Sales Support"
    | "Feature Change"
  >("all");
  const [query, setQuery] = useState("");

  // BACKEND: default sort by priority desc, then recency
  const filtered = useMemo(() => {
    let list = QUESTIONS;
    if (priorityFilter !== "all") {
      list = list.filter((q) => q.priority === priorityFilter);
    }
    if (categoryFilter !== "all") {
      list = list.filter((q) => q.category === categoryFilter);
    }
    if (query.trim()) {
      const ql = query.toLowerCase();
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(ql) ||
          q.originalQuestion.toLowerCase().includes(ql) ||
          q.tags.join(" ").toLowerCase().includes(ql)
      );
    }
    return list;
  }, [priorityFilter, categoryFilter, query]);

  const [selectedId, setSelectedId] = useState<string>(filtered[0]?.id ?? "");
  React.useEffect(() => {
    if (!filtered.find((x) => x.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? "");
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((q) => q.id === selectedId) ?? filtered[0];

  // BACKEND: POST /experts/questions/:id/claim
  const onClaim = (id: string) => {
    console.log("Claim question", id);
  };
  // BACKEND: POST /experts/questions/:id/reassign
  const onAssignOther = (id: string) => {
    console.log("Assign to other expert", id);
  };

  // Compose toolbar state (mock)
  const [template, setTemplate] = useState<string>("");
  const [text, setText] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <Button variant="ghost" size="sm" className="ml-2">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Experts
            </Button>
          </header>

          {/* Content area */}
          <div className="flex-1 flex">
            {/* LEFT RAIL (list + filters) */}
            <aside className="w-[335px] border-r bg-white p-4">
              <div className="text-[15px] font-semibold mb-1">
                Expert Dashboard
              </div>
              <div className="text-xs text-slate-500 mb-3">
                DataAnalytics Corp Internal Q&A
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-3 text-sm">
                {(["pending", "claimed", "completed"] as const).map((name) => {
                  const label =
                    name === "pending"
                      ? "Pending"
                      : name === "claimed"
                      ? "Claimed"
                      : "Completed";
                  const active = tab === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setTab(name)}
                      className={[
                        "px-3 py-2 rounded-md font-medium",
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {label}
                      {name === "pending" && (
                        <span className="ml-1 text-[11px] opacity-80">
                          ({QUESTIONS.length})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="mt-4">
                <Input
                  placeholder="Search questions..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-9"
                />
              </div>

              {/* Filters */}
              <div className="mt-3 flex items-center gap-2">
                <Select
                  value={priorityFilter}
                  onValueChange={(v: any) => setPriorityFilter(v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={categoryFilter}
                  onValueChange={(v: any) => setCategoryFilter(v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Customer Success">
                      Customer Success
                    </SelectItem>
                    <SelectItem value="Technical Support">
                      Technical Support
                    </SelectItem>
                    <SelectItem value="Sales Support">Sales Support</SelectItem>
                    <SelectItem value="Feature Change">
                      Feature Change
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question list */}
              <div className="mt-4 space-y-3">
                {filtered.map((q) => {
                  const active = q.id === selected?.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedId(q.id)}
                      className={[
                        "w-full text-left rounded-lg border p-3",
                        active
                          ? "border-slate-900 shadow-sm"
                          : "hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-[13px] font-semibold leading-snug pr-2">
                          {q.title}
                        </div>
                        <PriorityPill p={q.priority} />
                      </div>

                      <div className="mt-2 text-[12px] text-slate-600 flex items-center gap-2">
                        <span className="flex items-center">
                          <CircleDot className="w-3 h-3 mr-1 text-slate-400" />
                          {q.askedBy} @ {q.org}
                        </span>
                        <span>•</span>
                        <span>{q.askedAgo}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[12px]">
                        <span className="px-2 py-1 rounded-full bg-slate-100 border text-slate-700">
                          {q.category}
                        </span>
                        <div className="flex items-center gap-1 text-slate-500">
                          {/* complexity dots */}
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={[
                                "w-1.5 h-1.5 rounded-full",
                                i < q.complexityDots
                                  ? "bg-slate-700"
                                  : "bg-slate-300",
                              ].join(" ")}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-1 text-[11px] text-slate-500">
                        Effort: {q.effort}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* MAIN PANEL */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              {!!selected && (
                <div className="max-w-[980px] mx-auto px-6 py-6 font-['Poppins']">
                  {/* Header row (chips + actions) */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <PriorityPill p={selected.priority} />
                    <Badge
                      variant="secondary"
                      className="h-6 px-2 text-[12px] border bg-slate-100 text-slate-700"
                    >
                      {selected.category}
                    </Badge>
                    <div className="text-[15px] font-semibold ml-2">
                      {selected.title}
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onAssignOther(selected.id)}
                      >
                        Assign to Other Expert
                      </Button>
                      <Button onClick={() => onClaim(selected.id)}>
                        Claim Question
                      </Button>
                    </div>
                  </div>

                  {/* Sub line */}
                  <div className="text-[12px] text-slate-600 mb-3">
                    Asked by{" "}
                    <span className="font-medium">{selected.askedBy}</span> @{" "}
                    {selected.org} • {selected.askedAgo} • Estimated effort:{" "}
                    {selected.effort}
                  </div>

                  {/* tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selected.tags.map((t) => (
                      <TagChip key={t} t={t} />
                    ))}
                  </div>

                  {/* Original Question */}
                  <Card className="mb-4 border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[15px]">
                        Original Question
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-[14px] text-slate-800 leading-relaxed">
                      {selected.originalQuestion}
                    </CardContent>
                  </Card>

                  {/* Additional Context */}
                  {selected.additionalContext && (
                    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-[14px] text-amber-900">
                      <div className="font-medium mb-1">Additional Context</div>
                      {selected.additionalContext}
                    </div>
                  )}

                  {/* AI Reference */}
                  {selected.aiReference && (
                    <Card className="mb-5 border-slate-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-[15px]">
                          AI-Generated Response (for reference)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md bg-sky-50 border border-sky-200 p-4 text-[14px] text-sky-900">
                          {selected.aiReference}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Provide Expert Response */}
                  <Card className="border-slate-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[15px]">
                        Provide Expert Response
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Templates */}
                      <div>
                        <div className="text-[13px] font-medium mb-1">
                          Quick Templates
                        </div>
                        {/* BACKEND: GET /experts/templates */}
                        <Select value={template} onValueChange={setTemplate}>
                          <SelectTrigger className="h-9 w-full md:w-[380px]">
                            <SelectValue placeholder="Select a template..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="reengage">
                              Re-engagement Playbook
                            </SelectItem>
                            <SelectItem value="api">
                              API Limits + Retry Pattern
                            </SelectItem>
                            <SelectItem value="case">
                              Case Study Outline
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Toolbar */}
                      <div className="flex items-center gap-3 text-slate-600">
                        <button className="px-2 py-1 rounded hover:bg-slate-100 font-semibold">
                          B
                        </button>
                        <button className="px-2 py-1 rounded hover:bg-slate-100 italic">
                          i
                        </button>
                        <button className="px-2 py-1 rounded hover:bg-slate-100">
                          •
                        </button>
                        <button className="px-2 py-1 rounded hover:bg-slate-100">
                          1.
                        </button>
                        <button className="px-2 py-1 rounded hover:bg-slate-100">
                          {"</>"}
                        </button>
                        <div className="ml-auto flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          <span className="text-[13px]">Attach</span>
                        </div>
                      </div>

                      {/* Editor (simple textarea for now) */}
                      {/* BACKEND: POST /experts/questions/:id/response (rich text) */}
                      <textarea
                        className="w-full min-h-[160px] rounded-md border p-3 text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200"
                        placeholder="Provide your expert guidance here…"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />

                      {/* Supporting resources */}
                      <div className="space-y-2">
                        <div className="text-[13px] font-medium">
                          Supporting Resources
                        </div>
                        {/* BACKEND: allow multiple links + files */}
                        <Input
                          placeholder="Add documentation link…"
                          className="h-9"
                        />
                        <Input
                          placeholder="Add internal playbook reference…"
                          className="h-9"
                        />
                      </div>

                      <div className="pt-1 flex flex-wrap gap-3">
                        <Button variant="outline">Save as Draft</Button>
                        <Button variant="outline">Preview</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          Submit Expert Response
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </main>

            {/* RIGHT RAIL — note: self-closing (no children) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
