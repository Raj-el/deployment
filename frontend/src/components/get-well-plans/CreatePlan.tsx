// src/components/get-well-plans/CreatePlan.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Brain,
  Target,
  Users,
  Calendar,
  AlertTriangle,
  User,
  CheckCircle,
  Sparkles,
} from "lucide-react";

/* ---- App shell (same as other pages) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* =========================
   Types + Template Library
   ========================= */

type Priority = "High" | "Medium" | "Low";
type TaskStatus = "To-Do" | "In Progress" | "Blocked" | "Done";

type TaskRow = {
  id: string;
  title: string;
  description?: string;
  owner: string;
  priority: Priority;
  status: TaskStatus;
  due?: string;
};

type Template = {
  id: string;
  name: string;
  tasks: Array<{
    title: string;
    description?: string;
    owner: string;
    priority: Priority;
    due?: string;
  }>;
};

// Built-in templates (extend anytime; later fetch from Supabase)
const templateLibrary: Template[] = [
  {
    id: "tpl_usage_recovery",
    name: "Usage Recovery",
    tasks: [
      {
        title: "Stakeholder discovery & new champion",
        description:
          "Identify the new business owner and align on desired outcomes.",
        owner: "Sarah Chen",
        priority: "High",
      },
      {
        title: "Usage audit & training plan",
        description:
          "Analyze module usage; prep 2 focused enablement sessions.",
        owner: "Success Team",
        priority: "High",
      },
      {
        title: "30-day adoption goal tracking",
        description: "Define weekly KPIs and publish a tracking doc.",
        owner: "CSM",
        priority: "Medium",
      },
    ],
  },
  {
    id: "tpl_payment_issue",
    name: "Payment / Billing Issue",
    tasks: [
      {
        title: "Billing status review",
        description: "Validate outstanding invoices and credits.",
        owner: "Finance",
        priority: "High",
      },
      {
        title: "Exec call to confirm plan",
        description:
          "Align on timeline and reconfirm renewal risks & mitigations.",
        owner: "CSM",
        priority: "Medium",
      },
    ],
  },
];

/* =========================
   Component
   ========================= */

