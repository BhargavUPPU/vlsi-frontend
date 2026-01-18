"use client";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreatePhotoGallery, usePhotoGallery, useUpdatePhotoGallery } from "@/lib/hooks/useAdmin";
import { photoGallerySchema } from "@/lib/validations/admin";
import { useSearchParams } from "next/navigation";

const photoGalleryFields = [
  { name: "title", label: "Title", placeholder: "e.g., Tech Fest 2024" },
  { name: "description", label: "Description", type: "textarea", placeholder: "Optional description...", required: false },
  { 
    name: "category", 
    label: "Display Category", 
    type: "select",
    options: [
      { value: "CLUB_HIGHLIGHTS", label: "Club Highlights (Homepage only)" },
      { value: "PHOTO_GALLERY", label: "Photo Gallery (Gallery page only)" },
      { value: "BOTH", label: "Both (Homepage & Gallery page)" },
    ],
    required: true,
  },
  { name: "priority", label: "Priority", type: "number", placeholder: "0", helperText: "Higher priority shows first", required: false },
  { name: "images", label: "Gallery Images", type: "multipleImages", maxFiles: 20, required: true },
];

export default function CreatePhotoGalleryPage() {
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");
  const isEditing = !!editId;

  const { data: photoGallery, isLoading } = usePhotoGallery(editId, { enabled: isEditing });
  const createPhotoGallery = useCreatePhotoGallery();
  const updatePhotoGallery = useUpdatePhotoGallery();

  // AdminFormTemplate will send FormData if an image field is present
  const handleSubmit = async (formDataOrData) => {
    if (isEditing) {
      await updatePhotoGallery.mutateAsync({ id: editId, data: formDataOrData });
    } else {
      await createPhotoGallery.mutateAsync(formDataOrData);
    }
  };

  return (
    <AdminFormTemplate
      title="Photo Gallery"
      schema={photoGallerySchema}
      defaultValues={photoGallery || {}}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={isEditing}
      backPath="/admin/photo-gallery"
      fields={photoGalleryFields}
    />
  );
}
