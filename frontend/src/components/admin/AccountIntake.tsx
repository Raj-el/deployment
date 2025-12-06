// src/components/admin/AccountIntakePage.tsx
import React, { useMemo, useState } from "react";
import {
  Target,
  ArrowRight,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Home,
  Users,
  Download,
  Save,
} from "lucide-react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

/* ---------------------------------- Types ---------------------------------- */
interface AccountData {
  companyName: string;
  industry: string;
  companySize: string;
  region: string;
  arr: string; // keep string for input, validate to positive number
  contractLength: string;
  useCases: string[];
  productModules: string[];
  primaryContact?: string;
  objectives?: string;
  requirements?: string;
}

interface SegmentationResult {
  segment: string;
  ltv: number;
  priority: "High" | "Medium" | "Low";
  churnRisk: "Low" | "Medium" | "High";
  expansionPotential: "Low" | "Medium" | "High";
  confidence: number;
  // Transparency (Epic 3.2)
  criteria: Array<{
    label: string;
    value: string | number;
    threshold?: string;
    met: boolean;
  }>;
}

interface TeamAssignment {
  csm: string;
  implementationPartner: boolean;
  nextSteps: string[];
  // manual overrides
  manualReassign?: boolean;
  reassignedTo?: string;
  justification?: string;
}

type AuditEvent = { ts: string; actor: string; action: string; details?: any };

/* ---------------------------------- Mock ----------------------------------- */
const industries = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Manufacturing",
  "Retail",
  "Education",
  "Government",
  "Non-Profit",
];
const companySizes = [
  "Startup (1-10)",
  "Small (11-50)",
  "Medium (51-200)",
  "Large (201-1000)",
  "Enterprise (1000+)",
];
const useCaseOptions = [
  "Customer Onboarding",
  "Account Management",
  "Sales Enablement",
  "Customer Support",
  "Analytics & Reporting",
  "Workflow Automation",
];
const productModules = [
  "Core Platform",
  "Advanced Analytics",
  "API Integration",
  "Mobile App",
  "Enterprise Security",
  "Custom Reporting",
];

const mockCSMs = [
  { id: 1, name: "Sarah Wilson", expertise: "Enterprise", capacity: 75 },
  { id: 2, name: "Mike Johnson", expertise: "Mid-Market", capacity: 60 },
  { id: 3, name: "Emily Chen", expertise: "SMB", capacity: 40 },
];

