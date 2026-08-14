export async function getSummaryCards(programId: string) {
  const response = await fetch(
    `/api/admin/program-summary-cards/${programId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function createSummaryCard(
  programId: string,
  card: {
    label: string;
    value: string;
    icon: string;
    sort_order: number;
  }
) {
  const response = await fetch(
    `/api/admin/program-summary-cards/${programId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function updateSummaryCard(
  cardId: string,
  card: {
    label: string;
    value: string;
    icon: string;
    sort_order: number;
  }
) {
  const response = await fetch(
    `/api/admin/summary-cards/${cardId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(card),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteSummaryCard(cardId: string) {
  const response = await fetch(
    `/api/admin/summary-cards/${cardId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}