import { ActionCell } from "@/components/ActionCell";
import { useDeleteAnnouncement } from "@/lib/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "time",
    header: "Time",
  },
  {
    accessorKey: "venue",
    header: "Venue",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge variant={isActive ? "success" : "destructive"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteAnnouncement = useDeleteAnnouncement();
      return (
        <ActionCell
          row={row}
          onDelete={deleteAnnouncement.mutateAsync}
          editPath="/admin/announcements/create-announcement"
          itemName="Announcement"
        />
      );
    },
  },
];
