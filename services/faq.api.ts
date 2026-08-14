import type { GlobalFAQ } from "@/types/global-faq";

export async function getFAQs() {
  const res = await fetch("/api/admin/faqs");
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function createFAQ(
  faq: Omit<GlobalFAQ, "id">
) {
  const res = await fetch("/api/admin/faqs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(faq),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function updateFAQ(
  id: string,
  faq: Omit<GlobalFAQ, "id">
) {
  const res = await fetch(
    `/api/admin/faqs/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(faq),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteFAQ(id: string) {
  const res = await fetch(
    `/api/admin/faqs/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}