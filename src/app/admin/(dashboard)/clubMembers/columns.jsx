import { ActionCell } from "@/components/ActionCell";
import { useDeleteClubMember } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "academicYear", 
    header: "Academic Year",
  },
  {
    accessorKey: "sectionBranch",
    header: "Section/Branch",
  },
  {
    accessorKey: "rollNumber",
    header: "Roll Number",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteClubMember = useDeleteClubMember();
      return (
        <ActionCell
          row={row}
          onDelete={deleteClubMember.mutateAsync}
          editPath="/admin/clubMembers/editClubMember"
          itemName="Club Member"
        />
      );
    },
  },
];