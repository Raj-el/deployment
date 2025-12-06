import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ExpertInTheLoop } from "@/components/gem-stone/ExpertInTheLoop";
import { ValueExpansion } from "@/components/gem-stone/ValueExpansion";
import { ProductFeedbackLoop } from "@/components/gem-stone/ProductFeedbackLoop";
import { RevenueArchitecture } from "@/components/gem-stone/RevenueArchitecture";
import { OnboardingDashboard } from "@/components/onboarding/OnboardingDashboard";
import { CurrentProjects } from "@/components/onboarding/CurrentProjects";
import { NewProject } from "@/components/onboarding/NewProject";
import { Playbooks } from "@/components/onboarding/Playbooks";
import { OverviewDashboard } from "@/components/OverviewDashboard";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { RoleManagement } from "@/components/admin/RoleManagement";
import { FeatureFlags } from "@/components/admin/FeatureFlags";
import { InstanceConfiguration } from "@/components/admin/InstanceConfiguration";
import { Glossary } from "@/components/admin/Glossary";
import { SecuritySettings } from "@/components/admin/SecuritySettings";
import { SubscriptionManagement } from "@/components/admin/SubscriptionManagement";
import { AccountIntake } from "@/components/admin/AccountIntake";
import { LibraryHub } from "@/components/library/LibraryHub";
import { ContentManager } from "@/components/library/ContentManager";
import { Competitors } from "@/components/library/Competitors";
import { GetWellPlansDashboard } from "@/components/get-well-plans/GetWellPlansDashboard";
import { CreatePlan } from "@/components/get-well-plans/CreatePlan";
import { PlanDetails } from "@/components/get-well-plans/PlanDetails";
import ExpertConsultation from "@/components/expert/ExpertConsultation";
import { ExpertDashboard } from "@/components/expert/ExpertDashboard";
import { ExpLeaderboard } from "@/components/expert/ExpLeaderboard";
import { ExpQuestions } from "@/components/expert/ExpQuestions";
import { HealthScoresDashboard } from "@/components/health-scores/HealthScoresDashboard";
import { AccountHealth } from "@/components/health-scores/AccountHealth";
import { LaunchedProject } from "@/components/projects/ProjectsDashboard";
import { CustomersDashboard } from "@/components/customers/CustomersDashboard";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { UsageAnalytics } from "@/components/analytics/UsageAnalytics";
import { ProductAnalysis } from "@/components/analytics/ProductAnalysis";
import { CustomerAnalysis } from "@/components/analytics/CustomerAnalysis";
import { MarketingAnalysis } from "@/components/analytics/MarketingAnalysis";
import { FinancialAnalysis } from "@/components/analytics/FinancialAnalysis";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { MessagesDashboard } from "@/components/messages/MessagesDashboard";
import { SettingsDashboard } from "@/components/settings/SettingsDashboard";
import { HelpCenter } from "@/components/help/HelpCenter";
import { CSQuery } from "@/components/cs-query/CSQuery";

import { UnderDevelopment } from "@/components/UnderDevelopment";

export function MainContent() {
  return (
    <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50/30 font-['Poppins']">
      <Routes>
        <Route index element={<OverviewDashboard />} />
        <Route path="/" element={<OverviewDashboard />} />
        <Route path="/dashboard" element={<OverviewDashboard />} />

        {/* Onboarding - redirect to main dashboard */}
        <Route path="/onboarding" element={<OnboardingDashboard />} />
        <Route
          path="/onboarding/*"
          element={<Navigate to="/onboarding" replace />}
        />
        <Route path="/onboarding/current" element={<CurrentProjects />} />
        <Route path="/onboarding/new" element={<NewProject />} />
        <Route path="/onboarding/playbooks" element={<Playbooks />} />
        {/* Health Scores - redirect to main dashboard */}
        <Route path="/health-scores" element={<HealthScoresDashboard />} />
        <Route
          path="/health-scores/*"
          element={<Navigate to="/health-scores" replace />}
        />
        <Route path="/health-scores/:accountId" element={<AccountHealth />} />
        {/* Get Well Plans - redirect to main dashboard */}
        <Route path="/get-well-plans" element={<GetWellPlansDashboard />} />
        {/* <Route
          path="/get-well-plans/*"
          element={<Navigate to="/get-well-plans" replace />}
        /> */}
        <Route path="/get-well-plans/create" element={<CreatePlan />} />
        <Route path="/get-well-plans/:planId" element={<PlanDetails />} />
        {/* CS Query - Under Development */}
        <Route path="/cs-query" element={<CSQuery />} />
        {/* Reports - redirect to main dashboard */}
        <Route path="/reports" element={<ReportsDashboard />} />
        <Route path="/reports/*" element={<Navigate to="/reports" replace />} />

        {/* Analytics - redirect to main dashboard */}
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route
          path="/analytics/*"
          element={<Navigate to="/analytics" replace />}
        />
        <Route path="/analytics/usage" element={<UsageAnalytics />} />
        <Route path="/analytics/product" element={<ProductAnalysis />} />
        <Route path="/analytics/customers" element={<CustomerAnalysis />} />
        <Route path="/analytics/sales" element={<MarketingAnalysis />} />
        <Route path="/analytics/financial" element={<FinancialAnalysis />} />

        {/* Messages - redirect to main dashboard */}
        <Route path="/messages" element={<MessagesDashboard />} />
        <Route
          path="/messages/*"
          element={<Navigate to="/messages" replace />}
        />
        {/* Library - redirect to main dashboard */}
        <Route path="/library" element={<LibraryHub />} />
        <Route path="/library/content-manager" element={<ContentManager />} />
        <Route path="/library/competitors" element={<Competitors />} />
        {/* Settings - redirect to main dashboard */}
        <Route path="/settings" element={<SettingsDashboard />} />
        <Route
          path="/settings/*"
          element={<Navigate to="/settings" replace />}
        />
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/roles" element={<RoleManagement />} />
        <Route path="/admin/features" element={<FeatureFlags />} />
        {/* Admin security/settings */}
        <Route path="/admin/security" element={<SecuritySettings />} />
        {/* Admin management routes */}
        <Route path="/admin/glossary" element={<Glossary />} />
        <Route path="/admin/instance" element={<InstanceConfiguration />} />
        <Route
          path="/admin/subscription"
          element={<SubscriptionManagement />}
        />
        <Route path="/account-intake" element={<AccountIntake />} />
        {/* Expert Consultation */}
        <Route path="/expert-dashboard" element={<ExpertDashboard />} />
        <Route
          path="/expert-dashboard/leaderboard"
          element={<ExpLeaderboard />}
        />
        <Route path="/expert-dashboard/questions" element={<ExpQuestions />} />

        {/* GEM STONE ROUTES */}
        <Route path="/gem-stone/value-expansion" element={<ValueExpansion />} />
        <Route
          path="/gem-stone/expert-in-the-loop"
          element={<ExpertInTheLoop />}
        />
        <Route
          path="/gem-stone/product-feedback-loop"
          element={<ProductFeedbackLoop />}
        />
        <Route
          path="/gem-stone/revenue-architecture"
          element={<RevenueArchitecture />}
        />
        {/* Projects and Customers */}
        <Route path="/projects" element={<LaunchedProject />} />
        <Route path="/customers" element={<CustomersDashboard />} />
        {/* Help */}
        <Route path="/help" element={<HelpCenter />} />
      </Routes>
    </main>
  );
}
