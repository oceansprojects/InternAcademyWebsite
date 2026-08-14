
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS

CREATE TYPE user_role          AS ENUM ('student', 'admin', 'faculty');
CREATE TYPE oauth_provider     AS ENUM ('google', 'github', 'credentials');
CREATE TYPE batch_mode         AS ENUM ('offline', 'online', 'hybrid');
CREATE TYPE enrollment_status  AS ENUM ('active', 'completed', 'dropped', 'pending');
CREATE TYPE payment_status     AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE post_status        AS ENUM ('draft', 'published', 'archived');
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'rejected', 'hired');
CREATE TYPE opportunity_type   AS ENUM ('internship', 'full_time', 'part_time', 'contract');
CREATE TYPE project_level      AS ENUM ('beginner', 'intermediate', 'advanced');

-- All 12 sidebar tabs as section keys.
-- These drive both the sidebar nav AND the is_enabled toggle.
CREATE TYPE section_key AS ENUM (
  'overview',
  'program_summary',
  'demo_video',
  'curriculum',
  'technologies',
  'projects',
  'internship_details',
  'faculty',
  'career_opportunities',
  'testimonials',
  'certification',
  'faqs'
);


-- USERS

CREATE TABLE users (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT          NOT NULL,
  email          TEXT          NOT NULL UNIQUE,
  password_hash  TEXT,
  avatar_url     TEXT,
  oauth_provider oauth_provider NOT NULL DEFAULT 'credentials',
  oauth_id       TEXT,
  role           user_role     NOT NULL DEFAULT 'student',
  is_active      BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX users_oauth_idx ON users (oauth_provider, oauth_id)
  WHERE oauth_id IS NOT NULL;


-- COMPANIES  (for future internship opportunities)

CREATE TABLE companies (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  logo_url   TEXT,
  website    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- PROGRAMS  (core cohort record)

CREATE TABLE programs (
  id               UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT       NOT NULL UNIQUE,   -- e.g. "full-stack-development"
  title            TEXT       NOT NULL,          -- "Full-Stack Development Mastery"
  subtitle         TEXT,                         -- "Mastery of" (label above title)
  category         TEXT,                         -- "Development" | "Design" | "Data Science"
  duration_weeks   INT        NOT NULL,
  batch_mode       batch_mode NOT NULL DEFAULT 'offline',
  schedule         TEXT,                         -- "Weekly (3 sessions)"
  location         TEXT,                         -- "Koramangala, Bengaluru"
  base_price       INT        NOT NULL,          -- INR paise. ₹49,999 → 4999900
  discounted_price INT        NOT NULL,          -- INR paise. ₹34,999 → 3499900
  is_popular       BOOLEAN    NOT NULL DEFAULT FALSE,
  is_published     BOOLEAN    NOT NULL DEFAULT FALSE,
  cohort_start     TIMESTAMPTZ,
  syllabus_url     TEXT,                         -- downloadable PDF link
  demo_video_url   TEXT,
  demo_video_duration_mins INT,                  -- "Duration: 4 mins"
  demo_video_description   TEXT,                 -- "Watch the cohort induction preview..."
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- PROGRAM SECTION VISIBILITY
-- Controls which of the 12 sidebar tabs are shown and in what order.
-- If a row is missing for a section_key, frontend treats it as hidden.
-- Admin can toggle is_enabled per program.

CREATE TABLE program_section_config (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID        NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  section     section_key NOT NULL,
  is_enabled  BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order  INT         NOT NULL DEFAULT 0,    -- sidebar nav order
  UNIQUE (program_id, section)
);

CREATE INDEX prog_sec_config_idx ON program_section_config (program_id, sort_order);

-- PROGRAM SUMMARY CARDS
-- The 8 key-value info cards on the Program Summary tab.
-- label:  "DURATION", "ELIGIBILITY", "MODE", "CERTIFICATION",
--         "INTERNSHIP", "PLACEMENT", "BATCH SIZE", "START DATE"
-- value:  "16 Weeks (4 Months)", "Final-year students...", etc.
-- icon:   optional icon name (clock, users, map-pin, award, etc.)

CREATE TABLE program_summary_cards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,   -- e.g. "DURATION"
  value      TEXT NOT NULL,   -- e.g. "16 Weeks (4 Months)"
  icon       TEXT,            -- icon identifier for frontend
  sort_order INT  NOT NULL DEFAULT 0
);


-- OVERVIEW SECTION
-- The intro paragraphs + "What you will master" bullets

CREATE TABLE program_overview (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID NOT NULL UNIQUE REFERENCES programs(id) ON DELETE CASCADE,
  intro_text  TEXT NOT NULL   -- the 2–3 bold/normal paragraphs
);

CREATE TABLE program_learnings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  point      TEXT NOT NULL,   -- "Query millions of database rows..."
  sort_order INT  NOT NULL DEFAULT 0
);


-- CURRICULUM  (Phases → Modules → Topics)
-- Phase: "PHASE 1", "PHASE 2"
-- Module: "Module 1: Advanced Frontend Engineering"
-- Topics: bullet list under "CORE TOPICS"

CREATE TABLE curriculum_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  phase_label TEXT NOT NULL,   -- "PHASE 1"
  title       TEXT NOT NULL,   -- "Module 1: Advanced Frontend Engineering"
  objective   TEXT,            -- italic line: "Objective: Build pixel-perfect..."
  sort_order  INT  NOT NULL DEFAULT 0
);

