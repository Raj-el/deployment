import apiClient from "./api";

export interface HealthScoreResponse {
  count: number;
  scope: string;
  customers: Array<{
    accountId: string;
    accountName: string;
    assignedCsmId: number | null;
    overallHealthScore: number;
    financialHealthScore: number;
    usageHealthScore: number;
    sentimentHealthScore: number;
    engagementHealthScore: number;
    updatedAt: string;
  }>;
  assignedEmployeeId?: number | null;
}

class HealthScoreService {
  /**
   * Fetch health scores for all customers or a specific account
   */
  async getHealthScores(params?: {
    accountId?: string;
    limit?: number;
  }): Promise<HealthScoreResponse> {
    const queryParams = new URLSearchParams();

    if (params?.accountId) {
      queryParams.append("accountId", params.accountId);
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const url = `/healthscore${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await apiClient.get<HealthScoreResponse>(url);
    return response.data;
  }
}

export default new HealthScoreService();
