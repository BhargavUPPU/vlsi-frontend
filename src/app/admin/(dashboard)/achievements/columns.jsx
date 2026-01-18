"use client";

import { Badge } from "@/components/ui/badge";
import { ActionCell } from "@/components/ActionCell";
import { useDeleteAchievement } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <Badge variant="outline" className="font-semibold px-2 py-0.5 whitespace-nowrap">
          {type.replace(/_/g, " ")}
        </Badge>
      );
    }
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate font-medium">
        {row.getValue("title") || "Untitled"}
      </div>
    )
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "priority",
    header: "Priority",
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
      const deleteAchievement = useDeleteAchievement();
      return (
        <ActionCell
          row={row}
          onDelete={deleteAchievement.mutateAsync}
          editPath="/admin/achievements/create-achievement"
          itemName="Achievement"
        />
      );
    },
  },
];
