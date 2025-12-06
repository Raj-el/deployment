import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { ExpertInTheLoop } from "./components/gem-stone/ExpertInTheLoop";
import { ValueExpansion } from "./components/gem-stone/ValueExpansion";
import { ProductFeedbackLoop } from "./components/gem-stone/ProductFeedbackLoop";
import { OnboardingDashboard } from "./components/onboarding/OnboardingDashboard";
import { RevenueArchitecture } from "./components/gem-stone/RevenueArchitecture";
import { Playbooks } from "./components/onboarding/Playbooks";
import { CurrentProjects } from "./components/onboarding/CurrentProjects";
import { NewProject } from "./components/onboarding/NewProject";
import { LaunchedProject } from "./components/projects/ProjectsDashboard";
import { CustomersDashboard } from "./components/customers/CustomersDashboard";
import { AnalyticsDashboard } from "./components/analytics/AnalyticsDashboard";
import { UsageAnalytics } from "./components/analytics/UsageAnalytics";
import { ProductAnalysis } from "./components/analytics/ProductAnalysis";
import { CustomerAnalysis } from "./components/analytics/CustomerAnalysis";
import { MarketingAnalysis } from "./components/analytics/MarketingAnalysis";
import { FinancialAnalysis } from "./components/analytics/FinancialAnalysis";
import { ReportsDashboard } from "./components/reports/ReportsDashboard";
import { MessagesDashboard } from "./components/messages/MessagesDashboard";
import { SettingsDashboard } from "./components/settings/SettingsDashboard";
import { HelpCenter } from "./components/help/HelpCenter";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { LibraryHub } from "./components/library/LibraryHub";
import { GetWellPlansDashboard } from "./components/get-well-plans/GetWellPlansDashboard";
import { CreatePlan } from "./components/get-well-plans/CreatePlan";
// if the file lives at src/components/experts/ExpertConsultation.tsx
import ExpertConsultation from "./components/expert/ExpertConsultation";
import { ExpertDashboard } from "./components/expert/ExpertDashboard";
import { ExpLeaderboard } from "./components/expert/ExpLeaderboard";
import { ExpQuestions } from "./components/expert/ExpQuestions";
import { HealthScoresDashboard } from "./components/health-scores/HealthScoresDashboard";
import { AccountHealth } from "./components/health-scores/AccountHealth";
import { UnderDevelopment } from "./components/UnderDevelopment";
import { CSQuery } from "./components/cs-query/CSQuery";
import { ContentManager } from "./components/library/ContentManager";
import { Competitors } from "./components/library/Competitors";
import { TechSupport } from "./components/support/techsupport";
import { SupportL1 } from "./components/support/SupportL1";
import { L2Support } from "./components/support/L2Support";
import { OmnichannelInbox } from "./components/support/OmnichannelInbox";
import { AIAutomation } from "./components/support/AIAutomation";
import { UserManagement } from "./components/admin/UserManagement";
import { RoleManagement } from "./components/admin/RoleManagement";
import { FeatureFlags } from "./components/admin/FeatureFlags";
import { InstanceConfiguration } from "./components/admin/InstanceConfiguration";
import { SecuritySettings } from "./components/admin/SecuritySettings";
import { AccountIntake } from "./components/admin/AccountIntake";
import { Glossary } from "./components/admin/Glossary";
import { SubscriptionManagement } from "./components/admin/SubscriptionManagement";
import authService from "./services/authService";

const queryClient = new QueryClient();

/** ------------------ MOCK AUTH HELPERS ------------------ */
// Use localStorage so a refresh keeps the state until logout.
const isAuthed = () => authService.isAuthenticated();

// Protects private routes (dashboard, etc.)
function RequireAuth() {
  return isAuthed() ? <Outlet /> : <Navigate to="/login" replace />;
}

// Keeps logged-in users from seeing /login again
function PublicOnly() {
  return isAuthed() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
/** ------------------------------------------------------- */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Default to /login now */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route element={<PublicOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Legal pages may be public */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Private (guarded) routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
            {/* ================= Onboarding Routes ================= */}
            <Route path="/onboarding/*" element={<OnboardingDashboard />} />
            <Route path="/onboarding/playbooks" element={<Playbooks />} />
            <Route path="/onboarding/current" element={<CurrentProjects />} />
            <Route path="/onboarding/new" element={<NewProject />} />
            <Route path="/cs-query" element={<CSQuery />} />
            <Route path="/projects/*" element={<LaunchedProject />} />
            <Route path="/customers/*" element={<CustomersDashboard />} />
            <Route path="/analytics/*" element={<AnalyticsDashboard />} />
            <Route path="/reports/*" element={<ReportsDashboard />} />
            <Route path="/messages/*" element={<MessagesDashboard />} />
            <Route path="/settings/*" element={<SettingsDashboard />} />
            <Route path="/help/*" element={<HelpCenter />} />

            {/* GEM STONE ROUTES */}
            <Route
              path="/gem-stone/value-expansion"
              element={<ValueExpansion />}
            />
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

            {/* ================= Admin Routes ================= */}
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/roles" element={<RoleManagement />} />
            <Route path="/library/*" element={<LibraryHub />} />
            <Route path="/admin/features" element={<FeatureFlags />} />
            <Route path="/admin/security" element={<SecuritySettings />} />
            <Route path="/admin/glossary" element={<Glossary />} />
            <Route path="/admin/instance" element={<InstanceConfiguration />} />
            <Route
              path="/admin/subscription"
              element={<SubscriptionManagement />}
            />
            <Route path="/account-intake" element={<AccountIntake />} />
            <Route
              path="/library/content-manager"
              element={<ContentManager />}
            />
            <Route path="/library/competitors" element={<Competitors />} />
            <Route
              path="/get-well-plans/*"
              element={<GetWellPlansDashboard />}
            />
            <Route path="/get-well-plans/create" element={<CreatePlan />} />
            <Route
              path="/expert-consultation/*"
              element={<ExpertConsultation />}
            />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route
              path="/expert-dashboard/leaderboard"
              element={<ExpLeaderboard />}
            />
            <Route
              path="/expert-dashboard/questions"
              element={<ExpQuestions />}
            />
            <Route
              path="/health-scores/*"
              element={<HealthScoresDashboard />}
            />
            <Route
              path="/health-scores/:accountId"
              element={<AccountHealth />}
            />

            {/*Analitics Routes */}
            <Route path="/analytics/usage" element={<UsageAnalytics />} />
            <Route path="/analytics/product" element={<ProductAnalysis />} />
            <Route path="/analytics/customers" element={<CustomerAnalysis />} />
            <Route path="/analytics/sales" element={<MarketingAnalysis />} />
            <Route
              path="/analytics/financial"
              element={<FinancialAnalysis />}
            />
            <Route path="/support" element={<TechSupport />} />
            <Route path="/support/l1" element={<SupportL1 />} />
            <Route path="/support/l2" element={<L2Support />} />
            <Route path="/support/omnichannel" element={<OmnichannelInbox />} />
            <Route path="/support/automation" element={<AIAutomation />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
