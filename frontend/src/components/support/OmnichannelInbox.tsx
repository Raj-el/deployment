import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Hash, // Slack-ish
  Mail,
  MessageCircle, // Chat Widget
  Users, // Teams
  Filter,
  Search,
  ArrowRight,
  MapPin,
  Clock3,
  User2,
} from "lucide-react";

/** --------------------------------------------------------------------------
 * Omnichannel Inbox
 * - Unified ticket view across Slack, Email, Chat Widget, Teams
 * - Matches the provided UI (tiles + list + filter/search)
 * - Clear BACKEND notes where real services should connect
 * -------------------------------------------------------------------------- */

type Channel = "Slack" | "Email" | "Chat Widget" | "Teams";
type Priority = "Low" | "Medium" | "High";
type Status = "Open" | "In Progress" | "Waiting" | "Resolved";

type Ticket = {
  id: string;
  channel: Channel;
  priority: Priority;
  status: Status;
  subject: string;
  account: string;
  assignedTo?: string;
  timeAgo: string; // "2 hours ago"
};

const MOCK_TICKETS: Ticket[] = [
  {
    id: "TK-001",
    channel: "Slack",
    priority: "High",
    status: "Open",
    subject: "Login issues with SSO integration",
    account: "Acme Corp",
    assignedTo: "Sarah Chen",
    timeAgo: "2 hours ago",
  },
  {
    id: "TK-002",
    channel: "Email",
    priority: "Medium",
    status: "In Progress",
    subject: "Data export functionality not working",
    account: "TechFlow Inc",
    assignedTo: "Mike Johnson",
    timeAgo: "4 hours ago",
  },
  {
    id: "TK-003",
    channel: "Chat Widget",
    priority: "Low",
    status: "Open",
    subject: "Feature request: Custom dashboard widgets",
    account: "InnovateLab",
    assignedTo: undefined,
    timeAgo: "1 day ago",
  },
];

const CHANNEL_META: Record<
  Channel,
  { icon: React.ElementType; color: string; count: number }
> = {
  // BACKEND: channel counts should come from a “tickets/counts?groupBy=channel” API
  Slack: { icon: Hash, color: "text-slate-800", count: 23 },
  Email: { icon: Mail, color: "text-indigo-600", count: 15 },
  "Chat Widget": { icon: MessageCircle, color: "text-emerald-600", count: 8 },
  Teams: { icon: Users, color: "text-violet-600", count: 4 },
};

const statusTone: Record<Status, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Waiting: "bg-slate-100 text-slate-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

const priorityTone: Record<Priority, string> = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

export function OmnichannelInbox() {
  // UI state
  const [activeChannel, setActiveChannel] = useState<Channel | "All">("All");
  const [query, setQuery] = useState("");

  // BACKEND: replace MOCK_TICKETS with a real unified search endpoint:
  // GET /tickets?channels=[...]&status=[...]&q=...&sort=...
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_TICKETS.filter((t) => {
      const byChannel =
        activeChannel === "All" ? true : t.channel === activeChannel;
      const byText =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.account.toLowerCase().includes(q) ||
        (t.assignedTo ?? "").toLowerCase().includes(q);
      return byChannel && byText;
    });
  }, [activeChannel, query]);

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
              <h1 className="text-lg font-semibold">Omnichannel Inbox</h1>
              <p className="text-xs text-slate-500">
                Unified support inbox across all communication channels
              </p>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* Channel tiles */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {(
                    ["Slack", "Email", "Chat Widget", "Teams"] as Channel[]
                  ).map((ch) => {
                    const meta = CHANNEL_META[ch];
                    const Icon = meta.icon;
                    const active = activeChannel === ch;
                    return (
                      <button
                        key={ch}
                        onClick={() => setActiveChannel(active ? "All" : ch)}
                        className={`text-left rounded-xl border bg-white transition ${
                          active
                            ? "ring-2 ring-slate-900 border-slate-900"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="p-5 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 grid place-items-center rounded-lg bg-slate-100 ${meta.color}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-semibold">{ch}</div>
                              <div className="text-xs text-slate-500">
                                Active tickets
                              </div>
                            </div>
                          </div>
                          <Badge variant="secondary">{meta.count}</Badge>
                        </div>
                      </button>
                    );
                  })}
                </section>

                {/* Active tickets header with filter/search */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">
                      Active Tickets
                    </span>
                    {activeChannel !== "All" && (
                      <Badge variant="outline" className="ml-1">
                        {activeChannel}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Filter button placeholder */}
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>

                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        className="pl-8 w-64"
                        placeholder="Search id, subject, account, assignee…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Ticket list */}
                <section className="space-y-3">
                  {filtered.map((t) => (
                    <Card
                      key={t.id}
                      className="bg-white border-slate-200 hover:border-slate-300 transition"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">{t.id}</Badge>
                              <Badge className={priorityTone[t.priority]}>
                                {t.priority}
                              </Badge>
                              <Badge variant="secondary">{t.channel}</Badge>
                            </div>

                            <div className="mt-2 text-[15px] font-medium text-slate-900">
                              {t.subject}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-5 text-sm text-slate-600">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-slate-400" />
                                {t.account}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-4 w-4 text-slate-400" />
                                {t.timeAgo}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <User2 className="h-4 w-4 text-slate-400" />
                                Assigned to: {t.assignedTo ?? "Unassigned"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                statusTone[t.status]
                              }`}
                            >
                              {t.status}
                            </span>
                            <Button variant="ghost" className="gap-2">
                              Open
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filtered.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center text-slate-500">
                        No tickets match your filters.
                      </CardContent>
                    </Card>
                  )}
                </section>

                {/* BACKEND NOTES:
                    - Channel tiles: counts from aggregation service (e.g., /tickets/counts?groupBy=channel).
                    - Ticket list: unified search API across sources (Zendesk, DevRev, Freshdesk, ServiceNow).
                      Map provider fields into normalized schema (US-TSS-002).
                    - Filter button: open a Drawer with multi-select (channel, status, priority, SLA risk, platform).
                    - “Open” button: navigate to ticket detail route (e.g., /support/tickets/:id) or deep-link to source.
                    - Real-time updates: subscribe via WebSocket/ SSE to “ticket.updated” events (US-TSS-004).
                    - SLA risk badge: compute from policy service (US-TSS-009) and show warning chips at 50/75/90%.
                    - Assignment: action to reassign uses routing service w/ skills & workload (US-TSS-008).
                */}
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

export default OmnichannelInbox;
