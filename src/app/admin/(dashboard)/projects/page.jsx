"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useProjects } from "@/lib/hooks/useAdmin";

export default function ProjectsPage() {
  const { data: projects, isLoading, error, refetch } = useProjects();

  return (
    <AdminPageTemplate
      title="Projects"
      data={projects}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/projects/createProject"
      createButtonText="Create Project"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="projects"
    />
  );
}
