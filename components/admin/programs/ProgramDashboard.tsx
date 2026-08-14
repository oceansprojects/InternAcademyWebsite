"use client";

import { useState } from "react";
import ProgramSidebar from "./ProgramSidebar";
import { EDITORS } from "./editors";

import type { Program } from "@/types/program";

type Props = {
  program: Program;
};

export default function ProgramDashboard({ program }: Props) {
  const [activeSection, setActiveSection] = useState("overview");

  const CurrentEditor =
  EDITORS[
    activeSection as keyof typeof EDITORS
  ];

  return (
    <div className="flex gap-6">

      {/* Sidebar */}
      <ProgramSidebar
        active={activeSection}
        onChange={setActiveSection}
      />

      {/* Content */}
      <div className="flex-1">

        <div className="bg-white rounded-xl shadow p-8">

          <h1 className="text-3xl font-bold mb-2">
            {program.title}
          </h1>

          {program.subtitle && (
            <p className="text-gray-500 mb-8">
              {program.subtitle}
            </p>
          )}

          <div className="border-b mb-8" />

          {CurrentEditor ? (
            <CurrentEditor program={program} />
          ) : (
            <div className="py-12 text-center">
              <h2 className="text-2xl font-semibold">
                Coming Soon
              </h2>

              <p className="text-gray-500 mt-2">
                This module is under development.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}