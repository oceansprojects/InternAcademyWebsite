"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import TagForm from "@/components/admin/project-tags/TagForm";
import TagList from "@/components/admin/project-tags/TagList";

import type { ProjectTag } from "@/types/project-tag";

import {
  getProjectTags,
  createProjectTag,
  updateProjectTag,
  deleteProjectTag,
} from "@/services/project-tag.api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
};

export default function ProjectTagDialog({
  open,
  onOpenChange,
  projectId,
}: Props) {
  const [tags, setTags] = useState<ProjectTag[]>([]);
  const [editingTag, setEditingTag] =
    useState<ProjectTag | null>(null);

  async function loadTags() {
    try {
      const res = await getProjectTags(projectId);
      setTags(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (open) {
      loadTags();
    }
  }, [open]);

  async function handleSave(tag: ProjectTag) {
    try {
      if (tag.id) {
        await updateProjectTag(tag.id, {
          tag: tag.tag,
          sort_order: tag.sort_order,
        });
      } else {
        await createProjectTag(projectId, {
          tag: tag.tag,
          sort_order: tag.sort_order,
        });
      }

      setEditingTag(null);
      await loadTags();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProjectTag(id);
      await loadTags();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Manage Project Tags
          </DialogTitle>
        </DialogHeader>

        <TagForm
          initialData={editingTag}
          onSave={handleSave}
          onCancel={() => setEditingTag(null)}
        />

        <div className="border-t my-6" />

        <TagList
          tags={tags}
          onEdit={setEditingTag}
          onDelete={handleDelete}
        />

      </DialogContent>
    </Dialog>
  );
}