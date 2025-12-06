import React from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Workflow,
  BarChart3,
  Users,
  Clock3,
  CheckCircle2,
  Activity,
  ChevronRight,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * L1 Support (Frontline) — matches the provided UI.
 *
 * BACKEND NOTES (wire these later):
 * - GET /api/support/metrics?tier=L1&range=7d → { activeTickets, aiResolutionRate, avgResponseMins, fcr }
 * - GET /api/support/features → usage stats per capability (chatbot, workflows, portal, analytics)
 * - GET /api/support/tickets?tier=L1&limit=20&status=open → queue items + priority
 * - GET /api/support/automation/by-category → [{category, percent}]
 *
 * Integrations & data pipeline (from Docs / Epic 1):
 * - OAuth connections to ZenDesk/DevRev/FreshDesk/ServiceNow:
 *   POST /api/integrations/{vendor}/connect
 *   GET  /api/integrations/status  (for connection health)
 *   WS/SSE channel for real-time ticket updates every ≤ 5 minutes (US-TSS-004).
 */

type Ticket = {
  id: string;
  title: string;
  account: string;
  ago: string;
  priority: "High" | "Medium" | "Low";
};

const queue: Ticket[] = [
  {
    id: "TK-001",
    title: "Login issues",
    account: "Acme Corp",
    ago: "5m ago",
    priority: "High",
  },
  {
    id: "TK-002",
    title: "Password reset",
    account: "TechStart Inc",
    ago: "12m ago",
    priority: "Low",
  },
  {
    id: "TK-003",
    title: "Feature question",
    account: "Global Solutions",
    ago: "18m ago",
    priority: "Medium",
  },
  {
    id: "TK-004",
    title: "Billing inquiry",
    account: "DataCorp",
    ago: "25m ago",
    priority: "Medium",
  },
];

const automationByCategory: { category: string; percent: number }[] = [
  { category: "Password Resets", percent: 95 },
  { category: "Account Questions", percent: 78 },
  { category: "Feature Requests", percent: 45 },
  { category: "Billing Issues", percent: 60 },
];

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 grid place-items-center rounded-lg bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-slate-500 text-xs">{label}</div>
          <div className="text-xl font-semibold text-slate-900">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  stat,
  badge = "Active",
  to,
}: {
  icon: React.ComponentType<any>;
  title: string;
  desc: string;
  stat: string;
  badge?: string;
  to?: string;
}) {
  const Wrapper = to ? Link : "div";
  const wrapperProps = to ? { to } : {};

  return (
    <Card className="rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 grid place-items-center rounded-lg bg-indigo-100 text-indigo-700">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">{title}</div>
              <div className="text-sm text-slate-600">{desc}</div>
              <div className="mt-2 inline-flex items-center rounded-full bg-slate-100 text-slate-800 px-2.5 py-0.5 text-xs">
                {stat}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-2.5 py-0.5 text-xs">
              {badge}
            </span>
            {to && (
              <Button
                asChild
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-slate-100"
              >
                <Wrapper
                  {...(wrapperProps as any)}
                  aria-label={`Open ${title}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Wrapper>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketRow({ t }: { t: Ticket }) {
  const dot =
    t.priority === "High"
      ? "bg-rose-500"
      : t.priority === "Medium"
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className="flex items-center justify-between py-3 px-3 border-b last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <div className="font-medium text-slate-900 shrink-0">{t.id}</div>
        <div className="truncate text-slate-700">{t.title}</div>
        <span className="text-xs text-slate-500 shrink-0">{t.account}</span>
        <span className="text-xs text-slate-400 shrink-0">{t.ago}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs rounded-full px-2.5 py-0.5 ${
            t.priority === "High"
              ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
              : t.priority === "Medium"
              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          }`}
        >
          {t.priority}
        </span>
        <Button asChild size="sm" variant="ghost" className="h-8">
          <Link to={`/support/ticket/${t.id}`}>View</Link>
        </Button>
      </div>
    </div>
  );
}

function BarRow({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-700">{label}</span>
        <span className="text-xs text-slate-500">{percent}% automated</span>
      </div>
      <div className="h-2 rounded bg-slate-100">
        <div
          className="h-2 rounded bg-slate-900"
          style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export function SupportL1() {
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
              <h1 className="text-lg font-semibold">L1 Support (Frontline)</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Center */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* KPI strip */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {/* NOTE (backend): Replace with /api/support/metrics?tier=L1 */}
                  <StatCard label="Active Tickets" value="87" icon={Activity} />
                  <StatCard label="AI Resolution Rate" value="87%" icon={Bot} />
                  <StatCard
                    label="Avg Response Time"
                    value="2.3min"
                    icon={Clock3}
                  />
                  <StatCard
                    label="First Contact Resolution"
                    value="76%"
                    icon={CheckCircle2}
                  />
                </section>

                {/* L1 Support Features (2x2) */}
                <h3 className="text-lg font-semibold mb-3">
                  L1 Support Features
                </h3>
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <FeatureCard
                    icon={Bot}
                    title="AI-Powered Chatbot"
                    desc="Instant answers using knowledge base and past ticket data"
                    stat="87% resolution rate"
                    to="/support/automation" // links to the Automation feature page you already routed
                  />
                  <FeatureCard
                    icon={Users}
                    title="Self-Service Portal"
                    desc="Customer portal for ticket submission and tracking"
                    stat="2,341 monthly users"
                    to="/support/knowledge"
                  />
                  <FeatureCard
                    icon={Workflow}
                    title="Automated Workflows"
                    desc="Predefined responses and decision trees for common queries"
                    stat="65% auto-handled"
                    to="/support/automation"
                  />
                  <FeatureCard
                    icon={BarChart3}
                    title="Basic Analytics"
                    desc="Dashboards for ticket volume and response times"
                    stat="Real-time tracking"
                    to="/support/analytics"
                  />
                </section>

                {/* Current Ticket Queue */}
                <h3 className="text-lg font-semibold mb-3">
                  Current Ticket Queue
                </h3>
                <Card className="rounded-xl mb-8">
                  <CardContent className="p-0">
                    {/* NOTE (backend): stream queue via SSE/WS; filter by tier=L1 and status=open */}
                    {queue.map((t) => (
                      <TicketRow key={t.id} t={t} />
                    ))}
                  </CardContent>
                </Card>

                {/* Automation Performance by Category */}
                <h3 className="text-lg font-semibold mb-3">
                  Automation Performance by Category
                </h3>
                <Card className="rounded-xl">
                  <CardContent className="p-5 space-y-5">
                    {/* NOTE (backend): /api/support/automation/by-category?tier=L1 */}
                    {automationByCategory.map((row) => (
                      <BarRow
                        key={row.category}
                        label={row.category}
                        percent={row.percent}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* Right rail */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
