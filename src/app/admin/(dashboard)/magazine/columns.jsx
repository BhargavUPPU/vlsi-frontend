import { ActionCell } from "@/components/ActionCell";
import { useDeleteMagazine } from "@/lib/hooks/useAdmin";

export const columns = [
  { accessorKey: "title", header: "Magazine Title" },
  { accessorKey: "category", header: "Category" },
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
      const deleteMagazine = useDeleteMagazine();
      return (
        <ActionCell
          row={row}
          onDelete={deleteMagazine.mutateAsync}
          editPath="/admin/magazine/createMagazine"
          itemName="Magazine"
        />
      );
    },
  },
];