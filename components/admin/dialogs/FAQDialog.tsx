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

import type { GlobalFAQ } from "@/types/global-faq";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: GlobalFAQ | null;
  onSave: (data: GlobalFAQ) => Promise<void>;
};

export default function FAQDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: Props) {

  const [form, setForm] = useState<GlobalFAQ>({
    question: "",
    answer: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {

    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        question: "",
        answer: "",
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

      <DialogContent className="max-w-2xl">

        <DialogHeader>

          <DialogTitle>

            {initialData ? "Edit FAQ" : "Add FAQ"}

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <input
            className="w-full border rounded-lg p-3"
            placeholder="Question"
            value={form.question}
            onChange={(e)=>
              setForm({
                ...form,
                question:e.target.value,
              })
            }
          />

          <textarea
            rows={6}
            className="w-full border rounded-lg p-3"
            placeholder="Answer"
            value={form.answer}
            onChange={(e)=>
              setForm({
                ...form,
                answer:e.target.value,
              })
            }
          />

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={()=>onOpenChange(false)}
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