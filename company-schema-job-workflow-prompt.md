# Agent Prompt: Company Schema & Job/Internship Workflow

## Context / First Steps (do not skip)
1. Study the existing Student schema/auth/dashboard implementation (from the previous Professional Profile work) end to end: auth strategy (JWT/session/cookies), route structure, middleware, folder layout, DB conventions, dropdown/enum patterns, multi-entry sub-document patterns, file-upload utility, and the existing UI theme/component library.
2. Study the existing Courses page implementation specifically (layout, filter mechanism, card component, pagination) since the Job/Internship listing page must mirror it.
3. Confirm the auth system supports (or can cleanly support) multiple user types/roles (Student vs Company) without breaking existing student sessions/tokens  check if a `role`/`userType` discriminator pattern already exists; if not, use the least invasive addition (e.g., separate collection + separate auth guard, or a `role` field on a shared users collection if that's already the pattern).
4. **Hard constraint: do not modify existing student schema fields, student auth routes/controllers, or student dashboard code.** Company is fully additive  separate schema, separate routes, separate auth guard/middleware, separate dashboard. Only shared code touched: navbar, top-level router, and the Job/Internship listing page (new).

Only after this review, implement  don't scaffold speculatively beyond what's listed below.

## Requirement Summary & Build Plan

### 0. Company Auth (fully separate from Student)
- Separate Company schema/collection for auth (name, email, password hash, company ref).
- Separate signup/login routes, separate auth middleware/guard (`requireCompanyAuth` distinct from `requireStudentAuth`).
- Navbar: replace/extend current single auth entry with two distinct entries  **Company Sign In** and **Student**  routing to their respective flows. Don't merge the two auth forms into one component with conditional logic; keep them separate to avoid coupling.

### 1–2. Company Schema  Profile
Single `Company` document per company:
- Company Name (required)
- Address (reuse same nested structure as Student's Address: State, Nation, City  for consistency)
- Contact Number
- Contact Email
- Employee Count (dropdown/enum: `0-50`, `50-100`, `100-500`, `500-1000`, `1000+`)
- Logo (file upload via existing upload utility  store URL/reference only, not "Logo Link" as free text unless the app has no upload utility, in which case a URL field is acceptable  check existing conventions first)
- Company Information (text/description)
- Website Link
- Social Media Links  array of `{ social_app_name, social_acc_link }`, add/edit/delete per entry (same multi-entry pattern used for Student's Education/Projects arrays)

### 2B–4. Opportunity (Job/Internship) Schema
Separate `Opportunity` schema, referencing the posting Company by ID:
- Type: Job / Internship (dropdown)
- Title
- Description
- Tech Stack (reuse same tag/chip pattern as Student Tech Stack  predefined list + custom add)
- Role
- Years of Experience Required (reuse same dropdown convention as Student's Years of Experience)
- Process of Selection (optional, text)
- Status (enum: `active`, `expired`, `closed`  needed for the Expire action)
- Standard additions needed for a real posting (minimal, Internshala-standard): Location/City & State, Number of Openings, Stipend/Salary (optional), Application Deadline, Work Mode (dropdown: On-site/Remote/Hybrid). Don't add beyond this.
- CRUD: create, edit/update, delete  standard REST endpoints scoped to the authenticated company (a company can only mutate its own postings).
- Expire: dedicated action (`PATCH /opportunities/:id/expire`) setting `status = expired`  not a delete, keep the record for the applied-student list.

### 5. Applications
- `Application` schema: reference to Student ID + Opportunity ID + appliedAt timestamp + status (optional: applied/shortlisted/rejected, only if the app needs it  otherwise keep to student+opportunity+timestamp).
- Endpoint: `GET /opportunities/:id/applicants`  returns list of students who applied, scoped to the requesting company owning that opportunity (authorization check required).

### 6. Student Profile view (company-side, read-only)
- `GET /companies/opportunities/:id/applicants/:studentId` (or reuse the existing student-profile-fetch endpoint with a company-auth-permitted read scope)  renders the full Professional Profile (all fields + Education/Job/Projects/Achievements/Certificates arrays) in read-only mode using the same profile display components already built for the student-facing profile page, not a new duplicate view.

### 7–8. Navbar "Job" + Listing Page
- Navbar: add "Job" with a submenu/dropdown  **Jobs**, **Internships** (both route to the same listing page pre-filtered by type, matching how Courses submenu/filtering already works if a similar pattern exists).
- Listing page: clone the Courses page's layout/card/pagination pattern; filter control switches between Jobs/Internships (and reuse any existing filter UI component rather than building new). Card click → opportunity detail page → Apply button (see step 10).

### 9. Company Dashboard UI
- Structure: sidebar or tab-based layout (match whatever navigation pattern the Student dashboard already uses, for consistency) with sections: Profile, Opportunities (list/manage), and per-opportunity Applicants view.
- Visual tone: clean, official, data-forward  reuse existing design tokens (colors, spacing, typography) from the current theme; don't introduce new colors/fonts. Use tables/cards for opportunity lists with status badges (active/expired), and a clear primary action ("Post New Opportunity").

### 10. Student Apply Workflow
On Apply click:
1. **Auth check**: not logged in → redirect to Student signup/login, with a return-to-opportunity redirect after auth so they land back on the same posting.
2. **Profile completeness check**: logged in → validate required Professional Profile fields (Full Name, Tech Stack, Years of Experience, Resume, Phone, Email, Address at minimum  define "required" as whatever was marked required in the Professional Profile schema, don't invent a new required-fields list here).
   - Missing required fields → redirect to Professional Profile page, show message: **"Fill your details first before applying"** (use existing toast/alert component, not a new one).
   - Complete → create the Application record and confirm to the student (e.g., "Applied successfully").
- Implement this check as a reusable guard/hook (e.g., `checkProfileComplete(student)`) rather than inlining validation logic in the Apply button handler, since it may be reused elsewhere (e.g., a profile-completion banner).

## Prompt Tips (apply while executing)
- Keep Student and Company as fully parallel, non-overlapping systems at the schema/auth/route level  the only integration points are: (a) navbar, (b) Job listing page, (c) the Apply → Application → Applicants read path. Everywhere else, zero coupling.
- Reuse every pattern already established for Student (dropdowns, multi-entry arrays, file upload, chip-select tech stack, dashboard layout, toast messages) instead of re-deriving conventions  consistency matters more than novelty here.
- Verify authorization on every company-side endpoint: a company must only ever read/write its own Opportunities and only view Applicants/Student-profiles tied to its own postings.
- Don't delete opportunity records on delete-vs-expire ambiguity  delete truly removes, expire just flips status; keep them distinct as specified.
- Return only new/changed files, not a full repo dump.
- Sanity-check at the end: log in as a student, confirm nothing in the student flow changed or broke.
