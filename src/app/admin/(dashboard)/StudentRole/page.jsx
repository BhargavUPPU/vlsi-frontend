"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function StudentRole() {
  const { data: session, status } = useSession();
  console.log("data", session);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log("Updating role for user:", userId, "to:", newRole);

      // Make the PATCH request to update the role
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

      // Parse response and update local state
      const data = await response.json();
      console.log("Role updated successfully:", data);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const userRole = session.user.role;

  if (userRole !== "ADMIN") {
    return <div>You do not have permission to view this page.</div>;
  }

  return (
    <div className="my-16 inline-block w-full align-middle">
      <span className="text-sm font-semibold">Users</span>
      <div className="mt-3 overflow-hidden md:rounded-lg">
        <div className="relative border rounded-xl border-neutral-30 bg-white px-0 py-0 overflow-auto">
          <Table>
            <TableHeader className="bg-zinc-200/30">
              <TableRow>
                <TableHead className="w-[100px] font-medium p-3">ID</TableHead>
                <TableHead className="font-medium p-3">Name</TableHead>
                <TableHead className="font-medium p-3">Email</TableHead>
                <TableHead className="text-right font-medium p-3">
                  Role
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(users) &&
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium p-3">{user.id}</TableCell>
                    <TableCell className="p-3">{user.name}</TableCell>
                    <TableCell className="p-3">{user.email}</TableCell>
                    <TableCell className="text-right p-3">
                      <Select
                        onValueChange={(newRole) =>
                          handleRoleChange(user.id, newRole)
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
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
