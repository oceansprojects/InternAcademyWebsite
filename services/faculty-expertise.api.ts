import type { FacultyExpertise } from "@/types/faculty-expertise";

export async function getFacultyExpertise(facultyId: string) {
  const res = await fetch(
    `/api/admin/faculty/${facultyId}/expertise`
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function createFacultyExpertise(
  facultyId: string,
  expertise: Omit<FacultyExpertise, "id">
) {
  const res = await fetch(
    `/api/admin/faculty/${facultyId}/expertise`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expertise),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function updateFacultyExpertise(
  id: string,
  expertise: Omit<FacultyExpertise, "id">
) {
  const res = await fetch(
    `/api/admin/faculty-expertise/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expertise),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteFacultyExpertise(id: string) {
  const res = await fetch(
    `/api/admin/faculty-expertise/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}