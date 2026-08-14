"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Loader } from "lucide-react"
import ProgramDashboard from "@/components/admin/programs/ProgramDashboard";

export default function ProgramDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [program, setProgram] = useState<any>(null)

  useEffect(() => {
    async function loadProgram() {
      try {
        const response = await fetch(`/api/admin/programs/${params.id}`)
        const data = await response.json()
        if (data.success) {
          setProgram(data.data)
        }
      } catch (error) {
        console.error("Failed to load program", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProgram()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!program) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Program not found</p>
        <button
          onClick={() => router.push("/admin/programs")}
          className="text-blue-600 hover:underline"
        >
          Back to Programs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => router.push("/admin/programs")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Programs</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.title}</h1>
        {program.subtitle && (
          <p className="text-gray-600 mb-6">{program.subtitle}</p>
        )}

        <ProgramDashboard program={program} />
      </div>
    </div>
  )
}
