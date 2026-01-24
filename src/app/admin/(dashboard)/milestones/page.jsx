"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function MilestonesAdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all milestones (including inactive)
  const { data: milestones, isLoading } = useQuery({
    queryKey: ["admin-milestones"],
    queryFn: async () => {
      const response = await apiClient.get(
        `${API_ENDPOINTS.MILESTONES.BASE}?isActive=undefined`,
      );
      return response.data;
    },
  });

  const milestonesArray = Array.isArray(milestones) ? milestones : [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.delete(API_ENDPOINTS.MILESTONES.BY_ID(id)),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-milestones"]);
      queryClient.invalidateQueries(["milestones"]);
      toast.success("Milestone deleted successfully");
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Failed to delete milestone");
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: (id) =>
      apiClient.put(API_ENDPOINTS.MILESTONES.TOGGLE_ACTIVE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-milestones"]);
      queryClient.invalidateQueries(["milestones"]);
      toast.success("Milestone status updated");
    },
    onError: () => {
      toast.error("Failed to update milestone status");
    },
  });

  const filteredMilestones = milestonesArray.filter((milestone) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      milestone.title?.toLowerCase().includes(searchStr) ||
      milestone.description?.toLowerCase().includes(searchStr) ||
      milestone.category?.toLowerCase().includes(searchStr)
    );
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Club Milestones</h1>
          <p className="text-gray-600 mt-1">
            Manage timeline milestones and achievements
          </p>
        </div>
        <Link href="/admin/milestones/create">
          <Button className="gap-2">
            <Plus size={18} />
            Add Milestone
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Milestones</CardTitle>
              <CardDescription>
                Total: {filteredMilestones.length} milestone(s)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search by title, description, or category..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : filteredMilestones.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No milestones found</p>
              {searchTerm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMilestones.map((milestone) => (
                    <TableRow key={milestone.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {milestone.id && (
                            <ImageIcon size={16} className="text-blue-500" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {milestone.title}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm">
                            {new Date(milestone.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {milestone.category || "general"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{milestone.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={milestone.isActive ? "default" : "secondary"}
                          className={milestone.isActive ? "bg-green-500" : ""}
                        >
                          {milestone.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleActiveMutation.mutate(milestone.id)
                            }
                            title={
                              milestone.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {milestone.isActive ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
                          <Link href={`/admin/milestones/edit/${milestone.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit size={16} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(milestone.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Milestone?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              milestone from the timeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
