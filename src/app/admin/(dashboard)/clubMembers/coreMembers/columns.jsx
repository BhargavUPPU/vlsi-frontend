import { ActionCell } from "@/components/ActionCell";
import { useDeleteCoreMember } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "portfolio",
    header: "Portfolio",
  },
  {
    accessorKey: "academicYear",
    header: "Academic Year", 
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteCoreMember = useDeleteCoreMember();
      return (
        <ActionCell
          row={row}
          onDelete={deleteCoreMember.mutateAsync}
          editPath="/admin/clubMembers/coreMembers/createCoreMember"
          itemName="Core Member"
        />
      );
    },
  },
];