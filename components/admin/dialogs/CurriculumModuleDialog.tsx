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

import type { CurriculumModule } from "@/types/curriculum-module";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: CurriculumModule | null;
  onSave: (data: CurriculumModule) => Promise<void>;
};

export default function CurriculumModuleDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: Props) {
  const [form, setForm] = useState<CurriculumModule>({
    phase_label: "",
    title: "",
    objective: "",
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        phase_label: "",
        title: "",
        objective: "",
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
      <DialogContent className="max-w-xl">

        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Module" : "Add Module"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Phase Label"
            value={form.phase_label}
            onChange={(e) =>
              setForm({
                ...form,
                phase_label: e.target.value,
              })
            }
          />

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Module Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <textarea
            rows={4}
            className="w-full border rounded-lg p-3"
            placeholder="Objective"
            value={form.objective}
            onChange={(e) =>
              setForm({
                ...form,
                objective: e.target.value,
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