"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Link from "next/link";
import Loading from "@/app/loading";
import Image from "next/image";
import ContentLoading from "@/app/content-loading";
import { ArrowLeft } from "lucide-react";

// Production-level validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    authError,
    login,
    clearError,
    isAuthenticated,
    isInitialized,
  } = useAuth();
  console.log("Auth State:", { user, authLoading, authError, isAuthenticated, isInitialized });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect authenticated users
  useEffect(() => {
    if (isInitialized && !authLoading && isAuthenticated && user) {
      // Redirect based on role and password change requirement
      if (user.requirePasswordChange) {
        router.push("/auth/change-password?required=true");
      } else if (user.role === "SUPERADMIN" || user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, authLoading, isAuthenticated, isInitialized, router]);

  // Form setup with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    clearErrors,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    clearError(); // Clear any previous auth errors
    clearErrors(); // Clear form errors

    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success("Login successful!");
        
        // Let the AuthContext handle redirects through useEffect
        // The redirect logic will be handled by the useEffect above
      } else {
        // This shouldn't happen as login throws on failure, but keeping for safety
        toast.error(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      // The AuthContext already handles the error, just show a toast
      const errorMessage = error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while auth is initializing
  if (!isInitialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ContentLoading/>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col  items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl p-3">
                  <Link
          href="/"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          <span>Home</span>
        </Link>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
              <Image
                             src="/logo.png"
                             alt="VLSID Logo"
                             width={48}
                             height={48}
                             className="w-18 h-18 object-contain"
                           />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Sign in to access VLSID GVPCE(A)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Auth Error Alert */}
          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              disabled={isSubmitting || !isDirty || !isValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>
                Need access?{" "}
                <Link
                  href="mailto:vlsid@gvpce.ac.in"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Contact administrator
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
