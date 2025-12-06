// src/components/customers/CustomersDashboard.tsx
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
  Users,
  Plus,
  Search,
  Filter,
  Building,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

/* ---- App shell (same as Dashboard/LibraryHub) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

const customerStats = [
  {
    title: "Total Customers",
    value: "324",
    change: "+18",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Accounts",
    value: "298",
    change: "+12",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "At Risk",
    value: "26",
    change: "-4",
    icon: AlertTriangle,
    color: "text-red-600",
  },
  {
    title: "Total ARR",
    value: "$2.4M",
    change: "+15%",
    icon: DollarSign,
    color: "text-emerald-600",
  },
];

const mockCustomers = [
  {
    id: "1",
    name: "Acme Corporation",
    logo: "AC",
    industry: "Technology",
    size: "Enterprise",
    arr: "$125,000",
    healthScore: 85,
    status: "Active",
    csm: "Sarah Johnson",
    lastContact: "2024-01-20",
    renewalDate: "2024-06-15",
    risk: "Low",
    contacts: [
      { name: "John Smith", role: "CEO", email: "john@acme.com" },
      { name: "Jane Doe", role: "CTO", email: "jane@acme.com" },
    ],
  },
  {
    id: "2",
    name: "TechStart Solutions",
    logo: "TS",
    industry: "Startup",
    size: "Mid-Market",
    arr: "$75,000",
    healthScore: 45,
    status: "At Risk",
    csm: "Mike Chen",
    lastContact: "2024-01-18",
    renewalDate: "2024-04-01",
    risk: "High",
    contacts: [
      { name: "Alex Rodriguez", role: "Founder", email: "alex@techstart.com" },
    ],
  },
  {
    id: "3",
    name: "Global Industries",
    logo: "GI",
    industry: "Manufacturing",
    size: "Enterprise",
    arr: "$200,000",
    healthScore: 92,
    status: "Active",
    csm: "Emma Wilson",
    lastContact: "2024-01-22",
    renewalDate: "2024-08-30",
    risk: "Low",
    contacts: [
      { name: "David Kim", role: "VP Operations", email: "david@global.com" },
      { name: "Lisa Park", role: "IT Director", email: "lisa@global.com" },
    ],
  },
];

export function CustomersDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<
    (typeof mockCustomers)[0] | null
  >(null);

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      customer.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRisk =
      riskFilter === "all" ||
      customer.risk.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "High":
        return "destructive";
      case "Medium":
        return "outline";
      case "Low":
        return "default";
      default:
        return "secondary";
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
              <h1 className="text-lg font-semibold">Customers</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                {/* ===== Your original CustomersDashboard UI (unchanged) ===== */}

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Customer Management
                    </h1>
                    <p className="text-gray-600">
                      Manage customer relationships and track account health
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Export
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
                      Add Customer
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  {customerStats.map((stat) => (
                    <Card
                      key={stat.title}
                      className="card-3d hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <p className="text-sm text-green-600">
                          {stat.change} from last month
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  {/* Main Customer List */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Filters */}
                    <Card className="card-3d">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search customers..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="at risk">At Risk</SelectItem>
                              <SelectItem value="churned">Churned</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={riskFilter}
                            onValueChange={setRiskFilter}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Risk Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Risk</SelectItem>
                              <SelectItem value="high">High Risk</SelectItem>
                              <SelectItem value="medium">
                                Medium Risk
                              </SelectItem>
                              <SelectItem value="low">Low Risk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer List */}
                    <div className="space-y-4">
                      {filteredCustomers.map((customer) => (
                        <Card
                          key={customer.id}
                          className="card-3d hover:shadow-lg transition-all duration-300 cursor-pointer"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                                  {customer.logo}
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {customer.name}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>{customer.industry}</span>
                                    <span>•</span>
                                    <span>{customer.size}</span>
                                    <span>•</span>
                                    <span>CSM: {customer.csm}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant={
                                    customer.status === "Active"
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {customer.status}
                                </Badge>
                                <Badge
                                  variant={getRiskBadgeVariant(customer.risk)}
                                >
                                  {customer.risk} Risk
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  <span>ARR</span>
                                </div>
                                <p className="font-medium text-lg">
                                  {customer.arr}
                                </p>
                              </div>
                              <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                  <span>Health Score</span>
                                </div>
                                <div
                                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${getHealthScoreColor(
                                    customer.healthScore
                                  )}`}
                                >
                                  {customer.healthScore}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                  <Phone className="w-4 h-4 mr-1" />
                                  <span>Last Contact</span>
                                </div>
                                <p className="font-medium">
                                  {new Date(
                                    customer.lastContact
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>Renewal</span>
                                </div>
                                <p className="font-medium">
                                  {new Date(
                                    customer.renewalDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <div className="flex items-center text-gray-500 mb-1">
                                  <Users className="w-4 h-4 mr-1" />
                                  <span>Contacts</span>
                                </div>
                                <p className="font-medium">
                                  {customer.contacts.length} contacts
                                </p>
                              </div>
                            </div>

                            {/* Key Contacts */}
                            <div className="mt-4">
                              <p className="text-sm text-gray-500 mb-2">
                                Key Contacts:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {customer.contacts.map((contact, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full text-sm"
                                  >
                                    <span className="font-medium">
                                      {contact.name}
                                    </span>
                                    <span className="text-gray-500">
                                      ({contact.role})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Customer Details */}
                    {selectedCustomer && (
                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Building className="w-5 h-5" />
                            <span>Customer Details</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">
                              {selectedCustomer.name}
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Industry:</span>
                                <span>{selectedCustomer.industry}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Size:</span>
                                <span>{selectedCustomer.size}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">ARR:</span>
                                <span className="font-medium">
                                  {selectedCustomer.arr}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">
                                  Health Score:
                                </span>
                                <span className="font-medium">
                                  {selectedCustomer.healthScore}/100
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Quick Actions</h5>
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Schedule Call
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                View Timeline
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Upcoming Renewals */}
                    <Card className="card-3d">
                      <CardHeader>
                        <CardTitle>Upcoming Renewals</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <div>
                              <p className="font-medium text-sm">
                                TechStart Solutions
                              </p>
                              <p className="text-xs text-gray-600">
                                Due: Apr 1, 2024
                              </p>
                            </div>
                            <Badge variant="destructive" className="text-xs">
                              High Risk
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                            <div>
                              <p className="font-medium text-sm">
                                Innovation Labs
                              </p>
                              <p className="text-xs text-gray-600">
                                Due: Apr 15, 2024
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Medium Risk
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <div>
                              <p className="font-medium text-sm">
                                Acme Corporation
                              </p>
                              <p className="text-xs text-gray-600">
                                Due: Jun 15, 2024
                              </p>
                            </div>
                            <Badge variant="default" className="text-xs">
                              Low Risk
                            </Badge>
                          </div>
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

export default CustomersDashboard;
