import apiClient from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    userId: string;
    email: string;
    isActive: boolean;
    emailVerified: boolean;
    role: string;
    company_name?: string;
    subject: string;
    type: string;
    client_id?: string;
    displayName?: string;
  };
}

export interface ProfileResponse {
  user: {
    userId: string;
    email: string;
    isActive: boolean;
    emailVerified: boolean;
    role: string;
    company: string;
    subject: string;
    type: string;
    client_id?: string;
    displayName?: string;
  };
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    // Store token and user data in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("auth", "true");
    }

    return response.data;
  }

  /**
   * Get current user profile (requires authentication)
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await apiClient.get<ProfileResponse>("/auth/profile");
    return response.data;
  }

  /**
   * Logout user - clears local storage
   */
  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    localStorage.removeItem("remember");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return (
      localStorage.getItem("auth") === "true" &&
      !!localStorage.getItem("authToken")
    );
  }

  /**
   * Get stored user data
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new AuthService();
