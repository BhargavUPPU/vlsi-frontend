import { ActionCell } from "@/components/ActionCell";
import { useDeletePlacementPrep } from "@/lib/hooks/useAdmin";

export const columns = [
  { accessorKey: "name", header: "Resource Name" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <a href={row.getValue("link")} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        View
      </a>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deletePlacementPrep = useDeletePlacementPrep();
      return (
        <ActionCell
          row={row}
          onDelete={deletePlacementPrep.mutateAsync}
          editPath="/admin/placementPrep/createPlacementPrep"
          itemName="Placement Prep"
        />
      );
    },
  },
];