import type { CurriculumTopic } from "@/types/curriculum-topic";

export async function getCurriculumTopics(moduleId: string) {
  const res = await fetch(
    `/api/admin/curriculum/${moduleId}/topics`
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function createCurriculumTopic(
  moduleId: string,
  topic: Omit<CurriculumTopic, "id">
) {
  const res = await fetch(
    `/api/admin/curriculum/${moduleId}/topics`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topic),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function updateCurriculumTopic(
  id: string,
  topic: Omit<CurriculumTopic, "id">
) {
  const res = await fetch(
    `/api/admin/curriculum-topics/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(topic),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteCurriculumTopic(id: string) {
  const res = await fetch(
    `/api/admin/curriculum-topics/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}