"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateClubMember,
  useClubMember,
  useUpdateClubMember,
} from "@/lib/hooks/useAdmin";
import { clubMemberSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const clubMemberFields = [
  { name: "name", label: "Name", placeholder: "Enter member name" },
  {
    name: "academicYear",
    label: "Academic Year",
    placeholder: "e.g., 2023-2024",
  },
  {
    name: "sectionBranch",
    label: "Section/Branch",
    placeholder: "e.g., CSE-A",
  },
  {
    name: "rollNumber",
    label: "Roll Number",
    placeholder: "Enter roll number",
  },
  {
    name: "memberShipId",
    label: "Membership ID",
    placeholder: "Enter membership ID (optional)",
  },
];

function CreateClubMemberContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: clubMember, isLoading: loadingClubMember } = useClubMember(
    editId,
    {
      enabled: isEditing,
    },
  );

  const createClubMember = useCreateClubMember({
    successMessage: "Club member added successfully",
  });

  const updateClubMember = useUpdateClubMember({
    successMessage: "Club member updated successfully",
  });

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateClubMember.mutateAsync({ id: editId, data });
    } else {
      await createClubMember.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Club Member"
      schema={clubMemberSchema}
      defaultValues={clubMember || {}}
      onSubmit={handleSubmit}
      isLoading={loadingClubMember}
      isEditing={isEditing}
      backPath="/admin/clubMembers"
      fields={clubMemberFields}
    />
  );
}

export default function CreateClubMemberPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateClubMemberContent />
    </Suspense>
  );
}
