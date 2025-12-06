// src/components/projects/LaunchedProject.tsx
import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity as ActivityIcon,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Filter,
  Link as LinkIcon,
  MessageSquare,
  Plus,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

/** ----------------------------------------------------------------
 * PROJECT SWITCHER OPTIONS  (match CurrentProjects page)
 * -----------------------------------------------------------------*/
// BACKEND: GET /projects?status=active  -> [{id,name,client}, ...]
const projectOptions = [
  { id: "acme", label: "Acme Corporation — Enterprise" },
  { id: "tech", label: "TechStart Solutions — SMB" },
  { id: "global", label: "Global Industries — Enterprise" },
];

/** ----------------------------------------------------------------
 * PER-PROJECT MOCK DATA (replace via API responses)
 * Each key (acme/tech/global) holds project details, timeline, etc.
 * -----------------------------------------------------------------*/
// BACKEND: Structure matches:
// GET /projects/:id
// GET /projects/:id/phases?include=tasks
// GET /projects/:id/activities
// GET /projects/:id/risks
// GET /projects/:id/financials
const DATA: Record<
  string,
  {
    details: {
      id: string;
      name: string;
      client: string;
      manager: string;
      status: "On Track" | "At Risk" | "Delayed";
      healthScore: number;
      healthFactors: { label: string; score: number }[];
      phaseProgress: { phase: string; pct: number }[];
      daysRemaining: number;
      completionPct: number;
      nextMilestone: string;
    };
    timeline: {
      id: string;
      title: string;
      start: string;
      end: string;
      tasks: {
        id: string;
        title: string;
        duration: string;
        owner: string;
        done: boolean;
        dependsOn: string[];
      }[];
    }[];
    activities: {
      id: string;
      type: "call" | "integration" | "training" | "note";
      title: string;
      by: string;
      when: string;
      notes?: string;
    }[];
    risks: {
      id: string;
      title: string;
      category: "Technical" | "Resource" | "Financial" | "Compliance";
      impact: "High" | "Medium" | "Low";
      probability: "High" | "Medium" | "Low";
      status: "Active" | "Mitigated" | "Accepted";
      owner: string;
      customer: string;
      playbook: string;
    }[];
    approvals: {
      id: string;
      riskId: string;
      approver: string;
      owner: string;
      date: string;
      status: "Approved" | "Pending";
    }[];
    financials: {
      kpis: {
        totalProjects: number;
        revenue: string;
        onTime: string;
        utilization: string;
      };
      summary: {
        quoted: number;
        actual: number;
        profitMargin: number;
        variance: number;
      };
      billing: { collected: number; pending: number; overdue: number };
      phases: { name: string; cost: number }[];
    };
  }
