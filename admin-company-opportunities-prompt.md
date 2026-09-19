# Agent Prompt: Company Accounts & Opportunities in Admin Panel

## First Steps
1. Study the existing admin panel structure already used for students/inquiries (from the current oceanstechnologies.in admin dashboard)  sidebar pattern, list/detail view pattern, auth-gating, table components.
2. Reuse that exact pattern for Companies and Opportunities  do not design a new admin layout.

## Scope
Add two read/manage views to the existing admin panel. No new admin auth system  reuse existing admin login/guard.

### A. Companies (sidebar entry: "Companies")
- **List view**: table of all registered companies  Company Name, Contact Email, Employee Count, Website, Signup Date, Status (active/blocked).
- **Detail view** (click a row): full Company Profile  all fields from the Company schema (Address, Contact Number, Employee Count, Logo, Company Information, Website, Social Media Links) + list of that company's Opportunities (linked).
- **Admin actions**: Block/Unblock company (reuse existing status-toggle pattern if one exists, e.g. from student/inquiry management); no edit of company-owned data from admin side  view + moderate only.

### B. Opportunities (sidebar entry: "Job/Internship Posts")
- **List view**: table  Title, Company Name, Type (Job/Internship), Status (active/expired/closed), Posted Date, Applicant Count. Filter by Type and Status (reuse existing filter component).
- **Detail view**: full posting fields + list of applicants (student names, linked to student profile view  reuse the company-side applicant view component, admin just gets read access to the same component).
- **Admin actions**: Expire or Remove a posting (moderation only  reuse the Expire action already built for companies; add a Remove/delist for admin-only takedown, distinct from company's own delete).

## Backend
- No new schemas  query existing `Company`, `Opportunity`, `Application` collections.
- New admin-only endpoints, gated by existing admin auth middleware:
  - `GET /admin/companies`, `GET /admin/companies/:id`
  - `PATCH /admin/companies/:id/status` (block/unblock)
  - `GET /admin/opportunities`, `GET /admin/opportunities/:id`
  - `PATCH /admin/opportunities/:id/status` (expire/remove)
- All endpoints read-heavy; only status-toggle mutations  no editing of company/opportunity content from admin.

## UI
- Match current admin dashboard theme exactly (same table, badge, and detail-panel components used for the existing student/inquiry sections). No new design system.

## Tips
- Keep this additive only  don't touch existing admin sections (students, inquiries).
- Reuse components over building new: table, status badge, detail drawer/page, filter bar should all be the same components already in the admin panel.
- Authorization: confirm existing admin middleware, not company or student auth, gates these routes.
- Return only new/changed files.
