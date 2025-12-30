"use client";
import { columns } from "./column";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { usePlacementPrep } from "@/lib/hooks/useAdmin";

export default function PlacementPrepPage() {
  const { data: placementPrep, isLoading, error, refetch } = usePlacementPrep();

  return (
    <AdminPageTemplate
      title="Placement Preparation"
      data={placementPrep}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/placementPrep/createPlacementPrep"
      createButtonText="Add Placement Prep"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="placementPrep"
    />
  );
}