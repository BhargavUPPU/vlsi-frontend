"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import { ArrowLeft, Save, Upload, X, Rocket, Award, Users, Lightbulb, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Icon mapping
const iconOptions = [
  { value: "rocket", label: "Rocket", Icon: Rocket, color: "bg-blue-500", bgColor: "bg-blue-50" },
  { value: "award", label: "Award", Icon: Award, color: "bg-orange-500", bgColor: "bg-orange-50" },
  { value: "users", label: "Users", Icon: Users, color: "bg-green-500", bgColor: "bg-green-50" },
  { value: "lightbulb", label: "Lightbulb", Icon: Lightbulb, color: "bg-purple-500", bgColor: "bg-purple-50" },
  { value: "calendar", label: "Calendar", Icon: Calendar, color: "bg-pink-500", bgColor: "bg-pink-50" },
];

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "achievement", label: "Achievement" },
  { value: "event", label: "Event" },
];

// Form validation schema
const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  date: z.string().min(1, "Date is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  bgColor: z.string().optional(),
  category: z.string().optional(),
  priority: z.coerce.number().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
});

export default function CreateMilestonePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      icon: "rocket",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      category: "general",
      priority: 0,
      isActive: true,
    },
  });

  const watchedIcon = watch("icon");
  const watchedColor = watch("color");
  const watchedBgColor = watch("bgColor");
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedDate = watch("date");
  const watchedCategory = watch("category");

  const selectedIconData = iconOptions.find(opt => opt.value === watchedIcon);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      // If there's an image, use FormData. Otherwise, send JSON.
      if (imageFile) {
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, String(data[key]));
          }
        });

        formData.append('image', imageFile);

        return apiClient.post(API_ENDPOINTS.MILESTONES.BASE, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Send as JSON when no image
        return apiClient.post(API_ENDPOINTS.MILESTONES.BASE, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["milestones"]);
      queryClient.invalidateQueries(["admin-milestones"]);
      toast.success("Milestone created successfully");
      router.push("/admin/milestones");
    },
    onError: (error) => {
      console.error("Create error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create milestone");
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleIconChange = (value) => {
    const iconData = iconOptions.find(opt => opt.value === value);
    if (iconData) {
      setValue("icon", value);
      setValue("color", iconData.color);
      setValue("bgColor", iconData.bgColor);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/milestones">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Milestone</h1>
          <p className="text-gray-600 mt-1">Add a new milestone to the timeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Milestone Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="e.g., Club Inception"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe this milestone..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date")}
                />
                {errors.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                )}
              </div>

              {/* Icon */}
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select value={watchedIcon} onValueChange={handleIconChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(({ value, label, Icon, color }) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <div className={`${color} p-1.5 rounded`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={watchedCategory} onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div>
                <Label htmlFor="priority">Priority (0-100)</Label>
                <Input
                  id="priority"
                  type="number"
                  {...register("priority")}
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">Higher priority items appear first</p>
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="image">Image (Optional)</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload image</span>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 gap-2"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save size={18} />
                      Create Milestone
                    </>
                  )}
                </Button>
                <Link href="/admin/milestones">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${watchedBgColor} rounded-2xl p-6 shadow-md border border-white/50`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                <div className={`${watchedColor} rounded-xl p-3 shadow-md w-fit`}>
                  {selectedIconData && <selectedIconData.Icon className="w-6 h-6 text-white" />}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-600">
                    {watchedDate ? new Date(watchedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    }) : 'Select a date'}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {watchedTitle || 'Milestone Title'}
              </h3>

              <p className="text-base text-gray-700 leading-relaxed">
                {watchedDescription || 'Milestone description will appear here...'}
              </p>

              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
