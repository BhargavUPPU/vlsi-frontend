"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateVlsiMaterial,
  useVlsiMaterial,
  useUpdateVlsiMaterial,
} from "@/lib/hooks/useAdmin";
import { vlsiMaterialSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const vlsiMaterialFields = [
  { name: "name", label: "Material Name", placeholder: "Enter material name" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "CMOS VLSI Design", value: "CMOS VLSI Design" },
      { label: "Digital Design", value: "Digital Design" },
      { label: "Computer Architecture", value: "Computer Architecture" },
      { label: "FPGAs", value: "FPGAs" },
      { label: "Physical Design", value: "Physical Design" },
      { label: "RTL to GDS", value: "RTL to GDS" },
      { label: "SoC Design & Verification", value: "SoC Design & Verification" },
      { label: "Programming", value: "Programming" },
      { label: "RISC-V", value: "RISC-V" },
      { label: "Protocols", value: "Protocols" },
      { label: "Semiconductor Physics", value: "Semiconductor Physics" },
    ],
  },
  { name: "link", label: "Download Link", placeholder: "https://..." },
  { name: "image", label: "Material Thumbnail", type: "image" },
];

function CreateVlsiMaterialContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: vlsiMaterial, isLoading } = useVlsiMaterial(editId, {
    enabled: isEditing,
  });
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

export default function CreateVlsiMaterialPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateVlsiMaterialContent />
    </Suspense>
  );
}
