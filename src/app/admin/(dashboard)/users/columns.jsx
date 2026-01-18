"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionCell } from "@/components/ActionCell";
import { useDeleteUser, useToggleUserActive } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      const roleConfig = {
        SUPERADMIN: { label: "Super Admin", color: "bg-red-100 text-red-700 font-semibold" },
        ADMIN: { label: "Admin", color: "bg-blue-100 text-blue-700" },
        USER: { label: "User", color: "bg-green-100 text-green-700" },
      };
      const config = roleConfig[role] || { label: role, color: "bg-gray-100 text-gray-700" };
      
      return (
        <Badge className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastPasswordChange",
    header: "Last Password Change",
    cell: ({ row }) => {
      const date = row.getValue("lastPasswordChange");
      if (!date) return <span className="text-gray-400">Never</span>;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    accessorKey: "requirePasswordChange",
    header: "Status",
    cell: ({ row }) => {
      const requiresChange = row.getValue("requirePasswordChange");
      return (
        <Badge className={requiresChange ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}>
          {requiresChange ? "⚠️ Requires Password Change" : "Active"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteUser = useDeleteUser();
      return (
        <ActionCell
          row={row}
          onDelete={deleteUser.mutateAsync}
          editPath={`/admin/users/create?edit=${row.original.id}`}
          itemName="User"
        />
      );
    },
  },
];
