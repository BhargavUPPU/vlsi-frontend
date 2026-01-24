"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const PUBLIC_ROUTES = ["/auth/login", "/auth/change-password", "/"];

export function AuthMiddleware({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth context to load
      if (loading) {
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");

      // Allow public routes
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
      );

      if (isPublicRoute) {
        // If already logged in and on login page, redirect to dashboard
        if (accessToken && userStr && pathname === "/auth/login") {
          const userData = JSON.parse(userStr);
          if (userData.requirePasswordChange) {
            router.push("/auth/change-password?required=true");
            return;
          }
          if (userData.role === "SUPERADMIN" || userData.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }
        setIsChecking(false);
        return;
      }

      // Check if user is authenticated for protected routes
      if (!accessToken || !userStr) {
        toast.error("Please login to continue");
        router.push("/auth/login");
        setIsChecking(false);
        return;
      }

      const userData = JSON.parse(userStr);

      // Force password change if required (except on change-password page)
      if (userData.requirePasswordChange && !pathname.includes("change-password")) {
        toast.warning("You must change your password before continuing");
        router.push("/auth/change-password?required=true");
        setIsChecking(false);
        return;
      }

      // Check admin routes
      if (pathname.startsWith("/admin")) {
        if (userData.role !== "SUPERADMIN" && userData.role !== "ADMIN") {
          toast.error("Access denied. Admin privileges required.");
          router.push("/");
          setIsChecking(false);
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router, loading, user]);

  // Show nothing while checking auth to prevent flash of unauthorized content
  if (isChecking && !PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
