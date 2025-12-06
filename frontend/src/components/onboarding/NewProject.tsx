import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import {
  Plus,
  Save,
  PlayCircle,
  Calendar,
  Users,
  FileText,
  ChevronRight,
  Search,
  DollarSign,
  Clock,
  Settings2,
  BadgeCheck,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

/* =========================================================
   Mock data (replace with API calls later)
   ========================================================= */
// Customers for searchable dropdown
const MOCK_CUSTOMERS = [
  "Gamma Inc.",
  "Global Tech Inc.",
  "Stellar Solutions",
  "Nova Technologies",
  "Quantum Dynamics",
  "Acme Corporation",
];

// Playbooks list for selection & builder preview
const MOCK_PLAYBOOKS = [
  {
    id: "ent",
    name: "Enterprise Onboarding",
    duration: "4–6 weeks",
    tasks: 24,
    automated: 8,
    tag: "Enterprise",
    phases: [
      {
        title: "Pre-Kickoff",
        tasks: [
          { title: "CRM Data Import", type: "automated", duration: "5 min" },
          {
            title: "Customer Portal Setup",
            type: "automated",
            duration: "10 min",
          },
          {
            title: "Welcome Email Sequence",
            type: "automated",
            duration: "Instant",
          },
        ],
      },
      {
        title: "Discovery & Planning",
        tasks: [
          {
            title: "Stakeholder Identification",
            type: "manual",
            duration: "30 min",
          },
          {
            title: "Goals & Success Criteria",
            type: "collaborative",
            duration: "45 min",
          },
          {
            title: "Technical Requirements Review",
            type: "manual",
            duration: "60 min",
          },
        ],
      },
      {
        title: "Implementation",
        tasks: [
          {
            title: "System Configuration",
            type: "technical",
            duration: "2–3 hours",
          },
          { title: "Data Migration", type: "technical", duration: "1–2 days" },
          {
            title: "Integration Testing",
            type: "collaborative",
            duration: "3–4 hours",
          },
        ],
      },
      {
        title: "Training & Adoption",
        tasks: [
          {
            title: "Admin Training Session",
            type: "training",
            duration: "90 min",
          },
          { title: "End User Training", type: "training", duration: "60 min" },
          {
            title: "Feature Adoption Tracking",
            type: "automated",
            duration: "Ongoing",
          },
        ],
      },
    ],
  },
  {
    id: "smb",
    name: "SMB Quick Start",
    duration: "2 weeks",
    tasks: 12,
    automated: 4,
    tag: "SMB",
    phases: [
      {
        title: "Kickoff",
        tasks: [
          { title: "Welcome Email", type: "automated", duration: "Instant" },
          { title: "Kickoff Call", type: "collaborative", duration: "30 min" },
        ],
      },
      {
        title: "Configure",
        tasks: [
          { title: "Portal Setup", type: "manual", duration: "30 min" },
          {
            title: "Basic Integration",
            type: "technical",
            duration: "2 hours",
          },
        ],
      },
      {
        title: "Train",
        tasks: [
          { title: "Admin Training", type: "training", duration: "60 min" },
          { title: "User Guides", type: "automated", duration: "Instant" },
        ],
      },
    ],
  },
  {
    id: "tech",
    name: "Tech Integration Focus",
    duration: "3–4 weeks",
    tasks: 18,
    automated: 5,
    tag: "Technical",
    phases: [
      {
        title: "API Enablement",
        tasks: [
          { title: "API Keys & Roles", type: "technical", duration: "30 min" },
          { title: "Sandbox Setup", type: "technical", duration: "1 hour" },
        ],
      },
      {
        title: "Integration",
        tasks: [
          { title: "Auth Flow", type: "technical", duration: "2–3 hours" },
          {
            title: "Webhook Validation",
            type: "technical",
            duration: "2 hours",
          },
        ],
      },
    ],
  },
];

// Team & hourly rates for Resource Assignment Matrix
const TEAM = [
  {
    id: "sarah",
    name: "Sarah Johnson",
    role: "Customer Success Manager",
    rate: 150,
    available: 100,
  },
  {
    id: "mike",
    name: "Mike Chen",
    role: "Technical Specialist",
    rate: 175,
    available: 75,
  },
  {
    id: "alex",
    name: "Alex Rivera",
    role: "Project Manager",
    rate: 160,
    available: 50,
  },
  {
    id: "emma",
    name: "Emma Davis",
    role: "Training Specialist",
    rate: 140,
    available: 80,
  },
];

/* =========================================================
   New Onboarding Project Page
   ========================================================= */
export function NewProject() {
  /* ----------------- Core form state ----------------- */
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const filteredCustomers = useMemo(
    () =>
      MOCK_CUSTOMERS.filter((c) =>
        c.toLowerCase().includes(customerQuery.toLowerCase())
      ),
    [customerQuery]
  );

  const [projectType, setProjectType] = useState<string>("");
  const [playbookId, setPlaybookId] = useState<string>("");
  const selectedPlaybook = useMemo(
    () => MOCK_PLAYBOOKS.find((p) => p.id === playbookId) || null,
    [playbookId]
  );

  const [contractValue, setContractValue] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [startDate, setStartDate] = useState<string>("");
  const [goLiveDate, setGoLiveDate] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  /* ----------------- Resource Matrix ----------------- */
  // simple phase → assigned people mapping (mock “drag & drop” with add/remove)
  const [showMatrix, setShowMatrix] = useState(false);
  const [assignments, setAssignments] = useState<Record<string, string[]>>({
    "Pre-Kickoff": [],
    "Discovery & Planning": [],
    Implementation: [],
    "Training & Adoption": [],
  });

  const phasesForMatrix = selectedPlaybook
    ? selectedPlaybook.phases.map((p) => p.title)
    : Object.keys(assignments);

  const toggleAssign = (phase: string, memberId: string) => {
    setAssignments((prev) => {
      const current = new Set(prev[phase] || []);
      if (current.has(memberId)) current.delete(memberId);
      else current.add(memberId);
      return { ...prev, [phase]: Array.from(current) };
    });
  };

  /* ----------------- Playbook Builder ----------------- */
  const [showBuilder, setShowBuilder] = useState(true);
  // allow simple add-phase and save-as-template mock
  const addPhase = () => {
    if (!selectedPlaybook) return;
    const name = `Custom Phase ${selectedPlaybook.phases.length + 1}`;
    selectedPlaybook.phases.push({ title: name, tasks: [] });
    // force rerender
    setShowBuilder((s) => !s);
    setShowBuilder((s) => !s);
  };

  /* ----------------- Derived Insights ----------------- */
  const insights = useMemo(() => {
    const duration = selectedPlaybook?.duration ?? "—";
    const tasks = selectedPlaybook?.tasks ?? 0;
    const automated = selectedPlaybook?.automated ?? 0;
    // crude team count based on unique assignees across phases
    const resourceSet = new Set<string>();
    Object.values(assignments).forEach((arr) =>
      arr.forEach((id) => resourceSet.add(id))
    );
    const teamCount = Math.max(2, resourceSet.size || 0);
    return { duration, tasks, automated, teamCount };
  }, [selectedPlaybook, assignments]);

  /* ----------------- Validation ----------------- */
  const canLaunch =
    !!selectedCustomer &&
    !!projectType &&
    !!playbookId &&
    !!projectName &&
    !!startDate &&
    !!goLiveDate;

  /* ----------------- Actions ----------------- */
  const handleSaveDraft = () => {
    // TODO: POST /onboarding/projects/draft  with current state
    // Include: core form fields, assignments, customized playbook
    console.log("Save draft payload", {
      selectedCustomer,
      projectType,
      playbookId,
      contractValue,
      projectName,
      description,
      startDate,
      goLiveDate,
      priority,
      assignments,
      customizedPlaybook: selectedPlaybook,
    });
  };

  const handleLaunch = () => {
    if (!canLaunch) return;
    // TODO: POST /onboarding/projects  → on success, navigate to /onboarding/projects/:id
    console.log("Launch project payload", {
      selectedCustomer,
      projectType,
      playbookId,
      projectName,
      startDate,
      goLiveDate,
      priority,
      assignments,
    });
    // Example: router.push(`/onboarding/projects/${newId}`)
  };

  /* =====================================================
     Page Shell + Content (single component, no extra body)
     ===================================================== */
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Onboarding</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-8 font-['Poppins']">
                {/* Page title row */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                        <Plus className="w-5 h-5" />
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        New Onboarding Project
                      </h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                      Create a new customer onboarding project with automated
                      workflows and personalized experiences.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleSaveDraft}>
                      <Save className="w-4 h-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={handleLaunch}
                      disabled={!canLaunch}
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Launch Project
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Project Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* row 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Select customer (searchable) */}
                        <div>
                          <Label className="mb-2 block">Select Customer</Label>
                          <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            <Input
                              value={selectedCustomer ?? customerQuery}
                              onChange={(e) => {
                                setSelectedCustomer(null);
                                setCustomerQuery(e.target.value);
                              }}
                              placeholder="Choose customer..."
                              className="pl-9"
                            />
                            {!selectedCustomer && customerQuery && (
                              <div className="absolute z-10 bg-white border rounded-md mt-1 w-full max-h-56 overflow-y-auto">
                                {filteredCustomers.length === 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500">
                                    No matches
                                  </div>
                                )}
                                {filteredCustomers.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => setSelectedCustomer(c)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                                  >
                                    {c}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Project Type */}
                        <div>
                          <Label className="mb-2 block">Project Type *</Label>
                          <Select
                            value={projectType}
                            onValueChange={setProjectType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose project type..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Enterprise">
                                Enterprise
                              </SelectItem>
                              <SelectItem value="SMB">SMB</SelectItem>
                              <SelectItem value="Technical">
                                Technical
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* row 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Playbook */}
                        <div>
                          <Label className="mb-2 block">
                            Onboarding Playbook
                          </Label>
                          <Select
                            value={playbookId}
                            onValueChange={setPlaybookId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose playbook..." />
                            </SelectTrigger>
                            <SelectContent>
                              {MOCK_PLAYBOOKS.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Contract value */}
                        <div>
                          <Label className="mb-2 block">Contract Value</Label>
                          <div className="relative">
                            <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                            <Input
                              type="number"
                              placeholder="e.g., 125000"
                              value={contractValue}
                              onChange={(e) => setContractValue(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Project name */}
                      <div>
                        <Label className="mb-2 block">Project Name</Label>
                        <Input
                          placeholder="e.g., Gamma Inc. – Enterprise Onboarding Q1 2024"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label className="mb-2 block">
                          Project Description
                        </Label>
                        <Textarea
                          rows={3}
                          placeholder="Brief description of the onboarding scope and objectives..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      {/* row 3: dates & priority */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="mb-2 block">
                            Target Start Date
                          </Label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">Target Go-Live</Label>
                          <Input
                            type="date"
                            value={goLiveDate}
                            onChange={(e) => setGoLiveDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="mb-2 block">Priority Level</Label>
                          <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ======= Resource Assignment Matrix & Playbook Config ======= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  {/* LEFT 2 cols: sections */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Resource Assignment header stub */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-indigo-600" />
                          Resource Assignment Matrix
                        </CardTitle>
                        <Button
                          variant="outline"
                          onClick={() => setShowMatrix((s) => !s)}
                        >
                          {showMatrix ? "Hide Matrix" : "Assign Resources"}
                        </Button>
                      </CardHeader>
                      {showMatrix && (
                        <CardContent className="space-y-4">
                          {/* “Matrix”: click to toggle assignment per phase / member */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {TEAM.map((m) => (
                              <div
                                key={m.id}
                                className="border rounded-xl p-4 bg-white"
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-lg font-semibold">
                                    {m.name}
                                  </p>
                                  <Badge variant="outline">
                                    {m.available}% available
                                  </Badge>
                                </div>
                                <p className="text-gray-500">{m.role}</p>
                                <p className="text-gray-700 mt-1">
                                  ${m.rate}/hr
                                </p>

                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  {phasesForMatrix.map((phase) => {
                                    const active = (
                                      assignments[phase] || []
                                    ).includes(m.id);
                                    return (
                                      <button
                                        key={phase}
                                        onClick={() =>
                                          toggleAssign(phase, m.id)
                                        }
                                        type="button"
                                        className={`text-sm border rounded-md px-2 py-1 flex items-center justify-between ${
                                          active
                                            ? "bg-indigo-50 border-indigo-300"
                                            : "hover:bg-gray-50"
                                        }`}
                                      >
                                        <span className="truncate">
                                          {phase}
                                        </span>
                                        {active && (
                                          <Badge className="ml-2">
                                            Assigned
                                          </Badge>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>

                    {/* Playbook Configuration */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Settings2 className="w-5 h-5 text-indigo-600" />
                          Playbook Configuration
                        </CardTitle>
                        <Button
                          variant="outline"
                          onClick={() => setShowBuilder((s) => !s)}
                        >
                          {showBuilder ? "Hide Builder" : "Customize Playbook"}
                        </Button>
                      </CardHeader>

                      {showBuilder && (
                        <CardContent className="space-y-4">
                          {!selectedPlaybook && (
                            <div className="p-6 text-center text-gray-500">
                              Select a playbook above to customize phases &
                              tasks.
                            </div>
                          )}

                          {selectedPlaybook &&
                            selectedPlaybook.phases.map((phase, idx) => (
                              <div
                                key={phase.title + idx}
                                className="rounded-xl border p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary">{idx + 1}</Badge>
                                    <p className="font-semibold">
                                      {phase.title}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-indigo-600"
                                    onClick={() => {
                                      // TODO: open "add task" modal
                                      // For now we push a placeholder
                                      phase.tasks.push({
                                        title: "New Custom Task",
                                        type: "manual",
                                        duration: "30 min",
                                      } as any);
                                      setShowBuilder((s) => !s);
                                      setShowBuilder((s) => !s);
                                    }}
                                  >
                                    + Add Task
                                  </Button>
                                </div>

                                <div className="space-y-2">
                                  {phase.tasks.map((t, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                                    >
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          {t.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge
                                            variant="outline"
                                            className={
                                              t.type === "automated"
                                                ? "text-green-700 border-green-300"
                                                : t.type === "technical"
                                                ? "text-blue-700 border-blue-300"
                                                : t.type === "training"
                                                ? "text-purple-700 border-purple-300"
                                                : "text-orange-700 border-orange-300"
                                            }
                                          >
                                            {t.type}
                                          </Badge>
                                          <span className="text-sm text-gray-600">
                                            {t.duration}
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          // TODO: open task settings drawer
                                        }}
                                      >
                                        <Settings2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                          {selectedPlaybook && (
                            <div className="flex items-center gap-3 pt-2">
                              <Button variant="outline" onClick={addPhase}>
                                + Add Phase
                              </Button>
                              <Button variant="outline">
                                ⬆️ Import Template
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // TODO: POST /onboarding/playbooks/save-template
                                  console.log(
                                    "Save as template",
                                    selectedPlaybook
                                  );
                                }}
                              >
                                💾 Save as Template
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  </div>

                  {/* RIGHT: Insights & Resources */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingPill />
                          Project Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <InsightRow
                          label="Estimated Duration"
                          value={insights.duration}
                        />
                        <InsightRow
                          label="Total Tasks"
                          value={`${insights.tasks} tasks`}
                        />
                        <InsightRow
                          label="Automated Tasks"
                          value={`${insights.automated} tasks`}
                          accent="text-green-600"
                        />
                        <InsightRow
                          label="Required Resources"
                          value={`${insights.teamCount} team members`}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Resources & Templates</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {[
                          "Training Videos",
                          "Documentation Templates",
                          "Integration Guides",
                          "FAQ Templates",
                        ].map((t, i) => (
                          <button
                            key={i}
                            type="button"
                            className="w-full text-left px-4 py-3 rounded-lg border hover:bg-gray-50"
                          >
                            {t}
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
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

/* ---------- tiny local helpers (inline in same file) ---------- */
function InsightRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${accent ?? ""}`}>{value}</span>
    </div>
  );
}

function TrendingPill() {
  return (
    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
      <Clock className="w-3.5 h-3.5 text-emerald-700" />
    </div>
  );
}
