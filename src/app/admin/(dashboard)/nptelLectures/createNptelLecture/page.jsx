"use client";
import { Suspense } from "react";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import {
  useCreateNptelLecture,
  useNptelLecture,
  useUpdateNptelLecture,
} from "@/lib/hooks/useAdmin";
import { nptelLectureSchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const nptelLectureFields = [
  {
    name: "courseName",
    label: "Course Name",
    placeholder: "Enter course name",
  },
  {
    name: "professorName",
    label: "Professor Name",
    placeholder: "Enter professor name",
  },
  { name: "link", label: "Video Link", placeholder: "https://..." },
  { name: "image", label: "Course Thumbnail", type: "image" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Analog Design", value: "Analog Design" },
      { label: "CMOS VLSI Design", value: "CMOS VLSI Design" },
      { label: "DFT", value: "DFT" },
      { label: "Digital Design", value: "Digital Design" },
      { label: "Digital IC Design", value: "Digital IC Design" },
      { label: "VLSI Flow", value: "VLSI Flow" },
      { label: "Scripting Language (TCL, PERL)", value: "Scripting Language (TCL, PERL)" },
      { label: "Verilog & SystemVerilog", value: "Verilog & SystemVerilog" },
      { label: "Semiconductor Physics & FPGAs", value: "Semiconductor Physics & FPGAs" },
    ],
  },
];

function CreateNptelLectureContent() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: nptelLecture, isLoading } = useNptelLecture(editId, {
    enabled: isEditing,
  });
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

export default function CreateNptelLecturePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateNptelLectureContent />
    </Suspense>
  );
}
