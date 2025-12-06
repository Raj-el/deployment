// src/components/admin/FeatureFlags.tsx
import React, { useMemo, useState } from "react";
import {
  Settings,
  TrendingUp,
  Zap,
  ToggleRight,
  Trash2,
  Search,
  Plus,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

/* ---- App shell (same as other pages) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* =============================================================================
   MOCK DATA (replace with Supabase/REST later)
   ============================================================================= */
// Each feature can optionally show: modified flag, rollout %, and targeted groups.
type Feature = {
  id: string;
  key: string;
  enabled: boolean;
  modified?: boolean;
  category?:
    | "Analytics"
    | "AI/ML"
    | "Security"
    | "Automation"
    | "Collaboration"
    | "UI/UX";
  rolloutPercent?: number;
  groups?: string[]; // targeted groups for progressive rollout
};

const MOCK_FEATURES: Feature[] = [
  {
    id: "1",
    key: "allowAnswerAttachments",
    enabled: true,
    modified: false,
    category: "UI/UX",
    rolloutPercent: 100,
    groups: ["All"],
  },
  {
    id: "2",
    key: "allowAnalyticsUsabillaScript",
    enabled: false,
    modified: false,
    category: "Analytics",
    rolloutPercent: 0,
    groups: [],
  },
  {
    id: "3",
    key: "allowThemeSwitch",
    enabled: true,
    modified: false,
    category: "UI/UX",
    rolloutPercent: 100,
    groups: ["All"],
  },
  {
    id: "4",
    key: "assistantQueryEnabled",
    enabled: true,
    modified: false,
    category: "AI/ML",
    rolloutPercent: 75,
    groups: ["CS Managers"],
  },
  {
    id: "5",
    key: "disableInformalKnowledge",
    enabled: true,
    modified: true,
    category: "Security",
    rolloutPercent: 100,
    groups: ["All"],
  },
  {
    id: "6",
    key: "disableSearchExtendedView",
    enabled: true,
    modified: true,
    category: "UI/UX",
    rolloutPercent: 100,
    groups: ["All"],
  },
  {
    id: "7",
    key: "enableGuestLogin",
    enabled: false,
    modified: false,
    category: "Security",
    rolloutPercent: 0,
    groups: [],
  },
  {
    id: "8",
    key: "enableKibanaConnectors",
    enabled: true,
    modified: false,
    category: "Analytics",
    rolloutPercent: 50,
    groups: ["Analysts"],
  },
  {
    id: "9",
    key: "enableSearchVoiceRecognizer",
    enabled: true,
    modified: false,
    category: "AI/ML",
    rolloutPercent: 60,
    groups: ["Pilot"],
  },
  {
    id: "10",
    key: "enableTrialConnector",
    enabled: true,
    modified: false,
    category: "Automation",
    rolloutPercent: 100,
    groups: ["All"],
  },
  {
    id: "11",
    key: "hideSearchSuggestedProducts",
    enabled: true,
    modified: false,
    category: "UI/UX",
    rolloutPercent: 100,
    groups: ["All"],
  },
  {
    id: "12",
    key: "showAnswerFeedback",
    enabled: true,
    modified: true,
    category: "UI/UX",
    rolloutPercent: 100,
    groups: ["All"],
  },
];

/* =============================================================================
   PAGE
   ============================================================================= */
export function FeatureFlags() {
  const [features, setFeatures] = useState<Feature[]>(MOCK_FEATURES);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const total = features.length;
    const enabled = features.filter((f) => f.enabled).length;
    const inBeta = features.filter(
      (f) => (f.rolloutPercent ?? 100) > 0 && (f.rolloutPercent ?? 100) < 100
    ).length;
    // usage is mocked (sum of synthetic counts) – replace with real metric later
    const usage = features.reduce((sum, f) => sum + (f.enabled ? 44 : 0), 0);
    return { total, enabled, inBeta, usage };
  }, [features]);

  const filtered = useMemo(
    () =>
      features.filter((f) =>
        f.key.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [features, search]
  );

  const categoryIcon = (category?: Feature["category"]) => {
    switch (category) {
      case "Analytics":
        return TrendingUp;
      case "AI/ML":
        return Zap;
      default:
        return Settings;
    }
  };

  const toggleFeature = (id: string, next: boolean) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: next } : f))
    );
    // TODO: persist toggle -> call backend /supabase.rpc('toggle_feature', { id, enabled: next })
  };

  const removeFeature = (id: string) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
    // TODO: delete feature -> supabase.from('feature_flags').delete().eq('id', id)
  };

  const addFeature = () => {
    // TODO: open modal to create new flag (key, default state, category, rollout, group targeting)
    const n = features.length + 1;
    setFeatures((p) => [
      {
        id: `${Date.now()}`,
        key: `newFeatureFlag_${n}`,
        enabled: false,
        modified: true,
        category: "UI/UX",
        rolloutPercent: 0,
        groups: [],
      },
      ...p,
    ]);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Features</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative w-[320px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={addFeature}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature Flag
              </Button>
            </div>
          </header>

          {/* Content + Right rail */}
          <div className="flex-1 flex">
            {/* MAIN */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6">
                {/* ===== Stats Row (exact visual spirit of your mini-cards) ===== */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                  <StatPill
                    icon={<Settings className="w-6 h-6 text-blue-600" />}
                    value={stats.total}
                    label="Total Features"
                  />
                  <StatPill
                    icon={<ToggleRight className="w-6 h-6 text-green-600" />}
                    value={stats.enabled}
                    label="Enabled"
                  />
                  <StatPill
                    icon={<Zap className="w-6 h-6 text-indigo-600" />}
                    value={stats.inBeta}
                    label="In Beta"
                  />
                  <StatPill
                    icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
                    value={stats.usage}
                    label="Total Usage"
                  />
                </div>

                {/* ===== Feature List (wide rectangular rows) ===== */}
                <div className="space-y-4">
                  {filtered.map((f) => {
                    const Icon = categoryIcon(f.category);
                    return (
                      <div
                        key={f.id}
                        className="rounded-xl border bg-white px-5 py-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Left: name + category */}
                          <div className="col-span-12 md:col-span-5 flex items-center gap-3 min-w-0">
                            <span
                              className={`mt-0.5 inline-block h-3 w-3 rounded-[4px] border ${
                                f.enabled
                                  ? "bg-red-500 border-red-500"
                                  : "bg-white border-gray-300"
                              }`}
                              aria-hidden
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-medium text-gray-900 truncate max-w-[28rem]">
                                  {f.key}
                                </span>
                              </div>
                              {f.modified && (
                                <span className="text-xs text-emerald-600 font-medium block mt-0.5">
                                  ✓ Modified
                                </span>
                              )}
                            </div>

                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 ml-2 shrink-0">
                              <Icon className="w-4 h-4 text-gray-600" />
                            </span>
                            {f.category && (
                              <Badge
                                variant="outline"
                                className="text-xs shrink-0"
                              >
                                {f.category}
                              </Badge>
                            )}
                          </div>

                          {/* Middle: rollout + targeting */}
                          <div className="col-span-12 md:col-span-5">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                                style={{ width: `${f.rolloutPercent ?? 0}%` }}
                              />
                            </div>

                            {(f.groups?.length ?? 0) > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {f.groups!.map((g) => (
                                  <Badge
                                    key={g}
                                    variant="secondary"
                                    className="text-[10px]"
                                  >
                                    {g}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-gray-500">
                                No group targeting
                              </span>
                            )}
                          </div>

                          {/* Right: actions */}
                          <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                            <button
                              className="p-1 rounded hover:bg-gray-100"
                              onClick={() => removeFeature(f.id)}
                              aria-label="Delete feature"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500" />
                            </button>

                            <Switch
                              checked={f.enabled}
                              onCheckedChange={(next) =>
                                toggleFeature(f.id, next)
                              }
                              className="data-[state=checked]:bg-green-600"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
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

/* =============================================================================
   Small stat pill (matches your mini-cards style)
   ============================================================================= */
function StatPill({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <Card className="rounded-2xl border bg-white shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <div className="text-3xl font-bold leading-7">{value}</div>
            <div className="text-sm text-gray-600 mt-1">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FeatureFlags;
