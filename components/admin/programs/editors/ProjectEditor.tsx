"use client";

import { useEffect, useState } from "react";
import ProjectDialog from "@/components/admin/dialogs/ProjectDialog";
import ProjectTagDialog from "@/components/admin/dialogs/ProjectTagDialog";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/project.api";

import type { Project } from "@/types/project";
import type { Program } from "@/types/program";

import { Button } from "@/components/ui/button";

type Props = {
  program: Program;
};

export default function ProjectEditor({ program }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);
    const [tagDialogOpen, setTagDialogOpen] = useState(false);

const [selectedProject, setSelectedProject] =
  useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    try {
      const res = await getProjects(program.id);
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(project: Project) {
    try {
      if (project.id) {
        await updateProject(project.id, {
          title: project.title,
          description: project.description,
          level: project.level,
          image_url: project.image_url,
          sort_order: project.sort_order,
        });
      } else {
        await createProject(program.id, {
          title: project.title,
          description: project.description,
          level: project.level,
          image_url: project.image_url,
          sort_order: project.sort_order,
        });
      }

      setDialogOpen(false);
      setEditingProject(null);

      await loadProjects();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Projects
        </h2>

        <Button
          onClick={() => {
            setEditingProject(null);
            setDialogOpen(true);
          }}
        >
          + Add Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-xl p-5 flex justify-between items-center"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {project.title}
              </h3>

              <p className="text-gray-500 mt-1">
                {project.description}
              </p>

              <p className="text-sm text-blue-600 capitalize mt-2">
                Level: {project.level}
              </p>

              {project.image_url && (
                <p className="text-sm text-gray-400 mt-1 break-all">
                  {project.image_url}
                </p>
              )}
            </div>

            <div className="flex gap-2">

  <Button
    variant="secondary"
    onClick={() => {
      setSelectedProject(project);
      setTagDialogOpen(true);
    }}
  >
    Manage Tags
  </Button>

  <Button
    variant="outline"
    onClick={() => {
      setEditingProject(project);
      setDialogOpen(true);
    }}
  >
    Edit
  </Button>

  <Button
    variant="destructive"
    onClick={async () => {
      const ok = window.confirm(
        "Delete this project?"
      );

      if (!ok) return;

      await deleteProject(project.id!);

      await loadProjects();
    }}
  >
    Delete
  </Button>

</div>
          </div>
        ))}
      </div>

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingProject}
        onSave={handleSave}
      />
      {selectedProject && (
  <ProjectTagDialog
    open={tagDialogOpen}
    onOpenChange={setTagDialogOpen}
    projectId={selectedProject.id!}
  />
)}
    </div>
  );
}