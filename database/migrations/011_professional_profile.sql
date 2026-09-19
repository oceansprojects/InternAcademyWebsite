-- =========================================================
-- INTERN ACADEMY
-- STUDENT PROFESSIONAL PROFILE EXTENSION
-- Migration: 011_professional_profile.sql
-- Safe additive migration  all new columns default to
-- NULL / '{}' so existing student records are unaffected.
-- =========================================================

BEGIN;

-- =========================================================
-- NEW ENUMS
-- =========================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_years') THEN
    CREATE TYPE experience_years AS ENUM ('0-1','1-2','2-3','3-5','5-8','8+');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
    CREATE TYPE job_type AS ENUM ('internship','job','freelance');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'edu_stream') THEN
    CREATE TYPE edu_stream AS ENUM (
      'engineering','arts','commerce','science','mba','law','medicine','other'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'edu_branch') THEN
    CREATE TYPE edu_branch AS ENUM (
      'cs','it','ece','eee','mechanical','civil','chemical','other'
    );
  END IF;
END $$;

-- =========================================================
-- EXTEND student_profiles
-- =========================================================

ALTER TABLE student_profiles
  ADD COLUMN IF NOT EXISTS full_name          TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url  TEXT,
  ADD COLUMN IF NOT EXISTS email              TEXT,
  ADD COLUMN IF NOT EXISTS phone_number       TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number    TEXT,
  ADD COLUMN IF NOT EXISTS address_state      TEXT,
  ADD COLUMN IF NOT EXISTS address_city       TEXT,
  ADD COLUMN IF NOT EXISTS address_nation     TEXT,
  ADD COLUMN IF NOT EXISTS tech_stack         TEXT[]           NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS years_experience   experience_years;

-- =========================================================
-- EDUCATION ENTRIES
-- =========================================================

CREATE TABLE IF NOT EXISTS student_education (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id         UUID        NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  institute_name     TEXT        NOT NULL,
  start_year         SMALLINT    NOT NULL,
  end_year           SMALLINT,
  currently_studying BOOLEAN     NOT NULL DEFAULT FALSE,
  stream             edu_stream,
  branch             edu_branch,
  city               TEXT,
  state              TEXT,
  grade_cgpa         TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_education_student
  ON student_education (student_id);

-- =========================================================
-- JOB / INTERNSHIP ENTRIES
-- =========================================================

CREATE TABLE IF NOT EXISTS student_jobs (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID        NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  company_name      TEXT        NOT NULL,
  position          TEXT        NOT NULL,
  type              job_type    NOT NULL DEFAULT 'internship',
  start_month       SMALLINT    NOT NULL,
  start_year        SMALLINT    NOT NULL,
  end_month         SMALLINT,
  end_year          SMALLINT,
  currently_working BOOLEAN     NOT NULL DEFAULT FALSE,
  city              TEXT,
  state             TEXT,
  description       TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_jobs_student
  ON student_jobs (student_id);

-- =========================================================
-- PROJECT ENTRIES
-- =========================================================

CREATE TABLE IF NOT EXISTS student_projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID        NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  tech_stack  TEXT[]      NOT NULL DEFAULT '{}',
  project_url TEXT,
  start_date  DATE,
  end_date    DATE,
  is_ongoing  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_projects_student
  ON student_projects (student_id);

-- =========================================================
-- ACHIEVEMENT ENTRIES
-- =========================================================

CREATE TABLE IF NOT EXISTS student_achievements (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID        NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  description  TEXT,
  date         DATE,
  organization TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_achievements_student
  ON student_achievements (student_id);

-- =========================================================
-- CERTIFICATE / REWARD ENTRIES
-- =========================================================

CREATE TABLE IF NOT EXISTS student_certificates (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID        NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  title            TEXT        NOT NULL,
  issuing_org      TEXT        NOT NULL,
  issue_date       DATE,
  certificate_link TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_certificates_student
  ON student_certificates (student_id);

COMMIT;
