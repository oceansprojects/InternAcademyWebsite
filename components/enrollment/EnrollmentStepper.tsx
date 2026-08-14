import { Check } from "lucide-react";

interface Props {
  currentStep: 1 | 2;
}

const steps = [
  { id: 1, label: "Student Details", description: "Academic information" },
  { id: 2, label: "Confirmation", description: "Review & submit" },
];

export default function EnrollmentStepper({ currentStep }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
      <div className="flex items-center gap-0">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Node */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className={`size-10 rounded-full flex items-center justify-center font-extrabold text-sm transition-all shadow-sm ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-[#004aad] text-white ring-4 ring-[#004aad]/20"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="size-5" /> : step.id}
                </div>
                <div className="text-center hidden sm:block">
                  <p className={`text-xs font-bold ${isActive ? "text-[#004aad]" : isCompleted ? "text-emerald-700" : "text-slate-400"}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">{step.description}</p>
                </div>
              </div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-1 mx-3 rounded-full overflow-hidden bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? "bg-emerald-400 w-full" : isActive ? "bg-[#00d2fd] w-1/2" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}