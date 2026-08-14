// Public content accessors.
//
// These return the curated content used across the marketing site. They are
// async so the implementation can be swapped to database queries once a database
// is connected. Keeping a seed-backed fallback means the site renders fully even before a DB
// is provisioned.

import {
  programs,
  internships,
  resources,
  successStories,
  placements,
  webinars,
} from "@/lib/seed-data"
import type {
  Program,
  Internship,
  Resource,
  SuccessStory,
  PlacementRecord,
  Webinar,
} from "@/lib/types"

export async function getPrograms(): Promise<Program[]> {
  return programs
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  return programs.find((p) => p.slug === slug) ?? null
}

export async function getInternships(): Promise<Internship[]> {
  return internships
}

export async function getInternshipBySlug(slug: string): Promise<Internship | null> {
  return internships.find((i) => i.slug === slug) ?? null
}

export async function getResources(): Promise<Resource[]> {
  return [...resources].sort(
    (a, b) => +new Date(b.published_at) - +new Date(a.published_at),
  )
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  return resources.find((r) => r.slug === slug) ?? null
}

export async function getSuccessStories(): Promise<SuccessStory[]> {
  return successStories
}

export async function getPlacements(): Promise<PlacementRecord[]> {
  return [...placements].sort((a, b) => b.package_lpa - a.package_lpa)
}

export async function getWebinars(): Promise<Webinar[]> {
  return webinars
}

export function inr(n: number): string {
  return "\u20B9" + n.toLocaleString("en-IN")
}
