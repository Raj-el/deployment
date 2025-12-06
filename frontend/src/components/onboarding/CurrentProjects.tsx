import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Search,
  Calendar,
  Users,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  FileText,
} from "lucide-react";

/* ------------------------------ Mock Data ------------------------------ */
// In production, fetch these via your API.
// TODO: replace all mock data with real API calls (use SWR/React Query or your data layer)
type Health = "on-track" | "at-risk" | "delayed";
type ActivityType = "call" | "email" | "milestone" | "issue" | "note";

const customers = [
  {
    id: "gamma",
    name: "Gamma Inc.",
    contact: "Samantha Carter",
    email: "samantha@gammainc.com",
  },
  {
    id: "global",
    name: "Global Tech Inc.",
    contact: "Maria Rodriguez",
    email: "maria@globaltech.com",
  },
  {
    id: "stellar",
    name: "Stellar Solutions",
    contact: "David Chen",
    email: "dchen@stellarsol.com",
  },
];

const projectByCustomer: Record<
  string,
  {
    phase: string;
    daysRemaining: number;
    progress: number;
    health: Health;
    phases: Array<{ name: string; percent: number }>;
    nextMilestone: string;
    startDate: string;
  }
> = {
  gamma: {
    phase: "Configuration & Setup",
    daysRemaining: 8,
    progress: 65,
    health: "on-track",
    phases: [
      { name: "Pre-Kickoff", percent: 100 },
      { name: "Discovery & Planning", percent: 90 },
      { name: "Implementation", percent: 55 },
      { name: "Training & Adoption", percent: 15 },
    ],
    nextMilestone: "Admin training scheduled",
    startDate: "2025-10-12",
  },
  global: {
    phase: "Training & Adoption",
    daysRemaining: 12,
    progress: 45,
    health: "at-risk",
    phases: [
      { name: "Pre-Kickoff", percent: 100 },
      { name: "Discovery & Planning", percent: 100 },
      { name: "Implementation", percent: 40 },
      { name: "Training & Adoption", percent: 10 },
    ],
    nextMilestone: "UAT sign-off",
    startDate: "2025-09-28",
  },
  stellar: {
    phase: "Final Review",
    daysRemaining: 3,
    progress: 85,
    health: "on-track",
    phases: [
      { name: "Pre-Kickoff", percent: 100 },
      { name: "Discovery & Planning", percent: 100 },
      { name: "Implementation", percent: 90 },
      { name: "Training & Adoption", percent: 50 },
    ],
    nextMilestone: "Go-live readiness",
    startDate: "2025-10-05",
  },
};

const activities: Record<
  string,
  Array<{
    id: string;
    type: ActivityType;
    title: string;
    desc?: string;
    customer: string;
    ts: string; // ISO
  }>
