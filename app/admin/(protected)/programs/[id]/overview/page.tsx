"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


export default function OverviewPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto">

      <button
        onClick={() => router.push(`/admin/programs/${id}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
      >
        <ArrowLeft size={18} />
        Back to Program
      </button>

      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-2">
          Program Overview
        </h1>

        <p className="text-gray-500 mb-8">
          Manage the overview content of this program.
        </p>

        <div className="border rounded-lg p-5">

          <textarea
            rows={10}
            placeholder="Write the overview here..."
            className="w-full border rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <div className="mt-6 flex justify-end">

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Save Overview
          </button>

        </div>

      </div>

    </div>
  );
}