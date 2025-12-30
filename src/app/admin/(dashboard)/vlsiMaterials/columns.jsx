import { ActionCell } from "@/components/ActionCell";
import { useDeleteVlsiMaterial } from "@/lib/hooks/useAdmin";

export const columns = [
  { accessorKey: "name", header: "Material Name" },
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
      const deleteVlsiMaterial = useDeleteVlsiMaterial();
      return (
        <ActionCell
          row={row}
          onDelete={deleteVlsiMaterial.mutateAsync}
          editPath="/admin/vlsiMaterials/createVlsiMaterial"
          itemName="VLSI Material"
        />
      );
    },
  },
];