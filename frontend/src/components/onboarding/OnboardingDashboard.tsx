// src/components/onboarding/OnboardingDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  PlayCircle,
  BookOpen,
  Gauge,
  Target,
  TrendingUp,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/* ========================== MOCK DATA (replace via API) ========================== */
/** TODO[backend]:
 *  - GET /api/onboarding/metrics          -> active, ttv, success, atRisk + deltas
 *  - GET /api/onboarding/playbooks        -> list of template cards
 *  - GET /api/onboarding/projects/active  -> list with status, progress, eta
 *  - GET /api/onboarding/performance      -> avgCompletion, csat, adoption
 *  - GET /api/onboarding/trends           -> tiles for trend bar
 *  - All endpoints should be scoped by tenant/org and current user’s role
 */
const kpi = {
  active: { value: 12, delta: "+2 this week" },
  ttv: { value: "18 days", delta: "↓ 3 days improved" },
  success: { value: "94%", delta: "↑ 4% this quarter" },
  atRisk: { value: 3, delta: "Needs attention" },
};

const playbooks = [
  {
    id: "enterprise",
    title: "Enterprise Customer Onboarding",
    desc: "Comprehensive 30-day onboarding for enterprise clients",
    tasks: 24,
    duration: "4–6 weeks",
    tag: "Enterprise",
    color: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-100",
    icon: BookOpen,
  },
  {
    id: "smb",
    title: "SMB Quick Start",
    desc: "Streamlined 14-day onboarding for small-medium businesses",
    tasks: 12,
    duration: "2 weeks",
    tag: "SMB",
    color: "from-green-500 to-lime-500",
    iconBg: "bg-green-100",
    icon: BookOpen,
  },
  {
    id: "tech",
    title: "Tech Integration Focus",
    desc: "API and technical integration specialized onboarding",
    tasks: 18,
    duration: "3–4 weeks",
    tag: "Technical",
    color: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-100",
    icon: BookOpen,
  },
];

const activeProjects = [
  {
    id: 1,
    name: "Gamma Inc.",
    owner: "Samantha Carter",
    phase: "Configuration & Setup",
    progress: 65,
    status: "On Track",
    daysLeft: 8,
  },
  {
    id: 2,
    name: "Global Tech Inc.",
    owner: "Maria Rodriguez",
    phase: "Training & Adoption",
    progress: 45,
    status: "Needs Attention",
    daysLeft: 12,
  },
  {
    id: 3,
    name: "Stellar Solutions",
    owner: "David Chen",
    phase: "Final Review",
    progress: 85,
    status: "Ahead of Schedule",
    daysLeft: 3,
  },
];

const performance = {
  avgCompletionDays: 22,
  csat: 4.8, // out of 5
  adoption: 87, // %
};

const trends = {
  completionRateTrend: "+12%",
  avgDays: 18,
  csat: "4.8/5.0",
  atRiskAccounts: 3,
};

