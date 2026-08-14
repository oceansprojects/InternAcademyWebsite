"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createProgram } from "@/services/program.api"
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react"
import { useEffect } from "react"

export default function NewProgramPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slugError, setSlugError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
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
  })


  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setSlugError(null);

    setBasicInfo((prev) => {
      const updated = {
        ...prev,
        [name]: ["duration_weeks", "base_price", "discounted_price"].includes(name)
          ? Number(value)
          : value,
      };

      if (name === "title") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/programs")
        const json = await res.json()

        if (!json.success) return

        const uniqueCategories = [
          ...new Set(
            json.data
              .map((program: any) => program.category)
              .filter(Boolean)
          ),
        ].sort()

        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    loadCategories()
  }, [])


  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setSlugError(null)
    try {
      const response = await createProgram(basicInfo)


      if (!response.success) {
        throw new Error(response.message)
      }

      router.push(`/admin/programs/${response.data.id}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create program"
      if (message.toLowerCase().includes("slug")) {
        setSlugError(message)
        
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Programs</span>
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Create New Program</h1>
        </div>
        <p className="text-gray-600">Let's build something awesome together! ✨</p>
      </div>


      {/* Error Banner */}
      {error && (
        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          <X size={18} className="shrink-0" />
          <span className="text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Step 1: Basic Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Program Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={basicInfo.title}
                onChange={handleBasicInfoChange}
                placeholder="Full Stack Web Development"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Category
              </label>

              <input
                type="text"
                list="program-categories"
                name="category"
                value={basicInfo.category}
                onChange={handleBasicInfoChange}
                placeholder="Select or type a category"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              <datalist id="program-categories">
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  />
                ))}
              </datalist>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={basicInfo.subtitle}
                onChange={handleBasicInfoChange}
                placeholder="Become an Industry Ready Developer in 12 Weeks"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Duration (Weeks) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="duration_weeks"
                value={basicInfo.duration_weeks}
                onChange={handleBasicInfoChange}
                min={1}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Batch Mode
              </label>
              <select
                name="batch_mode"
                value={basicInfo.batch_mode}
                onChange={handleBasicInfoChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Schedule
              </label>
              <input
                type="text"
                name="schedule"
                value={basicInfo.schedule}
                onChange={handleBasicInfoChange}
                placeholder="Weekend Batch / Weekday Batch"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={basicInfo.location}
                onChange={handleBasicInfoChange}
                placeholder="Bengaluru, Mumbai, Delhi"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Base Price (₹)
              </label>
              <input
                type="number"
                name="base_price"
                value={basicInfo.base_price}
                onChange={handleBasicInfoChange}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Discounted Price (₹)
              </label>
              <input
                type="number"
                name="discounted_price"
                value={basicInfo.discounted_price}
                onChange={handleBasicInfoChange}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Create Program</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>


    </div>
  )
}
