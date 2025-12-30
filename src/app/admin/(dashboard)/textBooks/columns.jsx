import { ActionCell } from "@/components/ActionCell";
import { useDeleteTextbook } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "name",
    header: "Book Name",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "link",
    header: "Download",
    cell: ({ row }) => (
      <a href={row.getValue("link")} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        Download
      </a>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteTextbook = useDeleteTextbook();
      return (
        <ActionCell
          row={row}
          onDelete={deleteTextbook.mutateAsync}
          editPath="/admin/textBooks/createTextBook"
          itemName="Textbook"
        />
      );
    },
  },
];