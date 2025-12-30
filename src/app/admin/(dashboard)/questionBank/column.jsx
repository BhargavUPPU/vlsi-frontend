"use client";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select row"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "topicName",
    header: "Title",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => (
      <a
        href={row.getValue("link")}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View Question Bank
      </a>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //         const router = useRouter();
  //         return (
  //             <DropdownMenu>
  //                 <DropdownMenuTrigger asChild>
  //                     <Button variant="ghost" className="w-8 h-8 p-0">
  //                         <MoreHorizontal className="w-4 h-4" />
  //                     </Button>
  //                 </DropdownMenuTrigger>
  //                 <DropdownMenuContent align="end">
  //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //                     <DropdownMenuItem
  //                         onClick={() => {
  //                             router.push(
  //                                 `/admin/questionBank/editQuestionBank?questionBankId=${row.original.id}`
  //                             );
  //                         }}
  //                     >
  //                         Edit
  //                     </DropdownMenuItem>
  //                 </DropdownMenuContent>
  //             </DropdownMenu>
  //         );
  //     },
  // },
];
