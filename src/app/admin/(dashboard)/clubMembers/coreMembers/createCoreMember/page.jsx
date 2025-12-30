"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateCoreMember, useCoreMember, useUpdateCoreMember } from "@/lib/hooks/useAdmin";
import { coreMemberSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const coreMemberFields = [
  { name: "name", label: "Name", placeholder: "Enter member name", required: true },
  { name: "academicYear", label: "Academic Year", placeholder: "e.g., 2023", required: true },
  { name: "sectionBranch", label: "Section/Branch", placeholder: "e.g., CSE-A", required: true },
  { name: "portfolio", label: "Portfolio", placeholder: "Enter portfolio/position", required: true },
  { name: "rollNumber", label: "Roll Number", placeholder: "Enter roll number", required: true },
  { name: "category", label: "Category", placeholder: "Enter category", required: true },
  { name: "teamCategory", label: "Team Category", placeholder: "Enter team category (optional)" },
  { name: "memberShipId", label: "Membership ID", placeholder: "Enter membership ID (optional)" },
  { name: "image", label: "Member Photo", type: "image", required: true },
];

export default function CreateCoreMemberPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: coreMember, isLoading: loadingCoreMember } = useCoreMember(editId, {
    enabled: isEditing
  });

  const createCoreMember = useCreateCoreMember({
    successMessage: "Core member added successfully"
  });

  const updateCoreMember = useUpdateCoreMember({
    successMessage: "Core member updated successfully"
  });

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateCoreMember.mutateAsync({ id: editId, data });
    } else {
      await createCoreMember.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Core Member"
      schema={coreMemberSchema}
      defaultValues={coreMember || {}}
      onSubmit={handleSubmit}
      isLoading={loadingCoreMember}
      isEditing={isEditing}
      backPath="/admin/clubMembers/coreMembers"
      fields={coreMemberFields}
    />
  );
}