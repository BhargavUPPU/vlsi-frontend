import axios from "axios";
import { API_BASE_URL } from "./config";

/**
 * Axios instance with default configuration
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
  withCredentials: false, // Changed to false for JWT-based auth
});

/**
 * Request interceptor
 * Adds JWT token to requests if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Increase timeout for file uploads (multipart/form-data)
    if (
      config.headers["Content-Type"] === "multipart/form-data" ||
      config.data instanceof FormData
    ) {
      config.timeout = 120000; // 2 minutes for file uploads
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor
 * Handles token refresh and error responses
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._isRefreshRequest) {
      originalRequest._retry = true;

      try {
        // Don't try to refresh if this was already a refresh request
        if (originalRequest.url?.includes("/auth/refresh")) {
          throw new Error("Refresh token expired");
        }

        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;

        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {
              refreshToken,
            },
            {
              _isRefreshRequest: true, // Mark this as a refresh request
            },
          );

          const { accessToken } = response.data;

          if (accessToken && typeof window !== "undefined") {
            localStorage.setItem("accessToken", accessToken);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          }
        }

        throw new Error("No refresh token available");
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Only redirect if we're not already on a public page
          const currentPath = window.location.pathname;
          const publicPaths = [
            "/auth/login",
            "/auth/change-password",
            "/register",
            "/",
            "/about",
            "/events",
            "/projects",
            "/resources",
            "/team",
            "/tests",
          ];
          const isPublicPath = publicPaths.some(
            (path) =>
              currentPath === path ||
              (path !== "/" && currentPath.startsWith(path)),
          );

          if (!isPublicPath) {
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
