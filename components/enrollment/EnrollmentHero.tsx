import { BookOpen, Clock3, Users, Sparkles } from "lucide-react";

interface Props {
  programTitle?: string;
  programCategory?: string;
}

export default function EnrollmentHero({ programTitle, programCategory }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#004aad] via-[#003c8c] to-[#00b4d8] p-8 md:p-10 text-white shadow-xl">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00d2fd]/20 rounded-full blur-3xl transform -translate-x-20 translate-y-20 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00d2fd] border border-white/10">
          <Sparkles className="size-3.5" />
          <span>Cohort Enrollment Application</span>
        </div>

        <div>
          {programTitle && (
            <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">{programCategory || "Program"}</p>
          )}
          <h1 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
            {programTitle
              ? `Enroll in ${programTitle}`
              : "Complete Your Enrollment"}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 leading-relaxed font-normal">
            You're a few steps away from joining our next cohort. We need some basic academic details before our admissions team reviews your application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
            <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <BookOpen className="size-4.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-extrabold">2-Minute Process</p>
              <p className="text-[11px] text-white/70 font-medium">Quick & easy form</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
            <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Users className="size-4.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-extrabold">Expert Admission Review</p>
              <p className="text-[11px] text-white/70 font-medium">Personal evaluation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
            <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Clock3 className="size-4.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-extrabold">24–48 Hour Response</p>
              <p className="text-[11px] text-white/70 font-medium">Fast turnaround</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}