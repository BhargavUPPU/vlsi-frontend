"use client";
import React from "react";
import  { useEffect, useState } from "react";
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

export default function StudentRole() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) {
        throw new Error("Failed to update role");
      }
      await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      setError("Error updating role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-red-500">{error}</span>
        <Button className="ml-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return <div className="text-center mt-16 text-red-500">You do not have permission to view this page.</div>;
  }

  return (
    <div className="my-16 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold">Users</span>
        <Button onClick={() => window.location.reload()} variant="outline">Refresh</Button>
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
                      onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                      disabled={updatingId === user.id}
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
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
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