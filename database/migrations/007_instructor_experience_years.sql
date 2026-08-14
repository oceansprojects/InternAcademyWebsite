-- Migration: 007_instructor_experience_years.sql
-- Adds experience_years column to the faculty table.
-- Non-destructive: existing rows get NULL.

ALTER TABLE faculty
ADD COLUMN IF NOT EXISTS experience_years INT;

COMMENT ON COLUMN faculty.experience_years IS
  'Number of years of professional experience. NULL means not specified.';