/* ================================ Page Shell ================================ */
export function AccountIntake() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeKey="/account-intake" />
        {/* ^^^ ensure your AppSidebar sets the active/highlight based on this path */}

        <div className="flex-1 flex flex-col">
          {/* Top header with breadcrumb */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <div className="flex items-center gap-2 text-xs text-slate-500"></div>
              <h1 className="text-lg font-semibold">
                Account Intake & Segmentation
              </h1>
            </div>
          </header>

          {/* Content + right rail */}
          <div className="flex-1 flex">
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6">
                <AccountIntakeContent />
              </div>
            </main>

            {/* Right rail: keep consistent with other pages (Content Tree, etc.) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ========================== Main Content Component ========================= */
function AccountIntakeContent() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [saving, setSaving] = useState(false);

  const [accountData, setAccountData] = useState<AccountData>({
    companyName: "",
    industry: "",
    companySize: "",
    region: "",
    arr: "",
    contractLength: "",
    useCases: [],
    productModules: [],
    primaryContact: "",
    objectives: "",
    requirements: "",
  });

  const [segmentationResult, setSegmentationResult] =
    useState<SegmentationResult | null>(null);
  const [teamAssignment, setTeamAssignment] = useState<TeamAssignment | null>(
    null
  );
  const percent = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  /* ---------------------------- Validation helpers ---------------------------- */
  const arrNumber = Number(accountData.arr);
  const requiredMissing =
    !accountData.companyName ||
    !accountData.industry ||
    !accountData.companySize ||
    !(accountData.useCases.length > 0) ||
    !(arrNumber > 0);

  const arrError = accountData.arr !== "" && !(arrNumber > 0);

  /* -------------------------- Step transition logic -------------------------- */
  const analyzeAndSegment = () => {
    // Simple scoring based on ARR + size + modules + usecases
    const segment = accountData.companySize.includes("Enterprise")
      ? "Enterprise"
      : accountData.companySize.includes("Large")
      ? "Mid-Market"
      : "SMB";

    const ltv = Math.max(0, arrNumber) * 3;
    const priority: SegmentationResult["priority"] =
      arrNumber > 200000 ? "High" : arrNumber > 50000 ? "Medium" : "Low";
    const expansionPotential: SegmentationResult["expansionPotential"] =
      accountData.productModules.length >= 3
        ? "High"
        : accountData.productModules.length >= 1
        ? "Medium"
        : "Low";
    const churnRisk: SegmentationResult["churnRisk"] =
      accountData.useCases.includes("Customer Support") ? "Medium" : "Low";
    const confidence =
      70 +
      Math.min(
        25,
        accountData.productModules.length * 5 +
          (accountData.useCases.length > 0 ? 5 : 0)
      );

    const criteria = [
      {
        label: "ARR",
        value: `$${arrNumber.toLocaleString()}`,
        threshold: "50k / 200k",
        met: arrNumber >= 50000,
      },
      {
        label: "Company Size",
        value: accountData.companySize,
        threshold: "Enterprise for E",
        met: segment !== "SMB",
      },
      {
        label: "Modules Selected",
        value: accountData.productModules.length,
        threshold: ">= 3 for High expand",
        met: accountData.productModules.length >= 3,
      },
      {
        label: "Use Cases",
        value: accountData.useCases.join(", ") || "—",
        threshold: "≥ 1 required",
        met: accountData.useCases.length > 0,
      },
    ];

    const result: SegmentationResult = {
      segment,
      ltv,
      priority,
      churnRisk,
      expansionPotential,
      confidence: Math.min(95, confidence),
      criteria,
    };
    setSegmentationResult(result);

    // auto-assign CSM by expertise
    const assigned =
      mockCSMs.find(
        (c) =>
          (segment === "Enterprise" && c.expertise === "Enterprise") ||
          (segment === "Mid-Market" && c.expertise === "Mid-Market") ||
          (segment === "SMB" && c.expertise === "SMB")
      ) || mockCSMs[0];

    setTeamAssignment({
      csm: assigned.name,
      implementationPartner: segment === "Enterprise",
      nextSteps: [
        "Schedule kickoff call within 48 hours",
        "Complete technical requirements assessment",
        "Set up project timeline and milestones",
        "Assign implementation resources",
      ],
    });

    pushAudit("system", "segmentation.run", {
      result,
      assignedCSM: assigned.name,
    });
  };

  const handleNextFromStep1 = () => {
    analyzeAndSegment();
    setCurrentStep(2);
  };

  const pushAudit = (actor: string, action: string, details?: any) =>
    setAudit((prev) => [
      { ts: new Date().toISOString(), actor, action, details },
      ...prev,
    ]);

  const saveDraft = async () => {
    setSaving(true);
    // TODO backend: POST /account-intake/draft { accountData, segmentationResult, teamAssignment, audit }
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    pushAudit("me", "draft.saved");
  };

  const exportSummary = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { accountData, segmentationResult, teamAssignment, audit },
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `segmentation-summary-${
      accountData.companyName || "account"
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushAudit("me", "summary.exported");
  };

  /* -------------------------------- Step 1 UI -------------------------------- */
  const StepOne = (
    <div className="space-y-6">
      {/* Step tabs */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="secondary"
          className="justify-center bg-white border rounded-md text-sm"
        >
          Account Details
        </Button>
        <Button
          variant="ghost"
          className="justify-center bg-white/60 border rounded-md text-sm text-slate-500"
          disabled
        >
          Segmentation
        </Button>
        <Button
          variant="ghost"
          className="justify-center bg-white/60 border rounded-md text-sm text-slate-500"
          disabled
        >
          Team Assignment
        </Button>
      </div>

      {/* Two-column form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company info */}
        <Card className="border bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px]">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={accountData.companyName}
                onChange={(e) =>
                  setAccountData({
                    ...accountData,
                    companyName: e.target.value,
                  })
                }
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Industry *</Label>
                <Select
                  value={accountData.industry}
                  onValueChange={(v) =>
                    setAccountData({ ...accountData, industry: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Company Size *</Label>
                <Select
                  value={accountData.companySize}
                  onValueChange={(v) =>
                    setAccountData({ ...accountData, companySize: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Region</Label>
              <Select
                value={accountData.region}
                onValueChange={(v) =>
                  setAccountData({ ...accountData, region: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Primary + Multi use cases */}
            <div className="space-y-2">
              <Label>Use Cases *</Label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {useCaseOptions.map((u) => (
                  <label key={u} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={accountData.useCases.includes(u)}
                      onChange={(e) =>
                        setAccountData({
                          ...accountData,
                          useCases: e.target.checked
                            ? [...accountData.useCases, u]
                            : accountData.useCases.filter((x) => x !== u),
                        })
                      }
                    />
                    {u}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  placeholder="Add custom use case…"
                  onKeyDown={(e) => {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (e.key === "Enter" && val) {
                      setAccountData({
                        ...accountData,
                        useCases: Array.from(
                          new Set([...accountData.useCases, val])
                        ),
                      });
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
                <span className="text-xs text-slate-500">
                  Press Enter to add
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financials */}
        <Card className="border bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-[16px]">
              Contract & Financial Details
            </CardTitle>
            <CardDescription>ARR must be a positive number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contract Value *</Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  value={accountData.arr}
                  onChange={(e) =>
                    setAccountData({ ...accountData, arr: e.target.value })
                  }
                  placeholder="100000"
                  className={arrError ? "border-red-400" : ""}
                />
                {arrError && (
                  <p className="text-xs text-red-600">
                    Please enter a positive amount.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Contract Length</Label>
                <Select
                  value={accountData.contractLength}
                  onValueChange={(v) =>
                    setAccountData({ ...accountData, contractLength: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3m">1–3 months</SelectItem>
                    <SelectItem value="3-6m">3–6 months</SelectItem>
                    <SelectItem value="6m+">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Modules</Label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {productModules.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={accountData.productModules.includes(m)}
                      onChange={(e) => {
                        setAccountData({
                          ...accountData,
                          productModules: e.target.checked
                            ? [...accountData.productModules, m]
                            : accountData.productModules.filter((x) => x !== m),
                        });
                      }}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional info */}
      <Card className="border bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-[16px]">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Primary Contact</Label>
            <Input
              placeholder="Name, Title, Email"
              value={accountData.primaryContact}
              onChange={(e) =>
                setAccountData({
                  ...accountData,
                  primaryContact: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Business Objectives</Label>
            <Textarea
              placeholder="Key business goals and success criteria…"
              value={accountData.objectives}
              onChange={(e) =>
                setAccountData({ ...accountData, objectives: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Unique Requirements</Label>
            <Textarea
              placeholder="Special requirements, integrations, compliance needs…"
              value={accountData.requirements}
              onChange={(e) =>
                setAccountData({ ...accountData, requirements: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={saveDraft} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving…" : "Save Draft"}
          </Button>
        </div>
        <Button
          onClick={handleNextFromStep1}
          disabled={requiredMissing}
          className=" h-10 px-4 rounded-xl
    bg-blue-600 text-white
    shadow-sm hover:shadow-md
    hover:bg-blue-700
    transition-all
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
    disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Analyze & Segment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  /* -------------------------------- Step 2 UI -------------------------------- */
  const StepTwo = (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="ghost"
          className="justify-center bg-white/60 border rounded-md text-sm text-slate-500"
          onClick={() => setCurrentStep(1)}
        >
          Account Details
        </Button>
        <Button
          variant="secondary"
          className="justify-center bg-white border rounded-md text-sm"
        >
          Segmentation
        </Button>
        <Button
          variant="ghost"
          className="justify-center bg-white/60 border rounded-md text-sm text-slate-500"
          onClick={() => setCurrentStep(3)}
        >
          Team Assignment
        </Button>
      </div>

      <Card className="border bg-white">
        <CardHeader>
          <CardTitle className="text-[16px]">Segmentation Results</CardTitle>
          <CardDescription>
            Automated analysis based on your inputs with criteria transparency
          </CardDescription>
        </CardHeader>
        <CardContent>
          {segmentationResult && (
            <>
              {/* KPI cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Kpi
                  color="blue"
                  icon={<Target className="w-6 h-6 text-white" />}
                  value={segmentationResult.segment}
                  label="Account Segment"
                />
                <Kpi
                  color="green"
                  icon={<DollarSign className="w-6 h-6 text-white" />}
                  value={`$${segmentationResult.ltv.toLocaleString()}`}
                  label="Lifetime Value"
                />
                <Kpi
                  color="purple"
                  icon={<TrendingUp className="w-6 h-6 text-white" />}
                  value={segmentationResult.priority}
                  label="Priority Level"
                />
                <Kpi
                  color="orange"
                  icon={<AlertCircle className="w-6 h-6 text-white" />}
                  value={segmentationResult.churnRisk}
                  label="Churn Risk"
                />
                <Kpi
                  color="teal"
                  icon={<TrendingUp className="w-6 h-6 text-white" />}
                  value={segmentationResult.expansionPotential}
                  label="Expansion Potential"
                />
                <Card className="border-2 border-gray-200 bg-gray-50/50">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Confidence Score
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {segmentationResult.confidence}%
                        </span>
                      </div>
                      <Progress
                        value={segmentationResult.confidence}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Criteria transparency */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">
                  Why this segmentation?
                </h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {segmentationResult.criteria.map((c, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-3 text-sm ${
                        c.met
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{c.label}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {c.met ? "Met" : "Not Met"}
                        </Badge>
                      </div>
                      <div className="text-slate-700 mt-1">
                        Value: <strong>{c.value}</strong>
                      </div>
                      {c.threshold && (
                        <div className="text-slate-500">
                          Threshold: {c.threshold}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between">
                <Button variant="outline" onClick={exportSummary}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Summary
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>Continue</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );

  /* -------------------------------- Step 3 UI -------------------------------- */
  const StepThree = (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="ghost"
          className="justify-center bg-white/60 border rounded-md text-sm text-slate-500"
          onClick={() => setCurrentStep(1)}
        >
          Account Details
        </Button>
        <Button
          variant="ghost"
          className="justify-center bg-white/60 border rounded-md text-sm text-slate-500"
          onClick={() => setCurrentStep(2)}
        >
          Segmentation
        </Button>
        <Button
          variant="secondary"
          className="justify-center bg-white border rounded-md text-sm"
        >
          Team Assignment
        </Button>
      </div>

      <Card className="border bg-white">
        <CardHeader>
          <CardTitle className="text-[16px]">Team Assignment</CardTitle>
          <CardDescription>Resource allocation and next steps</CardDescription>
        </CardHeader>
        <CardContent>
          {teamAssignment && (
            <div className="space-y-6">
              {/* Assigned CSM */}
              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Assigned Customer Success Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold flex items-center justify-center">
                      {teamAssignment.csm
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">
                          {teamAssignment.csm}
                        </h3>
                        <Badge variant="secondary" className="text-[10px]">
                          Segment: {segmentationResult?.segment}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500">
                        Auto-assigned by expertise & capacity
                      </div>
                    </div>
                    {/* Manual reassign */}
                    <div className="w-64">
                      <Label className="text-xs">Manually reassign</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Switch
                          checked={!!teamAssignment.manualReassign}
                          onCheckedChange={(on) =>
                            setTeamAssignment((t) =>
                              t ? { ...t, manualReassign: on } : t
                            )
                          }
                        />
                        <span className="text-sm text-slate-700">
                          {teamAssignment.manualReassign ? "On" : "Off"}
                        </span>
                      </div>
                      {teamAssignment.manualReassign && (
                        <div className="mt-2 space-y-2">
                          <Select
                            value={teamAssignment.reassignedTo || ""}
                            onValueChange={(v) =>
                              setTeamAssignment((t) =>
                                t ? { ...t, reassignedTo: v } : t
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select CSM" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCSMs.map((c) => (
                                <SelectItem key={c.name} value={c.name}>
                                  {c.name} — {c.expertise} ({c.capacity}%)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Textarea
                            placeholder="Justification (required)"
                            value={teamAssignment.justification || ""}
                            onChange={(e) =>
                              setTeamAssignment((t) =>
                                t ? { ...t, justification: e.target.value } : t
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Partner */}
              {teamAssignment.implementationPartner && (
                <Card className="border-2 border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      Implementation Partner Recommended
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-700">
                    Based on Enterprise complexity, an implementation partner
                    can accelerate onboarding and reduce risk.
                    {/* TODO backend: fetch recommended partners + availability + cost */}
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              <Card className="border-2 border-purple-200 bg-purple-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Recommended Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamAssignment.nextSteps.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-purple-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </div>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Finish / Export */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportSummary}>
            <Download className="w-4 h-4 mr-2" /> Export Summary
          </Button>
          <Button onClick={saveDraft}>Confirm & Save</Button>
        </div>
      </div>

      {/* Simple audit viewer */}
      <Card className="border bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-[16px]">Audit Trail</CardTitle>
          <CardDescription>
            All inputs, calculations, and assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {audit.length === 0 ? (
            <div className="text-slate-500">No events yet.</div>
          ) : (
            audit.map((e, i) => (
              <div
                key={i}
                className="flex items-start justify-between border-b py-2"
              >
                <div>
                  <div className="font-medium">{e.action}</div>
                  <div className="text-xs text-slate-500">
                    {JSON.stringify(e.details ?? {}, null, 0)}
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(e.ts).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* progress rail */}
      <Card className="border bg-white">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 text-xs text-slate-500">Intake Progress</div>
            <div className="text-xs text-slate-500">{percent}% Complete</div>
          </div>
          <Progress value={percent} className="h-2" />
          <div className="mt-2 grid grid-cols-3 text-[11px] text-slate-500">
            <div className="text-left">Account Details</div>
            <div className="text-center">Segmentation</div>
            <div className="text-right">Assignment</div>
          </div>
        </CardContent>
      </Card>

      {currentStep === 1 ? StepOne : currentStep === 2 ? StepTwo : StepThree}
    </div>
  );
}

/* -------------------------------- Subcomponents ------------------------------- */
function Kpi({
  color,
  icon,
  value,
  label,
}: {
  color: "blue" | "green" | "purple" | "orange" | "teal";
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  const map: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50/50",
    green: "border-green-200 bg-green-50/50",
    purple: "border-purple-200 bg-purple-50/50",
    orange: "border-orange-200 bg-orange-50/50",
    teal: "border-teal-200 bg-teal-50/50",
  };
  return (
    <Card className={`border-2 ${map[color]}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              color === "blue"
                ? "bg-blue-500"
                : color === "green"
                ? "bg-green-500"
                : color === "purple"
                ? "bg-purple-500"
                : color === "orange"
                ? "bg-orange-500"
                : "bg-teal-500"
            }`}
          >
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
