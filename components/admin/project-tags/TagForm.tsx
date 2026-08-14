"use client";

import { useEffect, useState } from "react";
import type { ProjectTag } from "@/types/project-tag";
import { Button } from "@/components/ui/button";

type Props = {
  initialData?: ProjectTag | null;
  onSave: (tag: ProjectTag) => Promise<void>;
  onCancel?: () => void;
};

export default function TagForm({
  initialData,
  onSave,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ProjectTag>({
    tag: "",
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        tag: "",
        sort_order: 0,
      });
    }
  }, [initialData]);

  async function handleSubmit() {
    try {
      setSaving(true);
      await onSave(form);

      setForm({
        tag: "",
        sort_order: 0,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">

      <input
        placeholder="Tag Name"
        value={form.tag}
        onChange={(e) =>
          setForm({
            ...form,
            tag: e.target.value,
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <input
        type="number"
        placeholder="Sort Order"
        value={form.sort_order}
        onChange={(e) =>
          setForm({
            ...form,
            sort_order: Number(e.target.value),
          })
        }
        className="w-full border rounded-lg p-3"
      />

      <div className="flex gap-2 justify-end">

        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>

      </div>

    </div>
  );
}