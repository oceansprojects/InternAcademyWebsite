import type { CurriculumModule } from "@/types/curriculum-module";

export async function getCurriculumModules(programId: string) {
  const res = await fetch(`/api/admin/programs/${programId}/curriculum`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function createCurriculumModule(
  programId: string,
  module: Omit<CurriculumModule, "id">
) {
  const res = await fetch(
    `/api/admin/programs/${programId}/curriculum`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(module),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function updateCurriculumModule(
  id: string,
  module: Omit<CurriculumModule, "id">
) {
  const res = await fetch(`/api/admin/curriculum/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(module),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteCurriculumModule(id: string) {
  const res = await fetch(`/api/admin/curriculum/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}