"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateTest, useTest, useUpdateTest } from "@/lib/hooks/useAdmin";
import { testSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const testFields = [
  { name: "title", label: "Test Title", placeholder: "Enter test title" },
  { name: "subject", label: "Subject", placeholder: "Enter subject" },
  { name: "type", label: "Test Type", placeholder: "Enter test type" },
  { name: "noOfQuestions", label: "Number of Questions", type: "number", placeholder: "Enter number" },
  { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "Enter duration" },
  { name: "examLink", label: "Exam Link", placeholder: "https://..." },
  { name: "date", label: "Test Date", type: "datetime-local" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Enter description (optional)" },
];

export default function CreateTestPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: test, isLoading } = useTest(editId, { enabled: isEditing });
  const createTest = useCreateTest();
  const updateTest = useUpdateTest();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateTest.mutateAsync({ id: editId, data });
    } else {
      await createTest.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Test"
      schema={testSchema}
      defaultValues={test || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/test"
      fields={testFields}
    >
      {(form) => (
        <div className="space-y-2">
          <Label>Status</Label>
          <Select onValueChange={(value) => form.setValue('status', value)} defaultValue={form.getValues('status')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </AdminFormTemplate>
  );
}