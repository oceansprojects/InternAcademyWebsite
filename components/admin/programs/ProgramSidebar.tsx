import { PROGRAM_SECTIONS } from "@/constants/program-sections";

type Props = {
  active: string;
  onChange: (section: string) => void;
};

export default function ProgramSidebar({
  active,
  onChange,
}: Props) {
  return (
    <div className="w-72 bg-white rounded-xl shadow p-4">
      <h2 className="font-bold text-lg mb-5">
        Program Management
      </h2>

      <div className="space-y-2">
        {PROGRAM_SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => onChange(section.key)}
            className={`w-full text-left px-4 py-3 rounded-lg transition ${
              active === section.key
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}