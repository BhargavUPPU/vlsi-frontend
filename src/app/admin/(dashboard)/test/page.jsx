"use client";
import { columns } from "./column";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useTests } from "@/lib/hooks/useAdmin";

export default function TestsPage() {
  const { data: tests, isLoading, error, refetch } = useTests();

  return (
    <AdminPageTemplate
      title="Tests"
      data={tests}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/test/createTest"
      createButtonText="Create Test"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="tests"
    />
  );
}