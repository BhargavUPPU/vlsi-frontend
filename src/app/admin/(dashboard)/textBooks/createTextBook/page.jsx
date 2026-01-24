"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateTextbook,
  useTextbook,
  useUpdateTextbook,
} from "@/lib/hooks/useAdmin";
import { textbookSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const textbookFields = [
  { name: "name", label: "Book Name", placeholder: "Enter book name" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter description",
  },
  { name: "subject", label: "Subject", placeholder: "Enter subject" },
  { name: "author", label: "Author", placeholder: "Enter author name" },
  { name: "link", label: "Download Link", placeholder: "https://..." },
  { name: "image", label: "Book Cover Image", type: "image" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "VLSI Textbooks & NPTEL Lectures", value: "VLSI Textbooks & NPTEL Lectures" },
      { label: "Analog Design (CMOS)", value: "Analog Design (CMOS)" },
      { label: "CMOS VLSI Design (B)", value: "CMOS VLSI Design (B)" },
      { label: "DFT (B)", value: "DFT (B)" },
      { label: "Digital Design (B)", value: "Digital Design (B)" },
      { label: "Digital IC Design (B)", value: "Digital IC Design (B)" },
      { label: "VLSI Flow", value: "VLSI Flow" },
      { label: "Scripting Language (TCL, PERL)", value: "Scripting Language (TCL, PERL)" },
      { label: "Verilog & SystemVerilog", value: "Verilog & SystemVerilog" },
      { label: "Semiconductor Physics & FPGAs", value: "Semiconductor Physics & FPGAs" },
    ],
  },
];

function CreateTextbookContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: textbook, isLoading } = useTextbook(editId, {
    enabled: isEditing,
  });
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

export default function CreateTextbookPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateTextbookContent />
    </Suspense>
  );
}
