// Core Members Page
"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useCoreMembers } from "@/lib/hooks/useAdmin";

export default function CoreMembersPage() {
  const { data: coreMembers, isLoading, error, refetch } = useCoreMembers();

  return (
    <AdminPageTemplate
      title="Core Members"
      data={coreMembers}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/clubMembers/coreMembers/createCoreMember"
      createButtonText="Add Core Member"
      onRefresh={refetch}
      searchKey="name"
      apiEndpoint="coreMembers"
    />
  );
}