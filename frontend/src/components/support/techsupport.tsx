import React from "react";
import { Link } from "react-router-dom";
import {
  Headphones,
  MessageSquare,
  Bot,
  Search,
  Clock3,
  BarChart3,
  ShieldCheck,
  Settings,
  ArrowRight,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/** ---------------- Technical Support Hub ----------------
 * UI shell matches the rest (sidebar + content + right rail).
 * NOTE (backend):
 * - Replace hard-coded KPIs with GET /api/support/metrics?range=30d
 *   { activeTickets, avgResponseMins, resolutionRate, csat, deltas: {...} }
 * - Consider WS/SSE channel for live ticket count updates.
 * - Guard sub-routes by role/permission (L1 vs L2).
 */
export function TechSupport() {
  type KPI = { label: string; value: string; delta: string };
  const kpis: KPI[] = [
    { label: "Active Tickets", value: "234", delta: "-12%" },
    { label: "Avg Response Time", value: "4.2min", delta: "-23%" },
    { label: "Resolution Rate", value: "94.3%", delta: "+5.2%" },
    { label: "Customer Satisfaction", value: "4.8/5", delta: "+0.3" },
  ];

  const deltaChip = (delta: string) => {
    const up = delta.trim().startsWith("+");
    const down = delta.trim().startsWith("-");
    const base =
      "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium";
    if (up)
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100`;
    if (down) return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-100`;
    return `${base} bg-slate-100 text-slate-800`;
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
              <h1 className="text-lg font-semibold">Technical Support Hub</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* Title + subtitle */}
                <div className="mb-6">
                  <h2 className="text-[28px] leading-8 font-semibold tracking-tight">
                    Technical Support Hub
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Comprehensive L1 and L2 support platform with AI-powered
                    automation and omnichannel capabilities
                  </p>
                </div>

                {/* KPI cards */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {kpis.map((kpi) => (
                    <Card key={kpi.label} className="rounded-xl">
                      <CardContent className="p-4">
                        <div className="text-slate-600 text-sm">
                          {kpi.label}
                        </div>
                        <div className="mt-1 text-2xl font-semibold text-slate-900">
                          {kpi.value}
                        </div>
                        <span className={deltaChip(kpi.delta)}>
                          {kpi.delta}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Support tiers */}
                <h3 className="text-lg font-semibold mb-3">Support Tiers</h3>
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* L1 */}
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-9 w-9 grid place-items-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <span>L1 Support (Frontline)</span>
                        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 px-2.5 py-0.5 text-xs">
                          L1
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <p className="text-sm text-slate-600">
                        First-line support handling common queries and basic
                        troubleshooting
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "AI Chatbot",
                          "Self-Service Portal",
                          "Automated Workflows",
                          "Basic Analytics",
                        ].map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-xs font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {/* NOTE (backend): route guard for tier access by role */}
                      <div className="pt-1">
                        <Button
                          asChild
                          className="w-full bg-slate-900 hover:bg-slate-800"
                        >
                          <Link to="/support/l1">
                            Access L1 Support (Frontline)
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* L2 */}
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <div className="h-9 w-9 grid place-items-center rounded-lg bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                          <Settings className="h-5 w-5" />
                        </div>
                        <span>L2 Support (Specialist)</span>
                        <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 px-2.5 py-0.5 text-xs">
                          L2
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <p className="text-sm text-slate-600">
                        Advanced technical support for complex issues and
                        escalations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Root Cause Analysis",
                          "Engineering Integration",
                          "Session Replay",
                          "Advanced Collaboration",
                        ].map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-xs font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {/* NOTE (backend): attach runbook links per category and SLO timers */}
                      <div className="pt-1">
                        <Button
                          asChild
                          className="w-full bg-slate-900 hover:bg-slate-800"
                        >
                          <Link to="/support/l2">
                            Access L2 Support (Specialist)
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Core features */}
                <h3 className="text-lg font-semibold mb-3">Core Features</h3>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      key: "omnichannel",
                      title: "Omnichannel Inbox",
                      desc: "Unified support across Slack, Teams, email, and chat widgets",
                      stat: "98% channel coverage",
                      icon: Headphones,
                      to: "/support/omnichannel",
                      // NOTE (backend): aggregate channel stats from /api/support/channels/coverage
                    },
                    {
                      key: "automation",
                      title: "AI-Powered Automation",
                      desc: "Intelligent ticket routing, classification, and auto-resolution",
                      stat: "65% auto-resolution rate",
                      icon: Bot,
                      to: "/support/automation",
                      // NOTE (backend): store routing rules & model versions; emit metrics to /api/support/automation/metrics
                    },
                    {
                      key: "knowledge",
                      title: "Knowledge Management",
                      desc: "Searchable knowledge base with AI-powered article suggestions",
                      stat: "2.3s avg search time",
                      icon: Search,
                      to: "/support/knowledge",
                      // NOTE (backend): index KB in vector store; log query latency and CTR
                    },
                    {
                      key: "sla",
                      title: "SLA Management",
                      desc: "Automated escalation and SLA tracking with real-time alerts",
                      stat: "99.2% SLA compliance",
                      icon: Clock3,
                      to: "/support/sla",
                      // NOTE (backend): compute SLA per ticket class; push breaches to PagerDuty/Slack
                    },
                    {
                      key: "analytics",
                      title: "Analytics & Reporting",
                      desc: "Comprehensive dashboards for support performance insights",
                      stat: "Real-time insights",
                      icon: BarChart3,
                      to: "/support/analytics",
                      // NOTE (backend): build warehouse view; expose TSVB-style timeseries endpoint
                    },
                    {
                      key: "security",
                      title: "Security & Compliance",
                      desc: "Role-based access with SOC 2, GDPR, and HIPAA compliance",
                      stat: "100% compliant",
                      icon: ShieldCheck,
                      to: "/support/security",
                      // NOTE (backend): gate with RBAC/ABAC; audit log to /api/audit
                    },
                  ].map(({ key, title, desc, stat, icon: Icon, to }) => (
                    <Card key={key} className="rounded-xl">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 grid place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xl font-semibold text-slate-900">
                              {title}
                            </div>
                            <p className="mt-1 text-slate-600">{desc}</p>
                            <div className="mt-4 flex items-center justify-between">
                              <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-xs font-medium">
                                {stat}
                              </span>
                              <Button
                                asChild
                                variant="ghost"
                                className="h-9 w-9 p-0 rounded-full hover:bg-slate-100"
                              >
                                <Link to={to} aria-label={`Open ${title}`}>
                                  <ArrowRight className="h-5 w-5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Quick Actions (bottom row like the mock) */}
                <h3 className="text-lg font-semibold mt-8 mb-3">
                  Quick Actions
                </h3>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {[
                    { title: "View Ticket Queue", to: "/support/queue" },
                    { title: "Manage Escalations", to: "/support/escalations" },
                    { title: "Support Settings", to: "/support/settings" },
                  ].map((qa) => (
                    <Card key={qa.title} className="rounded-xl">
                      <CardContent className="p-4">
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-between"
                        >
                          <Link to={qa.to}>
                            {qa.title}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </section>
              </div>
            </main>

            {/* RIGHT RAIL (unchanged) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default TechSupport;
