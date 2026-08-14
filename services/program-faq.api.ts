import type { ProgramFAQ } from "@/types/program-faq";

export async function getProgramFAQs(
  programId: string
) {
  const res = await fetch(
    `/api/admin/programs/${programId}/faqs`
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function assignFAQ(
  programId: string,
  assignment: Omit<ProgramFAQ, "id">
) {
  const res = await fetch(
    `/api/admin/programs/${programId}/faqs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assignment),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function updateAssignment(
  assignmentId: string,
  sort_order: number
) {
  const res = await fetch(
    `/api/admin/program-faqs/${assignmentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sort_order,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteAssignment(
  assignmentId: string
) {
  const res = await fetch(
    `/api/admin/program-faqs/${assignmentId}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}