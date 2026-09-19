-- =========================================================
-- INTERN ACADEMY
-- COMPANY SCHEMA & JOB/INTERNSHIP WORKFLOW
-- Migration: 012_company_job_workflow.sql
-- Fully additive. Zero changes to student tables.
-- =========================================================

BEGIN;

-- =========================================================
-- NEW ENUMS
-- =========================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'opportunity_status') THEN
    CREATE TYPE opportunity_status AS ENUM ('active', 'expired', 'closed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'work_mode') THEN
    CREATE TYPE work_mode AS ENUM ('on_site', 'remote', 'hybrid');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employee_count') THEN
    CREATE TYPE employee_count AS ENUM ('0-50', '50-100', '100-500', '500-1000', '1000+');
  END IF;
END $$;

-- Add 'company' to user_role enum (safe  idempotent via DO block)
DO $$ BEGIN
  ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'company';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =========================================================
-- EXTEND companies TABLE
-- (stub had: id, name, logo_url, website, created_at)
-- =========================================================

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS contact_email   TEXT,
  ADD COLUMN IF NOT EXISTS contact_number  TEXT,
  ADD COLUMN IF NOT EXISTS description     TEXT,
  ADD COLUMN IF NOT EXISTS address_city    TEXT,
  ADD COLUMN IF NOT EXISTS address_state   TEXT,
  ADD COLUMN IF NOT EXISTS address_nation  TEXT,
  ADD COLUMN IF NOT EXISTS employee_count  employee_count,
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- =========================================================
-- COMPANY SOCIAL LINKS
-- Multi-entry array, same pattern as student sub-documents
-- =========================================================

CREATE TABLE IF NOT EXISTS company_social_links (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       UUID        NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  social_app_name  TEXT        NOT NULL,
  social_acc_link  TEXT        NOT NULL,
  sort_order       INT         NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_social_links_company
  ON company_social_links (company_id);

-- =========================================================
-- COMPANY USERS
-- Links users row (role='company') → companies row
-- One-to-one for now; unique on user_id
-- =========================================================

CREATE TABLE IF NOT EXISTS company_users (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL UNIQUE REFERENCES users(id)    ON DELETE CASCADE,
  company_id UUID        NOT NULL        REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_company_users_company
  ON company_users (company_id);

-- =========================================================
-- EXTEND internship_opportunities
-- Existing columns kept intact:
--   id, company_id, title, location, type, description,
--   requirements, stipend, duration, is_active, deadline,
--   created_at, updated_at
-- =========================================================

ALTER TABLE internship_opportunities
  ADD COLUMN IF NOT EXISTS role                 TEXT,
  ADD COLUMN IF NOT EXISTS tech_stack           TEXT[]             NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS years_experience     experience_years,
  ADD COLUMN IF NOT EXISTS selection_process    TEXT,
  ADD COLUMN IF NOT EXISTS status               opportunity_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS work_mode            work_mode          NOT NULL DEFAULT 'on_site',
  ADD COLUMN IF NOT EXISTS city                 TEXT,
  ADD COLUMN IF NOT EXISTS state                TEXT,
  ADD COLUMN IF NOT EXISTS openings             INT,
  ADD COLUMN IF NOT EXISTS stipend_salary       TEXT,
  ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMPTZ;

-- =========================================================
-- TRIGGERS
-- =========================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_companies_updated_at'
  ) THEN
    CREATE TRIGGER trg_companies_updated_at
      BEFORE UPDATE ON companies
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

COMMIT;
