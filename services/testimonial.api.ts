import type { Testimonial } from "@/types/testimonial";

export async function getTestimonials(programId: string) {
  const res = await fetch(`/api/admin/program-testimonials/${programId}`);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function createTestimonial(
  programId: string,
  testimonial: Omit<Testimonial, "id">
) {
  const res = await fetch(
    `/api/admin/program-testimonials/${programId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testimonial),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function updateTestimonial(
  id: string,
  testimonial: Omit<Testimonial, "id">
) {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(testimonial),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function deleteTestimonial(id: string) {
  const res = await fetch(`/api/admin/testimonials/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
}