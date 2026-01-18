"use client";

import { useSearchParams, useRouter } from "next/navigation";
import * as z from "zod";
import {
  useAnnouncement,
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "@/lib/hooks/useAdmin";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  isActive: z.boolean().default(true),
  priority: z.coerce.number().default(0),
});

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = !!id;

  const { data: announcement, isLoading: isLoadingData } = useAnnouncement(id, { enabled: isEditing });
  const createMutation = useCreateAnnouncement({
    onSuccess: () => router.push("/admin/announcements"),
  });
  const updateMutation = useUpdateAnnouncement({
    onSuccess: () => router.push("/admin/announcements"),
  });

  const onSubmit = async (values) => {
    if (isEditing) {
      await updateMutation.mutateAsync({ id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const fields = [
    { name: "title", label: "Title", type: "text", placeholder: "e.g., New Advanced EDA Tools Available" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Detailed description of the announcement..." },
    { name: "date", label: "Date", type: "text", placeholder: "e.g., Today or 22-23 Oct" },
    { name: "time", label: "Time", type: "text", placeholder: "e.g., 2:30pm" },
    { name: "venue", label: "Venue", type: "text", placeholder: "e.g., MCA-1 LAB" },
    { name: "priority", label: "Priority", type: "number", placeholder: "Higher number means higher priority" },
    { name: "isActive", label: "Active", type: "switch" },
  ];

  return (
    <AdminFormTemplate
      title="Announcement"
      schema={announcementSchema}
      defaultValues={announcement || {
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        isActive: true,
        priority: 0,
      }}
      onSubmit={onSubmit}
      fields={fields}
      isLoading={createMutation.isPending || updateMutation.isPending || isLoadingData}
      isEditing={isEditing}
      backPath="/admin/announcements"
    />
  );
}
