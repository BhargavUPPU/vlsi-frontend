"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateTextbook, useTextbook, useUpdateTextbook } from "@/lib/hooks/useAdmin";
import { textbookSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const textbookFields = [
  { name: "name", label: "Book Name", placeholder: "Enter book name" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Enter description" },
  { name: "subject", label: "Subject", placeholder: "Enter subject" },
  { name: "author", label: "Author", placeholder: "Enter author name" },
  { name: "link", label: "Download Link", placeholder: "https://..." },
  { name: "image", label: "Book Cover Image", type: "image" },
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

export default function CreateTextbookPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: textbook, isLoading } = useTextbook(editId, { enabled: isEditing });
  const createTextbook = useCreateTextbook();
  const updateTextbook = useUpdateTextbook();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateTextbook.mutateAsync({ id: editId, data });
    } else {
      await createTextbook.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Textbook"
      schema={textbookSchema}
      defaultValues={textbook || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/textBooks"
      fields={textbookFields}
    />
  );
}