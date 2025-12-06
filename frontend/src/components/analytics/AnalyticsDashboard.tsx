// src/components/analytics/AnalyticsDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Shell
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

// Icons
import {
  BarChart2, // Usage
  Target, // Product
  Users, // Customer
  TrendingUp, // Sales & Marketing
  DollarSign, // Financial
} from "lucide-react";

type Tile = {
  key: string;
  title: string;
  desc: string;
  cta: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const tiles: Tile[] = [
  {
    key: "usage",
    title: "Usage Analytics",
    desc: "Detailed insights into platform usage and feature adoption by users and accounts.",
    cta: "View Usage Data",
    to: "/analytics/usage",
    icon: BarChart2,
  },
  {
    key: "product",
    title: "Product Analytics",
    desc: "Insights into product feature usage, performance, and user interaction patterns.",
    cta: "Explore Product Insights",
    to: "/analytics/product",
    icon: Target,
  },
  {
    key: "customer",
    title: "Customer Analytics",
    desc: "Deep dive into specific customer metrics, health trends, and engagement patterns.",
    cta: "Analyze Customers",
    to: "/analytics/customers",
    icon: Users,
  },
  {
    key: "sales",
    title: "Sales & Marketing Analytics",
    desc: "Track sales performance, marketing campaign effectiveness, and lead generation.",
    cta: "View Sales & Marketing Data",
    to: "/analytics/sales",
    icon: TrendingUp,
  },
  {
    key: "financial",
    title: "Financial Analytics",
    desc: "CFO/CEO dashboard with key financial metrics including RPO, NRR, churn, and revenue forecasting from a CS perspective.",
    cta: "View Financial Performance",
    to: "/analytics/financial",
    icon: DollarSign,
  },
];
// just above the bottom (financial) card
const bottom = tiles[4];
const BottomIcon = bottom.icon;

export function AnalyticsDashboard() {
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
              <h1 className="text-lg font-semibold">Analytics Dashboard</h1>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* 2-column layout like your screenshot (2x2 + 1 full row) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tiles.map(({ key, icon: Icon, title, desc, to, cta }) => (
                    <Card
                      key={key}
                      className="rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-3 text-[18px]">
                          <Icon className="w-6 h-6 text-slate-600" />
                          <span>{title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {desc}
                        </p>
                        <div className="max-w-md">
                          <Button
                            className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]"
                            asChild
                          >
                            <Link to={to}>{cta}</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </main>

            {/* RIGHT RAIL (self-closing; do not pass children) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

/* ===================== Backend integration notes =====================
- This page is a launcher only. Inner pages should fetch and render:
  - /analytics/usage            -> DAU/WAU/MAU, feature adoption, cohort retention
  - /analytics/product          -> feature funnels, drop-off, perf, heatmaps (if tracked)
  - /analytics/customers        -> health score dist, segments, lifecycle stage trends
  - /analytics/sales            -> pipeline sourced by CS, expansion MRR, campaign lift
  - /analytics/financial        -> RPO/NRR/Gross/Net churn, RPO roll-forward, forecast
- Add RBAC guards (e.g., “Analyst”, “CS Ops”, “Finance”) before serving data.
- Prefer server-driven filters via query params: ?range=last90d&segment=enterprise
- Emit audit events when users export/download analytics.
====================================================================== */
