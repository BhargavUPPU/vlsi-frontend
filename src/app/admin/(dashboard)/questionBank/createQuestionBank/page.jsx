// Question Bank Form
"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateQuestionBank,
  useQuestionBank,
  useUpdateQuestionBank,
} from "@/lib/hooks/useAdmin";
import { questionBankSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const questionBankFields = [
  { name: "topicName", label: "Topic Name", placeholder: "Enter topic name" },
  { name: "subject", label: "Subject", placeholder: "Enter subject" },
  { name: "link", label: "Link", placeholder: "https://..." },
  { name: "image", label: "Question Bank Thumbnail", type: "image" },
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

function CreateQuestionBankContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: questionBank, isLoading } = useQuestionBank(editId, {
    enabled: isEditing,
  });
  const createQuestionBank = useCreateQuestionBank();
  const updateQuestionBank = useUpdateQuestionBank();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateQuestionBank.mutateAsync({ id: editId, data });
    } else {
      await createQuestionBank.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Question Bank"
      schema={questionBankSchema}
      defaultValues={questionBank || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/questionBank"
      fields={questionBankFields}
    />
  );
}

export default function CreateQuestionBankPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateQuestionBankContent />
    </Suspense>
  );
}
