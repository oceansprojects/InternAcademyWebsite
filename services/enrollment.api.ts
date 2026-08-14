export async function createEnrollment(
  slug: string
) {
  const res = await fetch(
    `/api/programs/${slug}/enroll`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Enrollment failed");
  }

  return res.json();
}

export async function getAdminEnrollments() {
  const res = await fetch("/api/enrollments", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch enrollments");
  }

  const data = await res.json();

  return data.data;
}

export async function updateEnrollmentStatus(
  id: string,
  status: "pending" | "active" | "completed" | "dropped"
) {
  const res = await fetch(`/api/enrollments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  return res.json();
}

export async function updateEnrollmentPayment(
  id: string,
  payment_status: "pending" | "paid" | "failed" | "refunded",
  amount_paid?: number
) {
  const res = await fetch(`/api/enrollments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment_status,
      amount_paid,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update payment status");
  }

  return res.json();
}

export async function updateEnrollment(
  id: string,
  data: {
    status?: "pending" | "active" | "completed" | "dropped";
    payment_status?: "pending" | "paid" | "failed" | "refunded";
    amount_paid?: number;
  }
) {
  const res = await fetch(`/api/enrollments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update enrollment");
  }

  return res.json();
}