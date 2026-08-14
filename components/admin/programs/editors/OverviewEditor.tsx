"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getOverview, updateOverview } from "@/services/overview.api";
import type { Program } from "@/types/program";

type OverviewData = {
  bold_intro: string;
  paragraphs: string[];
  master_points: string[];
};

const EMPTY: OverviewData = {
  bold_intro: "",
  paragraphs: ["", "", ""],
  master_points: ["", "", "", ""],
};

function parseOverview(raw: string | null | undefined): OverviewData {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    return {
      bold_intro: parsed.bold_intro ?? "",
      paragraphs: Array.isArray(parsed.paragraphs)
        ? parsed.paragraphs
        : ["", "", ""],
      master_points: Array.isArray(parsed.master_points)
        ? parsed.master_points
        : ["", "", "", ""],
    };
  } catch {
    // Legacy plain-text fallback — put everything in bold_intro
    return { ...EMPTY, bold_intro: raw };
  }
}

type Props = { program: Program };

export default function OverviewEditor({ program }: Props) {
  const [data, setData] = useState<OverviewData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await getOverview(program.id);
        setData(parseOverview(response.data?.intro_text));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [program.id]);

  function setBoldIntro(val: string) {
    setData((d) => ({ ...d, bold_intro: val }));
  }

  function setParagraph(index: number, val: string) {
    setData((d) => {
      const next = [...d.paragraphs];
      next[index] = val;
      return { ...d, paragraphs: next };
    });
  }

  function setMasterPoint(index: number, val: string) {
    setData((d) => {
      const next = [...d.master_points];
      next[index] = val;
      return { ...d, master_points: next };
    });
  }

  function addParagraph() {
    setData((d) => ({ ...d, paragraphs: [...d.paragraphs, ""] }));
  }

  function removeParagraph(index: number) {
    setData((d) => ({
      ...d,
      paragraphs: d.paragraphs.filter((_, i) => i !== index),
    }));
  }

  function addMasterPoint() {
    setData((d) => ({ ...d, master_points: [...d.master_points, ""] }));
  }

  function removeMasterPoint(index: number) {
    setData((d) => ({
      ...d,
      master_points: d.master_points.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
  try {
    setSaving(true);
    await updateOverview(program.id, JSON.stringify(data));
    toast.success("Overview saved successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to save overview.");
  } finally {
    setSaving(false);
  }
}

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Overview</h2>
      <p className="text-gray-500 mb-6">Manage the overview section.</p>

      {/* ── Part 1: Bold intro paragraph ─────────────────────────────── */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Bold Intro Paragraph
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Displayed as the first bold paragraph on the course page.
        </p>
        <textarea
          rows={3}
          value={data.bold_intro}
          onChange={(e) => setBoldIntro(e.target.value)}
          placeholder="Step into the role of a modern software engineer…"
          className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ── Part 2: Normal paragraphs ─────────────────────────────────── */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Body Paragraphs
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Normal-weight paragraphs displayed below the bold intro.
        </p>
        <div className="space-y-3">
          {data.paragraphs.map((para, i) => (
            <div key={i} className="flex gap-2 items-start">
              <textarea
                rows={2}
                value={para}
                onChange={(e) => setParagraph(i, e.target.value)}
                placeholder={`Paragraph ${i + 1}`}
                className="flex-1 border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {data.paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  className="mt-1 text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 border border-red-200 rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addParagraph}
          className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
        >
          + Add paragraph
        </button>
      </div>

      {/* ── Part 3: "What you will master" bullet points ─────────────── */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          ✨ What You Will Master — Bullet Points
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Displayed in a 2-column grid inside the highlighted box at the bottom.
        </p>
        <div className="space-y-2">
          {data.master_points.map((point, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={point}
                onChange={(e) => setMasterPoint(i, e.target.value)}
                placeholder={`Skill point ${i + 1}`}
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {data.master_points.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMasterPoint(i)}
                  className="text-red-400 hover:text-red-600 text-xs font-bold px-2 py-1 border border-red-200 rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMasterPoint}
          className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
        >
          + Add bullet point
        </button>
      </div>

      {/* ── Save ─────────────────────────────────────────────────────── */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Overview"}
        </button>
      </div>
    </div>
  );
}
