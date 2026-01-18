"use client";

import { useSearchParams, useRouter } from "next/navigation";
import * as z from "zod";
import {
  useAchievement,
  useCreateAchievement,
  useUpdateAchievement,
} from "@/lib/hooks/useAdmin";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const ACHIEVEMENT_TYPES = [
  "HERO_CAROUSEL",
  "CLUB_MILESTONE",
  "SUMMARY_STAT",
  "PROUD_MOMENT",
  "AWARD_HIGHLIGHT",
  "GALLERY_IMAGE"
];

const achievementSchema = z.object({
  type: z.string().min(1, "Type is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  value: z.string().optional(),
  isActive: z.boolean().default(true),
  priority: z.coerce.number().default(0),
});

export default function CreateAchievementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditing = !!id;

  const { data: achievement, isLoading: isLoadingData } = useAchievement(id, { enabled: isEditing });
  const createMutation = useCreateAchievement({
    onSuccess: () => router.push("/admin/achievements"),
  });
  const updateMutation = useUpdateAchievement({
    onSuccess: () => router.push("/admin/achievements"),
  });

  const onSubmit = async (values) => {
    // AdminFormTemplate handles file fields internally if they are in the 'fields' array
    // but we need to pass them to update/create mutation
    if (isEditing) {
      await updateMutation.mutateAsync({ id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
  };

  const fields = [
    { name: "title", label: "Title", type: "text", placeholder: "Achievement title or person name" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Detailed description of the achievement..." },
    { name: "value", label: "Value / Stat", type: "text", placeholder: "e.g., 50+ or Hearty Congratulations" },
    { name: "priority", label: "Priority", type: "number", placeholder: "Higher number means higher priority" },
    { name: "isActive", label: "Active", type: "switch" },
    { name: "mainImage", label: "Main Image / Thumbnail", type: "image", required: false },
    { name: "images", label: "Additional Images (Carousels/Gallery)", type: "multipleImages", required: false, maxFiles: 20 },
  ];

  return (
    <AdminFormTemplate
      title="Achievement"
      schema={achievementSchema}
      defaultValues={achievement || {
        type: "HERO_CAROUSEL",
        title: "",
        description: "",
        value: "",
        isActive: true,
        priority: 0,
      }}
      onSubmit={onSubmit}
      fields={fields}
      isLoading={createMutation.isPending || updateMutation.isPending || isLoadingData}
      isEditing={isEditing}
      backPath="/admin/achievements"
    >
      {(form) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievement Type <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Achievement Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACHIEVEMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </AdminFormTemplate>
  );
}
