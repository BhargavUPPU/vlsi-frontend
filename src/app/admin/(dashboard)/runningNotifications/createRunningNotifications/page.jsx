"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateRunningNotification,
  useRunningNotification,
  useUpdateRunningNotification,
} from "@/lib/hooks/useAdmin";
import { runningNotificationSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const runningNotificationFields = [
  {
    name: "message",
    label: "Notification Message",
    type: "textarea",
    placeholder: "Enter notification message",
  },
  { name: "link", label: "Link (Optional)", placeholder: "https://..." },
];

function CreateRunningNotificationContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: notification, isLoading } = useRunningNotification(editId, {
    enabled: isEditing,
  });
  const createNotification = useCreateRunningNotification();
  const updateNotification = useUpdateRunningNotification();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateNotification.mutateAsync({ id: editId, data });
    } else {
      await createNotification.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Running Notification"
      schema={runningNotificationSchema}
      defaultValues={notification || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/runningNotifications"
      fields={runningNotificationFields}
    />
  );
}

export default function CreateRunningNotificationPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateRunningNotificationContent />
    </Suspense>
  );
}
