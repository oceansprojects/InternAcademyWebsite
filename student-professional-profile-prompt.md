# Agent Prompt: Student Schema  Professional Profile Extension

## Context / First Steps (do not skip)
Before writing any code:
1. Locate the existing Student schema/model file(s) and every place that consumes it (API routes/controllers, serializers/DTOs, frontend forms, validation schemas, seed/migration files).
2. Identify the stack in use (ORM/ODM, validation library, frontend framework, form library, file upload handling) by reading actual code  do not assume.
3. Identify existing conventions: naming style (camelCase/snake_case), file/folder structure, how enums/dropdowns are currently modeled, how existing file uploads (if any) are handled, how multi-entry/array sub-documents are structured elsewhere in the codebase.
4. Match the existing UI theme, component library, spacing/typography, and form patterns already used elsewhere in the app  do not introduce a new design language.
5. Confirm auth/ownership model (each profile section belongs to a single student/user) and reuse existing auth middleware/guards.

Only after this review, propose the schema diff and get it right in one pass  do not scaffold speculative structure beyond what's listed below.

## Requirement Summary

### Professional Profile (single object, one per student)
- Full Name (required, string)
- Profile Photo (optional, single file  image)
- Tech Stack (array of strings; UI = click-to-add chips from a predefined list + free-text custom entries)
- Years of Experience (dropdown/enum: `0-1`, `1-2`, `2-3`, `3-5`, `5-8`, `8+`)
- Resume Upload (single file  pdf/doc)
- Address (nested object: State, Nation, City)
- Phone Number (string, validated format, with country code support)
- Email (string, validated format)
- WhatsApp Number (string, validated format)

### Multi-entry sections (each an array of sub-documents under the Student schema)

**Education**  Institute/University Name, Start Year, End Year, Stream/Course (dropdown), Branch (dropdown), City, State, Grade/CGPA (add  standard field, minimal), Currently Studying (boolean, standard toggle to auto-handle "End Year").

**Job/Internship**  Company Name, Start Month+Year, End Month+Year, City, State, Type (dropdown: Internship/Job/Freelance), Position, Currently Working (boolean toggle), short Description (add  1 short text field, standard on every job platform; nothing beyond that).

**Projects** (Internshala-standard minimal set): Project Title, Description (short), Tech Stack used, Project Link/Repo Link (optional), Start Date, End Date (optional, ongoing toggle).

**Achievements**: Title, Description (short), Date, Issuing Organization/Event (optional).

**Rewards/Certificates**: Title, Issuing Organization, Issue Date, Certificate Link/File (optional), Credential ID (optional  only if the org standard elsewhere in the app already stores such IDs; otherwise skip).

Do not add fields beyond this list. No extra metadata, no document-storage bloat (no versioning fields, no redundant timestamps beyond what the schema already auto-generates via existing conventions).

## Implementation Instructions for the Agent

1. **Schema layer**: Extend the Student schema with a `professionalProfile` nested object and five array fields (`education[]`, `jobsInternships[]`, `projects[]`, `achievements[]`, `certificates[]`). Each array entry gets its own sub-schema/type with an `_id` (or existing ID convention) for independent update/delete. Use enums for all dropdown fields, matching how enums are declared elsewhere in this codebase (const array, enum type, or reference collection  follow existing pattern, don't invent a new one).
2. **Validation**: Add validation for email format, phone/WhatsApp number format (international-friendly), required vs optional fields exactly as specified above, file type/size limits for Profile Photo (image types only) and Resume (pdf/doc only)  reuse the app's existing upload/validation utility if one exists rather than writing a new one.
3. **File storage**: Reuse the existing file upload mechanism/service already used elsewhere in the app (S3, local disk, Cloudinary, etc.)  do not introduce a new storage approach. Store only the reference (URL/path), never raw file blobs in the DB.
4. **API layer**: Add/extend endpoints to:
   - Get/update the Professional Profile object.
   - CRUD each multi-entry section independently (add/update/delete a single education entry without resending the whole array)  follow REST conventions already used in this codebase.
5. **Frontend**:
   - Build the Professional Profile as one form section matching the current student profile page's layout/theme (spacing, colors, typography, input components  reuse existing form components, do not create new styled primitives unless none exist).
   - Tech Stack: chip-style multi-select from a predefined constant list + an "add custom" input, deduped, matching existing tag/chip UI if one already exists in the app.
   - Each multi-entry section (Education, Job/Internship, Projects, Achievements, Certificates) gets an "Add Entry" pattern  a repeatable card/form block with edit/delete per entry, consistent with any existing repeatable-section pattern in the app (check if one already exists before building a new one).
   - Dropdowns use whatever dropdown/select component is already standard in the app.
   - "Currently Studying"/"Currently Working" toggles should disable/clear the corresponding end date field.
6. **State management**: Match how forms currently manage state/submission in this app (form library, controlled components, existing hooks)  don't introduce a new form library.
7. **Migration**: If existing student records exist in production/dev data, write a safe additive migration (new fields default to empty/null/[])  never a destructive one.

## Prompt Tips (apply these while executing)
- Read before writing: grep the codebase for "Student" schema usages first; a change here likely touches auth, onboarding, and profile-view pages  find all of them before editing.
- Reuse over reinvent: if a dropdown/enum/chip/file-upload/multi-entry pattern already exists anywhere in the app, copy its pattern exactly rather than styling something new.
- Keep the diff minimal: only touch files that need to change for this feature; don't refactor unrelated code.
- Ask only if genuinely blocked (e.g., no existing file-upload utility at all)  otherwise use the codebase's dominant convention and proceed.
- Return only the changed/added files, not a full repo dump.
- Test the additive migration path (old student records) mentally before finalizing the schema  nothing should break for existing users with empty new fields.
