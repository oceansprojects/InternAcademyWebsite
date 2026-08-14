"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  categories: string[];
  onChange: (value: string) => void;
};

export default function CategoryCombobox({
  value,
  categories = [],
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const filtered = categories.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="relative w-full"
      ref={wrapperRef}
    >
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 cursor-pointer items-center justify-between rounded-md border bg-white px-3"
      >
        <span className={value ? "" : "text-gray-400"}>
          {value || "Select category"}
        </span>

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border bg-white shadow-lg">
          <div className="p-2">
            <Input
              autoFocus
              placeholder="Search category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="max-h-56 overflow-y-auto">

            {filtered.map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setSearch(cat);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100"
              >
                <span>{cat}</span>

                {value === cat && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            ))}

            {search.trim() !== "" &&
              !categories.some(
                (c) =>
                  c.toLowerCase() ===
                  search.toLowerCase()
              ) && (
                <div
                  onClick={() => {
                    onChange(search);
                    setOpen(false);
                  }}
                  className="cursor-pointer border-t px-3 py-2 font-medium text-blue-600 hover:bg-blue-50"
                >
                  + Create "{search}"
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}