CREATE TABLE curriculum_topics (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES curriculum_modules(id) ON DELETE CASCADE,
  topic     TEXT NOT NULL,     -- "TypeScript Fundamentals & Type Safety"
  sort_order INT NOT NULL DEFAULT 0
);


-- TECHNOLOGIES  (icon chips on Technologies tab)

CREATE TABLE program_technologies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,   -- "React", "Next.js", "TypeScript"
  icon_url   TEXT,            -- logo image URL
  sort_order INT  NOT NULL DEFAULT 0
);


-- PROJECTS  (capstone cards on Projects tab)


CREATE TABLE program_projects (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID          NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title       TEXT          NOT NULL,   -- "Real-time Collaborative Whiteboard"
  description TEXT,
  level       project_level NOT NULL DEFAULT 'intermediate',
  image_url   TEXT,
  sort_order  INT           NOT NULL DEFAULT 0
);

-- Tags per project (WebSockets, Canvas API, State Synchronization)
CREATE TABLE program_project_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES program_projects(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0
);



-- INTERNSHIP DETAILS  (8-Week Guild Placement Roadmap phases)

CREATE TABLE internship_phases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  phase_label TEXT NOT NULL,   -- "PHASE 1: TEAM BOARDING & SETUP"
  description TEXT NOT NULL,   -- "Setup repositories, project board..."
  color       TEXT,            -- dot color hex for timeline UI
  sort_order  INT  NOT NULL DEFAULT 0
);



-- FACULTY

CREATE TABLE faculty (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id   UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,        -- "Prof. Raghunath Tewari"
  role         TEXT,                 -- "ACADEMIC CONSULTANT & GUEST FACULTY"
  institution  TEXT,                 -- "Associate Professor at IIT Kanpur"
  bio          TEXT,
  avatar_url   TEXT,
  linkedin_url TEXT,
  sort_order   INT  NOT NULL DEFAULT 0
);

-- Expertise tag chips ("Algorithms, Theoretical Computer Science, Complex Systems")
CREATE TABLE faculty_expertise (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  tag        TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0
);


-- CAREER OPPORTUNITIES

CREATE TABLE career_opportunities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id          UUID NOT NULL UNIQUE REFERENCES programs(id) ON DELETE CASCADE,
  salary_range        TEXT,   -- "₹6 LPA – ₹18 LPA (Based on experience and skills)"
  market_demand_text  TEXT    -- "High. Digital transformation..."
);

-- Role chips ("Full-Stack Software Engineer", "Backend Developer", ...)
CREATE TABLE career_roles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_opportunity_id UUID NOT NULL REFERENCES career_opportunities(id) ON DELETE CASCADE,
  role_title            TEXT NOT NULL,
  sort_order            INT  NOT NULL DEFAULT 0
);


-- TESTIMONIALS

CREATE TABLE testimonials (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id   UUID    NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  user_id      UUID    REFERENCES users(id) ON DELETE SET NULL,
  author_name  TEXT    NOT NULL,   -- "Nikhil Sharma"
  company      TEXT,               -- "ASSOCIATE ENGINEER AT RAZORPAY"
  batch        TEXT,               -- "Batch 3 · Jan 2026"
  content      TEXT    NOT NULL,
  rating       INT     CHECK (rating BETWEEN 1 AND 5),
  avatar_url   TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- FAQs  (global pool + per-program assignment)
--
-- Why this design:
--   - FAQs repeat across programs (same question, same answer)
--   - Admin writes each FAQ once in global_faqs
--   - Then assigns it to programs via program_faq_assignments
--   - Can override sort_order per program
--   - To add a program-specific FAQ: add to global_faqs, assign only to that program

CREATE TABLE global_faqs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE program_faq_assignments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  faq_id     UUID NOT NULL REFERENCES global_faqs(id) ON DELETE CASCADE,
  sort_order INT  NOT NULL DEFAULT 0,
  UNIQUE (program_id, faq_id)
);


-- CERTIFICATIONS

CREATE TABLE certifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id  UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  cert_number TEXT NOT NULL UNIQUE,   -- "IA-COHORT-2026" / "IA-2026-0042"
  issued_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,
  UNIQUE (user_id, program_id)
);


-- ENROLLMENTS

CREATE TABLE enrollments (
  id             UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program_id     UUID              NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  status         enrollment_status NOT NULL DEFAULT 'pending',
  payment_status payment_status    NOT NULL DEFAULT 'pending',
  amount_paid    INT,
  enrolled_at    TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  completed_at   TIMESTAMPTZ,
  UNIQUE (user_id, program_id)
);