/* ================================ PAGE ================================== */
export function OnboardingDashboard() {
  const navigate = useNavigate();

  const statusBadge = (status: string) => {
    if (status === "On Track")
      return <Badge className="bg-neutral-900 text-white">{status}</Badge>;
    if (status === "Ahead of Schedule")
      return <Badge variant="outline">{status}</Badge>;
    return <Badge className="bg-red-500/90">{status}</Badge>;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* LEFT NAV */}
        <AppSidebar />

        {/* CENTER + RIGHT RAIL */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR / BREADCRUMB */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Onboarding</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-8 font-['Poppins']">
                {/* ===================== HERO / HEADER ===================== */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h2 className="text-3xl font-bold">
                        Customer Onboarding Hub
                      </h2>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => navigate("/onboarding/current")}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Current Onboarding Projects
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                      onClick={() => navigate("/onboarding/new")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Onboarding Project
                    </Button>
                  </div>
                </div>

                {/* ===================== KPI STRIP ===================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                  {/* Active */}
                  <Card className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                          Active Onboardings
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-gray-900">
                        {kpi.active.value}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        ↑ {kpi.active.delta.replace("+", "")}
                      </div>
                    </CardContent>
                  </Card>

                  {/* TTV */}
                  <Card className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                          Avg. Time to Value
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-sky-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-gray-900">
                        {kpi.ttv.value}
                      </div>
                      <div className="text-xs text-sky-600 mt-1">
                        ↓ {kpi.ttv.delta.replace("↓ ", "")}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Success */}
                  <Card className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                          Success Rate
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-fuchsia-100 flex items-center justify-center">
                          <Target className="w-5 h-5 text-fuchsia-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-gray-900">
                        {kpi.success.value}
                      </div>
                      <div className="text-xs text-fuchsia-600 mt-1">
                        {kpi.success.delta}
                      </div>
                    </CardContent>
                  </Card>

                  {/* At Risk */}
                  <Card className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">At Risk</span>
                        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-gray-900">
                        {kpi.atRisk.value}
                      </div>
                      <div className="text-xs text-amber-600 mt-1">
                        {kpi.atRisk.delta}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ===================== PLAYBOOKS ===================== */}
                <Card className="mt-7">
                  <CardHeader className="pb-3 flex-row items-center justify-between">
                    <CardTitle className="text-xl">
                      Onboarding Playbooks & Templates
                    </CardTitle>
                    <Button
                      className="bg-neutral-900 hover:bg-black"
                      onClick={() => navigate("/onboarding/playbooks")}
                    >
                      + Create Playbook
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {playbooks.map((p) => (
                        <Card
                          key={p.id}
                          className="border hover:shadow-md transition"
                        >
                          <CardContent className="p-5 space-y-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg ${p.iconBg} flex items-center justify-center`}
                              >
                                <p.icon className="w-5 h-5 text-gray-700" />
                              </div>
                              <div className="font-semibold">{p.title}</div>
                            </div>
                            <p className="text-sm text-gray-600">{p.desc}</p>
                            <div className="text-xs text-gray-500">
                              {p.tasks} tasks • {p.duration}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{p.tag}</Badge>
                              <Button
                                variant="ghost"
                                className="text-gray-700"
                                onClick={() =>
                                  navigate(`/onboarding/playbooks/${p.id}`)
                                }
                              >
                                Open →
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ===================== PROJECTS + INSIGHTS ===================== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-7">
                  {/* Active Projects (2 cols) */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-3 flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <PlayCircle className="w-5 h-5" />
                        Active Onboarding Projects
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/onboarding/projects")}
                      >
                        View All
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activeProjects.map((p) => (
                        <div
                          key={p.id}
                          className="border rounded-lg p-4 bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                  {p.name[0]}
                                </div>
                                <div className="font-semibold">{p.name}</div>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                Phase: {p.phase}
                              </div>
                            </div>
                            <div className="text-right">
                              {statusBadge(p.status)}
                              <div className="text-xs text-gray-600 mt-1">
                                {p.daysLeft} days left
                              </div>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{p.progress}%</span>
                            </div>
                            <Progress value={p.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Performance Insights (right column) */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-emerald-700" />
                        Performance Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Average Completion Time</span>
                          <span className="font-medium">
                            {performance.avgCompletionDays} days
                          </span>
                        </div>
                        <Progress
                          value={(22 / 30) * 100}
                          className="h-2 mt-1"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Customer Satisfaction</span>
                          <span className="font-medium">
                            {performance.csat}/5
                          </span>
                        </div>
                        <Progress
                          value={(4.8 / 5) * 100}
                          className="h-2 mt-1"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Feature Adoption Rate</span>
                          <span className="font-medium">
                            {performance.adoption}%
                          </span>
                        </div>
                        <Progress
                          value={performance.adoption}
                          className="h-2 mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ===================== TRENDS ===================== */}
                <Card className="mt-7">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      Onboarding Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="rounded-lg p-4 bg-green-50 border border-green-100">
                        <div className="text-sm text-gray-700">
                          Completion Rate Trend
                        </div>
                        <div className="text-lg font-bold text-green-700">
                          {trends.completionRateTrend}
                        </div>
                      </div>
                      <div className="rounded-lg p-4 bg-indigo-50/60 border">
                        <div className="text-sm text-gray-700">
                          Average Days to Complete
                        </div>
                        <div className="text-3xl font-extrabold text-indigo-700 leading-none">
                          {trends.avgDays}
                        </div>
                        <div className="text-xs text-indigo-700 mt-1">days</div>
                      </div>
                      <div className="rounded-lg p-4 bg-fuchsia-50/70 border">
                        <div className="text-sm text-gray-700">
                          Customer Satisfaction
                        </div>
                        <div className="text-lg font-bold text-fuchsia-700">
                          {trends.csat}
                        </div>
                      </div>
                      <div className="rounded-lg p-4 bg-amber-50 border border-amber-100">
                        <div className="text-sm text-gray-700">
                          At Risk Accounts
                        </div>
                        <div className="text-lg font-bold text-amber-700">
                          {trends.atRiskAccounts} accounts
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* RIGHT RAIL (kept for consistency across app) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
