"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionCell } from "@/components/ActionCell";
import { useDeletePhotoGallery } from "@/lib/hooks/useAdmin";
import { Image } from "lucide-react";

export const columns = [
  {
    accessorKey: "images",
    header: "Preview",
    cell: ({ row }) => {
      const images = row.original.images || [];
      const firstImage = images[0];
      
      if (!firstImage || !firstImage.imageData) {
        return (
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
            <Image className="w-6 h-6 text-gray-400" />
          </div>
        );
      }

      // Convert Uint8Array to base64
      const base64 = btoa(
        new Uint8Array(firstImage.imageData.data || firstImage.imageData)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      return (
        <img
          src={`data:image/jpeg;base64,${base64}`}
          alt="Preview"
          className="w-16 h-16 object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category");
      const categoryMap = {
        CLUB_HIGHLIGHTS: { label: "Club Highlights", color: "bg-blue-100 text-blue-700" },
        PHOTO_GALLERY: { label: "Photo Gallery", color: "bg-green-100 text-green-700" },
        BOTH: { label: "Both", color: "bg-purple-100 text-purple-700" },
      };
      const config = categoryMap[category] || { label: category, color: "bg-gray-100 text-gray-700" };
      
      return (
        <Badge className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "images",
    id: "imageCount",
    header: "Images",
    cell: ({ row }) => {
      const images = row.original.images || [];
      return <span className="text-gray-600">{images.length} image{images.length !== 1 ? 's' : ''}</span>;
    },
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
        <Badge className={isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deletePhotoGallery = useDeletePhotoGallery();
      return (
        <ActionCell
          row={row}
          onDelete={deletePhotoGallery.mutateAsync}
          editPath={`/admin/photo-gallery/create?edit=${row.original.id}`}
          itemName="Photo Gallery"
        />
      );
    },
  },
];
