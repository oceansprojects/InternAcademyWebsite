-- =========================================================
-- INTERN ACADEMY
-- STUDENT REGISTRATION MODULE
-- Migration: 002_student_registration_module.sql
-- =========================================================

BEGIN;

-- =========================================================
-- CREATE STUDY MODE ENUM
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'study_mode'
    ) THEN
        CREATE TYPE study_mode AS ENUM (
            'offline',
            'online'
        );
    END IF;
END $$;

-- =========================================================
-- CREATE STUDENT PROFILES TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS student_profiles (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    mobile_number VARCHAR(15) NOT NULL,

    college_name TEXT NOT NULL,

    degree TEXT NOT NULL,

    branch TEXT NOT NULL,

    current_year SMALLINT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_user
ON student_profiles(user_id);

-- =========================================================
-- UPDATE ENROLLMENTS
-- =========================================================

ALTER TABLE enrollments
ADD COLUMN IF NOT EXISTS study_mode study_mode
NOT NULL DEFAULT 'offline';

-- =========================================================
-- UPDATE CERTIFICATIONS
-- =========================================================

ALTER TABLE certifications
ADD COLUMN IF NOT EXISTS certificate_url TEXT;

ALTER TABLE certifications
ADD COLUMN IF NOT EXISTS verification_code TEXT UNIQUE;

ALTER TABLE certifications
ADD COLUMN IF NOT EXISTS issued_by UUID
REFERENCES users(id);

ALTER TABLE certifications
ADD COLUMN IF NOT EXISTS is_active BOOLEAN
NOT NULL DEFAULT TRUE;

COMMIT;