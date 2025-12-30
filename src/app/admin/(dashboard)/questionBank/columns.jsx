// Question Banks
import { ActionCell } from "@/components/ActionCell";
import { useDeleteQuestionBank } from "@/lib/hooks/useAdmin";

export const columns = [
  {
    accessorKey: "topicName",
    header: "Topic Name",
  },
  {
    accessorKey: "subject", 
    header: "Subject",
  },
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
      const deleteQuestionBank = useDeleteQuestionBank();
      return (
        <ActionCell
          row={row}
          onDelete={deleteQuestionBank.mutateAsync}
          editPath="/admin/questionBank/createQuestionBank"
          itemName="Question Bank"
        />
      );
    },
  },
];