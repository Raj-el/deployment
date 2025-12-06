// src/components/onboarding/Playbooks.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  FileText,
  Clock,
  Users as UsersIcon,
  Edit,
  ListChecks,
  Tags,
  ChevronRight,
  ArrowLeft,
  Save,
  Copy,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

/* ---------------- Mock data (replace with API) ----------------
   TODO[backend]:
   - GET /api/onboarding/playbooks?search=&category=
   - GET /api/onboarding/playbooks/:id (phases, tasks, dependencies)
   - PATCH /api/onboarding/playbooks/:id (update template)
   - POST /api/onboarding/playbooks (create new custom template)
   - POST /api/onboarding/projects  (start new project from template)
---------------------------------------------------------------- */
const mockPlaybooks = [
  {
    id: "enterprise",
    name: "Enterprise Onboarding",
    description:
      "Comprehensive onboarding process for large enterprise clients with complex requirements",
    category: "Enterprise",
    phases: 6,
    tasks: 45,
    duration: "90 days",
    lastModified: "2025-10-12",
    usage: 12,
  },
  {
    id: "smb",
    name: "SMB Quick Start",
    description:
      "Streamlined onboarding for small to medium businesses with standard requirements",
    category: "SMB",
    phases: 4,
    tasks: 28,
    duration: "30 days",
    lastModified: "2025-10-25",
    usage: 8,
  },
  {
    id: "technical",
    name: "Technical Integration Focus",
    description:
      "API-first onboarding with emphasis on technical integration and system setup",
    category: "Technical",
    phases: 5,
    tasks: 35,
    duration: "60 days",
    lastModified: "2025-10-21",
    usage: 5,
  },
  {
    id: "standard",
    name: "SaaS Platform Onboarding",
    description:
      "Standard SaaS onboarding with user training and feature adoption focus",
    category: "Standard",
    phases: 4,
    tasks: 32,
    duration: "45 days",
    lastModified: "2025-10-18",
    usage: 15,
  },
] as const;

// Mock detail for the sheet (phases + tasks)
const mockDetails: Record<
  string,
  {
    phases: Array<{
      id: string;
      name: string;
      tasks: Array<{
        id: string;
        title: string;
        description: string;
        durationDays: number;
        assigneeRole: string;
        dependsOn?: string[]; // task ids
      }>;
    }>;
  }
> = {
  enterprise: {
    phases: [
      {
        id: "p1",
        name: "Discovery & Planning",
        tasks: [
          {
            id: "t1",
            title: "Stakeholder Alignment",
            description: "Identify key stakeholders and success criteria.",
            durationDays: 2,
            assigneeRole: "CSM",
          },
          {
            id: "t2",
            title: "Technical Readiness",
            description: "Validate SSO, API keys, and network allowlists.",
            durationDays: 3,
            assigneeRole: "Solutions Engineer",
          },
        ],
      },
      {
        id: "p2",
        name: "Configuration & Setup",
        tasks: [
          {
            id: "t3",
            title: "Environment Provisioning",
            description: "Create tenant, roles, and default policies.",
            durationDays: 4,
            assigneeRole: "Implementation",
            dependsOn: ["t2"],
          },
          {
            id: "t4",
            title: "Data Ingestion",
            description: "Connect CRM/Support sources and run initial sync.",
            durationDays: 5,
            assigneeRole: "Implementation",
            dependsOn: ["t3"],
          },
        ],
      },
    ],
  },
  smb: {
    phases: [
      {
        id: "p1",
        name: "Kickoff",
        tasks: [
          {
            id: "t1",
            title: "Project Kickoff",
            description: "Schedule kickoff and define success metrics.",
            durationDays: 1,
            assigneeRole: "CSM",
          },
        ],
      },
      {
        id: "p2",
        name: "Adoption",
        tasks: [
          {
            id: "t2",
            title: "User Training",
            description: "Deliver admin + end-user training sessions.",
            durationDays: 3,
            assigneeRole: "CSM",
          },
        ],
      },
    ],
  },
  technical: {
    phases: [
      {
        id: "p1",
        name: "API Contract",
        tasks: [
          {
            id: "t1",
            title: "Define Contract",
            description: "Agree on request/response schema and auth.",
            durationDays: 2,
            assigneeRole: "Solutions Engineer",
          },
        ],
      },
    ],
  },
  standard: {
    phases: [
      {
        id: "p1",
        name: "Setup",
        tasks: [
          {
            id: "t1",
            title: "Tenant Setup",
            description: "Create tenant and invite admins.",
            durationDays: 1,
            assigneeRole: "Implementation",
          },
        ],
      },
    ],
  },
};

