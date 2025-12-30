"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useEvents } from "@/lib/hooks/useAdmin";

export default function EventsPage() {
  const { data: events, isLoading, error, refetch } = useEvents();

  return (
    <AdminPageTemplate
      title="Events"
      data={events}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/events/create-event"
      createButtonText="Create Event"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="events"
    />
  );
}
