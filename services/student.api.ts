import {
  StudentProfile,
  StudentProfilePayload,
} from "@/types/student";

export async function getStudentProfile(): Promise<StudentProfile | null> {
  const res = await fetch("/api/student/profile", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
}

export async function createStudentProfile(
  payload: StudentProfilePayload
) {
  const res = await fetch("/api/student/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create profile");
  }

  return res.json();
}

export async function updateStudentProfile(
  payload: StudentProfilePayload
) {
  const res = await fetch("/api/student/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}