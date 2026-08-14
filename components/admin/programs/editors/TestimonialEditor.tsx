"use client";

import { useEffect, useState } from "react";

import TestimonialDialog from "@/components/admin/dialogs/TestimonialDialog";

import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/services/testimonial.api";

import type { Testimonial } from "@/types/testimonial";
import type { Program } from "@/types/program";

import { Button } from "@/components/ui/button";

type Props = {
  program: Program;
};

export default function TestimonialEditor({
  program,
}: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTestimonials() {
    try {
      const res = await getTestimonials(program.id);
      setTestimonials(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(testimonial: Testimonial) {
    try {
      if (testimonial.id) {
        await updateTestimonial(testimonial.id, {
          author_name: testimonial.author_name,
          company: testimonial.company,
          batch: testimonial.batch,
          content: testimonial.content,
          rating: testimonial.rating,
          avatar_url: testimonial.avatar_url,
          is_published: testimonial.is_published,
        });
      } else {
        await createTestimonial(program.id, {
          author_name: testimonial.author_name,
          company: testimonial.company,
          batch: testimonial.batch,
          content: testimonial.content,
          rating: testimonial.rating,
          avatar_url: testimonial.avatar_url,
          is_published: testimonial.is_published,
        });
      }

      setDialogOpen(false);
      setEditingTestimonial(null);

      await loadTestimonials();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Testimonials
        </h2>

        <Button
          onClick={() => {
            setEditingTestimonial(null);
            setDialogOpen(true);
          }}
        >
          + Add Testimonial
        </Button>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border rounded-xl p-5 flex justify-between items-center"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {testimonial.author_name}
              </h3>

              <p className="text-gray-500">
                {testimonial.company}
              </p>

              <p className="text-gray-500">
                {testimonial.batch}
              </p>

              <p className="mt-3">
                {testimonial.content}
              </p>

              <p className="mt-2 text-yellow-600">
                ⭐ {testimonial.rating}/5
              </p>

              <p
                className={`text-sm mt-2 ${
                  testimonial.is_published
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {testimonial.is_published
                  ? "Published"
                  : "Hidden"}
              </p>
            </div>

            <div className="flex gap-2 ml-6">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingTestimonial(testimonial);
                  setDialogOpen(true);
                }}
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={async () => {
                  const ok = window.confirm(
                    "Delete this testimonial?"
                  );

                  if (!ok) return;

                  await deleteTestimonial(testimonial.id!);

                  await loadTestimonials();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <TestimonialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingTestimonial}
        onSave={handleSave}
      />
    </div>
  );
}