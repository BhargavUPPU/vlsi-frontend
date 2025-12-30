"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateMagazine, useMagazine, useUpdateMagazine } from "@/lib/hooks/useAdmin";
import { magazineSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const magazineFields = [
  { name: "title", label: "Magazine Title", placeholder: "Enter magazine title" },
  { name: "link", label: "Download Link", placeholder: "https://..." },
  { name: "image", label: "Magazine Cover Image", type: "image" },
];

export default function CreateMagazinePage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: magazine, isLoading } = useMagazine(editId, { enabled: isEditing });
  const createMagazine = useCreateMagazine();
  const updateMagazine = useUpdateMagazine();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateMagazine.mutateAsync({ id: editId, data });
    } else {
      await createMagazine.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Magazine"
      schema={magazineSchema}
      defaultValues={magazine || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/magazine"
      fields={magazineFields}
    />
  );
}