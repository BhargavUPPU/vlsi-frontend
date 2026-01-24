"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateCoreMember,
  useCoreMember,
  useUpdateCoreMember,
} from "@/lib/hooks/useAdmin";
import { coreMemberSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const coreMemberFields = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter member name",
    required: true,
  },
  {
    name: "academicYear",
    label: "Academic Year",
    placeholder: "e.g., 2023",
    required: true,
  },
  {
    name: "sectionBranch",
    label: "Section/Branch",
    placeholder: "e.g., CSE-A",
    required: true,
  },
  {
    name: "rollNumber",
    label: "Roll Number",
    placeholder: "Enter roll number",
    required: true,
  },
  {
    name: "category",
    label: "Category",
    placeholder: "Enter category",
    required: true,
  },
  {
    name: "teamCategory",
    label: "Team Category",
    placeholder: "Enter team category (optional)",
  },
  {
    name: "memberShipId",
    label: "Membership ID",
    placeholder: "Enter membership ID (optional)",
  },
  {
    name: "description",
    label: "Description/Biography",
    placeholder: "Enter short bio or description (optional)",
    type: "textarea",
  },
  { name: "image", label: "Member Photo", type: "image", required: true },
];

function CreateCoreMemberContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: coreMember, isLoading: loadingCoreMember } = useCoreMember(
    editId,
    {
      enabled: isEditing,
    },
  );

  const createCoreMember = useCreateCoreMember({
    successMessage: "Core member added successfully",
  });

  const updateCoreMember = useUpdateCoreMember({
    successMessage: "Core member updated successfully",
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
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <Label>
              Portfolio <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => form.setValue("portfolio", value)}
              defaultValue={form.getValues("portfolio")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select portfolio" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Executive Team",
                  "Central Coordinating Team",
                  "Knowledge Transfer Team",
                  "Alumni Managing & Hero Team",
                  "Oracthon Exec & Research Outreach Team",
                  "Juniors Recruitment Team",
                  "Juniors Coordinator Team",
                  "Outreach Team",
                  "Translation & Data Handling Team",
                  "Documentation Team",
                  "Web Handling Team",
                ].map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </AdminFormTemplate>
  );
}

export default function CreateCoreMemberPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateCoreMemberContent />
    </Suspense>
  );
}
