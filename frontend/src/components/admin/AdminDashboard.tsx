// src/components/admin/AdminDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Key,
  BookOpen,
  Cog,
  ListChecks,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ---- App shell (same pattern as Dashboard/LibraryHub) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

type Tile = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  cta: string;
  to: string;
  iconBg: string;
  iconColor: string;
};

const tiles: Tile[] = [
  {
    title: "User Management",
    description: "Invite new users, reset passwords, grant access",
    icon: Users,
    cta: "Manage Users",
    to: "/admin/users",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Roles",
    description: "Create or edit user roles",
    icon: Shield,
    cta: "Manage Roles",
    to: "/admin/roles",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Features",
    description: "Add or edit feature flags",
    icon: ListChecks,
    cta: "Manage Features",
    to: "/admin/features",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Glossary",
    description: "Add or edit words in your glossary",
    icon: BookOpen,
    cta: "Edit Glossary",
    to: "/admin/glossary",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    title: "Instance Configuration",
    description: "Configuration for current App Instance",
    icon: Cog,
    cta: "Configure Instance",
    to: "/admin/instance",
    iconBg: "bg-slate-50",
    iconColor: "text-slate-700",
  },
  {
    title: "API Key Management",
    description: "See your API Keys",
    icon: Key,
    cta: "Manage API Keys",
    to: "/admin/security",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    title: "Subscription Management",
    description: "Manage your subscription",
    icon: CreditCard,
    cta: "Manage Subscription",
    to: "/admin/subscription",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

export function AdminDashboard() {
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
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-8">
                {/* Tile grid (matches second screenshot) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tiles.map((t) => (
                    <Card
                      key={t.title}
                      className="border bg-white hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div
                            className={`grid h-10 w-10 place-items-center rounded-md ${t.iconBg}`}
                          >
                            <t.icon className={`h-5 w-5 ${t.iconColor}`} />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {t.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {t.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link to={t.to}>
                          <Button className="w-full" variant="secondary">
                            {t.cta}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
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

export default AdminDashboard;
