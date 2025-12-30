"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateProject, useProject, useUpdateProject } from "@/lib/hooks/useAdmin";
import { projectSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const projectFields = [
  { name: "title", label: "Project Title", placeholder: "Enter project title", required: true },
  { name: "Introduction", label: "Introduction", type: "textarea", placeholder: "Enter project introduction", rows: 4, required: true },
  { name: "academicYear", label: "Academic Year", placeholder: "e.g., 2023-2024", required: true },
  { name: "Mentor", label: "Mentor", placeholder: "Enter mentor name", required: true },
  { name: "Members", label: "Team Members", type: "array", placeholder: "Add team member name" },
  { name: "Statement", label: "Problem Statement", type: "textarea", placeholder: "Enter problem statement", rows: 4 },
  { name: "Abstract", label: "Abstract", type: "textarea", placeholder: "Enter project abstract", rows: 4 },
  { name: "Methodology", label: "Methodology", type: "textarea", placeholder: "Enter methodology", rows: 4 },
  { name: "Results", label: "Results", type: "textarea", placeholder: "Enter results", rows: 4 },
  { name: "Conclusion", label: "Conclusion", type: "textarea", placeholder: "Enter conclusion", rows: 4, fullWidth: true },
  { name: "futureScope", label: "Future Scope", type: "textarea", placeholder: "Enter future scope", rows: 4 },
  { name: "Tools", label: "Tools & Technologies", type: "array", placeholder: "Add tool/technology name" },
  { name: "referenceLinks", label: "Reference Links", type: "array", placeholder: "Add reference URL", inputType: "url" },
  { name: "Link", label: "Project Link", placeholder: "https://..." },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
  { name: "projectImages", label: "Project Images", type: "multipleImages", maxFiles: 12 },
];

export default function CreateProjectPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: project, isLoading: loadingProject } = useProject(editId, {
    enabled: isEditing
  });

  const createProject = useCreateProject({
    successMessage: "Project created successfully"
  });

  const updateProject = useUpdateProject({
    successMessage: "Project updated successfully"
  });

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateProject.mutateAsync({ id: editId, data });
    } else {
      await createProject.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="Project"
      schema={projectSchema}
      defaultValues={project || {}}
      onSubmit={handleSubmit}
      isLoading={loadingProject}
      isEditing={isEditing}
      backPath="/admin/projects"
      fields={projectFields}
    >
      {(form) => (
        <>
          <div className="space-y-2">
            <Label>Status *</Label>
            <Select onValueChange={(value) => form.setValue('status', value)} defaultValue={form.getValues('status')}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select onValueChange={(value) => form.setValue('category', value)} defaultValue={form.getValues('category')}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vlsi">VLSI</SelectItem>
                <SelectItem value="Embedded">Embedded</SelectItem>
                <SelectItem value="AI and ML">AI and ML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </AdminFormTemplate>
  );
}
