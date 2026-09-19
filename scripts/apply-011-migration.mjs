import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Read .env file
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [key, ...vals] = line.split('=');
      return [key.trim(), vals.join('=').trim().replace(/^["']|["']$/g, '')];
    })
);

const url = envVars.NEON_DATABASE_URL || envVars.DATABASE_URL;
if (!url) {
  console.error('NEON_DATABASE_URL or DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = neon(url);

async function run() {
  console.log('--- Applying Migration 011: Student Professional Profile ---');

  // 1. Enums
  console.log('1. Creating ENUMs...');
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_years') THEN
        CREATE TYPE experience_years AS ENUM ('0-1','1-2','2-3','3-5','5-8','8+');
      END IF;
    END $$;
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
        CREATE TYPE job_type AS ENUM ('internship','job','freelance');
      END IF;
    END $$;
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'edu_stream') THEN
        CREATE TYPE edu_stream AS ENUM (
          'engineering','arts','commerce','science','mba','law','medicine','other'
        );
      END IF;
    END $$;
  `;
  await sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'edu_branch') THEN
        CREATE TYPE edu_branch AS ENUM (
          'cs','it','ece','eee','mechanical','civil','chemical','other'
        );
      END IF;
    END $$;
  `;

  // 2. Extend student_profiles
  console.log('2. Extending student_profiles table...');
  await sql`
    ALTER TABLE student_profiles
      ADD COLUMN IF NOT EXISTS full_name          TEXT,
      ADD COLUMN IF NOT EXISTS profile_photo_url  TEXT,
      ADD COLUMN IF NOT EXISTS email              TEXT,
      ADD COLUMN IF NOT EXISTS phone_number       TEXT,
      ADD COLUMN IF NOT EXISTS whatsapp_number    TEXT,
      ADD COLUMN IF NOT EXISTS address_state      TEXT,
      ADD COLUMN IF NOT EXISTS address_city       TEXT,
      ADD COLUMN IF NOT EXISTS address_nation     TEXT,
      ADD COLUMN IF NOT EXISTS tech_stack         TEXT[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS years_experience   experience_years;
  `;

  // 3. Education table
  console.log('3. Creating student_education table...');
  await sql`
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
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_student_education_student ON student_education (student_id);
  `;

  // 4. Jobs table
  console.log('4. Creating student_jobs table...');
  await sql`
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
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_student_jobs_student ON student_jobs (student_id);
  `;

  // 5. Projects table
  console.log('5. Creating student_projects table...');
  await sql`
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
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_student_projects_student ON student_projects (student_id);
  `;

  // 6. Achievements table
  console.log('6. Creating student_achievements table...');
  await sql`
    CREATE TABLE IF NOT EXISTS student_achievements (
      id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id   UUID        NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
      title        TEXT        NOT NULL,
      description  TEXT,
      date         DATE,
      organization TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_student_achievements_student ON student_achievements (student_id);
  `;

  // 7. Certificates table
  console.log('7. Creating student_certificates table...');
  await sql`
    CREATE TABLE IF NOT EXISTS student_certificates (
      id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id       UUID        NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
      title            TEXT        NOT NULL,
      issuing_org      TEXT        NOT NULL,
      issue_date       DATE,
      certificate_link TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_student_certificates_student ON student_certificates (student_id);
  `;

  console.log('\n--- Migration Applied Successfully! ---');

  // Verification & data inspection
  console.log('\nVerifying database schema...');
  const studentProfileCols = await sql`
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_name = 'student_profiles'
    ORDER BY ordinal_position
  `;
  console.log(`student_profiles column count: ${studentProfileCols.length}`);
  console.log('Columns:', studentProfileCols.map((c) => `${c.column_name} (${c.udt_name})`).join(', '));

  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_name IN (
      'student_profiles',
      'student_education',
      'student_jobs',
      'student_projects',
      'student_achievements',
      'student_certificates'
    )
  `;
  console.log('\nExisting professional profile tables:', tables.map((t) => t.table_name).join(', '));

  // Check student_profiles records
  const existingProfiles = await sql`
    SELECT id, user_id, full_name, mobile_number, college_name, tech_stack, years_experience
    FROM student_profiles
    LIMIT 5
  `;
  console.log(`\nExisting student profiles found in DB: ${existingProfiles.length}`);
  if (existingProfiles.length > 0) {
    console.log('Sample profiles:', JSON.stringify(existingProfiles, null, 2));
  }
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
