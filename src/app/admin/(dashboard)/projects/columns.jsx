import { ActionCell } from "@/components/ActionCell";
import { useDeleteProject } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "title",
    header: "Project Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "academicYear",
    header: "Academic Year",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteProject = useDeleteProject();
      return (
        <ActionCell
          row={row}
          onDelete={deleteProject.mutateAsync}
          editPath="/admin/projects/createProject"
          itemName="Project"
        />
      );
    },
  },
];