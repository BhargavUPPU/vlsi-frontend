"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminFormTemplate } from "@/components/AdminFormTemplate";
import { useCreateUser, useUser, useUpdateUser } from "@/lib/hooks/useUsers";
import { userSchema } from "@/lib/validations/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

function CreateUserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [tempPassword, setTempPassword] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: userData, isLoading: isLoadingUser } = useUser(editId, {
    enabled: isEdit,
  });

  const createUser = useCreateUser({
    onSuccess: (data) => {
      // Show temp password dialog
      setTempPassword(data.temporaryPassword);
      setShowPasswordDialog(true);
    },
  });

  const updateUser = useUpdateUser({
    onSuccess: () => {
      router.push("/admin/users");
    },
  });

  const handleCopyPassword = async () => {
    if (tempPassword) {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePasswordDialogClose = () => {
    setShowPasswordDialog(false);
    setTempPassword(null);
    router.push("/admin/users");
  };

  const userFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter user's full name",
      required: true,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "user@example.com",
      required: true,
    },
    {
      name: "role",
      label: "User Role",
      type: "select",
      options: [
        { value: "USER", label: "User" },
        { value: "ADMIN", label: "Admin" },
        { value: "SUPERADMIN", label: "Super Admin" },
      ],
      placeholder: "Select role",
      required: true,
    },
    {
      name: "year",
      label: "Year (Optional)",
      type: "text",
      placeholder: "e.g., 2024",
    },
  ];

  return (
    <>
      <AdminFormTemplate
        title={isEdit ? "Edit User" : "Create User"}
        fields={userFields}
        schema={userSchema}
        defaultValues={userData}
        isLoading={isEdit ? isLoadingUser : false}
        onSubmit={(data) => {
          if (isEdit) {
            updateUser.mutate({ id: editId, data });
          } else {
            createUser.mutate(data);
          }
        }}
        submitText={isEdit ? "Update User" : "Create User"}
        cancelPath="/admin/users"
      />

      {/* Temporary Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>✅ User Created Successfully</DialogTitle>
            <DialogDescription>
              A temporary password has been generated. Share this with the user
              securely. They will be required to change it on first login.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm font-medium text-yellow-800 mb-2">
                ⚠️ Important Security Notice
              </p>
              <p className="text-xs text-yellow-700">
                This password will only be shown ONCE. Make sure to copy it now
                and share it with the user through a secure channel.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Temporary Password:</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-3 bg-gray-100 rounded-md font-mono text-lg font-bold select-all">
                  {tempPassword}
                </code>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleCopyPassword}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 The user must change this password on their first login for
                security purposes.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handlePasswordDialogClose}>
              Done - Go to User List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function CreateUserPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateUserContent />
    </Suspense>
  );
}
