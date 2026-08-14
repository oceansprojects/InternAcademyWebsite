"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProgram,
  updateProgram,
} from "@/services/program.api";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";

type ProgramFormProps = {
  onSuccess?: () => void;
  editingProgram?: any;
};

export default function ProgramForm({
  onSuccess,
  editingProgram,
}: ProgramFormProps)  {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    subtitle: "",
    category: "",
    duration_weeks: 12,
    batch_mode: "offline",
    schedule: "",
    location: "",
    base_price: 0,
    discounted_price: 0,
  });

  useEffect(() => {
    if (editingProgram) {
      setFormData({
        slug: editingProgram.slug,
        title: editingProgram.title,
        subtitle: editingProgram.subtitle || "",
        category: editingProgram.category || "",
        duration_weeks: editingProgram.duration_weeks,
        batch_mode: editingProgram.batch_mode,
        schedule: editingProgram.schedule || "",
        location: editingProgram.location || "",
        base_price: editingProgram.base_price,
        discounted_price: editingProgram.discounted_price,
      });
    }
  }, [editingProgram]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration_weeks" ||
        name === "base_price" ||
        name === "discounted_price"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = editingProgram
        ? await updateProgram(editingProgram.id, formData)
        : await createProgram(formData);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert(
        editingProgram
          ? "Failed to update program"
          : "Failed to create program"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      subtitle: "",
      category: "",
      duration_weeks: 12,
      batch_mode: "offline" as "offline" | "online" | "hybrid",
      schedule: "",
      location: "",
      base_price: 0,
      discounted_price: 0,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => onSuccess?.()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Programs</span>
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {editingProgram ? "Edit Program" : "Create Program"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {editingProgram 
              ? "Update the program details below" 
              : "Fill in the details below to create a new course"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Program Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Full Stack Development"
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="full-stack-development"
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Engineering"
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Become an Industry Ready Developer"
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Duration (Weeks) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration_weeks"
              value={formData.duration_weeks}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              min={1}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Batch Mode
            </label>
            <select
              name="batch_mode"
              value={formData.batch_mode}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Schedule
            </label>
            <input
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="Weekend Batch"
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bengaluru"
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Base Price (₹)
            </label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              Discounted Price (₹)
            </label>
            <input
              type="number"
              name="discounted_price"
              value={formData.discounted_price}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
          {!editingProgram && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
            >
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{editingProgram ? "Update Program" : "Save Program"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}