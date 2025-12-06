import React, { useMemo, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BrainCircuit,
  Bot,
  Gauge,
  Smile,
  Zap,
  Settings,
  TrendingUp,
  Clock3,
  ActivitySquare,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

/** --------------------------------------------------------------------------
 * AI-Powered Automation
 * - Intelligent ticket routing, classification, auto-resolution (ML)
 * - Matches provided UI; uses your shadcn-based primitives
 * - All data is mocked; see BACKEND notes for integration points
 * -------------------------------------------------------------------------- */

type Rule = {
  id: string;
  title: string;
  description: string;
  active: boolean;
  triggersToday: number;
  accuracyPct: number;
};

type AIAction = {
  id: string;
  label: string;
  ticketId: string;
  ago: string;
  kind: "resolved" | "escalated" | "classified";
};

const KPI = [
  {
    key: "classification",
    label: "Ticket Classification Accuracy",
    value: "96.3%",
    delta: "+2.1%",
    icon: BrainCircuit,
  },
  {
    key: "autoresolution",
    label: "Auto-Resolution Rate",
    value: "65%",
    delta: "+8.5%",
    icon: Bot,
  },
  {
    key: "responseReduction",
    label: "Response Time Reduction",
    value: "73%",
    delta: "+12%",
    icon: Gauge,
  },
  {
    key: "csat",
    label: "Customer Satisfaction",
    value: "4.7/5",
    delta: "+0.3",
    icon: Smile,
  },
] as const;

const RULES: Rule[] = [
  {
    id: "rule-kw-route",
    title: "Auto-assign tickets based on keywords",
    description:
      "Automatically route tickets containing 'login', 'password', or 'SSO' to authentication specialists",
    active: true,
    triggersToday: 15,
    accuracyPct: 94,
  },
  {
    id: "rule-escalate-hi",
    title: "Escalate high-priority customer issues",
    description:
      "Auto-escalate tickets from enterprise customers with 'urgent' or 'critical' keywords",
    active: true,
    triggersToday: 8,
    accuracyPct: 98,
  },
  {
    id: "rule-auto-reset",
    title: "Auto-resolve password reset requests",
    description:
      "Automatically send password reset instructions and close ticket for standard requests",
    active: true,
    triggersToday: 32,
    accuracyPct: 99,
  },
];

const ACTIONS: AIAction[] = [
  {
    id: "a1",
    label: "Auto-resolved password reset",
    ticketId: "TK-4521",
    ago: "5 minutes ago",
    kind: "resolved",
  },
  {
    id: "a2",
    label: "Escalated enterprise issue",
    ticketId: "TK-4520",
    ago: "12 minutes ago",
    kind: "escalated",
  },
  {
    id: "a3",
    label: "Classified billing inquiry",
    ticketId: "TK-4519",
    ago: "18 minutes ago",
    kind: "classified",
  },
];

export function AIAutomation() {
  const [rules, setRules] = useState<Rule[]>(RULES);

  const modelHealth = useMemo(
    () => ({
      // BACKEND: populate from your model registry/monitoring store
      grade: "Excellent",
      ticketsUsed: 15432,
      lastUpdated: "2 hours ago",
      trainPct: 78, // visualize some progress for retraining simulation
    }),
    []
  );

  function onEditRule(id: string) {
    // BACKEND: open Drawer/Modal with rule config (see comments below)
    console.log("Edit rule:", id);
  }

  function onConfigureRules() {
    // BACKEND: navigate to /support/automation/rules or open modal
    console.log("Open rules config");
  }

  function onRetrain() {
    // BACKEND: trigger retrain pipeline + toast; long-running job -> polling
    console.log("Retrain model clicked");
  }

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
              <h1 className="text-lg font-semibold">AI-Powered Automation</h1>
              <p className="text-xs text-slate-500">
                Intelligent ticket routing, classification, and auto-resolution
                powered by machine learning
              </p>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* KPI cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                  {KPI.map(({ key, label, value, delta, icon: Icon }) => (
                    <Card key={key} className="rounded-xl">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-[28px] leading-7 font-semibold">
                              {value}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {label}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 grid place-items-center rounded-lg bg-slate-100 text-slate-700">
                              <Icon className="h-5 w-5" />
                            </div>
                            <Badge variant="secondary">{delta}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>

                {/* Active Automation Rules */}
                <section className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <h2 className="text-lg font-semibold">
                        Active Automation Rules
                      </h2>
                    </div>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={onConfigureRules}
                    >
                      <Settings className="h-4 w-4" />
                      Configure Rules
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {rules.map((r) => (
                      <Card key={r.id} className="rounded-xl border-slate-200">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="text-[15px] font-semibold">
                                  {r.title}
                                </div>
                                {r.active ? (
                                  <Badge className="bg-emerald-100 text-emerald-700">
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Paused</Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                {r.description}
                              </p>

                              <div className="mt-2 flex items-center gap-5 text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                  <ActivitySquare className="h-4 w-4 text-slate-400" />
                                  {r.triggersToday} triggers today
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4 text-slate-400" />
                                  {r.accuracyPct}% accuracy
                                </span>
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              onClick={() => onEditRule(r.id)}
                            >
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Training + Recent AI actions */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* AI Training Status */}
                  <Card className="rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        AI Training Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="text-slate-500">Model Accuracy</div>
                          <div className="inline-flex items-center gap-1 font-medium">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            {modelHealth.grade}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-500">Training Data</div>
                          <div className="font-medium">
                            {modelHealth.ticketsUsed.toLocaleString()} tickets
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-500">Last Updated</div>
                          <div className="inline-flex items-center gap-1 font-medium">
                            <Clock3 className="h-4 w-4 text-slate-400" />
                            {modelHealth.lastUpdated}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2">
                        <Progress value={modelHealth.trainPct} />
                      </div>

                      <Button className="w-full mt-2" onClick={onRetrain}>
                        Retrain Model
                      </Button>

                      {/* BACKEND:
                         - “Retrain Model” triggers a job in your ML pipeline (US-TSS-004/-005).
                         - Show job status: queued -> training -> validating -> deployed.
                         - Store artifacts & metrics (confusion matrix, AUC, precision/recall per class).
                         - Rollback option if post-deploy accuracy drops beyond threshold. */}
                    </CardContent>
                  </Card>

                  {/* Recent AI Actions */}
                  <Card className="rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Recent AI Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <ul className="divide-y divide-slate-200">
                        {ACTIONS.map((a) => (
                          <li
                            key={a.id}
                            className="py-3 flex items-center gap-3"
                          >
                            <div className="h-8 w-8 grid place-items-center rounded-lg bg-slate-100">
                              {a.kind === "resolved" ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              ) : a.kind === "escalated" ? (
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                              ) : (
                                <BrainCircuit className="h-4 w-4 text-slate-700" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-slate-900">
                                {a.label}
                              </div>
                              <div className="text-xs text-slate-500">
                                {a.ticketId} • {a.ago}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* BACKEND:
                          - Source from an event stream (e.g., Kafka/SNS/SQS) of AI actions:
                            “classified”, “routed”, “auto_resolved”, “escalated”.
                          - Persist to analytics store for auditability and trend reports.
                          - Click handlers can deep-link to the ticket detail. */}
                    </CardContent>
                  </Card>
                </section>

                {/* BACKEND INTEGRATION MAP (high level):
                    - US-TSS-008 Intelligent Ticket Routing:
                      * Rules map to skills, groups, and workload balancer.
                      * Endpoint: POST /routing/apply, or stream processor tags ticket -> “route_to”.
                    - US-TSS-009 Escalation Management:
                      * “Escalate high-priority” rule defines SLA % thresholds, tiers, and notify matrix.
                      * Maintain escalation queue + analytics for optimization.
                    - US-TSS-004 Unified Performance Dashboard:
                      * KPI cards sourced from metrics service refreshed every 5 minutes.
                    - US-TSS-005 Predictive Issue Analytics:
                      * Classification & auto-resolve models; expose confidence scores + explanations (optional).
                    - Governance:
                      * Version rules; audit changes; safe rollback; shadow mode for new models. */}
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

export default AIAutomation;
