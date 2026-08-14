import type { Faculty } from "@/types/faculty";

export async function getFaculty(programId: string) {
  const res = await fetch(`/api/admin/programs/${programId}/faculty`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function createFaculty(
  programId: string,
  faculty: Omit<Faculty, "id">
) {
  const res = await fetch(`/api/admin/programs/${programId}/faculty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(faculty),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function updateFaculty(
  id: string,
  faculty: Omit<Faculty, "id">
) {
  const res = await fetch(`/api/admin/faculty/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(faculty),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteFaculty(id: string) {
  const res = await fetch(`/api/admin/faculty/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}