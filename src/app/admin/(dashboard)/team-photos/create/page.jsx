"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateTeamPhoto, useTeamPhoto, useUpdateTeamPhoto } from "@/lib/hooks/useAdmin";
import { teamPhotoSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const teamPhotoFields = [
  { name: "academicYear", label: "Academic Year", placeholder: "e.g., 2023-2024" },
  { name: "image", label: "Team Photo Image", type: "image", required: true },
];

export default function CreateTeamPhotoPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: teamPhoto, isLoading } = useTeamPhoto(editId, { enabled: isEditing });
  const createTeamPhoto = useCreateTeamPhoto();
  const updateTeamPhoto = useUpdateTeamPhoto();


  // AdminFormTemplate will send FormData if an image field is present
  const handleSubmit = async (formDataOrData) => {
    if (isEditing) {
      await updateTeamPhoto.mutateAsync({ id: editId, data: formDataOrData });
    } else {
      await createTeamPhoto.mutateAsync(formDataOrData);
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