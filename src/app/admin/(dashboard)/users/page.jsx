"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useUsers } from "@/lib/hooks/useAdmin";

export default function UsersPage() {
  const { data: users, isLoading, error, refetch } = useUsers();

  return (
    <AdminPageTemplate
      title="User Management"
      data={users}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/users/create"
      createButtonText="Create User"
      onRefresh={refetch}
      searchKey="name"
      apiEndpoint="users"
    />
  );
}
