"use client";

import { useEffect, useState } from "react";

import FAQDialog from "@/components/admin/dialogs/FAQDialog";
import AssignFAQDialog from "@/components/admin/dialogs/AssignFAQDialog";

import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "@/services/faq.api";

import {
  getProgramFAQs,
  assignFAQ,
  updateAssignment,
  deleteAssignment,
} from "@/services/program-faq.api";

import type { GlobalFAQ } from "@/types/global-faq";
import type { Program } from "@/types/program";

import { Button } from "@/components/ui/button";

type Props = {
  program: Program;
};

export default function FAQEditor({
  program,
}: Props) {

  const [faqs, setFaqs] = useState<GlobalFAQ[]>([]);
  const [assignedFAQs, setAssignedFAQs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [assignDialogOpen, setAssignDialogOpen] =
    useState(false);

  const [editingFAQ, setEditingFAQ] =
    useState<GlobalFAQ | null>(null);

  async function loadFAQs() {
    const res = await getFAQs();
    setFaqs(res.data || []);
  }

  async function loadAssignments() {
    const res = await getProgramFAQs(program.id);
    setAssignedFAQs(res.data || []);
  }

  async function handleSave(
    faq: GlobalFAQ
  ) {

    if (faq.id) {

      await updateFAQ(
        faq.id,
        {
          question: faq.question,
          answer: faq.answer,
        }
      );

    } else {

      await createFAQ({
        question: faq.question,
        answer: faq.answer,
      });

    }

    setDialogOpen(false);

    setEditingFAQ(null);

    await loadFAQs();

  }

  async function handleAssign(
    faqId: string,
    sortOrder: number
  ) {

    await assignFAQ(
      program.id,
      {
        faq_id: faqId,
        sort_order: sortOrder,
      }
    );

    await loadAssignments();

  }

  useEffect(() => {

    async function init() {

      await loadFAQs();

      await loadAssignments();

      setLoading(false);

    }

    init();

  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
    return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          FAQs
        </h2>

        <div className="flex gap-3">

          <Button
            variant="outline"
            onClick={() => setAssignDialogOpen(true)}
          >
            Assign FAQ
          </Button>

          <Button
            onClick={() => {
              setEditingFAQ(null);
              setDialogOpen(true);
            }}
          >
            + Add FAQ
          </Button>

        </div>

      </div>

      <div className="space-y-6">

        {assignedFAQs.length === 0 ? (

          <div className="border rounded-xl p-8 text-center text-gray-500">
            No FAQs assigned to this program.
          </div>

        ) : (

          assignedFAQs.map((faq) => (

            <div
              key={faq.id}
              className="border rounded-xl p-5"
            >

              <div className="flex justify-between items-start">

                <div className="flex-1">

                  <h3 className="font-semibold text-lg">
                    {faq.question}
                  </h3>

                  <p className="text-gray-600 mt-3 whitespace-pre-wrap">
                    {faq.answer}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    Sort Order : {faq.sort_order}
                  </p>

                </div>

                <div className="flex flex-col gap-2 ml-6">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {

                      setEditingFAQ({
                        id: faq.faq_id,
                        question: faq.question,
                        answer: faq.answer,
                      });

                      setDialogOpen(true);

                    }}
                  >
                    Edit FAQ
                  </Button>

                  <Button
                    size="sm"
                    onClick={async () => {

                      const value = window.prompt(
                        "Sort Order",
                        String(faq.sort_order)
                      );

                      if (value === null) return;

                      await updateAssignment(
                        faq.id,
                        Number(value)
                      );

                      await loadAssignments();

                    }}
                  >
                    Change Order
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {

                      const ok = window.confirm(
                        "Remove FAQ from this program?"
                      );

                      if (!ok) return;

                      await deleteAssignment(faq.id);

                      await loadAssignments();

                    }}
                  >
                    Remove
                  </Button>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

      <FAQDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingFAQ}
        onSave={handleSave}
      />

      <AssignFAQDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        faqs={faqs}
        onAssign={handleAssign}
      />

    </div>
  );
}