CREATE INDEX enrollments_user_idx    ON enrollments (user_id);
CREATE INDEX enrollments_program_idx ON enrollments (program_id);


-- PAYMENTS  (Razorpay / Stripe webhook ready)

CREATE TABLE payments (
  id                 UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id      UUID           NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  user_id            UUID           NOT NULL REFERENCES users(id),
  gateway            TEXT           NOT NULL DEFAULT 'razorpay',
  gateway_order_id   TEXT,
  gateway_payment_id TEXT           UNIQUE,
  gateway_signature  TEXT,
  amount             INT            NOT NULL,
  currency           TEXT           NOT NULL DEFAULT 'INR',
  status             payment_status NOT NULL DEFAULT 'pending',
  raw_webhook        JSONB,
  created_at         TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);


-- BLOG POSTS

CREATE TABLE blog_posts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id        UUID        NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  excerpt          TEXT,
  content          TEXT,
  cover_image_url  TEXT,
  status           post_status NOT NULL DEFAULT 'draft',
  published_at     TIMESTAMPTZ,
  meta_title       TEXT,
  meta_description TEXT,
  read_time_mins   INT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX blog_posts_status_idx ON blog_posts (status, published_at DESC);

CREATE TABLE blog_tags (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id  UUID NOT NULL REFERENCES blog_tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);


-- INTERNSHIP OPPORTUNITIES  (future module)

CREATE TABLE internship_opportunities (
  id           UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID             NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title        TEXT             NOT NULL,
  location     TEXT,
  type         opportunity_type NOT NULL DEFAULT 'internship',
  description  TEXT,
  requirements TEXT,
  stipend      TEXT,
  duration     TEXT,
  is_active    BOOLEAN          NOT NULL DEFAULT TRUE,
  deadline     TIMESTAMPTZ,
  created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE TABLE internship_applications (
  id             UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID               NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID               NOT NULL REFERENCES internship_opportunities(id) ON DELETE CASCADE,
  status         application_status NOT NULL DEFAULT 'applied',
  resume_url     TEXT,
  cover_letter   TEXT,
  applied_at     TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, opportunity_id)
);


-- NEWSLETTER SUBSCRIBERS

CREATE TABLE newsletter_subscribers (
  email         TEXT    PRIMARY KEY,
  is_confirmed  BOOLEAN NOT NULL DEFAULT FALSE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ADMIN AUDIT LOG

CREATE TABLE admin_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID NOT NULL REFERENCES users(id),
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- AUTO-UPDATE updated_at TRIGGER


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_programs_updated_at
  BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_opportunities_updated_at
  BEFORE UPDATE ON internship_opportunities FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON internship_applications FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- SEED: default admin user

INSERT INTO users (name, email, role, oauth_provider)
VALUES ('Admin', 'admin@internacademy.in', 'admin', 'credentials');



-- SEED: global FAQs (shared across all programs)

INSERT INTO global_faqs (question, answer) VALUES
  ('Is this training fully offline?',
   'Yes. All classes, design labs, and coding cohorts happen in person at our Koramangala center in Bengaluru. This helps ensure peer collaboration and instant mentor feedback.'),
  ('How does the guaranteed internship work?',
   'After completing the cohort curriculum, students are placed into an 8-week Guild internship at InternAcademy Agency, working on real client projects with mentor supervision.'),
  ('What laptop specifications are required?',
   'Any laptop manufactured after 2019 with at least 8GB RAM and 256GB storage. macOS, Windows 10+, or Ubuntu 20+ are all supported.'),
  ('Do you offer placement assistance?',
   'Yes. We provide resume parsing, mock interviews, and access to our direct referral partner network to help you land your first role.'),
  ('What is the batch cancellation or refund policy?',
   'Cancellations made more than 7 days before cohort start are eligible for a full refund. Within 7 days, a 50% refund applies. No refund after the cohort begins.');


-- ============================================================
-- Tables created (v2):
--   users, companies, programs,
--   program_section_config,         ← NEW: section visibility + order
--   program_overview,               ← NEW: intro text
--   program_summary_cards,          ← NEW: 8 info cards
--   program_learnings,
--   curriculum_modules,             ← NEW: phase/module structure
--   curriculum_topics,              ← NEW: core topic bullets
--   program_technologies,           ← updated: + icon_url
--   program_projects,               ← updated: + level
--   program_project_tags,           ← NEW: chips per project
--   internship_phases,              ← NEW: roadmap timeline
--   faculty,                        ← updated: + institution
--   faculty_expertise,              ← NEW: expertise tag chips
--   career_opportunities,           ← updated: structured fields
--   career_roles,                   ← NEW: role chip tags
--   testimonials,
--   global_faqs,                    ← NEW: shared FAQ pool
--   program_faq_assignments,        ← NEW: assign FAQs to programs
--   certifications,
--   enrollments, payments,
--   blog_posts, blog_tags, blog_post_tags,
--   internship_opportunities, internship_applications,
--   newsletter_subscribers, admin_audit_log
-- ============================================================
