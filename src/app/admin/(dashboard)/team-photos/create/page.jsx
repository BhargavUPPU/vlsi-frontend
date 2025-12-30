"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateTeamPhoto, useTeamPhoto, useUpdateTeamPhoto } from "@/lib/hooks/useAdmin";
import { teamPhotoSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const teamPhotoFields = [
  { name: "academicYear", label: "Academic Year", placeholder: "e.g., 2023-2024" },
];

export default function CreateTeamPhotoPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: teamPhoto, isLoading } = useTeamPhoto(editId, { enabled: isEditing });
  const createTeamPhoto = useCreateTeamPhoto();
  const updateTeamPhoto = useUpdateTeamPhoto();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateTeamPhoto.mutateAsync({ id: editId, data });
    } else {
      await createTeamPhoto.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Team Photo"
      schema={teamPhotoSchema}
      defaultValues={teamPhoto || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/team-photos"
      fields={teamPhotoFields}
    />
  );
}