"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import ProgramForm from "@/components/admin/programs/ProgramForm";

import {
  getProgramById,
  updateProgram,
} from "@/services/program.api";

import type { Program } from "@/types/program";

type Props = {
  program: Program;
};

export default function BasicInformationEditor({
  program,
}: Props) {
  const [form, setForm] = useState({
    slug: "",
    title: "",
    subtitle: "",
    category: "",
    duration_weeks: 0,
    batch_mode: "",
    schedule: "",
    location: "",

    base_price: 0,
    discounted_price: 0,

    syllabus_url: "",
    demo_video_url: "",
    demo_video_duration_mins: 0,
    demo_video_description: "",

    card_image_url: "",

    meta_title: "",
    meta_description: "",

    is_published: false,
    is_popular: false,

    cohort_start: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProgram() {
    try {
      const data = await getProgramById(program.id);

      setForm({
        slug: data.slug || "",
        title: data.title || "",
        subtitle: data.subtitle || "",
        category: data.category || "",
        duration_weeks: data.duration_weeks || 0,
        batch_mode: data.batch_mode || "",
        schedule: data.schedule || "",
        location: data.location || "",

        base_price: data.base_price || 0,
        discounted_price: data.discounted_price || 0,

        syllabus_url: data.syllabus_url || "",
        demo_video_url: data.demo_video_url || "",
        demo_video_duration_mins:
          data.demo_video_duration_mins || 0,
        demo_video_description:
          data.demo_video_description || "",

          card_image_url: data.card_image_url || "",

        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",

        is_published: data.is_published || false,
        is_popular: data.is_popular || false,

        cohort_start: data.cohort_start
          ? new Date(data.cohort_start).toISOString().slice(0, 16)
          : "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      const response = await updateProgram(
        program.id,
        form
      );

      if (!response.success) {
        alert(response.message);
        return;
      }

      alert("Program updated successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function updateField(
    key: string,
    value: string | number | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  useEffect(() => {
    loadProgram();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          Basic Information
        </h2>

        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>

      </div>

      {/* SECTION 1: Basic Information */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold mb-6">
          Basic Information
        </h3>

        <ProgramForm
          form={form}
          setForm={setForm}
        />
      </div>

      {/* SECTION 2: Media */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold mb-6">
          Media
        </h3>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <Label>Syllabus URL</Label>
            <Input
              value={form.syllabus_url}
              onChange={(e) =>
                updateField("syllabus_url", e.target.value)
              }
              placeholder="https://example.com/syllabus.pdf"
            />
          </div>

          <div>
            <Label>Demo Video URL</Label>
            <Input
              value={form.demo_video_url}
              onChange={(e) =>
                updateField("demo_video_url", e.target.value)
              }
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
  <Label>Card Image URL</Label>

  <Input
    value={form.card_image_url}
    onChange={(e) =>
      updateField("card_image_url", e.target.value)
    }
    placeholder="https://..."
  />

  {form.card_image_url && (
    <img
      src={form.card_image_url}
      alt="Card Preview"
      className="mt-3 h-32 rounded-lg border object-contain"
    />
  )}
</div>

          <div>
            <Label>Demo Video Duration (minutes)</Label>
            <Input
              type="number"
              value={form.demo_video_duration_mins}
              onChange={(e) =>
                updateField(
                  "demo_video_duration_mins",
                  Number(e.target.value)
                )
              }
              placeholder="4"
            />
          </div>

          <div className="col-span-2">
            <Label>Demo Video Description</Label>
            <Textarea
              value={form.demo_video_description}
              onChange={(e) =>
                updateField("demo_video_description", e.target.value)
              }
              placeholder="Watch the cohort induction preview..."
              rows={4}
            />
          </div>

        </div>
      </div>

      {/* SECTION 3: SEO */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold mb-6">
          SEO
        </h3>

        <div className="space-y-6">

          <div>
            <Label>Meta Title</Label>
            <Input
              value={form.meta_title}
              onChange={(e) =>
                updateField("meta_title", e.target.value)
              }
              placeholder="Full-Stack Development Mastery | InternAcademy"
            />
          </div>

          <div>
            <Label>Meta Description</Label>
            <Textarea
              value={form.meta_description}
              onChange={(e) =>
                updateField("meta_description", e.target.value)
              }
              placeholder="Master full-stack development with our comprehensive program..."
              rows={4}
            />
          </div>

        </div>
      </div>

      {/* SECTION 4: Publishing */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-xl font-semibold mb-6">
          Publishing
        </h3>

        <div className="grid grid-cols-2 gap-6">

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={form.is_published}
              onChange={(e) =>
                updateField("is_published", e.target.checked)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="is_published" className="cursor-pointer">
              Published
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_popular"
              checked={form.is_popular}
              onChange={(e) =>
                updateField("is_popular", e.target.checked)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="is_popular" className="cursor-pointer">
              Popular
            </Label>
          </div>

          <div className="col-span-2">
            <Label>Cohort Start</Label>
            <Input
              type="datetime-local"
              value={form.cohort_start}
              onChange={(e) =>
                updateField("cohort_start", e.target.value)
              }
            />
          </div>

        </div>
      </div>

    </div>
  );
}