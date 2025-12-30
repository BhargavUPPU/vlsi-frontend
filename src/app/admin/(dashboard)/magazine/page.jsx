"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useMagazines } from "@/lib/hooks/useAdmin";

export default function MagazinesPage() {
  const { data: magazines, isLoading, error, refetch } = useMagazines();

  return (
    <AdminPageTemplate
      title="Magazines"
      data={magazines}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/magazine/createMagazine"
      createButtonText="Add Magazine"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="magazines"
    />
  );
}