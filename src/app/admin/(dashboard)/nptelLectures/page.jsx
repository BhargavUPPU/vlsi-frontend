"use client";
import { columns } from "./column";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useNptelLectures } from "@/lib/hooks/useAdmin";

export default function NptelLecturesPage() {
  const { data: nptelLectures, isLoading, error, refetch } = useNptelLectures();

  return (
    <AdminPageTemplate
      title="NPTEL Lectures"
      data={nptelLectures}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/nptelLectures/createNptelLecture"
      createButtonText="Add NPTEL Lecture"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="nptelLectures"
    />
  );
}