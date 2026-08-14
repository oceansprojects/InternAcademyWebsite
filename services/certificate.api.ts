/** Client-side API wrappers for certificate management */

export async function adminGetCertificates() {
  const res = await fetch("/api/admin/certificates", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch certificates");
  }

  const data = await res.json();
  return data.data as any[];
}

export async function adminUpsertCertificate(
  enrollmentId: string,
  certificateUrl: string
) {
  const res = await fetch(`/api/admin/certificates/${enrollmentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ certificate_url: certificateUrl }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to update certificate");
  }

  return res.json();
}

export async function adminDeactivateCertificate(enrollmentId: string) {
  const res = await fetch(`/api/admin/certificates/${enrollmentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to deactivate certificate");
  }

  return res.json();
}
