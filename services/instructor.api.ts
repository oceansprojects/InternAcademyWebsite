import type { Faculty } from "@/types/faculty";

type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

/** Fetch all instructors (global pool). */
export async function getInstructors(): Promise<ApiResponse<Faculty[]>> {
  try {
    const res = await fetch("/api/admin/faculty");
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message || "Failed to fetch instructors" };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Network error fetching instructors" };
  }
}

/** Fetch a single instructor by id. */
export async function getInstructorById(id: string): Promise<ApiResponse<Faculty>> {
  try {
    const res = await fetch(`/api/admin/faculty/${id}`);
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message || "Failed to fetch instructor" };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Network error fetching instructor" };
  }
}

/** Create a new instructor (global pool). */
export async function createInstructor(
  data: Omit<Faculty, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Faculty>> {
  try {
    const res = await fetch("/api/admin/faculty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message || "Failed to create instructor" };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Network error creating instructor" };
  }
}

/** Update an existing instructor. */
export async function updateInstructor(
  id: string,
  data: Omit<Faculty, "id" | "created_at" | "updated_at">
): Promise<ApiResponse<Faculty>> {
  try {
    const res = await fetch(`/api/admin/faculty/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message || "Failed to update instructor" };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Network error updating instructor" };
  }
}

/** Delete an instructor from the global pool. */
export async function deleteInstructor(id: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`/api/admin/faculty/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message || "Failed to delete instructor" };
    return { success: true };
  } catch {
    return { success: false, message: "Network error deleting instructor" };
  }
}
