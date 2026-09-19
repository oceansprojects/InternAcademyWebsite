"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { PREDEFINED_TECH_STACK } from "@/constants/tech-stack";
import { Input } from "@/components/ui/input";

interface TechStackPickerProps {
  value: string[];
  onChange: (val: string[]) => void;
}

export default function TechStackPicker({ value, onChange }: TechStackPickerProps) {
  const [customInput, setCustomInput] = useState("");

  function remove(skill: string) {
    onChange(value.filter((s) => s !== skill));
  }

  function add(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
  }

  function handleCustomAdd() {
    add(customInput);
    setCustomInput("");
  }

  const available = PREDEFINED_TECH_STACK.filter((s) => !value.includes(s));

  return (
    <div className="space-y-4">
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-[#004aad] border border-blue-200 rounded-full px-3 py-1 text-xs font-semibold"
            >
              {skill}
              <button
                type="button"
                onClick={() => remove(skill)}
                className="hover:text-red-500 transition-colors ml-0.5"
                aria-label={`Remove ${skill}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Predefined chips to add */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {available.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => add(skill)}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 hover:text-[#004aad] hover:border-blue-200 text-slate-600 border border-slate-200 rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="size-3" />
              {skill}
            </button>
          ))}
        </div>
      )}

      {/* Custom skill input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom skill (e.g. Kotlin, Blender...)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCustomAdd();
            }
          }}
          className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium flex-1"
        />
        <button
          type="button"
          onClick={handleCustomAdd}
          disabled={!customInput.trim()}
          className="px-4 py-2 rounded-xl bg-[#004aad] hover:bg-[#003c8c] text-white text-xs font-bold disabled:opacity-40 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="size-3.5" />
          Add
        </button>
      </div>
    </div>
  );
}
