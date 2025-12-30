// NPTEL Lectures
import { ActionCell } from "@/components/ActionCell";
import { useDeleteNptelLecture } from "@/lib/hooks/useAdmin";

export const columns = [
  { accessorKey: "courseName", header: "Course Name" },
  { accessorKey: "professorName", header: "Professor" },
  {
    accessorKey: "link",
    header: "Video",
    cell: ({ row }) => (
      <a href={row.getValue("link")} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        Watch
      </a>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteNptelLecture = useDeleteNptelLecture();
      return (
        <ActionCell
          row={row}
          onDelete={deleteNptelLecture.mutateAsync}
          editPath="/admin/nptelLectures/createNptelLecture"
          itemName="NPTEL Lecture"
        />
      );
    },
  },
];