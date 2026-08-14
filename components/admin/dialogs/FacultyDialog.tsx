"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";



import { Button } from "@/components/ui/button";

import type { Faculty } from "@/types/faculty";

type Props = {
  programId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Faculty | null;
  onSave: (data: Faculty) => Promise<void>;
};

export default function FacultyDialog({
  programId,
  open,
  onOpenChange,
  initialData,
  onSave,
}: Props) {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [form, setForm] = useState<Faculty>({
    name: "",
    role: "",
    institution: "",
    bio: "",
    avatar_url: "",
    linkedin_url: "",
  });

  const [saving, setSaving] = useState(false);

  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [search, setSearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        role: "",
        institution: "",
        bio: "",
        avatar_url: "",
        linkedin_url: "",
      });
    }
  }, [initialData, open]);

  useEffect(() => {
    if (!open) return;

    async function loadFaculty() {
      try {
        setLoadingFaculty(true);

        const res = await fetch("/api/admin/faculty");
        const json = await res.json();

        if (json.success) {
          setFacultyList(json.data);
          setFilteredFaculty(json.data);
        }
      } finally {
        setLoadingFaculty(false);
      }
    }

    loadFaculty();
  }, [open]);

  useEffect(() => {
    const keyword = search.toLowerCase();

    setFilteredFaculty(
      facultyList.filter((faculty) =>
        faculty.name.toLowerCase().includes(keyword)
      )
    );
  }, [search, facultyList]);

  async function handleSubmit() {
    try {
      setSaving(true);
      await onSave(form);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Faculty" : "Add Faculty"}
          </DialogTitle>
        </DialogHeader>

        {!initialData && (
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={mode === "existing" ? "default" : "outline"}
              onClick={() => setMode("existing")}
            >
              Existing Faculty
            </Button>

            <Button
              type="button"
              variant={mode === "new" ? "default" : "outline"}
              onClick={() => setMode("new")}
            >
              Create New
            </Button>
          </div>
        )}

        {initialData || mode === "new" ? (
          <div className="space-y-4">
            <input
              className="w-full rounded-lg border p-3"
              placeholder="Faculty Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Role"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Institution"
              value={form.institution}
              onChange={(e) =>
                setForm({
                  ...form,
                  institution: e.target.value,
                })
              }
            />

            <textarea
              rows={5}
              className="w-full rounded-lg border p-3"
              placeholder="Biography"
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="Avatar URL"
              value={form.avatar_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  avatar_url: e.target.value,
                })
              }
            />

            <input
              type="number"
              min="0"
              className="w-full rounded-lg border p-3"
              placeholder="Experience (Years)"
              value={form.experience_years ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  experience_years: e.target.value ? parseInt(e.target.value, 10) : null,
                })
              }
            />

            <input
              className="w-full rounded-lg border p-3"
              placeholder="LinkedIn URL"
              value={form.linkedin_url}
              onChange={(e) =>
                setForm({
                  ...form,
                  linkedin_url: e.target.value,
                })
              }
            />
          </div>
        ) : (
          <div className="space-y-4">


            <div className="space-y-4">

              <input
                className="w-full rounded-lg border p-3"
                placeholder="Search faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="max-h-80 overflow-y-auto rounded-lg border">

                {loadingFaculty && (
                  <div className="p-4 text-center">
                    Loading...
                  </div>
                )}

                {!loadingFaculty &&
                  filteredFaculty.map((faculty) => (
                    <button
                      key={faculty.id}
                      type="button"
                      onClick={() => setSelectedFaculty(faculty)}
                      className={`w-full border-b p-4 text-left transition hover:bg-muted ${selectedFaculty?.id === faculty.id
                        ? "bg-muted"
                        : ""
                        }`}
                    >
                      <div className="font-medium">
                        {faculty.name}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {faculty.role}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {faculty.institution}
                      </div>
                    </button>
                  ))}

                {!loadingFaculty && filteredFaculty.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No faculty found.
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          {(initialData || mode === "new") && (
            <Button
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : initialData ? "Update Faculty" : "Create Faculty"}
            </Button>
          )}

          {!initialData && mode === "existing" && (
            <Button
              disabled={!selectedFaculty || saving}
              onClick={async () => {
                if (!selectedFaculty) return;

                try {
                  setSaving(true);

                  const res = await fetch(
                    `/api/admin/programs/${programId}/faculty/attach`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        facultyId: selectedFaculty.id,
                        sort_order: 0,
                      }),
                    }
                  );

                  const json = await res.json();

                  if (!json.success) {
                    throw new Error(json.message);
                  }

                  onOpenChange(false);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Attaching..." : "Attach Faculty"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}