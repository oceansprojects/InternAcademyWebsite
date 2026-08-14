"use client";

import { useEffect, useState } from "react";
import TechnologyDialog from "@/components/admin/dialogs/TechnologyDialog";

import {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "@/services/technology.api";

import type { Technology } from "@/types/technology";

import type { Program } from "@/types/program";
import { Button } from "@/components/ui/button";

type Props = {
  program: Program;
};

export default function TechnologyEditor({ program }: Props)  {
 const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTechnology, setEditingTechnology] =
  useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTechnologies() {
    try {
      const res = await getTechnologies(program.id);
      setTechnologies(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);  
    }
  }

  async function handleSave(technology: Technology){
    try {
      if (technology.id) {
        await updateTechnology(
  technology.id!,
  {
    label: technology.label,
    icon_url: technology.icon_url,
    sort_order: technology.sort_order,
  }
);
      } else {
       await createTechnology(
  program.id,
  {
    label: technology.label,
    icon_url: technology.icon_url,
    sort_order: technology.sort_order,
  }
);
      }

      setDialogOpen(false);
      setEditingTechnology(null);

      await loadTechnologies();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadTechnologies();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Technologies
        </h2>

        <button
          onClick={() => {
            setEditingTechnology(null);
            setDialogOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Technology
        </button>
      </div>

      <div className="space-y-4">
        {technologies.map((technology) => (
          <div
            key={technology.id}
            className="border rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {technology.label}
              </h3>

              <p className="text-sm text-blue-500">
                {technology.icon_url || "No icon"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingTechnology(technology);
                  setDialogOpen(true);
                }}
                className="text-blue-600"
              >
                Edit
              </button>

              <Button
                variant="destructive"
                onClick={async () => {
                  const ok = window.confirm(
                    "Delete this technology?"
                  );

                  if (!ok) return;

                  await deleteTechnology(technology.id!);

                  await loadTechnologies();
                }}
              >
                Delete
              </Button>
            </div>

          </div>
        ))}

      </div>

      <TechnologyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingTechnology}
        onSave={handleSave}
      />
    </div>
  );
}