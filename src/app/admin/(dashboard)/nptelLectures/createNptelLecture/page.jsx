"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateNptelLecture, useNptelLecture, useUpdateNptelLecture } from "@/lib/hooks/useAdmin";
import { nptelLectureSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const nptelLectureFields = [
  { name: "courseName", label: "Course Name", placeholder: "Enter course name" },
  { name: "professorName", label: "Professor Name", placeholder: "Enter professor name" },
  { name: "link", label: "Video Link", placeholder: "https://..." },
  { name: "image", label: "Course Thumbnail", type: "image" },
  { 
    name: "category", 
    label: "Category", 
    type: "select", 
    options: [
      { label: "Analog design", value: "Analog design" },
      { label: "CMOS VLSI Design", value: "CMOS VLSI Design" },
      { label: "Digital Design", value: "Digital Design" },
      { label: "Digital IC Design", value: "Digital IC Design" },
      { label: "FPGA & ASIC Design", value: "FPGA & ASIC Design" },
      { label: "Semiconductor Physics", value: "Semiconductor Physics" },
      { label: "General", value: "General" }
    ]
  },
];

export default function CreateNptelLecturePage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: nptelLecture, isLoading } = useNptelLecture(editId, { enabled: isEditing });
  const createNptelLecture = useCreateNptelLecture();
  const updateNptelLecture = useUpdateNptelLecture();

  const handleSubmit = async (data) => {
    if (isEditing) {
      await updateNptelLecture.mutateAsync({ id: editId, data });
    } else {
      await createNptelLecture.mutateAsync(data);
    }
  };

  return (
    <AdminFormTemplate
      title="NPTEL Lecture"
      schema={nptelLectureSchema}
      defaultValues={nptelLecture || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/nptelLectures"
      fields={nptelLectureFields}
    />
  );
}