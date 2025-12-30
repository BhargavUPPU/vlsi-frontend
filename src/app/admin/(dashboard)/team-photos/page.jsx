"use client";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { useTeamPhotos } from "@/lib/hooks/useAdmin";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionCell } from "@/components/ActionCell";
import { useDeleteTeamPhoto } from "@/lib/hooks/useAdmin";
const columns = [
  {
    accessorKey: "academicYear",
    header: "Academic Year",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
     {
       id: "actions",
       cell: ({ row }) => {
         const deleteTeamPhoto = useDeleteTeamPhoto();
         return (
           <ActionCell
             row={row}
             onDelete={deleteTeamPhoto.mutateAsync}
             editPath={`/admin/team-photos/create?edit=${row.original.id}`}
             itemName="Team Photo"
           />
         );
       },
     },
];

export default function TeamPhotosPage() {
  const { data: teamPhotos, isLoading, error, refetch } = useTeamPhotos();

  return (
    <AdminPageTemplate
      title="Team Photos"
      data={teamPhotos}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/team-photos/create"
      createButtonText="Upload Team Photos"
      onRefresh={refetch}
      searchKey="academicYear"
      apiEndpoint="teamPhotos"
    />
  );
}