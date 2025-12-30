"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useTextbooks } from "@/lib/hooks/useAdmin";

export default function TextbooksPage() {
  const { data: textbooks, isLoading, error, refetch } = useTextbooks();

  return (
    <AdminPageTemplate
      title="Textbooks"
      data={textbooks}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/textBooks/createTextBook"
      createButtonText="Add Textbook"
      onRefresh={refetch}
      searchKey="name"
      apiEndpoint="textbooks"
    />
  );
}