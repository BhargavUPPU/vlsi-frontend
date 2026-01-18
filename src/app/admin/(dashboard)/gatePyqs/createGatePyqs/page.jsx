"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateGatePyq, useGatePyq, useUpdateGatePyq } from "@/lib/hooks/useAdmin";
import { gatePyqSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const gatePyqFields = [
  { name: "year", label: "Year", type: "number", placeholder: "Enter year" },
  { name: "name", label: "Question Paper Name", placeholder: "Enter paper name" },
  { name: "link", label: "Download Link", placeholder: "https://..." },
  { name: "image", label: "Paper Image", type: "image" },
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

export default function CreateGatePyqPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: gatePyq, isLoading } = useGatePyq(editId, { enabled: isEditing });
  const createGatePyq = useCreateGatePyq();
  const updateGatePyq = useUpdateGatePyq();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateGatePyq.mutateAsync({ id: editId, data });
    } else {
      await createGatePyq.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="GATE PYQ"
      schema={gatePyqSchema}
      defaultValues={gatePyq || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/gatePyqs"
      fields={gatePyqFields}
    />
  );
}