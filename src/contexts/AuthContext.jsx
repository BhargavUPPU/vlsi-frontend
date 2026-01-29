"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";

const AuthContext = createContext(null);

// Constants
const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
};

const PUBLIC_ROUTES = [
  "/auth/login",
  "/register",
  "/",
  "/about",
  "/events",
  "/projects",
  "/resources",
  "/team",
  "/photogallery",
  "/achievements",
  "/resources/roadmap",
  "/resources/softwaretools",
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Safe localStorage access (SSR-safe)
  const getStorageItem = useCallback((key) => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
      }
    }
    return null;
  }, []);

  const setStorageItem = useCallback((key, value) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error("Error setting localStorage:", error);
      }
    }
  }, []);

  const removeStorageItem = useCallback((key) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("Error removing from localStorage:", error);
      }
    }
  }, []);

  const clearAuthData = useCallback(() => {
    removeStorageItem(TOKEN_KEYS.ACCESS);
    removeStorageItem(TOKEN_KEYS.REFRESH);
    setUser(null);
    setAuthError(null);
  }, [removeStorageItem]);

  // Check authentication status on mount
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (isMounted) {
        await checkAuth();
        setIsInitialized(true);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Redirect logic based on auth state
  useEffect(() => {
    if (isInitialized && !loading) {
      const isPublicRoute = PUBLIC_ROUTES.some(
        (route) =>
          pathname === route || (route !== "/" && pathname?.startsWith(route)),
      );

      if (!user && !isPublicRoute && pathname !== "/auth/login") {
        router.push("/auth/login");
      }
    }
  }, [user, loading, pathname, router, isInitialized]);

  const checkAuth = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      const token = getStorageItem(TOKEN_KEYS.ACCESS);

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

      if (response.data) {
        setUser(response.data);
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);

      // If token is invalid or expired, try to refresh
      if (error.response?.status === 401) {
        const refreshToken = getStorageItem(TOKEN_KEYS.REFRESH);
        if (refreshToken) {
          const refreshed = await attemptTokenRefresh(refreshToken);
          if (!refreshed) {
            clearAuthData();
          }
        } else {
          clearAuthData();
        }
      } else {
        // Network or other errors - don't clear auth data immediately
        setAuthError(
          "Unable to verify authentication. Please check your connection.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const attemptTokenRefresh = async (refreshToken) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken,
      });

      if (response.data?.accessToken) {
        setStorageItem(TOKEN_KEYS.ACCESS, response.data.accessToken);

        // Retry getting profile
        const profileResponse = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
        if (profileResponse.data) {
          setUser(profileResponse.data);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      if (!email?.trim() || !password?.trim()) {
        throw new Error("Email and password are required");
      }

      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: email.trim().toLowerCase(),
        password,
      });

      const { accessToken, refreshToken, user: userData } = response.data;

      if (!accessToken || !refreshToken || !userData) {
        throw new Error("Invalid response from server");
      }

      setStorageItem(TOKEN_KEYS.ACCESS, accessToken);
      setStorageItem(TOKEN_KEYS.REFRESH, refreshToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      setAuthError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);

    try {
      // Validate required fields
      if (
        !userData.email?.trim() ||
        !userData.password?.trim() ||
        !userData.name?.trim()
      ) {
        throw new Error("Name, email, and password are required");
      }

      if (userData.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email.trim())) {
        throw new Error("Please enter a valid email address");
      }

      const cleanedData = {
        ...userData,
        email: userData.email.trim().toLowerCase(),
        name: userData.name.trim(),
      };

      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        cleanedData,
      );

      const { accessToken, refreshToken, user: newUser } = response.data;

      if (!accessToken || !refreshToken || !newUser) {
        throw new Error("Invalid response from server");
      }

      setStorageItem(TOKEN_KEYS.ACCESS, accessToken);
      setStorageItem(TOKEN_KEYS.REFRESH, refreshToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      setAuthError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);

    try {
      // Call logout endpoint (best effort - don't block on failure)
      const token = getStorageItem(TOKEN_KEYS.ACCESS);
      if (token) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch(() => {
          // Ignore logout endpoint errors
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setLoading(false);
      router.push("/auth/login");
    }
  };

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  }, []);

  // Role checking helpers
  const isSuperAdmin = useCallback(() => user?.role === "SUPERADMIN", [user]);
  const isAdmin = useCallback(
    () => user?.role === "ADMIN" || user?.role === "SUPERADMIN",
    [user],
  );

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    isInitialized,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    setUser: updateUser,
    isSuperAdmin,
    isAdmin,
    clearError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
