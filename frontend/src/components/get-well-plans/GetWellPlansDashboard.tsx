// src/components/get-well-plans/GetWellPlansDashboard.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ---- Shell (same encapsulation as LibraryHub/Dashboard) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* Icons */
import {
  Plus,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Calendar,
  User,
  PlusCircle,
} from "lucide-react";

/* -----------------------------------------------------------
   MOCK DATA — replace with Supabase later
----------------------------------------------------------- */
const kpis = [
  { label: "Accounts at Risk", value: 12, icon: Users },
  { label: "ARR at Risk", value: "$950,000", icon: DollarSign },
  { label: "Health Score Trend (30d)", value: "Avg. 68", icon: TrendingUp },
  { label: "Predicted Churn (Qtr)", value: "8%", icon: AlertTriangle },
];

type QueueItem = {
  id: string;
  name: string;
  arr: string;
  score: number; // 0-100 red style like 34/100
  tags: string[];
  level: "high" | "medium" | "low";
};

const atRiskQueue: QueueItem[] = [
  {
    id: "acct_smallbiz",
    name: "SmallBiz Analytics",
    arr: "$45,000 ARR",
    score: 34,
    tags: ["Negative Sentiment", "Champion Left", "Support Issues"],
    level: "high",
  },
  {
    id: "acct_regional",
    name: "RegionalInsights Co",
    arr: "$35,000 ARR",
    score: 52,
    tags: ["Low Adoption"],
    level: "medium",
  },
  {
    id: "acct_globex",
    name: "Globex Data",
    arr: "$120,000 ARR",
    score: 58,
    tags: ["Renewal in 45d", "Usage Decline"],
    level: "medium",
  },
  {
    id: "acct_datavision",
    name: "DataVision Corp",
    arr: "$380,000 ARR",
    score: 71,
    tags: ["Stakeholder Change"],
    level: "low",
  },
];

type TaskRow = {
  id: string;
  title: string;
  owner: string;
  status: "To-Do" | "In Progress" | "Blocked" | "Done";
  due?: string; // ISO date or empty
};

const initialTasks: TaskRow[] = [
  {
    id: "t1",
    title: "Identify and engage new primary stakeholder",
    owner: "Sarah Chen",
    status: "To-Do",
  },
  {
    id: "t2",
    title: "Review and resolve outstanding priority support tickets",
    owner: "David Miller",
    status: "To-Do",
  },
  {
    id: "t3",
    title: "Offer targeted re-training session for key user group",
    owner: "Sarah Chen",
    status: "To-Do",
  },
];

const healthFactors = [
  { label: "Product Experience", value: 25 },
  { label: "Support Experience", value: 35 },
  { label: "Billing Status", value: 90 },
  { label: "Relationship", value: 15 },
];

const negativeEvents = [
  {
    title: "Champion Jane Doe (VP Engineering) departed",
    date: "June 15",
  },
  { title: "High-priority support ticket #TS4321 opened", date: "June 18" },
  { title: "High-priority support ticket #TS4388 opened", date: "June 22" },
  { title: "Q2 NPS survey response: 3/10", date: "June 28" },
];

