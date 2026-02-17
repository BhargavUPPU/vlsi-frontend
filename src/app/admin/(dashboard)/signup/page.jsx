"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, Shield, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, and basic punctuation"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required")
      .max(100, "Email must not exceed 100 characters")
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    year: z
      .string()
      .optional()
      .refine(
        (val) => !val || (/^\d{4}$/.test(val) && parseInt(val) >= 2020 && parseInt(val) <= new Date().getFullYear() + 1),
        "Please enter a valid year (2020-" + (new Date().getFullYear() + 1) + ")"
      ),
    role: z.enum(["USER", "ADMIN"], {
      required_error: "Please select a role",
      invalid_type_error: "Invalid role selected",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function AdminSignup() {
  const router = useRouter();
  const { user, register: registerUser, canAccessAdminRoutes, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  // Check admin access
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      
      if (!canAccessAdminRoutes()) {
        setAccessDenied(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
        return;
      }
    }
  }, [user, authLoading, canAccessAdminRoutes, router]);

  // Generate year options (current year and previous 4 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i + 1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      year: "",
      role: "USER",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError("");
    
    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...userData } = data;
      
      // Ensure email is lowercase
      userData.email = userData.email.toLowerCase().trim();
      userData.name = userData.name.trim();
      
      // Remove empty year field
      if (!userData.year || userData.year.trim() === "" || userData.year === "unspecified") {
        delete userData.year;
      }
      
      console.log("Submitting user data:", { ...userData, password: "[HIDDEN]" });
      
      const result = await registerUser(userData);
      
      if (result.success) {
        toast.success(
          `User account created successfully! ${userData.name} has been registered as ${userData.role.toLowerCase()}.`,
          { duration: 4000 }
        );
        
        // Reset form after successful registration
        reset();
        
        // Optional: Redirect to users list or stay on form
        // router.push("/admin/users");
      } else {
        const errorMessage = result.error || "Registration failed. Please try again.";
        setSubmitError(errorMessage);
        toast.error(errorMessage, { duration: 5000 });
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied screen
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Only administrators can create new users.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500 mb-4">You will be redirected automatically...</p>
            <Button 
              onClick={() => router.push("/")} 
              variant="outline"
              className="w-full"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Create New User Account
            </CardTitle>
            <CardDescription className="text-base">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Admin Panel - Create accounts for VLSID GVPCE(A)</span>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    type="text"
                    placeholder="Enter full name (e.g., John Doe)"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Year Field */}
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year (Optional)</Label>
                  <Select
                    value={watch("year") || undefined}
                    onValueChange={(value) => setValue("year", value === "unspecified" ? undefined : value)}
                  >
                    <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select academic year (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Academic Year</SelectLabel>
                        <SelectItem value="unspecified">Not specified</SelectItem>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.year.message}
                    </p>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role">User Role *</Label>
                  <Select
                    value={watch("role")}
                    onValueChange={(value) => setValue("role", value, { shouldValidate: true })}
                  >
                    <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Roles</SelectLabel>
                        <SelectItem value="USER">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>User</span>
                            <span className="text-xs text-gray-500">- Standard access</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                            <span>Admin</span>
                            <span className="text-xs text-gray-500">- Administrative access</span>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields - Full Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="Enter secure password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Must be 8+ characters with uppercase, lowercase, and number
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isDirty || !isValid}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create User Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex justify-center gap-4">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              ← Back to Admin Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              View All Users →
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            VLSI Design Club © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