> = {
  gamma: [
    {
      id: "a1",
      type: "call",
      title: "Kickoff call completed",
      desc: "Defined scope & success metrics",
      customer: "Gamma Inc.",
      ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "a2",
      type: "milestone",
      title: "API configuration in progress",
      desc: "Sandbox keys provisioned",
      customer: "Gamma Inc.",
      ts: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "a3",
      type: "email",
      title: "Training materials sent",
      desc: "Week-1 curriculum & deck",
      customer: "Gamma Inc.",
      ts: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ],
  global: [
    {
      id: "b1",
      type: "issue",
      title: "SAML SSO misconfiguration",
      desc: "IdP metadata mismatch",
      customer: "Global Tech Inc.",
      ts: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
  ],
  stellar: [
    {
      id: "c1",
      type: "milestone",
      title: "Data migration complete",
      desc: "1.2M records verified",
      customer: "Stellar Solutions",
      ts: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

/* --------------------------- Utility Components --------------------------- */
const HealthBadge: React.FC<{ health: Health }> = ({ health }) => {
  const map: Record<Health, { label: string; className: string }> = {
    "on-track": { label: "On Track", className: "bg-green-100 text-green-800" },
    "at-risk": {
      label: "Needs Attention",
      className: "bg-red-100 text-red-800",
    },
    delayed: { label: "Delayed", className: "bg-yellow-100 text-yellow-800" },
  };
  return <Badge className={map[health].className}>{map[health].label}</Badge>;
};

const ActivityIcon: React.FC<{ type: ActivityType; className?: string }> = ({
  type,
  className,
}) => {
  switch (type) {
    case "call":
      return <Phone className={className} />;
    case "email":
      return <Mail className={className} />;
    case "milestone":
      return <CheckCircle2 className={className} />;
    case "issue":
      return <AlertTriangle className={className} />;
    default:
      return <FileText className={className} />;
  }
};

function formatWhen(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.round(ms / 3_600_000);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

/* --------------------------------- Page --------------------------------- */
export function CurrentProjects() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>(
    customers[0].id
  );
  const [activityTypeFilter, setActivityTypeFilter] = useState<
    "all" | ActivityType
  >("all");
  const [activitySearch, setActivitySearch] = useState("");

  const customer = useMemo(
    () => customers.find((c) => c.id === selectedCustomer)!,
    [selectedCustomer]
  );
  const proj = projectByCustomer[selectedCustomer];

  const filteredActivities = useMemo(() => {
    const list = activities[selectedCustomer] ?? [];
    return list.filter((a) => {
      const typeOk =
        activityTypeFilter === "all" || a.type === activityTypeFilter;
      const q = activitySearch.trim().toLowerCase();
      const qOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.desc ?? "").toLowerCase().includes(q);
      return typeOk && qOk;
    });
  }, [selectedCustomer, activityTypeFilter, activitySearch]);

  /* ------------------------------- Handlers ------------------------------- */
  const handleScheduleKickoff = () => {
    // TODO: open calendar modal & integrate with calendar API
    console.log("Schedule kickoff for", customer.name);
  };

  const handleUpdateTimeline = () => {
    // TODO: open timeline modal -> patch project timeline via API
    console.log("Update timeline for", customer.name);
  };

  const handleAddTeamMember = () => {
    // TODO: open assign-user modal -> POST /projects/:id/members
    console.log("Add team member for", customer.name);
  };

  const handleSendStatus = () => {
    // TODO: open compose modal -> send email/Slack via notifications service
    console.log("Send status to", customer.email);
  };

  /* -------------------------------- Render -------------------------------- */
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
              <h1 className="text-lg font-semibold">
                Current Onboarding Projects
              </h1>
            </div>
          </header>

          {/* Main area with right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins'] space-y-6">
                {/* Select Customer */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Select Customer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Choose a customer to view their onboarding details
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        value={selectedCustomer}
                        onValueChange={setSelectedCustomer}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Choose customer..." />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Quick search across activities */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={activitySearch}
                          onChange={(e) => setActivitySearch(e.target.value)}
                          placeholder="Search recent activities..."
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Overview */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center">
                          {customer.name[0]}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">
                            {customer.name}
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 text-sm">
                            <div>
                              <p className="text-gray-500">Primary Contact</p>
                              <p className="font-medium">{customer.contact}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Current Phase</p>
                              <p className="font-medium">{proj.phase}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Days Remaining</p>
                              <p className="font-medium">
                                {proj.daysRemaining} days
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <HealthBadge health={proj.health} />
                        <span className="text-sm font-medium text-gray-600">
                          {proj.progress}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress value={proj.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions + Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>Actions for {customer.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleScheduleKickoff}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Kickoff Call
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleAddTeamMember}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Add Team Member
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleUpdateTimeline}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Update Timeline
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleSendStatus}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Status Update
                      </Button>

                      <div className="pt-3 border-t text-sm text-gray-600">
                        Next milestone:{" "}
                        <span className="font-medium">
                          {proj.nextMilestone}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activities */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Activities</CardTitle>
                        <Select
                          value={activityTypeFilter}
                          onValueChange={(v: any) => setActivityTypeFilter(v)}
                        >
                          <SelectTrigger className="w-[160px] h-9">
                            <SelectValue placeholder="Filter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="call">Calls</SelectItem>
                            <SelectItem value="email">Emails</SelectItem>
                            <SelectItem value="milestone">
                              Milestones
                            </SelectItem>
                            <SelectItem value="issue">Issues</SelectItem>
                            <SelectItem value="note">Notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {filteredActivities.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No activities yet.
                        </p>
                      ) : (
                        filteredActivities.map((a) => (
                          <div
                            key={a.id}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition"
                          >
                            <ActivityIcon
                              type={a.type}
                              className="w-4 h-4 mt-1 text-gray-600"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {a.title}
                              </p>
                              {a.desc && (
                                <p className="text-xs text-gray-600">
                                  {a.desc}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {a.customer} • {formatWhen(a.ts)}
                              </p>
                            </div>
                            {/* TODO: onClick -> open a right-panel drawer with full activity detail */}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2"
                            >
                              View
                            </Button>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Phase Breakdown */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Phase Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {proj.phases.map((p) => (
                      <div
                        key={p.name}
                        className="p-4 rounded-lg border bg-white"
                      >
                        <p className="text-sm text-gray-600">{p.name}</p>
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span className="font-medium">{p.percent}%</span>
                          <Badge variant="outline">
                            {p.percent >= 100
                              ? "Done"
                              : p.percent >= 50
                              ? "In Progress"
                              : "Queued"}
                          </Badge>
                        </div>
                        <Progress value={p.percent} className="h-2 mt-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* RIGHT RAIL (contextual tips, data sources, etc.) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
