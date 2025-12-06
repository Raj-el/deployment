// src/components/experts/ExpertConsultation.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  MessageSquare,
  Clock,
  Star,
  Users,
  Send,
  Filter,
} from "lucide-react";

/* ---- App shell (same as ReportsDashboard/LibraryHub) ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* ---------------- Mock Data ---------------- */
const mockExperts = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    expertise: "Product Adoption",
    rating: 4.9,
    available: true,
    responseTime: "< 2h",
  },
  {
    id: "2",
    name: "Mike Rodriguez",
    expertise: "Contract Negotiation",
    rating: 4.8,
    available: false,
    responseTime: "< 4h",
  },
  {
    id: "3",
    name: "Emma Thompson",
    expertise: "Customer Success",
    rating: 4.9,
    available: true,
    responseTime: "< 1h",
  },
];

const mockConsultations = [
  {
    id: "1",
    title: "High-value customer churn risk",
    expert: "Dr. Sarah Chen",
    status: "Completed",
    urgency: "High",
    createdAt: "2024-01-15",
    response:
      "Recommended immediate executive engagement and product training session.",
  },
  {
    id: "2",
    title: "Contract renewal strategy",
    expert: "Mike Rodriguez",
    status: "In Progress",
    urgency: "Medium",
    createdAt: "2024-01-20",
    response: null,
  },
];

/* ---------------- Body (your original UI) ---------------- */
export function ExpertConsultationBody() {
  const [activeTab, setActiveTab] = useState<"request" | "experts" | "history">(
    "request"
  );
  const [requestForm, setRequestForm] = useState({
    title: "",
    description: "",
    urgency: "",
    expertise: "",
    expertId: "",
  });

  const handleSubmitRequest = () => {
    console.log("Submitting expert request:", requestForm);
    alert("Expert consultation request submitted successfully!");
    setRequestForm({
      title: "",
      description: "",
      urgency: "",
      expertise: "",
      expertId: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-['Poppins']">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Expert Consultation
        </h1>
        <p className="text-gray-600">
          Get guidance from customer success experts
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <Button
          variant={activeTab === "request" ? "default" : "ghost"}
          onClick={() => setActiveTab("request")}
          className="rounded-b-none"
        >
          <Send className="w-4 h-4 mr-2" />
          Request Expert
        </Button>
        <Button
          variant={activeTab === "experts" ? "default" : "ghost"}
          onClick={() => setActiveTab("experts")}
          className="rounded-b-none"
        >
          <Users className="w-4 h-4 mr-2" />
          Available Experts
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          onClick={() => setActiveTab("history")}
          className="rounded-b-none"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          My Consultations
        </Button>
      </div>

      {/* Request Expert Tab */}
      {activeTab === "request" && (
        <Card className="card-3d">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Request Expert Consultation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Request Title</Label>
              <Input
                id="title"
                value={requestForm.title}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, title: e.target.value })
                }
                placeholder="Brief description of your request"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={requestForm.urgency}
                  onValueChange={(value) =>
                    setRequestForm({ ...requestForm, urgency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Within 24h</SelectItem>
                    <SelectItem value="medium">Medium - Within 4h</SelectItem>
                    <SelectItem value="high">High - Within 1h</SelectItem>
                    <SelectItem value="critical">
                      Critical - Immediate
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expertise">Expertise Area</Label>
                <Select
                  value={requestForm.expertise}
                  onValueChange={(value) =>
                    setRequestForm({ ...requestForm, expertise: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expertise needed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product-adoption">
                      Product Adoption
                    </SelectItem>
                    <SelectItem value="contract-negotiation">
                      Contract Negotiation
                    </SelectItem>
                    <SelectItem value="customer-success">
                      Customer Success
                    </SelectItem>
                    <SelectItem value="technical-integration">
                      Technical Integration
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={requestForm.description}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    description: e.target.value,
                  })
                }
                placeholder="Provide context, specific challenges, and what kind of guidance you're seeking"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmitRequest}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Available Experts Tab */}
      {activeTab === "experts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Experts</h2>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExperts.map((expert) => (
              <Card
                key={expert.id}
                className="card-3d hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <Badge variant={expert.available ? "default" : "secondary"}>
                      {expert.available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{expert.expertise}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{expert.rating}</span>
                      <span className="text-gray-600">(4.9/5.0)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        Response time: {expert.responseTime}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      variant={expert.available ? "default" : "outline"}
                      disabled={!expert.available}
                    >
                      {expert.available
                        ? "Request Consultation"
                        : "Currently Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Consultation History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Consultations</h2>

          <div className="space-y-4">
            {mockConsultations.map((consultation) => (
              <Card key={consultation.id} className="card-3d">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {consultation.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          consultation.urgency === "High"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {consultation.urgency}
                      </Badge>
                      <Badge
                        variant={
                          consultation.status === "Completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {consultation.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Expert: {consultation.expert}</span>
                    <span>
                      Created:{" "}
                      {new Date(consultation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                {consultation.response && (
                  <CardContent>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm">{consultation.response}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Page Wrapper (shell) ---------------- */
export default function ExpertConsultation() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Left nav */}
        <AppSidebar />

        {/* Center + Right rail */}
        <div className="flex-1 flex flex-col">
          {/* Top bar (same shell as Reports) */}
          <header className="h-14 border-b bg-white flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Expert Consultation</h1>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6">
                <ExpertConsultationBody />
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
