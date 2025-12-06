//====================1st EDIT===================================

// src/components/health-scores/HealthScoresDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import healthScoreService from "@/services/healthScoreService"; // ← CHANGED: Remove supabase, add healthScoreService
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"; // ← ADD THIS
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type CustomerHealth = {
  id: string;
  name: string;
  industry: string;
  mrr: number;
  overall_score: number;
  financial_score: number;
  usage_score: number;
  sentiment_score: number;
  engagement_score: number;
  last_updated: string;
};

export function HealthScoresDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("all");

  const fetchHealthScores = async () => {
    setLoading(true);
    try {
      // Call the backend API endpoint
      const response = await healthScoreService.getHealthScores({ limit: 50 });

      if (!response.customers || response.customers.length === 0) {
        console.warn("No customers returned from API");
        setCustomers([]);
        toast({
          title: "No Data",
          description: "No customer health scores found.",
          variant: "default",
        });
      } else {
        // Map backend response to frontend structure
        const mapped: CustomerHealth[] = response.customers.map((customer) => ({
          id: customer.accountId,
          name: customer.accountName || "Unknown Account",
          industry: "Unknown", // Backend doesn't provide this yet - could add later
          mrr: 0, // Backend doesn't provide this yet - could add later
          overall_score: customer.overallHealthScore || 0,
          financial_score: customer.financialHealthScore || 0,
          usage_score: customer.usageHealthScore || 0,
          sentiment_score: customer.sentimentHealthScore || 0,
          engagement_score: customer.engagementHealthScore || 0,
          last_updated: customer.updatedAt || new Date().toISOString(),
        }));

        setCustomers(mapped);
        console.log(`✅ Loaded ${mapped.length} health scores from backend`);
      }
    } catch (error) {
      console.error("Failed to fetch health scores:", error);

      // Show error toast
      toast({
        title: "Error Loading Data",
        description:
          error instanceof Error && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : "Failed to fetch health scores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Derived: current dataset (All vs one account) ---
  const currentSet = useMemo(() => {
    if (selectedAccountId === "all") return customers;
    return customers.filter((c) => c.id === selectedAccountId);
  }, [customers, selectedAccountId]);

  // --- KPI aggregates (mock deltas now; wire real trend deltas later) ---
  const kpis = useMemo(() => {
    const n = currentSet.length || 1;
    const sum = (key: keyof CustomerHealth) =>
      currentSet.reduce((s, c) => s + (c[key] as number), 0) / n;

    const financial = Math.round(sum("financial_score"));
    const sentiment = Math.round(sum("sentiment_score"));
    const usage = Math.round(sum("usage_score"));
    const engagement = Math.round(sum("engagement_score"));

    // TODO: replace these mock deltas with real-period comparisons
    return [
      {
        label: "Financial Index",
        value: (financial / 20).toFixed(1), // 0–100 → ~0–5 to match screenshot feel
        trendText: "Avg from last period",
        up: true,
      },
      {
        label: "Sentiment Index",
        value: (sentiment / 20).toFixed(1),
        trendText: "Down 5% from last period",
        up: false,
      },
      {
        label: "Usage Index",
        value: (usage / 20).toFixed(1),
        trendText: "Up 12% from last period",
        up: true,
      },
      {
        label: "Engagement Index",
        value: (engagement / 20).toFixed(1),
        trendText: "Down 8% from last period",
        up: false,
      },
    ];
  }, [currentSet]);

  // --- Helpers for table pills ---
  const pill = (score: number) => {
    const color =
      score >= 80
        ? "bg-green-500"
        : score >= 60
        ? "bg-yellow-500"
        : score >= 40
        ? "bg-orange-500"
        : "bg-red-500";
    return (
      <div className="flex items-center gap-2">
        <div className={`h-3 w-10 rounded-full ${color}`} />
        <span className="text-gray-700">{score}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b bg-white flex items-center px-4">
              <SidebarTrigger />
              <div className="ml-4">
                <h1 className="text-lg font-semibold">
                  Customer Health Scores
                </h1>
              </div>
            </header>
            <div className="flex-1 grid place-items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
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
              <h1 className="text-lg font-semibold">Customer Health Scores</h1>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchHealthScores}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              {/* Account selector (drives all 3 blocks) */}
              <Select
                value={selectedAccountId}
                onValueChange={setSelectedAccountId}
              >
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </header>

          {/* Middle area: center + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* ===== 1) TOP KPI CARDS (4) — no Create Plan button here ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {kpis.map((k) => (
                    <Card
                      key={k.label}
                      className="rounded-xl border bg-white shadow-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-slate-800">
                            {k.label}
                          </p>
                          {k.up ? (
                            <ArrowUpRight className="h-5 w-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div className="mt-6 text-5xl font-bold tracking-tight">
                          {k.value}
                        </div>
                        <div
                          className={`mt-3 text-sm ${
                            k.up ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {k.up ? (
                            <TrendingUp className="inline h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="inline h-4 w-4 mr-1" />
                          )}
                          {k.trendText}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ===== 2) Accounts Health Overview (PULSE) ===== */}
                <Card className="rounded-xl border bg-white shadow-sm mt-8">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl">
                      Accounts Health Overview (PULSE)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="overflow-x-auto">
                      <div className="w-full">
                        {/* Fixed table header */}
                        <table className="w-full text-left">
                          <thead className="sticky top-0 bg-white z-10">
                            <tr className="text-sm text-gray-500">
                              <th className="py-3 px-4">Account</th>
                              <th className="py-3 px-4">FIN</th>
                              <th className="py-3 px-4">USE</th>
                              <th className="py-3 px-4">SENT</th>
                              <th className="py-3 px-4">ENG</th>
                              <th className="py-3 px-4">Overall</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                        </table>

                        {/* Scrollable table body - shows 5 rows, rest scrollable */}
                        <div className="overflow-y-auto max-h-[380px]">
                          <table className="w-full text-left">
                            <tbody>
                              {(currentSet.length ? currentSet : customers).map(
                                (c) => (
                                  <tr key={c.id} className="border-t">
                                    <td className="py-4 px-4 font-medium text-slate-900">
                                      {c.name}
                                    </td>
                                    <td className="py-4 px-4">
                                      {pill(c.financial_score)}
                                    </td>
                                    <td className="py-4 px-4">
                                      {pill(c.usage_score)}
                                    </td>
                                    <td className="py-4 px-4">
                                      {pill(c.sentiment_score)}
                                    </td>
                                    <td className="py-4 px-4">
                                      {pill(c.engagement_score)}
                                    </td>
                                    <td className="py-4 px-4">
                                      {pill(c.overall_score)}
                                    </td>
                                    {/* NEW per-company Create Plan */}
                                    <td className="py-4 px-4 text-right">
                                      <Button
                                        size="sm"
                                        className="h-10 px-4 rounded-xl
    bg-blue-600 text-white
    shadow-sm hover:shadow-md
    hover:bg-blue-700
    transition-all
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
    disabled:opacity-70 disabled:cursor-not-allowed"
                                        onClick={() =>
                                          navigate(`/health-scores/${c.id}`)
                                        }
                                      >
                                        View Details
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ===== 3) Accounts by ARR (heatmap style) ===== */}
                <Card className="rounded-xl border bg-white shadow-sm mt-8">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl">
                      Accounts by ARR (heatmap)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 space-y-4">
                    {(currentSet.length ? currentSet : customers)
                      .slice()
                      .sort((a, b) => b.mrr - a.mrr)
                      .map((c) => {
                        const max = Math.max(
                          1,
                          ...(currentSet.length ? currentSet : customers).map(
                            (x) => x.mrr
                          )
                        );
                        const pct = Math.max(0.08, c.mrr / max); // min width so label stays readable
                        return (
                          <div
                            key={c.id}
                            className="rounded-lg text-white px-5 py-4 font-semibold"
                            style={{
                              background:
                                "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
                              width: `${pct * 100}%`,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{c.name}</span>
                              <span>
                                $
                                {c.mrr.toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
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

export default HealthScoresDashboard;