export function Playbooks() {
  const navigate = useNavigate();

  // UI state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null); // which playbook sheet is open

  // Sheet edit state (simple local edits)
  const [editingTask, setEditingTask] = useState<{
    pbId: string;
    phaseId: string;
    taskId: string;
    title: string;
    description: string;
    durationDays: number;
    assigneeRole: string;
  } | null>(null);

  const categories = useMemo(
    () => ["all", "Enterprise", "SMB", "Technical", "Standard"],
    []
  );

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return mockPlaybooks.filter((pb) => {
      const matchesCategory = category === "all" || pb.category === category;
      const matchesSearch =
        !s ||
        pb.name.toLowerCase().includes(s) ||
        pb.description.toLowerCase().includes(s);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const openDetails = (id: string) => {
    // TODO[backend]: fetch /api/onboarding/playbooks/:id for fresh detail
    setOpenId(id);
  };

  const startFromTemplate = (id: string) => {
    // TODO[backend]: POST /api/onboarding/projects { templateId: id }
    navigate(`/onboarding/new?template=${id}`);
  };

  const saveEdits = () => {
    // TODO[backend]: PATCH /api/onboarding/playbooks/:id with edited task
    setEditingTask(null);
  };

  const saveAsNewTemplate = (baseId: string) => {
    // TODO[backend]: POST /api/onboarding/playbooks { ...customized, baseId }
    // UX: show toast success + optional navigate to new template
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* LEFT NAV */}
        <AppSidebar />

        {/* CENTER + RIGHT RAIL */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <div className="text-xs text-gray-500">
                Onboarding / Playbooks
              </div>
              <h1 className="text-lg font-semibold">Playbooks</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-8 font-['Poppins']">
                {/* Header + CTA */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Onboarding Playbooks & Templates
                    </h2>
                    <p className="text-gray-600">
                      Browse, preview, and customize templates for new projects.
                    </p>
                  </div>
                  <Button
                    className="bg-neutral-900 hover:bg-black"
                    onClick={() => {
                      // TODO[backend]: open create new template flow
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Playbook
                  </Button>
                </div>

                {/* Search + Filter */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search playbooks..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c === "all" ? "All Categories" : c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((pb) => (
                    <Card
                      key={pb.id}
                      className="border hover:shadow-md transition cursor-pointer"
                      onClick={() => openDetails(pb.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {pb.name}
                              </CardTitle>
                              <div className="mt-1">
                                <Badge variant="outline">{pb.category}</Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(pb.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {pb.description}
                        </p>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <ListChecks className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{pb.phases}</span>
                            </div>
                            <p className="text-xs text-gray-500">Phases</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{pb.tasks}</span>
                            </div>
                            <p className="text-xs text-gray-500">Tasks</p>
                          </div>
                          <div>
                            <div className="flex items-center justify-center gap-1">
                              <UsersIcon className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{pb.usage}</span>
                            </div>
                            <p className="text-xs text-gray-500">Used</p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t text-sm text-gray-600">
                          <span>Duration: {pb.duration}</span>
                          <span>
                            Modified:{" "}
                            {new Date(pb.lastModified).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              startFromTemplate(pb.id);
                            }}
                          >
                            Use Template
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(pb.id);
                            }}
                          >
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Back to Dashboard shortcut */}
                <div className="mt-10">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/onboarding")}
                    className="text-gray-600"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Onboarding Dashboard
                  </Button>
                </div>

                {/* ===================== DETAILS + CUSTOMIZE SHEET ===================== */}
                <Sheet
                  open={!!openId}
                  onOpenChange={(open) => {
                    if (!open) setOpenId(null);
                  }}
                >
                  <SheetContent side="right" className="w-[720px] max-w-full">
                    {openId && (
                      <>
                        <SheetHeader className="mb-2">
                          <SheetTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            {mockPlaybooks.find((p) => p.id === openId)?.name}
                          </SheetTitle>
                          <SheetDescription>
                            View tasks by phase, edit details, or save as a new
                            template.
                          </SheetDescription>
                        </SheetHeader>

                        <Tabs defaultValue="overview">
                          <TabsList className="grid grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="tasks">
                              Tasks by Phase
                            </TabsTrigger>
                            <TabsTrigger value="customize">
                              Customize
                            </TabsTrigger>
                          </TabsList>

                          {/* Overview */}
                          <TabsContent value="overview" className="mt-4">
                            <Card>
                              <CardContent className="p-4 space-y-3 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                  <Tags className="w-4 h-4" />
                                  <span>
                                    Category:{" "}
                                    <strong>
                                      {
                                        mockPlaybooks.find(
                                          (p) => p.id === openId
                                        )?.category
                                      }
                                    </strong>
                                  </span>
                                </div>
                                <p className="leading-relaxed">
                                  {
                                    mockPlaybooks.find((p) => p.id === openId)
                                      ?.description
                                  }
                                </p>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="rounded-lg border p-3 text-center">
                                    <div className="text-xs text-gray-500">
                                      Phases
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {
                                        mockPlaybooks.find(
                                          (p) => p.id === openId
                                        )?.phases
                                      }
                                    </div>
                                  </div>
                                  <div className="rounded-lg border p-3 text-center">
                                    <div className="text-xs text-gray-500">
                                      Tasks
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {
                                        mockPlaybooks.find(
                                          (p) => p.id === openId
                                        )?.tasks
                                      }
                                    </div>
                                  </div>
                                  <div className="rounded-lg border p-3 text-center">
                                    <div className="text-xs text-gray-500">
                                      Duration
                                    </div>
                                    <div className="text-lg font-semibold">
                                      {
                                        mockPlaybooks.find(
                                          (p) => p.id === openId
                                        )?.duration
                                      }
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>

                          {/* Tasks by Phase */}
                          <TabsContent value="tasks" className="mt-4 space-y-4">
                            {mockDetails[openId]?.phases.map((ph) => (
                              <Card key={ph.id} className="border">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">
                                    {ph.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {ph.tasks.map((t) => (
                                    <div
                                      key={t.id}
                                      className="border rounded-lg p-3 bg-gray-50/60"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <div className="font-medium">
                                            {t.title}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {t.description}
                                          </div>
                                          <div className="text-xs text-gray-500 mt-1">
                                            Role: {t.assigneeRole} • Duration:{" "}
                                            {t.durationDays}d
                                            {t.dependsOn?.length ? (
                                              <>
                                                {" "}
                                                • Depends on:{" "}
                                                {t.dependsOn.join(", ")}
                                              </>
                                            ) : null}
                                          </div>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            setEditingTask({
                                              pbId: openId,
                                              phaseId: ph.id,
                                              taskId: t.id,
                                              title: t.title,
                                              description: t.description,
                                              durationDays: t.durationDays,
                                              assigneeRole: t.assigneeRole,
                                            })
                                          }
                                        >
                                          <Edit className="w-4 h-4 mr-1" />
                                          Edit
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            ))}
                          </TabsContent>

                          {/* Customize */}
                          <TabsContent value="customize" className="mt-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                  Save a Customized Version
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-gray-600">
                                  Duplicate this template, adjust tasks or
                                  durations, and save it as a new playbook for
                                  your team.
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => saveAsNewTemplate(openId)}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Save as New Template
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      startFromTemplate(openId as string)
                                    }
                                  >
                                    Use Template
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>

                        {/* Edit Task Inline Panel */}
                        {editingTask && (
                          <div className="mt-5 border rounded-lg p-4 bg-white">
                            <div className="font-semibold mb-2">
                              Edit Task — {editingTask.title}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Input
                                value={editingTask.title}
                                onChange={(e) =>
                                  setEditingTask({
                                    ...editingTask,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Task title"
                              />
                              <Input
                                value={editingTask.assigneeRole}
                                onChange={(e) =>
                                  setEditingTask({
                                    ...editingTask,
                                    assigneeRole: e.target.value,
                                  })
                                }
                                placeholder="Assignee role"
                              />
                              <Textarea
                                className="md:col-span-2"
                                value={editingTask.description}
                                onChange={(e) =>
                                  setEditingTask({
                                    ...editingTask,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="Task description"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  Duration (days)
                                </span>
                                <Input
                                  type="number"
                                  className="w-28"
                                  value={editingTask.durationDays}
                                  onChange={(e) =>
                                    setEditingTask({
                                      ...editingTask,
                                      durationDays: Number(e.target.value),
                                    })
                                  }
                                  min={1}
                                />
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button onClick={saveEdits}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setEditingTask(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                              {/* TODO[backend]:
                                 PATCH /api/onboarding/playbooks/:id/tasks/:taskId
                                 Body: { title, description, durationDays, assigneeRole }
                                 Return updated template version + versionId for audit trail */}
                              Changes are local in this mock. Connect PATCH API
                              to persist.
                            </div>
                          </div>
                        )}

                        <SheetFooter className="mt-6">
                          <Button
                            className="bg-neutral-900 hover:bg-black"
                            onClick={() => startFromTemplate(openId as string)}
                          >
                            Start Project from This Template
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </SheetFooter>
                      </>
                    )}
                  </SheetContent>
                </Sheet>
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