> = {
  acme: {
    details: {
      id: "acme",
      name: "Acme Corporation — Enterprise Onboarding",
      client: "Acme Corporation",
      manager: "Sarah Johnson",
      status: "On Track",
      healthScore: 88,
      healthFactors: [
        { label: "Timeline", score: 90 },
        { label: "Risks", score: 82 },
        { label: "Resources", score: 86 },
        { label: "Satisfaction", score: 93 },
      ],
      phaseProgress: [
        { phase: "Pre-Kickoff", pct: 100 },
        { phase: "Discovery & Planning", pct: 90 },
        { phase: "Implementation", pct: 70 },
        { phase: "Training & Adoption", pct: 40 },
      ],
      daysRemaining: 12,
      completionPct: 75,
      nextMilestone: "Data Migration Complete",
    },
    timeline: [
      {
        id: "p1",
        title: "Pre-Kickoff",
        start: "2025-01-02",
        end: "2025-01-07",
        tasks: [
          {
            id: "t1",
            title: "CRM Data Import",
            duration: "30m",
            owner: "Mike",
            done: true,
            dependsOn: [],
          },
          {
            id: "t2",
            title: "Portal Setup",
            duration: "10m",
            owner: "Emma",
            done: true,
            dependsOn: [],
          },
        ],
      },
      {
        id: "p2",
        title: "Discovery & Planning",
        start: "2025-01-08",
        end: "2025-01-17",
        tasks: [
          {
            id: "t3",
            title: "Stakeholder Identification",
            duration: "30m",
            owner: "Alex",
            done: true,
            dependsOn: ["t2"],
          },
          {
            id: "t4",
            title: "Success Criteria",
            duration: "45m",
            owner: "Sarah",
            done: true,
            dependsOn: ["t3"],
          },
          {
            id: "t5",
            title: "Technical Requirements Review",
            duration: "60m",
            owner: "Mike",
            done: false,
            dependsOn: ["t3"],
          },
        ],
      },
      {
        id: "p3",
        title: "Implementation",
        start: "2025-01-18",
        end: "2025-02-10",
        tasks: [
          {
            id: "t6",
            title: "System Configuration",
            duration: "2–3h",
            owner: "Mike",
            done: false,
            dependsOn: ["t5"],
          },
          {
            id: "t7",
            title: "Data Migration",
            duration: "1–2d",
            owner: "Emma",
            done: false,
            dependsOn: ["t6"],
          },
          {
            id: "t8",
            title: "Integration Testing",
            duration: "3–4h",
            owner: "Alex",
            done: false,
            dependsOn: ["t7"],
          },
        ],
      },
      {
        id: "p4",
        title: "Training & Adoption",
        start: "2025-02-11",
        end: "2025-02-22",
        tasks: [
          {
            id: "t9",
            title: "Admin Training",
            duration: "90m",
            owner: "Emma",
            done: false,
            dependsOn: ["t8"],
          },
          {
            id: "t10",
            title: "End-User Training",
            duration: "60m",
            owner: "Emma",
            done: false,
            dependsOn: ["t9"],
          },
          {
            id: "t11",
            title: "Feature Adoption Tracking",
            duration: "ongoing",
            owner: "Sarah",
            done: false,
            dependsOn: ["t10"],
          },
        ],
      },
    ],
    activities: [
      {
        id: "a1",
        type: "call",
        title: "Kickoff call completed",
        by: "Sarah",
        when: "2h ago",
        notes: "Aligned on scope & timeline.",
      },
      {
        id: "a2",
        type: "integration",
        title: "API config in progress",
        by: "Mike",
        when: "1d ago",
        notes: "Keys provisioned.",
      },
      {
        id: "a3",
        type: "training",
        title: "Training materials sent",
        by: "Emma",
        when: "2d ago",
        notes: "Slides + walkthrough.",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "API Integration Complexity",
        category: "Technical",
        impact: "High",
        probability: "Medium",
        status: "Active",
        owner: "Mike",
        customer: "Acme Corporation",
        playbook: "Enterprise Onboarding",
      },
      {
        id: "r2",
        title: "Stakeholder Availability",
        category: "Resource",
        impact: "Medium",
        probability: "High",
        status: "Active",
        owner: "Alex",
        customer: "Acme Corporation",
        playbook: "Enterprise Onboarding",
      },
    ],
    approvals: [
      {
        id: "ap1",
        riskId: "r1",
        approver: "Sarah Johnson",
        owner: "Mike Chen",
        date: "Jan 20, 2025",
        status: "Approved",
      },
      {
        id: "ap2",
        riskId: "r2",
        approver: "Sarah Johnson",
        owner: "Alex Rivera",
        date: "Jan 18, 2025",
        status: "Pending",
      },
    ],
    financials: {
      kpis: {
        totalProjects: 24,
        revenue: "$2.4M",
        onTime: "94%",
        utilization: "87%",
      },
      summary: {
        quoted: 2400000,
        actual: 1650000,
        profitMargin: 0.31,
        variance: 75000,
      },
      billing: { collected: 1510000, pending: 125000, overdue: 15000 },
      phases: [
        { name: "Pre-Kickoff", cost: 65000 },
        { name: "Discovery & Planning", cost: 180000 },
        { name: "Implementation", cost: 890000 },
        { name: "Training & Adoption", cost: 520000 },
      ],
    },
  },

  tech: {
    details: {
      id: "tech",
      name: "TechStart Solutions — SMB Quick Start",
      client: "TechStart Solutions",
      manager: "Mike Chen",
      status: "At Risk",
      healthScore: 72,
      healthFactors: [
        { label: "Timeline", score: 65 },
        { label: "Risks", score: 70 },
        { label: "Resources", score: 80 },
        { label: "Satisfaction", score: 73 },
      ],
      phaseProgress: [
        { phase: "Pre-Kickoff", pct: 100 },
        { phase: "Discovery & Planning", pct: 78 },
        { phase: "Implementation", pct: 55 },
        { phase: "Training & Adoption", pct: 20 },
      ],
      daysRemaining: 8,
      completionPct: 60,
      nextMilestone: "User Training Sessions",
    },
    timeline: [
      {
        id: "p1",
        title: "Pre-Kickoff",
        start: "2025-01-05",
        end: "2025-01-08",
        tasks: [
          {
            id: "t1",
            title: "Account Intake",
            duration: "45m",
            owner: "Mike",
            done: true,
            dependsOn: [],
          },
          {
            id: "t2",
            title: "Portal Access",
            duration: "10m",
            owner: "Emma",
            done: true,
            dependsOn: [],
          },
        ],
      },
      {
        id: "p2",
        title: "Discovery & Planning",
        start: "2025-01-09",
        end: "2025-01-14",
        tasks: [
          {
            id: "t3",
            title: "Goals & Success Criteria",
            duration: "45m",
            owner: "Sarah",
            done: true,
            dependsOn: ["t2"],
          },
          {
            id: "t4",
            title: "Tech Requirements Review",
            duration: "45m",
            owner: "Mike",
            done: false,
            dependsOn: ["t3"],
          },
        ],
      },
      {
        id: "p3",
        title: "Implementation",
        start: "2025-01-15",
        end: "2025-01-29",
        tasks: [
          {
            id: "t5",
            title: "Config",
            duration: "2h",
            owner: "Mike",
            done: false,
            dependsOn: ["t4"],
          },
          {
            id: "t6",
            title: "Data Migration",
            duration: "1d",
            owner: "Emma",
            done: false,
            dependsOn: ["t5"],
          },
        ],
      },
      {
        id: "p4",
        title: "Training & Adoption",
        start: "2025-01-30",
        end: "2025-02-06",
        tasks: [
          {
            id: "t7",
            title: "Admin Training",
            duration: "60m",
            owner: "Emma",
            done: false,
            dependsOn: ["t6"],
          },
          {
            id: "t8",
            title: "End-User Training",
            duration: "45m",
            owner: "Emma",
            done: false,
            dependsOn: ["t7"],
          },
        ],
      },
    ],
    activities: [
      {
        id: "a1",
        type: "call",
        title: "Customer escalation call",
        by: "Mike",
        when: "3h ago",
        notes: "Clarified data scope.",
      },
      {
        id: "a2",
        type: "integration",
        title: "Webhook retry policy updated",
        by: "Mike",
        when: "1d ago",
      },
      {
        id: "a3",
        type: "note",
        title: "Pending decision on SSO",
        by: "Sarah",
        when: "2d ago",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Scope Creep",
        category: "Financial",
        impact: "Medium",
        probability: "High",
        status: "Active",
        owner: "Mike",
        customer: "TechStart Solutions",
        playbook: "SMB Quick Start",
      },
      {
        id: "r2",
        title: "Data Sample Quality",
        category: "Technical",
        impact: "Medium",
        probability: "Medium",
        status: "Active",
        owner: "Emma",
        customer: "TechStart Solutions",
        playbook: "SMB Quick Start",
      },
    ],
    approvals: [
      {
        id: "ap1",
        riskId: "r1",
        approver: "Sarah Johnson",
        owner: "Mike Chen",
        date: "Jan 19, 2025",
        status: "Pending",
      },
    ],
    financials: {
      kpis: {
        totalProjects: 24,
        revenue: "$2.4M",
        onTime: "94%",
        utilization: "87%",
      },
      summary: {
        quoted: 800000,
        actual: 560000,
        profitMargin: 0.28,
        variance: -15000,
      },
      billing: { collected: 320000, pending: 45000, overdue: 5000 },
      phases: [
        { name: "Pre-Kickoff", cost: 25000 },
        { name: "Discovery & Planning", cost: 90000 },
        { name: "Implementation", cost: 320000 },
        { name: "Training & Adoption", cost: 125000 },
      ],
    },
  },

  global: {
    details: {
      id: "global",
      name: "Global Industries — Go-Live Program",
      client: "Global Industries",
      manager: "Emma Wilson",
      status: "On Track",
      healthScore: 92,
      healthFactors: [
        { label: "Timeline", score: 95 },
        { label: "Risks", score: 90 },
        { label: "Resources", score: 88 },
        { label: "Satisfaction", score: 94 },
      ],
      phaseProgress: [
        { phase: "Pre-Kickoff", pct: 100 },
        { phase: "Discovery & Planning", pct: 100 },
        { phase: "Implementation", pct: 90 },
        { phase: "Training & Adoption", pct: 65 },
      ],
      daysRemaining: 5,
      completionPct: 90,
      nextMilestone: "Production Launch",
    },
    timeline: [
      {
        id: "p3",
        title: "Implementation",
        start: "2025-01-01",
        end: "2025-01-25",
        tasks: [
          {
            id: "t1",
            title: "Config Freeze",
            duration: "2h",
            owner: "Mike",
            done: true,
            dependsOn: [],
          },
          {
            id: "t2",
            title: "Cutover Rehearsal",
            duration: "1d",
            owner: "Alex",
            done: true,
            dependsOn: ["t1"],
          },
          {
            id: "t3",
            title: "Final UAT",
            duration: "1d",
            owner: "Sarah",
            done: false,
            dependsOn: ["t2"],
          },
        ],
      },
      {
        id: "p4",
        title: "Training & Adoption",
        start: "2025-01-26",
        end: "2025-02-05",
        tasks: [
          {
            id: "t4",
            title: "Admin Training",
            duration: "90m",
            owner: "Emma",
            done: false,
            dependsOn: ["t3"],
          },
          {
            id: "t5",
            title: "End-User Training",
            duration: "60m",
            owner: "Emma",
            done: false,
            dependsOn: ["t4"],
          },
        ],
      },
    ],
    activities: [
      {
        id: "a1",
        type: "note",
        title: "Go-live date confirmed",
        by: "Emma",
        when: "1h ago",
      },
      {
        id: "a2",
        type: "call",
        title: "Weekly steering sync completed",
        by: "Emma",
        when: "1d ago",
      },
    ],
    risks: [
      {
        id: "r1",
        title: "Change Management",
        category: "Resource",
        impact: "Low",
        probability: "Medium",
        status: "Accepted",
        owner: "Emma",
        customer: "Global Industries",
        playbook: "Enterprise Go-Live",
      },
    ],
    approvals: [
      {
        id: "ap1",
        riskId: "r1",
        approver: "Sarah Johnson",
        owner: "Emma Davis",
        date: "Jan 10, 2025",
        status: "Approved",
      },
    ],
    financials: {
      kpis: {
        totalProjects: 24,
        revenue: "$2.4M",
        onTime: "94%",
        utilization: "87%",
      },
      summary: {
        quoted: 1200000,
        actual: 980000,
        profitMargin: 0.35,
        variance: 42000,
      },
      billing: { collected: 680000, pending: 68000, overdue: 0 },
      phases: [
        { name: "Implementation", cost: 720000 },
        { name: "Training & Adoption", cost: 260000 },
      ],
    },
  },
};

