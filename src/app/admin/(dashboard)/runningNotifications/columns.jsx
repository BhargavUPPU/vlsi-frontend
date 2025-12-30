import { ActionCell } from "@/components/ActionCell";
import { useDeleteRunningNotification } from "@/lib/hooks/useAdmin";

export const columns = [
  { 
    accessorKey: "message", 
    header: "Message",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.getValue("message")}</div>
    ),
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link = row.getValue("link");
      return link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          View
        </a>
      ) : null;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deleteNotification = useDeleteRunningNotification();
      return (
        <ActionCell
          row={row}
          onDelete={deleteNotification.mutateAsync}
          editPath="/admin/runningNotifications/createRunningNotifications"
          itemName="Notification"
        />
      );
    },
  },
];