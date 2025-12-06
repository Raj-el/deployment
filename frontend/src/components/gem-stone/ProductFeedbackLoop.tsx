// src/pages/ProductFeedbackLoop.tsx
import React, { useMemo, useState } from "react";
import {
  MessageSquare,
  Plus,
  Mail,
  FileText,
  Mic,
  Camera,
  ChevronDown,
  ChevronRight,
  Tag,
  Users,
  DollarSign,
  Search,
  Filter,
  Ellipsis,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ----------------------------------------------------------------
   Mock data (replace via API)
----------------------------------------------------------------- */
type FeedbackItem = {
  id: string;
  account: string;
  date: string;
  source: "email" | "meeting" | "qbr" | "call" | "in-app";
  summary: string;
  status?: "New" | "Reviewed" | "Linked to Feature";
  linkedFeatureId?: string;
};

type FeatureTheme = {
  id: string;
  title: string;
  accountCount: number;
  arr: number;
  items: FeedbackItem[];
};

const inboxSeed: FeedbackItem[] = [
  {
    id: "f1",
    account: "Innovate Solutions",
    date: "2025-07-20",
    source: "meeting",
    summary:
      "Tom Bradly requested more granular permission controls for team collaboration features…",
    status: "New",
  },
  {
    id: "f2",
    account: "Apex Digital",
    date: "2025-07-18",
    source: "email",
    summary:
      "Clara Oswald asked for a bulk user import feature via CSV to streamline onboarding.",
    status: "New",
  },
  {
    id: "f3",
    account: "Global Tech Inc.",
    date: "2025-07-15",
    source: "qbr",
    summary:
      "During QBR, Maria Rodriguez highlighted need for better reporting filter options.",
    status: "Linked to Feature",
    linkedFeatureId: "t1",
  },
  {
    id: "f4",
    account: "Stellar Solutions",
    date: "2025-07-12",
    source: "call",
    summary:
      "David Chen mentioned interest in a Dark Mode theme during a call.",
    status: "Reviewed",
  },
];

const themesSeed: FeatureTheme[] = [
  {
    id: "t1",
    title: "Advanced Reporting Enhancements",
    accountCount: 3,
    arr: 280000,
    items: [inboxSeed[2]],
  },
  {
    id: "t2",
    title: "Bulk User Management (Import/Export)",
    accountCount: 2,
    arr: 70000,
    items: [inboxSeed[1]],
  },
  {
    id: "t3",
    title: "AI-Powered Task Summarization",
    accountCount: 1,
    arr: 120000,
    items: [],
  },
  {
    id: "t4",
    title: "Dark Mode Theme",
    accountCount: 2,
    arr: 90000,
    items: [inboxSeed[3]],
  },
];

/* ----------------------------------------------------------------
   Page
----------------------------------------------------------------- */
export function ProductFeedbackLoop() {
  const [query, setQuery] = useState("");
  const [inbox] = useState<FeedbackItem[]>(inboxSeed);
  const [themes] = useState<FeatureTheme[]>(themesSeed);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filteredInbox = useMemo(() => {
    if (!query) return inbox;
    const q = query.toLowerCase();
    return inbox.filter(
      (i) =>
        i.account.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q)
    );
  }, [inbox, query]);

  const iconForSource = (s: FeedbackItem["source"]) => {
    switch (s) {
      case "email":
        return <Mail className="w-4 h-4" />;
      case "qbr":
        return <FileText className="w-4 h-4" />;
      case "meeting":
        return <Users className="w-4 h-4" />;
      case "call":
        return <Mic className="w-4 h-4" />;
      case "in-app":
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

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
              <h1 className="text-lg font-semibold">Product Feedback Loop</h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </header>

          {/* Middle area */}
          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Feedback Inbox */}
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Feedback Inbox
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search feedback…"
                            className="h-9 w-[200px]"
                          />
                          <Button className="h-9">
                            <Plus className="w-4 h-4" />
                            Add Feedback
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600">
                        Real-time unified feed of all incoming feedback.
                      </p>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <ScrollArea className="h-[640px] pr-2">
                        <ul className="space-y-3">
                          {filteredInbox.map((item) => (
                            <li
                              key={item.id}
                              className="rounded-xl border bg-white p-4 hover:shadow-sm transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-slate-600">
                                  {iconForSource(item.source)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium">
                                      {item.account}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {item.status && (
                                        <Badge
                                          variant={
                                            item.status === "New"
                                              ? "destructive"
                                              : item.status === "Reviewed"
                                              ? "secondary"
                                              : "default"
                                          }
                                        >
                                          {item.status}
                                        </Badge>
                                      )}
                                      <Ellipsis className="w-4 h-4 text-slate-500" />
                                    </div>
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {new Date(item.date).toLocaleDateString()}
                                  </div>
                                  <p className="mt-2 text-sm text-slate-800">
                                    {item.summary}
                                  </p>

                                  <div className="mt-3 flex items-center gap-2">
                                    <Badge variant="outline" className="gap-1">
                                      <Tag className="w-3 h-3" />
                                      {item.source}
                                    </Badge>

                                    {item.linkedFeatureId && (
                                      <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                                        Linked to Feature
                                      </Badge>
                                    )}

                                    {/* BACKEND:
                                        - PATCH /feedback/:id {status, linkedFeatureId}
                                        - POST /feedback/:id/link-feature {featureId}
                                        - Events: emit 'feedback.updated' for live lists
                                      */}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Right: Customer Feature Requests / Themes */}
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle>Customer Feature Requests</CardTitle>
                      <p className="text-xs text-slate-600">
                        Aggregated product themes prioritized by customer
                        demand.
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {themes.map((t) => {
                          const isOpen = !!expanded[t.id];
                          return (
                            <div
                              key={t.id}
                              className="rounded-xl border bg-white p-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                  <div className="font-medium text-slate-900">
                                    {t.title}
                                  </div>
                                  {/* Expanded child list */}
                                  {isOpen && (
                                    <div className="mt-3 pl-1">
                                      <ul className="space-y-2">
                                        {t.items.length === 0 && (
                                          <li className="text-xs text-slate-500">
                                            No linked feedback yet.
                                          </li>
                                        )}
                                        {t.items.map((i) => (
                                          <li
                                            key={i.id}
                                            className="flex items-start gap-2"
                                          >
                                            <span className="mt-1 text-slate-500">
                                              <ChevronRight className="w-3 h-3" />
                                            </span>
                                            <div className="text-sm">
                                              <span className="font-medium">
                                                {i.account}
                                              </span>{" "}
                                              — {i.summary}
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {t.accountCount}{" "}
                                    {t.accountCount === 1
                                      ? "Account"
                                      : "Accounts"}
                                  </Badge>
                                  <Badge className="gap-1 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                                    <DollarSign className="w-3 h-3" />
                                    {t.arr
                                      .toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        maximumFractionDigits: 0,
                                      })
                                      .replace("$", "$")}
                                    ARR
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      setExpanded((s) => ({
                                        ...s,
                                        [t.id]: !s[t.id],
                                      }))
                                    }
                                    aria-label={
                                      isOpen ? "Collapse items" : "Expand items"
                                    }
                                  >
                                    {isOpen ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  Link Feedback
                                </Button>
                                <Button variant="outline" size="sm">
                                  Create Roadmap Item
                                </Button>
                                {/* BACKEND:
                                    - POST /themes/:id/link-feedback
                                    - POST /roadmap (prefill from theme)
                                    - GET /themes?sort=impact (aggregation service)
                                    - Feature scoring service: usage weight, tier weight, ARR
                                  */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Add feedback drawer (inline lightweight) */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle>Quick Capture (In-App)</CardTitle>
                      <p className="text-xs text-slate-600">
                        Context-aware capture with screenshots/recordings.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input placeholder="Feature / Area (e.g. Reports › Filters)" />
                        <Input placeholder="Severity / Impact (e.g. High | Affects 40% users)" />
                      </div>
                      <Textarea rows={4} placeholder="Describe the feedback…" />
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Add Screenshot
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mic className="w-4 h-4 mr-2" />
                          Voice Note
                        </Button>
                        <div className="ml-auto">
                          <Button size="sm">Submit</Button>
                        </div>
                      </div>
                      {/* BACKEND:
                          - POST /feedback {accountId?, area, impact, text, files}
                          - Auto-tagging pipeline:
                            POST /nlp/feedback/analyze -> {sentiment, tags, duplicates[], productArea}
                          - Routing:
                            POST /router/feedback -> product squad topic, SLA bucket
                        */}
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle>Status & SLA</CardTitle>
                      <p className="text-xs text-slate-600">
                        Track turnaround for feedback triage & responses.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">
                          Triage SLA Met
                        </span>
                        <Badge variant="secondary">92%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">
                          Avg Time to Decision
                        </span>
                        <Badge variant="secondary">2.3 days</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">
                          Feedback → Feature Conversion
                        </span>
                        <Badge variant="secondary">18%</Badge>
                      </div>
                      {/* BACKEND:
                          - GET /metrics/feedback {range}
                          - Counters from warehouse (dbt model) or OLAP (ClickHouse/Pinot)
                        */}
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