export function CreatePlan() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState({
    customerName: "",
    riskLevel: "",
    planType: "", // "ai-generated" | "template" | "custom"
    description: "",
    aiRecommendations: true,
    templateId: "" as string | undefined,
  });

  // Task builder state (for template/custom)
  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: "t1",
      title: "",
      description: "",
      owner: "Unassigned",
      priority: "Low",
      status: "To-Do",
    },
  ]);

  // Load user templates (local storage stub; swap with Supabase later)
  const userTemplates: Template[] = useMemo(() => {
    try {
      const raw = localStorage.getItem("gwp_templates");
      return raw ? (JSON.parse(raw) as Template[]) : [];
    } catch {
      return [];
    }
  }, []);

  /* ---------- helpers ---------- */

  const handleNext = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  const handleBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));

  const setTaskField = <K extends keyof TaskRow>(
    id: string,
    field: K,
    value: TaskRow[K]
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const addTask = () =>
    setTasks((prev) => [
      ...prev,
      {
        id: `t${prev.length + 1}_${Date.now()}`,
        title: "",
        description: "",
        owner: "Unassigned",
        priority: "Low",
        status: "To-Do",
      },
    ]);

  const moveTask = (index: number, dir: -1 | 1) => {
    setTasks((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const applyTemplate = (tplId?: string) => {
    if (!tplId) return;
    const tpl =
      templateLibrary.find((t) => t.id === tplId) ||
      userTemplates.find((t) => t.id === tplId);
    if (!tpl) return;

    setTasks(
      tpl.tasks.map((t, idx) => ({
        id: `tpl_${idx + 1}_${Date.now()}`,
        title: t.title,
        description: t.description,
        owner: t.owner,
        priority: t.priority,
        status: "To-Do",
        due: t.due,
      }))
    );
  };

  const saveCurrentAsTemplate = () => {
    const name = prompt("Template name");
    if (!name) return;

    const tpl: Template = {
      id: `user_${Date.now()}`,
      name,
      tasks: tasks.map((t) => ({
        title: t.title,
        description: t.description,
        owner: t.owner,
        priority: t.priority,
        due: t.due,
      })),
    };

    const existingRaw = localStorage.getItem("gwp_templates") ?? "[]";
    const existing: Template[] = JSON.parse(existingRaw);
    existing.push(tpl);
    localStorage.setItem("gwp_templates", JSON.stringify(existing));
    alert("Template saved locally! Replace with Supabase later.");
  };

  const handleSubmit = () => {
    // Mock plan creation payload (wire to Supabase later)
    const payload = { formData, tasks };
    console.log("Creating plan:", payload);
    navigate("/get-well-plans");
  };

  const getPriorityChip = (priority: Priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
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
              <h1 className="text-lg font-semibold">Create Get-Well Plan</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* Header */}
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold">
                    AI-powered customer recovery planning
                  </h2>
                  <p className="text-sm text-slate-600">
                    Choose a plan type, customize tasks, and review AI
                    recommendations.
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center space-x-4">
                    {[1, 2, 3].map((stepNum) => (
                      <React.Fragment key={stepNum}>
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            stepNum <= step
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {stepNum}
                        </div>
                        {stepNum < 3 && (
                          <div
                            className={`w-16 h-1 ${
                              stepNum < step ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* STEP CARD */}
                <Card className="card-3d">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {step === 1 && <Target className="w-5 h-5" />}
                      {step === 2 && <Users className="w-5 h-5" />}
                      {step === 3 && <Brain className="w-5 h-5" />}
                      <span>
                        {step === 1 && "Account Information"}
                        {step === 2 && "Plan Configuration (Manual / Template)"}
                        {step === 3 && "Review & AI Recommendations"}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* STEP 1: Account Info */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="customerName">Customer Name</Label>
                          <Input
                            id="customerName"
                            value={formData.customerName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customerName: e.target.value,
                              })
                            }
                            placeholder="Enter customer name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="riskLevel">Risk Level</Label>
                          <Select
                            value={formData.riskLevel}
                            onValueChange={(value) =>
                              setFormData({ ...formData, riskLevel: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select risk level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High Risk</SelectItem>
                              <SelectItem value="medium">
                                Medium Risk
                              </SelectItem>
                              <SelectItem value="low">Low Risk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="description">
                            Situation Description
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe the current situation and challenges"
                            rows={4}
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Plan Configuration (Manual/Template/AI) */}
                    {step === 2 && (
                      <div className="space-y-6">
                        {/* Plan type */}
                        <div>
                          <Label htmlFor="planType">Plan Type</Label>
                          <Select
                            value={formData.planType}
                            onValueChange={(value) => {
                              setFormData({ ...formData, planType: value });
                              // Auto-apply template when picking one later
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select plan type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ai-generated">
                                AI Generated
                              </SelectItem>
                              <SelectItem value="template">
                                Template Based
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom (from scratch)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Template picker + actions (shown for template/manual paths) */}
                        {(formData.planType === "template" ||
                          formData.planType === "custom") && (
                          <Card className="rounded-xl">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">
                                Plan Templates
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
                              <Select
                                value={formData.templateId}
                                onValueChange={(value) => {
                                  setFormData({
                                    ...formData,
                                    templateId: value,
                                  });
                                  applyTemplate(value);
                                }}
                              >
                                <SelectTrigger className="w-full md:w-[260px]">
                                  <SelectValue placeholder="Choose a template…" />
                                </SelectTrigger>
                                <SelectContent>
                                  {templateLibrary.map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                      {t.name}
                                    </SelectItem>
                                  ))}
                                  {userTemplates.length > 0 && (
                                    <>
                                      <div className="px-2 py-1 text-xs text-slate-500">
                                        Your Saved
                                      </div>
                                      {userTemplates.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                          {t.name}
                                        </SelectItem>
                                      ))}
                                    </>
                                  )}
                                </SelectContent>
                              </Select>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    applyTemplate(formData.templateId)
                                  }
                                >
                                  Apply Template
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={saveCurrentAsTemplate}
                                >
                                  Save as Template
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Task builder (manual/custom) */}
                        {(formData.planType === "template" ||
                          formData.planType === "custom") && (
                          <Card className="card-3d">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">
                                Task Builder
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {tasks.map((t, idx) => (
                                <div
                                  key={t.id}
                                  className="rounded-lg border p-3 bg-white"
                                >
                                  <div className="flex flex-col gap-3">
                                    {/* Top row: title + reorder */}
                                    <div className="flex items-start justify-between gap-3">
                                      <Input
                                        value={t.title}
                                        onChange={(e) =>
                                          setTaskField(
                                            t.id,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Task title"
                                        className="h-9"
                                      />
                                      <div className="flex gap-1">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => moveTask(idx, -1)}
                                          aria-label="Move up"
                                        >
                                          ↑
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => moveTask(idx, 1)}
                                          aria-label="Move down"
                                        >
                                          ↓
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <Textarea
                                      value={t.description ?? ""}
                                      onChange={(e) =>
                                        setTaskField(
                                          t.id,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Description (optional)"
                                      rows={2}
                                    />

                                    {/* Meta row */}
                                    <div className="flex flex-wrap items-center gap-2">
                                      <div className="inline-flex items-center gap-1 text-sm text-slate-600">
                                        <User className="h-4 w-4" />
                                        <Select
                                          value={t.owner}
                                          onValueChange={(v) =>
                                            setTaskField(t.id, "owner", v)
                                          }
                                        >
                                          <SelectTrigger className="h-8 w-[160px]">
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
                                            <SelectItem value="Success Team">
                                              Success Team
                                            </SelectItem>
                                            <SelectItem value="CSM">
                                              CSM
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
                                          className="h-8 w-[160px]"
                                        />
                                      </div>

                                      {/* Priority */}
                                      <Select
                                        value={t.priority}
                                        onValueChange={(v) =>
                                          setTaskField(
                                            t.id,
                                            "priority",
                                            v as Priority
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-[140px]">
                                          <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="High">
                                            High
                                          </SelectItem>
                                          <SelectItem value="Medium">
                                            Medium
                                          </SelectItem>
                                          <SelectItem value="Low">
                                            Low
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>

                                      {/* Status */}
                                      <Select
                                        value={t.status}
                                        onValueChange={(v) =>
                                          setTaskField(
                                            t.id,
                                            "status",
                                            v as TaskStatus
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-[160px]">
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
                              ))}

                              <div className="pt-2">
                                <Button variant="outline" onClick={addTask}>
                                  + Add Task
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* AI include toggle (used in Step 3 preview) */}
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="aiRecommendations"
                            checked={formData.aiRecommendations}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                aiRecommendations: checked === true,
                              })
                            }
                          />
                          <Label htmlFor="aiRecommendations">
                            Include AI recommendations and insights
                          </Label>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Review & AI */}
                    {step === 3 && (
                      <div className="space-y-6">
                        {/* Summary */}
                        <Card className="rounded-xl">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                              Plan Summary
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-slate-500">Customer</div>
                              <div className="font-medium">
                                {formData.customerName || "—"}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500">Risk Level</div>
                              <div className="font-medium">
                                {formData.riskLevel
                                  ? formData.riskLevel.toUpperCase()
                                  : "—"}
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <div className="text-slate-500">Situation</div>
                              <div className="font-medium">
                                {formData.description || "—"}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* AI section */}
                        {formData.aiRecommendations && (
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2" />
                                AI Analysis (preview)
                              </h3>
                              <div className="space-y-2 text-sm">
                                <p>
                                  ✓ Health score baseline (mock): 45% (Critical)
                                </p>
                                <p>
                                  ✓ Primary risks: Low usage, payment delays
                                </p>
                                <p>
                                  ✓ Expected improvement after plan: +25% health
                                  score
                                </p>
                              </div>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                              <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                Recommended Action Items (sample)
                              </h3>
                              <ul className="space-y-1 text-sm">
                                <li>• Schedule executive alignment call</li>
                                <li>
                                  • Conduct product usage training session
                                </li>
                                <li>
                                  • Review contract terms and payment schedule
                                </li>
                                <li>
                                  • Assign dedicated CSM for daily check-ins
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Task snapshot */}
                        {(formData.planType === "template" ||
                          formData.planType === "custom") && (
                          <Card className="card-3d">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base">
                                Tasks Snapshot
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              {tasks.map((t, i) => (
                                <div
                                  key={t.id}
                                  className="flex items-start justify-between rounded border p-3"
                                >
                                  <div className="pr-3">
                                    <div className="font-medium">
                                      {i + 1}.{" "}
                                      {t.title || (
                                        <span className="text-slate-400">
                                          Untitled
                                        </span>
                                      )}
                                    </div>
                                    {t.description && (
                                      <div className="text-sm text-slate-600">
                                        {t.description}
                                      </div>
                                    )}
                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                                      <span className="inline-flex items-center gap-1">
                                        <User className="h-3.5 w-3.5" />
                                        {t.owner}
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {t.due || "No date"}
                                      </span>
                                      <span
                                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${getPriorityChip(
                                          t.priority
                                        )}`}
                                      >
                                        Priority: {t.priority}
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        {t.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* Footer actions */}
                    <div className="flex justify-between pt-4">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={step === 1}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={step === 3 ? handleSubmit : handleNext}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {step === 3 ? "Create Plan" : "Next"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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

export default CreatePlan;
