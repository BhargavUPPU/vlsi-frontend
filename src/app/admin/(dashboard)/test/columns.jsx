import { ActionCell } from "@/components/ActionCell";
import { useDeleteTest } from "@/lib/hooks/useAdmin";

export const columns = [
  { accessorKey: "title", header: "Test Title" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "duration", header: "Duration (min)" },
  {
    accessorKey: "examLink",
    header: "Exam",
    cell: ({ row }) => (
      <a href={row.getValue("examLink")} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        Take Test
      </a>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteTest = useDeleteTest();
      return (
        <ActionCell
          row={row}
          onDelete={deleteTest.mutateAsync}
          editPath="/admin/test/createTest"
          itemName="Test"
        />
      );
    },
  },
];