"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Tag, ExternalLink, Building, Award, UserCheck } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import FacultyDialog from "@/components/admin/dialogs/FacultyDialog";
import FacultyExpertiseDialog from "@/components/admin/dialogs/FacultyExpertiseDialog";
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "@/services/instructor.api";
import {
  getFacultyExpertise,
  createFacultyExpertise,
  updateFacultyExpertise,
  deleteFacultyExpertise,
} from "@/services/faculty-expertise.api";
import type { Faculty } from "@/types/faculty";
import type { FacultyExpertise } from "@/types/faculty-expertise";
import { Button } from "@/components/ui/button";

export default function InstructorTable() {
  const [instructors, setInstructors] = useState<Faculty[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [instructorDialogOpen, setInstructorDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Faculty | null>(null);

  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Faculty | null>(null);
  const [expertise, setExpertise] = useState<FacultyExpertise[]>([]);
  const [editingExpertise, setEditingExpertise] = useState<FacultyExpertise | null>(null);

  const [instructorToDelete, setInstructorToDelete] = useState<Faculty | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadInstructors() {
    try {
      setLoading(true);
      const res = await getInstructors();
      if (res.success && res.data) {
        setInstructors(res.data);
        setFilteredInstructors(res.data);
      } else {
        toast.error(res.message || "Failed to load instructors");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load instructors");
    } finally {
      setLoading(false);
    }
  }

  async function loadExpertise(facultyId: string) {
    const res = await getFacultyExpertise(facultyId);
    setExpertise(res.data || []);
  }

  useEffect(() => {
    loadInstructors();
  }, []);

  useEffect(() => {
    let filtered = instructors;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inst) =>
          inst.name.toLowerCase().includes(q) ||
          inst.role?.toLowerCase().includes(q) ||
          inst.institution?.toLowerCase().includes(q)
      );
    }
    setFilteredInstructors(filtered);
  }, [searchQuery, instructors]);

  const handleSaveInstructor = async (data: Faculty) => {
    try {
      if (data.id) {
        const res = await updateInstructor(data.id, {
          name: data.name,
          role: data.role,
          institution: data.institution,
          bio: data.bio,
          avatar_url: data.avatar_url,
          linkedin_url: data.linkedin_url,
          experience_years: data.experience_years,
        });
        if (res.success) {
          toast.success("Instructor updated successfully");
        } else {
          toast.error(res.message || "Failed to update instructor");
        }
      } else {
        const res = await createInstructor({
          name: data.name,
          role: data.role,
          institution: data.institution,
          bio: data.bio,
          avatar_url: data.avatar_url,
          linkedin_url: data.linkedin_url,
          experience_years: data.experience_years,
        });
        if (res.success) {
          toast.success("Instructor created successfully");
        } else {
          toast.error(res.message || "Failed to create instructor");
        }
      }
      setInstructorDialogOpen(false);
      setEditingInstructor(null);
      loadInstructors();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving instructor");
    }
  };

  const confirmDelete = async () => {
    if (!instructorToDelete?.id) return;
    setDeleting(true);
    try {
      const res = await deleteInstructor(instructorToDelete.id);
      if (res.success) {
        toast.success(`"${instructorToDelete.name}" deleted successfully`);
        loadInstructors();
      } else {
        toast.error(res.message || "Failed to delete instructor");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete instructor");
    } finally {
      setDeleting(false);
      setInstructorToDelete(null);
    }
  };

  const handleExpertiseSave = async (item: FacultyExpertise) => {
    if (!selectedInstructor?.id) return;

    if (item.id) {
      await updateFacultyExpertise(item.id, {
        tag: item.tag,
        sort_order: item.sort_order,
      });
    } else {
      await createFacultyExpertise(selectedInstructor.id, {
        tag: item.tag,
        sort_order: item.sort_order,
      });
    }

    setExpertiseDialogOpen(false);
    setEditingExpertise(null);
    await loadExpertise(selectedInstructor.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructors</h1>
          <p className="text-gray-600 mt-1">Manage global faculty & instructors across programs</p>
        </div>
        <button
          onClick={() => {
            setEditingInstructor(null);
            setInstructorDialogOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <Plus size={20} />
          <span>Add Instructor</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search instructors by name, role, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredInstructors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? "No instructors found matching your search"
                : "No instructors found. Add your first instructor!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  setEditingInstructor(null);
                  setInstructorDialogOpen(true);
                }}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={20} />
                <span>Add Your First Instructor</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Instructor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Role & Institution</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Experience</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">LinkedIn</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInstructors.map((inst) => {
                  const isSelected = selectedInstructor?.id === inst.id;
                  return (
                    <React.Fragment key={inst.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {inst.avatar_url ? (
                              <img
                                src={inst.avatar_url}
                                alt={inst.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                {inst.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">{inst.name}</div>
                              {inst.bio && (
                                <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                                  {inst.bio}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm font-medium text-gray-800">{inst.role || "N/A"}</div>
                          {inst.institution && (
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Building size={12} />
                              <span>{inst.institution}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700">
                          {inst.experience_years ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {inst.experience_years} {inst.experience_years === 1 ? "year" : "years"}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-xs">Not specified</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {inst.linkedin_url ? (
                            <a
                              href={inst.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm"
                            >
                              <ExternalLink size={16} />
                              <span className="text-xs">Profile</span>
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={async () => {
                                if (isSelected) {
                                  setSelectedInstructor(null);
                                } else {
                                  setSelectedInstructor(inst);
                                  if (inst.id) await loadExpertise(inst.id);
                                }
                              }}
                              className={`p-2 rounded-lg transition-colors text-xs font-medium flex items-center gap-1 ${
                                isSelected
                                  ? "bg-purple-100 text-purple-700"
                                  : "text-purple-600 hover:bg-purple-50"
                              }`}
                              title="Manage Skills / Expertise"
                            >
                              <Tag size={16} />
                              <span className="hidden sm:inline">Skills</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingInstructor(inst);
                                setInstructorDialogOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit instructor"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => setInstructorToDelete(inst)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete instructor"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Sub-panel for Skills / Expertise */}
                      {isSelected && (
                        <tr>
                          <td colSpan={5} className="bg-purple-50/50 p-4 border-b border-purple-100">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                                  <Tag size={16} />
                                  <span>Expertise Tags for {inst.name}</span>
                                </h4>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setEditingExpertise(null);
                                    setExpertiseDialogOpen(true);
                                  }}
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  + Add Skill Tag
                                </Button>
                              </div>

                              {expertise.length === 0 ? (
                                <p className="text-xs text-purple-600 italic">
                                  No skills/expertise tags added yet.
                                </p>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {expertise.map((item) => (
                                    <div
                                      key={item.id}
                                      className="inline-flex items-center gap-2 bg-white border border-purple-200 rounded-lg px-3 py-1 text-xs font-medium text-purple-800 shadow-sm"
                                    >
                                      <span>{item.tag}</span>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={() => {
                                            setEditingExpertise(item);
                                            setExpertiseDialogOpen(true);
                                          }}
                                          className="text-gray-500 hover:text-blue-600"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          onClick={async () => {
                                            if (!confirm("Delete expertise tag?")) return;
                                            await deleteFacultyExpertise(item.id!);
                                            if (inst.id) await loadExpertise(inst.id);
                                          }}
                                          className="text-gray-500 hover:text-red-600"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <FacultyDialog
        programId=""
        open={instructorDialogOpen}
        onOpenChange={setInstructorDialogOpen}
        initialData={editingInstructor}
        onSave={handleSaveInstructor}
      />

      <FacultyExpertiseDialog
        open={expertiseDialogOpen}
        onOpenChange={setExpertiseDialogOpen}
        initialData={editingExpertise}
        onSave={handleExpertiseSave}
      />

      <ConfirmDialog
        open={!!instructorToDelete}
        title="Delete Instructor"
        description={`Are you sure you want to delete "${instructorToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setInstructorToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
