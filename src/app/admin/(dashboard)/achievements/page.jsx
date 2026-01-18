"use client";

import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useAchievements } from "@/lib/hooks/useAdmin";

export default function AchievementsAdminPage() {
  const { data: achievements, isLoading, error, refetch } = useAchievements();

  return (
    <AdminPageTemplate
      title="Achievements Management"
      data={achievements}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/achievements/create-achievement"
      createButtonText="Add Achievement"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="achievements"
    />
  );
}
