"use client";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useTeamPhotos } from "@/lib/hooks/useAdmin";

const columns = [
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "imageCount",
    header: "Images",
  },
];

export default function TeamPhotosPage() {
  const { data: teamPhotos, isLoading, error, refetch } = useTeamPhotos();

  return (
    <AdminPageTemplate
      title="Team Photos"
      data={teamPhotos}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/team-photos/create"
      createButtonText="Upload Team Photos"
      onRefresh={refetch}
      searchKey="year"
      apiEndpoint="teamPhotos"
    />
  );
}