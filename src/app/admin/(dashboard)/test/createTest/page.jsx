"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateTest, useTest, useUpdateTest } from "@/lib/hooks/useAdmin";
import { testSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";

const testFields = [
  { name: "title", label: "Test Title", placeholder: "Enter test title" },
  { name: "subject", label: "Subject", placeholder: "Enter subject" },
  { name: "type", label: "Test Type", placeholder: "Enter test type" },
  {
    name: "noOfQuestions",
    label: "Number of Questions",
    type: "number",
    placeholder: "Enter number",
  },
  {
    name: "duration",
    label: "Duration (minutes)",
    type: "number",
    placeholder: "Enter duration",
  },
  { name: "examLink", label: "Exam Link", placeholder: "https://..." },
  { name: "date", label: "Test Date", type: "datetime-local" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter description (optional)",
  },
];

function CreateTestContent() {
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
      defaultValues={
        test
          ? {
              ...test,
              date: test.date
                ? (() => {
                    try {
                      const d = new Date(test.date);
                      // convert to local YYYY-MM-DDTHH:mm for datetime-local input
                      const tzOffsetMs = d.getTimezoneOffset() * 60000;
                      const local = new Date(d.getTime() - tzOffsetMs);
                      return local.toISOString().slice(0, 16);
                    } catch (e) {
                      return test.date;
                    }
                  })()
                : test.date,
            }
          : {}
      }
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/test"
      fields={testFields}
    >
      {(form) => (
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}
    </AdminFormTemplate>
  );
}

export default function CreateTestPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateTestContent />
    </Suspense>
  );
}
