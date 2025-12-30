import { ActionCell } from "@/components/ActionCell";
import { useDeleteEvent } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "title",
    header: "Event Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "eventDate",
    header: "Event Date",
    cell: ({ row }) => new Date(row.getValue("eventDate")).toLocaleDateString(),
  },
  {
    accessorKey: "noOfParticipants",
    header: "Participants",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteEvent = useDeleteEvent();
      return (
        <ActionCell
          row={row}
          onDelete={deleteEvent.mutateAsync}
          editPath={`/admin/events/create-event?edit=${row.original.id}`}
          itemName="Event"
        />
      );
    },
  },
];