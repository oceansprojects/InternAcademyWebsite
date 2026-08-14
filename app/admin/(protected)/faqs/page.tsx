"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import FAQDialog from "@/components/admin/dialogs/FAQDialog";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "@/services/faq.api";

import type { GlobalFAQ } from "@/types/global-faq";

import { Button } from "@/components/ui/button";

export default function GlobalFAQsPage() {
  const [faqs, setFaqs] = useState<GlobalFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<GlobalFAQ | null>(null);

  // NEW: state for delete confirmation
  const [faqToDelete, setFaqToDelete] = useState<GlobalFAQ | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadFAQs() {
    try {
      const res = await getFAQs();
      setFaqs(res.data || []);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
      toast.error("Failed to load FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(faq: GlobalFAQ) {
    try {
      if (faq.id) {
        await updateFAQ(faq.id, {
          question: faq.question,
          answer: faq.answer,
        });
        toast.success("FAQ updated successfully");
      } else {
        await createFAQ({
          question: faq.question,
          answer: faq.answer,
        });
        toast.success("FAQ created successfully");
      }

      setDialogOpen(false);
      setEditingFAQ(null);
      await loadFAQs();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
      toast.error("Failed to save FAQ. Please try again.");
    }
  }

  // Opens the modal instead of window.confirm
  function handleDeleteClick(faq: GlobalFAQ) {
    setFaqToDelete(faq);
  }

  // Runs when user clicks "Delete" in the modal
  async function confirmDelete() {
    if (!faqToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteFAQ(faqToDelete.id);
      toast.success("FAQ deleted successfully");
      await loadFAQs();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      toast.error("Failed to delete FAQ. Please try again.");
    } finally {
      setDeleting(false);
      setFaqToDelete(null);
    }
  }

  useEffect(() => {
    loadFAQs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Global FAQs
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all FAQs that can be assigned to programs
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingFAQ(null);
              setDialogOpen(true);
            }}
            size="lg"
          >
            + Add FAQ
          </Button>
        </div>

        <div className="space-y-4">
          {faqs.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                No FAQs created yet
              </p>
              <Button
                onClick={() => {
                  setEditingFAQ(null);
                  setDialogOpen(true);
                }}
                variant="outline"
              >
                Create Your First FAQ
              </Button>
            </div>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq.id}
                className="border rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      {faq.question}
                    </h3>

                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingFAQ(faq);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(faq)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <FAQDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingFAQ}
        onSave={handleSave}
      />

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={!!faqToDelete}
        title="Delete FAQ"
        description={`Are you sure you want to delete "${faqToDelete?.question}"? This will remove it from all programs.`}
        onConfirm={confirmDelete}
        onCancel={() => setFaqToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}