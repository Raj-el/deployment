import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";
import { DataSourcePanel } from "@/components/DataSourcePanel";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Accendo Platform</h1>
            </div>
          </header>
          <div className="flex-1 flex">
            <MainContent />
            <DataSourcePanel />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
