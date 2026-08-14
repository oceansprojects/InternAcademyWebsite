import type { Project } from "@/types/project";

export async function getProjects(programId: string) {
  const response = await fetch(
    `/api/admin/program-projects/${programId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function createProject(
  programId: string,
  project: Omit<Project, "id">
) {
  const response = await fetch(
    `/api/admin/program-projects/${programId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function updateProject(
  id: string,
  project: Omit<Project, "id">
) {
  const response = await fetch(
    `/api/admin/projects/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteProject(id: string) {
  const response = await fetch(
    `/api/admin/projects/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}