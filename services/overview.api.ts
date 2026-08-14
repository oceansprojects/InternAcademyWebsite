export async function getOverview(programId: string) {
  const response = await fetch(
    `/api/admin/program-overview/${programId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch overview");
  }

  return data;
}

export async function updateOverview(
  programId: string,
  introText: string
) {
  const response = await fetch(
    `/api/admin/program-overview/${programId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intro_text: introText,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update overview");
  }

  return data;
}