/* -----------------------------------------------------------
   COMPONENT
----------------------------------------------------------- */
export function GetWellPlansDashboard() {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string>(atRiskQueue[0].id);
  const selected = useMemo(
    () => atRiskQueue.find((a) => a.id === selectedId)!,
    [selectedId]
  );

  const [tasks, setTasks] = useState<TaskRow[]>(initialTasks);

  const addTask = () =>
    setTasks((prev) => [
      ...prev,
      {
        id: `t${prev.length + 1}`,
        title: "New task",
        owner: "Unassigned",
        status: "To-Do",
      },
    ]);

  const setTaskField = <K extends keyof TaskRow>(
    id: string,
    key: K,
    value: TaskRow[K]
  ) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );

  const levelBadge = (lvl: QueueItem["level"]) => {
    if (lvl === "high") return "bg-red-100 text-red-800 border-red-200";
    if (lvl === "medium")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
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
              <h1 className="text-lg font-semibold">Get-Well Plans</h1>
            </div>
            <div className="ml-auto">
              <Button
                onClick={() => navigate("/get-well-plans/create")}
                className="h-10 px-4 rounded-xl
    bg-blue-600 text-white
    shadow-sm hover:shadow-md
    hover:bg-blue-700
    transition-all
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
    disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Plan
              </Button>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT (scrollable) */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                {/* KPI STRIP */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpis.map((k) => (
                    <Card key={k.label} className="rounded-xl">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-slate-500">
                              {k.label}
                            </div>
                            <div className="text-xl font-semibold mt-1">
                              {k.value}
                            </div>
                          </div>
                          <k.icon className="h-5 w-5 text-slate-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* BODY: Left Queue + Right Plan */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  {/* LEFT: At-Risk Queue */}
                  <div className="lg:col-span-4">
                    <Card className="rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">At-Risk Queue</CardTitle>
                        <p className="text-sm text-slate-500">
                          Prioritized list of customers needing attention.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Input
                          placeholder="Search accounts…"
                          className="mb-2"
                        />
                        <div className="space-y-3">
                          {atRiskQueue.map((a) => (
                            <button
                              key={a.id}
                              onClick={() => setSelectedId(a.id)}
                              className={`w-full text-left rounded-lg border p-3 hover:bg-slate-50 transition ${
                                selectedId === a.id
                                  ? "border-red-300 bg-red-50/40"
                                  : "border-slate-200"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium">{a.name}</div>
                                  <div className="text-xs text-slate-600">
                                    {a.arr}
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {a.tags.map((t) => (
                                      <Badge
                                        key={t}
                                        variant="secondary"
                                        className="bg-slate-100"
                                      >
                                        {t}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="ml-3 text-right">
                                  <div className="text-xs text-slate-500">
                                    Score
                                  </div>
                                  <div
                                    className={`mt-1 inline-flex items-center rounded px-2 py-0.5 text-sm font-semibold border ${levelBadge(
                                      a.level
                                    )}`}
                                  >
                                    {a.score}/100
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* RIGHT: Selected Account Plan */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Account header + narrative */}
                    <Card className="rounded-xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">
                                {selected.name} – {selected.score}/100
                              </CardTitle>
                              <Badge className={levelBadge(selected.level)}>
                                {selected.level.toUpperCase()} RISK
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">
                              Churn risk is primarily driven by a usage drop and
                              negative sentiment, compounded by two recent
                              unresolved high-priority support tickets and the
                              departure of the key champion.
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Suggest a Playbook
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* GET-WELL PLAN TASKS */}
                    <Card className="rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          Get-Well Plan
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tasks.map((t) => (
                          <div
                            key={t.id}
                            className="rounded-lg border p-3 bg-white"
                          >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <Checkbox />
                                <div>
                                  <div className="font-medium">{t.title}</div>
                                  <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <div className="inline-flex items-center gap-1 text-sm text-slate-600">
                                      <User className="h-4 w-4" />
                                      <Select
                                        value={t.owner}
                                        onValueChange={(v) =>
                                          setTaskField(t.id, "owner", v)
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-[140px]">
                                          <SelectValue placeholder="Owner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Sarah Chen">
                                            Sarah Chen
                                          </SelectItem>
                                          <SelectItem value="David Miller">
                                            David Miller
                                          </SelectItem>
                                          <SelectItem value="Emma Davis">
                                            Emma Davis
                                          </SelectItem>
                                          <SelectItem value="Unassigned">
                                            Unassigned
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="inline-flex items-center gap-1 text-sm text-slate-600">
                                      <Calendar className="h-4 w-4" />
                                      <Input
                                        type="date"
                                        value={t.due || ""}
                                        onChange={(e) =>
                                          setTaskField(
                                            t.id,
                                            "due",
                                            e.target.value
                                          )
                                        }
                                        className="h-8 w-[150px]"
                                      />
                                    </div>

                                    <Select
                                      value={t.status}
                                      onValueChange={(v) =>
                                        setTaskField(
                                          t.id,
                                          "status",
                                          v as TaskRow["status"]
                                        )
                                      }
                                    >
                                      <SelectTrigger className="h-8 w-[140px]">
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="To-Do">
                                          To-Do
                                        </SelectItem>
                                        <SelectItem value="In Progress">
                                          In Progress
                                        </SelectItem>
                                        <SelectItem value="Blocked">
                                          Blocked
                                        </SelectItem>
                                        <SelectItem value="Done">
                                          Complete
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2">
                          <Button
                            variant="secondary"
                            onClick={addTask}
                            className="w-full md:w-auto"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Task
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* HEALTH FACTORS + NEGATIVE EVENTS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Health Score Factors */}
                      <Card className="rounded-xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Health Score Factors
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {healthFactors.map((h) => (
                            <div key={h.label}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-slate-700">
                                  {h.label}
                                </span>
                                <span className="text-slate-500">
                                  {h.value}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-200">
                                <div
                                  className={`h-2 rounded-full ${
                                    h.value >= 70
                                      ? "bg-green-600"
                                      : h.value >= 40
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${h.value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Timeline of Negative Events */}
                      <Card className="rounded-xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            Timeline of Negative Events
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {negativeEvents.map((e, i) => (
                            <div
                              key={`${e.title}-${i}`}
                              className="flex items-start gap-3"
                            >
                              <div className="mt-1">
                                <span className="block h-2 w-2 rounded-full bg-red-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-red-900">
                                  {e.title}
                                </div>
                                <div className="text-xs text-slate-600">
                                  {e.date}
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
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

export default GetWellPlansDashboard;
