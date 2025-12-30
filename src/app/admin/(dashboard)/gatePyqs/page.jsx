"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useGatePyqs } from "@/lib/hooks/useAdmin";

export default function GatePyqsPage() {
  const { data: gatePyqs, isLoading, error, refetch } = useGatePyqs();

  return (
    <AdminPageTemplate
      title="GATE Previous Year Questions"
      data={gatePyqs}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/gatePyqs/createGatePyqs"
      createButtonText="Add GATE PYQ"
      onRefresh={refetch}
      searchKey="name"
      apiEndpoint="gatePyqs"
    />
  );
}