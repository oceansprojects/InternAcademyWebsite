"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { CurriculumTopic } from "@/types/curriculum-topic";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CurriculumTopic | null;
  onSave: (data: CurriculumTopic) => Promise<void>;
};

export default function CurriculumTopicDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: Props) {
  const [form, setForm] = useState<CurriculumTopic>({
    topic: "",
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        topic: "",
        sort_order: 0,
      });
    }
  }, [initialData, open]);

  async function handleSubmit() {
    try {
      setSaving(true);
      await onSave(form);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Topic" : "Add Topic"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Topic"
            value={form.topic}
            onChange={(e) =>
              setForm({
                ...form,
                topic: e.target.value,
              })
            }
          />

          <input
            type="number"
            className="w-full border rounded-lg p-3"
            placeholder="Sort Order"
            value={form.sort_order}
            onChange={(e) =>
              setForm({
                ...form,
                sort_order: Number(e.target.value),
              })
            }
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}