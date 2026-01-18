"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useAnnouncements } from "@/lib/hooks/useAdmin";

export default function AnnouncementsPage() {
  const { data: announcements, isLoading, error, refetch } = useAnnouncements();

  return (
    <AdminPageTemplate
      title="Announcements"
      data={announcements}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/announcements/create-announcement"
      createButtonText="Create Announcement"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="announcements"
    />
  );
}
