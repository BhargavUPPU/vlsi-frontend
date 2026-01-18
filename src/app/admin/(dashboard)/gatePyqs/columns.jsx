import { ActionCell } from "@/components/ActionCell";
import { useDeleteGatePyq } from "@/lib/hooks/useAdmin";

export const columns = [
  { accessorKey: "year", header: "Year" },
  { accessorKey: "name", header: "Paper Name" },
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
      const deleteGatePyq = useDeleteGatePyq();
      return (
        <ActionCell
          row={row}
          onDelete={deleteGatePyq.mutateAsync}
          editPath="/admin/gatePyqs/createGatePyqs"
          itemName="GATE PYQ"
        />
      );
    },
  },
];