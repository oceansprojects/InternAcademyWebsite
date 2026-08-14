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

type SummaryCard = {
  id?: string;
  label: string;
  value: string;
  icon: string;
  sort_order: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SummaryCard | null;
  onSave: (data: SummaryCard) => Promise<void>;
};

export default function SummaryCardDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: Props) {
  const [form, setForm] = useState<SummaryCard>({
    label: "",
    value: "",
    icon: "",
    sort_order: 0,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        label: "",
        value: "",
        icon: "",
        sort_order: 0,
      });
    }
  }, [initialData, open]);

  async function handleSubmit() {
    try {
      setSaving(true);

      await onSave(form);

      setForm({
        label: "",
        value: "",
        icon: "",
        sort_order: 0,
      });

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
            {initialData ? "Edit Summary Card" : "Add Summary Card"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <input
            placeholder="Label"
            value={form.label}
            onChange={(e) =>
              setForm({
                ...form,
                label: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            placeholder="Value"
            value={form.value}
            onChange={(e) =>
              setForm({
                ...form,
                value: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            placeholder="Icon"
            value={form.icon}
            onChange={(e) =>
              setForm({
                ...form,
                icon: e.target.value,
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

        </div>

        <DialogFooter className="mt-6">
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