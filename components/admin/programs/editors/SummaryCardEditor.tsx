"use client";

import { useEffect, useState } from "react";
import SummaryCardDialog from "@/components/admin/dialogs/SummaryCardDialog";
import {
  getSummaryCards,
  createSummaryCard,
  updateSummaryCard,
  deleteSummaryCard,
} from "@/services/summary-card.api";

import type { Program } from "@/types/program";
import { Button } from "@/components/ui/button";

type Props = {
  program: Program;
};

type SummaryCard = {
  id?: string;
  label: string;
  value: string;
  icon: string;
  sort_order: number;
};

export default function SummaryCardEditor({ program }: Props) {
  const [cards, setCards] = useState<SummaryCard[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<SummaryCard | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCards() {
    try {
      const res = await getSummaryCards(program.id);
      setCards(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(card: SummaryCard) {
    try {
      if (card.id) {
        await updateSummaryCard(card.id, {
          label: card.label,
          value: card.value,
          icon: card.icon,
          sort_order: card.sort_order,
        });
      } else {
        await createSummaryCard(program.id, {
          label: card.label,
          value: card.value,
          icon: card.icon,
          sort_order: card.sort_order,
        });
      }

      setDialogOpen(false);
      setEditingCard(null);

      await loadCards();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Summary Cards
        </h2>

        <button
          onClick={() => {
            setEditingCard(null);
            setDialogOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Card
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border rounded-xl p-5 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {card.label}
              </h3>

              <p className="text-gray-500">
                {card.value}
              </p>

              <p className="text-sm text-blue-500">
                {card.icon}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingCard(card);
                  setDialogOpen(true);
                }}
                className="text-blue-600"
              >
                Edit
              </button>

              <Button
                variant="destructive"
                onClick={async () => {
                  const ok = window.confirm(
                    "Delete this summary card?"
                  );

                  if (!ok) return;

                  await deleteSummaryCard(card.id!);

                  await loadCards();
                }}
              >
                Delete
              </Button>
            </div>

          </div>
        ))}

      </div>

      <SummaryCardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingCard}
        onSave={handleSave}
      />
    </div>
  );
}