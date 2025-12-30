"use client";
import { columns } from "./column";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useRunningNotifications } from "@/lib/hooks/useAdmin";

export default function NotificationsPage() {
  const { data: notifications, isLoading, error, refetch } = useRunningNotifications();

  return (
    <AdminPageTemplate
      title="Running Notifications"
      data={notifications}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/runningNotifications/createRunningNotifications"
      createButtonText="Create Notification"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="notifications"
    />
  );
}