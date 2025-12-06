// src/components/health-scores/AccountHealth.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import healthScoreService from "@/services/healthScoreService";
import planService, { Plan, PlanRecommendation } from "@/services/planService";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  MessageSquare,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";

/* ---- App shell ---- */
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataSourcePanel } from "@/components/DataSourcePanel";

/* ---------------- Types ---------------- */
type AccountHealthData = {
  accountId: string;
  accountName: string;
  overallHealthScore: number;
  financialHealthScore: number;
  usageHealthScore: number;
  sentimentHealthScore: number;
  engagementHealthScore: number;
  updatedAt: string;
};

/* ---------------- Component ---------------- */
export function AccountHealth() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accountData, setAccountData] = useState<AccountHealthData | null>(
    null
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch account health data and plans
  useEffect(() => {
    const fetchData = async () => {
      if (!accountId) {
        toast({
          title: "Error",
          description: "No account ID provided",
          variant: "destructive",
        });
        navigate("/health-scores");
        return;
      }

      setLoading(true);
      try {
        // Fetch health scores
        const healthResponse = await healthScoreService.getHealthScores({
          accountId: accountId,
        });

        if (healthResponse.customers && healthResponse.customers.length > 0) {
          const customer = healthResponse.customers[0];
          setAccountData({
            accountId: customer.accountId,
            accountName: customer.accountName || "Unknown Account",
            overallHealthScore: customer.overallHealthScore || 0,
            financialHealthScore: customer.financialHealthScore || 0,
            usageHealthScore: customer.usageHealthScore || 0,
            sentimentHealthScore: customer.sentimentHealthScore || 0,
            engagementHealthScore: customer.engagementHealthScore || 0,
            updatedAt: customer.updatedAt || new Date().toISOString(),
          });

          // Fetch plans for this account
          try {
            const accountPlans = await planService.getPlansForAccount(
              accountId
            );
            setPlans(accountPlans);
            console.log(
              `✅ Loaded ${accountPlans.length} plans for account ${accountId}`
            );
          } catch (planError) {
            console.warn("Could not fetch plans:", planError);
            // Don't fail the whole page if plans fail
          }
        } else {
          toast({
            title: "Account Not Found",
            description: "Could not find health data for this account",
            variant: "destructive",
          });
          navigate("/health-scores");
        }
      } catch (error) {
        console.error("Failed to fetch account data:", error);
        toast({
          title: "Error Loading Data",
          description: "Failed to fetch account data",
          variant: "destructive",
        });
        navigate("/health-scores");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, navigate, toast]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: "Low", variant: "default" as const };
    if (score >= 60) return { label: "Medium", variant: "default" as const };
    return { label: "High", variant: "destructive" as const };
  };

  const getTrendIcon = (score: number) => {
    if (score >= 70)
      return <TrendingUp className="inline-block w-6 h-6 ml-2" />;
    return <TrendingDown className="inline-block w-6 h-6 ml-2" />;
  };

  // Helper to format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper to get severity badge from focus area text
  const getSeverityFromText = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("critical") ||
      lowerText.includes("urgent") ||
      lowerText.includes("high")
    ) {
      return "High";
    }
    if (lowerText.includes("medium") || lowerText.includes("moderate")) {
      return "Medium";
    }
    return "Low";
  };

  // Helper to extract priority from recommendation
  const getPriority = (rec: string | PlanRecommendation): string => {
    if (typeof rec === "string") {
      const lowerRec = rec.toLowerCase();
      if (lowerRec.includes("urgent") || lowerRec.includes("immediate"))
        return "High";
      if (lowerRec.includes("soon") || lowerRec.includes("important"))
        return "Medium";
      return "Low";
    }
    return rec.priority || "Medium";
  };

  // Helper to format recommendation
  const formatRecommendation = (rec: string | PlanRecommendation) => {
    if (typeof rec === "string") {
      return {
        action: rec,
        owner: "CSM",
        impact: "To be determined",
        priority: getPriority(rec),
      };
    }
    return {
      action: rec.action,
      owner: rec.owner || "CSM",
      impact: rec.impact || "To be determined",
      priority: rec.priority || getPriority(rec.action),
    };
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
                <h1 className="text-lg font-semibold">Account Health</h1>
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

  if (!accountData) {
    return null;
  }

  const riskLevel = getRiskLevel(accountData.overallHealthScore);
  const hasPlans = plans.length > 0;

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
            <div className="ml-4 flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/health-scores")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Health Scores
              </Button>
            </div>
          </header>

          {/* Middle area: center content + right rail */}
          <div className="flex-1 flex">
            {/* CENTER CONTENT */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              <div className="mx-auto max-w-[1120px] px-6 py-6 font-['Poppins']">
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {accountData.accountName}
                      </h1>
                      <div className="flex items-center space-x-4">
                        <Badge variant={riskLevel.variant}>
                          {riskLevel.label} Risk
                        </Badge>
                        <span className="text-gray-600">
                          Account ID: {accountData.accountId}
                        </span>
                        {hasPlans && (
                          <Badge variant="outline" className="bg-blue-50">
                            {plans.length} Active{" "}
                            {plans.length === 1 ? "Plan" : "Plans"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Overall Health Score
                      </div>
                      <div
                        className={`text-4xl font-bold ${getScoreColor(
                          accountData.overallHealthScore
                        )}`}
                      >
                        {accountData.overallHealthScore}
                        {getTrendIcon(accountData.overallHealthScore)}
                      </div>
                    </div>
                  </div>

                  {/* FUSE Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Financial Card */}
                    <Card className="card-3d">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Financial
                        </CardTitle>
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            accountData.financialHealthScore
                          )}`}
                        >
                          {accountData.financialHealthScore}
                        </div>
                        <Progress
                          value={accountData.financialHealthScore}
                          className="mt-2"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          Contract value & payment status
                        </p>
                      </CardContent>
                    </Card>

                    {/* Usage Card */}
                    <Card className="card-3d">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Usage
                        </CardTitle>
                        <Zap className="h-6 w-6 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            accountData.usageHealthScore
                          )}`}
                        >
                          {accountData.usageHealthScore}
                        </div>
                        <Progress
                          value={accountData.usageHealthScore}
                          className="mt-2"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          Product adoption & engagement
                        </p>
                      </CardContent>
                    </Card>

                    {/* Sentiment Card */}
                    <Card className="card-3d">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Sentiment
                        </CardTitle>
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            accountData.sentimentHealthScore
                          )}`}
                        >
                          {accountData.sentimentHealthScore}
                        </div>
                        <Progress
                          value={accountData.sentimentHealthScore}
                          className="mt-2"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          Customer satisfaction & feedback
                        </p>
                      </CardContent>
                    </Card>

                    {/* Engagement Card */}
                    <Card className="card-3d">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Engagement
                        </CardTitle>
                        <Users className="h-6 w-6 text-orange-600" />
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-3xl font-bold ${getScoreColor(
                            accountData.engagementHealthScore
                          )}`}
                        >
                          {accountData.engagementHealthScore}
                        </div>
                        <Progress
                          value={accountData.engagementHealthScore}
                          className="mt-2"
                        />
                        <p className="text-xs text-gray-600 mt-2">
                          Relationship strength & activities
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Analysis */}
                  <Tabs defaultValue="risks" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="risks">Risk Factors</TabsTrigger>
                      <TabsTrigger value="recommendations">
                        Recommendations
                      </TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="insights">AI Insights</TabsTrigger>
                    </TabsList>

                    {/* Risk Factors Tab - from focusAreas */}
                    <TabsContent value="risks">
                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span>Risk Factors Analysis</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {!hasPlans ? (
                            <div className="text-center py-8 text-gray-500">
                              <p>
                                No active plans or risk factors identified for
                                this account.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {plans.flatMap((plan) =>
                                (plan.focusAreas || []).map(
                                  (focusArea, index) => {
                                    const severity =
                                      getSeverityFromText(focusArea);
                                    return (
                                      <div
                                        key={`${plan.id}-${index}`}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                      >
                                        <div className="flex-1">
                                          <div className="font-medium">
                                            {focusArea}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            From: {plan.title}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <Badge
                                            variant={
                                              severity === "High"
                                                ? "destructive"
                                                : severity === "Medium"
                                                ? "default"
                                                : "outline"
                                            }
                                          >
                                            {severity}
                                          </Badge>
                                          <TrendingDown className="w-4 h-4 text-red-500" />
                                        </div>
                                      </div>
                                    );
                                  }
                                )
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Recommendations Tab - from recommendations */}
                    <TabsContent value="recommendations">
                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span>AI-Generated Recommendations</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {!hasPlans ? (
                            <div className="text-center py-8 text-gray-500">
                              <p>
                                No recommendations available for this account.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {plans.flatMap((plan) =>
                                (plan.recommendations || []).map(
                                  (rec, index) => {
                                    const formatted = formatRecommendation(rec);
                                    return (
                                      <div
                                        key={`${plan.id}-${index}`}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                      >
                                        <div className="flex-1">
                                          <div className="font-medium">
                                            {formatted.action}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            Owner: {formatted.owner} • Expected:{" "}
                                            {formatted.impact}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                          <Badge
                                            variant={
                                              formatted.priority === "High"
                                                ? "destructive"
                                                : formatted.priority ===
                                                  "Medium"
                                                ? "default"
                                                : "secondary"
                                            }
                                          >
                                            {formatted.priority}
                                          </Badge>
                                          <Button size="sm">Create Task</Button>
                                        </div>
                                      </div>
                                    );
                                  }
                                )
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Timeline Tab - from dueDate */}
                    <TabsContent value="timeline">
                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5" />
                            <span>Plan Timeline</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {!hasPlans ? (
                            <div className="text-center py-8 text-gray-500">
                              <p>
                                No timeline information available for this
                                account.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {plans.map((plan) => (
                                <div
                                  key={plan.id}
                                  className="flex items-start justify-between p-4 border rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-lg mb-2">
                                      {plan.title}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                          Due: {formatDate(plan.dueDate)}
                                        </span>
                                      </div>
                                      <Badge variant="outline">
                                        {plan.status}
                                      </Badge>
                                    </div>
                                    <div className="mt-2 text-sm">
                                      <span className="font-medium">
                                        Created:
                                      </span>{" "}
                                      {formatDate(plan.createdAt)}
                                    </div>
                                    <div className="mt-1 text-sm">
                                      <span className="font-medium">
                                        Assigned to:
                                      </span>{" "}
                                      {plan.assignedTo}
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* AI Insights Tab - from summary */}
                    <TabsContent value="insights">
                      <Card className="card-3d">
                        <CardHeader>
                          <CardTitle>AI-Powered Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {!hasPlans ? (
                            <div className="text-center py-8 text-gray-500">
                              <p>
                                No AI insights available for this account yet.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {plans.map((plan, index) => (
                                <div
                                  key={plan.id}
                                  className={`p-4 rounded-lg ${
                                    index === 0
                                      ? "bg-red-50"
                                      : index === 1
                                      ? "bg-blue-50"
                                      : "bg-yellow-50"
                                  }`}
                                >
                                  <h4
                                    className={`font-semibold mb-2 ${
                                      index === 0
                                        ? "text-red-900"
                                        : index === 1
                                        ? "text-blue-900"
                                        : "text-yellow-900"
                                    }`}
                                  >
                                    {plan.title}
                                  </h4>
                                  <p className="text-sm">{plan.summary}</p>
                                  <div className="mt-2 text-xs text-gray-600">
                                    Plan Type: {plan.planType} • Created by:{" "}
                                    {plan.authorEmail}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
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

export default AccountHealth;
