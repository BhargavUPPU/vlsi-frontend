"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/components/ui/input";
import { Toaster, toast } from "sonner";
import { Button } from "../../../components/components/ui/button";
import { Label } from "../../../components/components/ui/label";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";
import Link from "next/link";

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email")
      .regex(
        /^[a-zA-Z0-9._%+-]+@gvpce\.ac\.in$/,
        "Email must be a gvpce.ac.in domain"
      ),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have at least 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    year: z.string().min(1, "Year is required"),
    role: z.string().min(1, "Role is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SignUp = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      year: "",
      role: "",
    },
  });
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 5 },
    (_, i) => `${currentYear - i} - ${currentYear - i + 4}`
  );
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (values) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.username,
          email: values.email,
          password: values.password,
          year: values.year,
          role: values.role || "USER",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    },
    {
      onSuccess: () => {
        toast.success("User registered successfully");
        queryClient.invalidateQueries("users");
        form.reset({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          year: "",
          role: "",
        });
      },
      onError: (error) => {
        console.log("Error registering user", error);
        toast.error(error.message);
      },
    }
  );

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6">Sign up</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Username
                </Label>
                <Input
                  type="text"
                  {...form.register("username")}
                  placeholder="shadcn"
                  className="mt-1 block w-full"
                />
                {form.formState.errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  type="email"
                  {...form.register("email")}
                  placeholder="mail@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  type="password"
                  {...form.register("password")}
                  placeholder="Enter your password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  {...form.register("confirmPassword")}
                  placeholder="Re-enter your password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-row justify-start mt-1">
                <div>
                  <Label className="block mt-1 text-sm font-medium text-gray-700">
                    Select Batch Year
                  </Label>
                  <Select
                    onValueChange={(value) => form.setValue("year", value)}
                    className="mt-1"
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.year && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.year.message}
                    </p>
                  )}
                </div>
                <div className="ml-3">
                  <Label className="block mt-1  text-sm font-medium text-gray-700">
                    Select Role
                  </Label>
                  <Select
                    onValueChange={(value) => form.setValue("role", value)}
                    className="mt-1"
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom">
                      <SelectItem value="USER">USER</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.role && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full rounded-md mx-auto bg-blue-800 px-4 py-2 text-white hover:bg-blue-500"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
