"use client";

import { useEffect, useState } from "react";
import {
  getPrograms,
  deleteProgram,
} from "@/services/program.api";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Search, Filter, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type Program = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  duration_weeks: number;
  batch_mode: string;
  schedule: string;
  location: string;
  base_price: number;
  discounted_price: number;
};

export default function ProgramTable() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

   // NEW: state for delete confirmation
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [deleting, setDeleting] = useState(false);


  async function loadPrograms() {
    try {
      const res = await getPrograms();
      setPrograms(res.data || []);
      setFilteredPrograms(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  useEffect(() => {
    let filtered = programs;

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredPrograms(filtered);
  }, [searchQuery, selectedCategory, programs]);

  const categories = Array.from(new Set(programs.map(p => p.category).filter(Boolean)));

  // Opens the modal instead of window.confirm
  const handleDeleteClick = (program: Program) => {
    setProgramToDelete(program);
  };

  // Runs when user clicks "Delete" in the modal
  const confirmDelete = async () => {
    if (!programToDelete) return;
    setDeleting(true);
    try {
      await deleteProgram(programToDelete.id);
      toast.success(`"${programToDelete.title}" was deleted successfully`);
      loadPrograms();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete program");
    } finally {
      setDeleting(false);
      setProgramToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600 mt-1">Manage your educational programs</p>
        </div>
        <button
          onClick={() => router.push("/admin/programs/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span>Add Program</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== "all"
                ? "No programs found matching your filters"
                : "No programs yet. Create your first program!"}
            </p>
            {!searchQuery && selectedCategory === "all" && (
              <button
                onClick={() => router.push("/admin/programs/new")}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={20} />
                <span>Add Your First Program</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>Title</span>
                      <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Mode</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">{program.title}</div>
                        {program.subtitle && (
                          <div className="text-sm text-gray-500 mt-1">{program.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {program.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {program.category}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {program.duration_weeks} weeks
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900 font-semibold">
                        ₹{program.discounted_price > 0 ? program.discounted_price.toLocaleString() : program.base_price.toLocaleString()}
                      </div>
                      {program.discounted_price > 0 && program.discounted_price < program.base_price && (
                        <div className="text-xs text-gray-500 line-through">
                          ₹{program.base_price.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        program.batch_mode === 'online' ? 'bg-green-100 text-green-800' :
                        program.batch_mode === 'offline' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {program.batch_mode}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/programs/${program.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit program"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(program)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete program"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && filteredPrograms.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredPrograms.length} of {programs.length} programs
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={!!programToDelete}
        title="Delete Program"
        description={`Are you sure you want to delete "${programToDelete?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setProgramToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}