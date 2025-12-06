// src/pages/experts/ExpertDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";
import { Trophy, MessageSquareText } from "lucide-react";

export function ExpertDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left navigation */}
        <AppSidebar />

        {/* Main column */}
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Experts</h1>
            </div>
          </header>

          {/* Content area */}
          <div className="flex-1 flex">
            {/* CENTER */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1200px] px-6 py-6 font-['Poppins']">
                <h2 className="text-2xl font-bold text-slate-900">Experts</h2>
                <p className="text-slate-600 mt-1 mb-6">
                  Connect with experts and access specialized knowledge.
                </p>

                {/* Two-column cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Leaderboard */}
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-600">
                          <Trophy className="h-5 w-5" />
                        </span>
                        <span>Leaderboard</span>
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        Experts Leaderboard
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* BACKEND: You can surface a summary here (top 3 experts) once the API is ready */}
                      <Link to="/expert-dashboard/leaderboard">
                        <Button className="w-full h-10 bg-slate-900 hover:bg-slate-800 rounded-lg">
                          View Leaderboard
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Questions */}
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600">
                          <MessageSquareText className="h-5 w-5" />
                        </span>
                        <span>Questions</span>
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">
                        Questions asked to experts
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* BACKEND: Later, show count of open questions fetched from /api/experts/questions?status=open */}
                      <Link to="/expert-dashboard/questions">
                        <Button className="w-full h-10 bg-slate-900 hover:bg-slate-800 rounded-lg">
                          View Questions
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>

            {/* RIGHT RAIL (kept for consistency; hide if not needed) */}
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ExpertDashboard;
