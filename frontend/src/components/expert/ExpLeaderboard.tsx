import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Award,
  Building2,
  CalendarClock,
  Layers,
} from "lucide-react";

/* ----------------------------------------------------------------
   MOCK DATA (replace with API):
   BACKEND: expose GET /api/experts/leaderboard?bu=&product=&period=
   Response shape should include contributionScore for sorting by rank.
------------------------------------------------------------------ */
type Expert = {
  id: string;
  name: string;
  initials: string;
  businessUnit: string;
  productArea: string;
  company: string;
  title: string;
  contributionScore: number; // used for rank
  helpfulVotes: number; // for profile stats later
};

const MOCK_EXPERTS: Expert[] = [
  {
    id: "e1",
    name: "Laura Petrova",
    initials: "LP",
    businessUnit: "Enterprise",
    productArea: "Core Platform",
    company: "DataAnalytics Corp",
    title: "Principal Solutions Architect",
    contributionScore: 99,
    helpfulVotes: 320,
  },
  {
    id: "e2",
    name: "Daniel Thompson",
    initials: "DT",
    businessUnit: "Customer Success",
    productArea: "Integrations",
    company: "DataAnalytics Corp",
    title: "Senior Tech Service Rep",
    contributionScore: 82,
    helpfulVotes: 270,
  },
  {
    id: "e3",
    name: "Sarah Chen",
    initials: "SC",
    businessUnit: "Customer Success",
    productArea: "Adoption & Training",
    company: "DataAnalytics Corp",
    title: "Customer Success Manager",
    contributionScore: 65,
    helpfulVotes: 210,
  },
  {
    id: "e4",
    name: "David Miller",
    initials: "DM",
    businessUnit: "Support",
    productArea: "Core Platform",
    company: "DataAnalytics Corp",
    title: "Support Lead",
    contributionScore: 41,
    helpfulVotes: 140,
  },
  {
    id: "e5",
    name: "Michael Richard",
    initials: "MR",
    businessUnit: "Customer Success",
    productArea: "Insights",
    company: "DataAnalytics Corp",
    title: "Head of Customer Success",
    contributionScore: 25,
    helpfulVotes: 120,
  },
];

/* Small helper to color the top-3 medals */
const medalStyles = (rank: number) => {
  if (rank === 1) return "bg-yellow-100 text-yellow-700 ring-yellow-300";
  if (rank === 2) return "bg-gray-100 text-gray-700 ring-gray-300";
  if (rank === 3) return "bg-amber-100 text-amber-700 ring-amber-300";
  return "bg-slate-100 text-slate-600 ring-slate-200";
};

export function ExpLeaderboard() {
  // Filters
  const [bu, setBu] = useState<string>("all");
  const [product, setProduct] = useState<string>("all");
  const [period, setPeriod] = useState<string>("qtr"); // qtr | month | year

  // Local copy to simulate live updates (mock only)
  const [experts, setExperts] = useState<Expert[]>(MOCK_EXPERTS);

  /* ----------------------------------------------------------------
     BACKEND: Replace this mock with Server-Sent Events / WebSockets
     to push incremental contributionScore changes in real time.
     Example: subscribe to /events/experts and PATCH local state.
  ------------------------------------------------------------------ */
  useEffect(() => {
    const t = setInterval(() => {
      setExperts((prev) =>
        prev.map((e) =>
          Math.random() < 0.06
            ? { ...e, contributionScore: e.contributionScore + 1 }
            : e
        )
      );
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Options generated from dataset
  const buOptions = useMemo(
    () => Array.from(new Set(MOCK_EXPERTS.map((e) => e.businessUnit))),
    []
  );
  const productOptions = useMemo(
    () => Array.from(new Set(MOCK_EXPERTS.map((e) => e.productArea))),
    []
  );

  // Apply filters and ranking
  const filtered = useMemo(() => {
    const base = experts.filter((e) => {
      const okBu = bu === "all" || e.businessUnit === bu;
      const okProd = product === "all" || e.productArea === product;
      return okBu && okProd;
    });

    // BACKEND: sorting should be done server-side for big lists
    return [...base].sort((a, b) => b.contributionScore - a.contributionScore);
  }, [experts, bu, product]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Expert Leaderboard</h1>
            </div>
            <div className="ml-auto" />
          </header>

          <div className="flex-1 flex">
            {/* MAIN */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                {/* Back link */}
                <div className="mb-4">
                  <Link
                    to="/experts"
                    className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Experts
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-sky-700" />
                  <h2 className="text-xl font-semibold">
                    Expert Leaderboard - DataAnalytics Corp
                  </h2>
                </div>
                <p className="text-slate-600 mt-2">
                  Recognizing top contributing team members based on their
                  expertise and successful customer engagements.
                </p>

                {/* Filters */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Select value={bu} onValueChange={setBu}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <SelectValue placeholder="All Business Units" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Business Units</SelectItem>
                      {buOptions.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-slate-500" />
                        <SelectValue placeholder="All Product Areas" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Product Areas</SelectItem>
                      {productOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-slate-500" />
                        <SelectValue placeholder="Time Period" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {/* BACKEND: use this param for server aggregation window */}
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="qtr">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Count */}
                <p className="text-xs text-slate-500 mt-3">
                  {filtered.length} Results
                </p>

                {/* Cards grid */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((e, idx) => {
                    const rank = idx + 1;
                    const medal = medalStyles(rank);
                    return (
                      <Card key={e.id} className="rounded-2xl">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            {/* Left section: avatar + name */}
                            <div className="flex items-center gap-3">
                              <div
                                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ring-2 ${medal}`}
                              >
                                {e.initials}
                              </div>
                              <div>
                                <CardTitle className="text-[15px] font-semibold">
                                  {e.name}
                                </CardTitle>
                                <Badge variant="secondary" className="mt-1">
                                  Contributions: {e.contributionScore}
                                </Badge>
                              </div>
                            </div>

                            {/* Rank pill */}
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ring-1 ${medal}`}
                            >
                              #{rank}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="text-sm text-slate-600">
                          <div className="grid grid-cols-2">
                            <div>
                              <div className="mb-2">
                                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                                  Business unit
                                </div>
                                <div>{e.businessUnit}</div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-[11px]"
                              >
                                {e.company}
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="mb-2">
                                <div className="text-[11px] uppercase tracking-wide text-slate-400">
                                  Job title
                                </div>
                                <div>{e.title}</div>
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {e.productArea}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                  Leaderboard is updated based on AI-analyzed contributions.
                </p>
              </div>
            </main>

            {/* RIGHT RAIL (optional) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ExpLeaderboard;
