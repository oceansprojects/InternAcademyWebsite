"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/admin/ConfirmDialog";

type Props = {
  userId: string;
  userName: string;
  disabled?: boolean;
};

export default function DeleteUserButton({ userId, userName, disabled }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user");
      }

      toast.success(`"${userName}" was deleted successfully`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? "You cannot delete your own account" : "Delete user"}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <Trash2 className="size-4" />
      </button>

      <ConfirmDialog
        open={open}
        title="Delete User"
        description={`Are you sure you want to delete "${userName}"? This will permanently remove their account and all related data. This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setOpen(false)}
        loading={deleting}
      />
    </>
  );
}
