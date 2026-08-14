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

import type { Testimonial } from "@/types/testimonial";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Testimonial | null;
  onSave: (data: Testimonial) => Promise<void>;
};

export default function TestimonialDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: Props) {
  const [form, setForm] = useState<Testimonial>({
    author_name: "",
    company: "",
    batch: "",
    content: "",
    rating: 5,
    avatar_url: "",
    is_published: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        author_name: "",
        company: "",
        batch: "",
        content: "",
        rating: 5,
        avatar_url: "",
        is_published: true,
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
            {initialData ? "Edit Testimonial" : "Add Testimonial"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <input
            placeholder="Author Name"
            value={form.author_name}
            onChange={(e) =>
              setForm({
                ...form,
                author_name: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) =>
              setForm({
                ...form,
                company: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            placeholder="Batch"
            value={form.batch}
            onChange={(e) =>
              setForm({
                ...form,
                batch: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Testimonial"
            value={form.content}
            onChange={(e) =>
              setForm({
                ...form,
                content: e.target.value,
              })
            }
            rows={5}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            min={1}
            max={5}
            placeholder="Rating"
            value={form.rating}
            onChange={(e) =>
              setForm({
                ...form,
                rating: Number(e.target.value),
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <input
            placeholder="Avatar URL"
            value={form.avatar_url}
            onChange={(e) =>
              setForm({
                ...form,
                avatar_url: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_published: e.target.checked,
                })
              }
            />

            Published
          </label>

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