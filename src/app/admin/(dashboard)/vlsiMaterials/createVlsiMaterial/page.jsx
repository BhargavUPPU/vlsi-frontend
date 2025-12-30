"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateVlsiMaterial, useVlsiMaterial, useUpdateVlsiMaterial } from "@/lib/hooks/useAdmin";
import { vlsiMaterialSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const vlsiMaterialFields = [
  { name: "name", label: "Material Name", placeholder: "Enter material name" },
  { name: "category", label: "Category", placeholder: "Enter category" },
  { name: "link", label: "Download Link", placeholder: "https://..." },
  { name: "image", label: "Material Thumbnail", type: "image" },
];

export default function CreateVlsiMaterialPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: vlsiMaterial, isLoading } = useVlsiMaterial(editId, { enabled: isEditing });
  const createVlsiMaterial = useCreateVlsiMaterial();
  const updateVlsiMaterial = useUpdateVlsiMaterial();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateVlsiMaterial.mutateAsync({ id: editId, data });
    } else {
      await createVlsiMaterial.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="VLSI Material"
      schema={vlsiMaterialSchema}
      defaultValues={vlsiMaterial || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/vlsiMaterials"
      fields={vlsiMaterialFields}
    />
  );
}