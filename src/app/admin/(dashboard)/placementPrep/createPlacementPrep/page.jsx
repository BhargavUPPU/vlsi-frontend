"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreatePlacementPrep, usePlacementPrepItem, useUpdatePlacementPrep } from "@/lib/hooks/useAdmin";
import { placementPrepSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const placementPrepFields = [
  { name: "name", label: "Name", placeholder: "Enter resource name" },
  { name: "link", label: "Resource Link", placeholder: "https://..." },
  { name: "image", label: "Resource Thumbnail", type: "image" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    options: [
      { label: "Analog design", value: "Analog design" },
      { label: "CMOS VLSI Design", value: "CMOS VLSI Design" },
      { label: "Digital Design", value: "Digital Design" },
      { label: "Digital IC Design", value: "Digital IC Design" },
      { label: "FPGA & ASIC Design", value: "FPGA & ASIC Design" },
      { label: "Semiconductor Physics", value: "Semiconductor Physics" },
      { label: "General", value: "General" }
    ]
  },
];

export default function CreatePlacementPrepPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: placementPrep, isLoading } = usePlacementPrepItem(editId, { enabled: isEditing });
  const createPlacementPrep = useCreatePlacementPrep();
  const updatePlacementPrep = useUpdatePlacementPrep();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updatePlacementPrep.mutateAsync({ id: editId, data });
    } else {
      await createPlacementPrep.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Placement Preparation"
      schema={placementPrepSchema}
      defaultValues={placementPrep || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/placementPrep"
      fields={placementPrepFields}
    />
  );
}