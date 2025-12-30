"use client";
import { columns } from "./column";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useQuestionBanks } from "@/lib/hooks/useAdmin";

export default function QuestionBanksPage() {
  const { data: questionBanks, isLoading, error, refetch } = useQuestionBanks();

  return (
    <AdminPageTemplate
      title="Question Banks"
      data={questionBanks}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/questionBank/createQuestionBank"
      createButtonText="Add Question Bank"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="questionBanks"
    />
  );
}