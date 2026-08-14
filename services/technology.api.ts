import type { Technology } from "@/types/technology";

export async function getTechnologies(programId: string) {
  const response = await fetch(
    `/api/admin/program-technologies/${programId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function createTechnology(
  programId: string,
  technology: Omit<Technology, "id">
) {
  const response = await fetch(
    `/api/admin/program-technologies/${programId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(technology),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function updateTechnology(
  id: string,
  technology: Omit<Technology, "id">
) {
  const response = await fetch(
    `/api/admin/technologies/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(technology),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteTechnology(id: string) {
  const response = await fetch(
    `/api/admin/technologies/${id}`,
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