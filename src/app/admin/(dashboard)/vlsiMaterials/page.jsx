"use client";
import { columns } from "./column";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useVlsiMaterials } from "@/lib/hooks/useAdmin";

export default function VlsiMaterialsPage() {
  const { data: vlsiMaterials, isLoading, error, refetch } = useVlsiMaterials();

  return (
    <AdminPageTemplate
      title="VLSI Materials"
      data={vlsiMaterials}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/vlsiMaterials/createVlsiMaterial"
      createButtonText="Add VLSI Material"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="vlsiMaterials"
    />
  );
}