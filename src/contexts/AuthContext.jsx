"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";

const AuthContext = createContext(null);

// Constants
const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
} ;

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
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
] ;

const ADMIN_ROUTES = [
  "/admin",
] ;

const AUTH_REQUIRED_ROUTES = [
  "/tests",
  "/profile",
  "/dashboard",
];

// Configuration constants
const CONFIG = {
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  AUTH_CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  NETWORK_TIMEOUT: 10000,
} ;

// Enhanced logging for production
const logger = {
  info: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH] ${message}`, data);
    }
  },
  error: (message, error = {}) => {
    console.error(`[AUTH ERROR] ${message}`, error);
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service like Sentry
    }
  },
  warn: (message, data = {}) => {
    console.warn(`[AUTH WARNING] ${message}`, data);
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Refs for cleanup and preventing memory leaks
  const authCheckIntervalRef = useRef(null);
  const refreshPromiseRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Enhanced safe localStorage access with validation
  const getStorageItem = useCallback((key) => {
    if (typeof window !== "undefined") {
      try {
        const item = localStorage.getItem(key);
        // Validate token format for security
        if (key === TOKEN_KEYS.ACCESS && item) {
          // Basic JWT format validation (header.payload.signature)
          const parts = item.split('.');
          if (parts.length !== 3) {
            logger.warn('Invalid token format detected', { key });
            return null;
          }
        }
        return item;
      } catch (error) {
        logger.error("Error accessing localStorage", { key, error: error.message });
        return null;
      }
    }
    return null;
  }, []);

  const setStorageItem = useCallback((key, value) => {
    if (typeof window !== "undefined") {
      try {
        if (!value) {
          logger.warn('Attempting to store null/undefined value', { key });
          return false;
        }
        localStorage.setItem(key, value);
        logger.info('Token stored successfully', { key: key.replace('Token', '') });
        return true;
      } catch (error) {
        logger.error("Error setting localStorage", { key, error: error.message });
        return false;
      }
    }
    return false;
  }, []);

  const removeStorageItem = useCallback((key) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
        logger.info('Token removed successfully', { key: key.replace('Token', '') });
        return true;
      } catch (error) {
        logger.error("Error removing from localStorage", { key, error: error.message });
        return false;
      }
    }
    return false;
  }, []);

  const clearAuthData = useCallback(() => {
    try {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear intervals
      if (authCheckIntervalRef.current) {
        clearInterval(authCheckIntervalRef.current);
        authCheckIntervalRef.current = null;
      }

      // Clear refresh promise
      refreshPromiseRef.current = null;

      // Clear storage
      removeStorageItem(TOKEN_KEYS.ACCESS);
      removeStorageItem(TOKEN_KEYS.REFRESH);
      
      // Reset state
      setUser(null);
      setAuthError(null);
      setRetryCount(0);
      setIsRefreshing(false);
      
      logger.info('Auth data cleared successfully');
    } catch (error) {
      logger.error('Error clearing auth data', { error: error.message });
    }
  }, [removeStorageItem]);

  // Enhanced initialization with cleanup
  useEffect(() => {
    let isMounted = true;
    abortControllerRef.current = new AbortController();

    const initAuth = async () => {
      try {
        if (isMounted) {
          await checkAuth();
          setIsInitialized(true);
          
          // Set up periodic auth check for production security
          if (process.env.NODE_ENV === 'production') {
            authCheckIntervalRef.current = setInterval(
              checkAuth,
              CONFIG.AUTH_CHECK_INTERVAL
            );
          }
        }
      } catch (error) {
        logger.error('Auth initialization failed', { error: error.message });
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (authCheckIntervalRef.current) {
        clearInterval(authCheckIntervalRef.current);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAuthData();
    };
  }, [clearAuthData]);

  // Enhanced route protection with better error handling
  useEffect(() => {
    if (!isInitialized || loading) return;

    try {
      const isPublicRoute = PUBLIC_ROUTES.some(
        (route) =>
          pathname === route || (route !== "/" && pathname?.startsWith(route)),
      );

      const isAdminRoute = ADMIN_ROUTES.some(
        (route) =>
          pathname === route || pathname?.startsWith(route),
      );

      const isAuthRequiredRoute = AUTH_REQUIRED_ROUTES.some(
        (route) =>
          pathname === route || pathname?.startsWith(route),
      );

      // Admin route protection with detailed logging
      if (isAdminRoute) {
        if (!user) {
          logger.warn('Unauthenticated access attempt to admin route', { pathname });
          router.push("/auth/login");
          return;
        }
        if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
          logger.warn('Unauthorized access attempt to admin route', { 
            pathname, 
            userRole: user.role,
            userId: user.id 
          });
          setAuthError("Access denied. Admin privileges required.");
          router.push("/");
          return;
        }
        logger.info('Admin route access granted', { pathname, userRole: user.role });
      }

      // Auth required route protection
      if (isAuthRequiredRoute && !user) {
        logger.info('Authentication required for route', { pathname });
        router.push("/auth/login");
        return;
      }

      // General auth checks
      if (!user && !isPublicRoute && pathname !== "/auth/login") {
        logger.info('Redirecting unauthenticated user to login', { pathname });
        router.push("/auth/login");
      }
      
      if (user && pathname === "/auth/login") {
        logger.info('Redirecting authenticated user from login', { userId: user.id });
        router.push("/");
      }
    } catch (error) {
      logger.error('Route protection error', { error: error.message, pathname });
    }
  }, [user, loading, pathname, router, isInitialized]);

  const checkAuth = async (retryAttempt = 0) => {
    if (retryAttempt === 0) {
      setLoading(true);
      setAuthError(null);
    }

    try {
      const token = getStorageItem(TOKEN_KEYS.ACCESS);

      if (!token) {
        logger.info('No access token found');
        setLoading(false);
        return false;
      }

      // Create abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, {
        signal: abortController.signal,
        timeout: CONFIG.NETWORK_TIMEOUT,
      });

      logger.info("Auth check successful", { userId: response.data?.data?.user?.id });

      if (response.data?.data?.user) {
        const userData = response.data.data.user;
        
        // Validate user data structure
        if (!userData.id || !userData.email) {
          throw new Error('Invalid user data structure');
        }
        
        setUser(userData);
        setRetryCount(0);
        return true;
      } else {
        logger.warn('Invalid response structure from profile endpoint');
        clearAuthData();
        return false;
      }
    } catch (error) {
      // Don't log aborted requests as errors
      if (error.name === 'AbortError') {
        logger.info('Auth check request aborted');
        return false;
      }

      logger.error("Auth check failed", { 
        error: error.message,
        status: error.response?.status,
        retryAttempt 
      });

      // Handle different error types
      if (error.response?.status === 401) {
        const refreshToken = getStorageItem(TOKEN_KEYS.REFRESH);
        if (refreshToken && retryAttempt < CONFIG.MAX_RETRY_ATTEMPTS) {
          logger.info('Attempting token refresh', { retryAttempt });
          const refreshed = await attemptTokenRefresh(refreshToken);
          if (refreshed) {
            return await checkAuth(retryAttempt + 1);
          }
        }
        clearAuthData();
        return false;
      } else if (error.response?.status >= 500 && retryAttempt < CONFIG.MAX_RETRY_ATTEMPTS) {
        // Retry on server errors
        logger.info('Retrying auth check due to server error', { retryAttempt });
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (retryAttempt + 1)));
        return await checkAuth(retryAttempt + 1);
      } else {
        // Network or other errors - don't clear auth data immediately in production
        const errorMessage = process.env.NODE_ENV === 'production' 
          ? "Unable to verify authentication. Please check your connection."
          : error.message;
        setAuthError(errorMessage);
        setRetryCount(retryAttempt);
        return false;
      }
    } finally {
      if (retryAttempt === 0) {
        setLoading(false);
      }
    }
  };

  const attemptTokenRefresh = async (refreshToken) => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing) {
      logger.info('Token refresh already in progress, waiting...');
      return refreshPromiseRef.current;
    }

    setIsRefreshing(true);
    
    const refreshPromise = (async () => {
      try {
        logger.info('Starting token refresh');
        
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
          refreshToken,
        }, {
          timeout: CONFIG.NETWORK_TIMEOUT,
          _isRefreshRequest: true,
        });

        if (response.data?.accessToken) {
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Validate token format
          if (!accessToken || accessToken.split('.').length !== 3) {
            throw new Error('Invalid access token format received');
          }

          const stored = setStorageItem(TOKEN_KEYS.ACCESS, accessToken);
          if (!stored) {
            throw new Error('Failed to store new access token');
          }

          // Update refresh token if provided
          if (newRefreshToken) {
            setStorageItem(TOKEN_KEYS.REFRESH, newRefreshToken);
          }

          // Retry getting profile with new token
          const profileResponse = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, {
            timeout: CONFIG.NETWORK_TIMEOUT,
          });
          
          if (profileResponse.data?.data?.user) {
            const userData = profileResponse.data.data.user;
            setUser(userData);
            logger.info('Token refresh successful', { userId: userData.id });
            return true;
          } else {
            throw new Error('Failed to fetch user profile after token refresh');
          }
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (error) {
        logger.error("Token refresh failed", { 
          error: error.message,
          status: error.response?.status 
        });
        return false;
      } finally {
        setIsRefreshing(false);
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = refreshPromise;
    return refreshPromise;
  };

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    try {
      // Enhanced input validation
      if (!email?.trim()) {
        throw new Error("Email is required");
      }
      if (!password?.trim()) {
        throw new Error("Password is required");
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        throw new Error("Please enter a valid email address");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const sanitizedEmail = email.trim().toLowerCase();
      
      logger.info('Login attempt', { email: sanitizedEmail });

      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: sanitizedEmail,
        password,
      }, {
        timeout: CONFIG.NETWORK_TIMEOUT,
      });

      // Handle the response structure from backend (data.accessToken, etc.)
      const responseData = response.data.data || response.data;
      const accessToken = responseData.accessToken;
      const refreshToken = responseData.refreshToken;
      const userData = responseData.user;

      // Enhanced response validation
      if (!accessToken || !refreshToken || !userData) {
        console.error('Missing data in login response:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUser: !!userData,
          responseData
        });
        throw new Error("Invalid response from server");
      }

      // Validate token formats
      if (accessToken.split('.').length !== 3) {
        throw new Error("Invalid access token format");
      }

      if (!userData.id || !userData.email) {
        throw new Error("Invalid user data received");
      }

      // Store tokens securely
      const accessStored = setStorageItem(TOKEN_KEYS.ACCESS, accessToken);
      const refreshStored = setStorageItem(TOKEN_KEYS.REFRESH, refreshToken);
      
      if (!accessStored || !refreshStored) {
        throw new Error("Failed to store authentication tokens");
      }

      setUser(userData);
      setRetryCount(0);
      
      logger.info('Login successful', { 
        userId: userData.id, 
        userRole: userData.role 
      });

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please try again.";
      
      logger.error('Login failed', { 
        email: email?.trim()?.toLowerCase(),
        error: errorMessage,
        status: error.response?.status 
      });
      
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
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
      console.log(response.data);

      // const { accessToken, refreshToken, user: newUser } = response.data;

      // if (!accessToken || !refreshToken || !newUser) {
      //   throw new Error("Invalid response from server");
      // }

      // setStorageItem(TOKEN_KEYS.ACCESS, accessToken);
      // setStorageItem(TOKEN_KEYS.REFRESH, refreshToken);
      // setUser(newUser);
      return { success: true };

      // return { success: true, user: newUser };
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

  const logout = async (skipRedirect = false) => {
    setLoading(true);
    
    const userId = user?.id;
    logger.info('Logout initiated', { userId });

    try {
      // Call logout endpoint (best effort - don't block on failure)
      const token = getStorageItem(TOKEN_KEYS.ACCESS);
      if (token) {
        await Promise.race([
          apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, {
            timeout: CONFIG.NETWORK_TIMEOUT / 2, // Shorter timeout for logout
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Logout timeout')), 5000)
          )
        ]).catch((error) => {
          logger.warn('Logout endpoint failed', { error: error.message });
          // Continue with local logout even if server logout fails
        });
      }
    } catch (error) {
      logger.error("Logout error", { error: error.message, userId });
    } finally {
      clearAuthData();
      setLoading(false);
      
      logger.info('Logout completed', { userId });
      
      if (!skipRedirect) {
        // Small delay to prevent race conditions with router
        setTimeout(() => {
          router.push("/auth/login");
        }, 100);
      }
    }
  };

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  }, []);

  // Enhanced role checking helpers with memoization
  const isSuperAdmin = useCallback(() => user?.role === "SUPERADMIN", [user?.role]);
  const isAdmin = useCallback(
    () => user?.role === "ADMIN" || user?.role === "SUPERADMIN",
    [user?.role],
  );
  const isUser = useCallback(() => user?.role === "USER", [user?.role]);
  
  // Route access helpers with detailed validation
  const canAccessAdminRoutes = useCallback(() => {
    return user && (user.role === "ADMIN" || user.role === "SUPERADMIN");
  }, [user?.role]);
  
  const canAccessTestRoutes = useCallback(() => {
    return !!user && !!user.id; // Any authenticated user with valid ID can access tests
  }, [user?.id]);

  // Production-ready helper functions
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    
    const permissions = {
      'admin': ['ADMIN', 'SUPERADMIN'],
      'superadmin': ['SUPERADMIN'],
      'user': ['USER', 'ADMIN', 'SUPERADMIN'],
      'tests': ['USER', 'ADMIN', 'SUPERADMIN'],
    };
    
    return permissions[permission]?.includes(user.role) || false;
  }, [user?.role]);

  const getAuthHeaders = useCallback(() => {
    const token = getStorageItem(TOKEN_KEYS.ACCESS);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getStorageItem]);

  // Network status and retry helpers
  const retryFailedRequest = useCallback(async () => {
    if (retryCount < CONFIG.MAX_RETRY_ATTEMPTS) {
      logger.info('Retrying failed auth request', { retryCount });
      return await checkAuth();
    }
    return false;
  }, [retryCount]);

  // Memoized context value for performance
  const value = React.useMemo(() => ({
    user,
    loading,
    authError,
    isAuthenticated: !!user?.id,
    isInitialized,
    retryCount,
    isRefreshing,
    
    // Authentication methods
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    setUser: updateUser,
    
    // Role checking
    isSuperAdmin,
    isAdmin,
    isUser,
    
    // Permission checking
    canAccessAdminRoutes,
    canAccessTestRoutes,
    hasPermission,
    
    // Utility methods
    getAuthHeaders,
    retryFailedRequest,
    clearError: () => setAuthError(null),
    
    // Configuration (read-only)
    config: {
      maxRetryAttempts: CONFIG.MAX_RETRY_ATTEMPTS,
      isProduction: process.env.NODE_ENV === 'production',
    },
  }), [
    user,
    loading,
    authError,
    isInitialized,
    retryCount,
    isRefreshing,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    isSuperAdmin,
    isAdmin,
    isUser,
    canAccessAdminRoutes,
    canAccessTestRoutes,
    hasPermission,
    getAuthHeaders,
    retryFailedRequest,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
