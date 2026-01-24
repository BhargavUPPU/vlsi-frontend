"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateGatePyq,
  useGatePyq,
  useUpdateGatePyq,
} from "@/lib/hooks/useAdmin";
import { gatePyqSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const gatePyqFields = [
  { name: "year", label: "Year", type: "number", placeholder: "Enter year" },
  {
    name: "name",
    label: "Question Paper Name",
    placeholder: "Enter paper name",
  },
  { name: "link", label: "Download Link", placeholder: "https://..." },
  { name: "image", label: "Paper Image", type: "image" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Analog Electronics", value: "Analog Electronics" },
      { label: "Digital Electronics", value: "Digital Electronics" },
      { label: "Network Theory", value: "Network Theory" },
      { label: "Signals & Systems", value: "Signals & Systems" },
      { label: "Communication", value: "Communication" },
      { label: "Verilog", value: "Verilog" },
      { label: "EDC", value: "EDC" },
    ],
  },
];

function CreateGatePyqContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: gatePyq, isLoading } = useGatePyq(editId, {
    enabled: isEditing,
  });
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

export default function CreateGatePyqPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateGatePyqContent />
    </Suspense>
  );
}
