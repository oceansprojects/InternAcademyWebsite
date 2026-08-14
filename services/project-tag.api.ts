import type { ProjectTag } from "@/types/project-tag";

export async function getProjectTags(projectId: string) {
  const response = await fetch(
    `/api/admin/projects/${projectId}/tags`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function createProjectTag(
  projectId: string,
  tag: Omit<ProjectTag, "id">
) {
  const response = await fetch(
    `/api/admin/projects/${projectId}/tags`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function updateProjectTag(
  id: string,
  tag: Omit<ProjectTag, "id">
) {
  const response = await fetch(
    `/api/admin/project-tags/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteProjectTag(id: string) {
  const response = await fetch(
    `/api/admin/project-tags/${id}`,
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