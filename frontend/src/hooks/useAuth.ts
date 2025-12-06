import { useState, useEffect } from "react";
import authService from "@/services/authService";

export function useAuth() {
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    // Listen for storage events to update user across tabs
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    user,
    displayName: user?.displayName || user?.email?.split("@")[0] || "User",
    isAuthenticated: authService.isAuthenticated(),
  };
}
