// src/components/reports/ReportsDashboard.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIChatbot } from "@/components/shared/AIChatbot";
import {
  FileText,
  Plus,
  Search,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Eye,
  Share,
  MoreHorizontal,
} from "lucide-react";

/* ---- App shell (same as LibraryHub/Dashboard) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

const reportCategories = [
  {
    id: "executive",
    name: "Executive Reports",
    count: 12,
    icon: TrendingUp,
    color: "text-purple-600",
  },
  {
    id: "customer",
    name: "Customer Health",
    count: 8,
    icon: Users,
    color: "text-blue-600",
  },
  {
    id: "financial",
    name: "Financial Reports",
    count: 15,
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    id: "operational",
    name: "Operational",
    count: 6,
    icon: BarChart3,
    color: "text-orange-600",
  },
];

const mockReports = [
  {
    id: "1",
    title: "Monthly Customer Health Report",
    description:
      "Comprehensive health score analysis across all customer segments",
    type: "customer",
    format: "PDF",
    lastGenerated: "2024-01-25T10:30:00",
    status: "Ready",
    schedule: "Monthly",
    recipients: ["CEO", "VP CS", "CSMs"],
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Executive Revenue Dashboard",
    description: "High-level revenue metrics and growth trends for leadership",
    type: "executive",
    format: "Dashboard",
    lastGenerated: "2024-01-25T08:00:00",
    status: "Generating",
    schedule: "Weekly",
    recipients: ["C-Suite", "Board"],
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "Churn Risk Analysis",
    description:
      "Detailed analysis of at-risk customers and intervention recommendations",
    type: "operational",
    format: "Excel",
    lastGenerated: "2024-01-24T16:45:00",
    status: "Ready",
    schedule: "Bi-weekly",
    recipients: ["CS Team", "Sales Team"],
    size: "890 KB",
  },
  {
    id: "4",
    title: "Quarterly Business Review Report",
    description:
      "Comprehensive quarterly performance analysis and strategic insights",
    type: "executive",
    format: "PowerPoint",
    lastGenerated: "2024-01-20T14:20:00",
    status: "Ready",
    schedule: "Quarterly",
    recipients: ["All Stakeholders"],
    size: "5.2 MB",
  },
];

const reportTemplates = [
  {
    name: "Customer Health Score Report",
    category: "customer",
    estimatedTime: "5 min",
  },
  {
    name: "Revenue Performance Report",
    category: "financial",
    estimatedTime: "3 min",
  },
  {
    name: "Team Performance Report",
    category: "operational",
    estimatedTime: "4 min",
  },
  { name: "Executive Summary", category: "executive", estimatedTime: "2 min" },
];

export function ReportsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = mockReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || report.type === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      report.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Ready":
        return "default";
      case "Generating":
        return "secondary";
      case "Failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "PDF":
        return FileText;
      case "Excel":
        return BarChart3;
      case "PowerPoint":
        return PieChart;
      case "Dashboard":
        return TrendingUp;
      default:
        return FileText;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar (same shell as LibraryHub/Dashboard) */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Reports</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* ===== Your original ReportsDashboard UI (unchanged) ===== */}

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Reports & Analytics
                    </h1>
                    <p className="text-gray-600">
                      Generate and manage customer success reports and insights
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                    <Button
                      className="h-10 px-4 rounded-xl
    bg-blue-600 text-white
    shadow-sm hover:shadow-md
    hover:bg-blue-700
    transition-all
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
    disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Report
                    </Button>
                  </div>
                </div>

                {/* Report Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  {reportCategories.map((category) => (
                    <Card
                      key={category.id}
                      className="card-3d hover:shadow-xl transition-all duration-300 cursor-pointer"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {category.name}
                        </CardTitle>
                        <category.icon
                          className={`h-6 w-6 ${category.color}`}
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-1">
                          {category.count}
                        </div>
                        <p className="text-sm text-gray-600">
                          Available reports
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  {/* Main Reports List */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Filters */}
                    <Card className="card-3d">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search reports..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Categories
                              </SelectItem>
                              <SelectItem value="executive">
                                Executive
                              </SelectItem>
                              <SelectItem value="customer">
                                Customer Health
                              </SelectItem>
                              <SelectItem value="financial">
                                Financial
                              </SelectItem>
                              <SelectItem value="operational">
                                Operational
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="generating">
                                Generating
                              </SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Reports List */}
                    <div className="space-y-4">
                      {filteredReports.map((report) => {
                        const FormatIcon = getFormatIcon(report.format);
                        return (
                          <Card
                            key={report.id}
                            className="card-3d hover:shadow-lg transition-all duration-300"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FormatIcon className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-1">
                                      {report.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                      {report.description}
                                    </p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                      <span>Format: {report.format}</span>
                                      <span>•</span>
                                      <span>Size: {report.size}</span>
                                      <span>•</span>
                                      <span>Schedule: {report.schedule}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={getStatusBadgeVariant(
                                      report.status
                                    )}
                                  >
                                    {report.status}
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                <div>
                                  <div className="flex items-center text-gray-500 mb-1">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>Last Generated</span>
                                  </div>
                                  <p className="font-medium">
                                    {new Date(
                                      report.lastGenerated
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <div className="flex items-center text-gray-500 mb-1">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>Recipients</span>
                                  </div>
                                  <p className="font-medium">
                                    {report.recipients.length} stakeholders
                                  </p>
                                </div>
                                <div>
                                  <div className="flex items-center text-gray-500 mb-1">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>Frequency</span>
                                  </div>
                                  <p className="font-medium">
                                    {report.schedule}
                                  </p>
                                </div>
                                <div>
                                  <div className="flex items-center text-gray-500 mb-1">
                                    <FileText className="w-4 h-4 mr-1" />
                                    <span>Type</span>
                                  </div>
                                  <p className="font-medium capitalize">
                                    {report.type}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {report.recipients.map((recipient, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {recipient}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={report.status !== "Ready"}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={report.status !== "Ready"}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={report.status !== "Ready"}
                                  >
                                    <Share className="w-4 h-4 mr-2" />
                                    Share
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Generate */}
                    <Card className="card-3d">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Plus className="w-5 h-5" />
                          <span>Quick Generate</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {reportTemplates.map((template, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-sm">
                                  {template.name}
                                </h4>
                                <p className="text-xs text-gray-600 capitalize">
                                  {template.category}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {template.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="card-3d">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm space-y-2">
                          <div className="flex items-center space-x-2">
                            <Download className="w-4 h-4 text-blue-500" />
                            <span>Health Report downloaded by Sarah</span>
                            <span className="text-xs text-gray-500">
                              2h ago
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-green-500" />
                            <span>Executive Dashboard generated</span>
                            <span className="text-xs text-gray-500">
                              4h ago
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Share className="w-4 h-4 text-purple-500" />
                            <span>QBR Report shared with board</span>
                            <span className="text-xs text-gray-500">
                              1d ago
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span>Monthly reports scheduled</span>
                            <span className="text-xs text-gray-500">
                              2d ago
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Report Statistics */}
                    <Card className="card-3d">
                      <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Reports Generated</span>
                          <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">This Month</span>
                          <span className="font-medium">89</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg Generation Time</span>
                          <span className="font-medium">3.2 min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Most Popular</span>
                          <span className="font-medium text-xs">
                            Customer Health
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                {/* ===== end original UI ===== */}
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

export default ReportsDashboard;
