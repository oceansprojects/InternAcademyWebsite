"use client";

import Link from "next/link";
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Banknote,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { Opportunity } from "@/types/company";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  internship: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  full_time: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  part_time: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  contract: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const WORK_MODE_LABELS: Record<string, string> = {
  on_site: "On-Site",
  remote: "Remote",
  hybrid: "Hybrid",
};

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const typeStyle = TYPE_COLORS[opportunity.type] || TYPE_COLORS.internship;
  const isExpired =
    opportunity.status === "expired" ||
    (opportunity.application_deadline &&
      new Date(opportunity.application_deadline) < new Date());

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm hover:border-[#004aad]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Top bar: Company + Badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {opportunity.company_logo_url ? (
                <img
                  src={opportunity.company_logo_url}
                  alt={opportunity.company_name || "Company"}
                  className="size-full object-cover"
                />
              ) : (
                <Building2 className="size-6 text-slate-500" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider line-clamp-1">
                {opportunity.company_name || "Company"}
              </p>
              <h3 className="font-montserrat text-lg font-bold text-slate-900 group-hover:text-[#004aad] transition-colors line-clamp-1">
                {opportunity.title}
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
            >
              {opportunity.type === "full_time"
                ? "Full Time"
                : opportunity.type === "part_time"
                ? "Part Time"
                : opportunity.type === "internship"
                ? "Internship"
                : "Contract"}
            </span>
            {isExpired && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                Expired
              </span>
            )}
          </div>
        </div>

        {/* Role & Key Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-medium text-slate-700">
            <Briefcase className="size-3.5 text-slate-500" />
            {WORK_MODE_LABELS[opportunity.work_mode] || "On-Site"}
          </span>
          {(opportunity.city || opportunity.state) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-medium text-slate-700">
              <MapPin className="size-3.5 text-slate-500" />
              {[opportunity.city, opportunity.state].filter(Boolean).join(", ")}
            </span>
          )}
          {opportunity.years_experience && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-medium text-slate-700">
              <Clock className="size-3.5 text-slate-500" />
              {opportunity.years_experience} yrs exp
            </span>
          )}
          {opportunity.openings && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 font-medium text-slate-700">
              <Users className="size-3.5 text-slate-500" />
              {opportunity.openings} opening{opportunity.openings > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Description Snippet */}
        {opportunity.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {opportunity.description}
          </p>
        )}

        {/* Tech Stack Pills */}
        {opportunity.tech_stack && opportunity.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {opportunity.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-50/70 text-[#004aad] border border-blue-100"
              >
                {tech}
              </span>
            ))}
            {opportunity.tech_stack.length > 4 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                +{opportunity.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Stipend + View Details Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Stipend / Salary
          </span>
          <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
            <Banknote className="size-4 text-emerald-600" />
            {opportunity.stipend_salary || "Disclosed on review"}
          </span>
        </div>

        <Link
          href={`/jobs/${opportunity.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-[#004aad] text-white hover:bg-[#003882] shadow-sm hover:shadow-md transition-all group-hover:gap-2.5"
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
