"use client";

import { useState, useEffect } from "react";
import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InternBotWidget } from "@/components/internbot-widget";
import OpportunityCard from "@/components/opportunities/OpportunityCard";
import {
  Search,
  Briefcase,
  SlidersHorizontal,
  Building2,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Opportunity } from "@/types/company";

export default function JobsListingPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");

  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedType !== "all") params.set("type", selectedType);
        if (selectedWorkMode !== "all") params.set("work_mode", selectedWorkMode);
        if (searchQuery.trim()) params.set("search", searchQuery.trim());

        const res = await fetch(`/api/opportunities?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data);
        }
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadOpportunities();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedType, selectedWorkMode, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200/70 pt-26 sm:pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#004aad] text-xs font-bold mb-4 uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Career Launchpad</span>
            </div>
            <h1 className="font-montserrat text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Explore High-Impact <span className="text-[#004aad]">Opportunities</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 mb-8">
              Discover verified internships and full-time positions from leading tech companies and start-ups looking for top talent.
            </p>

            {/* Search & Filter Bar */}
            <div className="max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/80 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company name, role, or tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-transparent focus:border-[#004aad] focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-[#004aad] cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="internship">Internship</option>
                  <option value="full_time">Full-Time</option>
                  <option value="part_time">Part-Time</option>
                  <option value="contract">Contract</option>
                </select>

                <select
                  value={selectedWorkMode}
                  onChange={(e) => setSelectedWorkMode(e.target.value)}
                  className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 outline-none focus:border-[#004aad] cursor-pointer"
                >
                  <option value="all">All Work Modes</option>
                  <option value="on_site">On-Site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Listings Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Filters / Counts */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                {opportunities.length} {opportunities.length === 1 ? "Opportunity" : "Opportunities"} Available
              </span>
            </div>

            <div className="flex items-center gap-2">
              {["all", "internship", "full_time"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    selectedType === type
                      ? "bg-[#004aad] text-white border-[#004aad] shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {type === "all" ? "All" : type === "internship" ? "Internships" : "Full-Time"}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="h-64 rounded-3xl bg-white border border-slate-200/80 p-6 animate-pulse flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <div className="size-12 rounded-2xl bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                      </div>
                    </div>
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                  </div>
                  <div className="h-8 bg-slate-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto">
              <div className="size-16 rounded-2xl bg-blue-50 text-[#004aad] flex items-center justify-center mx-auto mb-4">
                <Briefcase className="size-8" />
              </div>
              <h3 className="font-montserrat text-lg font-bold text-slate-900 mb-2">
                No Opportunities Found
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                We couldn't find any opportunities matching your current search or filter criteria. Try adjusting your keywords or filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedWorkMode("all");
                }}
                className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <InternBotWidget />
    </div>
  );
}