/** ----------------------------------------------------------------
 * PAGE
 * -----------------------------------------------------------------*/
export function LaunchedProject() {
  const [currentProjectId, setCurrentProjectId] = useState<string>("acme");
  const [tab, setTab] = useState<
    "overview" | "timeline" | "activities" | "risks" | "financials"
  >("overview");
  const [activityType, setActivityType] = useState("all");
  const [riskTab, setRiskTab] = useState<
    "register" | "mitigation" | "approvals"
  >("register");
  const [riskFilter, setRiskFilter] = useState("All Risks");
  const [newActivity, setNewActivity] = useState({
    title: "",
    notes: "",
    type: "note" as "note" | "call" | "integration" | "training",
  });

  // Pull active dataset for the chosen project
  const DATASET = DATA[currentProjectId];

  const [activities, setActivities] = useState(DATASET.activities);
  React.useEffect(() => {
    // When switching project, load its activities into state
    setActivities(DATA[currentProjectId].activities);
    // BACKEND: re-fetch /projects/:id/activities and set
  }, [currentProjectId]);

  const filteredActivities = useMemo(
    () =>
      activityType === "all"
        ? activities
        : activities.filter((a) => a.type === activityType),
    [activityType, activities]
  );

  // Small helpers inside component (no top-level functions per your style)
  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      "On Track": "bg-green-100 text-green-800",
      "At Risk": "bg-red-100 text-red-800",
      Delayed: "bg-yellow-100 text-yellow-800",
    };
    return (
      <Badge className={map[status] ?? "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };
  const pct = (n: number) => `${Math.round(n)}%`;
  const Row = ({
    label,
    value,
    positive,
    negative,
  }: {
    label: string;
    value: string;
    positive?: boolean;
    negative?: boolean;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span
        className={`font-semibold ${
          positive
            ? "text-green-600"
            : negative
            ? "text-red-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
  const addActivity = () => {
    if (!newActivity.title.trim()) return;
    // BACKEND: POST /projects/:id/activities
    setActivities((prev) => [
      {
        id: crypto.randomUUID(),
        type: newActivity.type,
        title: newActivity.title,
        by: "You",
        when: "just now",
        notes: newActivity.notes,
      },
      ...prev,
    ]);
    setNewActivity({ title: "", notes: "", type: "note" });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-white flex items-center px-4 gap-3">
            <SidebarTrigger />
            <div className="hidden sm:flex flex-col">
              <h1 className="text-lg font-semibold">
                Launched Project Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Monitor health, timeline, activities, risks, and financials
              </p>
            </div>

            {/* Project Switcher */}
            <div className="ml-4 w-80">
              <Select
                value={currentProjectId}
                onValueChange={setCurrentProjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project..." />
                </SelectTrigger>
                <SelectContent>
                  {projectOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" className="hidden sm:flex">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" /> New Activity
              </Button>
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="card-3d">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">
                        Overall Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-3xl font-bold">
                          {pct(DATASET.details.completionPct)}
                        </div>
                        {statusBadge(DATASET.details.status)}
                      </div>
                      <Progress
                        value={DATASET.details.completionPct}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        <Clock className="inline w-3 h-3 mr-1" />
                        {DATASET.details.daysRemaining} days remaining
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="card-3d">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">
                        Health Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {DATASET.details.healthScore}/100
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {DATASET.details.healthFactors.map((f) => (
                          <div
                            key={f.label}
                            className="flex items-center justify-between bg-gray-50 rounded px-2 py-1"
                          >
                            <span>{f.label}</span>
                            <span className="font-semibold">{f.score}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-3d">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">
                        Next Milestone
                      </CardTitle>
                      <CardDescription>
                        {DATASET.details.nextMilestone}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" /> Schedule
                      </Button>
                      {/* BACKEND: POST /projects/:id/milestones/:id/schedule */}
                    </CardContent>
                  </Card>

                  <Card className="card-3d">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gray-600">
                        Risk Snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-orange-500" />
                          <span className="font-semibold">
                            {
                              DATASET.risks.filter(
                                (r) => r.status !== "Mitigated"
                              ).length
                            }{" "}
                            open
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTab("risks")}
                        >
                          Open Risks <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs */}
                <div className="mt-6">
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {[
                      { key: "overview", label: "Overview" },
                      { key: "timeline", label: "Timeline" },
                      { key: "activities", label: "Activities" },
                      { key: "risks", label: "Risks" },
                      { key: "financials", label: "Financials" },
                    ].map((t) => (
                      <Button
                        key={t.key}
                        variant={tab === t.key ? "default" : "outline"}
                        onClick={() => setTab(t.key as any)}
                        className="w-full"
                      >
                        {t.label}
                      </Button>
                    ))}
                  </div>

                  {/* OVERVIEW */}
                  {tab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2 card-3d">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" /> Phase Progress
                          </CardTitle>
                          <CardDescription>
                            Track completion by phase
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {DATASET.details.phaseProgress.map((p) => (
                            <div key={p.phase}>
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{p.phase}</span>
                                <span>{pct(p.pct)}</span>
                              </div>
                              <Progress value={p.pct} className="h-2" />
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" /> Recent
                            Activities
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {activities.slice(0, 4).map((a) => (
                            <div key={a.id} className="p-2 bg-gray-50 rounded">
                              <p className="font-medium text-sm">{a.title}</p>
                              <p className="text-xs text-gray-600">
                                {a.by} • {a.when}
                              </p>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => setTab("activities")}
                            className="w-full"
                          >
                            See all
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* TIMELINE */}
                  {tab === "timeline" && (
                    <div className="space-y-6">
                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle>Project Timeline</CardTitle>
                          <CardDescription>
                            Click a phase to expand tasks. Drag to reschedule.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {DATASET.timeline.map((phase) => (
                            <div
                              key={phase.id}
                              className="rounded border p-4 bg-white"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold">{phase.title}</p>
                                  <p className="text-xs text-gray-500">
                                    {phase.start} → {phase.end}
                                  </p>
                                </div>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 mr-2" /> Edit Dates
                                </Button>
                                {/* BACKEND: PATCH /projects/:id/phases/:phaseId {start,end} */}
                              </div>
                              <div className="mt-3 space-y-2">
                                {phase.tasks.map((t) => (
                                  <div
                                    key={t.id}
                                    className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
                                    draggable
                                    onDragStart={(e) => {
                                      e.dataTransfer.setData(
                                        "text/plain",
                                        JSON.stringify({
                                          taskId: t.id,
                                          phaseId: phase.id,
                                        })
                                      );
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      // BACKEND: PATCH /projects/:id/tasks/:taskId {phaseId,newDate}
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                  >
                                    <div>
                                      <p className="text-sm font-medium">
                                        {t.title}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Owner: {t.owner} • {t.duration}
                                      </p>
                                      {t.dependsOn.length > 0 && (
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                          <LinkIcon className="w-3 h-3" />{" "}
                                          Depends on: {t.dependsOn.join(", ")}
                                        </p>
                                      )}
                                    </div>
                                    <Badge variant="outline">
                                      {t.done ? "Done" : "Pending"}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* ACTIVITIES */}
                  {tab === "activities" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2 card-3d">
                        <CardHeader className="space-y-2">
                          <CardTitle className="flex items-center gap-2">
                            <ActivityIcon className="w-5 h-5" /> Activity Log
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Select
                              value={activityType}
                              onValueChange={setActivityType}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filter type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                <SelectItem value="call">Calls</SelectItem>
                                <SelectItem value="integration">
                                  Integrations
                                </SelectItem>
                                <SelectItem value="training">
                                  Training
                                </SelectItem>
                                <SelectItem value="note">Notes</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="outline">
                              <Filter className="w-4 h-4 mr-2" /> Filters
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {filteredActivities.map((a) => (
                            <div
                              key={a.id}
                              className="rounded border p-3 bg-white"
                            >
                              <p className="font-medium text-sm">{a.title}</p>
                              <p className="text-xs text-gray-500">
                                {a.by} • {a.when}
                              </p>
                              {a.notes && (
                                <p className="text-sm text-gray-700 mt-1">
                                  {a.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle>Add Activity</CardTitle>
                          <CardDescription>
                            Log a call, note, or update
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Select
                            value={newActivity.type}
                            onValueChange={(v) =>
                              setNewActivity((s) => ({ ...s, type: v as any }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="note">Note</SelectItem>
                              <SelectItem value="call">Call</SelectItem>
                              <SelectItem value="integration">
                                Integration
                              </SelectItem>
                              <SelectItem value="training">Training</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Title"
                            value={newActivity.title}
                            onChange={(e) =>
                              setNewActivity((s) => ({
                                ...s,
                                title: e.target.value,
                              }))
                            }
                          />
                          <Textarea
                            placeholder="Notes (optional)"
                            rows={4}
                            value={newActivity.notes}
                            onChange={(e) =>
                              setNewActivity((s) => ({
                                ...s,
                                notes: e.target.value,
                              }))
                            }
                          />
                          <Button onClick={addActivity}>
                            <Plus className="w-4 h-4 mr-2" /> Add Activity
                          </Button>
                          {/* BACKEND: POST /projects/:id/activities */}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* RISKS */}
                  {tab === "risks" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              Total Risks
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">
                              {DATASET.risks.length}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              High Risk
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-red-600">
                              {
                                DATASET.risks.filter((r) => r.impact === "High")
                                  .length
                              }
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              Mitigated
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                              {
                                DATASET.risks.filter(
                                  (r) => r.status === "Mitigated"
                                ).length
                              }
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              Avg Resolution
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">5.2 days</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={
                            riskTab === "register" ? "default" : "outline"
                          }
                          onClick={() => setRiskTab("register")}
                        >
                          Risk Register
                        </Button>
                        <Button
                          variant={
                            riskTab === "mitigation" ? "default" : "outline"
                          }
                          onClick={() => setRiskTab("mitigation")}
                        >
                          Mitigation Tracker
                        </Button>
                        <Button
                          variant={
                            riskTab === "approvals" ? "default" : "outline"
                          }
                          onClick={() => setRiskTab("approvals")}
                        >
                          Approval Log
                        </Button>
                      </div>

                      {riskTab === "register" && (
                        <Card className="card-3d">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Risk Register</CardTitle>
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Search risks..."
                                  className="w-56"
                                />
                                <Select
                                  value={riskFilter}
                                  onValueChange={setRiskFilter}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="All Risks" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="All Risks">
                                      All Risks
                                    </SelectItem>
                                    <SelectItem value="Technical">
                                      Technical
                                    </SelectItem>
                                    <SelectItem value="Resource">
                                      Resource
                                    </SelectItem>
                                    <SelectItem value="Financial">
                                      Financial
                                    </SelectItem>
                                    <SelectItem value="Compliance">
                                      Compliance
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button>
                                  <Plus className="w-4 h-4 mr-2" /> New Risk
                                </Button>
                                {/* BACKEND: POST /projects/:id/risks */}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {DATASET.risks
                              .filter((r) =>
                                riskFilter === "All Risks"
                                  ? true
                                  : r.category === riskFilter
                              )
                              .map((r) => (
                                <div
                                  key={r.id}
                                  className="rounded border p-4 bg-white"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-semibold">{r.title}</p>
                                      <p className="text-xs text-gray-500">
                                        {r.customer} — {r.playbook}
                                      </p>
                                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                        <Badge variant="outline">
                                          {r.category}
                                        </Badge>
                                        <Badge className="bg-gray-100 text-gray-800">
                                          Impact: {r.impact}
                                        </Badge>
                                        <Badge className="bg-gray-100 text-gray-800">
                                          Probability: {r.probability}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        className={
                                          r.status === "Mitigated"
                                            ? "bg-green-100 text-green-800"
                                            : r.status === "Accepted"
                                            ? "bg-slate-100 text-slate-800"
                                            : "bg-orange-100 text-orange-800"
                                        }
                                      >
                                        {r.status}
                                      </Badge>
                                      <Button size="sm" variant="outline">
                                        View
                                      </Button>
                                      <Button size="sm" variant="ghost">
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      {/* BACKEND: GET /projects/:id/risks/:riskId ; PATCH /... */}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      )}

                      {riskTab === "mitigation" && (
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle>Mitigation Plan Tracker</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {DATASET.risks.slice(0, 2).map((r, idx) => (
                              <div
                                key={r.id}
                                className="rounded border p-4 bg-white"
                              >
                                <p className="font-semibold">{r.title}</p>
                                <p className="text-xs text-gray-500">
                                  {r.customer} — {r.playbook}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                  {idx === 0
                                    ? "Conduct technical discovery; allocate senior architect; define fallback approach."
                                    : "Pre-schedule with backups; async approval route; publish decision log."}
                                </p>
                                <div className="mt-2 flex items-center justify-between text-xs">
                                  <div className="text-gray-500">
                                    Owner: {r.owner} • Jan {idx ? 18 : 20}, 2025
                                  </div>
                                  <Badge variant="outline">
                                    {idx ? "Planning" : "In Progress"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {riskTab === "approvals" && (
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle>CS&S Leadership Approval Log</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {DATASET.approvals.map((ap) => (
                              <div
                                key={ap.id}
                                className="rounded border p-4 bg-white flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-semibold">
                                    {
                                      DATASET.risks.find(
                                        (r) => r.id === ap.riskId
                                      )?.title
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Owner: {ap.owner} • Approver: {ap.approver}{" "}
                                    • {ap.date}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={
                                      ap.status === "Approved"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }
                                  >
                                    {ap.status}
                                  </Badge>
                                  {ap.status !== "Approved" && (
                                    <Button size="sm" variant="outline">
                                      Approve
                                    </Button>
                                  )}
                                  {/* BACKEND: POST /projects/:id/risks/:riskId/approve */}
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* FINANCIALS */}
                  {tab === "financials" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              Total Projects
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">
                              {DATASET.financials.kpis.totalProjects}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              Total Revenue
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">
                              {DATASET.financials.kpis.revenue}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              On-Time Delivery
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">
                              {DATASET.financials.kpis.onTime}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="card-3d">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-gray-600">
                              Team Utilization
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">
                              {DATASET.financials.kpis.utilization}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle>Financial Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Row
                              label="Quoted Revenue"
                              value={`$${(
                                DATASET.financials.summary.quoted / 1_000_000
                              ).toFixed(1)}M`}
                            />
                            <Row
                              label="Actual Spend"
                              value={`$${(
                                DATASET.financials.summary.actual / 1_000_000
                              ).toFixed(2)}M`}
                            />
                            <Row
                              label="Profit Margin"
                              value={`${
                                Math.round(
                                  DATASET.financials.summary.profitMargin *
                                    10000
                                ) / 100
                              }%`}
                              positive
                            />
                            <Row
                              label="Budget Variance"
                              value={`${
                                DATASET.financials.summary.variance >= 0
                                  ? "+"
                                  : ""
                              }$${Math.abs(
                                DATASET.financials.summary.variance / 1000
                              )}K`}
                              positive={
                                DATASET.financials.summary.variance >= 0
                              }
                              negative={DATASET.financials.summary.variance < 0}
                            />
                          </CardContent>
                        </Card>

                        <Card className="card-3d">
                          <CardHeader>
                            <CardTitle>Billing Status</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Row
                              label="Collected"
                              value={`$${(
                                DATASET.financials.billing.collected / 1_000_000
                              ).toFixed(2)}M`}
                              positive
                            />
                            <Row
                              label="Pending"
                              value={`$${
                                DATASET.financials.billing.pending / 1000
                              }K`}
                            />
                            <Row
                              label="Overdue"
                              value={`$${
                                DATASET.financials.billing.overdue / 1000
                              }K`}
                              negative={DATASET.financials.billing.overdue > 0}
                            />
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle>Phase Cost Allocation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {DATASET.financials.phases.map((p) => (
                            <div
                              key={p.name}
                              className="flex items-center justify-between border rounded px-3 py-2"
                            >
                              <span className="text-sm">{p.name}</span>
                              <span className="font-medium">
                                ${(p.cost / 1000).toFixed(0)}K
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  )}
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

export default LaunchedProject;
