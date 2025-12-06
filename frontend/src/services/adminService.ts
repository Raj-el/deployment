import apiClient from "./api";

export interface UserSummary {
  userId: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  primaryRole: string;
  roles: Array<{
    roleType: string;
    name: string | null;
    employeeId: string | null;
    phone: string | null;
    isPrimary: boolean;
    jobFunctionId: number | null;
    jobFunctionName: string | null;
    isActive: boolean;
  }>;
  name: string | null;
}

export interface GetUsersResponse {
  users: UserSummary[];
}

class AdminService {
  /**
   * Fetch all users for the client (active only by default)
   */
  async getUsers(includeInactive: boolean = false): Promise<GetUsersResponse> {
    const response = await apiClient.get<GetUsersResponse>(
      `/admin/users?includeInactive=${includeInactive}`
    );
    return response.data;
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    roleType: "client_admin" | "client_team";
    name?: string;
    phone?: string;
    employeeId?: string;
    jobFunctionId?: number;
  }): Promise<{ message: string; user: UserSummary }> {
    const response = await apiClient.post("/admin/users", userData);
    return response.data;
  }

  /**
   * Update an existing user
   */
  async updateUser(
    userId: string,
    updates: {
      name?: string;
      phone?: string;
      isActive?: boolean;
      jobFunctionId?: number;
    }
  ): Promise<{ message: string; user: UserSummary }> {
    const response = await apiClient.patch(`/admin/users/${userId}`, updates);
    return response.data;
  }
}

export default new AdminService();
