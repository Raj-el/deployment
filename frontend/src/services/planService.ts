import apiClient from "./api";

export interface PlanRecommendation {
  action: string;
  priority?: string;
  impact?: string;
  owner?: string;
}

export interface Plan {
  id: string;
  accountId: string;
  accountName: string;
  planType: string;
  title: string;
  summary: string;
  focusAreas: string[];
  recommendations: (string | PlanRecommendation)[];
  authorEmail: string;
  assignedTo: string;
  dueDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyPlansResponse {
  message: string;
  company: string;
  customers: Array<{
    accountId: string;
    accountName: string;
    assignedCsmId: number | null;
  }>;
  plans: Plan[];
  scope: string;
  assignedEmployeeId: number | null;
}

class PlanService {
  /**
   * Fetch all plans for company's clients
   */
  async getCompanyClientPlans(): Promise<CompanyPlansResponse> {
    const response = await apiClient.get<CompanyPlansResponse>(
      "/plans/company/clients"
    );
    return response.data;
  }

  /**
   * Get plans for a specific account
   */
  async getPlansForAccount(accountId: string): Promise<Plan[]> {
    const response = await this.getCompanyClientPlans();
    return response.plans.filter((plan) => plan.accountId === accountId);
  }
}

export default new PlanService();
