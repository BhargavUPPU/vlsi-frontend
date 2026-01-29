"use client";
import React from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StudentRole() {
  const [updatingId, setUpdatingId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch users with React Query
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get(API_ENDPOINTS.USERS.GET_ALL),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Extract users from response data
  const users = Array.isArray(usersData?.data) ? usersData.data : [];

  // Mutation for updating user role
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(userId), {
        role,
      });
      return response.data;
    },
    onSuccess: (data, { userId, role }) => {
      // Update the local state optimistically
      queryClient.setQueryData(["users"], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((user) =>
            user.id === userId ? { ...user, role } : user,
          ),
        };
      });

      toast.success("User role updated successfully");

      // Optionally refetch to ensure data consistency
      // queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user role:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update user role";
      toast.error(errorMessage);
    },
    onSettled: () => {
      setUpdatingId(null);
    },
  });

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    updateUserRoleMutation.mutate({ userId, role: newRole });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-red-500">
          {error.message || "Error fetching users"}
        </span>
        <Button className="ml-4" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="my-16 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold">Users</span>
        <Button
          onClick={() => refetch()}
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border shadow-sm bg-white">
        <Table>
          <TableHeader className="bg-zinc-100">
            <TableRow>
              <TableHead className="w-[100px] font-medium p-3">ID</TableHead>
              <TableHead className="font-medium p-3">Name</TableHead>
              <TableHead className="font-medium p-3">Email</TableHead>
              <TableHead className="text-right font-medium p-3">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium p-3">{user.id}</TableCell>
                  <TableCell className="p-3">{user.name}</TableCell>
                  <TableCell className="p-3">{user.email}</TableCell>
                  <TableCell className="text-right p-3">
                    <Select
                      value={user.role}
                      onValueChange={(newRole) =>
                        handleRoleChange(user.id, newRole)
                      }
                      disabled={
                        updatingId === user.id ||
                        updateUserRoleMutation.isPending
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={user.role} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
