import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock3,
  TrendingUp,
  Users2,
  GitBranch,
  Search,
  Link2,
  MessagesSquare,
} from "lucide-react";

/** ------------------------------------------------------------------------
 * L2 Support (Specialist)
 * - Mirrors lovable design and adds actionable buttons
 * - Backend integration notes inline
 * ---------------------------------------------------------------------- */

export function L2Support() {
  // BACKEND: pull aggregated metrics for specialist queue (US-TSS-004/009)
  const kpis = [
    { label: "Active Escalations", value: 23, icon: AlertTriangle },
    { label: "Avg Resolution Time", value: "3.7h", icon: Clock3 },
    { label: "Resolution Rate", value: "89%", icon: TrendingUp },
    { label: "Active Specialists", value: 12, icon: Users2 },
  ];

  const capabilities = [
    {
      title: "Advanced Escalations",
      desc: "Complex issue handling with engineering integration",
      active: 23,
      avg: "4.2 hours",
      icon: AlertTriangle,
    },
    {
      title: "Root Cause Analysis",
      desc: "Session replay and behavioral analysis for troubleshooting",
      active: 12,
      avg: "2.1 hours",
      icon: Search,
    },
    {
      title: "Cross-Team Collaboration",
      desc: "Internal notes and @mentions for team coordination",
      active: 34,
      avg: "1.8 hours",
      icon: MessagesSquare,
    },
    {
      title: "Engineering Integration",
      desc: "Direct linking to Jira, GitHub, and product systems",
      active: 8,
      avg: "6.5 hours",
      icon: GitBranch,
    },
  ];

  const escalations = [
    {
      id: "ESC-001",
      account: "Enterprise Corp",
      title: "API rate limiting causing timeouts",
      escalatedFrom: "L1-TK-445",
      assignedTo: "Sarah Chen",
      priority: "Critical",
      status: "In Progress",
      openFor: "2.3 hours",
    },
    {
      id: "ESC-002",
      account: "TechFlow Systems",
      title: "Database migration failure",
      escalatedFrom: "L1-TK-223",
      assignedTo: "Mike Rodriguez",
      priority: "High",
      status: "Investigating",
      openFor: "45 minutes",
    },
    {
      id: "ESC-003",
      account: "DataSync Inc",
      title: "Custom integration breaking",
      escalatedFrom: "L1-TK-667",
      assignedTo: "Alex Thompson",
      priority: "High",
      status: "Waiting on Engineering",
      openFor: "1.7 hours",
    },
  ];

  const activity = [
    {
      user: "Sarah Chen",
      action: "Added engineering notes to ESC-001",
      ago: "5 min ago",
    },
    {
      user: "Mike Rodriguez",
      action: "Requested product team review on ESC-002",
      ago: "12 min ago",
    },
    {
      user: "Alex Thompson",
      action: "Linked GitHub issue #1247 to ESC-003",
      ago: "18 min ago",
    },
    {
      user: "Product Team",
      action: "Provided workaround for ESC-001",
      ago: "25 min ago",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">L2 Support – Specialist</h1>
              <p className="text-xs text-slate-500">
                Advanced technical support for complex issues and escalations
              </p>
            </div>
          </header>

          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* KPI Cards */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {kpis.map((k) => (
                    <Card key={k.label}>
                      <CardContent className="p-5">
                        <div className="text-sm text-slate-600">{k.label}</div>
                        <div className="mt-1 text-2xl font-semibold">
                          {k.value}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Capabilities */}
                <h3 className="text-lg font-semibold mb-3">
                  L2 Support Capabilities
                </h3>
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {capabilities.map((c) => (
                    <Card key={c.title} className="border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <span className="h-9 w-9 grid place-items-center rounded-lg bg-slate-100 text-slate-700">
                            <c.icon className="h-5 w-5" />
                          </span>
                          {c.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 flex items-center justify-between">
                        <div className="text-sm text-slate-600">{c.desc}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{c.active} active</Badge>
                          <Badge variant="secondary">Avg: {c.avg}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Current Escalations */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Current Escalations</h3>
                  <Button variant="outline" size="sm">
                    Manage Queue
                  </Button>
                </div>
                <section className="space-y-3 mb-10">
                  {escalations.map((e) => (
                    <Card key={e.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-6">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{e.id}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-700">
                                {e.account}
                              </span>
                            </div>
                            <div className="text-sm text-slate-700 mt-1">
                              {e.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Escalated from: {e.escalatedFrom}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Assigned to: {e.assignedTo}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">{e.priority}</Badge>
                              <Badge variant="outline">{e.status}</Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                              Open for: {e.openFor}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                Add Notes
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                              >
                                Collaborate <Link2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Recent Collaboration Activity */}
                <h3 className="text-lg font-semibold mb-3">
                  Recent Collaboration Activity
                </h3>
                <Card>
                  <CardContent className="p-5">
                    <ul className="divide-y divide-slate-200">
                      {activity.map((a, i) => (
                        <li
                          key={i}
                          className="py-3 flex items-center justify-between"
                        >
                          <div className="text-sm">
                            <span className="font-medium">{a.user}</span>{" "}
                            <span className="text-slate-600">{a.action}</span>
                          </div>
                          <div className="text-xs text-slate-500">{a.ago}</div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* BACKEND NOTES:
                  - Capabilities cards should be driven by queue analytics: counts, average time, backlog (US-TSS-007/009).
                  - “Collaborate” opens side panel linking to Jira/GitHub/Slack threads (US-TSS-009 & 010).
                  - “Manage Queue” supports skills/priority routing and manual overrides (US-TSS-008).
                  - Add “SLA threshold” chips on escalations at 50/75/90% (US-TSS-009).
                  - Expose RCA artifacts: replay links, logs, traces (US-TSS-006 root-cause).
                */}
              </div>
            </main>

            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default L2Support;
