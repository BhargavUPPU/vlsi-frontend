"use client";
import { columns } from "./columns";
import { AdminPageTemplate } from "@/components/AdminPageTemplate";
import { usePhotoGalleries } from "@/lib/hooks/useAdmin";

export default function PhotoGalleryPage() {
  const { data: photoGalleries, isLoading, error, refetch } = usePhotoGalleries();

  return (
    <AdminPageTemplate
      title="Photo Gallery"
      data={photoGalleries}
      columns={columns}
      isLoading={isLoading}
      error={error}
      createPath="/admin/photo-gallery/create"
      createButtonText="Create Photo Gallery"
      onRefresh={refetch}
      searchKey="title"
      apiEndpoint="photoGallery"
    />
  );
}
