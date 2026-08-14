export async function getProgramSections(programId: string) {
  const res = await fetch(
    `/api/admin/program-sections?programId=${programId}`
  );

  return await res.json();
}

export async function getProgramSection(id: string) {
  const res = await fetch(`/api/admin/program-sections/${id}`);

  return await res.json();
}

export async function createProgramSection(data: {
  program_id: string;
  type: string;
  title: string;
  content: string;
  sort_order?: number;
}) {
  const res = await fetch("/api/admin/program-sections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function updateProgramSection(
  id: string,
  data: {
    title: string;
    content: string;
    sort_order?: number;
  }
) {
  const res = await fetch(`/api/admin/program-sections/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
}

export async function deleteProgramSection(id: string) {
  const res = await fetch(`/api/admin/program-sections/${id}`, {
    method: "DELETE",
  });

  return await res.json();
}