"use client";

import type { ProjectTag } from "@/types/project-tag";
import { Button } from "@/components/ui/button";

type Props = {
  tags: ProjectTag[];
  onEdit: (tag: ProjectTag) => void;
  onDelete: (id: string) => Promise<void>;
};

export default function TagList({
  tags,
  onEdit,
  onDelete,
}: Props) {
  if (tags.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center text-gray-500">
        No tags added yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="border rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <h3 className="font-semibold">
              {tag.tag}
            </h3>

            <p className="text-sm text-gray-500">
              Sort Order: {tag.sort_order}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEdit(tag)}
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={async () => {
                const ok = window.confirm(
                  "Delete this tag?"
                );

                if (!ok) return;

                await onDelete(tag.id!);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}